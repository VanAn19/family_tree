'use strict'

const express = require('express');
const uploadController = require('../../controllers/upload.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const { uploadDisk } = require('../../configs/multer.config');
const router = express.Router();

router.use(authentication)

router.post('/user', asyncHandler(uploadController.uploadFile));
router.post('/user/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadFileThumb));

module.exports = router;