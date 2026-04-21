import apiClient from './apiClient';

export async function donate(payload) {
  const { data } = await apiClient.post('/donations', payload);
  return data.donation;
}

export async function getUserDonations() {
  const { data } = await apiClient.get('/donations/user');
  return data.donations;
}

export async function getStreamerDonations(streamerId) {
  const { data } = await apiClient.get(`/donations/streamer/${streamerId}`);
  return data.donations;
}

export async function getSummary() {
  const { data } = await apiClient.get('/donations/summary');
  return data.summary;
}
