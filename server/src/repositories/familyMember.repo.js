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

const calculateAge = (dateOfBirth, isAlive, deathOfBirth) => {
    let birthDayAge;
    const currentDate = new Date();

    try {
        if (dateOfBirth.includes('/')) {
            const birthDateParts = dateOfBirth.split('/');
            if (birthDateParts.length === 2) {
                // chỉ có tháng và năm sinh
                const birthMonth = parseInt(birthDateParts[0]) - 1;
                const birthYear = parseInt(birthDateParts[1]);
                const birthDate = new Date(birthYear, birthMonth);

                if (isAlive === 'true') {
                    birthDayAge = currentDate.getFullYear() - birthDate.getFullYear() + 1;
                    // nếu chưa sinh nhật thì -1
                    if (birthMonth > currentDate.getMonth()) {
                        birthDayAge--;
                    }
                } else if (deathOfBirth) {
                    const deathDateParts = deathOfBirth.split('/');
                    const deathMonth = parseInt(deathDateParts[0]) - 1;
                    const deathYear = parseInt(deathDateParts[1]);
                    const deathDate = new Date(deathYear, deathMonth);

                    birthDayAge = deathDate.getFullYear() - birthDate.getFullYear() + 1;
                    // nếu chưa sinh nhật thì -1
                    if (deathMonth > birthMonth) {
                        birthDayAge--;
                    }
                }
            } else if (birthDateParts.length === 3) {
                // có ngày, tháng và năm sinh
                const birthDay = parseInt(birthDateParts[0]);
                const birthMonth = parseInt(birthDateParts[1]) - 1;
                const birthYear = parseInt(birthDateParts[2]);
                const birthDate = new Date(birthYear, birthMonth, birthDay);

                if (isAlive === 'true') {
                    birthDayAge = currentDate.getFullYear() - birthDate.getFullYear() + 1;
                    // nếu chưa sinh nhật thì -1
                    if (birthMonth > currentDate.getMonth() || (birthMonth === currentDate.getMonth() && birthDay > currentDate.getDate())) {
                        birthDayAge--;
                    }
                } else if (deathOfBirth) {
                    const deathDateParts = deathOfBirth.split('/');
                    const deathDay = parseInt(deathDateParts[0]);
                    const deathMonth = parseInt(deathDateParts[1]) - 1;
                    const deathYear = parseInt(deathDateParts[2]);
                    const deathDate = new Date(deathYear, deathMonth, deathDay);

                    birthDayAge = deathDate.getFullYear() - birthDate.getFullYear() + 1;
                    // nếu chưa sinh nhật thì -1
                    if (deathMonth > birthMonth || (deathMonth === birthMonth && deathDay >= birthDay)) {
                        birthDayAge--;
                    }
                }
            }
        } else {
            // chỉ có năm sinh
            const birthYear = parseInt(dateOfBirth);

            if (!isNaN(birthYear)) {
                if (isAlive === 'true') {
                    birthDayAge = currentDate.getFullYear() - birthYear + 1;
                } else if (deathOfBirth) {
                    const deathYear = parseInt(deathOfBirth.split('/')[2]);
                    if (!isNaN(deathYear)) {
                        birthDayAge = deathYear - birthYear;
                    }
                }
            }
        }
    } catch (error) {
        console.error(error);
    }

    if (birthDayAge !== undefined && birthDayAge !== null && birthDayAge <= 0) {
        birthDayAge = 1;
    }

    return birthDayAge;
}
    
module.exports = { 
    findAllMemberByFamilyTreeId,
    getAvatarById,
    deleteDescendants,
    calculateAge
};