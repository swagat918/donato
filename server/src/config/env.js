const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const required = [
  'PORT',
  'MONGODB_URI',
  'CLIENT_URL',
  'COOKIE_NAME',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'PLATFORM_COMMISSION_RATE',
  'DEFAULT_PAYMENT_PROVIDER'
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const platformCommissionRate = Number(process.env.PLATFORM_COMMISSION_RATE);
if (Number.isNaN(platformCommissionRate) || platformCommissionRate < 0 || platformCommissionRate >= 100) {
  throw new Error('PLATFORM_COMMISSION_RATE must be a number between 0 and 99.99');
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  clientUrl: process.env.CLIENT_URL,
  cookieName: process.env.COOKIE_NAME,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || '',
  googleOAuthEnabled: Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_CALLBACK_URL
  ),
  platformCommissionRate,
  defaultPaymentProvider: process.env.DEFAULT_PAYMENT_PROVIDER
};
