import axios from 'axios';
import Cookies from 'js-cookie';

// In development, leave this empty so all /api/* calls go through the Vite
// proxy (vite.config.ts → server.proxy), which forwards them server-side to
// your Python backend at localhost:8080 — no CORS issues.
//
// In production, set VITE_API_URL to your backend's public URL, e.g.:
//   VITE_API_URL=https://your-api.example.com
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      Cookies.remove('auth_token');
      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register'
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// Images are served at: {backend}/api/files/{image_name}
// With the proxy active in dev, this becomes just /api/files/{image_name}
export const getImageUrl = (imageName: string | null | undefined) => {
  if (!imageName) return null;
  return `${API_BASE_URL}/api/files/${imageName}`;
};

export default api;
