'use strict'

const FamilyTreeService = require('../services/familyTree.service');
const { OK, CREATED, SuccessResponse } = require('../core/success.response');

class FamilyTreeController {

    deleteFamilyTree = async (req,res,next) => {
        new SuccessResponse({
            message: 'Delete family tree successfully!',
            metadata: await FamilyTreeService.deleteFamilyTree({ id: req.params.id })
        }).send(res)
    }

    updateFamilyTree = async (req,res,next) => {
        new SuccessResponse({
            message: 'Update family tree successfully!',
            metadata: await FamilyTreeService.updateFamilyTree({ 
                id: req.params.id, 
                name: req.body.name
            })
        }).send(res)
    }

    createFamilyTree = async (req,res,next) => {
        new CREATED({
            message: 'Create new family tree!',
            metadata: await FamilyTreeService.createFamilyTree({ 
                name: req.body.name, 
                userCreateId: req.user.userId,
                ancestorName: req.body.ancestorName
            })
        }).send(res)
    }

    getFamilyTree = async (req,res,next) => {
        new SuccessResponse({
            message: 'Get family tree successfully!',
            metadata: await FamilyTreeService.getFamilyTree({ id: req.params.id })
        }).send(res)
    }

    getAllFamilyTree = async (req,res,next) => {
        new SuccessResponse({
            message: 'Get all family tree successfully!',
            metadata: await FamilyTreeService.getAllFamilyTree({
                userCreateId: req.user.userId
            })
        }).send(res)
    }

}

module.exports = new FamilyTreeController();