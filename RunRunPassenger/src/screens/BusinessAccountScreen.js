import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://zippy-healing-production-24e4.up.railway.app/api';

export default function BusinessAccountScreen({ navigation }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [hasBusinessAccount, setHasBusinessAccount] = useState(false);
  const [businessAccount, setBusinessAccount] = useState(null);
  const [formData, setFormData] = useState({
    company_name: '',
    tax_id: '',
    company_address: '',
    company_phone: '',
    company_email: '',
    business_type: '',
    invoice_email: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadBusinessAccount();
  }, []);

  const loadBusinessAccount = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_URL}/business-accounts/my-account`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.hasBusinessAccount) {
        setHasBusinessAccount(true);
        setBusinessAccount(response.data.businessAccount);
        setFormData({
          company_name: response.data.businessAccount.company_name || '',
          tax_id: response.data.businessAccount.tax_id || '',
          company_address: response.data.businessAccount.company_address || '',
          company_phone: response.data.businessAccount.company_phone || '',
          company_email: response.data.businessAccount.company_email || '',
          business_type: response.data.businessAccount.business_type || '',
          invoice_email: response.data.businessAccount.invoice_email || '',
        });
      }
    } catch (error) {
      console.error('Error loading business account:', error);
      Alert.alert('Erro', 'Falha ao carregar conta empresarial');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!formData.company_name || !formData.invoice_email) {
      Alert.alert('Erro', 'Por favor, preencha os campos obrigatórios');
      return;
    }

    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('userToken');

      if (hasBusinessAccount) {
        // Update existing account
        await axios.put(
          `${API_URL}/business-accounts/${businessAccount.id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Alert.alert('Sucesso', 'Conta empresarial atualizada com sucesso');
      } else {
        // Create new account
        await axios.post(`${API_URL}/business-accounts`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert('Sucesso', 'Conta empresarial criada com sucesso');
        setHasBusinessAccount(true);
      }

      loadBusinessAccount();
    } catch (error) {
      console.error('Error saving business account:', error);
      Alert.alert('Erro', 'Falha ao salvar conta empresarial');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          🏢 Conta Empresarial / Business Account
        </Text>
        <Text style={styles.subtitle}>
          {hasBusinessAccount
            ? 'Atualize os dados da sua empresa'
            : 'Crie uma conta empresarial para receber faturas eletrónicas'}
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nome da Empresa *</Text>
          <TextInput
            style={styles.input}
            value={formData.company_name}
            onChangeText={(text) =>
              setFormData({ ...formData, company_name: text })
            }
            placeholder="Ex: Empresa XYZ Lda"
          />

          <Text style={styles.label}>NIF / Tax ID</Text>
          <TextInput
            style={styles.input}
            value={formData.tax_id}
            onChangeText={(text) => setFormData({ ...formData, tax_id: text })}
            placeholder="Ex: 123456789"
          />

          <Text style={styles.label}>Morada da Empresa</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.company_address}
            onChangeText={(text) =>
              setFormData({ ...formData, company_address: text })
            }
            placeholder="Rua, Bairro, Cidade"
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>Telefone da Empresa</Text>
          <TextInput
            style={styles.input}
            value={formData.company_phone}
            onChangeText={(text) =>
              setFormData({ ...formData, company_phone: text })
            }
            placeholder="+245 955 981 398"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Email da Empresa</Text>
          <TextInput
            style={styles.input}
            value={formData.company_email}
            onChangeText={(text) =>
              setFormData({ ...formData, company_email: text })
            }
            placeholder="empresa@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Tipo de Negócio</Text>
          <TextInput
            style={styles.input}
            value={formData.business_type}
            onChangeText={(text) =>
              setFormData({ ...formData, business_type: text })
            }
            placeholder="Ex: Transporte, Consultoria, etc."
          />

          <Text style={styles.label}>Email para Faturas *</Text>
          <TextInput
            style={styles.input}
            value={formData.invoice_email}
            onChangeText={(text) =>
              setFormData({ ...formData, invoice_email: text })
            }
            placeholder="faturas@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.helpText}>
            As faturas serão enviadas para este email após cada viagem
          </Text>

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving
                ? 'Salvando...'
                : hasBusinessAccount
                ? '✓ Atualizar Conta'
                : '+ Criar Conta Empresarial'}
            </Text>
          </TouchableOpacity>

          {hasBusinessAccount && (
            <TouchableOpacity
              style={styles.invoicesButton}
              onPress={() => navigation.navigate('InvoicesList')}
            >
              <Text style={styles.invoicesButtonText}>
                📄 Ver Minhas Faturas
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#FFF',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  form: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  helpText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  invoicesButton: {
    backgroundColor: '#FF6B00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  invoicesButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
