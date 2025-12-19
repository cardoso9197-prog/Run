import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { passengerAPI } from '../services/api';

export default function AddPaymentMethodScreen({ navigation }) {
  const { t } = useTranslation();
  const [type, setType] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      const data = type === 'card'
        ? { type, card_number: cardNumber, card_brand: cardNumber.startsWith('4') ? 'Visa' : 'Mastercard' }
        : { type, phone_number: phoneNumber };
      
      await passengerAPI.addPaymentMethod(data);
      Alert.alert('Success', 'Payment method added', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add payment method');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Select Payment Type</Text>
        <View style={styles.typeButtons}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'card' && styles.typeButtonActive]}
            onPress={() => setType('card')}
          >
            <Text style={styles.typeText}>💳 Card</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'orange_money' && styles.typeButtonActive]}
            onPress={() => setType('orange_money')}
          >
            <Text style={styles.typeText}>🟠 Orange</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'mtn_money' && styles.typeButtonActive]}
            onPress={() => setType('mtn_money')}
          >
            <Text style={styles.typeText}>🟡 MTN</Text>
          </TouchableOpacity>
        </View>

        {type === 'card' ? (
          <View>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="4111 1111 1111 1111"
              keyboardType="number-pad"
              value={cardNumber}
              onChangeText={setCardNumber}
              maxLength={19}
            />
          </View>
        ) : (
          <View>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+245 955 971 275"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAdd}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Adding...' : 'Add Payment Method'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  card: { backgroundColor: '#FFF', margin: 15, padding: 20, borderRadius: 15 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  typeButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  typeButton: { flex: 1, padding: 15, borderRadius: 10, backgroundColor: '#F5F5F5', alignItems: 'center', marginHorizontal: 5, borderWidth: 2, borderColor: 'transparent' },
  typeButtonActive: { borderColor: '#FF6B00', backgroundColor: '#FFE8D6' },
  typeText: { fontSize: 14, fontWeight: '600' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 15, fontSize: 16, marginBottom: 20 },
  button: { backgroundColor: '#FF6B00', padding: 18, borderRadius: 10, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
});
