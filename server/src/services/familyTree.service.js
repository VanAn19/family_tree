'use strict'

const { BadRequestError } = require('../core/error.response');
const { FamilyTree, FamilyMember } = require('../models');
const { getInfoData } = require('../utils');

class FamilyTreeService {
    
    static getFamilyTree = async ({ id }) => {
        const foundFamilyTree = await FamilyTree.findOne({ where: {id} });
        if (!foundFamilyTree) throw new BadRequestError('Family tree is not existed');
        return {
            familyTree: getInfoData({ fields: ['id', 'name', 'ancestorName'], object: foundFamilyTree})
        }
    }

    static getAllFamilyTree = async () => {
        const foundFamilyTree = await FamilyTree.findAll();
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
        await FamilyMember.create({ name: ancestorName, gender: "Nam", familyTreeId: newFamilyTree.id });
        return newFamilyTree
    }

    static updateFamilyTree = async ({ id, name }) => {
        const foundTree = await FamilyTree.findOne({ where: {id} });
        if (!foundTree) throw new BadRequestError('Not found family tree');
        foundTree.name = name;
        await foundTree.save();
        return foundTree;
    }

    static deleteFamilyTree = async ({ id  }) => {
        return await FamilyTree.destroy({ where: {id} });
    }

}

module.exports = FamilyTreeService