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

const PAT = '6673d9ccf9ca477b8b74eb0e1379a1e1';
const USER_ID = 'beel5zfvt7ky';       
const APP_ID = 'test';
const MODEL_ID = 'face-detection';   
let IMAGE_URL = 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFyZ2UlMjBjcm93ZHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80';

let raw = {
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
};

const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: JSON.stringify(raw)
};

function buildRequestOptions(url) {
    raw.inputs[0].data.image.url = url;
    requestOptions.body = JSON.stringify(raw);
}

class App extends Component {
    constructor() {
        super();
        this.state = {
            input: '',
            box: {},
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
    }

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
        const face = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById("imageDetect");
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftCol: face.left_col * width,
            topRow: face.top_row * height,
            rightCol: width - face.right_col * width,
            bottomRow: height - face.bottom_row * height
        }
    }

    displayFaceBox = (box) => {
        this.setState({box: box});
    }

    onInputChange = (event) => {
        IMAGE_URL = event.target.value;
        buildRequestOptions(IMAGE_URL);
    }

    onSubmit = (event) => {
        this.setState({imageUrl: IMAGE_URL});
        fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
            .then(response => response.json())
            .then(result => {
                fetch('http://localhost:3000/image', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        id: this.state.user.id
                    })
                })
                    .then(response => response.json())
                    .then(count => {
                        this.setState(Object.assign(this.state.user, {entries: count}));
                    })
                console.log(result);
                this.displayFaceBox(this.calcFaceLoc(result))
            })
            .catch(error => console.log('error', error));
    }

    onRouteChange = (route) => {
        if(route === 'signout') {
            this.setState({isSignedIn: false});
        } else if(route === 'home') {
            this.setState({isSignedIn: true});
        }
        this.setState({route: route});
    }

    render(){
        const { isSignedIn, route, box } = this.state;
        return (
            <div className="App">
                <ParticlesBackground />
                <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
                {/* shuld probably make this a function https://stackoverflow.com/questions/46592833/how-to-use-switch-statement-inside-a-react-component */}
                {
                    {
                        'home': <div>
                                    <Logo />
                                    <Rank name={this.state.user.name} entries={this.state.user.entries} />
                                    <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
                                    <FaceRecognition box={box} imageUrl={IMAGE_URL}/>
                                </div>,
                        'signin': <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>,
                        'signout': <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>,
                        'register': <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                    }[route]
                }

                {/* Andrie's method { route === 'home'
                ?   <div>
                        <Logo />
                        <Rank />
                        <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
                        <FaceRecognition box={box} imageUrl={IMAGE_URL}/>
                    </div>
                :   (
                        route === 'signin'
                        ? <SignIn onRouteChange={this.onRouteChange}/>
                        : <Register onRouteChange={this.onRouteChange}/>
                    )
                
                } */}
            </div>
        );
    }
}

export default App;
