const { z } = require('zod');

const createDonationSchema = z.object({
  streamerId: z.string().trim().min(12, 'streamerId is required'),
  amount: z.number().positive('amount must be positive'),
  message: z.string().max(300).optional().default(''),
  paymentMethod: z.enum(['esewa', 'khalti', 'mock'])
});

module.exports = {
  createDonationSchema
};
