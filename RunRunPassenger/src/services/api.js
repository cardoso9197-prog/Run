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
    console.log('=== AXIOS REQUEST INTERCEPTOR ===');
    console.log('Full URL:', config.baseURL + config.url);
    console.log('Method:', config.method?.toUpperCase());
    console.log('Request data:', config.data ? JSON.stringify(config.data).substring(0, 200) : 'No data');

    try {
      console.log('Retrieving token from AsyncStorage...');
      const token = await AsyncStorage.getItem('userToken');
      console.log('Token retrieved:', token ? 'YES (length: ' + token.length + ')' : 'NO');

      if (token && token.length > 10) { // Basic validation
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Authorization header added');
      } else {
        console.log('⚠️ No valid token found - request will be unauthenticated');
      }
    } catch (error) {
      console.error('❌ Error retrieving token:', error);
    }

    console.log('=== REQUEST INTERCEPTOR COMPLETE ===');
    return config;
  },
  (error) => {
    console.error('❌ REQUEST INTERCEPTOR ERROR:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('=== AXIOS RESPONSE SUCCESS ===');
    console.log('Status:', response.status);
    console.log('URL:', response.config?.url);
    console.log('Response data:', response.data ? JSON.stringify(response.data).substring(0, 200) : 'No data');
    console.log('=== RESPONSE SUCCESS COMPLETE ===');
    return response;
  },
  async (error) => {
    console.error('=== AXIOS RESPONSE ERROR ===');
    console.error('Status:', error?.response?.status);
    console.error('URL:', error?.config?.url);
    console.error('Error message:', error?.message);
    console.error('Response data:', error?.response?.data ? JSON.stringify(error.response.data) : 'No response data');
    console.error('Is network error:', !error?.response && error?.request);
    
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - clearing auth data');
      await AsyncStorage.multiRemove(['userToken', 'userRole', 'userData']);
    }
    
    console.error('=== RESPONSE ERROR COMPLETE ===');
    return Promise.reject(error);
  }
);

// Token verification utility
export const verifyToken = async () => {
  try {
    console.log('=== TOKEN VERIFICATION ===');
    const token = await AsyncStorage.getItem('userToken');
    console.log('Token exists:', !!token);
    console.log('Token length:', token?.length || 0);
    console.log('Token preview:', token ? `${token.substring(0, 20)}...` : 'No token');
    
    if (!token || token.length < 10) {
      console.log('❌ Token invalid or missing');
      return { valid: false, token: null };
    }
    
    console.log('✅ Token appears valid');
    return { valid: true, token };
  } catch (error) {
    console.error('❌ Error verifying token:', error);
    return { valid: false, token: null };
  }
};

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
