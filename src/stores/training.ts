import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { type Training, type TrainingSession, type StudentApplication, type TrainingCreateInput, type TrainingUpdateInput, type TrainingSessionCreateInput, type TrainingSessionUpdateInput, type StudentApplicationCreateInput, type StudentApplicationUpdateInput, type TrainingFilter, type SessionFilter, type ApplicationFilter, type TrainingOutSuccess, type TrainingListOutSuccess, type TrainingSessionOutSuccess, type TrainingSessionListOutSuccess, type StudentApplicationOutSuccess, type StudentApplicationListOutSuccess } from '@/types/training'
import * as trainingService from '@/services/training'

export const useTrainingStore = defineStore('training', () => {
  // === STATE ===
  const trainings = ref<Training[]>([])
  const currentTraining = ref<Training | null>(null)
  const trainingSessions = ref<TrainingSession[]>([])
  const currentSession = ref<TrainingSession | null>(null)
  const applications = ref<StudentApplication[]>([])
  const currentApplication = ref<StudentApplication | null>(null)
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Pagination
  const trainingsPagination = ref({
    page: 1,
    pageSize: 20,
    total: 0
  })
  
  const sessionsPagination = ref({
    page: 1,
    pageSize: 20,
    total: 0
  })
  
  const applicationsPagination = ref({
    page: 1,
    pageSize: 20,
    total: 0
  })

  // === GETTERS ===
  const hasTrainings = computed(() => trainings.value.length > 0)
  const hasSessions = computed(() => trainingSessions.value.length > 0)
  const hasApplications = computed(() => applications.value.length > 0)
  
  const activeTrainings = computed(() => {
    return trainings.value.filter(training => training.status === 'ACTIVE')
  })
  
  const openSessions = computed(() => {
    return trainingSessions.value.filter(session => 
      session.status === 'OPEN_FOR_REGISTRATION'
    )
  })
  
  const applicationStats = computed(() => {
    return {
      total: applications.value.length,
      received: applications.value.filter(app => app.status === 'RECEIVED').length,
      approved: applications.value.filter(app => app.status === 'APPROVED').length,
      refused: applications.value.filter(app => app.status === 'REFUSED').length
    }
  })

  // === ACTIONS ===
  
  // Training Actions
  const fetchTrainings = async (filter?: TrainingFilter) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await trainingService.getTrainings(filter)
      trainings.value = response.data
      trainingsPagination.value.total = response.total
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Error fetching trainings'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getTrainingById = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await trainingService.getTraining(id)
      currentTraining.value = response.data
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Error fetching training'
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
      trainings.value.unshift(response.data)
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Error creating training'
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
      
      // Update in list if present
      const index = trainings.value.findIndex(t => t.id === id)
      if (index !== -1) {
        trainings.value[index] = response.data
      }
      
      // Update current if it's the same
      if (currentTraining.value?.id === id) {
        currentTraining.value = response.data
      }
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Error updating training'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteTraining = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      await trainingService.deleteTraining(id)
      trainings.value = trainings.value.filter(t => t.id !== id)
      
      if (currentTraining.value?.id === id) {
        currentTraining.value = null
      }
      
    } catch (err: any) {
      error.value = err.message || 'Error deleting training'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Session Actions
  const fetchSessions = async (filter?: SessionFilter) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await trainingService.getSessions(filter)
      trainingSessions.value = response.data
      sessionsPagination.value.total = response.total
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Error fetching sessions'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getSessionById = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await trainingService.getSession(id)
      currentSession.value = response.data
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Error fetching session'
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
      trainingSessions.value.unshift(response.data)
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Error creating session'
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
      
      const index = trainingSessions.value.findIndex(s => s.id === id)
      if (index !== -1) {
        trainingSessions.value[index] = response.data
      }
      
      if (currentSession.value?.id === id) {
        currentSession.value = response.data
      }
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Error updating session'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteSession = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      await trainingService.deleteSession(id)
      trainingSessions.value = trainingSessions.value.filter(s => s.id !== id)
      
      if (currentSession.value?.id === id) {
        currentSession.value = null
      }
      
    } catch (err: any) {
      error.value = err.message || 'Error deleting session'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Application Actions
  const fetchApplications = async (filter?: ApplicationFilter) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await trainingService.getApplications(filter)
      applications.value = response.data
      applicationsPagination.value.total = response.total
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Error fetching applications'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getApplicationById = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await trainingService.getApplication(id)
      currentApplication.value = response.data
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Error fetching application'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createApplication = async (data: StudentApplicationCreateInput) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await trainingService.createApplication(data)
      applications.value.unshift(response.data)
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Error creating application'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateApplication = async (id: number, data: StudentApplicationUpdateInput) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await trainingService.updateApplication(id, data)
      
      const index = applications.value.findIndex(a => a.id === id)
      if (index !== -1) {
        applications.value[index] = response.data
      }
      
      if (currentApplication.value?.id === id) {
        currentApplication.value = response.data
      }
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Error updating application'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteApplication = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null
      
      await trainingService.deleteApplication(id)
      applications.value = applications.value.filter(a => a.id !== id)
      
      if (currentApplication.value?.id === id) {
        currentApplication.value = null
      }
      
    } catch (err: any) {
      error.value = err.message || 'Error deleting application'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Utility Actions
  const searchTrainings = async (query: string, filters?: Partial<TrainingFilter>) => {
    return await fetchTrainings({
      search: query,
      ...filters,
      page: filters?.page || 1,
      page_size: filters?.page_size || 20
    })
  }

  const clearError = () => {
    error.value = null
  }

  const clearData = () => {
    trainings.value = []
    currentTraining.value = null
    trainingSessions.value = []
    currentSession.value = null
    applications.value = []
    currentApplication.value = null
    error.value = null
    
    trainingsPagination.value = { page: 1, pageSize: 20, total: 0 }
    sessionsPagination.value = { page: 1, pageSize: 20, total: 0 }
    applicationsPagination.value = { page: 1, pageSize: 20, total: 0 }
  }

  return {
    // State
    trainings,
    currentTraining,
    trainingSessions,
    currentSession,
    applications,
    currentApplication,
    isLoading,
    error,
    trainingsPagination,
    sessionsPagination,
    applicationsPagination,
    
    // Getters
    hasTrainings,
    hasSessions,
    hasApplications,
    activeTrainings,
    openSessions,
    applicationStats,
    
    // Training Actions
    fetchTrainings,
    getTrainingById,
    createTraining,
    updateTraining,
    deleteTraining,
    searchTrainings,
    
    // Session Actions
    fetchSessions,
    getSessionById,
    createSession,
    updateSession,
    deleteSession,
    
    // Application Actions
    fetchApplications,
    getApplicationById,
    createApplication,
    updateApplication,
    deleteApplication,
    
    // Utility Actions
    clearError,
    clearData,
  }
})
