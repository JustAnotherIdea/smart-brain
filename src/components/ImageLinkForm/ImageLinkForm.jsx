import React, { useRef } from "react";
import { getAllModels } from '../../config/models';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onFileSelect, onSubmit, onModelSelect, selectedModel }) => {
    const fileInputRef = useRef(null);
    const models = getAllModels();

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
                    <select 
                        className="model-select"
                        value={selectedModel}
                        onChange={(e) => onModelSelect(e.target.value)}
                    >
                        {models.map(model => (
                            <option key={model.id} value={model.id}>
                                {model.name}
                            </option>
                        ))}
                    </select>
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