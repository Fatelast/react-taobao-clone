import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:5000', // Centralized Base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally (optional but recommended)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMsg = error.response?.data?.msg || error.response?.data || error.message || 'Unknown Security error';
    // 注入提取后的消息，方便 UI 直接使用
    error.extractedMsg = errorMsg;
    
    if (error.response && error.response.status === 401) {
       // Optional: Auth redirection logic
    }
    return Promise.reject(error);
  }
);

export default api;
