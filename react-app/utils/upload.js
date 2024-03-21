import axios from 'axios';
import { getBaseUrl } from './url';

const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await axios.post( getBaseUrl() +'/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Upload successful:', response.data);
        // Assuming the server response includes the file URL in response.data.fileUrl
        //alert('Image uploaded successfully!');
        return response.data.fileUrl; // Return the file URL
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image.');
        throw error; // Rethrow the error if needed or handle it as per your application's error handling policy
    }
};

const uploadAudio = async (file) => {
    const formData = new FormData();
    formData.append('audio', file);

    try {
        const response = await axios.post(  getBaseUrl() +'/upload-audio', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Upload successful:', response.data);
        // Assuming the server response includes the file URL in response.data.fileUrl
        //alert('Audio uploaded successfully!');
        return response.data.fileUrl; // Return the file URL
    } catch (error) {
        console.error('Error uploading audio:', error);
        alert('Failed to upload audio.');
        throw error; // Rethrow the error if needed or handle it as per your application's error handling policy
    }
};

export { uploadImage, uploadAudio };
