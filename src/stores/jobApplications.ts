// Store Pinia pour les candidatures (Job Applications)
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { jobApplicationsService } from '@/services/api/jobApplications'
import type {
  JobApplicationOut,
  JobApplicationCreateInput,
  JobApplicationUpdateByCandidateInput,
  JobApplicationOTPRequestInput,
  JobApplicationOutSuccess,
  JobApplicationsPageOutSuccess,
  JobApplicationFilter,
  UpdateJobApplicationStatusInput,
  JobAttachmentOut,
  JobAttachmentListOutSuccess,
  JobApplicationStats,
  JobApplicationStatus,
} from '@/types/jobApplications'
import type { BaseOutSuccess } from '@/types'

export const useJobApplicationsStore = defineStore('jobApplications', () => {
  // === STATE ===
  const jobApplications = ref<JobApplicationOut[]>([])
  const currentJobApplication = ref<JobApplicationOut | null>(null)
  const applicationAttachments = ref<JobAttachmentOut[]>([])
  const applicationsStats = ref<JobApplicationStats | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Pagination
  const applicationsPagination = ref({
    page: 1,
    pageSize: 20,
    total: 0,
  })

  // === GETTERS ===
  const hasApplications = computed(() => jobApplications.value.length > 0)
  const hasAttachments = computed(() => applicationAttachments.value.length > 0)
  const hasStatsData = computed(() => !!applicationsStats.value)
  
  // Statistiques calculées (provenant du backend)
  const applicationStats = computed(() => {
    if (applicationsStats.value) {
      return {
        total: applicationsStats.value.total_applications,
        pending: applicationsStats.value.pending_applications,
        accepted: applicationsStats.value.accepted_applications,
        rejected: applicationsStats.value.rejected_applications,
        processing: applicationsStats.value.processing_applications,
        cancelled: applicationsStats.value.cancelled_applications,
      }
    }
    
    return { total: 0, pending: 0, accepted: 0, rejected: 0, processing: 0, cancelled: 0 }
  })
  
  const acceptanceRate = computed(() => applicationsStats.value?.acceptance_rate || 0)
  const conversionRate = computed(() => applicationsStats.value?.conversion_rate || 0)
  const averageTimeToHire = computed(() => applicationsStats.value?.average_time_to_hire || 0)

  // === ACTIONS ===
  
  /**
   * Récupérer les candidatures avec filtres
   */
  const fetchJobApplications = async (filter?: JobApplicationFilter) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response: JobApplicationsPageOutSuccess = await jobApplicationsService.getJobApplications(filter)
      jobApplications.value = response.data
      applicationsPagination.value = {
        page: response.page,
        pageSize: response.number,
        total: response.total_number,
      }
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des candidatures'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Récupérer une candidature par ID
   */
  const getJobApplicationById = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response: JobApplicationOutSuccess = await jobApplicationsService.getJobApplicationById(id)
      currentJobApplication.value = response.data
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement de la candidature'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Créer une nouvelle candidature
   */
  const createJobApplication = async (applicationData: JobApplicationCreateInput) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response: JobApplicationOutSuccess = await jobApplicationsService.createJobApplication(applicationData)
      jobApplications.value.unshift(response.data)
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la création de la candidature'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Mettre à jour le statut d'une candidature (admin)
   */
  const updateApplicationStatus = async (data: UpdateJobApplicationStatusInput) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response: JobApplicationOutSuccess = await jobApplicationsService.updateJobApplicationStatus(data)
      const index = jobApplications.value.findIndex(app => app.id === data.application_id)
      if (index !== -1) {
        jobApplications.value[index] = response.data
      }
      
      if (currentJobApplication.value && currentJobApplication.value.id === data.application_id) {
        currentJobApplication.value = response.data
      }
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la mise à jour du statut'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Demander un code OTP pour mettre à jour une candidature
   */
  const requestApplicationOTP = async (data: JobApplicationOTPRequestInput) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response: BaseOutSuccess = await jobApplicationsService.requestApplicationOTP(data)
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la demande du code OTP'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Mettre à jour une candidature avec OTP (candidat)
   */
  const updateApplicationByCandidate = async (data: JobApplicationUpdateByCandidateInput) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response: JobApplicationOutSuccess = await jobApplicationsService.updateApplicationByCandidate(data)
      
      // Mettre à jour dans la liste si elle est chargée
      const index = jobApplications.value.findIndex(app => app.application_number === data.application_number)
      if (index !== -1) {
        jobApplications.value[index] = response.data
      }
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la mise à jour de la candidature'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Récupérer les pièces jointes d'une candidature
   */
  const fetchApplicationAttachments = async (applicationId: number) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response: JobAttachmentListOutSuccess = await jobApplicationsService.getApplicationAttachments(applicationId)
      applicationAttachments.value = response.data
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des pièces jointes'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Supprimer une candidature (admin)
   */
  const deleteJobApplication = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null
      
      await jobApplicationsService.deleteJobApplication(id)
      jobApplications.value = jobApplications.value.filter(app => app.id !== id)
      
      if (currentJobApplication.value && currentJobApplication.value.id === id) {
        currentJobApplication.value = null
      }
      
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la suppression de la candidature'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Rechercher des candidatures
   */
  const searchJobApplications = async (query: string, filters?: Partial<JobApplicationFilter>) => {
    return await fetchJobApplications({
      search: query,
      ...filters,
      page: filters?.page || 1,
      page_size: filters?.page_size || 20
    })
  }

  /**
   * Récupérer les statistiques des candidatures
   */
  const fetchApplicationsStats = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await jobApplicationsService.getApplicationsStats()
      applicationsStats.value = response.data
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des statistiques'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Télécharger une pièce jointe
   */
  const downloadAttachment = async (attachmentId: number, filename: string) => {
    try {
      await jobApplicationsService.downloadAttachment(attachmentId, filename)
    } catch (err: any) {
      error.value = 'Erreur lors du téléchargement du fichier'
      throw err
    }
  }

  /**
   * Nettoyer les erreurs
   */
  const clearError = () => {
    error.value = null
  }

  /**
   * Nettoyer toutes les données
   */
  const clearData = () => {
    jobApplications.value = []
    currentJobApplication.value = null
    applicationAttachments.value = []
    applicationsStats.value = null
    error.value = null
    applicationsPagination.value = { page: 1, pageSize: 20, total: 0 }
  }

  /**
   * Nettoyer les données de candidatures
   */
  const clearApplications = () => {
    jobApplications.value = []
    currentJobApplication.value = null
    applicationAttachments.value = []
    applicationsPagination.value = { page: 1, pageSize: 20, total: 0 }
  }

  return {
    // State
    jobApplications,
    currentJobApplication,
    applicationAttachments,
    applicationsStats,
    isLoading,
    error,
    applicationsPagination,
    
    // Getters
    hasApplications,
    hasAttachments,
    hasStatsData,
    applicationStats,
    acceptanceRate,
    conversionRate,
    averageTimeToHire,
    
    // Actions
    fetchJobApplications,
    getJobApplicationById,
    createJobApplication,
    updateApplicationStatus,
    requestApplicationOTP,
    updateApplicationByCandidate,
    fetchApplicationAttachments,
    deleteJobApplication,
    searchJobApplications,
    fetchApplicationsStats,
    downloadAttachment,
    clearError,
    clearData,
    clearApplications,
  }
})