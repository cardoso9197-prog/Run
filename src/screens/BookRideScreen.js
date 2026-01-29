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
  Modal,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { rideAPI, passengerAPI } from '../services/api';

export default function BookRideScreen({ navigation, route }) {
  console.log('BookRideScreen rendering');
  
  const { t } = useTranslation();
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [vehicleType, setVehicleType] = useState('Normal');
  const [estimatedFare, setEstimatedFare] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentRideId, setCurrentRideId] = useState(null);

  // Handle location selected from map
  useEffect(() => {
    if (route.params?.pickup) {
      setPickupLocation(route.params.pickup);
    }
    if (route.params?.dropoff) {
      setDropoffLocation(route.params.dropoff);
    }
  }, [route.params]);

  const vehicleTypes = [
    { type: 'Moto', baseFare: 500, perKm: 100, icon: '🏍️' },
    { type: 'Normal', baseFare: 1000, perKm: 150, icon: '🚗' },
    { type: 'Premium', baseFare: 3000, perKm: 450, icon: '🚙' },
  ];

  useEffect(() => {
    console.log('BookRideScreen mounted, loading payment methods...');
    loadPaymentMethods();
  }, []);

  useEffect(() => {
    calculateFare();
  }, [vehicleType, pickupLocation, dropoffLocation]);

  const loadPaymentMethods = async () => {
    try {
      console.log('Fetching payment methods...');
      const response = await passengerAPI.getPaymentMethods();
      console.log('Payment methods response:', response.data);
      // Backend returns { success: true, paymentMethods: [...] }
      const methods = response.data.paymentMethods || [];
      console.log('Payment methods loaded:', methods.length);
      setPaymentMethods(methods);
      const defaultMethod = methods.find((pm) => pm.is_default);
      setSelectedPayment(defaultMethod || methods[0]);
      setInitialLoading(false);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      console.error('Error details:', error.response?.data);
      setError('Failed to load payment methods');
      setInitialLoading(false);
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
    if (!pickupLocation || !dropoffLocation) {
      Alert.alert('Error', 'Please select pickup and drop-off locations from the map');
      return;
    }

    if (!selectedPayment) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    setLoading(true);
    setBookingError(null);
    setCurrentRideId(null);
    try {
      const response = await rideAPI.createRide({
        pickupAddress: pickupLocation.name,
        pickupLatitude: pickupLocation.latitude,
        pickupLongitude: pickupLocation.longitude,
        dropoffAddress: dropoffLocation.name,
        dropoffLatitude: dropoffLocation.latitude,
        dropoffLongitude: dropoffLocation.longitude,
        vehicleType: vehicleType,
        paymentMethodId: selectedPayment.id,
      });
      // Try to extract ride id from a few possible response shapes
      const rideId = response.data?.id || response.data?.ride?.id || response.data?.rideId;
      if (rideId) {
        // Store the ride ID so user can cancel the search
        setCurrentRideId(rideId);
        // Navigate to ActiveRide which will show "Looking for driver..." when status is 'requested'
        navigation.navigate('ActiveRide', { rideId });
        // Reset state after navigation
        setLoading(false);
        setCurrentRideId(null);
      } else {
        // If backend did not return an id, surface a clear error so the user can retry
        console.warn('Ride created but no id returned:', response.data);
        setBookingError('Corrida solicitada, mas o ID não foi retornado. Tente ver sua viagem em Histórico.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error creating ride:', error);
      const message = error.response?.data?.message || error.message || 'Falha ao reservar a corrida';
      setBookingError(message);
      setLoading(false);
      setCurrentRideId(null);
    }
  };

  const handleCancelSearch = async () => {
    if (!currentRideId) {
      // If no ride ID yet, just stop the loading state
      setLoading(false);
      setBookingError(null);
      return;
    }

    try {
      // Cancel the ride request via API
      await rideAPI.cancelRide(currentRideId);
      setLoading(false);
      setCurrentRideId(null);
      setBookingError(null);
      Alert.alert('Cancelado', 'Busca por motorista cancelada com sucesso.');
    } catch (error) {
      console.error('Error cancelling ride:', error);
      setLoading(false);
      setCurrentRideId(null);
      Alert.alert('Erro', 'Falha ao cancelar a busca. Por favor, tente novamente.');
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setInitialLoading(true);
            loadPaymentMethods();
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  console.log('Rendering BookRideScreen UI');

  return (
    <>
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📍 Pickup Location</Text>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={() => navigation.navigate('MapLocationPicker', { locationType: 'pickup' })}
        >
          <Text style={styles.locationButtonText}>
            {pickupLocation ? pickupLocation.name : '📌 Tap to select pickup on map'}
          </Text>
        </TouchableOpacity>
        
        {pickupLocation && (
          <TextInput
            style={styles.locationEditInput}
            value={pickupLocation.name}
            onChangeText={(text) => setPickupLocation({ ...pickupLocation, name: text })}
            placeholder="Edit pickup details (e.g., Near the blue gate)"
            multiline
          />
        )}

        <Text style={styles.sectionTitle}>🎯 Dropoff Location</Text>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={() => navigation.navigate('MapLocationPicker', { locationType: 'dropoff' })}
        >
          <Text style={styles.locationButtonText}>
            {dropoffLocation ? dropoffLocation.name : '📌 Tap to select dropoff on map'}
          </Text>
        </TouchableOpacity>

        {dropoffLocation && (
          <TextInput
            style={styles.locationEditInput}
            value={dropoffLocation.name}
            onChangeText={(text) => setDropoffLocation({ ...dropoffLocation, name: text })}
            placeholder="Edit dropoff details (e.g., Behind the market)"
            multiline
          />
        )}

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
            {loading ? 'Procurando motorista...' : t('confirmBooking')}
          </Text>
        </TouchableOpacity>

        {/* Inline booking error and retry */}
        {bookingError && (
          <View style={{ marginTop: 12 }}>
            <Text style={{ color: '#FF0000', textAlign: 'center' }}>{bookingError}</Text>
            <TouchableOpacity
              style={[styles.retryButton, { alignSelf: 'center', marginTop: 10 }]}
              onPress={() => {
                setBookingError(null);
              }}
            >
              <Text style={styles.retryButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>

    {/* Full-screen modal shown while booking to make state explicit */}
    <Modal visible={loading} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text style={styles.modalText}>
            Procurando motorista...{'\n'}Por favor aguarde
          </Text>
          <TouchableOpacity
            style={styles.cancelSearchButton}
            onPress={handleCancelSearch}
          >
            <Text style={styles.cancelSearchButtonText}>Cancelar Busca</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    </>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#000',
  },
  locationButton: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#F0F8F0',
    marginBottom: 10,
    minHeight: 60,
    justifyContent: 'center',
  },
  locationButtonText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  locationEditInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#FFF',
    marginBottom: 15,
    minHeight: 50,
    textAlignVertical: 'top',
    color: '#666',
    fontStyle: 'italic',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '80%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  modalText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    lineHeight: 22,
  },
  cancelSearchButton: {
    marginTop: 20,
    backgroundColor: '#FF0000',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 150,
  },
  cancelSearchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
