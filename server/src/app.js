const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const env = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const streamerRoutes = require('./routes/streamerRoutes');
const donationRoutes = require('./routes/donationRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(morgan(env.isProduction ? 'combined' : 'dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 600,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (env.clientUrls.includes(origin)) {
        callback(null, true);
        return;
      }

      if (env.isProduction && origin.endsWith('.vercel.app')) {
        callback(null, true);
        return;
      }

      const corsError = new Error('Origin not allowed by CORS');
      corsError.statusCode = 403;
      callback(corsError);
    },
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

if (env.isProduction) {
  const clientDistPath = path.resolve(__dirname, '../../client/dist');
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/auth') || req.path.startsWith('/streamers') || req.path.startsWith('/donations')) {
      next();
      return;
    }

    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
