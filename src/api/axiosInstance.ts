import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API || 'https://api.kadrx.com/api/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);