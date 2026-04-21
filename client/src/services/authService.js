import apiClient from './apiClient';

export async function register(payload) {
  const { data } = await apiClient.post('/auth/register', payload);
  return data;
}

export async function login(payload) {
  const { data } = await apiClient.post('/auth/login', payload);
  return data;
}

export async function me() {
  const { data } = await apiClient.get('/auth/me');
  return data;
}

export async function logout() {
  const { data } = await apiClient.post('/auth/logout');
  return data;
}

export function startGoogleAuth() {
  const googleUrl =
    import.meta.env.VITE_GOOGLE_AUTH_URL ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:5000/auth/google'
      : '/api/auth/google');
  window.location.href = googleUrl;
}
