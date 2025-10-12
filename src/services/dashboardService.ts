import { apiService } from './api/base'
import { API_CONFIG } from '@/config/api'

const API_BASE_URL = API_CONFIG.BASE_URL

export interface DashboardStats {
  users: {
    total: number
    by_status: Record<string, number>
    by_type: Record<string, number>
    by_country: Record<string, number>
    two_factor_enabled: number
    new_this_month: number
  }
  trainings: {
    total_active: number
    total_inactive: number
    sessions_by_status: Record<string, number>
    candidates_per_active_session: Record<string, number>
    new_this_month: number
  }
  applications: {
    total_training_applications: number
    training_applications_by_status: Record<string, number>
    total_job_applications: number
    job_applications_by_status: Record<string, number>
  }
  specialties: {
    total: number
    trainings_by_specialty: Record<string, number>
  }
  centers: {
    total: number
    by_status: Record<string, number>
    by_type: Record<string, number>
  }
  blog: {
    total_posts: number
    published_posts: number
    draft_posts: number
    by_category: Record<string, number>
    new_this_month: number
  }
  job_offers: {
    total: number
    available: number
    unavailable: number
    by_contract_type: Record<string, number>
    new_this_month: number
  }
  reclamations: {
    total: number
    by_status: Record<string, number>
    by_priority: Record<string, number>
  }
  payments: {
    total_payments: number
    by_status: Record<string, number>
    total_cinetpay: number
  }
  sessions: {
    new_this_month: number
  }
}

export interface PaymentStats {
  general_payments: {
    total_payments: number
    by_status: Record<string, number>
    amounts_by_status: Record<string, number>
    by_currency: Record<string, { count: number; total_amount: number }>
    by_method: Record<string, { count: number; total_amount: number }>
    this_month: { count: number; amount: number }
    this_week: { count: number; amount: number }
  }
  cinetpay_payments: {
    total: number
    by_status: Record<string, number>
    amounts_by_status: Record<string, number>
    by_currency: Record<string, { count: number; total_amount: number }>
    by_method: Record<string, { count: number; total_amount: number }>
    this_month: { count: number; amount: number }
  }
  training_payments: {
    applications_with_payment: number
    applications_without_payment: number
    total_registration_fees: number
    total_training_fees: number
    registration_fees_by_status: Record<string, number>
    training_fees_by_status: Record<string, number>
    by_currency: Record<string, { count: number; total_registration_fee: number; total_training_fee: number }>
    installments: {
      total_installments: number
      total_amount: number
      total_remaining: number
      by_currency: Record<string, { count: number; total_amount: number; remaining: number }>
    }
  }
  job_payments: {
    applications_with_payment: number
    applications_without_payment: number
    total_submission_fees: number
    submission_fees_by_status: Record<string, number>
    by_currency: Record<string, { count: number; total_submission_fee: number }>
  }
}

class DashboardService {
  private baseURL = `${API_BASE_URL}`

  async getComprehensiveStats(): Promise<DashboardStats> {
    try {
      return await apiService.get('/dashboard/comprehensive-stats')
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      throw error
    }
  }

  async getPaymentStats(): Promise<PaymentStats> {
    try {
      return await apiService.get('/dashboard/payment-stats')
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques de paiement:', error)
      throw error
    }
  }

  async getStats(): Promise<{ stats: DashboardStats; paymentStats: PaymentStats }> {
    try {
      const [stats, paymentStats] = await Promise.all([
        this.getComprehensiveStats(),
        this.getPaymentStats()
      ])
      return { stats, paymentStats }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error)
      throw error
    }
  }
}

export const dashboardService = new DashboardService()
