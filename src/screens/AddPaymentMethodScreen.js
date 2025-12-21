import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { passengerAPI } from '../services/api';

export default function AddPaymentMethodScreen({ navigation }) {
  const { t } = useTranslation();
  const [type, setType] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    // Validation
    if (type === 'card') {
      if (!cardNumber || !cardholderName || !expiryMonth || !expiryYear || !cvv) {
        Alert.alert('Error', 'Please fill all card fields');
        return;
      }
      if (cardNumber.replace(/\s/g, '').length < 13) {
        Alert.alert('Error', 'Invalid card number');
        return;
      }
    } else {
      if (!phoneNumber) {
        Alert.alert('Error', 'Please enter phone number');
        return;
      }
      // Format phone number
      const formattedPhone = phoneNumber.startsWith('+245') ? phoneNumber : `+245${phoneNumber.replace(/\D/g, '')}`;
      if (!formattedPhone.match(/^\+245\d{7,9}$/)) {
        Alert.alert('Error', 'Invalid phone number format. Use +245XXXXXXXXX');
        return;
      }
    }

    setLoading(true);
    try {
      if (type === 'card') {
        await passengerAPI.addCardPaymentMethod({
          cardNumber: cardNumber.replace(/\s/g, ''),
          cardholderName,
          expiryMonth: parseInt(expiryMonth),
          expiryYear: parseInt(expiryYear),
          cvv,
        });
      } else {
        const formattedPhone = phoneNumber.startsWith('+245') ? phoneNumber : `+245${phoneNumber.replace(/\D/g, '')}`;
        await passengerAPI.addMobilePaymentMethod({
          type,
          mobileNumber: formattedPhone,
          accountName: accountName || cardholderName,
        });
      }
      
      Alert.alert('Success', 'Payment method added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error adding payment method:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to add payment method');
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
            <Text style={styles.label}>Cardholder Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              value={cardholderName}
              onChangeText={setCardholderName}
              autoCapitalize="words"
            />
            
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="4111 1111 1111 1111"
              keyboardType="number-pad"
              value={cardNumber}
              onChangeText={setCardNumber}
              maxLength={19}
            />
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Expiry Month</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM"
                  keyboardType="number-pad"
                  value={expiryMonth}
                  onChangeText={setExpiryMonth}
                  maxLength={2}
                />
              </View>
              
              <View style={styles.halfInput}>
                <Text style={styles.label}>Expiry Year</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY"
                  keyboardType="number-pad"
                  value={expiryYear}
                  onChangeText={setExpiryYear}
                  maxLength={4}
                />
              </View>
            </View>
            
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="123"
              keyboardType="number-pad"
              value={cvv}
              onChangeText={setCvv}
              maxLength={4}
              secureTextEntry
            />
          </View>
        ) : (
          <View>
            <Text style={styles.label}>Account Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Your Name"
              value={accountName}
              onChangeText={setAccountName}
              autoCapitalize="words"
            />
            
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
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { flex: 1, marginRight: 10 },
  button: { backgroundColor: '#FF6B00', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
});
