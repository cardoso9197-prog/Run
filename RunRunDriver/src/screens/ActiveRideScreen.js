import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, Platform, ActivityIndicator } from 'react-native';import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { rideAPI } from '../services/api';
import locationService from '../services/locationService';

export default function ActiveRideScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { rideId } = route.params;
  const [ride, setRide] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [driverHeading, setDriverHeading] = useState(0);
  const prevDriverLoc = useRef(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadRide();
    startLocationTracking();

    const locationInterval = setInterval(() => {
      updateDriverLocation();
    }, 5000);

    // Poll ride status every 10 seconds
    const rideInterval = setInterval(() => {
      loadRide();
    }, 10000);

    return () => {
      locationService.stopTracking();
      clearInterval(locationInterval);
      clearInterval(rideInterval);
    };
  }, []);

  const updateDriverLocation = async () => {
    try {
      const location = await locationService.getCurrentLocation();
      if (location) {
        const newLoc = {
          latitude: location.latitude,
          longitude: location.longitude,
        };
        // Calculate heading from movement
        if (prevDriverLoc.current) {
          const dLat = newLoc.latitude - prevDriverLoc.current.latitude;
          const dLon = newLoc.longitude - prevDriverLoc.current.longitude;
          if (Math.abs(dLat) > 0.00001 || Math.abs(dLon) > 0.00001) {
            const heading = (Math.atan2(dLon, dLat) * 180) / Math.PI;
            setDriverHeading(heading);
          }
        }
        prevDriverLoc.current = newLoc;
        setDriverLocation(newLoc);
      }
    } catch (error) {
      console.error('Failed to get current location:', error);
    }
  };

  const startLocationTracking = async () => {
    try {
      await locationService.startTracking();
    } catch (error) {
      console.error('Failed to start location tracking:', error);
    }
  };

  const loadRide = async () => {
    try {
      const response = await rideAPI.getRideDetails(rideId);
      const rideData = response.data;
      setRide(rideData);

      const pickupLat = rideData.pickupLocation?.latitude ?? rideData.pickup_lat;
      const pickupLon = rideData.pickupLocation?.longitude ?? rideData.pickup_lon;
      const dropoffLat = rideData.dropoffLocation?.latitude ?? rideData.dropoff_lat;
      const dropoffLon = rideData.dropoffLocation?.longitude ?? rideData.dropoff_lon;

      if (pickupLat && pickupLon) {
        if (rideData.status === 'started' && dropoffLat && dropoffLon) {
          // Show dropoff when trip started
          setMapRegion({
            latitude: parseFloat(dropoffLat),
            longitude: parseFloat(dropoffLon),
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          });
        } else {
          setMapRegion({
            latitude: parseFloat(pickupLat),
            longitude: parseFloat(pickupLon),
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          });
        }
      }

      // If ride completed or cancelled, navigate back
      if (rideData.status === 'completed' || rideData.status === 'cancelled') {
        locationService.stopTracking();
        Alert.alert(
          rideData.status === 'completed' ? '✅ Trip Completed!' : '❌ Ride Cancelled',
          rideData.status === 'completed'
            ? `Trip completed. Earnings: ${Math.round((rideData.finalFare || rideData.estimatedFare || 0) * 0.8).toLocaleString()} XOF`
            : 'The ride has been cancelled.',
          [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
        );
      }
    } catch (error) {
      console.error('Error loading ride:', error);
    }
  };

  const openNavigation = (destinationLat, destinationLon, destinationName) => {
    if (!destinationLat || !destinationLon || isNaN(destinationLat) || isNaN(destinationLon)) {
      Alert.alert('Error', 'Destination coordinates not available');
      return;
    }
    const label = encodeURIComponent(destinationName || 'Destination');
    const destination = `${destinationLat},${destinationLon}`;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
    const googleMapsApp = Platform.select({
      ios: `comgooglemaps://?daddr=${destination}&directionsmode=driving`,
      android: `google.navigation:q=${destination}&mode=d`,
    });
    Linking.canOpenURL(googleMapsApp)
      .then((supported) => Linking.openURL(supported ? googleMapsApp : googleMapsUrl))
      .catch(() => Linking.openURL(googleMapsUrl));
  };

  const handleArrived = async () => {
    Alert.alert(
      '📍 Arrived at Pickup?',
      'Confirm you have arrived at the pickup location. The passenger will be notified.',
      [
        { text: 'Not Yet', style: 'cancel' },
        {
          text: 'Yes, I Arrived',
          onPress: async () => {
            setActionLoading(true);
            try {
              await rideAPI.arrivedAtPickup(rideId);
              await loadRide();
              Alert.alert('✅ Passenger Notified', 'The passenger has been notified that you arrived!');
            } catch (error) {
              console.error('Arrived error:', error.response?.data || error.message);
              Alert.alert('Error', error.response?.data?.error || 'Failed to update status. Try again.');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleStart = async () => {
    Alert.alert(
      '🚀 Start Trip?',
      'Confirm the passenger is in the vehicle and start the trip.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Trip',
          onPress: async () => {
            setActionLoading(true);
            try {
              await rideAPI.startRide(rideId);
              await loadRide();
            } catch (error) {
              console.error('Start error:', error.response?.data || error.message);
              Alert.alert('Error', error.response?.data?.error || 'Failed to start trip. Try again.');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleComplete = async () => {
    Alert.alert(
      '🏁 Complete Trip?',
      'Confirm you have reached the dropoff location.',
      [
        { text: 'Not Yet', style: 'cancel' },
        {
          text: 'Complete Trip',
          onPress: async () => {
            setActionLoading(true);
            try {
              await rideAPI.completeRide(rideId);
              locationService.stopTracking();
              Alert.alert('✅ Trip Completed!', 'Great job! Your earnings have been recorded.', [
                { text: 'OK', onPress: () => navigation.navigate('Home') },
              ]);
            } catch (error) {
              console.error('Complete error:', error.response?.data || error.message);
              Alert.alert('Error', error.response?.data?.error || 'Failed to complete trip. Try again.');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      '❌ Cancel Ride?',
      'Are you sure you want to cancel this ride? Only cancel if absolutely necessary.',
      [
        { text: 'No, Continue', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setActionLoading(true);
            try {
              await rideAPI.cancelRide(rideId, 'Driver cancelled');
              locationService.stopTracking();
              Alert.alert('Ride Cancelled', 'The ride has been cancelled and the passenger notified.', [
                { text: 'OK', onPress: () => navigation.navigate('Home') },
              ]);
            } catch (error) {
              console.error('Cancel error:', error.response?.data || error.message);
              Alert.alert('Error', error.response?.data?.error || 'Failed to cancel ride. Try again.');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  if (!ride) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>Loading ride details...</Text>
      </View>
    );
  }

  const pickupCoords = {
    latitude: parseFloat(ride.pickupLocation?.latitude ?? ride.pickup_lat ?? 0),
    longitude: parseFloat(ride.pickupLocation?.longitude ?? ride.pickup_lon ?? 0),
  };
  const dropoffCoords = {
    latitude: parseFloat(ride.dropoffLocation?.latitude ?? ride.dropoff_lat ?? 0),
    longitude: parseFloat(ride.dropoffLocation?.longitude ?? ride.dropoff_lon ?? 0),
  };
  const pickupAddress = ride.pickupAddress || ride.pickup_address || 'Pickup';
  const dropoffAddress = ride.dropoffAddress || ride.dropoff_address || 'Dropoff';

  // Current destination depends on status
  const isHeadingToPickup = ride.status === 'accepted' || ride.status === 'arrived';
  const currentDestination = isHeadingToPickup ? pickupCoords : dropoffCoords;
  const currentDestinationName = isHeadingToPickup ? pickupAddress : dropoffAddress;

  const statusLabels = {
    accepted: '🚗 Heading to Pickup',
    arrived: '📍 Arrived at Pickup',
    started: '🏁 En Route to Dropoff',
  };

  return (
    <View style={styles.container}>
      {mapRegion && (
        <MapView
          style={styles.map}
          region={mapRegion}
          showsUserLocation={false}
          showsMyLocationButton={true}
          provider={PROVIDER_GOOGLE}
        >
          {/* Driver's own position — animated car icon */}
          {driverLocation && (
            <Marker
              coordinate={driverLocation}
              anchor={{ x: 0.5, y: 0.5 }}
              flat={true}
              rotation={driverHeading}
              title="You"
            >
              <View style={styles.driverCarMarker}>
                <Text style={styles.driverCarIcon}>🚖</Text>
              </View>
            </Marker>
          )}

          <Marker coordinate={pickupCoords} title="Pickup" description={pickupAddress} pinColor={ride.status === 'started' ? '#999' : '#4CAF50'} />
          <Marker coordinate={dropoffCoords} title="Dropoff" description={dropoffAddress} pinColor={ride.status === 'started' ? '#FF6B00' : '#999'} />
          <Polyline
            coordinates={[pickupCoords, dropoffCoords]}
            strokeColor={ride.status === 'started' ? '#FF6B00' : '#2196F3'}
            strokeWidth={3}
            lineDashPattern={[1, 10]}
          />
        </MapView>
      )}

      <View style={styles.detailsCard}>
        <View style={styles.header}>
          <Text style={styles.statusBadge}>{statusLabels[ride.status] || ride.status}</Text>
          <Text style={styles.fareText}>{Math.round(ride.estimatedFare || ride.fare_estimate || ride.estimated_fare || 0).toLocaleString()} XOF</Text>
        </View>

        {/* Passenger info */}
        {ride.passenger && (
          <View style={styles.passengerRow}>
            <Text style={styles.passengerLabel}>👤 Passenger:</Text>
            <Text style={styles.passengerName}>{ride.passenger.name}</Text>
          </View>
        )}

        <View style={styles.destinationSection}>
          <Text style={styles.destinationLabel}>
            {isHeadingToPickup ? '📍 Pickup Location' : '🎯 Dropoff Location'}
          </Text>
          <Text style={styles.destinationText} numberOfLines={2}>{currentDestinationName}</Text>
        </View>

        <TouchableOpacity
          style={styles.navigateButton}
          onPress={() => openNavigation(currentDestination.latitude, currentDestination.longitude, currentDestinationName)}
        >
          <Text style={styles.navigateButtonText}>
            🧭 Navigate {isHeadingToPickup ? 'to Pickup' : 'to Dropoff'}
          </Text>
        </TouchableOpacity>

        {/* STEP 1: Accepted → Mark Arrived */}
        {ride.status === 'accepted' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.arrivedButton, actionLoading && styles.disabledButton]}
            onPress={handleArrived}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.actionButtonText}>📍 I've Arrived at Pickup</Text>
            )}
          </TouchableOpacity>
        )}

        {/* STEP 2: Arrived → Start Trip */}
        {ride.status === 'arrived' && (
          <TouchableOpacity
            style={[styles.actionButton, actionLoading && styles.disabledButton]}
            onPress={handleStart}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.actionButtonText}>✅ {t('startTrip')}</Text>
            )}
          </TouchableOpacity>
        )}

        {/* STEP 3: Started → Complete Trip */}
        {ride.status === 'started' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton, actionLoading && styles.disabledButton]}
            onPress={handleComplete}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.actionButtonText}>🏁 {t('completeTrip')}</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Cancel button — only for accepted/arrived (not after trip started) */}
        {(ride.status === 'accepted' || ride.status === 'arrived') && (
          <TouchableOpacity
            style={[styles.cancelButton, actionLoading && styles.disabledButton]}
            onPress={handleCancel}
            disabled={actionLoading}
          >
            <Text style={styles.cancelButtonText}>❌ Cancel Ride</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  map: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 15 },

  // Driver car icon on map
  driverCarMarker: {
    backgroundColor: '#FF6B00',
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  driverCarIcon: { fontSize: 22 },
  detailsCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 10,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statusBadge: { fontSize: 15, fontWeight: 'bold', color: '#FF6B00', flex: 1, flexWrap: 'wrap' },
  fareText: { fontSize: 20, fontWeight: 'bold', color: '#4CAF50' },
  passengerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  passengerLabel: { fontSize: 13, color: '#666', marginRight: 6 },
  passengerName: { fontSize: 14, fontWeight: '700', color: '#333' },
  destinationSection: { backgroundColor: '#F9F9F9', padding: 12, borderRadius: 12, marginBottom: 12 },
  destinationLabel: { fontSize: 13, color: '#666', fontWeight: '600', marginBottom: 4 },
  destinationText: { fontSize: 15, color: '#333', fontWeight: '500' },
  navigateButton: { backgroundColor: '#2196F3', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  navigateButtonText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  actionButton: { backgroundColor: '#FF6B00', padding: 18, borderRadius: 12, alignItems: 'center' },
  arrivedButton: { backgroundColor: '#9C27B0' },
  completeButton: { backgroundColor: '#4CAF50' },
  disabledButton: { opacity: 0.6 },
  actionButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  cancelButton: {
    backgroundColor: '#FFF', padding: 14, borderRadius: 12, alignItems: 'center',
    marginTop: 10, borderWidth: 2, borderColor: '#F44336',
  },
  cancelButtonText: { color: '#F44336', fontSize: 16, fontWeight: 'bold' },
});
