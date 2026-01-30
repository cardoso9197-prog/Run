import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { rideAPI } from '../services/api';

export default function TripHistoryScreen({ navigation }) {
  const { t } = useTranslation();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const response = await rideAPI.getTripHistory();
      setTrips(response.data);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTrip = ({ item }) => (
    <TouchableOpacity
      style={styles.tripCard}
      onPress={() => navigation.navigate('TripDetails', { rideId: item.id })}
    >
      <View style={styles.tripHeader}>
        <Text style={styles.tripDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
        <Text style={styles.tripStatus}>{item.status}</Text>
      </View>
      <Text style={styles.tripRoute}>
        {item.pickup_address} → {item.dropoff_address}
      </Text>
      <View style={styles.tripFooter}>
        <Text style={styles.tripVehicle}>{item.vehicle_type}</Text>
        <Text style={styles.tripFare}>{item.final_fare || item.fare_estimate} XOF</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={trips}
        renderItem={renderTrip}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No trips yet</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 15 },
  tripCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  tripHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  tripDate: { fontSize: 14, color: '#666' },
  tripStatus: { fontSize: 14, fontWeight: 'bold', color: '#4CAF50' },
  tripRoute: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#000' },
  tripFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  tripVehicle: { fontSize: 14, color: '#666' },
  tripFare: { fontSize: 16, fontWeight: 'bold', color: '#FF6B00' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' },
});
