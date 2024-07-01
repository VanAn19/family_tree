'use strict'

const express = require('express');
const familyMemberController = require('../../controllers/familyMember.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { upload } = require('../../configs/multer.config');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

router.use(authentication)

router.post('/:familyTreeId/add-partner', upload.single('avatar'), asyncHandler(familyMemberController.addPartner));
router.patch('/:familyTreeId/update-member/:id', upload.single('avatar'), asyncHandler(familyMemberController.updateMember));
router.delete('/:familyTreeId/delete-member/:id', asyncHandler(familyMemberController.deleteMember));
router.post('/:familyTreeId/add-child', upload.single('avatar'), asyncHandler(familyMemberController.addChild));
router.post('/:familyTreeId/add-parent', upload.single('avatar'), asyncHandler(familyMemberController.addParent));
router.get('/:familyTreeId', asyncHandler(familyMemberController.getFamilyMember));
router.get('/:familyTreeId/:id', asyncHandler(familyMemberController.getMemberById));
router.get('/:familyTreeId/ancestor', asyncHandler(familyMemberController.getAncestor));

module.exports = router;