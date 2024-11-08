import React, { useRef } from "react";
import './ImageLinkForm.css';

const ImageLinkForm = ({onFileSelect, onSubmit}) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div className="image-form-container">
            <p className="form-text">
                Upload an image to detect text
            </p>
            <div className="form-wrapper">
                <div className="input-group">
                    <input 
                        className="file-input" 
                        type="file" 
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                    <button 
                        className="detect-button" 
                        onClick={onSubmit}
                    >
                        Detect
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;