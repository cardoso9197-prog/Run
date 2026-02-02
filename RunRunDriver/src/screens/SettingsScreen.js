import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n/i18n';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('language')}</Text>
        {['pt', 'en', 'fr'].map((lang) => (
          <TouchableOpacity
            key={lang}
            style={[styles.option, i18n.language === lang && styles.optionActive]}
            onPress={() => changeLanguage(lang)}
          >
            <Text style={styles.optionText}>
              {lang === 'pt' ? '🇵🇹 Português' : lang === 'en' ? '🇬🇧 English' : '🇫🇷 Français'}
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>{t('notifications')}</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Enable Notifications</Text>
          <Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: '#767577', true: '#FF6B00' }} />
        </View>

        <Text style={styles.sectionTitle}>{t('aboutApp')}</Text>
        <View style={styles.aboutContainer}>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>{t('appVersion')}:</Text>
            <Text style={styles.aboutValue}>1.0.1</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>{t('developer')}:</Text>
            <Text style={styles.aboutValue}>Edivaldo Cardoso</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>{t('founderTitle')}:</Text>
            <Text style={styles.aboutValue}>Edivaldo Cardoso</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>{t('company')}:</Text>
            <Text style={styles.aboutValue}>Run-Run Guiné-Bissau</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>{t('supportEmail')}:</Text>
            <Text style={[styles.aboutValue, styles.linkText]}>suporte@runrungb.com</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  card: { backgroundColor: '#FFF', margin: 15, padding: 20, borderRadius: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 10 },
  option: { padding: 15, borderRadius: 10, backgroundColor: '#F5F5F5', marginBottom: 10 },
  optionActive: { backgroundColor: '#FF6B00' },
  optionText: { fontSize: 16, fontWeight: '600' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#F5F5F5', borderRadius: 10 },
  switchLabel: { fontSize: 16 },
  aboutContainer: { backgroundColor: '#F5F5F5', borderRadius: 10, padding: 15 },
  aboutRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  aboutLabel: { fontSize: 15, fontWeight: '600', color: '#666' },
  aboutValue: { fontSize: 15, color: '#000', fontWeight: '500', textAlign: 'right', flex: 1, marginLeft: 10 },
  linkText: { color: '#FF6B00' },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 5 },
});
