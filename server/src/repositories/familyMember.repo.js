'use strict'

const { sequelize } = require('../models');
const { FamilyMember } = require('../models');

const findAllMemberByFamilyTreeId = async ({ familyTreeId }) => {
    const members = await sequelize.query("SELECT * FROM familymembers WHERE familyTreeId = :familyTreeId", {
        type: sequelize.QueryTypes.SELECT,
        replacements: { familyTreeId }
    });
    return members
}

const getAvatarById = async ({ familyTreeId }) => {
    const members = await sequelize.query("SELECT id, gender, avatar FROM familymembers WHERE familyTreeId = :familyTreeId", {
        type: sequelize.QueryTypes.SELECT,
        replacements: { familyTreeId }
    });
    return members
}

const deleteDescendants = async ({ member, level = 0 }) => {
    if (!member || level > 1) {
        return; 
    }
    console.log("member.childrenId::::::", member.childrenId);
    const childrenIds = member.childrenId || [];
    if (childrenIds.length > 0) {
        const childrenMembers = await FamilyMember.findAll({
            where: {
                id: {
                    [Op.in]: childrenIds
                },
                familyTreeId: member.familyTreeId
            }
        });

        for (const child of childrenMembers) {
            await child.destroy();
            await deleteDescendants(child, level + 1); 
        }
    }
}
    
module.exports = { 
    findAllMemberByFamilyTreeId,
    getAvatarById,
    deleteDescendants
};