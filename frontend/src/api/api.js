import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a las peticiones
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

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Courts API
export const courtsAPI = {
  getAll: () => api.get('/courts'),
  getById: (id) => api.get(`/courts/${id}`),
  create: (courtData) => api.post('/courts', courtData),
  update: (id, courtData) => api.put(`/courts/${id}`, courtData),
  delete: (id) => api.delete(`/courts/${id}`),
};

// Bookings API
export const bookingsAPI = {
  getAll: () => api.get('/bookings'),
  getByUser: (userId) => api.get(`/bookings/user/${userId}`),
  create: (bookingData) => api.post('/bookings', bookingData),
  update: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  cancel: (id) => api.delete(`/bookings/${id}`),
  checkAvailability: (courtId, date, time) => 
    api.get(`/bookings/availability?court_id=${courtId}&date=${date}&time=${time}`),
};

// Users API
export const usersAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (id, userData) => api.put(`/users/${id}`, userData),
};

export default api;
