import { apiService } from '@/services/api/base'
import { API_ENDPOINTS } from '@/config/api'
import type {
  Payment,
  PaymentCreateInput,
  PaymentUpdateInput,
  PaymentFilter,
  PaymentStatusCheckInput,
  CinetpayWebhookInput,
  PaymentOutSuccess,
  PaymentListOutSuccess,
  PaymentStatusOutSuccess,
  CinetpayWebhookOutSuccess
} from '@/types/payment'

export const paymentService = {
  // Get all payments
  async getPayments(filters?: Partial<PaymentFilter>): Promise<PaymentListOutSuccess> {
    return apiService.get(API_ENDPOINTS.PAYMENTS.LIST, { params: filters }) as Promise<PaymentListOutSuccess>
  },

  // Get payment by ID
  async getPayment(paymentId: number): Promise<PaymentOutSuccess> {
    return apiService.get(API_ENDPOINTS.PAYMENTS.DETAIL(paymentId)) as Promise<PaymentOutSuccess>
  },

  // Get payment by transaction ID
  async getPaymentByTransaction(transactionId: string): Promise<PaymentStatusOutSuccess> {
    return apiService.get(API_ENDPOINTS.PAYMENTS.BY_TRANSACTION(transactionId)) as Promise<PaymentStatusOutSuccess>
  },

  // Check payment status
  async checkPaymentStatus(transactionId: string): Promise<PaymentStatusOutSuccess> {
    return apiService.get(API_ENDPOINTS.PAYMENTS.CHECK_STATUS(transactionId)) as Promise<PaymentStatusOutSuccess>
  },

  // Create payment
  async createPayment(data: PaymentCreateInput): Promise<PaymentOutSuccess> {
    return apiService.post(API_ENDPOINTS.PAYMENTS.CREATE, data) as Promise<PaymentOutSuccess>
  },

  // Update payment
  async updatePayment(paymentId: number, data: PaymentUpdateInput): Promise<PaymentOutSuccess> {
    return apiService.put(API_ENDPOINTS.PAYMENTS.UPDATE(paymentId), data) as Promise<PaymentOutSuccess>
  },

  // Delete payment
  async deletePayment(paymentId: number): Promise<PaymentOutSuccess> {
    return apiService.delete(API_ENDPOINTS.PAYMENTS.DELETE(paymentId)) as Promise<PaymentOutSuccess>
  },

  // Cinetpay webhook handler
  async handleCinetpayWebhook(data: CinetpayWebhookInput): Promise<CinetpayWebhookOutSuccess> {
    return apiService.post(API_ENDPOINTS.PAYMENTS.CINETPAY_WEBHOOK, data) as Promise<CinetpayWebhookOutSuccess>
  }
}
