const Donation = require('../models/Donation');
const Streamer = require('../models/Streamer');
const User = require('../models/User');
const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');
const paymentService = require('./payment/paymentService');
const { getIo } = require('../sockets/io');

function calculateCommission(amount) {
  const commission = Number(((amount * env.platformCommissionRate) / 100).toFixed(2));
  const streamerEarning = Number((amount - commission).toFixed(2));
  return { commission, streamerEarning };
}

async function createDonation({ userId, streamerId, amount, message, paymentMethod }) {
  if (!mongoose.Types.ObjectId.isValid(streamerId)) {
    throw new ApiError(400, 'Invalid streamer id');
  }

  const streamer = await Streamer.findById(streamerId);
  if (!streamer) {
    throw new ApiError(404, 'Streamer not found');
  }

  if (streamer.userId.toString() === userId) {
    throw new ApiError(400, 'You cannot donate to your own streamer account');
  }

  const donor = await User.findById(userId);
  if (!donor) {
    throw new ApiError(404, 'Donor not found');
  }

  const pendingDonation = await Donation.create({
    userId,
    streamerId,
    amount,
    message: message || '',
    paymentMethod,
    status: 'pending'
  });

  let paymentResult;
  try {
    paymentResult = await paymentService.processPayment(paymentMethod, {
      donationId: pendingDonation._id.toString(),
      amount,
      userId,
      streamerId
    });
  } catch (error) {
    pendingDonation.status = 'failed';
    pendingDonation.failureReason = error.message || 'Payment provider failed';
    await pendingDonation.save();
    throw new ApiError(502, 'Payment provider error');
  }

  if (!paymentResult.success) {
    pendingDonation.status = 'failed';
    pendingDonation.failureReason = 'Payment failed';
    await pendingDonation.save();

    throw new ApiError(402, 'Payment failed');
  }

  const { commission, streamerEarning } = calculateCommission(amount);

  pendingDonation.status = 'success';
  pendingDonation.platformCommission = commission;
  pendingDonation.streamerEarning = streamerEarning;
  pendingDonation.providerTransactionId = paymentResult.providerTransactionId;
  await pendingDonation.save();

  streamer.totalEarnings = Number((streamer.totalEarnings + streamerEarning).toFixed(2));
  await streamer.save();

  const io = getIo();
  if (io) {
    io.to(`streamer:${streamerId}`).emit('newDonation', {
      donationId: pendingDonation._id.toString(),
      streamerId,
      donorName: donor.name,
      amount,
      message: message || '',
      timestamp: pendingDonation.createdAt,
      totalEarnings: streamer.totalEarnings
    });
  }

  return pendingDonation.toObject();
}

async function getUserDonations(userId) {
  const donations = await Donation.find({ userId, status: 'success' })
    .populate({ path: 'streamerId', select: 'displayName userId', populate: { path: 'userId', select: 'name' } })
    .sort({ createdAt: -1 })
    .lean();

  return donations.map((item) => ({
    id: item._id.toString(),
    streamerId: item.streamerId?._id?.toString(),
    streamerName: item.streamerId?.displayName || item.streamerId?.userId?.name || 'Streamer',
    amount: item.amount,
    message: item.message,
    paymentMethod: item.paymentMethod,
    createdAt: item.createdAt
  }));
}

async function getStreamerDonations(streamerId) {
  if (!mongoose.Types.ObjectId.isValid(streamerId)) {
    throw new ApiError(400, 'Invalid streamer id');
  }

  const donations = await Donation.find({ streamerId, status: 'success' })
    .populate('userId', 'name')
    .sort({ createdAt: -1 })
    .lean();

  return donations.map((item) => ({
    id: item._id.toString(),
    donorName: item.userId?.name || 'Anonymous',
    amount: item.amount,
    message: item.message,
    paymentMethod: item.paymentMethod,
    createdAt: item.createdAt
  }));
}

async function getSummary(userId) {
  const [donatedAgg] = await Donation.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), status: 'success' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const streamer = await Streamer.findOne({ userId }).lean();
  let totalReceived = 0;

  if (streamer) {
    const [receivedAgg] = await Donation.aggregate([
      { $match: { streamerId: streamer._id, status: 'success' } },
      { $group: { _id: null, total: { $sum: '$streamerEarning' } } }
    ]);
    totalReceived = receivedAgg?.total || 0;
  }

  return {
    totalDonated: donatedAgg?.total || 0,
    totalReceived
  };
}

module.exports = {
  createDonation,
  getUserDonations,
  getStreamerDonations,
  getSummary
};
