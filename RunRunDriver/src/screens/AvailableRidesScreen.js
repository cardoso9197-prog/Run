import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import { driverAPI } from '../services/api';

export default function AvailableRidesScreen({ navigation }) {
  const { t } = useTranslation();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driverLocation, setDriverLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    getDriverLocation();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Start polling once we have the driver's location
  useEffect(() => {
    if (driverLocation) {
      loadRides();
      intervalRef.current = setInterval(loadRides, 5000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [driverLocation]);

  const getDriverLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission denied. Cannot find nearby rides.');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      console.log('📍 Driver location:', location.coords.latitude, location.coords.longitude);
      setDriverLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Location error:', error);
      setLocationError('Failed to get your location. Please enable GPS.');
      setLoading(false);
    }
  };

  const loadRides = async () => {
    if (!driverLocation) return;
    
    try {
      const response = await driverAPI.getAvailableRides(
        driverLocation.latitude,
        driverLocation.longitude
      );
      
      // Backend returns { success: true, rides: [...] }
      const ridesList = response.data.rides || response.data || [];
      console.log(`🚗 Found ${ridesList.length} available rides`);
      setRides(ridesList);
    } catch (error) {
      console.error('Error loading rides:', error.response?.data || error.message);
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
      const msg = error.response?.data?.error || error.response?.data?.message || 'Failed to accept ride';
      Alert.alert('Error', msg);
    }
  };

  const renderRide = ({ item }) => {
    const vehicleIcon = item.vehicleType === 'Moto' ? '🏍️' : item.vehicleType === 'Premium' ? '🚙' : '🚗';
    const vehicleLabel = item.vehicleType || 'Normal';

    return (
    <View style={styles.rideCard}>
      <View style={styles.rideHeader}>
        <Text style={styles.rideFare}>{Math.round(item.estimatedFare || 0).toLocaleString()} XOF</Text>
        {item.distanceToPickup != null && (
          <Text style={styles.rideDistance}>{item.distanceToPickup.toFixed(1)} km away</Text>
        )}
      </View>

      {/* Vehicle type badge */}
      <View style={[
        styles.vehicleBadge,
        item.vehicleType === 'Moto'    && styles.vehicleBadgeMoto,
        item.vehicleType === 'Premium' && styles.vehicleBadgePremium,
        item.vehicleType === 'Normal'  && styles.vehicleBadgeNormal,
      ]}>
        <Text style={styles.vehicleBadgeText}>{vehicleIcon} {vehicleLabel}</Text>
      </View>

      <View style={styles.locationRow}>
        <Text style={styles.locationDot}>🟢</Text>
        <Text style={styles.rideTitle} numberOfLines={2}>{item.pickupAddress || 'Unknown pickup'}</Text>
      </View>
      <View style={styles.locationRow}>
        <Text style={styles.locationDot}>🔴</Text>
        <Text style={styles.rideText} numberOfLines={2}>{item.dropoffAddress || 'Unknown dropoff'}</Text>
      </View>
      {item.estimatedDistance != null && (
        <Text style={styles.tripInfo}>
          📏 {item.estimatedDistance.toFixed(1)} km • ⏱️ ~{item.estimatedDuration || '?'} min
        </Text>
      )}
      {item.passenger && (
        <Text style={styles.passengerInfo}>
          👤 {item.passenger.name || 'Passenger'} • ⭐ {item.passenger.rating?.toFixed(1) || 'N/A'}
        </Text>
      )}
      <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item.id)}>
        <Text style={styles.acceptButtonText}>✅ Accept Ride</Text>
      </TouchableOpacity>
    </View>
    );
  };

  if (locationError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>📍 {locationError}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={getDriverLocation}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>🚗 Available Rides</Text>
        <TouchableOpacity onPress={loadRides}>
          <Text style={styles.refreshText}>🔄 Refresh</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={rides}
        renderItem={renderRide}
        keyExtractor={(item) => item.id.toString()}
        refreshing={loading}
        onRefresh={loadRides}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {loading ? (
              <>
                <ActivityIndicator size="large" color="#FF6B00" />
                <Text style={styles.emptyText}>Searching for rides...</Text>
              </>
            ) : (
              <>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyText}>No available rides nearby</Text>
                <Text style={styles.emptySubtext}>New ride requests will appear here automatically</Text>
              </>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  refreshText: { fontSize: 14, color: '#FF6B00', fontWeight: '600' },
  rideCard: { backgroundColor: '#FFF', padding: 18, borderRadius: 15, marginHorizontal: 15, marginTop: 12, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  rideHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  rideFare: { fontSize: 22, fontWeight: 'bold', color: '#4CAF50' },
  rideDistance: { fontSize: 14, color: '#999', fontWeight: '500' },
  vehicleBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginBottom: 10 },
  vehicleBadgeMoto:    { backgroundColor: '#FFF3E0', borderWidth: 1, borderColor: '#FF6B00' },
  vehicleBadgeNormal:  { backgroundColor: '#E3F2FD', borderWidth: 1, borderColor: '#2196F3' },
  vehicleBadgePremium: { backgroundColor: '#F3E5F5', borderWidth: 1, borderColor: '#9C27B0' },
  vehicleBadgeText: { fontSize: 13, fontWeight: '700', color: '#333' },
  locationRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  locationDot: { marginRight: 8, fontSize: 12, marginTop: 2 },
  rideTitle: { fontSize: 15, fontWeight: '600', color: '#333', flex: 1 },
  rideText: { fontSize: 14, color: '#666', flex: 1 },
  tripInfo: { fontSize: 13, color: '#888', marginTop: 8 },
  passengerInfo: { fontSize: 13, color: '#666', marginTop: 4 },
  acceptButton: { backgroundColor: '#FF6B00', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 14 },
  acceptButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 50, marginBottom: 15 },
  emptyText: { textAlign: 'center', fontSize: 17, color: '#666', fontWeight: '600' },
  emptySubtext: { textAlign: 'center', fontSize: 14, color: '#999', marginTop: 8 },
  errorText: { fontSize: 16, color: '#E53935', textAlign: 'center', marginBottom: 20 },
  retryButton: { backgroundColor: '#FF6B00', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 10 },
  retryButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
