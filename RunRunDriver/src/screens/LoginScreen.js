import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

export default function LoginScreen({ navigation }) {
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const formattedPhone = phone.startsWith('+245') ? phone : `+245${phone}`;
    setLoading(true);
    
    try {
      const response = await authAPI.login({ phone: formattedPhone, password }).catch(err => {
        console.error('Login API Error:', err);
        throw err;
      });
      
      console.log('Login response:', response?.data);
      
      if (response && response.data && response.data.token) {
        // Store token FIRST before any other storage operations
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userRole', 'driver');
        
        // Store driver name for immediate display on app reopen
        if (response.data.user?.name) {
          await AsyncStorage.setItem('driverName', response.data.user.name);
        }
        
        // Store complete user data
        if (response.data.user) {
          await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        }
        
        // Check if driver is activated
        const activated = response.data.user?.is_activated || false;
        await AsyncStorage.setItem('driverActivated', activated ? 'true' : 'false');
        
        console.log('Token saved, navigating to:', activated ? 'Home' : 'PendingActivation');
        
        // Navigate with a slight delay to ensure storage is complete
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: activated ? 'Home' : 'PendingActivation' }],
          });
        }, 100);
      } else {
        Alert.alert('Login Failed', 'Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error?.response?.data?.message || error?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{t('login')}</Text>
        
        <TextInput
          style={styles.input}
          placeholder={t('phone')}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        
        <TextInput
          style={styles.input}
          placeholder={t('password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Loading...' : t('login')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>{t('alreadyHaveAccount')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F5F5F5', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 15, padding: 25 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 15, fontSize: 16, marginBottom: 15 },
  button: { backgroundColor: '#FF6B00', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  linkText: { color: '#FF6B00', fontSize: 16, fontWeight: '600', textAlign: 'center', marginTop: 20 },
});
