const express = require('express');
const streamerController = require('../controllers/streamerController');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(streamerController.listStreamers));
router.get('/:id', asyncHandler(streamerController.getStreamer));

module.exports = router;
