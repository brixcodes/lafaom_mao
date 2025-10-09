import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cabinetService } from '@/services/api/cabinet'
import type { 
  CabinetApplicationOut, 
  CabinetApplicationCreate, 
  CabinetApplicationUpdate,
  CabinetApplicationStats
} from '@/types/cabinet'
import { CabinetApplicationStatus } from '@/types/cabinet'

export const useCabinetStore = defineStore('cabinet', () => {
  // State
  const applications = ref<CabinetApplicationOut[]>([])
  const currentApplication = ref<CabinetApplicationOut | null>(null)
  const stats = ref<CabinetApplicationStats | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const hasApplications = computed(() => applications.value.length > 0)
  const pendingApplications = computed(() => 
    applications.value.filter(app => app.status === CabinetApplicationStatus.PENDING)
  )
  const paidApplications = computed(() => 
    applications.value.filter(app => app.status === CabinetApplicationStatus.PAID)
  )
  const approvedApplications = computed(() => 
    applications.value.filter(app => app.status === CabinetApplicationStatus.APPROVED)
  )
  const rejectedApplications = computed(() => 
    applications.value.filter(app => app.status === CabinetApplicationStatus.REJECTED)
  )

  // Actions
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setError = (err: string | null) => {
    error.value = err
  }

  const clearError = () => {
    error.value = null
  }

  /**
   * Créer une candidature
   */
  const createApplication = async (data: CabinetApplicationCreate) => {
    try {
      setLoading(true)
      clearError()
      const response = await cabinetService.createApplication(data)
      console.log('Store response:', response)
      console.log('Store response.data:', response.data)
      currentApplication.value = response.data
      return response.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Erreur lors de la création de la candidature'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Récupérer une candidature par ID
   */
  const fetchApplication = async (id: string) => {
    try {
      setLoading(true)
      clearError()
      const response = await cabinetService.getApplication(id)
      currentApplication.value = response.data
      return response.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Erreur lors de la récupération de la candidature'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Lister les candidatures
   */
  const fetchApplications = async (params?: {
    skip?: number
    limit?: number
    status?: string
  }) => {
    try {
      setLoading(true)
      clearError()
      const response = await cabinetService.listApplications(params)
      applications.value = response.data
      return response.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Erreur lors de la récupération des candidatures'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Récupérer les candidatures payées
   */
  const fetchPaidApplications = async (params?: {
    skip?: number
    limit?: number
  }) => {
    try {
      setLoading(true)
      clearError()
      const response = await cabinetService.getPaidApplications(params)
      applications.value = response.data
      return response.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Erreur lors de la récupération des candidatures payées'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Récupérer les candidatures de l'utilisateur connecté
   */
  const fetchMyApplications = async (params?: {
    skip?: number
    limit?: number
  }) => {
    try {
      setLoading(true)
      clearError()
      const response = await cabinetService.getMyApplications(params)
      applications.value = response.data
      return response.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Erreur lors de la récupération de vos candidatures'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Mettre à jour une candidature
   */
  const updateApplication = async (id: string, data: CabinetApplicationUpdate) => {
    try {
      setLoading(true)
      clearError()
      const response = await cabinetService.updateApplication(id, data)
      
      // Mettre à jour dans la liste
      const index = applications.value.findIndex(app => app.id === id)
      if (index !== -1) {
        applications.value[index] = response.data
      }
      
      // Mettre à jour la candidature courante si c'est la même
      if (currentApplication.value?.id === id) {
        currentApplication.value = response.data
      }
      
      return response.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Erreur lors de la mise à jour de la candidature'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Approuver une candidature
   */
  const approveApplication = async (id: string) => {
    try {
      setLoading(true)
      clearError()
      const response = await cabinetService.approveApplication(id)
      
      // Mettre à jour dans la liste
      const index = applications.value.findIndex(app => app.id === id)
      if (index !== -1) {
        applications.value[index] = response.data
      }
      
      // Mettre à jour la candidature courante si c'est la même
      if (currentApplication.value?.id === id) {
        currentApplication.value = response.data
      }
      
      return response.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Erreur lors de l\'approbation de la candidature'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Rejeter une candidature
   */
  const rejectApplication = async (id: string, reason?: string) => {
    try {
      setLoading(true)
      clearError()
      const response = await cabinetService.rejectApplication(id, reason)
      
      // Mettre à jour dans la liste
      const index = applications.value.findIndex(app => app.id === id)
      if (index !== -1) {
        applications.value[index] = response.data
      }
      
      // Mettre à jour la candidature courante si c'est la même
      if (currentApplication.value?.id === id) {
        currentApplication.value = response.data
      }
      
      return response.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Erreur lors du rejet de la candidature'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Récupérer les statistiques
   */
  const fetchStats = async () => {
    try {
      setLoading(true)
      clearError()
      const response = await cabinetService.getStats()
      stats.value = response.data
      return response.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Erreur lors de la récupération des statistiques'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Vérifier le statut de paiement
   */
  const checkPaymentStatus = async (applicationId: string) => {
    try {
      setLoading(true)
      clearError()
      const response = await cabinetService.checkPaymentStatus(applicationId)
      
      // Mettre à jour la candidature courante
      if (currentApplication.value?.id === applicationId) {
        currentApplication.value = response.data
      }
      
      return response.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Erreur lors de la vérification du paiement'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Supprimer une candidature
   */
  const deleteApplication = async (id: string) => {
    try {
      setLoading(true)
      clearError()
      await cabinetService.deleteApplication(id)
      
      // Retirer de la liste
      applications.value = applications.value.filter(app => app.id !== id)
      
      // Nettoyer la candidature courante si c'est la même
      if (currentApplication.value?.id === id) {
        currentApplication.value = null
      }
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Erreur lors de la suppression de la candidature'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Réinitialiser le store
   */
  const reset = () => {
    applications.value = []
    currentApplication.value = null
    stats.value = null
    isLoading.value = false
    error.value = null
  }

  return {
    // State
    applications,
    currentApplication,
    stats,
    isLoading,
    error,
    
    // Getters
    hasApplications,
    pendingApplications,
    paidApplications,
    approvedApplications,
    rejectedApplications,
    
    // Actions
    createApplication,
    fetchApplication,
    fetchApplications,
    fetchPaidApplications,
    fetchMyApplications,
    updateApplication,
    approveApplication,
    rejectApplication,
    fetchStats,
    checkPaymentStatus,
    deleteApplication,
    reset,
    setLoading,
    setError,
    clearError
  }
})
