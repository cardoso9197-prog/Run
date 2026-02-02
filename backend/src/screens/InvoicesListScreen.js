import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  FlatList,
  Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const API_URL = 'https://zippy-healing-production-24e4.up.railway.app/api';

export default function InvoicesListScreen({ navigation }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_URL}/invoices/my-invoices`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInvoices(response.data.invoices || []);
    } catch (error) {
      console.error('Error loading invoices:', error);
      Alert.alert('Erro', 'Falha ao carregar faturas');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (invoice) => {
    try {
      setDownloadingId(invoice.id);
      const token = await AsyncStorage.getItem('userToken');

      const fileUri = FileSystem.documentDirectory + `Invoice-${invoice.invoice_number}.pdf`;

      const downloadResult = await FileSystem.downloadAsync(
        `${API_URL}/invoices/${invoice.id}/download`,
        fileUri,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (downloadResult.status === 200) {
        // Share the file
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(downloadResult.uri);
        } else {
          Alert.alert('Sucesso', 'Fatura baixada com sucesso');
        }
      } else {
        Alert.alert('Erro', 'Falha ao baixar fatura');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      Alert.alert('Erro', 'Falha ao baixar fatura');
    } finally {
      setDownloadingId(null);
    }
  };

  const renderInvoiceItem = ({ item }) => (
    <View style={styles.invoiceCard}>
      <View style={styles.invoiceHeader}>
        <Text style={styles.invoiceNumber}>📄 {item.invoice_number}</Text>
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>

      <View style={styles.invoiceDetails}>
        <Text style={styles.detailLabel}>Data:</Text>
        <Text style={styles.detailValue}>
          {new Date(item.issue_date).toLocaleDateString('pt-PT')}
        </Text>
      </View>

      <View style={styles.invoiceDetails}>
        <Text style={styles.detailLabel}>Empresa:</Text>
        <Text style={styles.detailValue}>{item.company_name}</Text>
      </View>

      <View style={styles.invoiceDetails}>
        <Text style={styles.detailLabel}>Origem:</Text>
        <Text style={styles.detailValue} numberOfLines={1}>
          {item.pickup_address}
        </Text>
      </View>

      <View style={styles.invoiceDetails}>
        <Text style={styles.detailLabel}>Destino:</Text>
        <Text style={styles.detailValue} numberOfLines={1}>
          {item.dropoff_address}
        </Text>
      </View>

      <View style={styles.totalSection}>
        <Text style={styles.totalLabel}>TOTAL:</Text>
        <Text style={styles.totalAmount}>{item.total_amount} XOF</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.downloadButton, downloadingId === item.id && styles.downloadButtonDisabled]}
          onPress={() => handleDownloadInvoice(item)}
          disabled={downloadingId === item.id}
        >
          <Text style={styles.downloadButtonText}>
            {downloadingId === item.id ? '⏳ Baixando...' : '⬇️ Baixar PDF'}
          </Text>
        </TouchableOpacity>

        {item.sent_to_email && (
          <View style={styles.emailSentBadge}>
            <Text style={styles.emailSentText}>✓ Enviado por email</Text>
          </View>
        )}
      </View>
    </View>
  );

  const getStatusLabel = (status) => {
    const statusMap = {
      issued: 'Emitida',
      sent: 'Enviada',
      paid: 'Paga',
      cancelled: 'Cancelada',
    };
    return statusMap[status] || status;
  };

  const getStatusStyle = (status) => {
    const styleMap = {
      issued: { backgroundColor: '#FFA500' },
      sent: { backgroundColor: '#2196F3' },
      paid: { backgroundColor: '#4CAF50' },
      cancelled: { backgroundColor: '#F44336' },
    };
    return styleMap[status] || { backgroundColor: '#999' };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>Carregando faturas...</Text>
      </View>
    );
  }

  if (invoices.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📄</Text>
        <Text style={styles.emptyText}>Nenhuma fatura encontrada</Text>
        <Text style={styles.emptySubtext}>
          As faturas aparecerão aqui após as viagens concluídas
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Faturas</Text>
        <Text style={styles.headerSubtitle}>{invoices.length} fatura(s)</Text>
      </View>

      <FlatList
        data={invoices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderInvoiceItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#FFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  listContent: {
    padding: 15,
  },
  invoiceCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  invoiceDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  actions: {
    marginTop: 15,
  },
  downloadButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  downloadButtonDisabled: {
    opacity: 0.6,
  },
  downloadButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emailSentBadge: {
    marginTop: 10,
    alignItems: 'center',
  },
  emailSentText: {
    fontSize: 12,
    color: '#4CAF50',
  },
});
