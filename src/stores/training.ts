// Store Pinia pour les formations et spécialités
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { trainingService } from '@/services/api/training'
import type {
  Training,
  TrainingSession,
  Specialty,
  TrainingCreateInput,
  TrainingUpdateInput,
  TrainingSessionCreateInput,
  TrainingSessionUpdateInput,
  SpecialtyCreateInput,
  SpecialtyUpdateInput,
  TrainingFilter,
  SessionFilter,
  SpecialtyFilter,
  TrainingOutSuccess,
  TrainingListOutSuccess,
  TrainingSessionOutSuccess,
  TrainingSessionListOutSuccess,
  SpecialtyOutSuccess,
  SpecialtyListOutSuccess,
} from '@/types/training'

export const useTrainingStore = defineStore('training', () => {
  // === STATE ===
  
  // Formations
  const trainings = ref<Training[]>([])
  const currentTraining = ref<Training | null>(null)
  const trainingFilters = ref<TrainingFilter>({})
  
  // Sessions de formation
  const sessions = ref<TrainingSession[]>([])
  const currentSession = ref<TrainingSession | null>(null)
  const sessionFilters = ref<SessionFilter>({})
  
  // Spécialités
  const specialties = ref<Specialty[]>([])
  const currentSpecialty = ref<Specialty | null>(null)
  const specialtyFilters = ref<SpecialtyFilter>({})
  
  // État général
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalCount = ref(0)

  // === GETTERS ===
  
  const hasTrainings = computed(() => trainings.value.length > 0)
  const hasSessions = computed(() => sessions.value.length > 0)
  const hasSpecialties = computed(() => specialties.value.length > 0)
  
  const activeTrainings = computed(() => 
    trainings.value.filter(t => t.status === 'ACTIVE')
  )
  
  const activeSessions = computed(() => 
    sessions.value.filter(s => s.status === 'OPEN_FOR_REGISTRATION')
  )
  
  const upcomingSessions = computed(() => 
    sessions.value.filter(s => new Date(s.start_date) > new Date())
  )

  // === ACTIONS FORMATIONS ===
  
  const loadTrainings = async (filters?: TrainingFilter) => {
    try {
      isLoading.value = true
      error.value = null
      
      if (filters) {
        trainingFilters.value = filters
      }
      
      const response = await trainingService.getTrainings(trainingFilters.value)
      trainings.value = response.data || []
      totalCount.value = response.total || 0
      totalPages.value = response.total_pages || 1
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des formations'
      console.error('Error loading trainings:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  const getTraining = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await trainingService.getTraining(id)
      currentTraining.value = response.data
      return response
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement de la formation'
      console.error('Error loading training:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const createTraining = async (data: TrainingCreateInput) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await trainingService.createTraining(data)
      await loadTrainings() // Recharger la liste
      return response
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la création de la formation'
      console.error('Error creating training:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const updateTraining = async (id: string, data: TrainingUpdateInput) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await trainingService.updateTraining(id, data)
      await loadTrainings() // Recharger la liste
      return response
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour de la formation'
      console.error('Error updating training:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const deleteTraining = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await trainingService.deleteTraining(id)
      await loadTrainings() // Recharger la liste
      return response
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la suppression de la formation'
      console.error('Error deleting training:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // === ACTIONS SESSIONS ===
  
  const loadSessions = async (filters?: SessionFilter) => {
    try {
      isLoading.value = true
      error.value = null
      
      if (filters) {
        sessionFilters.value = filters
      }
      
      const response = await trainingService.getSessions(sessionFilters.value)
      sessions.value = response.data || []
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des sessions'
      console.error('Error loading sessions:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  const getSession = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await trainingService.getSession(id)
      currentSession.value = response.data
      return response
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement de la session'
      console.error('Error loading session:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const createSession = async (data: TrainingSessionCreateInput) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await trainingService.createSession(data)
      await loadSessions() // Recharger la liste
      return response
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la création de la session'
      console.error('Error creating session:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const updateSession = async (id: string, data: TrainingSessionUpdateInput) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await trainingService.updateSession(id, data)
      await loadSessions() // Recharger la liste
      return response
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour de la session'
      console.error('Error updating session:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const deleteSession = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await trainingService.deleteSession(id)
      await loadSessions() // Recharger la liste
      return response
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la suppression de la session'
      console.error('Error deleting session:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // === ACTIONS SPÉCIALITÉS ===
  
  const loadSpecialties = async (filters?: SpecialtyFilter) => {
    try {
      isLoading.value = true
      error.value = null
      
      if (filters) {
        specialtyFilters.value = filters
      }
      
      const response = await trainingService.getSpecialties(specialtyFilters.value)
      specialties.value = response.data || []
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des spécialités'
      console.error('Error loading specialties:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  const getSpecialty = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await trainingService.getSpecialty(id)
      currentSpecialty.value = response.data
      return response
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement de la spécialité'
      console.error('Error loading specialty:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const createSpecialty = async (data: SpecialtyCreateInput) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await trainingService.createSpecialty(data)
      await loadSpecialties() // Recharger la liste
      return response
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la création de la spécialité'
      console.error('Error creating specialty:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const updateSpecialty = async (id: number, data: SpecialtyUpdateInput) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await trainingService.updateSpecialty(id, data)
      await loadSpecialties() // Recharger la liste
      return response
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour de la spécialité'
      console.error('Error updating specialty:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const deleteSpecialty = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await trainingService.deleteSpecialty(id)
      await loadSpecialties() // Recharger la liste
      return response
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la suppression de la spécialité'
      console.error('Error deleting specialty:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // === ACTIONS UTILITAIRES ===
  
  const clearError = () => {
    error.value = null
  }
  
  const resetState = () => {
    trainings.value = []
    sessions.value = []
    specialties.value = []
    currentTraining.value = null
    currentSession.value = null
    currentSpecialty.value = null
    isLoading.value = false
    error.value = null
    currentPage.value = 1
    totalPages.value = 1
    totalCount.value = 0
  }

  return {
    // State
    trainings,
    sessions,
    specialties,
    currentTraining,
    currentSession,
    currentSpecialty,
    trainingFilters,
    sessionFilters,
    specialtyFilters,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalCount,

    // Getters
    hasTrainings,
    hasSessions,
    hasSpecialties,
    activeTrainings,
    activeSessions,
    upcomingSessions,

    // Actions Formations
    loadTrainings,
    getTraining,
    createTraining,
    updateTraining,
    deleteTraining,

    // Actions Sessions
    loadSessions,
    getSession,
    createSession,
    updateSession,
    deleteSession,

    // Actions Spécialités
    loadSpecialties,
    getSpecialty,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,

    // Actions Utilitaires
    clearError,
    resetState,
  }
})
