import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Picker } from 'react-native';
import { useTranslation } from 'react-i18next';
import { authAPI } from '../services/api';

export default function RegisterScreen({ navigation }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    vehicleType: 'Normal',
    vehiclePlate: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleColor: '',
    licenseNumber: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.name || !formData.phone || !formData.password || !formData.vehiclePlate || !formData.licenseNumber) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const formattedPhone = formData.phone.startsWith('+245') ? formData.phone : `+245${formData.phone}`;
    setLoading(true);

    try {
      const response = await authAPI.register({
        name: formData.name,
        phone: formattedPhone,
        password: formData.password,
        role: 'driver',
        vehicle_type: formData.vehicleType,
        vehicle_plate: formData.vehiclePlate,
        vehicle_make: formData.vehicleMake,
        vehicle_model: formData.vehicleModel,
        vehicle_year: formData.vehicleYear,
        vehicle_color: formData.vehicleColor,
        license_number: formData.licenseNumber,
      });

      // Registration successful - navigate to OTP screen
      if (response.data.success && response.data.otp) {
        Alert.alert(
          'OTP Sent!',
          `Your verification code is: ${response.data.otp}\n\nEnter this code on the next screen.`,
          [
            {
              text: 'Continue',
              onPress: () => navigation.navigate('OTPVerification', {
                phoneNumber: response.data.phoneNumber || formattedPhone,
                otp: response.data.otp,
              }),
            },
          ]
        );
      } else {
        Alert.alert('Success', 'Account created! Please login and visit office for activation.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{t('register')}</Text>
        
        <TextInput
          style={styles.input}
          placeholder={t('name') + ' *'}
          value={formData.name}
          onChangeText={(text) => setFormData({...formData, name: text})}
        />
        
        <TextInput
          style={styles.input}
          placeholder={t('phone') + ' *'}
          value={formData.phone}
          onChangeText={(text) => setFormData({...formData, phone: text})}
          keyboardType="phone-pad"
        />
        
        <TextInput
          style={styles.input}
          placeholder={t('password') + ' *'}
          value={formData.password}
          onChangeText={(text) => setFormData({...formData, password: text})}
          secureTextEntry
        />
        
        <TextInput
          style={styles.input}
          placeholder="Confirm Password *"
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
          secureTextEntry
        />

        <Text style={styles.sectionTitle}>🚗 Vehicle Information</Text>
        
        <View style={styles.vehicleTypeContainer}>
          {['Moto', 'Normal', 'Premium'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.vehicleTypeButton, formData.vehicleType === type && styles.vehicleTypeButtonActive]}
              onPress={() => setFormData({...formData, vehicleType: type})}
            >
              <Text style={styles.vehicleTypeText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TextInput
          style={styles.input}
          placeholder={t('vehiclePlate') + ' *'}
          value={formData.vehiclePlate}
          onChangeText={(text) => setFormData({...formData, vehiclePlate: text})}
          autoCapitalize="characters"
        />
        
        <TextInput
          style={styles.input}
          placeholder={t('vehicleMake')}
          value={formData.vehicleMake}
          onChangeText={(text) => setFormData({...formData, vehicleMake: text})}
        />
        
        <TextInput
          style={styles.input}
          placeholder={t('vehicleModel')}
          value={formData.vehicleModel}
          onChangeText={(text) => setFormData({...formData, vehicleModel: text})}
        />
        
        <TextInput
          style={styles.input}
          placeholder={t('licenseNumber') + ' *'}
          value={formData.licenseNumber}
          onChangeText={(text) => setFormData({...formData, licenseNumber: text})}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating...' : t('register')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>{t('alreadyHaveAccount')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F5F5F5', padding: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 15, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 15, fontSize: 16, marginBottom: 15 },
  vehicleTypeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  vehicleTypeButton: { flex: 1, padding: 15, borderRadius: 10, backgroundColor: '#F5F5F5', alignItems: 'center', marginHorizontal: 5, borderWidth: 2, borderColor: 'transparent' },
  vehicleTypeButtonActive: { borderColor: '#FF6B00', backgroundColor: '#FFE8D6' },
  vehicleTypeText: { fontSize: 14, fontWeight: '600' },
  button: { backgroundColor: '#FF6B00', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  linkText: { color: '#FF6B00', fontSize: 16, fontWeight: '600', textAlign: 'center', marginTop: 20 },
});
