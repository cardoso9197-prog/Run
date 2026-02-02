import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

export default function OTPVerificationScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { phone, phoneNumber, otp: receivedOtp } = route.params || {};
  const finalPhone = phoneNumber || phone;
  
  // Auto-fill OTP for testing (if provided)
  const [otp, setOtp] = useState(receivedOtp || '');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Error', 'Please enter valid OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.verifyOTP({ 
        phoneNumber: finalPhone,
        phone: finalPhone, // Send both for compatibility
        otp 
      });
      
      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        
        // Navigate immediately - no Alert callback delay
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Invalid OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authAPI.resendOTP({ phone: finalPhone });
      Alert.alert('Success', 'OTP sent again');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{t('enterOTP')}</Text>
        <Text style={styles.subtitle}>Sent to {finalPhone}</Text>

        <TextInput
          style={styles.input}
          placeholder="1234"
          keyboardType="number-pad"
          value={otp}
          onChangeText={setOtp}
          maxLength={6}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Verifying...' : t('verify')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resendButton} onPress={handleResend}>
          <Text style={styles.resendText}>{t('resendOTP')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 20,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 10,
  },
  button: {
    backgroundColor: '#FF6B00',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  resendText: {
    color: '#FF6B00',
    fontSize: 16,
    fontWeight: '600',
  },
});
