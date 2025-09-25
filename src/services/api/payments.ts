import { apiService } from './base'

// Types pour les paiements
export interface Payment {
  id: number
  user_id: number
  product_name: string
  product_amount: number
  product_currency: string
  status: string
  transaction_id?: string
  created_at: string
  updated_at: string
}

export interface CinetPayPayment {
  id: number
  payment_id: number
  transaction_id: string
  amount: number
  currency: string
  status: string
  created_at: string
}

export interface PaymentFilter {
  page?: number
  limit?: number
  status?: string
  user_id?: number
  date_from?: string
  date_to?: string
}

export interface CreatePaymentRequest {
  product_name: string
  product_amount: number
  product_currency: string
}

export interface UpdatePaymentRequest {
  product_name?: string
  product_amount?: number
  product_currency?: string
  status?: string
}

export interface PaymentStatusCheck {
  transaction_id: string
  status: string
  amount: number
  currency: string
}

export interface CinetPayWebhook {
  cpm_trans_id: string
  cpm_trans_date: string
  cpm_amount: number
  cpm_currency: string
  cpm_payid: string
  cpm_payment_date: string
  cpm_payment_time: string
  cpm_error_message: string
  cpm_phone_prefixe: string
  cpm_phone_number: string
  cpm_ipn_ack: string
  cpm_result: string
  cpm_trans_status: string
  cpm_designation: string
  cpm_custom: string
  cpm_signature: string
}

class PaymentsService {
  // === PAIEMENTS ===
  // Récupérer la liste des paiements
  async getPayments(filters: PaymentFilter = {}): Promise<any> {
    return await apiService.get('/payments', { params: filters })
  }

  // Récupérer un paiement par ID
  async getPaymentById(paymentId: number): Promise<Payment> {
    return await apiService.get(`/payments/${paymentId}`)
  }

  // Récupérer un paiement par transaction ID
  async getPaymentByTransactionId(transactionId: string): Promise<Payment> {
    return await apiService.get(`/payments-by-transaction/${transactionId}`)
  }

  // Vérifier le statut d'un paiement
  async checkPaymentStatus(transactionId: string): Promise<PaymentStatusCheck> {
    return await apiService.get(`/check-status/${transactionId}`)
  }

  // Créer un paiement
  async createPayment(paymentData: CreatePaymentRequest): Promise<Payment> {
    return await apiService.post('/payments', paymentData)
  }

  // Mettre à jour un paiement
  async updatePayment(paymentId: number, paymentData: UpdatePaymentRequest): Promise<Payment> {
    return await apiService.put(`/payments/${paymentId}`, paymentData)
  }

  // Supprimer un paiement
  async deletePayment(paymentId: number): Promise<void> {
    return await apiService.delete(`/payments/${paymentId}`)
  }

  // === WEBHOOK CINETPAY ===
  // Recevoir la notification CinetPay
  async handleCinetPayWebhook(webhookData: CinetPayWebhook): Promise<any> {
    return await apiService.post('/cinetpay/notify', webhookData)
  }
}

export const paymentsService = new PaymentsService()