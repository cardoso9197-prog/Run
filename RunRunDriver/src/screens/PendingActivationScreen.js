import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { driverAPI } from '../services/api';

export default function PendingActivationScreen({ navigation }) {
  const { t } = useTranslation();
  const [checking, setChecking] = useState(false);

  const handleCheckActivation = async () => {
    setChecking(true);
    try {
      const response = await driverAPI.getProfile();
      
      if (response.data.is_activated) {
        await AsyncStorage.setItem('driverActivated', 'true');
        Alert.alert('Success', 'Your account is now activated!', [
          {
            text: 'OK',
            onPress: () =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              }),
          },
        ]);
      } else {
        Alert.alert(
          'Still Pending',
          'Your account is not yet activated. Please visit our office.'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to check activation status');
    } finally {
      setChecking(false);
    }
  };

  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  const handleLogout = async () => {
    try {
      // Clear all auth data including cached driver name
      await AsyncStorage.multiRemove(['userToken', 'userRole', 'driverActivated', 'driverName', 'userData']);
      
      // Reset navigation stack to Welcome screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>⏳</Text>
      </View>

      <Text style={styles.title}>{t('activationPending')}</Text>
      <Text style={styles.message}>{t('activationMessage')}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📋 {t('requiredDocuments')}</Text>
        <Text style={styles.listItem}>✓ {t('driversLicense')}</Text>
        <Text style={styles.listItem}>✓ {t('vehicleRegistration')}</Text>
        <Text style={styles.listItem}>✓ {t('insurance')}</Text>
        <Text style={styles.listItem}>✓ National ID / Passport</Text>
        <Text style={styles.listItem}>✓ Vehicle Inspection Certificate</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🏢 {t('officeInfo')}</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Address:</Text>
          <Text style={styles.infoValue}>{t('officeAddress')}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>📞 Phone:</Text>
          <View>
            <TouchableOpacity onPress={() => handleCall('+245955971275')}>
              <Text style={styles.phoneNumber}>{t('officePhone')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCall('+245955981398')}>
              <Text style={styles.phoneNumber}>+245 955 981 398</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>🕐 {t('officeHours')}</Text>
          <View>
            <Text style={styles.infoValue}>{t('hoursWeekday')}</Text>
            <Text style={styles.infoValue}>{t('hoursSaturday')}</Text>
            <Text style={styles.infoValue}>Sun: Closed</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.callButton}
          onPress={() => handleCall('+245955971275')}
        >
          <Text style={styles.callButtonText}>📞 {t('callOffice')}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.checkButton, checking && styles.checkButtonDisabled]}
        onPress={handleCheckActivation}
        disabled={checking}
      >
        <Text style={styles.checkButtonText}>
          {checking ? 'Checking...' : t('checkActivation')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>{t('logout')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#000',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  listItem: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  infoRow: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
    marginBottom: 3,
  },
  phoneNumber: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  callButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  callButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkButton: {
    backgroundColor: '#FF6B00',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  checkButtonDisabled: {
    opacity: 0.6,
  },
  checkButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 15,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FF5252',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
