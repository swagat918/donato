const express = require('express');
const donationController = require('../controllers/donationController');
const asyncHandler = require('../utils/asyncHandler');
const { requireAuth } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { createDonationSchema } = require('../validation/donationValidation');

const router = express.Router();

router.post('/', requireAuth, validateRequest(createDonationSchema), asyncHandler(donationController.createDonation));
router.get('/user', requireAuth, asyncHandler(donationController.getUserDonations));
router.get('/streamer/:id', asyncHandler(donationController.getStreamerDonations));
router.get('/summary', requireAuth, asyncHandler(donationController.getSummary));

module.exports = router;
