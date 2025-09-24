import { apiService } from './base'
import type {
  Payment,
  PaymentInitInput,
  CinetPayInit,
  WebhookPayload,
  PaymentFilter,
  PaymentOutSuccess,
  PaymentListOutSuccess,
  PaymentPageOutSuccess,
  InitPaymentOut,
} from '@/types/payments'

export class PaymentService {
  // ===========================================
  // PAYMENT CRUD
  // ===========================================

  async getPayments(filters: PaymentFilter): Promise<PaymentPageOutSuccess> {
    return apiService.get('/payments', { params: filters })
  }

  async getPayment(paymentId: string): Promise<PaymentOutSuccess> {
    return apiService.get(`/payments/${paymentId}`)
  }

  async createPayment(data: PaymentInitInput): Promise<InitPaymentOut> {
    return apiService.post('/payments', data)
  }

  async updatePayment(paymentId: string, data: Partial<PaymentInitInput>): Promise<PaymentOutSuccess> {
    return apiService.put(`/payments/${paymentId}`, data)
  }

  async deletePayment(paymentId: string): Promise<PaymentOutSuccess> {
    return apiService.delete(`/payments/${paymentId}`)
  }

  // ===========================================
  // PAYMENT PROCESSING
  // ===========================================

  async initPayment(data: PaymentInitInput): Promise<InitPaymentOut> {
    return apiService.post('/payments/init', data)
  }

  async initCinetPayPayment(data: CinetPayInit): Promise<InitPaymentOut> {
    return apiService.post('/payments/cinetpay/init', data)
  }

  async verifyPayment(paymentId: string): Promise<PaymentOutSuccess> {
    return apiService.get(`/payments/${paymentId}/verify`)
  }

  async cancelPayment(paymentId: string): Promise<PaymentOutSuccess> {
    return apiService.post(`/payments/${paymentId}/cancel`)
  }

  async refundPayment(paymentId: string, amount?: number): Promise<PaymentOutSuccess> {
    return apiService.post(`/payments/${paymentId}/refund`, { amount })
  }

  // ===========================================
  // WEBHOOK HANDLING
  // ===========================================

  async handleWebhook(payload: WebhookPayload): Promise<PaymentOutSuccess> {
    return apiService.post('/payments/webhook', payload)
  }

  // ===========================================
  // STATISTICS
  // ===========================================

  async getPaymentStats(): Promise<any> {
    return apiService.get('/payments/stats')
  }

  async getUserPaymentStats(userId: string): Promise<any> {
    return apiService.get(`/payments/stats/user/${userId}`)
  }

  // ===========================================
  // USER OPERATIONS
  // ===========================================

  async getMyPayments(): Promise<PaymentListOutSuccess> {
    return apiService.get('/payments/my')
  }

  async getMyPayment(paymentId: string): Promise<PaymentOutSuccess> {
    return apiService.get(`/payments/my/${paymentId}`)
  }
}

export const paymentService = new PaymentService()