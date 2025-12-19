import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n/i18n';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState(true);

  const handleLanguageChange = async (lang) => {
    await changeLanguage(lang);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('language')}</Text>
        {['pt', 'en', 'fr'].map((lang) => (
          <TouchableOpacity
            key={lang}
            style={[styles.option, i18n.language === lang && styles.optionActive]}
            onPress={() => handleLanguageChange(lang)}
          >
            <Text style={styles.optionText}>
              {lang === 'pt' ? '🇵🇹 Português' : lang === 'en' ? '🇬🇧 English' : '🇫🇷 Français'}
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>{t('notifications')}</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Enable Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#767577', true: '#FF6B00' }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  card: { backgroundColor: '#FFF', margin: 15, padding: 20, borderRadius: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 10, color: '#000' },
  option: { padding: 15, borderRadius: 10, backgroundColor: '#F5F5F5', marginBottom: 10 },
  optionActive: { backgroundColor: '#FF6B00' },
  optionText: { fontSize: 16, fontWeight: '600' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#F5F5F5', borderRadius: 10 },
  switchLabel: { fontSize: 16 },
});
