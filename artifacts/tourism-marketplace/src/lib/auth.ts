import Cookies from 'js-cookie';
import api from './api';

export const setToken = (token: string) => Cookies.set('auth_token', token, { expires: 7 });
export const getToken = () => Cookies.get('auth_token');
export const removeToken = () => Cookies.remove('auth_token');
export const isAuthenticated = () => !!getToken();

export const getCurrentUser = async () => {
  const res = await api.get('/api/auth/me');
  return res.data; // UserOut
};
