import axios from 'axios';

// Centralized backend base URL. Override with VITE_API_URL in .env when
// deploying somewhere other than localhost (e.g. the AWS EC2 migration).
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically attach the logged-in user's JWT to every request that goes
// through this client, so individual pages no longer need to read the token
// out of AuthContext and pass it manually on every call.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
