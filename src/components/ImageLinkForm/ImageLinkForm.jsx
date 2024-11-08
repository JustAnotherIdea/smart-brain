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
        <div>
            <p className="f3">
                {'This Magic Brain will detect text in your pictures. Give it a try'}
            </p>
            <div className="center">
                <div className="form center pa4 br3 shadow-5">
                    <input 
                        className="f4 pa2 w-70 center br3" 
                        type="file" 
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                    <button 
                        className="w-30 br3 ba b--black-20 grow f4 link ph3 pv2 dib white bg-light-purple" 
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