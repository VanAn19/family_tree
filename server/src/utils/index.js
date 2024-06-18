'use strict'

const _ = require('lodash');

const getInfoData = ({ fields = [], object = {} }) => {
    if (Array.isArray(object)) {
        return object.map(item => _.pick(item, fields));
    }
    return _.pick(object, fields);
}

module.exports = {
    getInfoData
}