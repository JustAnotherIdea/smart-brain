const MODELS = {
    'face-detection': {
        id: 'face-detection',
        name: 'Face Detection',
        description: 'Detect faces in images'
    },
    'general-image-detection': {
        id: 'general-image-detection',
        name: 'General Image Detection',
        description: 'Detect general objects and concepts'
    },
    'objectness-detector': {
        id: 'objectness-detector',
        name: 'Object Detection',
        description: 'Detect presence of objects'
    },
    'logo-detection-v2': {
        id: 'logo-detection-v2',
        name: 'Logo Detection',
        description: 'Detect and identify logos'
    },
    'weapon-detection': {
        id: 'weapon-detection',
        name: 'Weapon Detection',
        description: 'Detect weapons in images'
    },
    'ocr-scene-english-paddleocr': {
        id: 'ocr-scene-english-paddleocr',
        name: 'Scene Text Detection',
        description: 'Detect text in natural scenes'
    },
    'ocr-document': {
        id: 'ocr-document',
        name: 'Document Text Detection',
        description: 'Detect text in documents'
    },
    'person-detection-efficientdet-lite': {
        id: 'person-detection-efficientdet-lite',
        name: 'Person Detection',
        description: 'Detect people in images'
    }
};

export const getModelById = (id) => MODELS[id];
export const getAllModels = () => Object.values(MODELS);
export const isValidModel = (id) => !!MODELS[id];
