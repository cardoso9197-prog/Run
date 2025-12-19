import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { rideAPI } from '../services/api';

export default function ActiveRideScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { rideId } = route.params;
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRideDetails();
    const interval = setInterval(loadRideDetails, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

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

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📍 Route</Text>
        <View style={styles.routeContainer}>
          <Text style={styles.locationLabel}>From:</Text>
          <Text style={styles.locationText}>{ride.pickup_address}</Text>
          <Text style={styles.locationLabel}>To:</Text>
          <Text style={styles.locationText}>{ride.dropoff_address}</Text>
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
});
