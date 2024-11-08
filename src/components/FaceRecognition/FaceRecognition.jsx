import React from "react";
import Loading from '../Loading/Loading';
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl, boxes, isLoading}) => {
    return (
        <div className="image-recognition-container">
            <div className="image-wrapper">
                {imageUrl && <img id="imageDetect" alt='' src={imageUrl}/>}
                {isLoading ? (
                    <div className="loading-overlay">
                        <Loading />
                    </div>
                ) : (
                    boxes.map((box, index) => (
                        <div 
                            key={index} 
                            className="bounding-box" 
                            style={{
                                top: box.topRow, 
                                right: box.rightCol, 
                                bottom: box.bottomRow, 
                                left: box.leftCol
                            }}
                        >
                            <span className="detected-text">{box.text}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default FaceRecognition;