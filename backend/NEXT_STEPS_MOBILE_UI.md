# 🚀 NEXT STEPS: Building Mobile UI (December 15, 2025)

## ✅ Current Status
- **Backend**: 100% operational at https://zippy-healing-production-24e4.up.railway.app/api
- **Database**: All tables exist and working
- **WebSocket**: Real-time communication ready
- **Dependencies**: react-native-maps, geolocation, socket.io-client installed in both apps

## 🎯 Next Immediate Steps

### STEP 1: Install Axios (5 minutes)

Both apps need axios for API communication.

```powershell
# Passenger App
cd "C:\Users\Colondo Full service\Desktop\passenger-app-new"
npm install axios

# Driver App
cd "C:\Users\Colondo Full service\Desktop\driver-app-new"
npm install axios
```

---

### STEP 2: Create API Service (15 minutes)

Create `src/services/api.js` in BOTH apps:

```javascript
// src/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://zippy-healing-production-24e4.up.railway.app/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      AsyncStorage.removeItem('userToken');
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// ===== PASSENGER API METHODS =====

export const estimateFare = async (pickupLat, pickupLng, dropoffLat, dropoffLng, vehicleType) => {
  return api.post('/rides/estimate-fare', {
    pickupLatitude: pickupLat,
    pickupLongitude: pickupLng,
    dropoffLatitude: dropoffLat,
    dropoffLongitude: dropoffLng,
    vehicleType,
  });
};

export const requestRide = async (pickupLat, pickupLng, dropoffLat, dropoffLng, vehicleType, pickupAddress, dropoffAddress) => {
  return api.post('/rides/request', {
    pickupLatitude: pickupLat,
    pickupLongitude: pickupLng,
    dropoffLatitude: dropoffLat,
    dropoffLongitude: dropoffLng,
    vehicleType,
    pickupAddress,
    dropoffAddress,
  });
};

export const getActiveRide = async () => {
  return api.get('/rides/active');
};

export const cancelRide = async (rideId) => {
  return api.put(`/rides/${rideId}/cancel`);
};

export const rateRide = async (rideId, rating, comment) => {
  return api.post(`/rides/${rideId}/rate`, { rating, comment });
};

// ===== DRIVER API METHODS =====

export const getAvailableRides = async () => {
  return api.get('/rides/driver/available');
};

export const acceptRide = async (rideId) => {
  return api.put(`/rides/${rideId}/accept`);
};

export const updateRideStatus = async (rideId, status) => {
  return api.put(`/rides/${rideId}/status`, { status });
};

export const getDriverActiveRide = async () => {
  return api.get('/rides/driver/active');
};

export const getDriverEarnings = async () => {
  return api.get('/driver/earnings');
};

export default api;
```

**Create this file in both apps:**
1. `passenger-app-new/src/services/api.js`
2. `driver-app-new/src/services/api.js`

---

### STEP 3: Create BookRideScreen (30 minutes)

Create `passenger-app-new/src/screens/BookRideScreen.js`:

