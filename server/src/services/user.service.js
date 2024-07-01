'use strict'

const { User } = require('../models');
const crypto = require('crypto')

const findByUsername = async ({ username, select = ['id', 'username', 'password', 'name', 'email']}) => {
    return await User.findOne({ 
        where: {username},
        attributes: select 
    });
}

const createPasswordChangedToken = () => {
    const resetToken = crypto.randomBytes(64).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000
    return resetToken
}

module.exports = {
    findByUsername,
    createPasswordChangedToken
}