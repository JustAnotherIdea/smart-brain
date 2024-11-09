import React, { useRef } from "react";
import './ImageLinkForm.css';

const ImageLinkForm = ({ 
    onFileSelect, 
    onSubmit, 
    modelTypes = [],
    selectedModelType = '',
    models = [],
    selectedModel = '',
    onModelTypeSelect,
    onModelSelect,
    onModelSearch 
}) => {
    const fileInputRef = useRef(null);

    const getInstructionText = () => {
        switch(selectedModelType) {
            case 'image-color-recognizer':
                return 'Upload an image to analyze its colors';
            case 'image-to-text':
                return 'Upload an image to generate a description';
            default:
                return 'Upload an image to detect text';
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div className="image-form-container">
            <p className="form-text">{getInstructionText()}</p>
            <div className="form-wrapper">
                <div className="input-group">
                    <div className="model-selection-group">
                        {modelTypes.length > 0 && (
                            <select 
                                className="model-type-select"
                                value={selectedModelType}
                                onChange={(e) => onModelTypeSelect(e.target.value)}
                            >
                                {modelTypes.map(type => (
                                    <option key={type.type} value={type.type}>
                                        {type.type.split('-').map(word => 
                                            word.charAt(0).toUpperCase() + word.slice(1)
                                        ).join(' ')}
                                    </option>
                                ))}
                            </select>
                        )}
                        
                        <input 
                            type="text"
                            className="model-search"
                            placeholder="Search models..."
                            onChange={(e) => onModelSearch(e.target.value)}
                        />
                        
                        {models.length > 0 && (
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
                        )}
                    </div>

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
                        disabled={!selectedModel || !models.length}
                    >
                        {selectedModelType === 'image-color-recognizer' ? 'Analyze' : 'Detect'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;