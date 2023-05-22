import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import ParticlesBackground from './components/ParticlesBackground/ParticlesBackground';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

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
        }
    }

    onInputChange = (event) => {
        IMAGE_URL = event.target.value;
        buildRequestOptions(IMAGE_URL);
    }

    onSubmit = (event) => {
        this.setState({imageUrl: IMAGE_URL});
        console.log('click');
        fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
            .then(response => response.json())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    render(){
        return (
            <div className="App">
            <ParticlesBackground />
            <Navigation />
            <Logo />
            <Rank />
            <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
            <FaceRecognition imageUrl={IMAGE_URL}/>
            </div>
        );
    }
}

export default App;
