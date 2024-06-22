'use strict'

const { where } = require('sequelize');
const { BadRequestError, NotFoundError } = require('../core/error.response');
const { FamilyTree, FamilyMember } = require('../models');
const { Op } = require('sequelize');
const { findAllMemberByFamilyTreeId, deleteDescendants } = require('../repositories/familyMember.repo');
const { Sequelize } = require('sequelize');

class FamilyMemberService {

    static addPartner = async (payload) => {
        const {
            familyTreeId, partnerId, childrenId, name, citizenIdentification,
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
            childrenId,
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
        /*
            1: Tìm thành viên cần xóa
            2: Xóa partner 
            3: Tìm và xóa các thành viên con
            4: Xóa từng thành viên con (nếu có)
            5: Xóa thành viên cần xóa
        */ 
        // 1
        const memberDelete = await FamilyMember.findOne({ where: { id, familyTreeId } });
        if (!memberDelete) throw new NotFoundError('Member not found');

        // 2
        if (memberDelete.partnerId) {
            const partnerDelete = await FamilyMember.findOne({ where: { id: memberDelete.partnerId, familyTreeId } });
            if (partnerDelete) {
                await partnerDelete.destroy();
            }
        }

        // const childrenIds = JSON.parse(memberDelete.childrenId) || [];
        // let childrenMembers = [];
        // if (childrenIds.length > 0) {
        //     childrenMembers = await FamilyMember.findAll({
        //         where: {
        //             id: {
        //                 [Op.in]: childrenIds 
        //             },
        //             familyTreeId 
        //         }
        //     });
        // }

        await deleteDescendants(memberDelete);
        return await memberDelete.destroy();
    }

    static addChild = async (payload) => {
        const {
            familyTreeId, fatherId, motherId, childrenId, name, citizenIdentification,
            dateOfBirth, gender, avatar, job, isAlive, deathOfBirth
        } = payload
        const foundMember = await FamilyMember.findOne({ where: {id: fatherId}});
        const foundMotherMember = await FamilyMember.findOne({ where: {id: foundMember.partnerId}});
        const newChild = await FamilyMember.create({
            familyTreeId,
            fatherId,
            motherId: foundMember.partnerId,
            childrenId,
            name,
            citizenIdentification,
            dateOfBirth,
            gender,
            avatar,
            job,
            isAlive,
            deathOfBirth
        });
        await foundMember.update({
            childrenId: Sequelize.fn('JSON_ARRAY_APPEND', Sequelize.col('childrenId'), '$', newChild.id)
        });
        if (foundMotherMember) {
            await foundMotherMember.update({
                childrenId: Sequelize.fn('JSON_ARRAY_APPEND', Sequelize.col('childrenId'), '$', newChild.id)
            });
        }
        return newChild
    }

    static getFamilyMember = async ({ familyTreeId }) => {
        return await findAllMemberByFamilyTreeId({ familyTreeId });
    }

    static getMemberById = async ({ id }) => {
        return await FamilyMember.findOne({ where: {id} })
    }

    static getAncestor = async ({ familyTreeId }) => {
        return await FamilyMember.findOne({ where: {
            familyTreeId,
            isAncestor: true
        }})
    }

}

module.exports = FamilyMemberService