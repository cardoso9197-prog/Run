import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function SupportScreen() {
  const { t } = useTranslation();

  const numbers = [
    { label: '+245 966 084 539', value: 'tel:+245966084539' },
    { label: '+245 957 338 295', value: 'tel:+245957338295' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>📞 {t('contactSupport')}</Text>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Telefones:</Text>
          {numbers.map((num) => (
            <TouchableOpacity key={num.value} onPress={() => Linking.openURL(num.value)}>
              <Text style={[styles.value, styles.linkText]}>{num.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Office Address:</Text>
          <Text style={styles.value}>{t('officeAddress')}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>{t('supportEmail')}:</Text>
          <Text style={[styles.value, styles.linkText]}>suporte@runrungb.com</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>{t('hours')}:</Text>
          <Text style={styles.value}>{t('monFri')}</Text>
          <Text style={styles.value}>{t('sat')}</Text>
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>{t('frequentlyAskedQuestions')}</Text>
          <Text style={styles.faqItem}>{t('cancelRideQuestion')}</Text>
          <Text style={styles.faqAnswer}>{t('cancelRideAnswer')}</Text>
          <Text style={styles.faqItem}>{t('paymentMethodsQuestion')}</Text>
          <Text style={styles.faqAnswer}>{t('paymentMethodsAnswer')}</Text>
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
