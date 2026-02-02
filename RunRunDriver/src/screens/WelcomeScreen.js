import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n/i18n';

export default function WelcomeScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const handleLanguageChange = async (lang) => {
    setSelectedLanguage(lang);
    await changeLanguage(lang);
  };

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../../assets/icon.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Run Run Driver</Text>
        <Text style={styles.subtitle}>Guinea-Bissau 🇬🇼</Text>
      </View>

      <View style={styles.languageSection}>
        <Text style={styles.languageTitle}>{t('language')}</Text>
        <View style={styles.languageButtons}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageButton,
                selectedLanguage === lang.code && styles.languageButtonActive,
              ]}
              onPress={() => handleLanguageChange(lang.code)}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <Text style={[styles.languageText, selectedLanguage === lang.code && styles.languageTextActive]}>
                {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.primaryButtonText}>{t('register')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.secondaryButtonText}>{t('login')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#000', padding: 20, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { width: 120, height: 120, marginBottom: 20 },
  title: { fontSize: 42, fontWeight: 'bold', color: '#FF6B00', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#FFF' },
  languageSection: { marginBottom: 40 },
  languageTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, color: '#FF6B00' },
  languageButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  languageButton: { padding: 15, borderRadius: 10, backgroundColor: '#222', alignItems: 'center', minWidth: 100, borderWidth: 2, borderColor: 'transparent' },
  languageButtonActive: { borderColor: '#FF6B00', backgroundColor: '#333' },
  flag: { fontSize: 30, marginBottom: 5 },
  languageText: { fontSize: 14, color: '#AAA' },
  languageTextActive: { color: '#FF6B00', fontWeight: 'bold' },
  buttonContainer: { marginTop: 20 },
  primaryButton: { backgroundColor: '#FF6B00', padding: 18, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  primaryButtonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  secondaryButton: { backgroundColor: 'transparent', padding: 18, borderRadius: 10, alignItems: 'center', borderWidth: 2, borderColor: '#FF6B00' },
  secondaryButtonText: { color: '#FF6B00', fontSize: 18, fontWeight: 'bold' },
});
