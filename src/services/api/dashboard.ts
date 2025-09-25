// Service dashboard avec données de démonstration

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
  revenue_trend: Array<{
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
  title: string
  description: string
  timestamp: string
  status?: string
  amount?: number
}

export interface DashboardAlerts {
  id: string
  type: 'warning' | 'error' | 'info' | 'success'
  title: string
  message: string
  action_required: boolean
  created_at: string
}

class DashboardService {
  // Récupérer les statistiques générales
  async getStats(): Promise<DashboardStats> {
    return this.getDemoStats()
  }

  // Récupérer les données pour les graphiques
  async getChartData(period: 'week' | 'month' | 'year' = 'month'): Promise<DashboardChartData> {
    return this.getDemoChartData(period)
  }

  // Récupérer les activités récentes
  async getRecentActivities(limit: number = 10): Promise<DashboardRecentActivity[]> {
    return this.getDemoActivities(limit)
  }

  // Récupérer les alertes
  async getAlerts(): Promise<DashboardAlerts[]> {
    return this.getDemoAlerts()
  }

  // Récupérer les métriques par période
  async getMetricsByPeriod(period: 'day' | 'week' | 'month' | 'year') {
    return this.getDemoMetrics(period)
  }

  // Récupérer les statistiques de performance
  async getPerformanceStats() {
    return this.getDemoPerformance()
  }

  // Données de démonstration
  private getDemoStats(): DashboardStats {
    return {
      users: {
        total: 1247,
        new_this_month: 89,
        active: 892,
        growth_rate: 12.5
      },
      trainings: {
        total: 45,
        active_sessions: 12,
        applications: 234,
        completion_rate: 78.5
      },
      jobs: {
        total_offers: 67,
        applications: 189,
        placement_rate: 65.2,
        new_this_month: 8
      },
      payments: {
        total_revenue: 45678.50,
        this_month_revenue: 12345.75,
        successful_transactions: 234,
        pending_transactions: 12,
        growth_rate: 8.3
      },
      blog: {
        total_posts: 23,
        published_posts: 18,
        total_views: 4567,
        engagement_rate: 12.5
      },
      reclamations: {
        total: 45,
        new: 8,
        in_progress: 12,
        closed: 25,
        resolution_rate: 55.6
      }
    }
  }

  private getDemoChartData(period: string): DashboardChartData {
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 365
    const data = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      data.push({
        date: date.toISOString().split('T')[0],
        amount: Math.floor(Math.random() * 5000) + 1000,
        count: Math.floor(Math.random() * 20) + 5
      })
    }

    return {
      revenue_trend: data.map(d => ({ date: d.date, amount: d.amount })),
      user_registrations: data.map(d => ({ date: d.date, count: Math.floor(d.count / 2) })),
      training_applications: data.map(d => ({ date: d.date, count: Math.floor(d.count / 3) })),
      job_applications: data.map(d => ({ date: d.date, count: Math.floor(d.count / 4) }))
    }
  }

  private getDemoActivities(limit: number): DashboardRecentActivity[] {
    const activities = [
      {
        id: '1',
        type: 'user' as const,
        title: 'Nouvel utilisateur: Marie Dupont',
        description: 'Email: marie.dupont@example.com',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        status: 'ACTIVE'
      },
      {
        id: '2',
        type: 'training' as const,
        title: 'Nouvelle candidature formation',
        description: 'Numéro: APP-2024-001',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        status: 'RECEIVED'
      },
      {
        id: '3',
        type: 'job' as const,
        title: 'Nouvelle candidature emploi',
        description: 'Nom: Jean Martin',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        status: 'RECEIVED'
      },
      {
        id: '4',
        type: 'payment' as const,
        title: 'Nouveau paiement',
        description: 'Montant: 150.00 EUR',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        status: 'ACCEPTED',
        amount: 150.00
      },
      {
        id: '5',
        type: 'blog' as const,
        title: 'Nouvel article publié',
        description: 'Titre: "Les formations professionnelles"',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        status: 'PUBLISHED'
      }
    ]

    return activities.slice(0, limit)
  }

  private getDemoAlerts(): DashboardAlerts[] {
    return [
      {
        id: '1',
        type: 'warning',
        title: 'Paiements en attente',
        message: '3 paiement(s) en attente de traitement',
        action_required: true,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        type: 'info',
        title: 'Sessions se terminant bientôt',
        message: '2 session(s) se termine(nt) dans les 7 prochains jours',
        action_required: false,
        created_at: new Date().toISOString()
      }
    ]
  }

  private getDemoMetrics(period: string) {
    return {
      period,
      metrics: {
        users: Math.floor(Math.random() * 100),
        revenue: Math.floor(Math.random() * 10000),
        applications: Math.floor(Math.random() * 50)
      }
    }
  }

  private getDemoPerformance() {
    return {
      response_time: 245,
      uptime: 99.9,
      error_rate: 0.1
    }
  }

}

export const dashboardService = new DashboardService()
