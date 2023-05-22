import React from "react";
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl}) => {
    return (
        <div className="center imageHolder">
            <img className="imageDetect" alt='' src={imageUrl}/>
        </div>
    )
}

export default FaceRecognition;