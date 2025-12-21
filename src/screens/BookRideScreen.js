import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';
import { rideAPI, passengerAPI } from '../services/api';

export default function BookRideScreen({ navigation }) {
  const { t } = useTranslation();
  const [pickup, setPickup] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoff, setDropoff] = useState('');
  const [vehicleType, setVehicleType] = useState('Normal');
  const [estimatedFare, setEstimatedFare] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const vehicleTypes = [
    { type: 'Moto', baseFare: 500, perKm: 100, icon: '🏍️' },
    { type: 'Normal', baseFare: 1000, perKm: 150, icon: '🚗' },
    { type: 'Premium', baseFare: 3000, perKm: 450, icon: '🚙' },
  ];

  useEffect(() => {
    loadPaymentMethods();
    // Don't request permission automatically - only when user clicks button
    // This prevents blank screen if permission fails
  }, []);

  useEffect(() => {
    calculateFare();
  }, [vehicleType, pickup, dropoff]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    setLoadingLocation(true);
    try {
      // Request permission first
      let { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        // Try to request permission
        const permissionResult = await Location.requestForegroundPermissionsAsync();
        status = permissionResult.status;
        
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Location permission is needed to use your current location. You can still enter your address manually.'
          );
          setLoadingLocation(false);
          return;
        }
      }

      // Get location with timeout
      const location = await Promise.race([
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeout: 10000, // 10 second timeout
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Location timeout')), 10000)
        )
      ]);

      const { latitude, longitude } = location.coords;
      setPickupCoords({ latitude, longitude });

      // Try reverse geocoding
      try {
        const addresses = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (addresses && addresses.length > 0) {
          const address = addresses[0];
          const formattedAddress = [
            address.name,
            address.street,
            address.city,
            address.region,
          ]
            .filter(Boolean)
            .join(', ');

          setPickup(formattedAddress || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          Alert.alert('Success', 'Current location set as pickup!');
        } else {
          setPickup(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          Alert.alert('Success', 'Location coordinates set as pickup!');
        }
      } catch (geocodeError) {
        // If geocoding fails, just use coordinates
        console.log('Geocoding failed, using coordinates:', geocodeError);
        setPickup(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        Alert.alert('Success', 'Location set! You can edit the address if needed.');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Unavailable', 
        'Could not get your location. Please enter your pickup address manually.'
      );
    } finally {
      setLoadingLocation(false);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const response = await passengerAPI.getPaymentMethods();
      // Backend returns { success: true, paymentMethods: [...] }
      const methods = response.data.paymentMethods || [];
      setPaymentMethods(methods);
      const defaultMethod = methods.find((pm) => pm.is_default);
      setSelectedPayment(defaultMethod || methods[0]);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const calculateFare = () => {
    // Simple estimation based on vehicle type
    // In production, would use distance calculation
    const vehicle = vehicleTypes.find((v) => v.type === vehicleType);
    const estimatedKm = 5; // Default assumption
    const fare = vehicle.baseFare + vehicle.perKm * estimatedKm;
    setEstimatedFare(fare);
  };

  const handleBookRide = async () => {
    if (!pickup || !dropoff) {
      Alert.alert('Error', 'Please enter pickup and drop-off locations');
      return;
    }

    if (!selectedPayment) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    setLoading(true);
    try {
      const response = await rideAPI.createRide({
        pickup_address: pickup,
        dropoff_address: dropoff,
        vehicle_type: vehicleType,
        payment_method_id: selectedPayment.id,
        fare_estimate: estimatedFare,
      });

      Alert.alert('Success', 'Ride requested! Looking for drivers...', [
        {
          text: 'OK',
          onPress: () =>
            navigation.navigate('ActiveRide', { rideId: response.data.id }),
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to book ride'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.locationHeader}>
          <Text style={styles.sectionTitle}>📍 {t('pickup')}</Text>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={getCurrentLocation}
            disabled={loadingLocation}
          >
            {loadingLocation ? (
              <ActivityIndicator size="small" color="#FF6B00" />
            ) : (
              <Text style={styles.locationButtonText}>📍 Use Current Location</Text>
            )}
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Avenida Principal, Bissau"
          value={pickup}
          onChangeText={setPickup}
        />

        <Text style={styles.sectionTitle}>🎯 {t('dropoff')}</Text>
        <TextInput
          style={styles.input}
          placeholder="Aeroporto Internacional"
          value={dropoff}
          onChangeText={setDropoff}
        />

        <Text style={styles.sectionTitle}>🚗 {t('vehicleType')}</Text>
        <View style={styles.vehicleGrid}>
          {vehicleTypes.map((vehicle) => (
            <TouchableOpacity
              key={vehicle.type}
              style={[
                styles.vehicleOption,
                vehicleType === vehicle.type && styles.vehicleOptionActive,
              ]}
              onPress={() => setVehicleType(vehicle.type)}
            >
              <Text style={styles.vehicleIcon}>{vehicle.icon}</Text>
              <Text style={styles.vehicleText}>{t(vehicle.type.toLowerCase())}</Text>
              <Text style={styles.vehiclePrice}>
                {vehicle.baseFare} {t('xof')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.fareSection}>
          <Text style={styles.fareLabel}>{t('estimatedFare')}</Text>
          <Text style={styles.fareAmount}>
            {estimatedFare} {t('xof')}
          </Text>
        </View>

        {paymentMethods.length > 0 && (
          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>💳 Payment Method</Text>
            <View style={styles.paymentCard}>
              <Text style={styles.paymentText}>
                {selectedPayment?.type === 'card'
                  ? `Card •••• ${selectedPayment.card_last_four}`
                  : selectedPayment?.type === 'orange_money'
                  ? `Orange Money ${selectedPayment.phone_number}`
                  : `MTN Money ${selectedPayment.phone_number}`}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('PaymentMethods')}
              >
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.bookButton, loading && styles.bookButtonDisabled]}
          onPress={handleBookRide}
          disabled={loading}
        >
          <Text style={styles.bookButtonText}>
            {loading ? 'Booking...' : t('confirmBooking')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  locationButton: {
    backgroundColor: '#FFE8D6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B00',
  },
  locationButtonText: {
    color: '#FF6B00',
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
    marginBottom: 10,
  },
  vehicleGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  vehicleOption: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  vehicleOptionActive: {
    borderColor: '#FF6B00',
    backgroundColor: '#FFE8D6',
  },
  vehicleIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  vehicleText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  vehiclePrice: {
    fontSize: 12,
    color: '#666',
  },
  fareSection: {
    backgroundColor: '#FF6B00',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
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
  paymentSection: {
    marginBottom: 20,
  },
  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
  },
  paymentText: {
    fontSize: 16,
    color: '#333',
  },
  changeText: {
    color: '#FF6B00',
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#000',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  bookButtonDisabled: {
    opacity: 0.6,
  },
  bookButtonText: {
    color: '#FF6B00',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
