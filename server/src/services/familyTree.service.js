'use strict'

const { BadRequestError } = require('../core/error.response');
const { FamilyTree, FamilyMember } = require('../models');
const { getInfoData } = require('../utils');
const { findAllFamilyTreeByUserId } = require('../repositories/familyTree.repo')

class FamilyTreeService {
    
    static getFamilyTree = async ({ id }) => {
        const foundFamilyTree = await FamilyTree.findOne({ where: {id} });
        if (!foundFamilyTree) throw new BadRequestError('Family tree is not existed');
        return {
            familyTree: getInfoData({ fields: ['id', 'name', 'ancestorName'], object: foundFamilyTree})
        }
    }

    static getAllFamilyTree = async ({ userCreateId }) => {
        const foundFamilyTree = await findAllFamilyTreeByUserId({userCreateId});
        return {
            familyTree: getInfoData({ fields: ['id', 'name', 'ancestorName'], object: foundFamilyTree})
        }
    }

    static createFamilyTree = async ({ name, userCreateId, ancestorName }) => {
        const foundTree = await FamilyTree.findOne({ 
            where: { 
                name, 
                userCreateId 
            } 
        });
        if (foundTree) throw new BadRequestError('Family tree name already exists!');
        const newFamilyTree = await FamilyTree.create({ name, userCreateId, ancestorName });
        await FamilyMember.create({ name: ancestorName, gender: "Nam", familyTreeId: newFamilyTree.id, relationship: "Tổ tiên", isAncestor: true });
        return newFamilyTree
    }

    static updateFamilyTree = async ({ id, name }) => {
        const foundTree = await FamilyTree.findOne({ where: {id} });
        if (!foundTree) throw new BadRequestError('Not found family tree');
        foundTree.name = name;
        await foundTree.save();
        return foundTree;
    }

    static deleteFamilyTree = async ({ id }) => {
        await FamilyMember.destroy({ where: {familyTreeId: id} });
        return await FamilyTree.destroy({ where: {id} });
    }

}

module.exports = FamilyTreeService