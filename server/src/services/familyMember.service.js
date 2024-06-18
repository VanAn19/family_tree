'use strict'

const { where } = require('sequelize');
const { BadRequestError, NotFoundError } = require('../core/error.response');
const { FamilyTree, FamilyMember } = require('../models');
const { Op } = require('sequelize');
const { findAllMemberByFamilyTreeId } = require('../repositories/familyMember.repo');

class FamilyMemberService {

    static addPartner = async (payload) => {
        const {
            familyTreeId, partnerId, name, citizenIdentification,
            dateOfBirth, gender, avatar, job, isAlive, deathOfBirth
        } = payload
        const members = await findAllMemberByFamilyTreeId({familyTreeId: familyTreeId});
        const ids = members.map(member => member.id);
        if (!ids.includes(partnerId)) throw new NotFoundError('Not found partner');
        // const existingPartner = await FamilyMember.findOne({ where: {partnerId: member.id} });
        // if (existingPartner) throw new BadRequestError('Partner has exists');
        const newPartner = await FamilyMember.create({
            familyTreeId,
            partnerId,
            name,
            citizenIdentification,
            dateOfBirth,
            gender,
            avatar,
            job,
            isAlive,
            deathOfBirth
        });
        const updatePartner = await FamilyMember.findOne({ where: {id: partnerId} });
        await updatePartner.update({partnerId: newPartner.id})
        return newPartner
    }

    static updateMember = async ({ id, payload }) => {
        const {
            familyTreeId, name, citizenIdentification,
            dateOfBirth, gender, avatar, job, isAlive, deathOfBirth
        } = payload
        const foundPartner = await FamilyMember.findOne({ where: {id} });
        if (!foundPartner) throw new NotFoundError('Partner doesnt found');
        return await foundPartner.update({
            familyTreeId,
            name,
            citizenIdentification,
            dateOfBirth,
            gender,
            avatar,
            job,
            isAlive,
            deathOfBirth
        });
    }

    static deleteMember = async ({ id, familyTreeId }) => {
        const foundMembers = await FamilyMember.findAll({ where: {
            [Op.or]: [
                { fatherId: id },
                { motherId: id },
                { partnerId: id }
            ]
        } });
        console.log("---------------------------------------");
        console.log("foundMembers::::::::::::", foundMembers);
        console.log("---------------------------------------");
        if (foundMembers.length === 0) throw new NotFoundError('Not found any member');
        for (const foundMember of foundMembers) {
            if (foundMember.fatherId === id) foundMember.fatherId = null;
            if (foundMember.motherId === id) foundMember.motherId = null;
            if (foundMember.partnerId === id) foundMember.partnerId = null;
            await foundMember.save();
        }
        return await FamilyMember.destroy({ where: {id} });
    }

    static addChild = async (payload) => {
        const {
            familyTreeId, fatherId, motherId, name, citizenIdentification,
            dateOfBirth, gender, avatar, job, isAlive, deathOfBirth
        } = payload
        const foundMember = await FamilyMember.findOne({ where: {id: fatherId}});
        const newChild = await FamilyMember.create({
            familyTreeId,
            fatherId,
            motherId: foundMember.partnerId,
            name,
            citizenIdentification,
            dateOfBirth,
            gender,
            avatar,
            job,
            isAlive,
            deathOfBirth
        });
        return newChild
    }

    static getFamilyMember = async ({ familyTreeId }) => {
        return await findAllMemberByFamilyTreeId({ familyTreeId });
    }

}

module.exports = FamilyMemberService