const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Streamer = require('../models/Streamer');
const ApiError = require('../utils/ApiError');

function toSafeUser(userDoc) {
  return {
    id: userDoc._id.toString(),
    name: userDoc.name,
    email: userDoc.email || null,
    phone: userDoc.phone || null,
    role: userDoc.role,
    googleId: userDoc.googleId || null
  };
}

async function registerUser(payload) {
  const { name, email, phone, password, role, displayName, bio } = payload;

  if (email) {
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      throw new ApiError(409, 'Email is already registered');
    }
  }

  if (phone) {
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      throw new ApiError(409, 'Phone is already registered');
    }
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: email ? email.toLowerCase() : undefined,
    phone: phone || undefined,
    passwordHash,
    role
  });

  if (role === 'streamer') {
    await Streamer.create({
      userId: user._id,
      displayName,
      bio: bio || ''
    });
  }

  return toSafeUser(user);
}

async function loginUser(identifier, password) {
  const normalized = identifier.trim();
  const query = normalized.includes('@')
    ? { email: normalized.toLowerCase() }
    : { phone: normalized };

  const user = await User.findOne(query);
  if (!user || !user.passwordHash) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  return toSafeUser(user);
}

async function findOrCreateGoogleUser(profile) {
  const googleId = profile.id;
  const email = profile.emails?.[0]?.value?.toLowerCase();
  const name = profile.displayName || 'Google User';

  let user = await User.findOne({ googleId });

  if (!user && email) {
    user = await User.findOne({ email });
    if (user) {
      user.googleId = googleId;
      await user.save();
    }
  }

  if (!user) {
    user = await User.create({
      name,
      email,
      googleId,
      role: 'user'
    });
  }

  return toSafeUser(user);
}

async function getMe(userId) {
  const user = await User.findById(userId).lean();
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const streamer = await Streamer.findOne({ userId }).lean();

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email || null,
      phone: user.phone || null,
      role: user.role
    },
    streamer: streamer
      ? {
          id: streamer._id.toString(),
          displayName: streamer.displayName,
          bio: streamer.bio,
          totalEarnings: streamer.totalEarnings
        }
      : null
  };
}

module.exports = {
  registerUser,
  loginUser,
  findOrCreateGoogleUser,
  getMe
};
