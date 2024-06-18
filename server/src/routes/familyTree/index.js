'use strict'

const express = require('express');
const familyTreeController = require('../../controllers/familyTree.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

router.use(authentication)

router.get('/', asyncHandler(familyTreeController.getAllFamilyTree));
router.get('/:id', asyncHandler(familyTreeController.getFamilyTree));
router.post('/create', asyncHandler(familyTreeController.createFamilyTree));
router.patch('/update/:id', asyncHandler(familyTreeController.updateFamilyTree));
router.post('/delete/:id', asyncHandler(familyTreeController.deleteFamilyTree));
router.post('/:id/add-member', asyncHandler(familyTreeController.addMemberToFamily));

module.exports = router;