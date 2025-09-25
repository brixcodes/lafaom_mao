import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dashboardService } from '@/services/api/dashboard'
import type { 
  DashboardStats, 
  DashboardChartData, 
  DashboardRecentActivity, 
  DashboardAlerts 
} from '@/services/api/dashboard'

export const useDashboardStore = defineStore('dashboard', () => {
  // ===========================================
  // STATE
  // ===========================================
  
  const stats = ref<DashboardStats | null>(null)
  const chartData = ref<DashboardChartData | null>(null)
  const recentActivities = ref<DashboardRecentActivity[]>([])
  const alerts = ref<DashboardAlerts[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)

  // ===========================================
  // GETTERS
  // ===========================================

  const hasData = computed(() => stats.value !== null)
  
  const totalUsers = computed(() => stats.value?.users.total || 0)
  const newUsersThisMonth = computed(() => stats.value?.users.new_this_month || 0)
  const activeUsers = computed(() => stats.value?.users.active || 0)
  const userGrowthRate = computed(() => stats.value?.users.growth_rate || 0)

  const totalTrainings = computed(() => stats.value?.trainings.total || 0)
  const activeTrainingSessions = computed(() => stats.value?.trainings.active_sessions || 0)
  const trainingApplications = computed(() => stats.value?.trainings.applications || 0)
  const trainingCompletionRate = computed(() => stats.value?.trainings.completion_rate || 0)

  const totalJobOffers = computed(() => stats.value?.jobs.total_offers || 0)
  const jobApplications = computed(() => stats.value?.jobs.applications || 0)
  const jobPlacementRate = computed(() => stats.value?.jobs.placement_rate || 0)
  const newJobOffersThisMonth = computed(() => stats.value?.jobs.new_this_month || 0)

  const totalRevenue = computed(() => stats.value?.payments.total_revenue || 0)
  const thisMonthRevenue = computed(() => stats.value?.payments.this_month_revenue || 0)
  const successfulTransactions = computed(() => stats.value?.payments.successful_transactions || 0)
  const pendingTransactions = computed(() => stats.value?.payments.pending_transactions || 0)
  const revenueGrowthRate = computed(() => stats.value?.payments.growth_rate || 0)

  const totalBlogPosts = computed(() => stats.value?.blog.total_posts || 0)
  const publishedBlogPosts = computed(() => stats.value?.blog.published_posts || 0)
  const totalBlogViews = computed(() => stats.value?.blog.total_views || 0)
  const blogEngagementRate = computed(() => stats.value?.blog.engagement_rate || 0)

  const totalReclamations = computed(() => stats.value?.reclamations.total || 0)
  const newReclamations = computed(() => stats.value?.reclamations.new || 0)
  const inProgressReclamations = computed(() => stats.value?.reclamations.in_progress || 0)
  const closedReclamations = computed(() => stats.value?.reclamations.closed || 0)
  const reclamationResolutionRate = computed(() => stats.value?.reclamations.resolution_rate || 0)

  const criticalAlerts = computed(() => 
    alerts.value.filter(alert => alert.type === 'error' || alert.type === 'warning')
  )
  
  const recentActivitiesCount = computed(() => recentActivities.value.length)

  // ===========================================
  // ACTIONS
  // ===========================================

  // Charger toutes les données du dashboard
  const loadDashboardData = async () => {
    try {
      isLoading.value = true
      error.value = null

      const [statsData, chartDataResult, activitiesData, alertsData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getChartData('month'),
        dashboardService.getRecentActivities(10),
        dashboardService.getAlerts()
      ])

      stats.value = statsData
      chartData.value = chartDataResult
      recentActivities.value = activitiesData
      alerts.value = alertsData
      lastUpdated.value = new Date()

    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement du dashboard'
      console.error('Error loading dashboard data:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Charger uniquement les statistiques
  const loadStats = async () => {
    try {
      isLoading.value = true
      error.value = null

      const statsData = await dashboardService.getStats()
      stats.value = statsData
      lastUpdated.value = new Date()

    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des statistiques'
      console.error('Error loading stats:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Charger les données de graphiques
  const loadChartData = async (period: 'week' | 'month' | 'year' = 'month') => {
    try {
      isLoading.value = true
      error.value = null

      const chartDataResult = await dashboardService.getChartData(period)
      chartData.value = chartDataResult

    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des graphiques'
      console.error('Error loading chart data:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Charger les activités récentes
  const loadRecentActivities = async (limit: number = 10) => {
    try {
      isLoading.value = true
      error.value = null

      const activitiesData = await dashboardService.getRecentActivities(limit)
      recentActivities.value = activitiesData

    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des activités'
      console.error('Error loading recent activities:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Charger les alertes
  const loadAlerts = async () => {
    try {
      isLoading.value = true
      error.value = null

      const alertsData = await dashboardService.getAlerts()
      alerts.value = alertsData

    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des alertes'
      console.error('Error loading alerts:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Rafraîchir les données
  const refreshData = async () => {
    await loadDashboardData()
  }

  // Nettoyer les erreurs
  const clearError = () => {
    error.value = null
  }

  // Réinitialiser l'état
  const resetState = () => {
    stats.value = null
    chartData.value = null
    recentActivities.value = []
    alerts.value = []
    isLoading.value = false
    error.value = null
    lastUpdated.value = null
  }

  return {
    // State
    stats,
    chartData,
    recentActivities,
    alerts,
    isLoading,
    error,
    lastUpdated,

    // Getters
    hasData,
    totalUsers,
    newUsersThisMonth,
    activeUsers,
    userGrowthRate,
    totalTrainings,
    activeTrainingSessions,
    trainingApplications,
    trainingCompletionRate,
    totalJobOffers,
    jobApplications,
    jobPlacementRate,
    newJobOffersThisMonth,
    totalRevenue,
    thisMonthRevenue,
    successfulTransactions,
    pendingTransactions,
    revenueGrowthRate,
    totalBlogPosts,
    publishedBlogPosts,
    totalBlogViews,
    blogEngagementRate,
    totalReclamations,
    newReclamations,
    inProgressReclamations,
    closedReclamations,
    reclamationResolutionRate,
    criticalAlerts,
    recentActivitiesCount,

    // Actions
    loadDashboardData,
    loadStats,
    loadChartData,
    loadRecentActivities,
    loadAlerts,
    refreshData,
    clearError,
    resetState,
  }
})
