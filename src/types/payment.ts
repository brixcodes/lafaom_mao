// Payment Status Enum
export enum PaymentStatusEnum {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

// Payment Method Enum
export enum PaymentMethodEnum {
  CINETPAY = 'CINETPAY',
  MOBILE_MONEY = 'MOBILE_MONEY',
  BANK_CARD = 'BANK_CARD'
}

// Payment Interface
export interface Payment {
  id: number
  payment_id: string
  transaction_id: string
  amount: number
  currency: string
  status: PaymentStatusEnum
  payment_method: PaymentMethodEnum
  user_id: string
  application_id?: number
  description?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
  paid_at?: string
  failed_at?: string
  refunded_at?: string
}

// Payment Create Input
export interface PaymentCreateInput {
  amount: number
  currency: string
  payment_method: PaymentMethodEnum
  application_id?: number
  description?: string
  metadata?: Record<string, any>
}

// Payment Update Input
export interface PaymentUpdateInput {
  status?: PaymentStatusEnum
  metadata?: Record<string, any>
}

// Payment Filter
export interface PaymentFilter {
  page: number
  page_size: number
  status?: PaymentStatusEnum
  payment_method?: PaymentMethodEnum
  user_id?: string
  application_id?: number
  date_from?: string
  date_to?: string
  order_by?: string
  asc?: string
}

// Payment Status Check Input
export interface PaymentStatusCheckInput {
  transaction_id: string
}

// Cinetpay Webhook Input
export interface CinetpayWebhookInput {
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

// API Response Types
export interface PaymentOutSuccess {
  success: boolean
  message: string
  data: Payment
}

export interface PaymentListOutSuccess {
  success: boolean
  message: string
  data: Payment[]
  page: number
  number: number
  total_number: number
}

export interface PaymentStatusOutSuccess {
  success: boolean
  message: string
  data: {
    transaction_id: string
    status: PaymentStatusEnum
    amount: number
    currency: string
    payment_method: PaymentMethodEnum
    created_at: string
    updated_at: string
  }
}

export interface CinetpayWebhookOutSuccess {
  success: boolean
  message: string
  data: {
    transaction_id: string
    status: PaymentStatusEnum
    processed: boolean
  }
}

// Payment Status Configuration
export interface PaymentStatusConfig {
  color: string
  text: string
  icon: string
}

// Payment Method Configuration
export interface PaymentMethodConfig {
  color: string
  text: string
  icon: string
}