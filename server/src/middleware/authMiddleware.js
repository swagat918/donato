const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const tokenService = require('../services/tokenService');
const User = require('../models/User');

async function requireAuth(req, res, next) {
  try {
    const cookieToken = req.cookies?.[env.cookieName];
    const headerToken = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;

    const token = cookieToken || headerToken;

    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }

    const decoded = tokenService.verifyToken(token);
    const user = await User.findById(decoded.userId).lean();

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      name: user.name
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }

    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      next(new ApiError(401, 'Invalid or expired token'));
      return;
    }

    next(error);
  }
}

function requireRole(...roles) {
  return function roleGuard(req, res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden'));
    }
    return next();
  };
}

module.exports = {
  requireAuth,
  requireRole
};
