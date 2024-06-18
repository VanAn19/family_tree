'use strict'

const { sequelize } = require('../models');

const findAllMemberByFamilyTreeId = async ({ familyTreeId }) => {
    const members = await sequelize.query("SELECT * FROM familymembers WHERE familyTreeId = :familyTreeId", {
        type: sequelize.QueryTypes.SELECT,
        replacements: { familyTreeId }
    });
    return members
}
    
module.exports = { 
    findAllMemberByFamilyTreeId 
};