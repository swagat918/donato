const env = require('../config/env');
const authService = require('../services/authService');
const tokenService = require('../services/tokenService');

function setAuthCookie(res, token) {
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

async function register(req, res) {
  const user = await authService.registerUser(req.body);
  const token = tokenService.signToken({ userId: user.id, role: user.role });

  setAuthCookie(res, token);

  res.status(201).json({
    success: true,
    user
  });
}

async function login(req, res) {
  const user = await authService.loginUser(req.body.identifier, req.body.password);
  const token = tokenService.signToken({ userId: user.id, role: user.role });

  setAuthCookie(res, token);

  res.json({
    success: true,
    user
  });
}

async function googleCallback(req, res) {
  const user = req.user;
  const token = tokenService.signToken({ userId: user.id, role: user.role });
  setAuthCookie(res, token);

  res.redirect(`${env.clientUrl}/streamers`);
}

async function me(req, res) {
  const result = await authService.getMe(req.user.id);
  res.json({
    success: true,
    ...result
  });
}

async function logout(req, res) {
  res.clearCookie(env.cookieName);
  res.json({ success: true });
}

module.exports = {
  register,
  login,
  googleCallback,
  me,
  logout
};
