/**
 * PayStack Service - Card Payment Processing
 * Run-Run Guinea-Bissau
 * 
 * Developer: Edivaldo Cardoso
 * Email: suporte@runrungb.com
 * Phone: +245 955 971 275
 * Date: January 6, 2026
 */

const axios = require('axios');

class PaystackService {
  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    this.publicKey = process.env.PAYSTACK_PUBLIC_KEY;
    this.baseURL = 'https://api.paystack.co';
    
    if (!this.secretKey) {
      console.warn('⚠️ PAYSTACK_SECRET_KEY not configured. Payment processing will fail.');
    }
  }

  /**
   * Initialize a transaction
   * Creates a payment session for the user
   */
  async initializeTransaction(email, amount, metadata = {}) {
    try {
      const response = await axios.post(
        `${this.baseURL}/transaction/initialize`,
        {
          email,
          amount: Math.round(amount * 100), // Convert XOF to kobo (smallest unit)
          currency: 'XOF', // West African CFA Franc
          callback_url: process.env.PAYSTACK_CALLBACK_URL,
          metadata: {
            custom_fields: [
              {
                display_name: 'Platform',
                variable_name: 'platform',
                value: 'Run-Run',
              },
              {
                display_name: 'Ride ID',
                variable_name: 'ride_id',
                value: metadata.rideId || 'N/A',
              },
              {
                display_name: 'Driver ID',
                variable_name: 'driver_id',
                value: metadata.driverId || 'N/A',
              },
            ],
            ...metadata,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ PayStack transaction initialized:', response.data.data.reference);

      return {
        success: true,
        authorization_url: response.data.data.authorization_url,
        access_code: response.data.data.access_code,
        reference: response.data.data.reference,
      };
    } catch (error) {
      console.error('❌ PayStack initialization error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to initialize payment');
    }
  }

  /**
   * Verify a transaction
   * Call this after payment to confirm it was successful
   */
  async verifyTransaction(reference) {
    try {
      const response = await axios.get(
        `${this.baseURL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        }
      );

      const data = response.data.data;

      console.log(`✅ PayStack transaction verified: ${reference} - ${data.status}`);

      return {
        success: data.status === 'success',
        amount: data.amount / 100, // Convert back to XOF
        reference: data.reference,
        paid_at: data.paid_at,
        channel: data.channel,
        currency: data.currency,
        customer: {
          email: data.customer.email,
          customer_code: data.customer.customer_code,
        },
        authorization: data.authorization,
      };
    } catch (error) {
      console.error('❌ PayStack verification error:', error.response?.data || error.message);
      throw new Error('Failed to verify payment');
    }
  }

  /**
   * Charge an authorization
   * For repeat payments using saved card
   */
  async chargeAuthorization(authorizationCode, email, amount) {
    try {
      const response = await axios.post(
        `${this.baseURL}/transaction/charge_authorization`,
        {
          authorization_code: authorizationCode,
          email,
          amount: Math.round(amount * 100),
          currency: 'XOF',
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ PayStack authorization charged:', response.data.data.reference);

      return {
        success: response.data.data.status === 'success',
        reference: response.data.data.reference,
        amount: response.data.data.amount / 100,
        status: response.data.data.status,
      };
    } catch (error) {
      console.error('❌ PayStack charge error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to charge card');
    }
  }

  /**
   * Create a transfer recipient
   * For driver payouts
   */
  async createTransferRecipient(name, accountNumber, bankCode) {
    try {
      const response = await axios.post(
        `${this.baseURL}/transferrecipient`,
        {
          type: 'nuban', // Nigerian Uniform Bank Account Number (adapt for Guinea-Bissau)
          name,
          account_number: accountNumber,
          bank_code: bankCode,
          currency: 'XOF',
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        recipient_code: response.data.data.recipient_code,
      };
    } catch (error) {
      console.error('❌ PayStack recipient creation error:', error.response?.data || error.message);
      throw new Error('Failed to create transfer recipient');
    }
  }

  /**
   * Initiate a transfer
   * For driver payouts
   */
  async initiateTransfer(recipientCode, amount, reason) {
    try {
      const response = await axios.post(
        `${this.baseURL}/transfer`,
        {
          source: 'balance',
          amount: Math.round(amount * 100),
          recipient: recipientCode,
          reason,
          currency: 'XOF',
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        transfer_code: response.data.data.transfer_code,
        reference: response.data.data.reference,
        status: response.data.data.status,
      };
    } catch (error) {
      console.error('❌ PayStack transfer error:', error.response?.data || error.message);
      throw new Error('Failed to initiate transfer');
    }
  }

  /**
   * List banks
   * Get available banks for Guinea-Bissau
   */
  async listBanks() {
    try {
      const response = await axios.get(
        `${this.baseURL}/bank?currency=XOF`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        }
      );

      return {
        success: true,
        banks: response.data.data,
      };
    } catch (error) {
      console.error('❌ PayStack banks list error:', error.response?.data || error.message);
      throw new Error('Failed to list banks');
    }
  }

  /**
   * Verify webhook signature
   * Ensure webhook came from PayStack
   */
  verifyWebhookSignature(requestBody, signature) {
    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha512', this.secretKey)
      .update(JSON.stringify(requestBody))
      .digest('hex');
    
    return hash === signature;
  }
}

module.exports = new PaystackService();
