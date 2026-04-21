const Streamer = require('../models/Streamer');
const Donation = require('../models/Donation');
const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');

async function listStreamers() {
  const streamers = await Streamer.find()
    .populate('userId', 'name role')
    .sort({ createdAt: -1 })
    .lean();

  return streamers.map((item) => ({
    id: item._id.toString(),
    userId: item.userId?._id?.toString(),
    name: item.userId?.name || item.displayName,
    displayName: item.displayName,
    bio: item.bio,
    totalEarnings: item.totalEarnings
  }));
}

async function getStreamerById(streamerId) {
  if (!mongoose.Types.ObjectId.isValid(streamerId)) {
    throw new ApiError(400, 'Invalid streamer id');
  }

  const streamer = await Streamer.findById(streamerId).populate('userId', 'name role').lean();
  if (!streamer) {
    throw new ApiError(404, 'Streamer not found');
  }

  const recentDonations = await Donation.find({
    streamerId,
    status: 'success'
  })
    .populate('userId', 'name')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  return {
    id: streamer._id.toString(),
    userId: streamer.userId?._id?.toString(),
    name: streamer.userId?.name || streamer.displayName,
    displayName: streamer.displayName,
    bio: streamer.bio,
    totalEarnings: streamer.totalEarnings,
    recentDonations: recentDonations.map((item) => ({
      id: item._id.toString(),
      donorName: item.userId?.name || 'Anonymous',
      amount: item.amount,
      message: item.message,
      createdAt: item.createdAt
    }))
  };
}

module.exports = {
  listStreamers,
  getStreamerById
};
