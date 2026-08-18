import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('[API Error]:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);
