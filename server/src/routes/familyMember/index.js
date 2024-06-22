'use strict'

const express = require('express');
const familyMemberController = require('../../controllers/familyMember.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

router.use(authentication)

router.post('/:familyTreeId/add-partner', asyncHandler(familyMemberController.addPartner));
router.patch('/:familyTreeId/update-member/:id', asyncHandler(familyMemberController.updateMember));
router.delete('/:familyTreeId/delete-member/:id', asyncHandler(familyMemberController.deleteMember));
router.post('/:familyTreeId/add-child', asyncHandler(familyMemberController.addChild));
router.get('/:familyTreeId', asyncHandler(familyMemberController.getFamilyMember));
router.get('/:familyTreeId/:id', asyncHandler(familyMemberController.getMemberById));
router.get('/:familyTreeId/ancestor', asyncHandler(familyMemberController.getAncestor));

module.exports = router;