import React from "react";
import Loading from '../Loading/Loading';
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl, boxes, isLoading, modelType = ''}) => {
    const shouldShowText = (text) => {
        return text && text.trim() !== '' && text !== 'BINARY_POSITIVE';
    };

    const getBoxClassName = () => {
        switch(modelType) {
            case 'image-color-recognizer':
                return 'color-box';
            case 'image-to-text':
                return 'caption-box';
            default:
                return 'bounding-box';
        }
    };

    const getColorFromText = (text) => {
        // Extract hex color from text like "Red (#FF0000) (25%)"
        const match = text.match(/#[0-9A-F]{6}/i);
        return match ? match[0] : 'transparent';
    };

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
                            className={getBoxClassName()} 
                            style={{
                                top: box.topRow, 
                                right: box.rightCol, 
                                bottom: box.bottomRow, 
                                left: box.leftCol,
                                ...(modelType === 'image-color-recognizer' && {
                                    backgroundColor: getColorFromText(box.text),
                                    opacity: 0.7
                                })
                            }}
                        >
                            {shouldShowText(box.text) && (
                                <span className={`detected-text ${modelType}`}>{box.text}</span>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default FaceRecognition;