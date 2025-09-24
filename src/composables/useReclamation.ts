import { ref, computed } from 'vue'
import { reclamationService } from '@/services/api/reclamation'
import { showToast } from '@/components/toast/toastManager'
import type {
  Reclamation,
  ReclamationFullOut,
  ReclamationCreateInput,
  ReclamationUpdateStatusInput,
  ReclamationFilter,
  ReclamationType,
  ReclamationTypeCreateInput,
  ReclamationTypeUpdateInput
} from '@/types/reclamation'
import { ReclamationStatusEnum, ReclamationPriorityEnum } from '@/types/reclamation'

// State
const reclamations = ref<Reclamation[]>([])
const reclamationTypes = ref<ReclamationType[]>([])
const currentReclamation = ref<ReclamationFullOut | null>(null)
const isLoading = ref(false)
const error = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const totalCount = ref(0)
const searchQuery = ref('')
const filters = ref<Partial<ReclamationFilter>>({})

// Computed properties
const filteredReclamations = computed(() => {
  if (!searchQuery.value && !Object.keys(filters.value).length) {
    return reclamations.value
  }

  return reclamations.value.filter(reclamation => {
    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const matchesSearch = 
        reclamation.reclamation_number.toLowerCase().includes(query) ||
        reclamation.application_number.toLowerCase().includes(query) ||
        reclamation.subject.toLowerCase().includes(query) ||
        reclamation.description.toLowerCase().includes(query)
      
      if (!matchesSearch) return false
    }

    // Status filter
    if (filters.value.status && reclamation.status !== filters.value.status) {
      return false
    }

    // Priority filter
    if (filters.value.priority && reclamation.priority !== filters.value.priority) {
      return false
    }

    // Type filter
    if (filters.value.reclamation_type && reclamation.reclamation_type !== filters.value.reclamation_type) {
      return false
    }

    // Application number filter
    if (filters.value.application_number && !reclamation.application_number.includes(filters.value.application_number)) {
      return false
    }

    return true
  })
})

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value))

const hasNextPage = computed(() => currentPage.value < totalPages.value)

const hasPreviousPage = computed(() => currentPage.value > 1)

// Status and priority configurations
const statusConfig = computed(() => ({
  [ReclamationStatusEnum.NEW]: {
    text: 'Nouvelle',
    color: 'info',
    icon: 'ri-add-circle-line'
  },
  [ReclamationStatusEnum.IN_PROGRESS]: {
    text: 'En cours',
    color: 'warning',
    icon: 'ri-time-line'
  },
  [ReclamationStatusEnum.CLOSED]: {
    text: 'Fermée',
    color: 'success',
    icon: 'ri-check-circle-line'
  }
}))

const priorityConfig = computed(() => ({
  [ReclamationPriorityEnum.LOW]: {
    text: 'Faible',
    color: 'success',
    icon: 'ri-arrow-down-line'
  },
  [ReclamationPriorityEnum.MEDIUM]: {
    text: 'Moyenne',
    color: 'warning',
    icon: 'ri-arrow-right-line'
  },
  [ReclamationPriorityEnum.HIGH]: {
    text: 'Élevée',
    color: 'error',
    icon: 'ri-arrow-up-line'
  }
}))

// Methods
const loadReclamations = async (reset = false) => {
  try {
    isLoading.value = true
    error.value = ''

    if (reset) {
      currentPage.value = 1
      reclamations.value = []
    }

    const params: ReclamationFilter = {
      page: currentPage.value,
      page_size: pageSize.value,
      ...filters.value
    }

    console.log('🔍 Chargement des réclamations avec params:', params)
    const response = await reclamationService.getReclamations(params)
    console.log('📋 Réponse API réclamations:', response)
    
    reclamations.value = reset ? response.data : [...reclamations.value, ...response.data]
    totalCount.value = response.total_number

  } catch (err: any) {
    console.error('Erreur lors du chargement des réclamations:', err)
    error.value = 'Erreur lors du chargement des réclamations'
    showToast({ message: 'Erreur lors du chargement des réclamations', type: 'error' })
  } finally {
    isLoading.value = false
  }
}

