'use strict'

const { sequelize } = require('../models');
const { FamilyMember } = require('../models');
const { Op } = require('sequelize');

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

const deleteDescendants = async (member) => {
    const childrenIds = member.childrenId ? JSON.parse(member.childrenId) : [];
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
            await deleteDescendants(child); 
            await child.destroy();
        }
    }
}
    
module.exports = { 
    findAllMemberByFamilyTreeId,
    getAvatarById,
    deleteDescendants
};