import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { driverAPI } from '../services/api';

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const [driverName, setDriverName] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [todayEarnings, setTodayEarnings] = useState(0);

  useEffect(() => {
    loadDriverData();
  }, []);

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
