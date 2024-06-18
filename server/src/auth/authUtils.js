'use strict'

const jwt = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-token-id'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await jwt.sign(payload, publicKey, {
            expiresIn: '2d'
        });
        const refreshToken = await jwt.sign(payload, privateKey, {
            expiresIn: '365d'
        });
        return { accessToken, refreshToken }
    } catch (error) {
        
    }
}

const authentication = asyncHandler(async (req,res,next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError('Invalid request');
    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError('Not found keyStore');
    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN];
            const decodeUser = jwt.verify(refreshToken, keyStore.privateKey);
            if (parseInt(userId, 10) !== decodeUser.userId) throw new AuthFailureError('Invalid userId');
            req.keyStore = keyStore;
            req.user = decodeUser;   // {userId, username}
            req.refreshToken = refreshToken;
            return next();
        } catch (error) {
            throw error
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError('Invalid request');
    try {
        const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
        if (parseInt(userId, 10) !== decodeUser.userId) throw new AuthFailureError('Invalid userId');
        req.keyStore = keyStore;
        req.user = decodeUser;
        return next();
    } catch (error) {
        console.log(error);
        throw error
    }
});

module.exports = {
    createTokenPair,
    authentication
}