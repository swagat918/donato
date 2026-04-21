import { io } from 'socket.io-client';

let socket;

export function connectSocket() {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
  }
  return socket;
}

export function joinStreamerRoom(streamerId) {
  const client = connectSocket();
  client.emit('joinStreamerRoom', { streamerId });
}

export function leaveStreamerRoom(streamerId) {
  if (!socket) return;
  socket.emit('leaveStreamerRoom', { streamerId });
}

export function onNewDonation(handler) {
  const client = connectSocket();
  client.on('newDonation', handler);
  return () => {
    client.off('newDonation', handler);
  };
}

export function disconnectSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}
