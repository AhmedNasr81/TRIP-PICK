import axios from 'axios';
import Cookies from 'js-cookie';

// Ensure the user sets this in their .env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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
      // Redirect on 401 if we aren't already on login or register
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// Images are served at: {API_BASE_URL}/api/files/{image_name}
export const getImageUrl = (imageName: string | null | undefined) => {
  if (!imageName) return null;
  return `${API_BASE_URL}/api/files/${imageName}`;
};

export default api;
