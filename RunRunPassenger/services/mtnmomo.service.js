/**
 * MTN Mobile Money Service - Mobile Money Processing
 * Run-Run Guinea-Bissau
 * 
 * Developer: Edivaldo Cardoso
 * Email: suporte@runrungb.com
 * Phone: +245 955 971 275
 * Date: January 6, 2026
 * 
 * Note: This implementation is based on MTN MoMo API
 * Documentation: https://momodeveloper.mtn.com/
 */

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

class MTNMoMoService {
  constructor() {
    this.apiURL = process.env.MTN_MOMO_API_URL || 'https://sandbox.momodeveloper.mtn.com';
    this.subscriptionKey = process.env.MTN_MOMO_SUBSCRIPTION_KEY;
    this.apiUser = process.env.MTN_MOMO_API_USER;
    this.apiKey = process.env.MTN_MOMO_API_KEY;
    this.callbackURL = process.env.MTN_MOMO_CALLBACK_URL;
    this.currency = 'XOF'; // West African CFA Franc
    
    if (!this.subscriptionKey || !this.apiUser || !this.apiKey) {
      console.warn('⚠️ MTN MoMo credentials not configured. Payment processing will fail.');
    }
  }

  /**
   * Get OAuth access token
   */
  async getAccessToken() {
    try {
      const auth = Buffer.from(`${this.apiUser}:${this.apiKey}`).toString('base64');
      
      const response = await axios.post(
        `${this.apiURL}/collection/token/`,
        {},
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Ocp-Apim-Subscription-Key': this.subscriptionKey,
          },
        }
      );

      console.log('✅ MTN MoMo access token obtained');

