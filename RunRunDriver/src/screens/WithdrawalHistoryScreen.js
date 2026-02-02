import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { driverAPI } from '../services/api';

export default function WithdrawalHistoryScreen() {
  const { t } = useTranslation();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const loadWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await driverAPI.getWithdrawalHistory();
      setWithdrawals(response.data.withdrawals);
    } catch (error) {
      console.error('Error loading withdrawals:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadWithdrawals();
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: '#4CAF50',
      pending: '#FF9800',
      processing: '#2196F3',
      failed: '#F44336',
      cancelled: '#757575',
    };
    return colors[status] || '#757575';
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: '✅',
      pending: '⏳',
      processing: '🔄',
      failed: '❌',
      cancelled: '🚫',
    };
    return icons[status] || '•';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatMethod = (method) => {
    return method === 'orange_money' ? '🟠 Orange Money' : '🟡 MTN MoMo';
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>Loading withdrawals...</Text>
      </View>
    );
  }

  if (withdrawals.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyIcon}>💸</Text>
        <Text style={styles.emptyText}>No withdrawals yet</Text>
        <Text style={styles.emptySubtext}>Your withdrawal history will appear here</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF6B00']} />
      }
    >
      <View style={styles.list}>
        {withdrawals.map((withdrawal) => (
          <View key={withdrawal.id} style={styles.card}>
            <View style={styles.header}>
              <View style={styles.methodContainer}>
                <Text style={styles.methodText}>{formatMethod(withdrawal.method)}</Text>
                <Text style={styles.phoneText}>{withdrawal.mobileNumber}</Text>
              </View>
              <View style={styles.statusContainer}>
                <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(withdrawal.status) }]}>
                  {getStatusIcon(withdrawal.status)} {withdrawal.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Amount Withdrawn</Text>
              <Text style={styles.amount}>{withdrawal.amount.toFixed(0)} XOF</Text>
              {withdrawal.netAmount !== withdrawal.amount && (
                <Text style={styles.netAmount}>
                  Net: {withdrawal.netAmount.toFixed(0)} XOF
                </Text>
              )}
            </View>

            <View style={styles.details}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Transaction ID:</Text>
                <Text style={styles.detailValue}>{withdrawal.transactionId}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Type:</Text>
                <Text style={styles.detailValue}>{withdrawal.frequency}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Requested:</Text>
                <Text style={styles.detailValue}>{formatDate(withdrawal.requestedAt)}</Text>
              </View>
              {withdrawal.completedAt && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Completed:</Text>
                  <Text style={styles.detailValue}>{formatDate(withdrawal.completedAt)}</Text>
                </View>
              )}
              {withdrawal.errorMessage && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>❌ {withdrawal.errorMessage}</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  
  emptyIcon: { fontSize: 64, marginBottom: 20 },
  emptyText: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  emptySubtext: { fontSize: 14, color: '#666' },
  
  list: { padding: 15 },
  
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  
  methodContainer: { flex: 1 },
  methodText: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  phoneText: { fontSize: 13, color: '#666' },
  
  statusContainer: { alignItems: 'flex-end' },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFF',
    overflow: 'hidden',
  },
  
  amountContainer: { marginBottom: 15 },
  amountLabel: { fontSize: 12, color: '#666', marginBottom: 5 },
  amount: { fontSize: 28, fontWeight: 'bold', color: '#000' },
  netAmount: { fontSize: 14, color: '#666', marginTop: 5 },
  
  details: { marginTop: 10 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: { fontSize: 13, color: '#666' },
  detailValue: { fontSize: 13, color: '#333', fontWeight: '500', flex: 1, textAlign: 'right' },
  
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  errorText: { fontSize: 12, color: '#C62828' },
});
