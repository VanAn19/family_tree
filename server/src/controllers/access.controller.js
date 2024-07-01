'use strict'

const AccessService = require('../services/access.service');
const { OK, CREATED, SuccessResponse } = require('../core/success.response');

class AccessController {

    forgotPassword = async (req,res,next) => {
        new SuccessResponse({
            message: 'Success',
            metadata: await AccessService.forgotPassword({ email: req.query.email })
        }).send(res);
    }

    resetPassword = async (req,res,next) => {
        new SuccessResponse({
            message: 'Success',
            metadata: await AccessService.resetPassword({ 
                password: req.body.password,
                token: req.body.token    
            })
        }).send(res);
    }

    handlerRefreshToken = async (req,res,next) => {
        new SuccessResponse({
            message: 'Get token success',
            metadata: await AccessService.handlerRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res);
    }

    logout = async (req,res,next) => {
        new SuccessResponse({
            message: 'Logout successfully',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res);
    }

    login = async (req,res,next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res);
    }

    signUp = async (req,res,next) => {
        new CREATED({
            message: 'Register OK!',
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }
}

module.exports = new AccessController();