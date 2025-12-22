import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { rideAPI } from '../services/api';

export default function ActiveRideScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { rideId } = route.params;
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    loadRideDetails();
    const interval = setInterval(loadRideDetails, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Update map region when driver location changes
  useEffect(() => {
    if (ride?.driver?.currentLocation && mapRef.current && ride.status === 'accepted') {
      updateMapRegion();
    }
  }, [ride?.driver?.currentLocation]);

  const loadRideDetails = async () => {
    try {
      const response = await rideAPI.getRideDetails(rideId);
      setRide(response.data);
    } catch (error) {
      console.error('Error loading ride:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMapRegion = () => {
    if (!ride?.driver?.currentLocation || !ride?.pickupLocation) return;

    const driverLoc = ride.driver.currentLocation;
    const pickupLoc = ride.pickupLocation;

    mapRef.current.fitToCoordinates([
      { latitude: driverLoc.latitude, longitude: driverLoc.longitude },
      { latitude: pickupLoc.latitude, longitude: pickupLoc.longitude },
    ], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: true,
    });
  };

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Calculate ETA in minutes
  const calculateETA = () => {
    if (!ride?.driver?.currentLocation || !ride?.pickupLocation) return null;

    const driverLoc = ride.driver.currentLocation;
    const pickupLoc = ride.pickupLocation;

    const distance = calculateDistance(
      driverLoc.latitude,
      driverLoc.longitude,
      pickupLoc.latitude,
      pickupLoc.longitude
    );

    // Average speed in Bissau: ~20 km/h (accounting for traffic)
    const averageSpeed = 20;
    const etaHours = distance / averageSpeed;
    const etaMinutes = Math.ceil(etaHours * 60);

    // Minimum 1 minute ETA
    return Math.max(1, etaMinutes);
  };

  const handleCancelRide = () => {
    Alert.alert('Cancel Ride', 'Are you sure you want to cancel this ride?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            await rideAPI.cancelRide(rideId);
            Alert.alert('Cancelled', 'Ride cancelled successfully', [
              { text: 'OK', onPress: () => navigation.navigate('Home') },
            ]);
          } catch (error) {
            Alert.alert('Error', 'Failed to cancel ride');
          }
        },
      },
    ]);
  };

  const getStatusText = (status) => {
    const statusMap = {
      requested: 'Looking for driver...',
      accepted: 'Driver on the way',
      started: 'Trip in progress',
      completed: 'Trip completed',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      requested: '#FFA500',
      accepted: '#4CAF50',
      started: '#2196F3',
      completed: '#9C27B0',
    };
    return colorMap[status] || '#666';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!ride) {
    return (
      <View style={styles.container}>
        <Text>Ride not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View
        style={[
          styles.statusCard,
          { backgroundColor: getStatusColor(ride.status) },
        ]}
      >
        <Text style={styles.statusText}>{getStatusText(ride.status)}</Text>
      </View>

      {/* Map View */}
      {ride.pickupLocation && ride.dropoffLocation && (
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
          <Marker
            coordinate={ride.pickupLocation}
            pinColor="green"
            title="Pickup"
            description={ride.pickupAddress}
          />

          {/* Dropoff Marker */}
          <Marker
            coordinate={ride.dropoffLocation}
            pinColor="red"
            title="Dropoff"
            description={ride.dropoffAddress}
          />

          {/* Driver Location & Route (when driver is on the way) */}
          {ride.driver?.currentLocation && ride.status === 'accepted' && (
            <>
              <Marker
                coordinate={{
                  latitude: ride.driver.currentLocation.latitude,
                  longitude: ride.driver.currentLocation.longitude,
                }}
                pinColor="blue"
                title="Driver"
                description={ride.driver.name}
              >
                <View style={styles.driverMarker}>
                  <Text style={styles.driverMarkerText}>🚗</Text>
                </View>
              </Marker>

              {/* Route line from driver to pickup */}
              <Polyline
                coordinates={[
                  {
                    latitude: ride.driver.currentLocation.latitude,
                    longitude: ride.driver.currentLocation.longitude,
                  },
                  ride.pickupLocation,
                ]}
                strokeColor="#2196F3"
                strokeWidth={3}
                lineDashPattern={[5, 5]}
              />
            </>
          )}

          {/* Trip route (when trip started) */}
          {ride.status === 'started' && (
            <Polyline
              coordinates={[ride.pickupLocation, ride.dropoffLocation]}
              strokeColor="#4CAF50"
              strokeWidth={3}
            />
          )}
        </MapView>
      )}

      {/* ETA Display (when driver is on the way) */}
      {ride.driver?.currentLocation && ride.status === 'accepted' && (
        <View style={styles.etaCard}>
          <Text style={styles.etaLabel}>Driver arriving in:</Text>
          <Text style={styles.etaTime}>{calculateETA()} min</Text>
          <Text style={styles.etaSubtext}>
            Track your driver in real-time on the map
          </Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📍 Route</Text>
        <View style={styles.routeContainer}>
          <Text style={styles.locationLabel}>From:</Text>
          <Text style={styles.locationText}>{ride.pickupAddress}</Text>
          <Text style={styles.locationLabel}>To:</Text>
          <Text style={styles.locationText}>{ride.dropoffAddress}</Text>
        </View>

        {ride.driver && (
          <>
            <Text style={styles.sectionTitle}>👤 Driver Info</Text>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{ride.driver.name}</Text>
              <Text style={styles.driverDetails}>
                {ride.driver.vehicle_make} {ride.driver.vehicle_model}
              </Text>
              <Text style={styles.driverDetails}>
                Plate: {ride.driver.vehicle_plate}
              </Text>
              <Text style={styles.driverDetails}>
                Phone: {ride.driver.phone}
              </Text>
            </View>
          </>
        )}

        <View style={styles.fareSection}>
          <Text style={styles.fareLabel}>{t('fare')}</Text>
          <Text style={styles.fareAmount}>
            {ride.final_fare || ride.fare_estimate} XOF
          </Text>
        </View>

        {ride.status !== 'completed' && ride.status !== 'cancelled' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelRide}
          >
            <Text style={styles.cancelButtonText}>{t('cancelRide')}</Text>
          </TouchableOpacity>
        )}

        {ride.status === 'completed' && (
          <TouchableOpacity
            style={styles.rateButton}
            onPress={() =>
              navigation.navigate('TripDetails', { rideId: ride.id })
            }
          >
            <Text style={styles.rateButtonText}>{t('rateDriver')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  statusCard: {
    padding: 20,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#000',
  },
  routeContainer: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  locationLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 5,
  },
  driverInfo: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  driverName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  driverDetails: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  fareSection: {
    backgroundColor: '#FF6B00',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 15,
  },
  fareLabel: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  fareAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  cancelButton: {
    backgroundColor: '#FF5252',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rateButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  rateButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 12,
  },
  etaCard: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    marginHorizontal: 20,
  },
  etaLabel: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  etaTime: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  etaSubtext: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 5,
    opacity: 0.9,
  },
  driverMarker: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  driverMarkerText: {
    fontSize: 20,
  },
});