      return response.data.access_token;
    } catch (error) {
      console.error('❌ MTN MoMo token error:', error.response?.data || error.message);
      throw new Error('Failed to obtain MTN MoMo access token');
    }
  }

  /**
   * Request to pay (charge customer)
   * Initiate a payment from customer's MTN MoMo account
   */
  async requestToPay(phoneNumber, amount, note = 'Pagamento Run-Run', externalId = null) {
    try {
      const accessToken = await this.getAccessToken();
      const referenceId = uuidv4();
      
      // Format phone number (must be without + sign and country code)
      const formattedPhone = phoneNumber
        .replace(/\+245/, '')
        .replace(/\D/g, '');

      const paymentData = {
        amount: Math.round(amount).toString(),
        currency: this.currency,
        externalId: externalId || `RUNRUN-${Date.now()}`,
        payer: {
          partyIdType: 'MSISDN',
          partyId: formattedPhone,
        },
        payerMessage: note,
        payeeNote: 'Pagamento recebido via Run-Run',
      };

      const response = await axios.post(
        `${this.apiURL}/collection/v1_0/requesttopay`,
        paymentData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Reference-Id': referenceId,
            'X-Target-Environment': process.env.MTN_MOMO_ENVIRONMENT || 'sandbox',
            'Ocp-Apim-Subscription-Key': this.subscriptionKey,
            'Content-Type': 'application/json',
            'X-Callback-Url': this.callbackURL,
          },
        }
      );

      console.log('✅ MTN MoMo payment requested:', referenceId);

      return {
        success: true,
        reference_id: referenceId,
        external_id: paymentData.externalId,
        status: 'PENDING',
      };
    } catch (error) {
      console.error('❌ MTN MoMo request to pay error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to request payment');
    }
  }

  /**
   * Check payment status
   * Query the status of a payment
   */
  async checkPaymentStatus(referenceId) {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.get(
        `${this.apiURL}/collection/v1_0/requesttopay/${referenceId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Target-Environment': process.env.MTN_MOMO_ENVIRONMENT || 'sandbox',
            'Ocp-Apim-Subscription-Key': this.subscriptionKey,
          },
        }
      );

      console.log(`✅ MTN MoMo status checked: ${referenceId} - ${response.data.status}`);

      return {
        success: response.data.status === 'SUCCESSFUL',
        status: response.data.status, // SUCCESSFUL, PENDING, FAILED
        reference_id: referenceId,
        amount: parseFloat(response.data.amount),
        currency: response.data.currency,
        external_id: response.data.externalId,
        financial_transaction_id: response.data.financialTransactionId,
        payer: response.data.payer,
      };
    } catch (error) {
      console.error('❌ MTN MoMo status check error:', error.response?.data || error.message);
      throw new Error('Failed to check payment status');
    }
  }

  /**
   * Get account balance
   * Check merchant account balance
   */
  async getBalance() {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.get(
        `${this.apiURL}/collection/v1_0/account/balance`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Target-Environment': process.env.MTN_MOMO_ENVIRONMENT || 'sandbox',
            'Ocp-Apim-Subscription-Key': this.subscriptionKey,
          },
        }
      );

      return {
        success: true,
        available_balance: parseFloat(response.data.availableBalance),
        currency: response.data.currency,
      };
    } catch (error) {
      console.error('❌ MTN MoMo balance check error:', error.response?.data || error.message);
      throw new Error('Failed to check balance');
    }
  }

  /**
   * Transfer to driver (Disbursement)
   * Send money to driver's MTN MoMo account
   */
  async transferToDriver(phoneNumber, amount, note = 'Pagamento motorista Run-Run', externalId = null) {
    try {
      const accessToken = await this.getAccessToken();
      const referenceId = uuidv4();
      
      // Format phone number
      const formattedPhone = phoneNumber
        .replace(/\+245/, '')
        .replace(/\D/g, '');

      const transferData = {
        amount: Math.round(amount).toString(),
        currency: this.currency,
        externalId: externalId || `PAYOUT-${Date.now()}`,
        payee: {
          partyIdType: 'MSISDN',
          partyId: formattedPhone,
        },
        payerMessage: 'Pagamento enviado via Run-Run',
        payeeNote: note,
      };

      const response = await axios.post(
        `${this.apiURL}/disbursement/v1_0/transfer`,
        transferData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Reference-Id': referenceId,
            'X-Target-Environment': process.env.MTN_MOMO_ENVIRONMENT || 'sandbox',
            'Ocp-Apim-Subscription-Key': this.subscriptionKey,
            'Content-Type': 'application/json',
            'X-Callback-Url': this.callbackURL,
          },
        }
      );

      console.log('✅ MTN MoMo transfer initiated:', referenceId);

      return {
        success: true,
        reference_id: referenceId,
        external_id: transferData.externalId,
        status: 'PENDING',
      };
    } catch (error) {
      console.error('❌ MTN MoMo transfer error:', error.response?.data || error.message);
      throw new Error('Failed to initiate transfer');
    }
  }

  /**
   * Check transfer status
   * Query the status of a disbursement/transfer
   */
  async checkTransferStatus(referenceId) {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.get(
        `${this.apiURL}/disbursement/v1_0/transfer/${referenceId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Target-Environment': process.env.MTN_MOMO_ENVIRONMENT || 'sandbox',
            'Ocp-Apim-Subscription-Key': this.subscriptionKey,
          },
        }
      );

      return {
        success: response.data.status === 'SUCCESSFUL',
        status: response.data.status,
        reference_id: referenceId,
        amount: parseFloat(response.data.amount),
        external_id: response.data.externalId,
      };
    } catch (error) {
      console.error('❌ MTN MoMo transfer status error:', error.response?.data || error.message);
      throw new Error('Failed to check transfer status');
    }
  }

  /**
   * Validate account holder
   * Check if phone number is valid MTN MoMo account
   */
  async validateAccount(phoneNumber) {
    try {
      const accessToken = await this.getAccessToken();
      
      const formattedPhone = phoneNumber
        .replace(/\+245/, '')
        .replace(/\D/g, '');

      const response = await axios.get(
        `${this.apiURL}/collection/v1_0/accountholder/msisdn/${formattedPhone}/active`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Target-Environment': process.env.MTN_MOMO_ENVIRONMENT || 'sandbox',
            'Ocp-Apim-Subscription-Key': this.subscriptionKey,
          },
        }
      );

      return {
        valid: response.data.result === true,
        phone_number: formattedPhone,
      };
    } catch (error) {
      console.error('❌ MTN MoMo account validation error:', error.response?.data || error.message);
      return { valid: false, phone_number: formattedPhone };
    }
  }

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phoneNumber) {
    // Guinea-Bissau format: +245 XXX XXX XXX
    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.length >= 7 && cleaned.length <= 9;
  }
}

module.exports = new MTNMoMoService();
