'use strict'

const express = require('express');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

router.post('/signup', asyncHandler(accessController.signUp));
router.post('/login', asyncHandler(accessController.login));
router.get('/forgot-password', asyncHandler(accessController.forgotPassword));
router.post('/reset-password', asyncHandler(accessController.resetPassword));

router.use(authentication)

router.post('/logout', asyncHandler(accessController.logout));
router.post('/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken));

module.exports = router;