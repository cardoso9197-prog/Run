import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { rideAPI } from '../services/api';
import locationService from '../services/locationService';

export default function ActiveRideScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { rideId } = route.params;
  const [ride, setRide] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);

  useEffect(() => {
    loadRide();
    
    // Start location tracking when screen loads
    startLocationTracking();
    
    // Poll for location updates
    const locationInterval = setInterval(() => {
      updateDriverLocation();
    }, 5000); // Update every 5 seconds
    
    // Cleanup: stop tracking when leaving screen
    return () => {
      locationService.stopTracking();
      clearInterval(locationInterval);
    };
  }, []);

  const updateDriverLocation = async () => {
    try {
      const location = await locationService.getCurrentLocation();
      if (location) {
        setDriverLocation({
          latitude: location.latitude,
          longitude: location.longitude,
        });
      }
    } catch (error) {
      console.error('Failed to get current location:', error);
    }
  };

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
      const rideData = response.data;
      setRide(rideData);

      // Set initial map region to show pickup location
      if (rideData.pickup_lat && rideData.pickup_lon) {
        setMapRegion({
          latitude: parseFloat(rideData.pickup_lat),
          longitude: parseFloat(rideData.pickup_lon),
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const openNavigation = (destinationLat, destinationLon, destinationName) => {
    const destination = `${destinationLat},${destinationLon}`;
    const label = encodeURIComponent(destinationName || 'Destination');
    
    const scheme = Platform.select({
      ios: 'maps:',
      android: 'geo:',
    });
    
    const url = Platform.select({
      ios: `${scheme}?daddr=${destination}&dirflg=d`,
      android: `${scheme}0,0?q=${destination}(${label})&navigate=yes`,
    });

    // Try opening Google Maps first, fallback to default maps
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
    
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Linking.openURL(googleMapsUrl);
      }
    }).catch(() => {
      Alert.alert('Error', 'Could not open navigation app');
    });
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

  if (!ride) return <View style={styles.container}><Text style={styles.loadingText}>Loading ride details...</Text></View>;

  const pickupCoords = {
    latitude: parseFloat(ride.pickup_lat),
    longitude: parseFloat(ride.pickup_lon),
  };

  const dropoffCoords = {
    latitude: parseFloat(ride.dropoff_lat),
    longitude: parseFloat(ride.dropoff_lon),
  };

  // Determine current destination based on ride status
  const currentDestination = ride.status === 'accepted' ? pickupCoords : dropoffCoords;
  const currentDestinationName = ride.status === 'accepted' ? ride.pickup_address : ride.dropoff_address;
  const destinationIcon = ride.status === 'accepted' ? '📍' : '🎯';

  return (
    <View style={styles.container}>
      {/* Map View */}
      {mapRegion && (
        <MapView
          style={styles.map}
          region={mapRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
          provider={PROVIDER_GOOGLE}
        >
          {/* Pickup Marker */}
          <Marker
            coordinate={pickupCoords}
            title="Pickup Location"
            description={ride.pickup_address}
            pinColor={ride.status === 'accepted' ? '#4CAF50' : '#999'}
          />
          
          {/* Dropoff Marker */}
          <Marker
            coordinate={dropoffCoords}
            title="Dropoff Location"
            description={ride.dropoff_address}
            pinColor={ride.status === 'started' ? '#FF6B00' : '#999'}
          />

          {/* Route line between pickup and dropoff */}
          <Polyline
            coordinates={[pickupCoords, dropoffCoords]}
            strokeColor="#FF6B00"
            strokeWidth={3}
            lineDashPattern={[1, 10]}
          />
        </MapView>
      )}

      {/* Ride Details Card */}
      <View style={styles.detailsCard}>
        <View style={styles.header}>
          <Text style={styles.statusBadge}>
            {ride.status === 'accepted' ? '🚗 Heading to Pickup' : '🏁 En Route to Dropoff'}
          </Text>
          <Text style={styles.fareText}>{Math.round(ride.estimatedFare || ride.fare_estimate || 0).toLocaleString()} XOF</Text>
        </View>

        {/* Current Destination */}
        <View style={styles.destinationSection}>
          <Text style={styles.destinationLabel}>
            {destinationIcon} {ride.status === 'accepted' ? 'Pickup Location' : 'Dropoff Location'}
          </Text>
          <Text style={styles.destinationText} numberOfLines={2}>{currentDestinationName}</Text>
        </View>

        {/* Navigate Button */}
        <TouchableOpacity
          style={styles.navigateButton}
          onPress={() => openNavigation(currentDestination.latitude, currentDestination.longitude, currentDestinationName)}
        >
          <Text style={styles.navigateButtonText}>
            🧭 Navigate {ride.status === 'accepted' ? 'to Pickup' : 'to Dropoff'}
          </Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        {ride.status === 'accepted' && (
          <TouchableOpacity style={styles.actionButton} onPress={handleStart}>
            <Text style={styles.actionButtonText}>✅ {t('startTrip')}</Text>
          </TouchableOpacity>
        )}
        
        {ride.status === 'started' && (
          <TouchableOpacity style={[styles.actionButton, styles.completeButton]} onPress={handleComplete}>
            <Text style={styles.actionButtonText}>🏁 {t('completeTrip')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  map: {
    flex: 1,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusBadge: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  fareText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  destinationSection: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  destinationLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    marginBottom: 5,
  },
  destinationText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  navigateButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  navigateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#FF6B00',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
