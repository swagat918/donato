const donationService = require('../services/donationService');

async function createDonation(req, res) {
  const donation = await donationService.createDonation({
    userId: req.user.id,
    streamerId: req.body.streamerId,
    amount: req.body.amount,
    message: req.body.message,
    paymentMethod: req.body.paymentMethod
  });

  res.status(201).json({
    success: true,
    donation: {
      id: donation._id.toString(),
      amount: donation.amount,
      message: donation.message,
      paymentMethod: donation.paymentMethod,
      status: donation.status,
      platformCommission: donation.platformCommission,
      streamerEarning: donation.streamerEarning,
      createdAt: donation.createdAt
    }
  });
}

async function getUserDonations(req, res) {
  const donations = await donationService.getUserDonations(req.user.id);
  res.json({ success: true, donations });
}

async function getStreamerDonations(req, res) {
  const donations = await donationService.getStreamerDonations(req.params.id);
  res.json({ success: true, donations });
}

async function getSummary(req, res) {
  const summary = await donationService.getSummary(req.user.id);
  res.json({ success: true, summary });
}

module.exports = {
  createDonation,
  getUserDonations,
  getStreamerDonations,
  getSummary
};
