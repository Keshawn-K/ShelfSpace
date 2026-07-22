import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

const api = axios.create({
  baseURL: API_URL,
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const register = (data) => api.post('register/', data);
export const login = (data) => api.post('token/', data);
export const getMediaItems = () => api.get('media-items/');
export const getShelves = () => api.get('shelves/');