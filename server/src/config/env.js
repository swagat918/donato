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

const allowedProviders = new Set(['mock', 'esewa', 'khalti']);
const defaultPaymentProvider = String(process.env.DEFAULT_PAYMENT_PROVIDER || '').toLowerCase();
if (!allowedProviders.has(defaultPaymentProvider)) {
  throw new Error('DEFAULT_PAYMENT_PROVIDER must be one of: mock, esewa, khalti');
}

const clientUrls = String(process.env.CLIENT_URL || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

if (!clientUrls.length) {
  throw new Error('CLIENT_URL must include at least one origin');
}

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const cookieSameSite = process.env.COOKIE_SAME_SITE || (isProduction ? 'none' : 'lax');
const cookieSecure = process.env.COOKIE_SECURE
  ? process.env.COOKIE_SECURE === 'true'
  : isProduction;

module.exports = {
  nodeEnv,
  isProduction,
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  clientUrl: clientUrls[0],
  clientUrls,
  cookieName: process.env.COOKIE_NAME,
  cookieSameSite,
  cookieSecure,
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
  defaultPaymentProvider
};
