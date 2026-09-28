import axios from 'axios';

// Base API configuration
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token from localStorage to headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 Unauthorized globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or unauthorized
      if (localStorage.getItem('taskflow_token')) {
        localStorage.removeItem('taskflow_token');
        localStorage.removeItem('taskflow_user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authService = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  getMe: () => API.get('/auth/me'),
};

// Task endpoints
export const taskService = {
  getTasks: (params) => API.get('/tasks', { params }),
  getTaskStats: () => API.get('/tasks/stats'),
  getTaskById: (id) => API.get(`/tasks/${id}`),
  createTask: (data) => API.post('/tasks', data),
  updateTask: (id, data) => API.put(`/tasks/${id}`, data),
  deleteTask: (id) => API.delete(`/tasks/${id}`),
  dismissReminder: (id) => API.post(`/tasks/${id}/dismiss-reminder`),
};


export default API;
