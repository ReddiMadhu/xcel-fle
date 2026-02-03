import axios from 'axios';
import { config } from '../config.js';

const apiClient = axios.create({
  baseURL: `${config.apiBaseUrl}/api/v1`,
  timeout: 120000, // 2 minutes for large uploads
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor (future: add auth tokens)
apiClient.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor (global error handling)
apiClient.interceptors.response.use(
  response => response,
  error => {
    const errorMessage = error.response?.data?.error?.message ||
                        error.response?.data?.detail?.error?.message ||
                        error.message ||
                        'An error occurred';

    console.error('API Error:', errorMessage, error);

    // Don't show toast here - let components handle it
    // This prevents duplicate toasts
    return Promise.reject(error);
  }
);

export default apiClient;
