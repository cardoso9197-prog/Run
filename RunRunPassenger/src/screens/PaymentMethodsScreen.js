// PaymentMethodsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { passengerAPI } from '../services/api';

export default function PaymentMethodsScreen({ navigation }) {
  const { t } = useTranslation();
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const response = await passengerAPI.getPaymentMethods();
      // Backend returns { success: true, paymentMethods: [...] }
      setPaymentMethods(response.data.paymentMethods || []);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      Alert.alert('Error', 'Failed to load payment methods');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await passengerAPI.setDefaultPaymentMethod(id);
      loadPaymentMethods();
      Alert.alert('Success', 'Default payment method updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update default payment method');
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Delete Payment Method', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await passengerAPI.deletePaymentMethod(id);
            loadPaymentMethods();
            Alert.alert('Success', 'Payment method deleted');
          } catch (error) {
            Alert.alert('Error', 'Failed to delete payment method');
          }
        },
      },
    ]);
  };

  const getPaymentIcon = (type) => {
    const icons = {
      card: '💳',
      orange_money: '🟠',
      mtn_money: '🟡',
    };
    return icons[type] || '💳';
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.list}>
        {paymentMethods.map((method) => (
          <View key={method.id} style={[styles.card, method.is_default && styles.cardDefault]}>
            <View style={styles.cardHeader}>
              <Text style={styles.icon}>{getPaymentIcon(method.type)}</Text>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>
                  {method.type === 'card'
                    ? `${method.card_brand} •••• ${method.card_last_four}`
                    : `${method.type.replace('_', ' ').toUpperCase()} ${method.phone_number}`}
                </Text>
                {method.is_default && <Text style={styles.defaultBadge}>Default</Text>}
              </View>
            </View>
            <View style={styles.cardActions}>
              {!method.is_default && (
                <TouchableOpacity onPress={() => handleSetDefault(method.id)}>
                  <Text style={styles.actionText}>Set Default</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => handleDelete(method.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddPaymentMethod')}
      >
        <Text style={styles.addButtonText}>+ Add Payment Method</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  list: { flex: 1, padding: 15 },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  cardDefault: { borderWidth: 2, borderColor: '#FF6B00' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  icon: { fontSize: 40, marginRight: 15 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
  defaultBadge: { fontSize: 12, color: '#FF6B00', fontWeight: 'bold', marginTop: 5 },
  cardActions: { flexDirection: 'row', justifyContent: 'space-between' },
  actionText: { color: '#4CAF50', fontWeight: 'bold' },
  deleteText: { color: '#FF5252', fontWeight: 'bold' },
  addButton: { backgroundColor: '#FF6B00', padding: 18, margin: 15, borderRadius: 10, alignItems: 'center' },
  addButtonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
});
