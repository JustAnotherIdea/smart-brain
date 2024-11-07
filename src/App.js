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
    input: '',
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
        this.state = initialState;
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

    calcFaceLoc = (data) => {
        console.log('Face detection response:', data);
        
        if (!data?.outputs?.[0]?.data?.regions) {
            console.log('No face regions found in response');
            return [];
        }
        
        const image = document.getElementById("imageDetect");
        const width = Number(image.width);
        const height = Number(image.height);
        const boxArr = [];
        
        for(let i = 0; i < data.outputs[0].data.regions.length; i++) {
            let face = data.outputs[0].data.regions[i].region_info.bounding_box;
            boxArr.push({
                leftCol: face.left_col * width,
                topRow: face.top_row * height,
                rightCol: width - face.right_col * width,
                bottomRow: height - face.bottom_row * height
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

    onSubmit = async (event) => {
        this.setState({imageUrl: this.state.input});
        this.setState({boxes: []});
        
        try {
            const response = await fetch("https://smart-brain-api-new.onrender.com/imageurl", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({url: this.state.input})
            });
            
            const result = await response.json();
            console.log('API Response:', result);
            
            if (result && result.status && result.status.description !== "Failure") {
                try {
                    const imageResponse = await fetch('https://smart-brain-api-new.onrender.com/image', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            id: this.state.user.id
                        })
                    });
                    
                    const count = await imageResponse.json();
                    this.setState(Object.assign(this.state.user, {entries: count}));
                    
                    if (result.outputs && result.outputs[0]?.data?.regions) {
                        const boxes = this.calcFaceLoc(result);
                        this.displayFaceBox(boxes);
                    } else {
                        console.log('No faces detected in the image');
                        this.setState({boxes: []});
                    }
                } catch (err) {
                    console.error('Error updating entry count:', err);
                }
            } else {
                console.error('Face detection failed:', result);
            }
        } catch (error) {
            console.error('Error detecting faces:', error);
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
                                    <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
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
