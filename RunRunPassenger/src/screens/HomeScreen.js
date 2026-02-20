import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, rideAPI, verifyToken } from '../services/api';

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const [userName, setUserName] = useState('');
  const [activeRide, setActiveRide] = useState(null);
  const [checkingRide, setCheckingRide] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  // Re-check active ride EVERY time this screen comes into focus
  // (covers: back from BookRide, back from ActiveRide, app resume)
  useFocusEffect(
    useCallback(() => {
      checkActiveRide();
    }, [])
  );

  const loadUserData = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const tokenCheck = await verifyToken();
    if (!tokenCheck.valid) { setUserName('User'); return; }
    try {
      const response = await authAPI.getProfile();
      const name = response.data.user?.profile?.name || response.data.name || 'User';
      setUserName(name);
    } catch {
      setUserName('User');
    }
  };

  const checkActiveRide = async () => {
    setCheckingRide(true);
    try {
      const response = await rideAPI.getActiveRide();
      const ride = response.data?.ride || null;
      setActiveRide(ride);

      // If there is an active ride, go straight to it
      if (ride && ride.id) {
        navigation.navigate('ActiveRide', { rideId: ride.id });
      }
    } catch (error) {
      // No active ride or network error — stay on Home
      setActiveRide(null);
    } finally {
      setCheckingRide(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove(['userToken', 'userRole', 'userData']);
            navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
          } catch {
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {t('welcome')}, {userName || 'User'}! 👋
        </Text>
      </View>

      {/* Active Ride Banner */}
      {checkingRide ? (
        <View style={styles.checkingCard}>
          <ActivityIndicator size="small" color="#FFF" />
          <Text style={styles.checkingText}>Checking for active ride...</Text>
        </View>
      ) : activeRide ? (
        <TouchableOpacity
          style={styles.activeRideCard}
          onPress={() => navigation.navigate('ActiveRide', { rideId: activeRide.id })}
        >
          <Text style={styles.activeRideTitle}>🚗 Active Ride in Progress</Text>
          <Text style={styles.activeRideStatus}>
            Status: {activeRide.status === 'accepted' ? '🚗 Driver on the way' :
                     activeRide.status === 'arrived'  ? '📍 Driver arrived!' :
                     activeRide.status === 'started'  ? '🏁 Trip in progress' :
                     activeRide.status}
          </Text>
          <Text style={styles.activeRideTap}>Tap to return to your ride →</Text>
        </TouchableOpacity>
      ) : null}

      <View style={styles.mainCard}>
        <Text style={styles.mainTitle}>{t('whereToGo')}</Text>
        <TouchableOpacity
          style={[styles.bookButton, activeRide && styles.bookButtonDisabled]}
          onPress={() => {
            if (activeRide) {
              Alert.alert(
                'Active Ride',
                'You already have an active ride. Please complete or cancel it before booking a new one.',
                [
                  { text: 'View Ride', onPress: () => navigation.navigate('ActiveRide', { rideId: activeRide.id }) },
                  { text: 'OK', style: 'cancel' },
                ]
              );
            } else {
              navigation.navigate('BookRide');
            }
          }}
        >
          <Text style={styles.bookButtonText}>📍 {t('bookRide')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuGrid}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PaymentMethods')}>
          <Text style={styles.menuIcon}>💳</Text>
          <Text style={styles.menuText}>{t('paymentMethods')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('TripHistory')}>
          <Text style={styles.menuIcon}>📋</Text>
          <Text style={styles.menuText}>{t('tripHistory')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('BusinessAccount')}>
          <Text style={styles.menuIcon}>🏢</Text>
          <Text style={styles.menuText}>Business Account</Text>
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
  header: { backgroundColor: '#FF6B00', padding: 20, paddingTop: 10 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#000' },
  checkingCard: {
    backgroundColor: '#888',
    margin: 15,
    padding: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkingText: { color: '#FFF', fontSize: 15, marginLeft: 10 },
  activeRideCard: {
    backgroundColor: '#4CAF50',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  activeRideTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF', marginBottom: 6 },
  activeRideStatus: { fontSize: 16, color: '#FFF', marginBottom: 4 },
  activeRideTap: { fontSize: 13, color: '#E8F5E9', marginTop: 4 },
  mainCard: {
    backgroundColor: '#FFF', margin: 15, padding: 25, borderRadius: 15,
    alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
  },
  mainTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#000' },
  bookButton: { backgroundColor: '#FF6B00', padding: 18, borderRadius: 10, width: '100%', alignItems: 'center' },
  bookButtonDisabled: { backgroundColor: '#ccc' },
  bookButtonText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 10, justifyContent: 'space-between' },
  menuItem: {
    backgroundColor: '#FFF', width: '48%', padding: 20, borderRadius: 15,
    alignItems: 'center', marginBottom: 15, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3,
  },
  menuIcon: { fontSize: 40, marginBottom: 10 },
  menuText: { fontSize: 14, fontWeight: '600', color: '#333', textAlign: 'center' },
});