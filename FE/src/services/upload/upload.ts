import axios from "axios";

export const uploadImage = async (image : FormData) => {
    try {
        const response = await axios.post('https://api.cloudinary.com/v1_1/dmpti8a7u/image/upload', image)
        return response.data.url;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}
