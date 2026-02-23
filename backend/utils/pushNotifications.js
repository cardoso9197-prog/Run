/**
 * Push Notification Utility for Backend
 * Sends push notifications to drivers using Expo Push Notification Service
 */

const axios = require('axios');

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

/**
 * Send push notification to a single device
 * @param {string} pushToken - Expo push token
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Additional data to send with notification
 */
async function sendPushNotification(pushToken, title, body, data = {}) {
  try {
    if (!pushToken) {
      console.error('❌ Push token is null/undefined');
      return { success: false, error: 'No push token' };
    }

    if (!pushToken.startsWith('ExponentPushToken[')) {
      console.error('❌ Invalid push token format:', pushToken);
      return { success: false, error: 'Invalid push token format' };
    }

    const message = {
      to: pushToken,
      sound: 'default',
      title,
      body,
      data,
      priority: 'high',
      channelId: 'default',
    };

    const response = await axios.post(EXPO_PUSH_URL, message, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const result = response.data?.data;
    if (result?.status === 'error') {
      console.error('❌ Expo push error for token', pushToken, ':', result.message, result.details);
      return { success: false, error: result.message };
    }

    console.log('✅ Push notification sent to', pushToken);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Error sending push notification:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send push notifications to multiple devices
 * @param {array} messages - Array of message objects with format: { pushToken, title, body, data }
 */
async function sendBatchPushNotifications(messages) {
  try {
    const validMessages = messages
      .filter(msg => msg.pushToken && msg.pushToken.startsWith('ExponentPushToken['))
      .map(msg => ({
        to: msg.pushToken,
        sound: 'default',
        title: msg.title,
        body: msg.body,
        data: msg.data || {},
        priority: 'high',
        channelId: 'default',
      }));

    if (validMessages.length === 0) {
      console.log('❌ No valid ExponentPushToken[] tokens found in batch');
      console.log('Attempted tokens:', messages.map(m => m.pushToken));
      return { success: false, error: 'No valid tokens' };
    }

    console.log(`📤 Sending batch to ${validMessages.length} tokens:`, validMessages.map(m => m.to));

    const response = await axios.post(EXPO_PUSH_URL, validMessages, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Log per-ticket results from Expo
    const tickets = response.data?.data || [];
    tickets.forEach((ticket, i) => {
      if (ticket.status === 'error') {
        console.error(`❌ Push failed for token ${validMessages[i]?.to}:`, ticket.message, ticket.details);
      } else {
        console.log(`✅ Push queued for token ${validMessages[i]?.to}, ticketId: ${ticket.id}`);
      }
    });

    const successCount = tickets.filter(t => t.status === 'ok').length;
    console.log(`✅ Batch push: ${successCount}/${validMessages.length} queued successfully`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Error sending batch push notifications:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Notify nearby drivers about new ride request
 * @param {object} ride - Ride object with pickup location, fare, etc.
 * @param {array} nearbyDrivers - Array of driver objects with push_token
 */
async function notifyDriversAboutNewRide(ride, nearbyDrivers) {
  const messages = nearbyDrivers
    .filter(driver => driver.push_token)
    .map(driver => ({
      pushToken: driver.push_token,
      title: driver._overrideTitle || '🚗 New Ride Request!',
      body: driver._overrideBody || `${Math.round(ride.estimated_fare || 0).toLocaleString()} XOF • ${(ride.distanceToPickup || 0).toFixed(1)} km away`,
      data: {
        type: driver._overrideTitle ? 'ride_cancelled' : 'new_ride',
        rideId: ride.id,
        fare: ride.estimated_fare,
        distance: ride.distanceToPickup,
        pickupAddress: ride.pickup_address,
        dropoffAddress: ride.dropoff_address,
      },
    }));

  if (messages.length === 0) {
    console.log('No drivers with push tokens to notify');
    return { success: false, sent: 0 };
  }

  console.log(`📤 Sending notifications to ${messages.length} drivers...`);
  const result = await sendBatchPushNotifications(messages);
  
  return { 
    success: result.success, 
    sent: messages.length,
    data: result.data 
  };
}

module.exports = {
  sendPushNotification,
  sendBatchPushNotifications,
  notifyDriversAboutNewRide,
};
