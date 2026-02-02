import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { driverAPI } from '../services/api';

export default function VehicleScreen() {
  const { t } = useTranslation();
  const [vehicle, setVehicle] = useState({ type: '', plate: '', make: '', model: '', year: '', color: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVehicle();
  }, []);

  const loadVehicle = async () => {
    try {
      const response = await driverAPI.getProfile();
      setVehicle({
        type: response.data.vehicle_type,
        plate: response.data.vehicle_plate,
        make: response.data.vehicle_make,
        model: response.data.vehicle_model,
        year: response.data.vehicle_year,
        color: response.data.vehicle_color,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await driverAPI.updateVehicle(vehicle);
      Alert.alert('Success', 'Vehicle updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🚗 {t('vehicle')}</Text>
        
        <TextInput
          style={styles.input}
          placeholder={t('vehicleType')}
          value={vehicle.type}
          editable={false}
        />
        
        <TextInput
          style={styles.input}
          placeholder={t('vehiclePlate')}
          value={vehicle.plate}
          onChangeText={(text) => setVehicle({...vehicle, plate: text})}
        />
        
        <TextInput
          style={styles.input}
          placeholder={t('vehicleMake')}
          value={vehicle.make}
          onChangeText={(text) => setVehicle({...vehicle, make: text})}
        />
        
        <TextInput
          style={styles.input}
          placeholder={t('vehicleModel')}
          value={vehicle.model}
          onChangeText={(text) => setVehicle({...vehicle, model: text})}
        />
        
        <TextInput
          style={styles.input}
          placeholder={t('vehicleYear')}
          value={vehicle.year}
          onChangeText={(text) => setVehicle({...vehicle, year: text})}
        />
        
        <TextInput
          style={styles.input}
          placeholder={t('vehicleColor')}
          value={vehicle.color}
          onChangeText={(text) => setVehicle({...vehicle, color: text})}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  card: { backgroundColor: '#FFF', margin: 15, padding: 20, borderRadius: 15 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 15, fontSize: 16, marginBottom: 15 },
  button: { backgroundColor: '#FF6B00', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
});
