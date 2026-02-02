import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { driverAPI } from '../services/api';

export default function WithdrawScreen({ navigation }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(true);
  
  // Balance info
  const [availableBalance, setAvailableBalance] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingWithdrawals, setPendingWithdrawals] = useState(0);
  
  // Withdrawal form
  const [amount, setAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState('orange_money');
  const [mobileNumber, setMobileNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [frequency, setFrequency] = useState('daily'); // daily or weekly
  
  // Settings
  const [settings, setSettings] = useState(null);
  
  useEffect(() => {
    loadBalanceAndSettings();
  }, []);

  const loadBalanceAndSettings = async () => {
    try {
      setLoadingBalance(true);
      
      // Load balance
      const balanceResponse = await driverAPI.getWithdrawalBalance();
      console.log('Balance response:', JSON.stringify(balanceResponse.data, null, 2));
      
      if (balanceResponse.data && balanceResponse.data.balance) {
        setAvailableBalance(balanceResponse.data.balance.availableBalance || 0);
        setTotalEarnings(balanceResponse.data.balance.totalEarnings || 0);
        setPendingWithdrawals(balanceResponse.data.balance.pendingWithdrawals || 0);
      } else {
        console.error('Invalid balance response structure:', balanceResponse.data);
        Alert.alert('Error', 'Invalid response from server');
        return;
      }
      
      // Load settings
      const settingsResponse = await driverAPI.getWithdrawalSettings();
      console.log('Settings response:', JSON.stringify(settingsResponse.data, null, 2));
      
      if (settingsResponse.data && settingsResponse.data.settings) {
        setSettings(settingsResponse.data.settings);
        
        // Pre-fill form with saved settings
        if (settingsResponse.data.settings.preferredMethod) {
          setWithdrawalMethod(settingsResponse.data.settings.preferredMethod);
          setMobileNumber(settingsResponse.data.settings.preferredMobileNumber || '');
          setAccountName(settingsResponse.data.settings.accountName || '');
          setFrequency(settingsResponse.data.settings.autoWithdrawFrequency || 'daily');
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      console.error('Error details:', error.response?.data || error.message);
      Alert.alert('Error', `Failed to load balance: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoadingBalance(false);
    }
  };

  const handleWithdraw = async () => {
    // Validation
    const withdrawAmount = parseFloat(amount);
    
    if (!amount || withdrawAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    if (withdrawAmount > availableBalance) {
      Alert.alert('Error', `Insufficient balance. Available: ${availableBalance.toFixed(0)} XOF`);
      return;
    }
    
    if (withdrawAmount < 5000) {
      Alert.alert('Error', 'Minimum withdrawal amount is 5,000 XOF');
      return;
    }
    
    if (!mobileNumber) {
      Alert.alert('Error', 'Please enter mobile number');
      return;
    }
    
    // Format phone number
    const formattedPhone = mobileNumber.startsWith('+245') 
      ? mobileNumber 
      : `+245${mobileNumber.replace(/\D/g, '')}`;
    
    if (!formattedPhone.match(/^\+245\d{7,9}$/)) {
      Alert.alert('Error', 'Invalid phone number format. Use +245XXXXXXXXX');
      return;
    }

    Alert.alert(
      'Confirm Withdrawal',
      `Withdraw ${withdrawAmount.toFixed(0)} XOF to\n${withdrawalMethod === 'orange_money' ? 'Orange Money' : 'MTN Mobile Money'}\n${formattedPhone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setLoading(true);
            try {
              await driverAPI.requestWithdrawal({
                amount: withdrawAmount,
                withdrawalMethod,
                mobileNumber: formattedPhone,
                accountName: accountName || mobileNumber,
                frequency,
              });
              
              Alert.alert(
                'Success',
                'Withdrawal request submitted! Funds will be sent within 24 hours.',
                [{ text: 'OK', onPress: () => {
                  setAmount('');
                  loadBalanceAndSettings();
                  navigation.navigate('WithdrawalHistory');
                }}]
              );
            } catch (error) {
              console.error('Withdrawal error:', error);
              Alert.alert(
                'Error',
                error.response?.data?.error || 'Failed to request withdrawal'
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleWithdrawAll = () => {
    if (availableBalance >= 5000) {
      setAmount(availableBalance.toString());
    } else {
      Alert.alert('Error', 'Insufficient balance for withdrawal');
    }
  };

  if (loadingBalance) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>Loading balance...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>💰 Available Balance</Text>
        <Text style={styles.balanceAmount}>{availableBalance.toFixed(0)} XOF</Text>
        
        <View style={styles.balanceRow}>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Total Earnings</Text>
            <Text style={styles.balanceValue}>{totalEarnings.toFixed(0)} XOF</Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Pending</Text>
            <Text style={styles.balanceValue}>{pendingWithdrawals.toFixed(0)} XOF</Text>
          </View>
        </View>
      </View>

      {/* Withdrawal Form */}
      <View style={styles.card}>
        <Text style={styles.title}>Request Withdrawal</Text>

        {/* Withdrawal Method */}
        <Text style={styles.label}>Select Method</Text>
        <View style={styles.methodButtons}>
          <TouchableOpacity
            style={[styles.methodButton, withdrawalMethod === 'orange_money' && styles.methodButtonActive]}
            onPress={() => setWithdrawalMethod('orange_money')}
          >
            <Text style={styles.methodText}>🟠 Orange Money</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.methodButton, withdrawalMethod === 'mtn_momo' && styles.methodButtonActive]}
            onPress={() => setWithdrawalMethod('mtn_momo')}
          >
            <Text style={styles.methodText}>🟡 MTN MoMo</Text>
          </TouchableOpacity>
        </View>

        {/* Amount */}
        <Text style={styles.label}>Amount (XOF)</Text>
        <View style={styles.amountRow}>
          <TextInput
            style={[styles.input, styles.amountInput]}
            placeholder="5000 minimum"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TouchableOpacity style={styles.maxButton} onPress={handleWithdrawAll}>
            <Text style={styles.maxButtonText}>Max</Text>
          </TouchableOpacity>
        </View>

        {/* Mobile Number */}
        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          placeholder="+245955971275"
          keyboardType="phone-pad"
          value={mobileNumber}
          onChangeText={setMobileNumber}
        />

        {/* Account Name (Optional) */}
        <Text style={styles.label}>Account Name (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name"
          value={accountName}
          onChangeText={setAccountName}
        />

        {/* Frequency */}
        <Text style={styles.label}>Withdrawal Type</Text>
        <View style={styles.frequencyButtons}>
          <TouchableOpacity
            style={[styles.frequencyButton, frequency === 'daily' && styles.frequencyButtonActive]}
            onPress={() => setFrequency('daily')}
          >
            <Text style={styles.frequencyText}>Daily</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.frequencyButton, frequency === 'weekly' && styles.frequencyButtonActive]}
            onPress={() => setFrequency('weekly')}
          >
            <Text style={styles.frequencyText}>Weekly</Text>
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>ℹ️ Minimum withdrawal: 5,000 XOF</Text>
          <Text style={styles.infoText}>⏱️ Processing time: Within 24 hours</Text>
          <Text style={styles.infoText}>💵 No additional fees</Text>
        </View>

        {/* Withdraw Button */}
        <TouchableOpacity
          style={[styles.withdrawButton, loading && styles.withdrawButtonDisabled]}
          onPress={handleWithdraw}
          disabled={loading}
        >
          <Text style={styles.withdrawButtonText}>
            {loading ? 'Processing...' : 'Request Withdrawal'}
          </Text>
        </TouchableOpacity>

        {/* History Button */}
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('WithdrawalHistory')}
        >
          <Text style={styles.historyButtonText}>View Withdrawal History</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  
  balanceCard: {
    backgroundColor: '#000',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceTitle: { fontSize: 16, color: '#FFE8D6', marginBottom: 10 },
  balanceAmount: { fontSize: 36, fontWeight: 'bold', color: '#FF6B00', marginBottom: 15 },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  balanceItem: { flex: 1 },
  balanceLabel: { fontSize: 12, color: '#FFE8D6', marginBottom: 5 },
  balanceValue: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  
  card: { backgroundColor: '#FFF', margin: 15, marginTop: 0, padding: 20, borderRadius: 15 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, marginTop: 15, color: '#333' },
  
  methodButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  methodButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodButtonActive: { backgroundColor: '#FFE8D6', borderColor: '#FF6B00' },
  methodText: { fontSize: 16, fontWeight: 'bold' },
  
  amountRow: { flexDirection: 'row', alignItems: 'center' },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  amountInput: { flex: 1, marginRight: 10 },
  maxButton: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
  },
  maxButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  
  frequencyButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  frequencyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  frequencyButtonActive: { backgroundColor: '#FFE8D6', borderColor: '#FF6B00' },
  frequencyText: { fontSize: 14, fontWeight: 'bold' },
  
  infoBox: {
    backgroundColor: '#E8F4FD',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  infoText: { fontSize: 13, color: '#333', marginBottom: 5 },
  
  withdrawButton: {
    backgroundColor: '#FF6B00',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  withdrawButtonDisabled: { backgroundColor: '#CCC' },
  withdrawButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  
  historyButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  historyButtonText: { color: '#FF6B00', fontSize: 16, fontWeight: 'bold' },
});
