const mongoose = require('mongoose');

const streamerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    displayName: {
      type: String,
      required: true,
      trim: true
    },
    bio: {
      type: String,
      default: '',
      trim: true
    },
    totalEarnings: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

streamerSchema.index({ userId: 1 });
streamerSchema.index({ displayName: 1 });

module.exports = mongoose.model('Streamer', streamerSchema);
