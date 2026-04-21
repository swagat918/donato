const express = require('express');
const passport = require('../config/passport');
const env = require('../config/env');
const authController = require('../controllers/authController');
const asyncHandler = require('../utils/asyncHandler');
const validateRequest = require('../middleware/validateRequest');
const { requireAuth } = require('../middleware/authMiddleware');
const { registerSchema, loginSchema } = require('../validation/authValidation');

const router = express.Router();

function requireGoogleOAuth(req, res, next) {
  if (!env.googleOAuthEnabled) {
    return res.status(503).json({
      success: false,
      message: 'Google OAuth is not configured on this server'
    });
  }
  return next();
}

router.post('/register', validateRequest(registerSchema), asyncHandler(authController.register));
router.post('/login', validateRequest(loginSchema), asyncHandler(authController.login));
router.get('/config', asyncHandler(authController.config));

router.get(
  '/google',
  requireGoogleOAuth,
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

router.get(
  '/google/callback',
  requireGoogleOAuth,
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${env.clientUrl}/login?error=google-auth-failed`
  }),
  asyncHandler(authController.googleCallback)
);

router.get('/me', requireAuth, asyncHandler(authController.me));
router.post('/logout', requireAuth, asyncHandler(authController.logout));

module.exports = router;
