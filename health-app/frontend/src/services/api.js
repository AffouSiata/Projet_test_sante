import axios from 'axios';
import config from '../config/config';

const API_URL = config.api.url;

const api = axios.create({
  baseURL: API_URL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updatePatientProfile: (data) => api.put('/users/profile/patient', data),
  updateDoctorProfile: (data) => api.put('/users/profile/doctor', data),
  deleteProfile: () => api.delete('/users/profile'),
  getAllDoctors: () => api.get('/users/doctors'),
  getDoctorById: (id) => api.get(`/users/doctors/${id}`),
};

export const appointmentAPI = {
  create: (data) => api.post('/appointments', data),
  getPatientAppointments: () => api.get('/appointments/patient'),
  getDoctorAppointments: () => api.get('/appointments/doctor'),
  getAppointmentById: (id) => api.get(`/appointments/${id}`),
  updateAppointment: (id, data) => api.put(`/appointments/${id}`, data),
  cancelAppointment: (id) => api.delete(`/appointments/${id}`),
  getAvailableSlots: (doctorId, date) =>
    api.get('/appointments/available-slots', { params: { doctorId, date } }),
};

export const adminAPI = {
  createDoctor: (data) => api.post('/admin/doctors', data),
  updateDoctor: (id, data) => api.put(`/admin/doctors/${id}`, data),
  deleteDoctor: (id) => api.delete(`/admin/doctors/${id}`),
  getAllDoctors: () => api.get('/admin/doctors'),
  getDoctorAppointments: (id) => api.get(`/admin/doctors/${id}/appointments`),
  getStatistics: () => api.get('/admin/statistics'),
};

export default api;