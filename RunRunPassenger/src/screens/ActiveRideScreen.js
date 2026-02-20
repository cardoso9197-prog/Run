import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { rideAPI } from '../services/api';

export default function ActiveRideScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { rideId } = route.params;
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prevStatus, setPrevStatus] = useState(null);
  const mapRef = useRef(null);
  const arrivedAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadRideDetails();
    const interval = setInterval(loadRideDetails, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Fit map when driver location or status changes
  useEffect(() => {
    if (ride && mapRef.current) {
      fitMapToRide();
    }
  }, [ride?.driver?.currentLocation, ride?.status]);

  // Show arrived banner animation when driver arrives
  useEffect(() => {
    if (ride?.status === 'arrived' && prevStatus === 'accepted') {
      Animated.sequence([
        Animated.timing(arrivedAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.delay(8000),
        Animated.timing(arrivedAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    }
    if (ride?.status) setPrevStatus(ride.status);
  }, [ride?.status]);

  const fitMapToRide = () => {
    if (!mapRef.current) return;
    const coords = [];

    if (ride.pickupLocation) coords.push(ride.pickupLocation);
    if (ride.dropoffLocation) coords.push(ride.dropoffLocation);
    if (ride.driver?.currentLocation?.latitude) {
      coords.push({
        latitude: parseFloat(ride.driver.currentLocation.latitude),
        longitude: parseFloat(ride.driver.currentLocation.longitude),
      });
    }

    if (coords.length >= 2) {
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
        animated: true,
      });
    }
  };

  const loadRideDetails = async () => {
    try {
      const response = await rideAPI.getRideDetails(rideId);
      const rideData = response.data;
      setRide(rideData);
      setError(null);

      // Auto-navigate when completed
      if (rideData.status === 'completed') {
        navigation.replace('TripDetails', { rideId: rideData.id });
      }
    } catch (err) {
      console.error('Error loading ride:', err);
      let errorMessage = 'Failed to load ride details';
      if (err.response?.status === 404) {
        errorMessage = 'Ride not found. It may have been cancelled.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const calculateETA = () => {
    if (!ride?.driver?.currentLocation?.latitude || !ride?.pickupLocation) return null;
    const d = calculateDistance(
      parseFloat(ride.driver.currentLocation.latitude),
      parseFloat(ride.driver.currentLocation.longitude),
      ride.pickupLocation.latitude,
      ride.pickupLocation.longitude
    );
    return Math.max(1, Math.ceil((d / 20) * 60));
  };

  const handleCancelRide = () => {
    Alert.alert('Cancel Ride', 'Are you sure you want to cancel this ride?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          try {
            await rideAPI.cancelRide(rideId);
            Alert.alert('Cancelled', 'Ride cancelled successfully', [
              { text: 'OK', onPress: () => navigation.navigate('Home') },
            ]);
          } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to cancel ride');
          }
        },
      },
    ]);
  };

  const getStatusInfo = (status) => {
    const map = {
      requested:  { text: '🔍 Looking for driver...', color: '#FFA500' },
      accepted:   { text: '🚗 Driver on the way',     color: '#2196F3' },
      arrived:    { text: '📍 Driver has arrived!',   color: '#9C27B0' },
      started:    { text: '🏁 Trip in progress',      color: '#4CAF50' },
      completed:  { text: '✅ Trip completed',        color: '#9C27B0' },
    };
    return map[status] || { text: status, color: '#666' };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>🔍 Loading your ride...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => { setError(null); setLoading(true); loadRideDetails(); }}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.retryButton, { marginTop: 10, backgroundColor: '#666' }]} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!ride) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>⚠️ Ride not found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusInfo = getStatusInfo(ride.status);
  const hasDriverLocation = ride.driver?.currentLocation?.latitude != null;
  const driverCoords = hasDriverLocation ? {
    latitude: parseFloat(ride.driver.currentLocation.latitude),
    longitude: parseFloat(ride.driver.currentLocation.longitude),
  } : null;

  // Show driver tracking on map for accepted/arrived/started
  const showDriverOnMap = hasDriverLocation && ['accepted', 'arrived', 'started'].includes(ride.status);

  // Route line: driver→pickup when on the way; pickup→dropoff when started
  const routeCoords = ride.status === 'started'
    ? [ride.pickupLocation, ride.dropoffLocation]
    : (driverCoords && ride.pickupLocation ? [driverCoords, ride.pickupLocation] : []);

  const eta = calculateETA();

  return (
    <View style={styles.container}>
      {/* Map */}
      {ride.pickupLocation && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: ride.pickupLocation.latitude,
            longitude: ride.pickupLocation.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          {/* Pickup Marker */}
          <Marker coordinate={ride.pickupLocation} pinColor="green" title="Pickup" description={ride.pickupAddress} />

          {/* Dropoff Marker */}
          {ride.dropoffLocation && (
            <Marker coordinate={ride.dropoffLocation} pinColor="red" title="Dropoff" description={ride.dropoffAddress} />
          )}

          {/* Driver Marker — shown for accepted / arrived / started */}
          {showDriverOnMap && (
            <Marker coordinate={driverCoords} title="Your Driver" description={ride.driver.name}>
              <View style={[styles.driverMarker, ride.status === 'arrived' && styles.driverMarkerArrived]}>
                <Text style={styles.driverMarkerText}>🚗</Text>
              </View>
            </Marker>
          )}

          {/* Route line */}
          {routeCoords.length >= 2 && (
            <Polyline
              coordinates={routeCoords}
              strokeColor={ride.status === 'started' ? '#4CAF50' : '#2196F3'}
              strokeWidth={3}
              lineDashPattern={ride.status === 'started' ? undefined : [5, 5]}
            />
          )}
        </MapView>
      )}

      {/* Driver Arrived Banner (animated) */}
      <Animated.View
        style={[
          styles.arrivedBanner,
          {
            opacity: arrivedAnim,
            transform: [{ translateY: arrivedAnim.interpolate({ inputRange: [0, 1], outputRange: [-80, 0] }) }],
          },
        ]}
      >
        <Text style={styles.arrivedBannerText}>🚗 Your driver has arrived!</Text>
        <Text style={styles.arrivedBannerSub}>Please come out to the pickup point</Text>
      </Animated.View>

      {/* Bottom info card */}
      <ScrollView style={styles.bottomSheet} showsVerticalScrollIndicator={false}>
        {/* Status bar */}
        <View style={[styles.statusCard, { backgroundColor: statusInfo.color }]}>
          <Text style={styles.statusText}>{statusInfo.text}</Text>
        </View>

        {/* ETA card — only when driver is on the way */}
        {ride.status === 'accepted' && eta && (
          <View style={styles.etaCard}>
            <Text style={styles.etaLabel}>Driver arriving in</Text>
            <Text style={styles.etaTime}>{eta} min</Text>
            <Text style={styles.etaSubtext}>Live tracking active</Text>
          </View>
        )}

        {/* Arrived static banner in card */}
        {ride.status === 'arrived' && (
          <View style={styles.arrivedCard}>
            <Text style={styles.arrivedCardTitle}>🚗 Driver Arrived!</Text>
            <Text style={styles.arrivedCardSub}>Your driver is waiting at the pickup point</Text>
          </View>
        )}

        {/* Started info */}
        {ride.status === 'started' && (
          <View style={styles.startedCard}>
            <Text style={styles.startedCardTitle}>🏁 Trip in Progress</Text>
            <Text style={styles.startedCardSub}>You're on your way to {ride.dropoffAddress}</Text>
          </View>
        )}

        <View style={styles.card}>
          {/* Route */}
          <Text style={styles.sectionTitle}>📍 Route</Text>
          <View style={styles.routeContainer}>
            <Text style={styles.locationLabel}>From:</Text>
            <Text style={styles.locationText}>{ride.pickupAddress}</Text>
            <Text style={styles.locationLabel}>To:</Text>
            <Text style={styles.locationText}>{ride.dropoffAddress}</Text>
          </View>

          {/* Driver Info */}
          {ride.driver && (
            <>
              <Text style={styles.sectionTitle}>👤 Driver</Text>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{ride.driver.name}</Text>
                {ride.vehicle?.vehicleType && (
                  <Text style={styles.driverDetails}>🚗 {ride.vehicle.vehicleType}</Text>
                )}
                <Text style={styles.driverDetails}>📞 {ride.driver.phone}</Text>
              </View>
            </>
          )}

          {/* Fare */}
          <View style={styles.fareSection}>
            <Text style={styles.fareLabel}>Estimated Fare</Text>
            <Text style={styles.fareAmount}>
              {Math.round(ride.finalFare || ride.estimatedFare || 0).toLocaleString()} XOF
            </Text>
          </View>

          {/* Cancel button — only for requested/accepted/arrived */}
          {['requested', 'accepted', 'arrived'].includes(ride.status) && (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelRide}>
              <Text style={styles.cancelButtonText}>{t('cancelRide')}</Text>
            </TouchableOpacity>
          )}

          {/* Rate button when completed */}
          {ride.status === 'completed' && (
            <TouchableOpacity
              style={styles.rateButton}
              onPress={() => navigation.navigate('TripDetails', { rideId: ride.id })}
            >
              <Text style={styles.rateButtonText}>{t('rateDriver')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  map: { height: 320, width: '100%' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', padding: 20 },
  loadingText: { marginTop: 20, fontSize: 18, fontWeight: '600', color: '#333', textAlign: 'center' },
  errorText: { fontSize: 18, color: '#d32f2f', textAlign: 'center', marginBottom: 20 },
  retryButton: { backgroundColor: '#FF6B00', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  retryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  // Map markers
  driverMarker: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  driverMarkerArrived: { backgroundColor: '#9C27B0' },
  driverMarkerText: { fontSize: 20 },

  // Animated arrived banner (top of screen)
  arrivedBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#9C27B0',
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 20,
  },
  arrivedBannerText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  arrivedBannerSub: { color: '#FFF', fontSize: 13, marginTop: 4, opacity: 0.9 },

  bottomSheet: { flex: 1 },
  statusCard: { padding: 16, alignItems: 'center' },
  statusText: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },

  etaCard: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    margin: 15,
    marginBottom: 0,
  },
  etaLabel: { color: '#FFF', fontSize: 13, fontWeight: '500', marginBottom: 4 },
  etaTime: { color: '#FFF', fontSize: 36, fontWeight: 'bold' },
  etaSubtext: { color: '#FFF', fontSize: 12, marginTop: 4, opacity: 0.9 },

  arrivedCard: {
    backgroundColor: '#9C27B0',
    margin: 15,
    marginBottom: 0,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  arrivedCardTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  arrivedCardSub: { color: '#FFF', fontSize: 13, marginTop: 4, opacity: 0.9, textAlign: 'center' },

  startedCard: {
    backgroundColor: '#4CAF50',
    margin: 15,
    marginBottom: 0,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startedCardTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  startedCardSub: { color: '#FFF', fontSize: 13, marginTop: 4, opacity: 0.9, textAlign: 'center' },

  card: {
    backgroundColor: '#FFF',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', marginTop: 12, marginBottom: 8, color: '#000' },
  routeContainer: { backgroundColor: '#F9F9F9', padding: 14, borderRadius: 10, marginBottom: 12 },
  locationLabel: { fontSize: 13, color: '#666', marginTop: 8 },
  locationText: { fontSize: 15, fontWeight: '600', color: '#000', marginBottom: 4 },
  driverInfo: { backgroundColor: '#F9F9F9', padding: 14, borderRadius: 10, marginBottom: 12 },
  driverName: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 6 },
  driverDetails: { fontSize: 15, color: '#666', marginBottom: 4 },
  fareSection: { backgroundColor: '#FF6B00', padding: 18, borderRadius: 10, alignItems: 'center', marginVertical: 12 },
  fareLabel: { fontSize: 15, color: '#FFF', marginBottom: 4 },
  fareAmount: { fontSize: 30, fontWeight: 'bold', color: '#FFF' },
  cancelButton: { backgroundColor: '#FF5252', padding: 16, borderRadius: 10, alignItems: 'center' },
  cancelButtonText: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
  rateButton: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 10, alignItems: 'center' },
  rateButtonText: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
});
