import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function TripDetailsScreen({ route }) {
  const { t } = useTranslation();
  const { rideId } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{t('tripDetails')}</Text>
        <Text style={styles.text}>Trip ID: {rideId}</Text>
        <Text style={styles.text}>Date: December 19, 2025</Text>
        <Text style={styles.text}>Time: 10:30 AM</Text>
        <Text style={styles.text}>From: Bissau Center</Text>
        <Text style={styles.text}>To: Airport</Text>
        <Text style={styles.text}>Fare: 2,500 XOF</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{t('viewReceipt')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  card: { backgroundColor: '#FFF', margin: 15, padding: 20, borderRadius: 15 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  text: { fontSize: 16, marginBottom: 10, color: '#333' },
  button: { backgroundColor: '#FF6B00', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
});
