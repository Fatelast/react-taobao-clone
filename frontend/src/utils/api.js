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
    // You could handle 401 (Unauthorized) here by redirecting to login, etc.
    if (error.response && error.response.status === 401) {
       // Optional: clear token if invalid
       // localStorage.removeItem('token');
       // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
