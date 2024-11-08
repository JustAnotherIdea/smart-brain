const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB in bytes
const MAX_DIMENSION = Math.sqrt(85000000); // sqrt of 85 megapixels

const resizeImage = (file) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        
        img.onload = () => {
            URL.revokeObjectURL(img.src);
            
            let width = img.width;
            let height = img.height;
            
            // Check if either dimension exceeds MAX_DIMENSION
            if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                if (width > height) {
                    height = (height / width) * MAX_DIMENSION;
                    width = MAX_DIMENSION;
                } else {
                    width = (width / height) * MAX_DIMENSION;
                    height = MAX_DIMENSION;
                }
            }
            
            // Additional check for total pixels
            if (width * height > 85000000) {
                const scale = Math.sqrt(85000000 / (width * height));
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
            }, file.type, 0.9);
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
