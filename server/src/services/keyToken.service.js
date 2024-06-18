'use strict'

const { KeyToken } = require('../models');

class KeyTokenService {

    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            const filter = { user: userId }, update = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            }; 
            let tokens = await KeyToken.findOne({ where: filter });
            if (tokens) {
                await tokens.update(update);
            } else {
                tokens = await KeyToken.create({
                    user: userId,
                    publicKey,
                    privateKey,
                    refreshTokensUsed: [],
                    refreshToken
                });
            }
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            console.log(error);
            return error
        }
    }

    static findByUserId = async (userId) => {
        return await KeyToken.findOne({ where: {user: userId} });
    }

    static removeKeyById = async (id) => {
        return await KeyToken.destroy({ where: {id} });
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await KeyToken.findOne({ where: { refreshTokensUsed: refreshToken } });
    }

    static findByRefreshToken = async (refreshToken) => {
        return await KeyToken.findOne({ where: { refreshToken } });
    }

    static deleteKeyById = async (userId) => {
        return await KeyToken.destroy({ where: { user: userId } });;
    }

}

module.exports = KeyTokenService