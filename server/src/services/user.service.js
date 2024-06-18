'use strict'

const { User } = require('../models');

const findByUsername = async ({ username, select = ['id', 'username', 'password', 'name', 'email']}) => {
    return await User.findOne({ 
        where: {username},
        attributes: select 
    });
}

module.exports = {
    findByUsername
}