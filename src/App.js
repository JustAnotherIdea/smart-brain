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
import { processImage } from './utils/imageProcessing';

const initialState = {
    selectedFile: null,
    imageUrl: '',
    boxes: [],
    route: 'signin',
    isSignedIn: false,
    isLoading: false,
    user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',
    }
}

const authenticatedFetch = async (url, options = {}) => {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    
    if (response.status === 401) {
        // Token expired
        localStorage.removeItem('token');
        window.location.href = '/signin';
        throw new Error('Session expired');
    }
    
    return response;
};

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
            const response = await authenticatedFetch('https://master.smart-brain-api.c66.me/profile/me');
            if (response.status === 401) {  // Unauthorized - token expired
                this.handleSignOut();
                return;
            }
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

        this.setState({ boxes: [], isLoading: true });
        
        try {
            const response = await authenticatedFetch("https://master.smart-brain-api.c66.me/imageupload", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: this.state.imageType,
                    data: this.state.selectedFile
                })
            });
            
            const result = await response.json();
            console.log('API Response:', result);
            
            if (result && result.status && result.status.description !== "Failure") {
                try {
                    const imageResponse = await authenticatedFetch('https://master.smart-brain-api.c66.me/increment', {
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
            if (error.message === 'Session expired') return;
            console.error('Error detecting text:', error);
        } finally {
            this.setState({ isLoading: false });
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

    onFileSelect = async (file) => {
        try {
            // Clear boxes when new file is selected
            this.setState({ boxes: [] });
            
            const processedImage = await processImage(file);
            this.setState({ 
                selectedFile: processedImage.data,
                imageType: processedImage.type,
                imageUrl: URL.createObjectURL(file)
            });
        } catch (error) {
            console.error('Error processing image:', error);
        }
    }

    render(){
        const { isSignedIn, route, boxes, imageUrl, user } = this.state;
        return (
            <div className="App">
                <ParticlesBackground />
                <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
                {
                    {
                        'home': <div className="main-container">
                                    <Rank name={user.name} entries={user.entries} />
                                    <ImageLinkForm 
                                        onInputChange={this.onInputChange} 
                                        onSubmit={this.onSubmit} 
                                        onFileSelect={this.onFileSelect}
                                    />
                                    <FaceRecognition 
                                        boxes={boxes} 
                                        imageUrl={imageUrl}
                                        isLoading={this.state.isLoading}
                                    />
                                </div>,
                        'signin': <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />,
                        'signout': <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />,
                        'register': <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                    }[route]
                }
            </div>
        );
    }
}

export default App;
