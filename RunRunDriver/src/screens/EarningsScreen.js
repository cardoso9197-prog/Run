import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { driverAPI } from '../services/api';

export default function EarningsScreen({ navigation }) {
  const { t } = useTranslation();
  const [earnings, setEarnings] = useState({ today: 0, week: 0, month: 0, total: 0, trips: 0 });
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      // Fetch all periods in parallel
      const [todayRes, weekRes, monthRes, allRes, detailsRes] = await Promise.all([
        driverAPI.getEarnings('today'),
        driverAPI.getEarnings('week'),
        driverAPI.getEarnings('month'),
        driverAPI.getEarnings('all'),
        driverAPI.getEarningsDetails(),
      ]);

      const parse = (res) => {
        const e = res.data?.earnings || {};
        return {
          earnings: parseFloat(e.total_earnings || e.driver_earnings || 0),
          trips: parseInt(e.total_rides || 0),
        };
      };

      setEarnings({
        today: parse(todayRes).earnings,
        week: parse(weekRes).earnings,
        month: parse(monthRes).earnings,
        total: parse(allRes).earnings,
        trips: parse(allRes).trips,
      });

      const trips = detailsRes.data?.earnings || [];
      setRecentTrips(trips.slice(0, 10));
    } catch (error) {
      console.error('Error loading earnings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadEarnings();
  };

  const formatAmount = (n) => Math.round(n || 0).toLocaleString();

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
  };

  const getPaymentIcon = (method) => {
    if (!method) return '💵';
    if (method.toLowerCase().includes('orange')) return '🟠';
    if (method.toLowerCase().includes('card')) return '💳';
    return '💵';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>Loading earnings...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF6B00']} />}
    >
      {/* Total earnings hero */}
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Total Earnings</Text>
        <Text style={styles.heroAmount}>{formatAmount(earnings.total)} XOF</Text>
        <Text style={styles.heroTrips}>{earnings.trips} trips completed</Text>
      </View>

      {/* Period breakdown */}
      <View style={styles.periodsCard}>
        <Text style={styles.cardTitle}>💰 {t('earnings')}</Text>

        <View style={styles.periodRow}>
          <View style={styles.periodBox}>
            <Text style={styles.periodLabel}>Today</Text>
            <Text style={styles.periodAmount}>{formatAmount(earnings.today)}</Text>
            <Text style={styles.periodCurrency}>XOF</Text>
          </View>
          <View style={[styles.periodBox, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#f0f0f0' }]}>
            <Text style={styles.periodLabel}>This Week</Text>
            <Text style={styles.periodAmount}>{formatAmount(earnings.week)}</Text>
            <Text style={styles.periodCurrency}>XOF</Text>
          </View>
          <View style={styles.periodBox}>
            <Text style={styles.periodLabel}>This Month</Text>
            <Text style={styles.periodAmount}>{formatAmount(earnings.month)}</Text>
            <Text style={styles.periodCurrency}>XOF</Text>
          </View>
        </View>
      </View>

      {/* Recent trips */}
      {recentTrips.length > 0 && (
        <View style={styles.tripsCard}>
          <Text style={styles.cardTitle}>🗂️ Recent Trips</Text>
          {recentTrips.map((trip, index) => (
            <View key={trip.id || index} style={styles.tripRow}>
              <View style={styles.tripLeft}>
                <Text style={styles.tripPayIcon}>{getPaymentIcon(trip.payment_method)}</Text>
              </View>
              <View style={styles.tripMiddle}>
                <Text style={styles.tripRoute} numberOfLines={1}>
                  {trip.pickup_address?.split(',')[0] || '—'} → {trip.dropoff_address?.split(',')[0] || '—'}
                </Text>
                <Text style={styles.tripDate}>{formatDate(trip.completed_at)}</Text>
              </View>
              <Text style={styles.tripEarnings}>+{formatAmount(trip.driver_earnings)} XOF</Text>
            </View>
          ))}
        </View>
      )}

      {recentTrips.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>🚗</Text>
          <Text style={styles.emptyTitle}>No trips yet</Text>
          <Text style={styles.emptySubtitle}>Complete trips to see your earnings here</Text>
        </View>
      )}

      {/* Withdraw Button */}
      <TouchableOpacity
        style={styles.withdrawButton}
        onPress={() => navigation.navigate('Withdraw')}
      >
        <Text style={styles.withdrawButtonText}>💸 Withdraw Earnings</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },

  heroCard: {
    backgroundColor: '#FF6B00',
    padding: 30,
    alignItems: 'center',
  },
  heroLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 6 },
  heroAmount: { fontSize: 46, fontWeight: '900', color: '#fff' },
  heroTrips: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 6 },

  periodsCard: {
    backgroundColor: '#fff',
    margin: 15,
    marginBottom: 0,
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 16 },

  periodRow: { flexDirection: 'row' },
  periodBox: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  periodLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
  periodAmount: { fontSize: 20, fontWeight: '800', color: '#1a1a1a' },
  periodCurrency: { fontSize: 11, color: '#aaa', marginTop: 2 },

  tripsCard: {
    backgroundColor: '#fff',
    margin: 15,
    marginBottom: 0,
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  tripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  tripLeft: { marginRight: 10 },
  tripPayIcon: { fontSize: 22 },
  tripMiddle: { flex: 1 },
  tripRoute: { fontSize: 13, fontWeight: '600', color: '#1a1a1a' },
  tripDate: { fontSize: 12, color: '#aaa', marginTop: 2 },
  tripEarnings: { fontSize: 14, fontWeight: '800', color: '#FF6B00' },

  emptyCard: {
    backgroundColor: '#fff',
    margin: 15,
    marginBottom: 0,
    borderRadius: 14,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
  emptySubtitle: { fontSize: 13, color: '#aaa', marginTop: 6, textAlign: 'center' },

  withdrawButton: {
    backgroundColor: '#1a1a1a',
    margin: 15,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  withdrawButtonText: { color: '#FF6B00', fontSize: 17, fontWeight: 'bold' },
});