const loadMyReclamations = async (reset = false) => {
  try {
    isLoading.value = true
    error.value = ''

    if (reset) {
      currentPage.value = 1
      reclamations.value = []
    }

    const params: ReclamationFilter = {
      page: currentPage.value,
      page_size: pageSize.value,
      ...filters.value
    }

    console.log('🔍 Chargement de mes réclamations avec params:', params)
    const response = await reclamationService.getMyReclamations(params)
    console.log('📋 Réponse API mes réclamations:', response)
    
    reclamations.value = reset ? response.data : [...reclamations.value, ...response.data]
    totalCount.value = response.total_number

  } catch (err: any) {
    console.error('Erreur lors du chargement de mes réclamations:', err)
    error.value = 'Erreur lors du chargement de mes réclamations'
    showToast({ message: 'Erreur lors du chargement de mes réclamations', type: 'error' })
  } finally {
    isLoading.value = false
  }
}

const loadReclamationTypes = async () => {
  try {
    const response = await reclamationService.getActiveReclamationTypes()
    reclamationTypes.value = response.data
  } catch (err: any) {
    console.error('Erreur lors du chargement des types de réclamation:', err)
    showToast({ message: 'Erreur lors du chargement des types de réclamation', type: 'error' })
  }
}

const createReclamation = async (data: ReclamationCreateInput) => {
  try {
    isLoading.value = true
    const response = await reclamationService.createMyReclamation(data)
    
    return response.data
  } catch (err: any) {
    console.error('Erreur lors de la création de la réclamation:', err)
    throw err
  } finally {
    isLoading.value = false
  }
}

const getReclamation = async (id: number) => {
  try {
    isLoading.value = true
    const response = await reclamationService.getReclamation(id)
    currentReclamation.value = response.data
    return response.data
  } catch (err: any) {
    console.error('Erreur lors du chargement de la réclamation:', err)
    showToast({ message: 'Erreur lors du chargement de la réclamation', type: 'error' })
    throw err
  } finally {
    isLoading.value = false
  }
}

