import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { driverAPI } from '../services/api';
import notificationService from '../services/notificationService';

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const [driverName, setDriverName] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [checkingRide, setCheckingRide] = useState(false);

  useEffect(() => {
    loadDriverData();
    // Register push notifications every time HomeScreen mounts
    notificationService.registerForPushNotifications()
      .then(token => {
        if (token) return notificationService.sendTokenToBackend(token);
      })
      .catch(err => console.log('Push setup error:', err));
  }, []);

  // Check for active ride EVERY time driver returns to this screen
  useFocusEffect(
    useCallback(() => {
      checkActiveRide();
    }, [])
  );

  const checkActiveRide = async () => {
    setCheckingRide(true);
    try {
      const response = await driverAPI.getActiveRide();
      const ride = response.data?.ride || null;
      if (ride && ride.id) {
        // Active ride found — navigate straight to it
        navigation.navigate('ActiveRide', { rideId: ride.id });
      }
    } catch (error) {
      // No active ride or network error — stay on Home
    } finally {
      setCheckingRide(false);
    }
  };

  const loadDriverData = async () => {
    try {
      // Try to get cached name first for instant display
      const cachedName = await AsyncStorage.getItem('driverName');
      if (cachedName) {
        setDriverName(cachedName);
      }

      // Then fetch fresh data from API
      const response = await driverAPI.getProfile();
      const driverName = response.data.driver.name || 'Driver';
      setDriverName(driverName);
      
      // Cache the name for future app opens
      await AsyncStorage.setItem('driverName', driverName);
      
      // Convert status string to boolean: 'online' = true, 'offline' = false
      const driverStatus = response.data.driver.status || 'offline';
      setIsOnline(driverStatus === 'online');
    } catch (error) {
      console.error('Error loading profile:', error);
      // Use cached name if API fails
      const cachedName = await AsyncStorage.getItem('driverName');
      if (cachedName) {
        setDriverName(cachedName);
      }
    }
  };

  const handleToggleOnline = async () => {
    try {
      const newStatus = !isOnline;
      const statusValue = newStatus ? 'online' : 'offline';
      
      console.log('Updating status to:', statusValue);
      const response = await driverAPI.updateStatus({ status: statusValue });
      console.log('Status update response:', response.data);
      
      setIsOnline(newStatus);

      // Re-register push token every time driver goes ONLINE to ensure it's current
      if (newStatus) {
        notificationService.registerForPushNotifications()
          .then(token => {
            if (token) {
              console.log('🔔 Re-sending push token on going online:', token);
              return notificationService.sendTokenToBackend(token);
            }
          })
          .catch(err => console.log('Push re-register error:', err));
      }

      Alert.alert('Success', `You are now ${statusValue}`);
    } catch (error) {
      console.error('Toggle online error:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to update status. Please check your connection.';
      
      Alert.alert('Error', errorMessage);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            // Clear all auth data including cached driver name
            await AsyncStorage.multiRemove(['userToken', 'userRole', 'driverActivated', 'driverName', 'userData']);
            
            // Reset navigation stack to Welcome screen
            navigation.reset({
              index: 0,
              routes: [{ name: 'Welcome' }],
            });
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{t('welcome')}, {driverName}! 👋</Text>
        <View style={[styles.statusBadge, isOnline ? styles.statusOnline : styles.statusOffline]}>
          <Text style={styles.statusText}>{isOnline ? t('online') : t('offline')}</Text>
        </View>
      </View>

      {checkingRide && (
        <View style={styles.checkingCard}>
          <ActivityIndicator size="small" color="#FFF" />
          <Text style={styles.checkingText}>Checking for active ride...</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>💰 {t('today')}'s Earnings</Text>
        <Text style={styles.earningsAmount}>{todayEarnings} XOF</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>{isOnline ? t('goOffline') : t('goOnline')}</Text>
          <Switch
            value={isOnline}
            onValueChange={handleToggleOnline}
            trackColor={{ false: '#767577', true: '#FF6B00' }}
            thumbColor={isOnline ? '#000' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.menuGrid}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AvailableRides')}>
          <Text style={styles.menuIcon}>🚗</Text>
          <Text style={styles.menuText}>{t('availableRides')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Earnings')}>
          <Text style={styles.menuIcon}>💵</Text>
          <Text style={styles.menuText}>{t('earnings')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Vehicle')}>
          <Text style={styles.menuIcon}>🔧</Text>
          <Text style={styles.menuText}>{t('vehicle')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.menuIcon}>👤</Text>
          <Text style={styles.menuText}>{t('profile')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.menuIcon}>⚙️</Text>
          <Text style={styles.menuText}>{t('settings')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Text style={styles.menuIcon}>🚪</Text>
          <Text style={styles.menuText}>{t('logout')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#000', padding: 20, paddingTop: 10 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#FF6B00', marginBottom: 10 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  statusOnline: { backgroundColor: '#4CAF50' },
  statusOffline: { backgroundColor: '#666' },
  statusText: { color: '#FFF', fontWeight: 'bold' },
  checkingCard: {
    backgroundColor: '#888', margin: 15, padding: 15, borderRadius: 15,
    flexDirection: 'row', alignItems: 'center',
  },
  checkingText: { color: '#FFF', fontSize: 15, marginLeft: 10 },
  card: { backgroundColor: '#FFF', margin: 15, padding: 20, borderRadius: 15 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  earningsAmount: { fontSize: 36, fontWeight: 'bold', color: '#4CAF50' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  switchLabel: { fontSize: 18, fontWeight: '600' },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 10, justifyContent: 'space-between' },
  menuItem: { backgroundColor: '#FFF', width: '48%', padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 15 },
  menuIcon: { fontSize: 40, marginBottom: 10 },
  menuText: { fontSize: 14, fontWeight: '600', color: '#333', textAlign: 'center' },
});
