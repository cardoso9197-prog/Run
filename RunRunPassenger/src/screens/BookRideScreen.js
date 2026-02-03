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
  const [estimatedFare, setEstimatedFare] = useState(null);
  const [fareDetails, setFareDetails] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fareLoading, setFareLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentRideId, setCurrentRideId] = useState(null);
  const [showRedZoneWarning, setShowRedZoneWarning] = useState(false);

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
    
    // Reset loading state when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('BookRideScreen focused');
      setLoading(false);
      setCurrentRideId(null);
    });
    
    return unsubscribe;
  }, [navigation]);

  // Calculate fare when all required fields are filled
  useEffect(() => {
    if (pickupLocation && dropoffLocation && vehicleType) {
      calculateFare();
    } else {
      // Reset fare if any required field is missing
      setEstimatedFare(null);
      setFareDetails(null);
    }
  }, [vehicleType, pickupLocation, dropoffLocation]);

  const loadPaymentMethods = async () => {
    try {
      console.log('Fetching payment methods...');
      const response = await passengerAPI.getPaymentMethods();
      console.log('Payment methods response:', response.data);
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

  const calculateFare = async () => {
    if (!pickupLocation || !dropoffLocation || !vehicleType) {
      return;
    }

    setFareLoading(true);
    try {
      const response = await rideAPI.estimateFare({
        pickupLatitude: pickupLocation.latitude,
        pickupLongitude: pickupLocation.longitude,
        dropoffLatitude: dropoffLocation.latitude,
        dropoffLongitude: dropoffLocation.longitude,
        vehicleType: vehicleType,
      });

      // Backend returns data in 'estimate' object
      const estimate = response.data.estimate || response.data;
      
      console.log('Fare estimate received:', estimate);
      
      setEstimatedFare(estimate.totalFare);
      setFareDetails({
        baseFare: estimate.baseFare,
        distanceFare: estimate.distanceFare,
        redZoneSurcharge: estimate.redZoneSurcharge || 0,
        isRedZone: estimate.isRedZone || false,
        redZoneInfo: estimate.redZoneInfo,
        distance: estimate.distance,
      });

      // Show red zone warning if applicable
      if (estimate.isRedZone) {
        console.log('Red zone detected:', estimate.redZoneInfo);
        setShowRedZoneWarning(true);
      } else {
        setShowRedZoneWarning(false);
      }
    } catch (error) {
      console.error('Error calculating fare:', error);
      setEstimatedFare(null);
      setFareDetails(null);
      Alert.alert('Error', 'Failed to calculate fare. Please try again.');
    } finally {
      setFareLoading(false);
    }
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

    if (!estimatedFare) {
      Alert.alert('Error', 'Please wait for fare calculation');
      return;
    }

    // Show red zone confirmation if in bad road area
    if (fareDetails?.isRedZone) {
      Alert.alert(
        '⚠️ Red Zone Alert',
        getRedZoneMessage(),
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Confirm Booking', onPress: proceedWithBooking },
        ]
      );
    } else {
      proceedWithBooking();
    }
  };

  const getRedZoneMessage = () => {
    if (!fareDetails || !fareDetails.redZoneInfo) {
      return 'This area has bad road conditions (potholes, unpaved roads).\n\nAn additional 30% surcharge has been applied to your fare.\n\nDo you want to proceed?';
    }
    
    const zoneName = fareDetails.redZoneInfo.redZoneName || 'This area';
    const roadCondition = fareDetails.redZoneInfo.roadCondition || 'poor road conditions';
    
    return `${zoneName} has ${roadCondition} roads.\n\nAn additional 30% surcharge (${fareDetails.redZoneSurcharge} XOF) has been applied to compensate the driver.\n\nTotal fare: ${estimatedFare} XOF\n\nDo you want to proceed with this booking?`;
  };

  const proceedWithBooking = async () => {
    setLoading(true);
    setBookingError(null);
    setCurrentRideId(null);
    
    console.log('=== STARTING RIDE BOOKING ===');
    console.log('Pickup:', JSON.stringify(pickupLocation));
    console.log('Dropoff:', JSON.stringify(dropoffLocation));
    console.log('Vehicle:', vehicleType);
    console.log('Payment:', JSON.stringify(selectedPayment));
    
    try {
      const bookingData = {
        pickupAddress: pickupLocation.name,
        pickupLatitude: pickupLocation.latitude,
        pickupLongitude: pickupLocation.longitude,
        dropoffAddress: dropoffLocation.name,
        dropoffLatitude: dropoffLocation.latitude,
        dropoffLongitude: dropoffLocation.longitude,
        vehicleType: vehicleType,
        paymentMethodId: selectedPayment.id,
      };
      
      console.log('Booking data:', JSON.stringify(bookingData));
      console.log('Calling API: POST /rides/request');
      
      const response = await rideAPI.createRide(bookingData);
      
      console.log('=== API RESPONSE ===');
      console.log('Status:', response.status);
      console.log('Data:', JSON.stringify(response.data));
      
      const rideId = response.data?.id || response.data?.ride?.id || response.data?.rideId;
      console.log('Extracted ride ID:', rideId);
      
      if (!rideId) {
        console.error('NO RIDE ID IN RESPONSE!');
        console.error('Full response:', JSON.stringify(response));
        setBookingError('Ride requested but ID not returned. Please try again.');
        setLoading(false);
        Alert.alert('Booking Error', 'Could not create ride. Please try again.');
        return; // STOP HERE - don't navigate
      }
      
      // Only navigate if we have a valid ride ID
      setCurrentRideId(rideId);
      console.log('✅ SUCCESS! Navigating to ActiveRide with ID:', rideId);
      
      // Navigate first, then reset state
      navigation.navigate('ActiveRide', { rideId });
      
      // Small delay to ensure navigation completes before resetting
      setTimeout(() => {
        setLoading(false);
        setCurrentRideId(null);
      }, 100);
      
    } catch (error) {
      console.error('=== BOOKING ERROR ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      
      const message = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.message || 
                      'Failed to book ride. Please check your connection.';
      
      setBookingError(message);
      setLoading(false);
      setCurrentRideId(null);
      
      Alert.alert(
        'Booking Failed',
        message,
        [{ text: 'OK', onPress: () => console.log('User dismissed error alert') }]
      );
    }
  };

  const handleCancelSearch = async () => {
    if (!currentRideId) {
      setLoading(false);
      setBookingError(null);
      return;
    }

    try {
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

        {/* Fare Display - Only show when all fields are filled */}
        {pickupLocation && dropoffLocation && vehicleType && (
          <View style={styles.fareSection}>
            <Text style={styles.sectionTitle}>💰 Fare Estimate</Text>
            {fareLoading ? (
              <ActivityIndicator size="small" color="#FF6B00" />
            ) : estimatedFare ? (
              <View style={styles.fareContainer}>
                {fareDetails?.isRedZone && (
                  <View style={styles.redZoneBanner}>
                    <Text style={styles.redZoneBannerText}>⚠️ RED ZONE - Bad Road Conditions</Text>
                    <Text style={styles.redZoneBannerSubtext}>
                      {fareDetails.redZoneInfo?.redZoneName || 'This area'} has {fareDetails.redZoneInfo?.roadCondition || 'poor'} roads
                    </Text>
                  </View>
                )}
                <View style={styles.fareRow}>
                  <Text style={styles.fareLabel}>Base Fare:</Text>
                  <Text style={styles.fareValue}>{fareDetails?.baseFare || 0} XOF</Text>
                </View>
                <View style={styles.fareRow}>
                  <Text style={styles.fareLabel}>Distance ({fareDetails?.distance?.toFixed(1) || 0} km):</Text>
                  <Text style={styles.fareValue}>{fareDetails?.distanceFare || 0} XOF</Text>
                </View>
                {fareDetails?.isRedZone && fareDetails.redZoneSurcharge > 0 && (
                  <View style={styles.fareRow}>
                    <Text style={[styles.fareLabel, styles.redZoneText]}>Red Zone Surcharge (30%):</Text>
                    <Text style={[styles.fareValue, styles.redZoneText]}>+{fareDetails.redZoneSurcharge} XOF</Text>
                  </View>
                )}
                <View style={styles.fareDivider} />
                <View style={styles.fareRow}>
                  <Text style={styles.fareLabelTotal}>Estimated Total:</Text>
                  <Text style={styles.fareValueTotal}>{estimatedFare} XOF</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.fareError}>Unable to calculate fare</Text>
            )}
          </View>
        )}

        {/* Payment Method Selection */}
        <Text style={styles.sectionTitle}>💳 {t('paymentMethod')}</Text>
        {paymentMethods.length === 0 ? (
          <TouchableOpacity
            style={styles.addPaymentButton}
            onPress={() => navigation.navigate('AddPaymentMethod')}
          >
            <Text style={styles.addPaymentText}>➕ Add Payment Method</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.paymentContainer}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentOption,
                  selectedPayment?.id === method.id && styles.paymentOptionActive,
                ]}
                onPress={() => setSelectedPayment(method)}
              >
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentType}>
                    {method.provider === 'orange_money' && '🟠'}
                    {method.provider === 'mtn_momo' && '🟡'}
                    {method.provider === 'cash' && '💵'}
                    {' '}
                    {method.provider.replace('_', ' ').toUpperCase()}
                  </Text>
                  <Text style={styles.paymentDetails}>{method.account_number}</Text>
                  {method.is_default && (
                    <Text style={styles.defaultBadge}>Default</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.addPaymentButton}
              onPress={() => navigation.navigate('AddPaymentMethod')}
            >
              <Text style={styles.addPaymentText}>➕ Add Another</Text>
            </TouchableOpacity>
          </View>
        )}

        {bookingError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>⚠️ {bookingError}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.bookButton,
            (!pickupLocation || !dropoffLocation || !selectedPayment || !estimatedFare) && styles.bookButtonDisabled,
          ]}
          onPress={handleBookRide}
          disabled={!pickupLocation || !dropoffLocation || !selectedPayment || !estimatedFare || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.bookButtonText}>
              {estimatedFare ? `🚗 Book Ride - ${estimatedFare} XOF` : '🚗 Book Ride'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>

    {/* Red Zone Warning Modal */}
    <Modal
      visible={showRedZoneWarning}
      transparent
      animationType="slide"
      onRequestClose={() => setShowRedZoneWarning(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>⚠️ Red Zone Alert</Text>
          <Text style={styles.modalMessage}>
            {getRedZoneMessage()}
          </Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setShowRedZoneWarning(false)}
          >
            <Text style={styles.modalButtonText}>I Understand</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

    {/* Looking for Driver Modal */}
    {loading && (
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#FF6B00" />
            <Text style={styles.modalTitle}>🔍 Looking for a driver...</Text>
            <Text style={styles.modalMessage}>Please wait while we find a driver for you</Text>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelSearch}>
              <Text style={styles.cancelButtonText}>Cancel Search</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
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
    fontWeight: '700',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  locationButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  locationButtonText: {
    fontSize: 15,
    color: '#333',
  },
  locationEditInput: {
    marginTop: 10,
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 14,
    color: '#666',
  },
  vehicleGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  vehicleOption: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    flex: 1,
    marginHorizontal: 5,
  },
  vehicleOptionActive: {
    borderColor: '#FF6B00',
    backgroundColor: '#fff5f0',
  },
  vehicleIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  vehicleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  vehiclePrice: {
    fontSize: 12,
    color: '#666',
  },
  fareSection: {
    marginTop: 20,
  },
  fareContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  redZoneBanner: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
  redZoneBannerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#c62828',
    marginBottom: 4,
  },
  redZoneBannerSubtext: {
    fontSize: 12,
    color: '#c62828',
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fareLabel: {
    fontSize: 14,
    color: '#666',
  },
  fareValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  redZoneText: {
    color: '#d32f2f',
    fontWeight: '600',
  },
  fareDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  fareLabelTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  fareValueTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B00',
  },
  fareError: {
    fontSize: 14,
    color: '#d32f2f',
    textAlign: 'center',
    padding: 10,
  },
  paymentContainer: {
    marginTop: 10,
  },
  paymentOption: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginBottom: 10,
  },
  paymentOptionActive: {
    borderColor: '#FF6B00',
    backgroundColor: '#fff5f0',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  paymentDetails: {
    fontSize: 13,
    color: '#666',
    flex: 2,
  },
  defaultBadge: {
    fontSize: 11,
    color: '#FF6B00',
    fontWeight: '600',
    backgroundColor: '#fff5f0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  addPaymentButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FF6B00',
    borderStyle: 'dashed',
    alignItems: 'center',
    marginTop: 5,
  },
  addPaymentText: {
    fontSize: 14,
    color: '#FF6B00',
    fontWeight: '600',
  },
  errorBanner: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
  errorBannerText: {
    fontSize: 14,
    color: '#c62828',
  },
  bookButton: {
    backgroundColor: '#FF6B00',
    padding: 18,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bookButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d32f2f',
  },
  cancelButtonText: {
    color: '#d32f2f',
    fontSize: 16,
    fontWeight: '600',
  },
});
