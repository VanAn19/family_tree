'use strict'

const { User } = require('../models');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response");
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { findByUsername } = require('./user.service');
const { Sequelize } = require('sequelize');

class AccessService {

    static handlerRefreshToken = async ({ refreshToken, user, keyStore }) => {
        const { userId, username } = user;
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId);
            throw new ForbiddenError('Something wrong happened! Please relogin');
        }
        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('User is not register');
        const foundUser = await findByUsername({username});
        const tokens = await createTokenPair({ userId: foundUser.id, username }, keyStore.publicKey, keyStore.privateKey);
        await keyStore.update({
            refreshToken: tokens.refreshToken,
            refreshTokensUsed: Sequelize.fn('JSON_ARRAY_APPEND', Sequelize.col('refreshTokensUsed'), '$', refreshToken)
        }, {
            where: {
                user: userId
            }
        });
        return {
            user,
            tokens
        }
    }

    static logout = async (keyStore) => {
        console.log(keyStore.id);
        return await KeyTokenService.removeKeyById(keyStore.id);
    }

    static login = async ({ username, password, refreshToken = null }) => {
        const foundUser = await findByUsername({username});
        if (!foundUser) throw new BadRequestError('User is not registered');
        const match = await bcrypt.compare(password, foundUser.password);
        if (!match) throw new AuthFailureError('Authentication error');
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');
        const tokens = await createTokenPair({ userId: foundUser.id, username }, publicKey, privateKey);
        await KeyTokenService.createKeyToken({
            userId: foundUser.id,
            refreshToken: tokens.refreshToken,
            publicKey,
            privateKey
        });
        return {
            user: getInfoData({ fields: ['id', 'name', 'email'], object: foundUser}),
            tokens
        }
    }
    
    static signUp = async ({ username, password, name, email }) => {
        try {
            const holderUser = await User.findOne({ where: { username: username } });
            if (holderUser) throw new BadRequestError('Error: Username already registered!');
            const passwordHash = await bcrypt.hash(password, 10);
            const newUser = await User.create({ username, password: passwordHash, name, email });
            if (newUser) {
                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newUser.id,
                    publicKey,
                    privateKey
                });
                if (!keyStore) {
                    return {
                        code: 'xxxx',
                        message: 'keyStore error'
                    }
                }
                const tokens = await createTokenPair({ userId: newUser.id, username }, publicKey, privateKey);
                return {
                    user: getInfoData({ fields: ['id', 'name', 'email'], object: newUser}),
                    tokens
                } 
            }
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService;