'use strict'

const _ = require('lodash');
const nodemailer = require('nodemailer');
const { asyncHandler } = require('../helpers/asyncHandler');

const getInfoData = ({ fields = [], object = {} }) => {
    if (Array.isArray(object)) {
        return object.map(item => _.pick(item, fields));
    }
    return _.pick(object, fields);
}

const sendMail = async ({ email, html }) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_NAME, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Ezpics" <no-relply@ezpics.vn>', // sender address
        to: email, // list of receivers
        subject: "Forgot password", // Subject line
        html: html, // html body
    });

    return info;
}

module.exports = {
    getInfoData,
    sendMail
}