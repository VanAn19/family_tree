'use strict'

const FamilyMemberService = require('../services/familyMember.service');
const { OK, CREATED, SuccessResponse } = require('../core/success.response');

class FamilyTreeController {

    addPartner = async (req,res,next) => {
        new CREATED({
            message: 'Add member successfully!',
            metadata: await FamilyMemberService.addPartner({
                ...req.body,
                familyTreeId: req.params.familyTreeId
            })
        }).send(res)
    }

    updateMember = async (req,res,next) => {
        new SuccessResponse({
            message: 'Update member successfully!',
            metadata: await FamilyMemberService.updateMember({
                id: req.params.id,
                payload: {
                    ...req.body,
                    familyTreeId: req.params.familyTreeId
                }
            })
        }).send(res)
    }

    deleteMember = async (req,res,next) => {
        new SuccessResponse({
            message: 'Delete member successfully!',
            metadata: await FamilyMemberService.deleteMember({
                id: req.params.id,
                familyTreeId: req.params.familyTreeId
            })
        }).send(res)
    }

    addChild = async (req,res,next) => {
        new CREATED({
            message: 'Add child successfully!',
            metadata: await FamilyMemberService.addChild({
                ...req.body,
                familyTreeId: req.params.familyTreeId
            })
        }).send(res)
    }

    getFamilyMember = async (req,res,next) => {
        new SuccessResponse({
            message: 'Get all members successfully!',
            metadata: await FamilyMemberService.getFamilyMember({
                familyTreeId: req.params.familyTreeId
            })
        }).send(res)
    }

    getMemberById = async (req,res,next) => {
        new SuccessResponse({
            message: 'Get member successfully!',
            metadata: await FamilyMemberService.getMemberById({
                id: req.params.id
            })
        }).send(res)
    }

    getAncestor = async (req,res,next) => {
        new SuccessResponse({
            message: 'Get ancestor successfully!',
            metadata: await FamilyMemberService.getAncestor({
                familyTreeId: req.params.familyTreeId,
            })
        }).send(res)
    }

}

module.exports = new FamilyTreeController();