const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const env = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const streamerRoutes = require('./routes/streamerRoutes');
const donationRoutes = require('./routes/donationRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok'
  });
});

app.use('/auth', authRoutes);
app.use('/streamers', streamerRoutes);
app.use('/donations', donationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
