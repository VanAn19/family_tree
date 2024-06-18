'use strict'

const cloudinary = require('../configs/cloudinary.config');

// 1. upload from url image
const uploadImageFromUrl = async () => {
    try {
        const urlImage = 'https://images.unsplash.com/photo-1718185892685-adf47dc1ba5c?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
        const folderName = 'user/userId', newFileName = 'testdemo';
        const result = await cloudinary.uploader.upload(urlImage, {
            public_id: newFileName,
            folder: folderName
        });
        return result;
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}

// 2. upload from image local
const uploadImageFromLocal = async ({ path, folderName = 'user/1' }) => {
    try {
        const result = await cloudinary.uploader.upload(path, {
            public_id: 'thumb',
            folder: folderName
        });
        return {
            image_url: result.secure_url,
            userId: 1
        }
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}

module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal
}