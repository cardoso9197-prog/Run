import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { authAPI, driverAPI } from '../services/api';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      const userData = response.data.user;
      const profileData = userData.profile || {};
      
      setProfile({
        name: profileData.name || '',
        email: profileData.email || '',
        phone: userData.phoneNumber || '',
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await driverAPI.updateProfile({
        name: profile.name,
        email: profile.email,
      });
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        
        <TextInput
          style={styles.input}
          placeholder={t('name')}
          value={profile.name}
          onChangeText={(text) => setProfile({...profile, name: text})}
        />
        
        <TextInput
          style={styles.input}
          placeholder={t('phone')}
          value={profile.phone}
          editable={false}
        />
        
        <TextInput
          style={styles.input}
          placeholder={t('email')}
          value={profile.email || ''}
          onChangeText={(text) => setProfile({...profile, email: text})}
          keyboardType="email-address"
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Saving...' : t('save')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  card: { backgroundColor: '#FFF', margin: 15, padding: 20, borderRadius: 15 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FF6B00', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 20 },
  avatarText: { fontSize: 50 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 15, fontSize: 16, marginBottom: 15 },
  button: { backgroundColor: '#FF6B00', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
});
