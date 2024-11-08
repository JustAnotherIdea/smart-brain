import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import ParticlesBackground from './components/ParticlesBackground/ParticlesBackground';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

const initialState = {
    selectedFile: null,
    imageUrl: '',
    boxes: [],
    route: 'signin',
    isSignedIn: false,
    user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',
    }
}

class App extends Component {
    constructor() {
        super();
        this.state = {
            ...initialState,
            token: null
        };
    }

    componentDidMount() {
        // Check for token in URL (Google OAuth callback)
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
            this.handleAuthToken(token);
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            // Check for stored token
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                this.handleAuthToken(storedToken);
            }
        }
    }

    handleAuthToken = (token) => {
        localStorage.setItem('token', token);
        this.setState({ token });
        this.fetchUserProfile(token);
    }

    fetchUserProfile = async (token) => {
        try {
            const response = await fetch('https://master.smart-brain-api.c66.me/profile/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const user = await response.json();
            if (user.id) {
                this.loadUser(user);
                this.onRouteChange('home');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            this.handleSignOut();
        }
    }

    handleSignOut = () => {
        localStorage.removeItem('token');
        this.setState(initialState);
        this.onRouteChange('signout');
    }

    /*checkImage = (url) => {
        const img = new Image();
        img.src = url;
        return new Promise((resolve) => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
        });
      }*/

    loadUser = (data) => {
        this.setState({user: {
            id: data.id,
            name: data.name,
            email: data.email,
            entries: data.entries,
            joined: data.entries,
        }});
    }

    calcTextRegions = (data) => {
        console.log('OCR detection response:', data);
        
        if (!data?.outputs?.[0]?.data?.regions) {
            console.log('No text regions found in response');
            return [];
        }
        
        const image = document.getElementById("imageDetect");
        const width = Number(image.width);
        const height = Number(image.height);
        const boxArr = [];
        
        for(let i = 0; i < data.outputs[0].data.regions.length; i++) {
            let region = data.outputs[0].data.regions[i].region_info.bounding_box;
            boxArr.push({
                leftCol: region.left_col * width,
                topRow: region.top_row * height,
                rightCol: width - region.right_col * width,
                bottomRow: height - region.bottom_row * height,
                text: data.outputs[0].data.regions[i].data.text.raw
            });
        }
        return boxArr;
    }

    displayFaceBox = (boxes) => {
        this.setState({boxes: boxes});
    }

    onInputChange = (event) => {
        this.setState({input: event.target.value});
    }

    onSubmit = async () => {
        if (!this.state.selectedFile) {
            console.log('No file selected');
            return;
        }

        this.setState({boxes: []});
        
        try {
            const response = await fetch("https://master.smart-brain-api.c66.me/imageupload", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.state.token}`
                },
                body: JSON.stringify({
                    imageData: this.state.selectedFile
                })
            });
            
            const result = await response.json();
            console.log('API Response:', result);
            
            if (result && result.status && result.status.description !== "Failure") {
                try {
                    const imageResponse = await fetch('https://master.smart-brain-api.c66.me/increment', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            id: this.state.user.id
                        })
                    });
                    
                    const count = await imageResponse.json();
                    this.setState(Object.assign(this.state.user, {entries: count}));
                    
                    if (result.outputs && result.outputs[0]?.data?.regions) {
                        const boxes = this.calcTextRegions(result);
                        this.displayFaceBox(boxes);
                    } else {
                        console.log('No text detected in the image');
                        this.setState({boxes: []});
                    }
                } catch (err) {
                    console.error('Error updating entry count:', err);
                }
            } else {
                console.error('Text detection failed:', result);
            }
        } catch (error) {
            console.error('Error detecting text:', error);
        }
    }

    onRouteChange = (route) => {
        if(route === 'signout') {
            this.setState(initialState);
            // IMAGE_URL = '';
        } else if(route === 'home') {
            this.setState({isSignedIn: true});
        }
        this.setState({route: route});
    }

    onFileSelect = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            // The result attribute contains the base64 string
            const base64String = reader.result.split(',')[1];
            this.setState({ 
                selectedFile: base64String,
                imageUrl: URL.createObjectURL(file)
            });
        };
        reader.readAsDataURL(file);
    }

    render(){
        const { isSignedIn, route, boxes, imageUrl, user } = this.state;
        return (
            <div className="App">
                <ParticlesBackground />
                <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
                {/* shuld probably make this a function https://stackoverflow.com/questions/46592833/how-to-use-switch-statement-inside-a-react-component */}
                {
                    {
                        'home': <div>
                                    <Logo />
                                    <Rank name={user.name} entries={user.entries} />
                                    <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit} onFileSelect={this.onFileSelect}/>
                                    <FaceRecognition boxes={boxes} imageUrl={imageUrl} handleKeypress={this.handleKeypress}/>
                                </div>,
                        'signin': <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} handleKeypress={this.handleKeypress}/>,
                        'signout': <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} handleKeypress={this.handleKeypress}/>,
                        'register': <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} handleKeypress={this.handleKeypress}/>
                    }[route]
                }
            </div>
        );
    }
}

export default App;
