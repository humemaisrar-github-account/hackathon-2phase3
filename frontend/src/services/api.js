import axios from 'axios';

// Get the base API URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Create an axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the token from wherever you store it (localStorage, cookies, etc.)
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common error cases
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error responses
    if (error.response?.status === 401) {
      // Token might be expired, redirect to login
      if (typeof window !== 'undefined') {
        // Remove the invalid token
        localStorage.removeItem('auth_token');
        // Redirect to login page
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

// User endpoints
export const userAPI = {
  update: (id, userData) => apiClient.put(`/api/users/${id}`, userData),
};

// Authentication endpoints - using the ones that are actually exposed by the backend
export const authAPI = {
  register: (userData) => {
    // The register endpoint expects email and password in the request body
    return apiClient.post('/api/auth/register', userData);
  },
  login: (credentials) => {
    // The login endpoint expects email and password in the request body
    return apiClient.post('/api/auth/login', credentials);
  },
  logout: () => apiClient.post('/api/auth/logout'),
};

// Todo endpoints
export const todoAPI = {
  getAll: (params) => apiClient.get('/api/todos', { params }),
  create: (todoData) => apiClient.post('/api/todos', todoData),
  update: (id, todoData) => apiClient.put(`/api/todos/${id}`, todoData),
  delete: (id) => apiClient.delete(`/api/todos/${id}`),
  toggleComplete: (id) => apiClient.patch(`/api/todos/${id}/toggle-complete`),
};

// Health check endpoint
export const healthAPI = {
  check: () => apiClient.get('/health'),
};

export default apiClient;