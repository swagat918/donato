import { io } from 'socket.io-client';

let socket;

function resolveSocketUrl() {
  const configured = import.meta.env.VITE_SOCKET_URL;
  if (configured) return configured;

  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }

  return null;
}

export function connectSocket() {
  const socketUrl = resolveSocketUrl();
  if (!socketUrl) return null;

  if (!socket) {
    socket = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
  }
  return socket;
}

export function joinStreamerRoom(streamerId) {
  const client = connectSocket();
  if (!client) return;
  client.emit('joinStreamerRoom', { streamerId });
}

export function leaveStreamerRoom(streamerId) {
  if (!socket) return;
  socket.emit('leaveStreamerRoom', { streamerId });
}

export function onNewDonation(handler) {
  const client = connectSocket();
  if (!client) {
    return () => {};
  }
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
