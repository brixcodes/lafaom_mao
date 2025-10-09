// Types pour les candidatures de cabinet
export interface CabinetApplicationBase {
  company_name: string
  contact_email: string
  contact_phone: string
  address: string
  registration_number: string
  experience_years: number
  qualifications?: string
  technical_proposal?: string
  financial_proposal?: string
  references?: string
}

export interface CabinetApplicationCreate extends CabinetApplicationBase {
  // Pas de champs supplémentaires pour la création
}

export interface CabinetApplicationUpdate {
  company_name?: string
  contact_phone?: string
  address?: string
  registration_number?: string
  experience_years?: number
  qualifications?: string
  technical_proposal?: string
  financial_proposal?: string
  references?: string
}

export interface CabinetApplicationOut extends CabinetApplicationBase {
  id: string
  status: CabinetApplicationStatus
  payment_status: PaymentStatus
  payment_reference?: string
  payment_amount: number
  payment_currency: string
  payment_date?: string
  account_created: boolean
  credentials_sent: boolean
  created_at: string
  updated_at: string
  payment_url?: string
}

export enum CabinetApplicationStatus {
  PENDING = 'pending',
  PAID = 'paid',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface CabinetApplicationStats {
  total_applications: number
  pending_applications: number
  paid_applications: number
  approved_applications: number
  rejected_applications: number
  total_revenue: number
  currency: string
}

// Status labels pour l'affichage
export const CABINET_STATUS_LABELS = {
  [CabinetApplicationStatus.PENDING]: 'En attente',
  [CabinetApplicationStatus.PAID]: 'Payé',
  [CabinetApplicationStatus.APPROVED]: 'Approuvé',
  [CabinetApplicationStatus.REJECTED]: 'Rejeté',
  [CabinetApplicationStatus.CANCELLED]: 'Annulé'
}

export const PAYMENT_STATUS_LABELS = {
  [PaymentStatus.PENDING]: 'En attente',
  [PaymentStatus.PAID]: 'Payé',
  [PaymentStatus.FAILED]: 'Échoué',
  [PaymentStatus.REFUNDED]: 'Remboursé'
}

// Status colors pour les chips
export const CABINET_STATUS_COLORS = {
  [CabinetApplicationStatus.PENDING]: 'warning',
  [CabinetApplicationStatus.PAID]: 'info',
  [CabinetApplicationStatus.APPROVED]: 'success',
  [CabinetApplicationStatus.REJECTED]: 'error',
  [CabinetApplicationStatus.CANCELLED]: 'default'
}

export const PAYMENT_STATUS_COLORS = {
  [PaymentStatus.PENDING]: 'warning',
  [PaymentStatus.PAID]: 'success',
  [PaymentStatus.FAILED]: 'error',
  [PaymentStatus.REFUNDED]: 'info'
}
