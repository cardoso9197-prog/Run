/**
 * Location Service
 * Handles real-time GPS tracking for drivers
 * Updates driver location to backend every 15 seconds
 */

import * as Location from 'expo-location';
import api from './api';

class LocationService {
  constructor() {
    this.watchId = null;
    this.intervalId = null;
    this.isTracking = false;
    this.lastLocation = null;
  }

  /**
   * Request location permissions
   */
  async requestPermissions() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('Location permission denied');
        return false;
      }

      console.log('Location permission granted');
      return true;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  /**
   * Start tracking driver location
   * Updates backend every 15 seconds
   */
  async startTracking() {
    if (this.isTracking) {
      console.log('Already tracking location');
      return;
    }

    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Location permission denied');
    }

    console.log('Starting location tracking...');
    this.isTracking = true;

    // Update location immediately
    await this.updateLocation();

    // Then update every 15 seconds
    this.intervalId = setInterval(async () => {
      await this.updateLocation();
    }, 15000); // 15 seconds
  }

  /**
   * Get current location and send to backend
   */
  async updateLocation() {
    if (!this.isTracking) return;

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const locationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        heading: location.coords.heading || 0,
        speed: location.coords.speed || 0,
        accuracy: location.coords.accuracy || 0,
      };

      this.lastLocation = locationData;

      // Send to backend
      await api.post('/drivers/location', locationData);
      
      console.log('Location updated:', {
        lat: locationData.latitude.toFixed(6),
        lng: locationData.longitude.toFixed(6),
      });
    } catch (error) {
      console.error('Location update error:', error.message);
      // Continue tracking even if one update fails
    }
  }

  /**
   * Stop tracking location
   */
  stopTracking() {
    console.log('Stopping location tracking...');
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.watchId) {
      this.watchId.remove();
      this.watchId = null;
    }

    this.isTracking = false;
    this.lastLocation = null;
  }

  /**
   * Get last known location
   */
  getLastLocation() {
    return this.lastLocation;
  }

  /**
   * Check if tracking is active
   */
  isActive() {
    return this.isTracking;
  }
}

// Export singleton instance
export default new LocationService();
