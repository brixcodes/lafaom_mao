import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { studentApplicationService } from '@/services/api/studentApplications'
import type {
  StudentApplication,
  StudentApplicationCreateInput,
  StudentApplicationUpdateInput,
  ChangeStudentApplicationStatusInput,
  StudentApplicationFilter,
} from '@/types/studentApplications'
import { ApplicationStatusEnum } from '@/types/enums'

export const useStudentApplicationStore = defineStore('studentApplications', () => {
  // ===========================================
  // STATE
  // ===========================================

  const studentApplications = ref<StudentApplication[]>([])
  const currentStudentApplication = ref<StudentApplication | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const totalCount = ref(0)
  const currentPage = ref(1)
  const totalPages = ref(0)

  // ===========================================
  // GETTERS
  // ===========================================

  const getStudentApplicationById = computed(() => {
    return (id: number) => studentApplications.value.find(sa => sa.id === id)
  })

  const getStudentApplicationsByStatus = computed(() => {
    return (status: ApplicationStatusEnum) => 
      studentApplications.value.filter(sa => sa.status === status)
  })

  const getStudentApplicationsByTraining = computed(() => {
    return (trainingId: string) => 
      studentApplications.value.filter(sa => sa.training_id === trainingId)
  })

  const getStudentApplicationsBySession = computed(() => {
    return (sessionId: string) => 
      studentApplications.value.filter(sa => sa.target_session_id === sessionId)
  })

  const getStudentApplicationsByUser = computed(() => {
    return (userId: string) => 
      studentApplications.value.filter(sa => sa.user_id === userId)
  })

  // ===========================================
  // ACTIONS
  // ===========================================

  // Fetch student applications with filters
  const fetchStudentApplications = async (filters: StudentApplicationFilter = {}) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await studentApplicationService.getStudentApplications(filters)
      studentApplications.value = response.data
      totalCount.value = response.total_number
      currentPage.value = response.page
      totalPages.value = Math.ceil(response.total_number / (filters.limit || 10))
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des candidatures'
      console.error('Error fetching student applications:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Fetch single student application
  const fetchStudentApplication = async (applicationId: number) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await studentApplicationService.getStudentApplicationById(applicationId)
      currentStudentApplication.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement de la candidature'
      console.error('Error fetching student application:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Create student application
  const createStudentApplication = async (data: StudentApplicationCreateInput) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await studentApplicationService.createStudentApplication(data)
      studentApplications.value.unshift(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la création de la candidature'
      console.error('Error creating student application:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Update student application
  const updateStudentApplication = async (applicationId: number, data: StudentApplicationUpdateInput) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await studentApplicationService.updateStudentApplication(applicationId, data)
      const index = studentApplications.value.findIndex(sa => sa.id === applicationId)
      if (index !== -1) {
        studentApplications.value[index] = response.data
      }
      if (currentStudentApplication.value?.id === applicationId) {
        currentStudentApplication.value = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour de la candidature'
      console.error('Error updating student application:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Delete student application
  const deleteStudentApplication = async (applicationId: number) => {
    isLoading.value = true
    error.value = null
    
    try {
      await studentApplicationService.deleteStudentApplication(applicationId)
      studentApplications.value = studentApplications.value.filter(sa => sa.id !== applicationId)
      if (currentStudentApplication.value?.id === applicationId) {
        currentStudentApplication.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la suppression de la candidature'
      console.error('Error deleting student application:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Admin operations
  const fetchAllStudentApplicationsAdmin = async (filters: StudentApplicationFilter = {}) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await studentApplicationService.getAllStudentApplicationsAdmin(filters)
      studentApplications.value = response.data
      totalCount.value = response.total_number
      currentPage.value = response.page
      totalPages.value = Math.ceil(response.total_number / (filters.limit || 10))
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des candidatures'
      console.error('Error fetching admin student applications:', err)
    } finally {
      isLoading.value = false
    }
  }

  const changeStudentApplicationStatus = async (applicationId: number, data: ChangeStudentApplicationStatusInput) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await studentApplicationService.changeStudentApplicationStatus(applicationId, data)
      const index = studentApplications.value.findIndex(sa => sa.id === applicationId)
      if (index !== -1) {
        studentApplications.value[index] = response.data
      }
      if (currentStudentApplication.value?.id === applicationId) {
        currentStudentApplication.value = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour du statut'
      console.error('Error changing student application status:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // User operations
  const fetchMyStudentApplications = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await studentApplicationService.getMyStudentApplications()
      studentApplications.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement de vos candidatures'
      console.error('Error fetching my student applications:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchMyStudentApplication = async (applicationId: number) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await studentApplicationService.getMyStudentApplication(applicationId)
      currentStudentApplication.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement de votre candidature'
      console.error('Error fetching my student application:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Training session operations
  const fetchStudentApplicationsBySession = async (sessionId: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await studentApplicationService.getStudentApplicationsBySession(sessionId)
      studentApplications.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des candidatures de la session'
      console.error('Error fetching student applications by session:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchStudentApplicationsByTraining = async (trainingId: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await studentApplicationService.getStudentApplicationsByTraining(trainingId)
      studentApplications.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des candidatures de la formation'
      console.error('Error fetching student applications by training:', err)
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
    studentApplications.value = []
    currentStudentApplication.value = null
    isLoading.value = false
    error.value = null
    totalCount.value = 0
    currentPage.value = 1
    totalPages.value = 0
  }

  return {
    // State
    studentApplications,
    currentStudentApplication,
    isLoading,
    error,
    totalCount,
    currentPage,
    totalPages,
    
    // Getters
    getStudentApplicationById,
    getStudentApplicationsByStatus,
    getStudentApplicationsByTraining,
    getStudentApplicationsBySession,
    getStudentApplicationsByUser,
    
    // Actions
    fetchStudentApplications,
    fetchStudentApplication,
    createStudentApplication,
    updateStudentApplication,
    deleteStudentApplication,
    fetchAllStudentApplicationsAdmin,
    changeStudentApplicationStatus,
    fetchMyStudentApplications,
    fetchMyStudentApplication,
    fetchStudentApplicationsBySession,
    fetchStudentApplicationsByTraining,
    clearError,
    resetState,
  }
})
