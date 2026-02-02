import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pt from './locales/pt.json';
import en from './locales/en.json';
import fr from './locales/fr.json';

const LANGUAGE_KEY = 'userLanguage';

const getInitialLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    return savedLanguage || 'pt';
  } catch (error) {
    return 'pt';
  }
};

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      pt: { translation: pt },
      en: { translation: en },
      fr: { translation: fr },
    },
    lng: 'pt',
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
  });

getInitialLanguage().then(language => {
  i18n.changeLanguage(language);
});

export const changeLanguage = async (language) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
    i18n.changeLanguage(language);
  } catch (error) {
    console.error('Error saving language:', error);
  }
};

export default i18n;
