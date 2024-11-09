import React, { useRef } from "react";
import './ImageLinkForm.css';

const ImageLinkForm = ({ 
    onFileSelect, 
    onSubmit, 
    modelTypes, 
    selectedModelType,
    models,
    selectedModel,
    onModelTypeSelect,
    onModelSelect,
    onModelSearch 
}) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div className="image-form-container">
            <p className="form-text">Upload an image to detect text</p>
            <div className="form-wrapper">
                <div className="input-group">
                    <select 
                        className="model-type-select"
                        value={selectedModelType}
                        onChange={(e) => onModelTypeSelect(e.target.value)}
                    >
                        {modelTypes.map(type => (
                            <option key={type.type} value={type.type}>
                                {type.type}
                            </option>
                        ))}
                    </select>
                    
                    <input 
                        type="text"
                        className="model-search"
                        placeholder="Search models..."
                        onChange={(e) => onModelSearch(e.target.value)}
                    />
                    
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
                    
                    <button className="detect-button" onClick={onSubmit}>
                        Detect
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;