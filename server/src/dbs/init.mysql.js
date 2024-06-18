'use strict'

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('family_tree', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

const connectDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connect MySQL successfully');
    } catch (error) {
        console.error('Unable to connect MySQL');
    }
}

module.exports = connectDb