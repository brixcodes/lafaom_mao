// Service API pour le dashboard
import { apiService } from './base'

// ===== INTERFACES DASHBOARD =====

export interface DashboardStats {
  users: {
    total: number
    new_this_month: number
    active: number
    growth_rate: number
  }
  trainings: {
    total: number
    active_sessions: number
    applications: number
    completion_rate: number
  }
  jobs: {
    total_offers: number
    applications: number
    placement_rate: number
    new_this_month: number
  }
  payments: {
    total_revenue: number
    this_month_revenue: number
    successful_transactions: number
    pending_transactions: number
    growth_rate: number
  }
  blog: {
    total_posts: number
    published_posts: number
    total_views: number
    engagement_rate: number
  }
  reclamations: {
    total: number
    new: number
    in_progress: number
    closed: number
    resolution_rate: number
  }
}

export interface DashboardChartData {
  revenue: Array<{
    date: string
    amount: number
  }>
  user_registrations: Array<{
    date: string
    count: number
  }>
  training_applications: Array<{
    date: string
    count: number
  }>
  job_applications: Array<{
    date: string
    count: number
  }>
}

export interface DashboardRecentActivity {
  id: string
  type: 'user' | 'training' | 'job' | 'payment' | 'blog' | 'reclamation'
  action: string
  description: string
  timestamp: string
  user_name?: string
  amount?: number
  status?: string
}

export interface DashboardAlerts {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: string
  is_read: boolean
  action_url?: string
}

// ===== SERVICE DASHBOARD =====

class DashboardService {
  // === STATISTIQUES ===

  /**
   * Récupérer les statistiques générales du dashboard
   */
  async getStats(): Promise<DashboardStats> {
    return await apiService.get('/dashboard/comprehensive-stats')
  }

  /**
   * Récupérer les données de graphiques
   */
  async getChartData(period: 'week' | 'month' | 'year' = 'month'): Promise<DashboardChartData> {
    return await apiService.get('/dashboard/payment-stats', {
      params: { period }
    })
  }

  // === ACTIVITÉS RÉCENTES ===

  /**
   * Récupérer les activités récentes
   */
  async getRecentActivities(limit: number = 10): Promise<DashboardRecentActivity[]> {
    return await apiService.get('/activities', {
      params: { limit }
    })
  }

  // === ALERTES ===

  /**
   * Récupérer les alertes du dashboard
   */
  async getAlerts(): Promise<DashboardAlerts[]> {
    return await apiService.get('/alerts')
  }

  /**
   * Marquer une alerte comme lue
   */
  async markAlertAsRead(alertId: string): Promise<void> {
    await apiService.patch(`/alerts/${alertId}/read`)
  }

  /**
   * Marquer toutes les alertes comme lues
   */
  async markAllAlertsAsRead(): Promise<void> {
    await apiService.patch('/alerts/read-all')
  }

  // === MÉTHODES UTILITAIRES ===

  /**
   * Récupérer toutes les données du dashboard en une seule fois
   */
  async getDashboardData(period: 'week' | 'month' | 'year' = 'month') {
    const [stats, chartData, activities, alerts] = await Promise.all([
      this.getStats(),
      this.getChartData(period),
      this.getRecentActivities(10),
      this.getAlerts()
    ])

    return {
      stats,
      chartData,
      activities,
      alerts
    }
  }

  /**
   * Rafraîchir les données du dashboard
   */
  async refreshDashboard(period: 'week' | 'month' | 'year' = 'month') {
    return await this.getDashboardData(period)
  }
}

export const dashboardService = new DashboardService()
