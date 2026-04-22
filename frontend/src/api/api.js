import axios from 'axios';
import axiosRetry from 'axios-retry';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Configure axios-retry on this instance
axiosRetry(api, {
  retries: 5,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // Retry on network errors, 5xx, or idempotent-like POSTs for expenses
    const isIdempotentPost = error.config?.method?.toLowerCase() === 'post' && error.config?.url?.includes('/expenses');
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || (error.response?.status >= 500) || isIdempotentPost;
  }
});

export default api;
