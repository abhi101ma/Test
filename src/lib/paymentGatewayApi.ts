// Payment Gateway API Service - Simulated integrations for Razorpay, Stripe
import { EnhancedPayout } from '../types/enhanced';

export interface PaymentRequest {
  payout_id: string;
  recipient_id: string;
  amount: number;
  currency: string;
  payment_method: 'bank_transfer' | 'upi' | 'wallet';
  recipient_details: {
    account_number?: string;
    ifsc_code?: string;
    upi_id?: string;
    bank_name?: string;
    account_holder_name: string;
  };
  description: string;
}

export interface PaymentResponse {
  payment_id: string;
  payout_id: string;
  status: 'success' | 'failed' | 'pending' | 'processing';
  amount: number;
  currency: string;
  transaction_fee: number;
  gateway_response: {
    gateway_payment_id: string;
    gateway_status: string;
    gateway_message: string;
    processed_at: string;
  };
  estimated_settlement_time: string;
  failure_reason?: string;
}

export interface BulkPaymentRequest {
  batch_id: string;
  payments: PaymentRequest[];
  total_amount: number;
  description: string;
}

export interface BulkPaymentResponse {
  batch_id: string;
  total_payments: number;
  successful_payments: number;
  failed_payments: number;
  total_amount: number;
  total_fees: number;
  batch_status: 'completed' | 'partial' | 'failed';
  individual_results: PaymentResponse[];
  processed_at: string;
}

export class PaymentGatewayAPI {
  /**
   * Process individual payout via Razorpay (Simulated)
   */
  static async processRazorpayPayout(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate payment processing with 95% success rate
    const isSuccessful = Math.random() > 0.05;
    const transactionFee = paymentRequest.amount * 0.02; // 2% fee
    
    if (isSuccessful) {
      return {
        payment_id: `razorpay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        payout_id: paymentRequest.payout_id,
        status: 'success',
        amount: paymentRequest.amount,
        currency: paymentRequest.currency,
        transaction_fee: transactionFee,
        gateway_response: {
          gateway_payment_id: `rzp_${Math.random().toString(36).substr(2, 12)}`,
          gateway_status: 'processed',
          gateway_message: 'Payment processed successfully',
          processed_at: new Date().toISOString()
        },
        estimated_settlement_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };
    } else {
      return {
        payment_id: `razorpay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        payout_id: paymentRequest.payout_id,
        status: 'failed',
        amount: paymentRequest.amount,
        currency: paymentRequest.currency,
        transaction_fee: 0,
        gateway_response: {
          gateway_payment_id: '',
          gateway_status: 'failed',
          gateway_message: 'Insufficient funds in merchant account',
          processed_at: new Date().toISOString()
        },
        estimated_settlement_time: '',
        failure_reason: 'Insufficient merchant balance'
      };
    }
  }

  /**
   * Process individual payout via Stripe (Simulated)
   */
  static async processStripePayout(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate payment processing with 97% success rate
    const isSuccessful = Math.random() > 0.03;
    const transactionFee = paymentRequest.amount * 0.025; // 2.5% fee
    
    if (isSuccessful) {
      return {
        payment_id: `stripe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        payout_id: paymentRequest.payout_id,
        status: 'success',
        amount: paymentRequest.amount,
        currency: paymentRequest.currency,
        transaction_fee: transactionFee,
        gateway_response: {
          gateway_payment_id: `po_${Math.random().toString(36).substr(2, 12)}`,
          gateway_status: 'paid',
          gateway_message: 'Transfer completed successfully',
          processed_at: new Date().toISOString()
        },
        estimated_settlement_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days
      };
    } else {
      return {
        payment_id: `stripe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        payout_id: paymentRequest.payout_id,
        status: 'failed',
        amount: paymentRequest.amount,
        currency: paymentRequest.currency,
        transaction_fee: 0,
        gateway_response: {
          gateway_payment_id: '',
          gateway_status: 'failed',
          gateway_message: 'Invalid recipient bank details',
          processed_at: new Date().toISOString()
        },
        estimated_settlement_time: '',
        failure_reason: 'Invalid bank account information'
      };
    }
  }

  /**
   * Process bulk payouts (Simulated)
   */
  static async processBulkPayouts(bulkRequest: BulkPaymentRequest): Promise<BulkPaymentResponse> {
    // Simulate bulk processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const results: PaymentResponse[] = [];
    let successfulCount = 0;
    let failedCount = 0;
    let totalFees = 0;

    // Process each payment in the batch
    for (const payment of bulkRequest.payments) {
      const result = await this.processRazorpayPayout(payment);
      results.push(result);
      
      if (result.status === 'success') {
        successfulCount++;
        totalFees += result.transaction_fee;
      } else {
        failedCount++;
      }
    }

    const batchStatus: BulkPaymentResponse['batch_status'] = 
      failedCount === 0 ? 'completed' : 
      successfulCount === 0 ? 'failed' : 'partial';

    return {
      batch_id: bulkRequest.batch_id,
      total_payments: bulkRequest.payments.length,
      successful_payments: successfulCount,
      failed_payments: failedCount,
      total_amount: bulkRequest.total_amount,
      total_fees: totalFees,
      batch_status: batchStatus,
      individual_results: results,
      processed_at: new Date().toISOString()
    };
  }

  /**
   * Convert enhanced payout to payment request format
   */
  static convertPayoutToPaymentRequest(
    payout: EnhancedPayout, 
    recipientDetails: PaymentRequest['recipient_details']
  ): PaymentRequest {
    return {
      payout_id: payout.payout_id,
      recipient_id: payout.influencer_id,
      amount: payout.total_payout,
      currency: 'INR',
      payment_method: 'bank_transfer',
      recipient_details: recipientDetails,
      description: `Influencer payout for campaign ${payout.campaign_id}`
    };
  }

  /**
   * Get payment gateway status and capabilities (Simulated)
   */
  static async getGatewayStatus(): Promise<{
    gateway: string;
    status: 'online' | 'offline' | 'maintenance';
    supported_methods: string[];
    daily_limit: number;
    daily_used: number;
    last_successful_payment: string;
    average_processing_time: string;
  }> {
    return {
      gateway: 'Razorpay',
      status: 'online',
      supported_methods: ['bank_transfer', 'upi', 'wallet'],
      daily_limit: 10000000, // ₹1 Crore daily limit
      daily_used: Math.floor(Math.random() * 5000000) + 1000000, // ₹10L - ₹50L used
      last_successful_payment: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString(),
      average_processing_time: '2.3 seconds'
    };
  }

  /**
   * Validate recipient bank details (Simulated)
   */
  static async validateBankDetails(
    accountNumber: string, 
    ifscCode: string
  ): Promise<{
    is_valid: boolean;
    bank_name?: string;
    branch_name?: string;
    account_holder_name?: string;
    validation_message: string;
  }> {
    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate 90% validation success rate
    const isValid = Math.random() > 0.1;
    
    if (isValid) {
      const banks = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank'];
      const bankName = banks[Math.floor(Math.random() * banks.length)];
      
      return {
        is_valid: true,
        bank_name: bankName,
        branch_name: `${bankName} Main Branch`,
        account_holder_name: 'Account Holder Name',
        validation_message: 'Bank details validated successfully'
      };
    } else {
      return {
        is_valid: false,
        validation_message: 'Invalid IFSC code or account number'
      };
    }
  }
}