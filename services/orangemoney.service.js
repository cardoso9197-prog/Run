/**
 * Orange Money Service - Mobile Money Processing
 * Run-Run Guinea-Bissau
 * 
 * Developer: Edivaldo Cardoso
 * Email: suporte@runrungb.com
 * Phone: +245 955 971 275
 * Date: January 6, 2026
 * 
 * Note: This implementation is based on Orange Money Web Payment API
 * Documentation: https://developer.orange.com/apis/orange-money-webpay/
 */

const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

class OrangeMoneyService {
  constructor() {
    this.apiURL = process.env.ORANGE_MONEY_API_URL;
    this.merchantId = process.env.ORANGE_MONEY_MERCHANT_ID;
    this.merchantKey = process.env.ORANGE_MONEY_MERCHANT_KEY;
    this.apiSecret = process.env.ORANGE_MONEY_API_SECRET;
    this.callbackURL = process.env.ORANGE_MONEY_CALLBACK_URL;
    
    if (!this.merchantId || !this.apiSecret) {
      console.warn('⚠️ Orange Money credentials not configured. Payment processing will fail.');
    }
  }

  /**
   * Generate signature for request authentication
   */
  generateSignature(data) {
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    return crypto
      .createHmac('sha256', this.apiSecret)
      .update(dataString)
      .digest('hex');
  }

  /**
   * Get OAuth access token
   */
  async getAccessToken() {
    try {
      const auth = Buffer.from(`${this.merchantId}:${this.apiSecret}`).toString('base64');
      
      const response = await axios.post(
        `${this.apiURL}/oauth/v2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      console.log('✅ Orange Money access token obtained');

      return response.data.access_token;
    } catch (error) {
      console.error('❌ Orange Money token error:', error.response?.data || error.message);
      throw new Error('Failed to obtain access token');
    }
  }

  /**
   * Initiate a payment
   * Creates a payment session for mobile money
   */
  async initiatePayment(phoneNumber, amount, orderId, description = 'Pagamento Run-Run') {
    try {
      const accessToken = await this.getAccessToken();
      
      // Format phone number (must be in format: +245XXXXXXXXX)
      const formattedPhone = phoneNumber.startsWith('+245') 
        ? phoneNumber 
        : `+245${phoneNumber.replace(/\D/g, '')}`;

      const paymentData = {
        merchant_key: this.merchantId,
        currency: 'XOF',
        order_id: orderId,
        amount: Math.round(amount),
        return_url: `${this.callbackURL}/success`,
        cancel_url: `${this.callbackURL}/cancel`,
        notif_url: `${this.callbackURL}/notify`,
        lang: 'pt', // Portuguese for Guinea-Bissau
        reference: `RUNRUN-${orderId}`,
        customer_msisdn: formattedPhone,
        description,
      };

      const response = await axios.post(
        `${this.apiURL}/webpayment/v1/paymentrequest`,
        paymentData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ Orange Money payment initiated:', orderId);

      return {
        success: true,
        payment_url: response.data.payment_url,
        payment_token: response.data.payment_token,
        order_id: orderId,
        notif_token: response.data.notif_token,
      };
    } catch (error) {
      console.error('❌ Orange Money init error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to initiate Orange Money payment');
    }
  }

  /**
   * Check payment status
   * Query the status of a payment
   */
  async checkPaymentStatus(paymentToken) {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.get(
        `${this.apiURL}/webpayment/v1/transactionstatus/${paymentToken}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      console.log(`✅ Orange Money status checked: ${paymentToken} - ${response.data.status}`);

      return {
        success: response.data.status === 'SUCCESS',
        status: response.data.status, // SUCCESS, PENDING, FAILED, CANCELLED
        transaction_id: response.data.txnid,
        amount: response.data.amount,
        order_id: response.data.order_id,
        message: response.data.message,
      };
    } catch (error) {
      console.error('❌ Orange Money status check error:', error.response?.data || error.message);
      throw new Error('Failed to check payment status');
    }
  }

  /**
   * Process payment notification (webhook)
   * Handle callback from Orange Money
   */
  async processNotification(notificationData) {
    try {
      // Verify notification authenticity
      const expectedSignature = this.generateSignature(notificationData);
      
      // Log notification
      console.log('📥 Orange Money notification received:', {
        order_id: notificationData.order_id,
        status: notificationData.status,
      });

      return {
        success: notificationData.status === 'SUCCESS',
        status: notificationData.status,
        order_id: notificationData.order_id,
        transaction_id: notificationData.txnid,
        amount: notificationData.amount,
        pay_token: notificationData.pay_token,
      };
    } catch (error) {
      console.error('❌ Orange Money notification processing error:', error.message);
      throw new Error('Failed to process notification');
    }
  }

  /**
   * Initiate payout to driver
   * Transfer money to driver's Orange Money account
   */
  async initiatePayout(phoneNumber, amount, reference, description = 'Pagamento motorista Run-Run') {
    try {
      const accessToken = await this.getAccessToken();
      
      // Format phone number
      const formattedPhone = phoneNumber.startsWith('+245') 
        ? phoneNumber 
        : `+245${phoneNumber.replace(/\D/g, '')}`;

      const payoutData = {
        partner_id: this.merchantId,
        recipient_phone: formattedPhone,
        amount: Math.round(amount),
        currency: 'XOF',
        reference,
        description,
      };

      const response = await axios.post(
        `${this.apiURL}/omcoreapis/1.0.2/mp/pay`,
        payoutData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ Orange Money payout initiated:', reference);

      return {
        success: response.data.status === 'SUCCESS',
        transaction_id: response.data.txnid,
        reference: reference,
        status: response.data.status,
      };
    } catch (error) {
      console.error('❌ Orange Money payout error:', error.response?.data || error.message);
      throw new Error('Failed to initiate payout');
    }
  }

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phoneNumber) {
    // Guinea-Bissau format: +245 XXX XXX XXX
    const formatted = phoneNumber.startsWith('+245') 
      ? phoneNumber 
      : `+245${phoneNumber.replace(/\D/g, '')}`;
    
    return formatted.match(/^\+245\d{7,9}$/) !== null;
  }
}

module.exports = new OrangeMoneyService();
