import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://zippy-healing-production-24e4.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Token added to request:', config.url);
      } else {
        console.log('No token found for request:', config.url);
      }
    } catch (error) {
      console.error('Error getting token from storage:', error);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - Token may be invalid');
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userRole');
      await AsyncStorage.removeItem('driverActivated');
      await AsyncStorage.removeItem('driverName');
      await AsyncStorage.removeItem('userData');
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

// Driver APIs
export const driverAPI = {
  register: (data) => api.post('/drivers/register', data),
  getProfile: () => api.get('/drivers/profile'),
  updateProfile: (data) => api.put('/drivers/profile', data),
  updateStatus: (data) => api.put('/drivers/status', data),
  getAvailableRides: () => api.get('/drivers/available-rides'),
  acceptRide: (rideId) => api.post('/drivers/accept-ride', { ride_id: rideId }),
  getEarnings: () => api.get('/drivers/earnings'),
  updateVehicle: (data) => api.put('/drivers/vehicle', data),
  // Withdrawal APIs
  getWithdrawalBalance: () => api.get('/withdrawals/balance'),
  getWithdrawalSettings: () => api.get('/withdrawals/settings'),
  updateWithdrawalSettings: (data) => api.put('/withdrawals/settings', data),
  requestWithdrawal: (data) => api.post('/withdrawals/request', data),
  getWithdrawalHistory: () => api.get('/withdrawals/history'),
};

// Ride APIs
export const rideAPI = {
  getRides: () => api.get('/rides'),
  getRideDetails: (id) => api.get(`/rides/${id}`),
  startRide: (id) => api.put(`/rides/${id}/start`),
  completeRide: (id) => api.put(`/rides/${id}/complete`),
  cancelRide: (id) => api.put(`/rides/${id}/cancel`),
};

export default api;
