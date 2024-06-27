'use strict'

const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const { uploadImageFromUrl, uploadImageFromLocal, getAvatar } = require("../services/upload.service");

class UploadController {

    uploadFile = async (req,res,next) => {
        new SuccessResponse({
            message: 'upload file successfully',
            metadata: await uploadImageFromUrl(),
        }).send(res);
    }

    // uploadFileThumb = async (req,res,next) => {
    //     const { file } = req
    //     if (!file) throw new BadRequestError('File missing');
    //     new SuccessResponse({
    //         message: 'upload file successfully',
    //         metadata: await uploadImageFromLocal({
    //             path: file.path
    //         }),
    //     }).send(res);
    // }
    uploadFileThumb = async (req,res,next) => {
        const { file } = req
        if (!file) throw new BadRequestError('File missing');
        new SuccessResponse({
            message: 'upload file successfully',
            metadata: await uploadImageFromLocal({
                path: file.path,
                id: req.user.userId
            }),
        }).send(res);
    }

    getAvatar = async (req,res,next) => {
        new SuccessResponse({
            message: 'get avatar member successfully',
            metadata: await getAvatar({
                familyTreeId: req.params.familyTreeId
            }),
        }).send(res);
    }
}

module.exports = new UploadController();