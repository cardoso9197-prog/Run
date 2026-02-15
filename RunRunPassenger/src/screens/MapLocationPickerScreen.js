import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  Keyboard,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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
    setSearchResults([]); // Clear search results when manually selecting on map
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Use expo-location's geocoding to search for places
      const results = await Location.geocodeAsync(searchQuery);
      
      if (results && results.length > 0) {
        // Convert results to our format with reverse geocoding for better names
        const formattedResults = await Promise.all(
          results.slice(0, 5).map(async (result, index) => {
            try {
              const addresses = await Location.reverseGeocodeAsync({
                latitude: result.latitude,
                longitude: result.longitude,
              });
              
              let locationName = searchQuery;
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
                  .join(', ') || searchQuery;
              }

              return {
                id: index,
                name: locationName,
                latitude: result.latitude,
                longitude: result.longitude,
              };
            } catch (error) {
              return {
                id: index,
                name: `${result.latitude.toFixed(6)}, ${result.longitude.toFixed(6)}`,
                latitude: result.latitude,
                longitude: result.longitude,
              };
            }
          })
        );
        
        setSearchResults(formattedResults);
      } else {
        Alert.alert('No Results', 'No locations found for your search. Try a different search term.');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Search Error', 'Could not search for locations. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result) => {
    setSelectedLocation({
      latitude: result.latitude,
      longitude: result.longitude,
    });
    
    setRegion({
      latitude: result.latitude,
      longitude: result.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    
    setSearchQuery(result.name);
    setSearchResults([]);
    Keyboard.dismiss();
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

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={`🔍 Search for ${locationType} location...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.searchButtonText}>Search</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <View style={styles.searchResultsContainer}>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.searchResultItem}
                onPress={() => handleSelectSearchResult(item)}
              >
                <Text style={styles.searchResultIcon}>📍</Text>
                <Text style={styles.searchResultText} numberOfLines={2}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
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
          🔍 Search above or 📍 tap on the map to select your {locationType} location
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
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 15,
    right: 15,
    flexDirection: 'row',
    zIndex: 100,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    padding: 15,
    fontSize: 15,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 120,
    left: 15,
    right: 15,
    maxHeight: 250,
    backgroundColor: '#FFF',
    borderRadius: 10,
    zIndex: 99,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  searchResultIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  searchResultText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
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
