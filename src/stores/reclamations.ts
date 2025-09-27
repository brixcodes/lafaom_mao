import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { reclamationsService } from '@/services/api/reclamations'
import type {
  Reclamation,
  ReclamationCreateInput,
  ReclamationUpdateInput,
  ReclamationAdminUpdateInput,
  ReclamationFilter,
  ReclamationType,
} from '@/types/reclamations'
import { ReclamationStatusEnum, ReclamationPriorityEnum } from '@/types/enums'

export const useReclamationStore = defineStore('reclamations', () => {
  // ===========================================
  // STATE
  // ===========================================

  const reclamations = ref<Reclamation[]>([])
  const currentReclamation = ref<Reclamation | null>(null)
  const reclamationTypes = ref<ReclamationType[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const totalCount = ref(0)
  const currentPage = ref(1)
  const totalPages = ref(0)

  // ===========================================
  // GETTERS
  // ===========================================

  const getReclamationById = computed(() => {
    return (id: number) => reclamations.value.find(r => r.id === id)
  })

  const getReclamationsByStatus = computed(() => {
    return (status: ReclamationStatusEnum) => 
      reclamations.value.filter(r => r.status === status)
  })

  const getReclamationsByPriority = computed(() => {
    return (priority: ReclamationPriorityEnum) => 
      reclamations.value.filter(r => r.priority === priority)
  })

  const getReclamationTypeById = computed(() => {
    return (id: number) => reclamationTypes.value.find(rt => rt.id === id)
  })

  // ===========================================
  // ACTIONS
  // ===========================================

  // Fetch reclamations with filters
  const fetchReclamations = async (filters: ReclamationFilter = {}) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await reclamationsService.getReclamations(filters)
      reclamations.value = response.data
      totalCount.value = response.total_number
      currentPage.value = response.page
      totalPages.value = Math.ceil(response.total_number / (filters.limit || 10))
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des réclamations'
      console.error('Error fetching reclamations:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Fetch single reclamation
  const fetchReclamation = async (reclamationId: number) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await reclamationsService.getReclamation(reclamationId)
      currentReclamation.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement de la réclamation'
      console.error('Error fetching reclamation:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Create reclamation
  const createReclamation = async (data: ReclamationCreateInput) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await reclamationsService.createReclamation(data)
      reclamations.value.unshift(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la création de la réclamation'
      console.error('Error creating reclamation:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Update reclamation
  const updateReclamation = async (reclamationId: number, data: ReclamationUpdateInput) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await reclamationsService.updateReclamation(reclamationId, data)
      const index = reclamations.value.findIndex(r => r.id === reclamationId)
      if (index !== -1) {
        reclamations.value[index] = response.data
      }
      if (currentReclamation.value?.id === reclamationId) {
        currentReclamation.value = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour de la réclamation'
      console.error('Error updating reclamation:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Delete reclamation
  const deleteReclamation = async (reclamationId: number) => {
    isLoading.value = true
    error.value = null
    
    try {
      await reclamationsService.deleteReclamation(reclamationId)
      reclamations.value = reclamations.value.filter(r => r.id !== reclamationId)
      if (currentReclamation.value?.id === reclamationId) {
        currentReclamation.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la suppression de la réclamation'
      console.error('Error deleting reclamation:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Admin operations
  const fetchAllReclamationsAdmin = async (filters: ReclamationFilter = {}) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await reclamationsService.getAllReclamationsAdmin(filters)
      reclamations.value = response.data
      totalCount.value = response.total_number
      currentPage.value = response.page
      totalPages.value = Math.ceil(response.total_number / (filters.limit || 10))
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des réclamations'
      console.error('Error fetching admin reclamations:', err)
    } finally {
      isLoading.value = false
    }
  }

  const updateReclamationStatus = async (reclamationId: number, data: ReclamationAdminUpdateInput) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await reclamationsService.updateReclamationStatus(reclamationId, data)
      const index = reclamations.value.findIndex(r => r.id === reclamationId)
      if (index !== -1) {
        reclamations.value[index] = response.data
      }
      if (currentReclamation.value?.id === reclamationId) {
        currentReclamation.value = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour du statut'
      console.error('Error updating reclamation status:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // User operations
  const fetchMyReclamations = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await reclamationsService.getMyReclamations()
      reclamations.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement de vos réclamations'
      console.error('Error fetching my reclamations:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchMyReclamation = async (reclamationId: number) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await reclamationsService.getMyReclamation(reclamationId)
      currentReclamation.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement de votre réclamation'
      console.error('Error fetching my reclamation:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Reclamation types
  const fetchReclamationTypes = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await reclamationsService.getReclamationTypes()
      reclamationTypes.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des types de réclamation'
      console.error('Error fetching reclamation types:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchActiveReclamationTypes = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await reclamationsService.getActiveReclamationTypes()
      reclamationTypes.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des types actifs'
      console.error('Error fetching active reclamation types:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Clear error
  const clearError = () => {
    error.value = null
  }

  // Reset state
  const resetState = () => {
    reclamations.value = []
    currentReclamation.value = null
    reclamationTypes.value = []
    isLoading.value = false
    error.value = null
    totalCount.value = 0
    currentPage.value = 1
    totalPages.value = 0
  }

  return {
    // State
    reclamations,
    currentReclamation,
    reclamationTypes,
    isLoading,
    error,
    totalCount,
    currentPage,
    totalPages,
    
    // Getters
    getReclamationById,
    getReclamationsByStatus,
    getReclamationsByPriority,
    getReclamationTypeById,
    
    // Actions
    fetchReclamations,
    fetchReclamation,
    createReclamation,
    updateReclamation,
    deleteReclamation,
    fetchAllReclamationsAdmin,
    updateReclamationStatus,
    fetchMyReclamations,
    fetchMyReclamation,
    fetchReclamationTypes,
    fetchActiveReclamationTypes,
    clearError,
    resetState,
  }
})
