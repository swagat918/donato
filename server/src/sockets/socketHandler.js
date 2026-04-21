const { Server } = require('socket.io');
const env = require('../config/env');
const { setIo } = require('./io');

function initializeSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientUrls,
      credentials: true
    }
  });

  setIo(io);

  io.on('connection', (socket) => {
    socket.on('joinStreamerRoom', ({ streamerId }) => {
      if (streamerId) {
        socket.join(`streamer:${streamerId}`);
      }
    });

    socket.on('leaveStreamerRoom', ({ streamerId }) => {
      if (streamerId) {
        socket.leave(`streamer:${streamerId}`);
      }
    });
  });

  return io;
}

module.exports = {
  initializeSocket
};
