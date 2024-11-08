const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // Reduced to 10MB
const MAX_DIMENSION = Math.sqrt(42500000); // Reduced to sqrt of 42.5 megapixels (half of 85)

const resizeImage = (file) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        
        img.onload = () => {
            URL.revokeObjectURL(img.src);
            
            let width = img.width;
            let height = img.height;
            
            // Scale down dimensions by 50%
            width = width * 0.5;
            height = height * 0.5;
            
            // Check if still exceeds MAX_DIMENSION
            if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                if (width > height) {
                    height = (height / width) * MAX_DIMENSION;
                    width = MAX_DIMENSION;
                } else {
                    width = (width / height) * MAX_DIMENSION;
                    height = MAX_DIMENSION;
                }
            }
            
            // Check for total pixels
            if (width * height > 42500000) { // Half of original limit
                const scale = Math.sqrt(42500000 / (width * height));
                width *= scale;
                height *= scale;
            }
            
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(width);
            canvas.height = Math.round(height);
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, Math.round(width), Math.round(height));
            
            canvas.toBlob((blob) => {
                resolve(new File([blob], file.name, {
                    type: file.type
                }));
            }, file.type, 0.85); // Slightly reduced quality for smaller file size
        };
    });
};

export const processImage = async (file) => {
    // First resize if needed
    const resizedFile = await resizeImage(file);
    
    if (resizedFile.size <= MAX_IMAGE_SIZE) {
        return {
            type: 'base64',
            data: await fileToBase64(resizedFile)
        };
    }

    // For large files, we need to upload to a hosting service
    // and return the public URL
    const formData = new FormData();
    formData.append('file', resizedFile);
    
    try {
        const response = await fetch('https://master.smart-brain-api.c66.me/upload', {
            method: 'POST',
            body: formData
        });
        const { url } = await response.json();
        return {
            type: 'url',
            data: url
        };
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};
