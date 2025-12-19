import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function SupportScreen() {
  const { t } = useTranslation();

  const handleCall = () => {
    Linking.openURL('tel:+245955971275');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>📞 {t('contactSupport')}</Text>
        
        <View style={styles.infoSection}>
          <Text style={styles.label}>Office Address:</Text>
          <Text style={styles.value}>{t('officeAddress')}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{t('officePhone')}</Text>
          <Text style={styles.value}>+245 955 981 398</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Hours:</Text>
          <Text style={styles.value}>Mon-Fri: 8:00 AM - 6:00 PM</Text>
          <Text style={styles.value}>Sat: 9:00 AM - 2:00 PM</Text>
        </View>

        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Text style={styles.callButtonText}>{t('callNow')}</Text>
        </TouchableOpacity>

        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          <Text style={styles.faqItem}>Q: How do I cancel a ride?</Text>
          <Text style={styles.faqAnswer}>A: Go to Active Ride and tap "Cancel Ride"</Text>
          <Text style={styles.faqItem}>Q: What payment methods are accepted?</Text>
          <Text style={styles.faqAnswer}>A: Visa, Mastercard, Orange Money, MTN Money</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  card: { backgroundColor: '#FFF', margin: 15, padding: 20, borderRadius: 15 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  infoSection: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 5 },
  value: { fontSize: 16, color: '#666', marginBottom: 3 },
  callButton: { backgroundColor: '#4CAF50', padding: 18, borderRadius: 10, alignItems: 'center', marginVertical: 20 },
  callButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  faqSection: { marginTop: 20, padding: 15, backgroundColor: '#F9F9F9', borderRadius: 10 },
  faqTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  faqItem: { fontSize: 16, fontWeight: '600', color: '#000', marginTop: 10 },
  faqAnswer: { fontSize: 14, color: '#666', marginBottom: 5 },
});
