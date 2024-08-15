import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'desgvkdyj',
    api_key: '925413319338418',
    api_secret: 'LuELol8_Xcma7AYcV8--VSMBY4o',
});

const uploadFileToCloudinary = async (filePath) => {
    const fileUploaded = await cloudinary.uploader.upload(filePath, { resource_type: 'raw' });

    return fileUploaded;
};

export default uploadFileToCloudinary;