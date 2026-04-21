const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const Streamer = require('../models/Streamer');
const Donation = require('../models/Donation');

dotenv.config({ path: '.env' });

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/donato';

async function seed() {
  await mongoose.connect(mongoUri);

  await Promise.all([User.deleteMany({}), Streamer.deleteMany({}), Donation.deleteMany({})]);

  const passwordHash = await bcrypt.hash('password123', 10);

  const donor = await User.create({
    name: 'Aarya Donor',
    email: 'donor@donato.local',
    phone: '9800000001',
    passwordHash,
    role: 'user'
  });

  const streamerUser = await User.create({
    name: 'Sujan Streamer',
    email: 'streamer@donato.local',
    phone: '9800000002',
    passwordHash,
    role: 'streamer'
  });

  const streamer = await Streamer.create({
    userId: streamerUser._id,
    displayName: 'SujanPlays',
    bio: 'Live coding and gaming sessions',
    totalEarnings: 0
  });

  const donationAmount = 100;
  const commissionRate = Number(process.env.PLATFORM_COMMISSION_RATE || 5);
  const commission = Number(((donationAmount * commissionRate) / 100).toFixed(2));
  const streamerEarning = Number((donationAmount - commission).toFixed(2));

  await Donation.create({
    userId: donor._id,
    streamerId: streamer._id,
    amount: donationAmount,
    message: 'Keep going, amazing stream!',
    paymentMethod: 'mock',
    status: 'success',
    platformCommission: commission,
    streamerEarning,
    providerTransactionId: `seed_tx_${Date.now()}`
  });

  streamer.totalEarnings = streamerEarning;
  await streamer.save();

  // eslint-disable-next-line no-console
  console.log('Seed completed. Sample credentials:');
  // eslint-disable-next-line no-console
  console.log('Donor: donor@donato.local / password123');
  // eslint-disable-next-line no-console
  console.log('Streamer: streamer@donato.local / password123');

  await mongoose.disconnect();
}

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Seed failed', error);
  process.exit(1);
});
