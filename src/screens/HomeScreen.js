import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, rideAPI } from '../services/api';

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const [userName, setUserName] = useState('');
  const [activeRide, setActiveRide] = useState(null);

  useEffect(() => {
    loadUserData();
    checkActiveRide();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await authAPI.getProfile();
      const name = response.data.user?.profile?.name || response.data.name || 'User';
      setUserName(name);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const checkActiveRide = async () => {
    try {
      const response = await rideAPI.getRides();
      const active = response.data.find(
        (ride) =>
          ride.status === 'requested' ||
          ride.status === 'accepted' ||
          ride.status === 'started'
      );
      setActiveRide(active);
    } catch (error) {
      console.error('Error checking rides:', error);
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
            // Clear all auth data
            await AsyncStorage.multiRemove(['userToken', 'userRole', 'userData']);

            // Force navigation to Welcome screen and reset stack
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
        <Text style={styles.greeting}>
          {t('welcome')}, {userName || 'User'}! 👋
        </Text>
      </View>

      {activeRide && (
        <TouchableOpacity
          style={styles.activeRideCard}
          onPress={() =>
            navigation.navigate('ActiveRide', { rideId: activeRide.id })
          }
        >
          <Text style={styles.activeRideTitle}>{t('activeRide')} 🚗</Text>
          <Text style={styles.activeRideText}>
            Status: {activeRide.status}
          </Text>
          <Text style={styles.activeRideText}>
            To: {activeRide.dropoff_address}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.mainCard}>
        <Text style={styles.mainTitle}>{t('whereToGo')}</Text>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate('BookRide')}
        >
          <Text style={styles.bookButtonText}>📍 {t('bookRide')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuGrid}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('PaymentMethods')}
        >
          <Text style={styles.menuIcon}>💳</Text>
          <Text style={styles.menuText}>{t('paymentMethods')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('TripHistory')}
        >
          <Text style={styles.menuIcon}>📋</Text>
          <Text style={styles.menuText}>{t('tripHistory')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('BusinessAccount')}
        >
          <Text style={styles.menuIcon}>🏢</Text>
          <Text style={styles.menuText}>Business Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.menuIcon}>👤</Text>
          <Text style={styles.menuText}>{t('profile')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.menuIcon}>⚙️</Text>
          <Text style={styles.menuText}>{t('settings')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Support')}
        >
          <Text style={styles.menuIcon}>💬</Text>
          <Text style={styles.menuText}>{t('support')}</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FF6B00',
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  activeRideCard: {
    backgroundColor: '#4CAF50',
    margin: 15,
    padding: 20,
    borderRadius: 15,
  },
  activeRideTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  activeRideText: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 5,
  },
  mainCard: {
    backgroundColor: '#FFF',
    margin: 15,
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  bookButton: {
    backgroundColor: '#FF6B00',
    padding: 18,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  menuItem: {
    backgroundColor: '#FFF',
    width: '48%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});
