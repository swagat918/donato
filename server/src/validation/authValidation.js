const { z } = require('zod');

const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Name is required'),
    email: z.string().trim().email('Invalid email').optional().or(z.literal('')),
    phone: z.string().trim().min(7, 'Phone must be valid').optional().or(z.literal('')),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['user', 'streamer']).default('user'),
    displayName: z.string().trim().optional(),
    bio: z.string().trim().optional()
  })
  .refine((value) => value.email || value.phone, {
    message: 'Either email or phone is required',
    path: ['email']
  })
  .refine((value) => (value.role !== 'streamer' ? true : !!value.displayName), {
    message: 'displayName is required for streamer role',
    path: ['displayName']
  });

const loginSchema = z.object({
  identifier: z.string().trim().min(3, 'identifier is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

module.exports = {
  registerSchema,
  loginSchema
};
