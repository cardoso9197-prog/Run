import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { driverAPI } from '../services/api';

export default function AvailableRidesScreen({ navigation }) {
  const { t } = useTranslation();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRides();
    const interval = setInterval(loadRides, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadRides = async () => {
    try {
      const response = await driverAPI.getAvailableRides();
      setRides(response.data);
    } catch (error) {
      console.error('Error loading rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (rideId) => {
    try {
      await driverAPI.acceptRide(rideId);
      Alert.alert('Success', 'Ride accepted!', [
        { text: 'OK', onPress: () => navigation.navigate('ActiveRide', { rideId }) },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to accept ride');
    }
  };

  const renderRide = ({ item }) => (
    <View style={styles.rideCard}>
      <Text style={styles.rideTitle}>From: {item.pickup_address}</Text>
      <Text style={styles.rideText}>To: {item.dropoff_address}</Text>
      <Text style={styles.rideFare}>Fare: {item.fare_estimate} XOF</Text>
      <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item.id)}>
        <Text style={styles.acceptButtonText}>{t('accept')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={rides}
        renderItem={renderRide}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{loading ? 'Loading...' : 'No available rides'}</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 15 },
  rideCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 15, marginBottom: 15 },
  rideTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  rideText: { fontSize: 14, color: '#666', marginBottom: 5 },
  rideFare: { fontSize: 18, fontWeight: 'bold', color: '#4CAF50', marginBottom: 15 },
  acceptButton: { backgroundColor: '#FF6B00', padding: 15, borderRadius: 10, alignItems: 'center' },
  acceptButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' },
});
