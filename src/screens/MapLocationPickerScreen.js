import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapLocationPickerScreen({ route, navigation }) {
  const { locationType } = route.params; // 'pickup' or 'dropoff'
  const [region, setRegion] = useState({
    latitude: 11.8636, // Bissau, Guinea-Bissau
    longitude: -15.5982,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    console.log('MapLocationPicker mounted for:', locationType);
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      console.log('Requesting location permissions...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('Location permission status:', status);
      
      if (status === 'granted') {
        console.log('Getting current position...');
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        console.log('Current location:', location.coords);
        
        const newRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        
        setRegion(newRegion);
        setSelectedLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        console.log('Location permission denied, using default location');
      }
    } catch (error) {
      console.error('Location error:', error);
      setMapError('Could not get your location. Using default location.');
    } finally {
      setLoading(false);
      console.log('Map loading complete');
    }
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleConfirm = async () => {
    if (!selectedLocation) {
      Alert.alert('Error', 'Please select a location on the map');
      return;
    }

    try {
      // Reverse geocode to get address
      const addresses = await Location.reverseGeocodeAsync({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      });

      let locationName = 'Selected Location';
      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        locationName = [
          address.name,
          address.street,
          address.district,
          address.city,
          address.region,
        ]
          .filter(Boolean)
          .join(', ') || 'Selected Location';
      }

      // Return to BookRide screen with location data
      navigation.navigate('BookRide', {
        [locationType]: {
          name: locationName,
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        },
      });
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      // Even if reverse geocoding fails, return coordinates
      navigation.navigate('BookRide', {
        [locationType]: {
          name: `${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}`,
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        },
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>Loading map...</Text>
        <Text style={styles.debugText}>Checking location permissions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {mapError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠️ {mapError}</Text>
        </View>
      )}
      
      <MapView
        style={styles.map}
        region={region}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onMapReady={() => console.log('Map is ready')}
        onError={(error) => {
          console.error('Map error:', error);
          setMapError('Map failed to load. Check your internet connection.');
        }}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title={locationType === 'pickup' ? 'Pickup Location' : 'Dropoff Location'}
            pinColor={locationType === 'pickup' ? '#4CAF50' : '#FF6B00'}
          />
        )}
      </MapView>

      <View style={styles.instructionBox}>
        <Text style={styles.instructionText}>
          📍 Tap on the map to select your {locationType} location
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
          disabled={!selectedLocation}
        >
          <Text style={styles.confirmButtonText}>
            {selectedLocation ? '✓ Confirm Location' : 'Select a location first'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  debugText: {
    marginTop: 5,
    fontSize: 12,
    color: '#999',
  },
  errorBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF6B00',
    padding: 10,
    zIndex: 1000,
  },
  errorText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 12,
  },
  map: {
    flex: 1,
  },
  instructionBox: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  instructionText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});