```javascript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { estimateFare, requestRide } from '../services/api';

const VEHICLE_TYPES = [
  { id: 'Moto', name: 'Moto 🏍️', description: 'Fast & cheap' },
  { id: 'RunRun', name: 'RunRun 🚗', description: 'Standard ride' },
  { id: 'Comfort', name: 'Comfort 🚙', description: 'Premium comfort' },
  { id: 'XL', name: 'XL 🚐', description: 'Up to 6 passengers' },
];

export default function BookRideScreen({ navigation }) {
  const [region, setRegion] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('RunRun');
  const [fareEstimate, setFareEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('pickup'); // 'pickup' or 'dropoff'

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (pickupLocation && dropoffLocation && selectedVehicle) {
      fetchFareEstimate();
    }
  }, [pickupLocation, dropoffLocation, selectedVehicle]);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      },
      (error) => {
        Alert.alert('Error', 'Could not get your location. Please enable GPS.');
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    if (step === 'pickup') {
      setPickupLocation({ latitude, longitude });
      setStep('dropoff');
      Alert.alert('Pickup Set', 'Now tap on the map to set your dropoff location.');
    } else {
      setDropoffLocation({ latitude, longitude });
      setStep('done');
    }
  };

  const fetchFareEstimate = async () => {
    try {
      setLoading(true);
      const response = await estimateFare(
        pickupLocation.latitude,
        pickupLocation.longitude,
        dropoffLocation.latitude,
        dropoffLocation.longitude,
        selectedVehicle
      );
      setFareEstimate(response.estimate);
    } catch (error) {
      console.error('Fare estimate error:', error);
      Alert.alert('Error', 'Could not estimate fare. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRide = async () => {
    if (!pickupLocation || !dropoffLocation) {
      Alert.alert('Error', 'Please set both pickup and dropoff locations.');
      return;
    }

    if (!pickupAddress.trim() || !dropoffAddress.trim()) {
      Alert.alert('Error', 'Please enter both addresses.');
      return;
    }

    try {
      setLoading(true);
      const response = await requestRide(
        pickupLocation.latitude,
        pickupLocation.longitude,
        dropoffLocation.latitude,
        dropoffLocation.longitude,
        selectedVehicle,
        pickupAddress,
        dropoffAddress
      );

      Alert.alert('Success', 'Ride requested! Finding a driver...', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('ActiveRide', { rideId: response.ride.id }),
        },
      ]);
    } catch (error) {
      console.error('Request ride error:', error);
      Alert.alert('Error', error.message || 'Could not request ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetLocations = () => {
    setPickupLocation(null);
    setDropoffLocation(null);
    setPickupAddress('');
    setDropoffAddress('');
    setFareEstimate(null);
    setStep('pickup');
  };

  if (!region) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton
      >
        {pickupLocation && (
          <Marker
            coordinate={pickupLocation}
            pinColor="#FF6B35"
            title="Pickup"
          />
        )}
        {dropoffLocation && (
          <Marker
            coordinate={dropoffLocation}
            pinColor="#2ECC71"
            title="Dropoff"
          />
        )}
      </MapView>

      <ScrollView style={styles.bottomSheet}>
        <Text style={styles.instruction}>
          {step === 'pickup' && '📍 Tap on the map to set pickup location'}
          {step === 'dropoff' && '🎯 Tap on the map to set dropoff location'}
          {step === 'done' && '✅ Locations set! Fill in details below.'}
        </Text>

        {pickupLocation && (
          <TextInput
            style={styles.input}
            placeholder="Enter pickup address"
            value={pickupAddress}
            onChangeText={setPickupAddress}
          />
        )}

        {dropoffLocation && (
          <TextInput
            style={styles.input}
            placeholder="Enter dropoff address"
            value={dropoffAddress}
            onChangeText={setDropoffAddress}
          />
        )}

        {pickupLocation && dropoffLocation && (
          <>
            <Text style={styles.sectionTitle}>Select Vehicle Type</Text>
            <View style={styles.vehicleContainer}>
              {VEHICLE_TYPES.map((vehicle) => (
                <TouchableOpacity
                  key={vehicle.id}
                  style={[
                    styles.vehicleCard,
                    selectedVehicle === vehicle.id && styles.vehicleCardSelected,
                  ]}
                  onPress={() => setSelectedVehicle(vehicle.id)}
                >
                  <Text style={styles.vehicleName}>{vehicle.name}</Text>
                  <Text style={styles.vehicleDesc}>{vehicle.description}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {loading && <ActivityIndicator size="small" color="#FF6B35" />}

            {fareEstimate && (
              <View style={styles.fareContainer}>
                <Text style={styles.fareTitle}>Estimated Fare</Text>
                <Text style={styles.fareAmount}>
                  {fareEstimate.totalFare.toLocaleString()} XOF
                </Text>
                <Text style={styles.fareDetails}>
                  Distance: {fareEstimate.distance.toFixed(2)} km • Duration: ~{fareEstimate.duration} min
                </Text>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.resetButton} onPress={resetLocations}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.requestButton, loading && styles.buttonDisabled]}
                onPress={handleRequestRide}
                disabled={loading}
              >
                <Text style={styles.requestButtonText}>
                  {loading ? 'Requesting...' : 'Request Ride'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  instruction: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  vehicleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vehicleCard: {
    width: '48%',
    padding: 15,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  vehicleCardSelected: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF5F2',
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  vehicleDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  fareContainer: {
    backgroundColor: '#FFF5F2',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  fareTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  fareAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 5,
  },
  fareDetails: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  resetButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF6B35',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: 'bold',
  },
  requestButton: {
    flex: 2,
    backgroundColor: '#FF6B35',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  requestButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
```

---

### STEP 4: Update Navigation (5 minutes)

**In `passenger-app-new/App.js`**, add the BookRideScreen to navigation:

```javascript
// Add import at top
import BookRideScreen from './src/screens/BookRideScreen';

// Inside NavigationContainer, add:
<Stack.Screen 
  name="BookRide" 
  component={BookRideScreen}
  options={{ title: 'Book a Ride' }}
/>
```

**In `passenger-app-new/src/screens/WelcomeScreen.js`**, update the "Book a Ride" button:

```javascript
// Find the "Book a Ride" TouchableOpacity and change onPress to:
onPress={() => navigation.navigate('BookRide')}
```

---

### STEP 5: Test! (15 minutes)

```powershell
cd "C:\Users\Colondo Full service\Desktop\passenger-app-new"
npx expo start
```

**Test Flow:**
1. Login with your account
2. See Welcome screen
3. Tap "Book a Ride" 
4. Allow location permissions
5. See map with your current location
6. Tap on map to set PICKUP (orange pin appears)
7. Tap again to set DROPOFF (green pin appears)
8. Enter addresses in text fields
9. Select vehicle type
10. See fare estimate appear
11. Tap "Request Ride"
12. Backend should receive the request!

---

## 🎯 What This Accomplishes

After completing these 5 steps (about 1 hour total):

✅ Passenger can see map with their location  
✅ Passenger can set pickup and dropoff by tapping  
✅ Passenger can enter addresses  
✅ Passenger can select vehicle type  
✅ Passenger sees real-time fare estimate  
✅ Passenger can request a ride  
✅ Request is sent to your backend API  

---

## 📋 After This Works

Once BookRideScreen is working, next priorities:

1. **ActiveRideScreen** (passenger) - Track driver in real-time
2. **OnlineStatusScreen** (driver) - Go online/offline
3. **AvailableRidesScreen** (driver) - See nearby requests
4. **Socket.IO integration** - Real-time updates

Each screen takes 2-3 hours. You'll have a working MVP in 2-3 days!

---

## ❓ Need Help?

If you get stuck:
- Check terminal for error messages
- Make sure backend is running (test: https://zippy-healing-production-24e4.up.railway.app/health)
- Enable location permissions on your phone
- Check that axios is installed (`npm list axios`)

---

## 🚀 You're Almost There!

The hard part (backend) is DONE. Now it's just UI work - copying code, testing, iterating. 

**Start with Step 1 right now - install axios!** ⚡

