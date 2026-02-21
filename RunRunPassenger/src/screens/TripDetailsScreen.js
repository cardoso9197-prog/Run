import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { rideAPI } from '../services/api';

export default function TripDetailsScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { rideId } = route.params;

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);

  // Company invoice modal state
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyNIF, setCompanyNIF] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');

  useEffect(() => {
    loadRideDetails();
  }, []);

  const loadRideDetails = async () => {
    try {
      setLoading(true);
      const response = await rideAPI.getRideDetails(rideId);
      setRide(response.data);
    } catch (err) {
      console.error('Error loading trip details:', err);
      setError('Failed to load trip details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
    return new Date(dateStr).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
  };

  const formatPaymentMethod = (method) => {
    if (!method) return 'Dinheiro / Cash';
    const m = method.toLowerCase();
    if (m.includes('orange')) return 'Orange Money';
    if (m.includes('mtn') || m.includes('momo')) return 'MTN MoMo';
    if (m.includes('card')) return 'Cartão / Card';
    return 'Dinheiro / Cash';
  };

  const getPaymentIcon = (method) => {
    if (!method) return '💵';
    const m = method.toLowerCase();
    if (m.includes('orange')) return '🟠';
    if (m.includes('mtn') || m.includes('momo')) return '📱';
    if (m.includes('card')) return '💳';
    return '💵';
  };

  const formatFare = (amount) => {
    return Math.round(amount || 0).toLocaleString();
  };

  const buildInvoiceHTML = (type, companyData = null) => {
    const fare = formatFare(ride.finalFare || ride.estimatedFare);
    const date = formatDate(ride.completedAt || ride.updatedAt);
    const time = formatTime(ride.completedAt || ride.updatedAt);
    const invoiceNum = `RR-${String(ride.id).padStart(6, '0')}`;

    const clientSection = type === 'company' && companyData
      ? `
        <div class="info-row">
          <span class="label">Empresa / Company:</span>
          <span class="value">${companyData.name}</span>
        </div>
        <div class="info-row">
          <span class="label">NIF:</span>
          <span class="value">${companyData.nif}</span>
        </div>
        ${companyData.address ? `<div class="info-row"><span class="label">Endereço / Address:</span><span class="value">${companyData.address}</span></div>` : ''}
      `
      : `
        <div class="info-row">
          <span class="label">Passageiro / Passenger:</span>
          <span class="value">${ride.passenger?.name || 'N/A'}</span>
        </div>
      `;

    return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fatura RUN-RUN #${invoiceNum}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background: #fff;
      color: #1a1a1a;
      padding: 40px;
      max-width: 700px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #FF6B00;
    }
    .brand { display: flex; flex-direction: column; }
    .brand-name {
      font-size: 36px;
      font-weight: 900;
      color: #FF6B00;
      letter-spacing: 2px;
    }
    .brand-tagline { font-size: 12px; color: #888; margin-top: 2px; }
    .invoice-meta { text-align: right; }
    .invoice-title {
      font-size: 24px;
      font-weight: 700;
      color: #333;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .invoice-number { font-size: 14px; color: #FF6B00; font-weight: 600; margin-top: 4px; }
    .invoice-date { font-size: 13px; color: #666; margin-top: 4px; }

    .section {
      background: #f9f9f9;
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 16px;
    }
    .section-title {
      font-size: 13px;
      font-weight: 700;
      color: #FF6B00;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      border-bottom: 1px solid #eee;
    }
    .info-row:last-child { border-bottom: none; }
    .label { font-size: 13px; color: #888; }
    .value { font-size: 13px; color: #1a1a1a; font-weight: 500; max-width: 60%; text-align: right; }

    .route-section { background: #f9f9f9; border-radius: 8px; padding: 16px 20px; margin-bottom: 16px; }
    .route-point { display: flex; align-items: flex-start; margin-bottom: 10px; }
    .route-dot {
      width: 12px; height: 12px; border-radius: 6px;
      margin-right: 12px; margin-top: 2px; flex-shrink: 0;
    }
    .dot-green { background: #4CAF50; }
    .dot-red { background: #F44336; }
    .route-label { font-size: 11px; color: #888; }
    .route-address { font-size: 13px; font-weight: 500; color: #1a1a1a; }
    .route-line { width: 2px; height: 20px; background: #ddd; margin-left: 5px; margin-bottom: 6px; }

    .fare-section {
      background: linear-gradient(135deg, #FF6B00, #FF9500);
      border-radius: 10px;
      padding: 24px;
      text-align: center;
      margin-bottom: 16px;
    }
    .fare-label { color: rgba(255,255,255,0.85); font-size: 14px; margin-bottom: 6px; }
    .fare-amount { color: #fff; font-size: 42px; font-weight: 900; }
    .fare-currency { color: rgba(255,255,255,0.9); font-size: 16px; margin-top: 4px; }

    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    .footer-text { font-size: 12px; color: #aaa; margin-bottom: 4px; }
    .footer-brand { font-size: 13px; color: #FF6B00; font-weight: 700; }
    .status-badge {
      display: inline-block;
      background: #4CAF50;
      color: white;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <span class="brand-name">RUN-RUN</span>
      <span class="brand-tagline">Serviço de Transporte / Transport Service</span>
      <span class="brand-tagline">Guiné-Bissau</span>
    </div>
    <div class="invoice-meta">
      <div class="invoice-title">Fatura / Invoice</div>
      <div class="invoice-number">${invoiceNum}</div>
      <div class="invoice-date">${date}${time ? ' · ' + time : ''}</div>
      <div style="margin-top: 6px;"><span class="status-badge">✓ Concluído / Completed</span></div>
    </div>
  </div>

  <!-- Client Info -->
  <div class="section">
    <div class="section-title">Cliente / Client</div>
    ${clientSection}
  </div>

  <!-- Route -->
  <div class="route-section">
    <div class="section-title">Percurso / Route</div>
    <div class="route-point">
      <div class="route-dot dot-green"></div>
      <div>
        <div class="route-label">Origem / From</div>
        <div class="route-address">${ride.pickupAddress || '—'}</div>
      </div>
    </div>
    <div class="route-line"></div>
    <div class="route-point">
      <div class="route-dot dot-red"></div>
      <div>
        <div class="route-label">Destino / To</div>
        <div class="route-address">${ride.dropoffAddress || '—'}</div>
      </div>
    </div>
  </div>

  <!-- Trip Details -->
  <div class="section">
    <div class="section-title">Detalhes da Viagem / Trip Details</div>
    ${ride.driver?.name ? `<div class="info-row"><span class="label">Motorista / Driver:</span><span class="value">${ride.driver.name}</span></div>` : ''}
    ${ride.vehicleType || ride.vehicle?.vehicleType ? `<div class="info-row"><span class="label">Veículo / Vehicle:</span><span class="value">${ride.vehicleType || ride.vehicle?.vehicleType}</span></div>` : ''}
    ${ride.estimatedDistance ? `<div class="info-row"><span class="label">Distância / Distance:</span><span class="value">${ride.estimatedDistance} km</span></div>` : ''}
    <div class="info-row"><span class="label">Pagamento / Payment:</span><span class="value">${formatPaymentMethod(ride.paymentMethod)}</span></div>
    <div class="info-row"><span class="label">Referência / Reference:</span><span class="value">${invoiceNum}</span></div>
  </div>

  <!-- Fare -->
  <div class="fare-section">
    <div class="fare-label">Total a Pagar / Total Amount</div>
    <div class="fare-amount">${fare}</div>
    <div class="fare-currency">XOF (Franc CFA)</div>
  </div>

  <div class="footer">
    <div class="footer-text">Obrigado por utilizar o Run-Run! / Thank you for using Run-Run!</div>
    <div class="footer-brand">RUN-RUN · Bissau, Guiné-Bissau</div>
    <div class="footer-text" style="margin-top: 8px;">Kcdigital Sarl · Esta é uma fatura eletrónica válida / This is a valid electronic invoice</div>
  </div>
</body>
</html>`;
  };

  const downloadPersonalInvoice = async () => {
    try {
      setGenerating(true);
      const html = buildInvoiceHTML('personal');
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Download Invoice / Fatura',
        UTI: 'com.adobe.pdf',
      });
    } catch (err) {
      console.error('Invoice error:', err);
      Alert.alert('Error', 'Failed to generate invoice. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const downloadCompanyInvoice = async () => {
    if (!companyName.trim() || !companyNIF.trim()) {
      Alert.alert('Missing Info', 'Please enter company name and NIF number.');
      return;
    }
    try {
      setShowCompanyModal(false);
      setGenerating(true);
      const html = buildInvoiceHTML('company', {
        name: companyName.trim(),
        nif: companyNIF.trim(),
        address: companyAddress.trim(),
      });
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Download Company Invoice / Fatura Empresa',
        UTI: 'com.adobe.pdf',
      });
    } catch (err) {
      console.error('Company invoice error:', err);
      Alert.alert('Error', 'Failed to generate company invoice. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>Loading trip details...</Text>
      </View>
    );
  }

  if (error || !ride) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>⚠️ {error || 'Trip not found'}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={loadRideDetails}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.retryBtn, { backgroundColor: '#666', marginTop: 10 }]} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.retryBtnText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const fare = formatFare(ride.finalFare || ride.estimatedFare);
  const date = formatDate(ride.completedAt || ride.updatedAt);
  const time = formatTime(ride.completedAt || ride.updatedAt);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>✅ Trip Completed</Text>
        <Text style={styles.headerSubtitle}>{date}{time ? ` · ${time}` : ''}</Text>
      </View>

      {/* Fare Card */}
      <View style={styles.fareCard}>
        <Text style={styles.fareLabel}>Total Fare</Text>
        <Text style={styles.fareAmount}>{fare} XOF</Text>
        {ride.driver?.name && (
          <Text style={styles.fareDriver}>Driver: {ride.driver.name}</Text>
        )}
      </View>

      {/* Route Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📍 Route</Text>
        <View style={styles.routeRow}>
          <View style={[styles.routeDot, { backgroundColor: '#4CAF50' }]} />
          <View style={styles.routeTextWrap}>
            <Text style={styles.routeLabel}>FROM</Text>
            <Text style={styles.routeAddress}>{ride.pickupAddress || '—'}</Text>
          </View>
        </View>
        <View style={styles.routeConnector} />
        <View style={styles.routeRow}>
          <View style={[styles.routeDot, { backgroundColor: '#F44336' }]} />
          <View style={styles.routeTextWrap}>
            <Text style={styles.routeLabel}>TO</Text>
            <Text style={styles.routeAddress}>{ride.dropoffAddress || '—'}</Text>
          </View>
        </View>
      </View>

      {/* Trip Info Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🚗 Trip Info</Text>
        {ride.driver?.name && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Driver</Text>
            <Text style={styles.infoValue}>{ride.driver.name}</Text>
          </View>
        )}
        {(ride.vehicleType || ride.vehicle?.vehicleType) && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vehicle Type</Text>
            <Text style={styles.infoValue}>{ride.vehicleType || ride.vehicle?.vehicleType}</Text>
          </View>
        )}
        {ride.estimatedDistance && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Distance</Text>
            <Text style={styles.infoValue}>{ride.estimatedDistance} km</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Payment</Text>
          <Text style={styles.infoValue}>{getPaymentIcon(ride.paymentMethod)} {formatPaymentMethod(ride.paymentMethod)}</Text>
        </View>
        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.infoLabel}>Reference</Text>
          <Text style={styles.infoValue}>RR-{String(ride.id).padStart(6, '0')}</Text>
        </View>
      </View>

      {/* Invoice Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📄 Invoice / Fatura</Text>
        <Text style={styles.invoiceDesc}>
          Download a PDF invoice for your records. Choose personal or company format.
        </Text>

        {/* Personal Invoice */}
        <TouchableOpacity
          style={[styles.invoiceBtn, generating && styles.invoiceBtnDisabled]}
          onPress={downloadPersonalInvoice}
          disabled={generating}
        >
          {generating ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Text style={styles.invoiceBtnIcon}>👤</Text>
              <View style={styles.invoiceBtnText}>
                <Text style={styles.invoiceBtnTitle}>Personal Invoice</Text>
                <Text style={styles.invoiceBtnSub}>Fatura Pessoal · PDF</Text>
              </View>
              <Text style={styles.invoiceBtnArrow}>⬇</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Company Invoice */}
        <TouchableOpacity
          style={[styles.invoiceBtn, styles.invoiceBtnCompany, generating && styles.invoiceBtnDisabled]}
          onPress={() => setShowCompanyModal(true)}
          disabled={generating}
        >
          <Text style={styles.invoiceBtnIcon}>🏢</Text>
          <View style={styles.invoiceBtnText}>
            <Text style={styles.invoiceBtnTitle}>Company Invoice</Text>
            <Text style={styles.invoiceBtnSub}>Fatura Empresa · PDF</Text>
          </View>
          <Text style={styles.invoiceBtnArrow}>⬇</Text>
        </TouchableOpacity>
      </View>

      {/* Go Home Button */}
      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.homeBtnText}>🏠 Back to Home</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />

      {/* Company Invoice Modal */}
      <Modal
        visible={showCompanyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCompanyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>🏢 Company Invoice Details</Text>
            <Text style={styles.modalSubtitle}>Enter your company information for the invoice.</Text>

            <Text style={styles.modalLabel}>Company Name *</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ex: Kcdigital Sarl"
              value={companyName}
              onChangeText={setCompanyName}
              autoCapitalize="words"
            />

            <Text style={styles.modalLabel}>NIF (Tax Number) *</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ex: 123456789"
              value={companyNIF}
              onChangeText={setCompanyNIF}
              keyboardType="default"
            />

            <Text style={styles.modalLabel}>Company Address (optional)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ex: Rua Bissau, Guiné-Bissau"
              value={companyAddress}
              onChangeText={setCompanyAddress}
              autoCapitalize="words"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowCompanyModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={downloadCompanyInvoice}
              >
                <Text style={styles.modalConfirmText}>⬇ Download PDF</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { paddingBottom: 20 },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5', padding: 20 },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666', textAlign: 'center' },
  errorText: { fontSize: 16, color: '#d32f2f', textAlign: 'center', marginBottom: 20 },
  retryBtn: { backgroundColor: '#FF6B00', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  retryBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  // Header
  header: {
    backgroundColor: '#FF6B00',
    padding: 24,
    alignItems: 'center',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 6 },

  // Fare card
  fareCard: {
    backgroundColor: '#1a1a1a',
    margin: 15,
    marginBottom: 0,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  fareLabel: { fontSize: 14, color: 'rgba(255,255,255,0.65)', marginBottom: 6 },
  fareAmount: { fontSize: 44, fontWeight: '900', color: '#FF6B00' },
  fareDriver: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 8 },

  // Generic card
  card: {
    backgroundColor: '#fff',
    margin: 15,
    marginBottom: 0,
    padding: 20,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 14 },

  // Route
  routeRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 0 },
  routeDot: { width: 12, height: 12, borderRadius: 6, marginTop: 3, marginRight: 12, flexShrink: 0 },
  routeTextWrap: { flex: 1 },
  routeLabel: { fontSize: 11, color: '#aaa', fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  routeAddress: { fontSize: 14, color: '#1a1a1a', fontWeight: '500', marginTop: 2, lineHeight: 20 },
  routeConnector: { width: 2, height: 16, backgroundColor: '#e0e0e0', marginLeft: 5, marginVertical: 4 },

  // Info rows
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: { fontSize: 14, color: '#888' },
  infoValue: { fontSize: 14, color: '#1a1a1a', fontWeight: '600', textAlign: 'right', maxWidth: '60%' },

  // Invoice section
  invoiceDesc: { fontSize: 13, color: '#888', marginBottom: 14, lineHeight: 18 },
  invoiceBtn: {
    backgroundColor: '#FF6B00',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  invoiceBtnCompany: { backgroundColor: '#2196F3' },
  invoiceBtnDisabled: { opacity: 0.6 },
  invoiceBtnIcon: { fontSize: 22, marginRight: 12 },
  invoiceBtnText: { flex: 1 },
  invoiceBtnTitle: { fontSize: 15, fontWeight: '700', color: '#fff' },
  invoiceBtnSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  invoiceBtnArrow: { fontSize: 18, color: '#fff', fontWeight: 'bold' },

  // Home button
  homeBtn: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B00',
  },
  homeBtnText: { color: '#FF6B00', fontSize: 16, fontWeight: '700' },

  // Company invoice modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 6 },
  modalSubtitle: { fontSize: 13, color: '#888', marginBottom: 20, lineHeight: 18 },
  modalLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6, marginTop: 10 },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#1a1a1a',
    backgroundColor: '#fafafa',
  },
  modalButtons: { flexDirection: 'row', marginTop: 24, gap: 12 },
  modalCancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  modalCancelText: { fontSize: 15, fontWeight: '600', color: '#666' },
  modalConfirmBtn: {
    flex: 2,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#2196F3',
    alignItems: 'center',
  },
  modalConfirmText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});

