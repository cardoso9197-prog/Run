import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend API URL - Replace with your Railway deployment URL
const API_URL = 'https://zippy-healing-production-24e4.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
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
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, logout user
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userRole');
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  resendOTP: (data) => api.post('/auth/resend-otp', data),
  getProfile: () => api.get('/auth/me'), // Fixed: use /auth/me endpoint
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Passenger APIs
export const passengerAPI = {
  updateProfile: (data) => api.put('/passengers/profile', data),
  getPaymentMethods: () => api.get('/payment-methods'),
  addPaymentMethod: (data) => api.post('/payment-methods', data),
  addCardPaymentMethod: (data) => api.post('/payment-methods/card', data),
  addMobilePaymentMethod: (data) => api.post('/payment-methods/mobile', data),
  updatePaymentMethod: (id, data) => api.put(`/payment-methods/${id}`, data),
  deletePaymentMethod: (id) => api.delete(`/payment-methods/${id}`),
  setDefaultPaymentMethod: (id) => api.put(`/payment-methods/${id}/default`),
};

// Ride APIs
export const rideAPI = {
  createRide: (data) => api.post('/rides/request', data),
  getRides: () => api.get('/rides'),
  getRideDetails: (id) => api.get(`/rides/${id}`),
  cancelRide: (id) => api.put(`/rides/${id}/cancel`),
  getTripHistory: () => api.get('/rides/history'),
  rateRide: (id, data) => api.post(`/rides/${id}/rate`, data),
  estimateFare: (data) => api.post('/rides/estimate-fare', data),
};

export default api;
