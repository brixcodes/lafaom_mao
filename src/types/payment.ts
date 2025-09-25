// Payment Status Enum (based on real API data)
export enum PaymentStatusEnum {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUSED = 'refused',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

// Payment Method Enum
export enum PaymentMethodEnum {
  CINETPAY = 'CINETPAY',
  MOBILE_MONEY = 'MOBILE_MONEY',
  BANK_CARD = 'BANK_CARD'
}

// Payment Interface (based on real API data)
export interface Payment {
  transaction_id: string
  product_amount: number
  product_currency: string
  payment_currency: string
  daily_rate: number
  usd_product_currency_rate: number
  usd_payment_currency_rate: number
  status: string
  payable_id: string
  payable_type: string
  payment_type_id: string
  payment_type: string
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
  transaction_id?: string
  currency?: string
  amount_min?: number
  amount_max?: number
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