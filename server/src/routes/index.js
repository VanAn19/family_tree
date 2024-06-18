'use strict'

const express = require('express');
const router = express.Router();

router.use('/v1/api/family-member', require('./familyMember'));
router.use('/v1/api/family-tree', require('./familyTree'));
router.use('/v1/api/upload', require('./upload'));
router.use('/v1/api', require('./access'));

module.exports = router;