import apiClient from './apiClient';

export async function getStreamers() {
  const { data } = await apiClient.get('/streamers');
  return data.streamers;
}

export async function getStreamer(id) {
  const { data } = await apiClient.get(`/streamers/${id}`);
  return data.streamer;
}
