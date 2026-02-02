import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { rideAPI } from '../services/api';
import locationService from '../services/locationService';

export default function ActiveRideScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { rideId } = route.params;
  const [ride, setRide] = useState(null);

  useEffect(() => {
    loadRide();
    
    // Start location tracking when screen loads
    startLocationTracking();
    
    // Cleanup: stop tracking when leaving screen
    return () => {
      locationService.stopTracking();
    };
  }, []);

  const startLocationTracking = async () => {
    try {
      await locationService.startTracking();
      console.log('Location tracking started for active ride');
    } catch (error) {
      console.error('Failed to start location tracking:', error);
      // Don't block the ride if location fails
      Alert.alert(
        'Location Access',
        'Unable to access your location. Please enable location services for better experience.',
        [{ text: 'OK' }]
      );
    }
  };

  const loadRide = async () => {
    try {
      const response = await rideAPI.getRideDetails(rideId);
      setRide(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleStart = async () => {
    try {
      await rideAPI.startRide(rideId);
      loadRide();
      Alert.alert('Success', 'Trip started!');
    } catch (error) {
      Alert.alert('Error', 'Failed to start trip');
    }
  };

  const handleComplete = async () => {
    try {
      await rideAPI.completeRide(rideId);
      
      // Stop location tracking when ride completes
      locationService.stopTracking();
      
      Alert.alert('Success', 'Trip completed!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to complete trip');
    }
  };

  if (!ride) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{t('activeRide')}</Text>
        <Text style={styles.text}>From: {ride.pickup_address}</Text>
        <Text style={styles.text}>To: {ride.dropoff_address}</Text>
        <Text style={styles.fare}>Fare: {ride.fare_estimate} XOF</Text>
        
        {ride.status === 'accepted' && (
          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <Text style={styles.buttonText}>{t('startTrip')}</Text>
          </TouchableOpacity>
        )}
        
        {ride.status === 'started' && (
          <TouchableOpacity style={styles.button} onPress={handleComplete}>
            <Text style={styles.buttonText}>{t('completeTrip')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 15 },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 15 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  text: { fontSize: 16, marginBottom: 10 },
  fare: { fontSize: 20, fontWeight: 'bold', color: '#4CAF50', marginVertical: 20 },
  button: { backgroundColor: '#FF6B00', padding: 18, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
});
