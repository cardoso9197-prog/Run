import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { rideAPI } from '../services/api';

export default function TripHistoryScreen({ navigation }) {
  const { t } = useTranslation();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setError(null);
      const response = await rideAPI.getTripHistory();
      // Backend returns { success, rides: [...] }
      const data = response.data;
      const ridesList = data.rides || data || [];
      setTrips(Array.isArray(ridesList) ? ridesList : []);
    } catch (err) {
      console.error('Error loading trips:', err);
      setError('Failed to load trip history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTrips();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('pt-PT', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    if (status === 'completed') return '#4CAF50';
    if (status === 'cancelled') return '#F44336';
    return '#FF6B00';
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return '✅';
    if (status === 'cancelled') return '❌';
    return '⏳';
  };

  const getPaymentIcon = (method) => {
    if (!method) return '💵';
    if (method.toLowerCase().includes('orange')) return '🟠';
    if (method.toLowerCase().includes('card')) return '💳';
    return '💵';
  };

  const renderTrip = ({ item }) => {
    // Backend returns camelCase from /history endpoint
    const pickup = item.pickupAddress || item.pickup_address || item.pickup?.address || '—';
    const dropoff = item.dropoffAddress || item.dropoff_address || item.dropoff?.address || '—';
    const fare = item.finalFare || item.final_fare || item.estimatedFare || item.estimated_fare || 0;
    const date = item.completedAt || item.completed_at || item.requestedAt || item.requested_at || item.createdAt || item.created_at;
    const vehicleType = item.vehicleType || item.vehicle_type || item.vehicle?.type || 'RunRun';
    const payMethod = item.payment?.method || item.paymentMethod || item.payment_method || 'cash';

    return (
      <TouchableOpacity
        style={styles.tripCard}
        onPress={() => navigation.navigate('TripDetails', { rideId: item.id })}
        activeOpacity={0.7}
      >
        {/* Header row */}
        <View style={styles.tripHeader}>
          <Text style={styles.tripDate}>{formatDate(date)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.tripStatus, { color: getStatusColor(item.status) }]}>
              {getStatusIcon(item.status)} {item.status}
            </Text>
          </View>
        </View>

        {/* Route */}
        <View style={styles.routeRow}>
          <View style={[styles.routeDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.routeText} numberOfLines={1}>{pickup}</Text>
        </View>
        <View style={styles.routeConnector} />
        <View style={styles.routeRow}>
          <View style={[styles.routeDot, { backgroundColor: '#F44336' }]} />
          <Text style={styles.routeText} numberOfLines={1}>{dropoff}</Text>
        </View>

        {/* Footer */}
        <View style={styles.tripFooter}>
          <Text style={styles.tripVehicle}>🚗 {vehicleType}</Text>
          <View style={styles.tripFareRow}>
            <Text style={styles.payIcon}>{getPaymentIcon(payMethod)}</Text>
            <Text style={styles.tripFare}>{Math.round(fare).toLocaleString()} XOF</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>Loading trip history...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => { setLoading(true); loadTrips(); }}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={trips}
        renderItem={renderTrip}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={trips.length === 0 ? styles.emptyContainer : styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF6B00']} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>🚗</Text>
            <Text style={styles.emptyTitle}>No trips yet</Text>
            <Text style={styles.emptySubtitle}>Your completed trips will appear here</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  listContent: { padding: 15 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  errorText: { fontSize: 16, color: '#d32f2f', marginBottom: 16 },
  retryBtn: { backgroundColor: '#FF6B00', paddingVertical: 12, paddingHorizontal: 28, borderRadius: 8 },
  retryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  tripCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  tripHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  tripDate: { fontSize: 13, color: '#888' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  tripStatus: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },

  routeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  routeDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10, flexShrink: 0 },
  routeText: { fontSize: 13, color: '#1a1a1a', fontWeight: '500', flex: 1 },
  routeConnector: { width: 2, height: 12, backgroundColor: '#e0e0e0', marginLeft: 4, marginBottom: 2 },

  tripFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f5f5f5' },
  tripVehicle: { fontSize: 13, color: '#888' },
  tripFareRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  payIcon: { fontSize: 14 },
  tripFare: { fontSize: 16, fontWeight: 'bold', color: '#FF6B00' },

  emptyWrap: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 52, marginBottom: 14 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#333' },
  emptySubtitle: { fontSize: 14, color: '#aaa', marginTop: 6, textAlign: 'center' },
});
