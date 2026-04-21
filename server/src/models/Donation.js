const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    streamerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Streamer',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    message: {
      type: String,
      default: '',
      trim: true,
      maxlength: 300
    },
    paymentMethod: {
      type: String,
      enum: ['esewa', 'khalti', 'mock'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending'
    },
    platformCommission: {
      type: Number,
      default: 0,
      min: 0
    },
    streamerEarning: {
      type: Number,
      default: 0,
      min: 0
    },
    providerTransactionId: {
      type: String,
      default: null
    },
    failureReason: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

donationSchema.index({ userId: 1, createdAt: -1 });
donationSchema.index({ streamerId: 1, createdAt: -1 });

module.exports = mongoose.model('Donation', donationSchema);
