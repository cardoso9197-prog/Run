import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { driverAPI } from '../services/api';

export default function EarningsScreen({ navigation }) {
  const { t } = useTranslation();
  const [earnings, setEarnings] = useState({ today: 0, week: 0, month: 0, total: 0, trips: 0 });

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      const response = await driverAPI.getEarnings();
      setEarnings(response.data);
    } catch (error) {
      console.error('Error loading earnings:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>💰 {t('earnings')}</Text>
        
        <View style={styles.earningItem}>
          <Text style={styles.label}>{t('today')}</Text>
          <Text style={styles.amount}>{earnings.today} XOF</Text>
        </View>

        <View style={styles.earningItem}>
          <Text style={styles.label}>{t('week')}</Text>
          <Text style={styles.amount}>{earnings.week} XOF</Text>
        </View>

        <View style={styles.earningItem}>
          <Text style={styles.label}>{t('month')}</Text>
          <Text style={styles.amount}>{earnings.month} XOF</Text>
        </View>

        <View style={[styles.earningItem, styles.totalItem]}>
          <Text style={styles.totalLabel}>{t('totalEarnings')}</Text>
          <Text style={styles.totalAmount}>{earnings.total} XOF</Text>
        </View>

        <Text style={styles.tripsText}>{t('trips')}: {earnings.trips}</Text>

        {/* Withdraw Button */}
        <TouchableOpacity
          style={styles.withdrawButton}
          onPress={() => navigation.navigate('Withdraw')}
        >
          <Text style={styles.withdrawButtonText}>💸 Withdraw Earnings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  card: { backgroundColor: '#FFF', margin: 15, padding: 20, borderRadius: 15 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  earningItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  label: { fontSize: 18, color: '#666' },
  amount: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  totalItem: { backgroundColor: '#FF6B00', marginTop: 20, padding: 20, borderRadius: 10, borderBottomWidth: 0 },
  totalLabel: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  totalAmount: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  tripsText: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 20 },
  withdrawButton: {
    backgroundColor: '#000',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  withdrawButtonText: { color: '#FF6B00', fontSize: 18, fontWeight: 'bold' },
});
