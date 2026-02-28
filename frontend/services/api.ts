import axios, { AxiosInstance, AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const message = getErrorMessage(error);
    
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      // Remove token and redirect to login
      Cookies.remove('auth-token');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // Handle 403 errors (forbidden)
    if (error.response?.status === 403) {
      toast.error('Access denied. Insufficient permissions.');
      return Promise.reject(error);
    }
    
    // Handle 404 errors
    if (error.response?.status === 404) {
      toast.error('Resource not found.');
      return Promise.reject(error);
    }
    
    // Handle 429 errors (rate limiting)
    if (error.response?.status === 429) {
      toast.error('Too many requests. Please try again later.');
      return Promise.reject(error);
    }
    
    // Handle 500 errors
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
      return Promise.reject(error);
    }
    
    // Handle other errors
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please check your connection.');
    } else if (error.code === 'ERR_NETWORK') {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Helper function to extract error message
function getErrorMessage(error: AxiosError): string {
  if (error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data as any;
    return data.message || data.error || 'An error occurred';
  }
  return error.message || 'An error occurred';
}

export default api;