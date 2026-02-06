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
import { rideAPI, passengerAPI, verifyToken } from '../services/api';

export default function BookRideScreen({ navigation, route }) {
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
  const [airportDetected, setAirportDetected] = useState(false);
  const [isAirportInside, setIsAirportInside] = useState(false);
  const [showAirportModal, setShowAirportModal] = useState(false);

  // Handle location selected from map
  useEffect(() => {
    if (route.params?.pickup) {
      setPickupLocation(route.params.pickup);
      // Reset airport selection when pickup changes
      setAirportDetected(false);
      setIsAirportInside(false);
      setShowAirportModal(false);
    }
    if (route.params?.dropoff) {
      setDropoffLocation(route.params.dropoff);
      // Reset airport selection when dropoff changes
      setAirportDetected(false);
      setIsAirportInside(false);
      setShowAirportModal(false);
    }
  }, [route.params]);

  const vehicleTypes = [
    { type: 'Moto', perKm: 150, icon: '🏍️' },
    { type: 'Normal', perKm: 338, icon: '🚗' },
    { type: 'Premium', perKm: 650, icon: '🚙' },
  ];

  useEffect(() => {
    loadPaymentMethods();
    
    // Reset loading state when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
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
      setAirportDetected(false);
    }
  }, [vehicleType, pickupLocation, dropoffLocation, isAirportInside]);

  const loadPaymentMethods = async () => {
    // Wait a bit to ensure token is stored
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verify token before making API call
    const tokenCheck = await verifyToken();
    if (!tokenCheck.valid) {
      setError('Authentication failed. Please login again.');
      setPaymentMethods([]);
      setSelectedPayment(null);
      setInitialLoading(false);
      return;
    }
    
    try {
      const response = await passengerAPI.getPaymentMethods();
      const methods = response.data.paymentMethods || response.data || [];
      
      setPaymentMethods(methods);
      
      if (methods.length === 0) {
        setError('No payment methods found. Please add a payment method first.');
        setSelectedPayment(null);
      } else {
        const defaultMethod = methods.find((pm) => pm.isDefault || pm.is_default);
        setSelectedPayment(defaultMethod || methods[0]);
        setError(null);
      }
      
      setInitialLoading(false);
    } catch (error) {
      
      let errorMessage = 'Failed to load payment methods';
      if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Payment methods service not available.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert('Payment Methods Error', `Status: ${error.response?.status || 'Unknown'}\nMessage: ${errorMessage}\nDetails: ${JSON.stringify(error.response?.data || error.message)}`);
      
      setError(errorMessage);
      setPaymentMethods([]);
      setSelectedPayment(null);
      setInitialLoading(false);
      
      // Show alert for critical errors
      if (error.response?.status === 401) {
        Alert.alert('Authentication Error', errorMessage);
      }
    }
  };

  const calculateFare = async () => {
    if (!pickupLocation || !dropoffLocation || !vehicleType) {
      return;
    }

    console.log('🔍 Calculating fare with:', {
      pickup: `${pickupLocation.latitude}, ${pickupLocation.longitude}`,
      dropoff: `${dropoffLocation.latitude}, ${dropoffLocation.longitude}`,
      vehicleType,
      isAirportInside,
    });

    setFareLoading(true);
    try {
      const response = await rideAPI.estimateFare({
        pickupLatitude: pickupLocation.latitude,
        pickupLongitude: pickupLocation.longitude,
        dropoffLatitude: dropoffLocation.latitude,
        dropoffLongitude: dropoffLocation.longitude,
        vehicleType: vehicleType,
        isAirportInside: isAirportInside,
      });

      // Backend returns data in 'estimate' object
      const estimate = response.data.estimate || response.data;
      
      console.log('✅ Fare estimate received:', {
        totalFare: estimate.totalFare,
        airportDetected: estimate.airportDetected,
        isAirportTrip: estimate.isAirportTrip,
        isAirportFlatRate: estimate.isAirportFlatRate,
        perKmRate: estimate.perKmRate,
      });
      
      setEstimatedFare(estimate.totalFare);
      setFareDetails({
        baseFare: estimate.baseFare,
        distanceFare: estimate.distanceFare,
        totalFare: estimate.totalFare,
        distance: estimate.distance,
        perKmRate: estimate.perKmRate,
        isAirportTrip: estimate.isAirportTrip || false,
        isAirportFlatRate: estimate.isAirportFlatRate || false,
      });

      // Check if airport was detected and show modal if needed
      if (estimate.airportDetected) {
        console.log('✈️ Airport detected! Current state - airportDetected:', airportDetected, 'showAirportModal:', showAirportModal, 'isAirportInside:', isAirportInside);
        
        // If this is the first time detecting airport (or user hasn't made a choice yet)
        if (!airportDetected || (airportDetected && isAirportInside === false && !estimate.isAirportFlatRate)) {
          setAirportDetected(true);
          // Show modal to let user choose inside/outside
          console.log('🔔 Showing airport modal for user to choose location');
          setShowAirportModal(true);
        } else {
          // Airport already detected and user has made a choice
          setAirportDetected(true);
        }
      } else {
        // Reset airport state if not at airport anymore
        if (airportDetected) {
          console.log('❌ Not at airport anymore, resetting');
          setAirportDetected(false);
          setIsAirportInside(false);
          setShowAirportModal(false);
        }
      }
    } catch (error) {
      console.error('❌ Fare calculation error:', error);
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

    proceedWithBooking();
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
      
      const response = await rideAPI.createRide(bookingData);
      
      const rideId = response.data?.id || response.data?.ride?.id || response.data?.rideId;
      
      if (!rideId) {
        setBookingError('Ride requested but ID not returned. Please try again.');
        setLoading(false);
        Alert.alert('Booking Error', 'Could not create ride. Please try again.');
        return;
      }
      
      // Navigate to active ride screen
      setCurrentRideId(rideId);
      navigation.navigate('ActiveRide', { rideId });
      
      // Reset state after navigation
      setTimeout(() => {
        setLoading(false);
        setCurrentRideId(null);
      }, 100);
      
    } catch (error) {
      const message = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.message || 
                      'Failed to book ride. Please check your connection.';
      
      setBookingError(message);
      setLoading(false);
      setCurrentRideId(null);
      
      Alert.alert('Booking Failed', message);
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
                {fareDetails?.isAirportFlatRate && (
                  <View style={styles.airportBanner}>
                    <Text style={styles.airportBannerText}>✈️ AIRPORT SPECIAL RATE</Text>
                    <Text style={styles.airportBannerSubtext}>
                      Osvaldo Vieira Airport - Inside Terminal - Flat rate to any zone in Bissau
                    </Text>
                  </View>
                )}
                <View style={styles.fareRow}>
                  <Text style={styles.fareLabel}>Distance:</Text>
                  <Text style={styles.fareValue}>{fareDetails?.distance?.toFixed(1) || 0} km</Text>
                </View>
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
                    {method.type === 'orange_money' && '🟠'}
                    {method.type === 'mtn_momo' && '🟡'}
                    {method.type === 'card' && '�'}
                    {' '}
                    {method.type === 'card' 
                      ? `${method.cardBrand || 'Card'} ****${method.cardLastFour || '****'}`
                      : method.type === 'orange_money' 
                        ? 'Orange Money'
                        : method.type === 'mtn_momo'
                          ? 'MTN Mobile Money'
                          : method.type.replace('_', ' ').toUpperCase()
                    }
                  </Text>
                  <Text style={styles.paymentDetails}>
                    {method.type === 'card' 
                      ? `****${method.cardLastFour || '****'}`
                      : method.mobileNumber || 'N/A'
                    }
                  </Text>
                  {method.isDefault && (
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

    {/* Airport Location Modal */}
    <Modal
      visible={showAirportModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowAirportModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>✈️ Airport Detected</Text>
          <Text style={styles.modalMessage}>
            Your pickup or dropoff is at Osvaldo Vieira International Airport.{'\n\n'}
            Are you picking up/dropping off inside the terminal (departure/arrival area)?
          </Text>
          
          <TouchableOpacity
            style={[styles.modalButton, styles.airportInsideButton]}
            onPress={() => {
              console.log('✈️ User selected: Inside Terminal');
              setIsAirportInside(true);
              setShowAirportModal(false);
              // Force immediate recalculation with inside terminal rate
              setTimeout(() => {
                console.log('🔄 Recalculating fare for inside terminal...');
                calculateFare();
              }, 100);
            }}
          >
            <Text style={styles.modalButtonText}>🏢 Inside Terminal</Text>
            <Text style={styles.modalButtonSubtext}>5,600 XOF flat rate</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.modalButton, styles.airportOutsideButton]}
            onPress={() => {
              console.log('🅿️ User selected: Outside/Parking');
              setIsAirportInside(false);
              setShowAirportModal(false);
              // Force immediate recalculation with per-km rate
              setTimeout(() => {
                console.log('🔄 Recalculating fare for outside parking...');
                calculateFare();
              }, 100);
            }}
          >
            <Text style={styles.modalButtonText}>🅿️ Outside/Parking</Text>
            <Text style={styles.modalButtonSubtext}>Regular per-km rate</Text>
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
  airportBanner: {
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#1976d2',
  },
  airportBannerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0d47a1',
    marginBottom: 4,
  },
  airportBannerSubtext: {
    fontSize: 12,
    color: '#1565c0',
  },
  airportInsideButton: {
    backgroundColor: '#1976d2',
    marginBottom: 10,
  },
  airportOutsideButton: {
    backgroundColor: '#757575',
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
  airportBanner: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  airportBannerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1976D2',
    marginBottom: 4,
  },
  airportBannerSubtext: {
    fontSize: 12,
    color: '#1565C0',
  },
  airportInsideButton: {
    backgroundColor: '#2196F3',
    marginBottom: 10,
  },
  airportOutsideButton: {
    backgroundColor: '#FF6B00',
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
  modalButtonSubtext: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
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
