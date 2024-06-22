'use strict'

const { sequelize } = require('../models');

const findAllFamilyTreeByUserId = async ({ userCreateId }) => {
    const familyTrees = await sequelize.query("SELECT * FROM familytrees WHERE userCreateId = :userCreateId", {
        type: sequelize.QueryTypes.SELECT,
        replacements: { userCreateId }
    });
    return familyTrees
}
    
module.exports = { 
    findAllFamilyTreeByUserId 
};