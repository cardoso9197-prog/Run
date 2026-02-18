/**
 * Push Notification Service for Driver App
 * Handles registration and receiving of push notifications
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import api from './api';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
  }

  /**
   * Register for push notifications and get token
   */
  async registerForPushNotifications() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF6B00',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Push notification permission denied');
        return null;
      }
      
      try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId 
          || Constants.easConfig?.projectId 
          || 'b49bb6c3-9462-4e6f-91a5-31e405dff11c';
        token = await Notifications.getExpoPushTokenAsync({ projectId });
        console.log('Expo Push Token:', token.data);
        this.expoPushToken = token.data;
      } catch (error) {
        console.error('Error getting push token:', error);
        return null;
      }
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    return token?.data;
  }

  /**
   * Send push token to backend
   */
  async sendTokenToBackend(token) {
    if (!token) return;

    try {
      await api.post('/drivers/push-token', {
        pushToken: token,
        platform: Platform.OS,
      });
      console.log('Push token sent to backend');
    } catch (error) {
      console.error('Error sending push token to backend:', error);
    }
  }

  /**
   * Setup notification listeners
   */
  setupNotificationListeners(onNotificationReceived, onNotificationTapped) {
    // Listener for notifications received while app is in foreground
    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
        if (onNotificationReceived) {
          onNotificationReceived(notification);
        }
      }
    );

    // Listener for when user taps on notification
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification tapped:', response);
        const data = response.notification.request.content.data;
        
        if (onNotificationTapped) {
          onNotificationTapped(data);
        }
      }
    );
  }

  /**
   * Remove notification listeners
   */
  removeNotificationListeners() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  /**
   * Schedule a local notification (for testing)
   */
  async scheduleLocalNotification(title, body, data = {}) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // null means immediate
    });
  }

  /**
   * Get the current push token
   */
  getToken() {
    return this.expoPushToken;
  }
}

// Export singleton instance
export default new NotificationService();