const updateReclamationStatus = async (id: number, status: ReclamationStatusEnum) => {
  try {
    console.log('🔄 Mise à jour du statut de la réclamation:', { id, status })
    isLoading.value = true
    
    const response = await reclamationService.updateReclamationStatus(id, { status })
    console.log('✅ Réponse de mise à jour du statut:', response)
    
    showToast({
      message: 'Statut de la réclamation mis à jour avec succès',
      type: 'success'
    })
    
    // Recharger la liste appropriée selon le contexte
    console.log('🔄 Rechargement de la liste des réclamations...')
    await loadReclamations(true)
    console.log('✅ Liste des réclamations rechargée')
    
    return response.data
  } catch (err: any) {
    console.error('❌ Erreur lors de la mise à jour du statut:', err)
    console.error('❌ Détails de l\'erreur:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    })
    const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour du statut'
    showToast({ message: errorMessage, type: 'error' })
    throw err
  } finally {
    isLoading.value = false
  }
}

  const updateReclamation = async (id: number, data: ReclamationCreateInput) => {
    try {
      isLoading.value = true
      const response = await reclamationService.updateReclamation(id, data)
      
      showToast({
        message: 'Réclamation mise à jour avec succès',
        type: 'success'
      })
      
      // Recharger la liste
      await loadMyReclamations(true)
      
      return response.data
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour de la réclamation:', err)
      const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour de la réclamation'
      showToast({ message: errorMessage, type: 'error' })
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteReclamation = async (id: number) => {
    try {
      isLoading.value = true
      const response = await reclamationService.deleteReclamation(id)
      
      showToast({
        message: 'Réclamation supprimée avec succès',
        type: 'success'
      })
      
      // Recharger la liste
      await loadMyReclamations(true)
      
      return response.data
    } catch (err: any) {
      console.error('Erreur lors de la suppression de la réclamation:', err)
      const errorMessage = err.response?.data?.message || 'Erreur lors de la suppression de la réclamation'
      showToast({ message: errorMessage, type: 'error' })
      throw err
    } finally {
      isLoading.value = false
    }
  }


const searchReclamations = async (query: string) => {
  searchQuery.value = query
  await loadReclamations(true)
}

const applyFilters = async (newFilters: Partial<ReclamationFilter>) => {
  filters.value = { ...filters.value, ...newFilters }
  await loadReclamations(true)
}

const clearFilters = async () => {
  filters.value = {}
  searchQuery.value = ''
  await loadReclamations(true)
}

const loadNextPage = async () => {
  if (hasNextPage.value) {
    currentPage.value++
    await loadReclamations()
  }
}

const loadPreviousPage = async () => {
  if (hasPreviousPage.value) {
    currentPage.value--
    await loadReclamations()
  }
}

const getStatusConfig = (status: ReclamationStatusEnum) => {
  return statusConfig.value[status] || statusConfig.value[ReclamationStatusEnum.NEW]
}

const getPriorityConfig = (priority: ReclamationPriorityEnum) => {
  return priorityConfig.value[priority] || priorityConfig.value[ReclamationPriorityEnum.LOW]
}

// Reclamation types management
const createReclamationType = async (data: ReclamationTypeCreateInput) => {
  try {
    const response = await reclamationService.createReclamationType(data)
    
    showToast({
      message: 'Type de réclamation créé avec succès',
      type: 'success'
    })
    
    // Recharger les types
    await loadReclamationTypes()
    
    return response.data
  } catch (err: any) {
    console.error('Erreur lors de la création du type de réclamation:', err)
    const errorMessage = err.response?.data?.message || 'Erreur lors de la création du type de réclamation'
    showToast({ message: errorMessage, type: 'error' })
    throw err
  }
}

const updateReclamationType = async (id: number, data: ReclamationTypeUpdateInput) => {
  try {
    const response = await reclamationService.updateReclamationType(id, data)
    
    showToast({
      message: 'Type de réclamation mis à jour avec succès',
      type: 'success'
    })
    
    // Recharger les types
    await loadReclamationTypes()
    
    return response.data
  } catch (err: any) {
    console.error('Erreur lors de la mise à jour du type de réclamation:', err)
    const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour du type de réclamation'
    showToast({ message: errorMessage, type: 'error' })
    throw err
  }
}

const getReclamationType = async (id: number) => {
  try {
    isLoading.value = true
    const response = await reclamationService.getReclamationType(id)
    return response.data
  } catch (err: any) {
    console.error('Erreur lors du chargement du type de réclamation:', err)
    showToast({ message: 'Erreur lors du chargement du type de réclamation', type: 'error' })
    throw err
  } finally {
    isLoading.value = false
  }
}

const deleteReclamationType = async (id: number) => {
  try {
    await reclamationService.deleteReclamationType(id)
    
    // Recharger les types
    await loadReclamationTypes()
  } catch (err: any) {
    console.error('Erreur lors de la suppression du type de réclamation:', err)
    throw err
  }
}

export function useReclamation() {
  return {
    // State
    reclamations,
    reclamationTypes,
    currentReclamation,
    isLoading,
    error,
    currentPage,
    pageSize,
    totalCount,
    searchQuery,
    filters,
    
    // Computed
    filteredReclamations,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    statusConfig,
    priorityConfig,
    
    // Methods
    loadReclamations,
    loadMyReclamations,
    loadReclamationTypes,
    createReclamation,
    getReclamation,
    updateReclamationStatus,
    updateReclamation,
    deleteReclamation,
    searchReclamations,
    applyFilters,
    clearFilters,
    loadNextPage,
    loadPreviousPage,
    getStatusConfig,
    getPriorityConfig,
    getReclamationType,
    createReclamationType,
    updateReclamationType,
    deleteReclamationType
  }
}
