import { apiService } from './base'
import type {
  Payment,
  PaymentCreateInput,
  PaymentUpdateInput,
  PaymentFilter,
  PaymentStatusCheckInput,
  CinetpayWebhookInput,
  PaymentInitInput,
  CinetPayInit,
  PaymentOutSuccess,
  PaymentListOutSuccess,
  PaymentStatusOutSuccess,
  CinetPayInitOutSuccess,
  PaymentWebhookOutSuccess
} from '@/types/payment'

/**
 * Service pour la gestion des paiements
 */
export const paymentsService = {
  /**
   * Récupérer la liste des paiements avec filtres
   */
  async getPayments(filters: PaymentFilter = {}): Promise<PaymentListOutSuccess> {
    const response = await apiService.get('/payments/payments', filters)
    return response as PaymentListOutSuccess
  },

  /**
   * Récupérer un paiement par ID
   */
  async getPaymentById(paymentId: string): Promise<PaymentOutSuccess> {
    const response = await apiService.get(`/payments/payments/${paymentId}`)
    return response as PaymentOutSuccess
  },

  /**
   * Récupérer un paiement par transaction ID
   */
  async getPaymentByTransaction(transactionId: string): Promise<PaymentOutSuccess> {
    const response = await apiService.get(`/payments/payments-by-transaction/${transactionId}`)
    return response as PaymentOutSuccess
  },

  /**
   * Vérifier le statut d'un paiement par transaction ID
   */
  async checkPaymentStatus(transactionId: string): Promise<PaymentOutSuccess> {
    const response = await apiService.get(`/payments/check-status/${transactionId}`)
    return response as PaymentOutSuccess
  },

  /**
   * Webhook CinetPay (endpoint backend: /payments/cinetpay/notify)
   */
  async cinetPayWebhook(data: CinetpayWebhookInput): Promise<PaymentWebhookOutSuccess> {
    const response = await apiService.post('/payments/cinetpay/notify', data)
    return response as PaymentWebhookOutSuccess
  }
}
