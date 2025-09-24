import type { BaseOutSuccess, BaseOutPage } from './base'
import { PaymentStatusEnum } from './enums'

// ===========================================
// PAYMENT TYPES
// ===========================================

export interface Payment {
  id: string
  amount: number
  currency: string
  status: PaymentStatusEnum
  payment_method?: string
  transaction_id?: string
  customer_email?: string
  customer_phone?: string
  customer_name?: string
  customer_address?: string
  customer_city?: string
  customer_country?: string
  customer_zip_code?: string
  description?: string
  payment_url?: string
  payment_date?: string
  cinetpay_init?: {
    site_id: string
    api_key: string
    transaction_id: string
    payment_method: string
  }
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

// ===========================================
// INPUT SCHEMAS
// ===========================================

export interface PaymentInitInput {
  amount: number
  currency: string
  customer_email: string
  customer_phone?: string
  customer_name?: string
  customer_address?: string
  customer_city?: string
  customer_country?: string
  customer_zip_code?: string
  description?: string
  metadata?: Record<string, any>
}

export interface CinetPayInit {
  amount: number
  currency: string
  customer_email: string
  customer_phone?: string
  customer_name?: string
  customer_address?: string
  customer_city?: string
  customer_country?: string
  customer_zip_code?: string
  description?: string
  metadata?: Record<string, any>
}

export interface WebhookPayload {
  transaction_id: string
  status: PaymentStatusEnum
  amount: number
  currency: string
  metadata?: Record<string, any>
}

export interface PaymentFilter {
  page?: number
  limit?: number
  search?: string
  status?: PaymentStatusEnum
  currency?: string
  customer_email?: string
  created_from?: string
  created_to?: string
  amount_min?: number
  amount_max?: number
}

// ===========================================
// OUTPUT SCHEMAS
// ===========================================

export interface PaymentOutSuccess extends BaseOutSuccess {
  data: Payment
}

export interface PaymentListOutSuccess extends BaseOutSuccess {
  data: Payment[]
}

export interface PaymentPageOutSuccess extends BaseOutPage {
  data: Payment[]
}

export interface InitPaymentOut {
  payment_id: string
  payment_url?: string
  qr_code?: string
  transaction_id?: string
  status: PaymentStatusEnum
  amount: number
  currency: string
  expires_at?: string
}
