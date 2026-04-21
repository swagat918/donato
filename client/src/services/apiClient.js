import axios from 'axios';

function resolveApiBaseUrl() {
  const configured = import.meta.env.VITE_API_URL;
  if (configured) return configured;

  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }

  return '/api';
}

const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient;
