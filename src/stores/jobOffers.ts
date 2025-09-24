// Store Pinia pour les offres d'emploi
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { jobOffersService } from '@/services/api/jobOffers'
import type {
  JobOfferOut,
  JobOfferCreateInput,
  JobOfferUpdateInput,
  JobOfferOutSuccess,
  JobOffersPageOutSuccess,
  JobOfferFilter,
  JobApplicationOut,
  JobApplicationCreateInput,
  JobApplicationUpdateByCandidateInput,
  JobApplicationOTPRequestInput,
  JobApplicationOutSuccess,
  JobApplicationsPageOutSuccess,
  JobApplicationFilter,
  UpdateJobOfferStatusInput,
  JobAttachmentOut,
  JobAttachmentListOutSuccess,
  JobApplicationStatus,
  JobDashboardStats,
  JobOfferStats,
  JobApplicationStats,
} from '@/types/jobOffers'
import type { BaseOutSuccess } from '@/types'

export const useJobOffersStore = defineStore('jobOffers', () => {
  // === STATE ===
  const jobOffers = ref<JobOfferOut[]>([])
  const currentJobOffer = ref<JobOfferOut | null>(null)
  const jobApplications = ref<JobApplicationOut[]>([])
  const currentJobApplication = ref<JobApplicationOut | null>(null)
  const applicationAttachments = ref<JobAttachmentOut[]>([])
  
  // Statistics state
  const dashboardStats = ref<JobDashboardStats | null>(null)
  const offersStats = ref<JobOfferStats | null>(null)
  const applicationsStats = ref<JobApplicationStats | null>(null)
  const statsLoading = ref(false)
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Pagination pour les offres
  const jobOffersPagination = ref({
    page: 1,
    pageSize: 20,
    total: 0,
  })
  
  // Pagination pour les candidatures
  const applicationsPagination = ref({
    page: 1,
    pageSize: 20,
    total: 0,
  })

  // === GETTERS ===
  const hasJobOffers = computed(() => jobOffers.value.length > 0)
  const hasApplications = computed(() => jobApplications.value.length > 0)
  const hasAttachments = computed(() => applicationAttachments.value.length > 0)
  
  // Statistiques des candidatures (provenant du backend)
  const applicationStats = computed(() => {
    if (dashboardStats.value?.applications) {
      return {
        total: dashboardStats.value.applications.total_applications,
        pending: dashboardStats.value.applications.pending_applications,
        accepted: dashboardStats.value.applications.accepted_applications,
        rejected: dashboardStats.value.applications.rejected_applications,
      }
    }
    
    return { total: 0, pending: 0, accepted: 0, rejected: 0 }
  })
  
  // Offres actives (non expirées)
  const activeJobOffers = computed(() => {
    const today = new Date()
    return jobOffers.value.filter(offer => {
      const deadline = new Date(offer.deadline)
      return deadline >= today
    })
  })
  
  // Statistics getters
  const hasStatsData = computed(() => !!dashboardStats.value)
  const offersGrowthRate = computed(() => offersStats.value?.offers_growth_rate || 0)
  const applicationsGrowthRate = computed(() => applicationsStats.value?.applications_growth_rate || 0)
  const acceptanceRate = computed(() => applicationsStats.value?.acceptance_rate || 0)

  // === ACTIONS ===
  
  // ==================
  // JOB OFFERS ACTIONS
  // ==================
  
  /**
   * Récupérer les offres d'emploi avec filtres
   */
  const fetchJobOffers = async (filter?: JobOfferFilter) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response: JobOffersPageOutSuccess = await jobOffersService.getJobOffers(filter)
      jobOffers.value = response.data
      jobOffersPagination.value = {
        page: response.page,
        pageSize: response.number,
        total: response.total_number,
      }
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des offres d\'emploi'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Récupérer une offre d'emploi par ID
   */
  const getJobOfferById = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response: JobOfferOutSuccess = await jobOffersService.getJobOfferById(id)
      currentJobOffer.value = response.data
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement de l\'offre d\'emploi'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Créer une nouvelle offre d'emploi
   */
  const createJobOffer = async (jobOfferData: JobOfferCreateInput) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response: JobOfferOutSuccess = await jobOffersService.createJobOffer(jobOfferData)
      jobOffers.value.unshift(response.data)
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la création de l\'offre d\'emploi'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Mettre à jour une offre d'emploi
   */
  const updateJobOffer = async (id: string, jobOfferData: JobOfferCreateInput) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response: JobOfferOutSuccess = await jobOffersService.updateJobOffer(id, jobOfferData)
      const index = jobOffers.value.findIndex(offer => offer.id === id)
      if (index !== -1) {
        jobOffers.value[index] = response.data
      }
      
      // Mettre à jour l'offre courante si c'est celle qui est modifiée
      if (currentJobOffer.value && currentJobOffer.value.id === id) {
        currentJobOffer.value = response.data
      }
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la mise à jour de l\'offre d\'emploi'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Supprimer une offre d'emploi
   */
  const deleteJobOffer = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      await jobOffersService.deleteJobOffer(id)
      jobOffers.value = jobOffers.value.filter(offer => offer.id !== id)
      
      // Nettoyer l'offre courante si c'est celle qui est supprimée
      if (currentJobOffer.value && currentJobOffer.value.id === id) {
        currentJobOffer.value = null
      }
      
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la suppression de l\'offre d\'emploi'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Rechercher des offres d'emploi
   */
  const searchJobOffers = async (query: string, filters?: Partial<JobOfferFilter>) => {
    return await fetchJobOffers({
      search: query,
      ...filters,
      page: filters?.page || 1,
      page_size: filters?.page_size || 20
    })
  }

  // ========================
  // JOB APPLICATIONS ACTIONS
  // ========================

  /**
   * Récupérer les candidatures avec filtres
   */
  const fetchJobApplications = async (filter?: JobApplicationFilter) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response: JobApplicationsPageOutSuccess = await jobOffersService.getJobApplications(filter)
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
      
      const response: JobApplicationOutSuccess = await jobOffersService.getJobApplicationById(id)
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
   * Créer une nouvelle candidature (fichiers déjà uploadés)
   */
  const createJobApplication = async (applicationData: JobApplicationCreateInput) => {
    try {
      isLoading.value = true
      error.value = null
      
      // Envoyer directement les données avec URLs des fichiers
      const response = await jobOffersService.createJobApplicationWithUrls(applicationData)
      
      // La réponse contient job_application et payment
      const jobApplication = response.data.job_application
      jobApplications.value.unshift(jobApplication)
      
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
  const updateApplicationStatus = async (data: UpdateJobOfferStatusInput) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response: JobApplicationOutSuccess = await jobOffersService.updateJobApplicationStatus(data)
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
      
      const response: BaseOutSuccess = await jobOffersService.requestApplicationOTP(data)
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
      
      const response: JobApplicationOutSuccess = await jobOffersService.updateApplicationByCandidate(data)
      
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
      
      const response: JobAttachmentListOutSuccess = await jobOffersService.getApplicationAttachments(applicationId)
      applicationAttachments.value = response.data
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des pièces jointes'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // === UTILITY ACTIONS ===

  /**
   * Obtenir les statistiques des candidatures pour une offre
   */
  const getJobOfferStats = async (jobOfferId: string) => {
    try {
      const applications = await fetchJobApplications({ job_offer_id: jobOfferId })
      
      return {
        total: applications.total_number,
        pending: applications.data.filter(app => app.status === 'pending').length,
        accepted: applications.data.filter(app => app.status === 'accepted').length,
        rejected: applications.data.filter(app => app.status === 'rejected').length,
      }
    } catch (error) {
      return { total: 0, pending: 0, accepted: 0, rejected: 0 }
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
    jobOffers.value = []
    currentJobOffer.value = null
    jobApplications.value = []
    currentJobApplication.value = null
    applicationAttachments.value = []
    error.value = null
    jobOffersPagination.value = { page: 1, pageSize: 20, total: 0 }
    applicationsPagination.value = { page: 1, pageSize: 20, total: 0 }
  }

  /**
   * Nettoyer les données d'offres
   */
  const clearJobOffers = () => {
    jobOffers.value = []
    currentJobOffer.value = null
    jobOffersPagination.value = { page: 1, pageSize: 20, total: 0 }
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

  /**
   * Filtrer les offres par statut (actif/expiré)
   */
  const filterOffersByStatus = (status: 'active' | 'expired') => {
    const today = new Date()
    return jobOffers.value.filter(offer => {
      const deadline = new Date(offer.deadline)
      if (status === 'active') {
        return deadline >= today
      } else {
        return deadline < today
      }
    })
  }

  /**
   * Méthodes simplifiées pour les actions communes
   */
  const getJobOffers = fetchJobOffers
  const getJobApplications = fetchJobApplications
  const updateJobApplication = async (data: JobApplicationUpdateInput) => {
    try {
      isLoading.value = true
      error.value = null
      
      // Simuler l'appel API pour la mise à jour
      const index = jobApplications.value.findIndex(app => app.id.toString() === data.id)
      if (index !== -1) {
        jobApplications.value[index] = {
          ...jobApplications.value[index],
          status: data.status || jobApplications.value[index].status,
          notes: data.notes
        }
      }
      
      if (currentJobApplication.value && currentJobApplication.value.id.toString() === data.id) {
        currentJobApplication.value = {
          ...currentJobApplication.value,
          status: data.status || currentJobApplication.value.status,
          notes: data.notes
        }
      }
      
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la mise à jour de la candidature'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const deleteJobApplication = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      jobApplications.value = jobApplications.value.filter(app => app.id.toString() !== id)
      
      if (currentJobApplication.value && currentJobApplication.value.id.toString() === id) {
        currentJobApplication.value = null
      }
      
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la suppression de la candidature'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // === STATISTICS ACTIONS ===
  
  /**
   * Récupérer toutes les statistiques du dashboard
   */
  const fetchDashboardStats = async () => {
    try {
      statsLoading.value = true
      error.value = null
      
      const response = await jobOffersService.getDashboardStats()
      dashboardStats.value = response.data
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des statistiques'
      throw err
    } finally {
      statsLoading.value = false
    }
  }
  
  /**
   * Récupérer les statistiques des offres
   */
  const fetchOffersStats = async () => {
    try {
      statsLoading.value = true
      error.value = null
      
      const response = await jobOffersService.getOffersStats()
      offersStats.value = response.data
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des statistiques des offres'
      throw err
    } finally {
      statsLoading.value = false
    }
  }
  
  /**
   * Récupérer les statistiques des candidatures
   */
  const fetchApplicationsStats = async () => {
    try {
      statsLoading.value = true
      error.value = null
      
      const response = await jobOffersService.getApplicationsStats()
      applicationsStats.value = response.data
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des statistiques des candidatures'
      throw err
    } finally {
      statsLoading.value = false
    }
  }
  
  /**
   * Récupérer les statistiques par type de contrat
   */
  const fetchContractTypesStats = async () => {
    try {
      const response = await jobOffersService.getContractTypesStats()
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des statistiques par type de contrat'
      throw err
    }
  }
  
  /**
   * Récupérer les statistiques par localisation
   */
  const fetchLocationsStats = async () => {
    try {
      const response = await jobOffersService.getLocationsStats()
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des statistiques par localisation'
      throw err
    }
  }
  
  /**
   * Récupérer les statistiques de salaires
   */
  const fetchSalaryStats = async () => {
    try {
      const response = await jobOffersService.getSalaryStats()
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des statistiques de salaires'
      throw err
    }
  }
  
  /**
   * Récupérer les statistiques mensuelles
   */
  const fetchMonthlyStats = async (year?: number) => {
    try {
      const response = await jobOffersService.getMonthlyStats(year)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des statistiques mensuelles'
      throw err
    }
  }
  
  /**
   * Récupérer les top offres
   */
  const fetchTopOffers = async (limit?: number) => {
    try {
      const response = await jobOffersService.getTopOffersStats(limit)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement du top des offres'
      throw err
    }
  }
  
  /**
   * Récupérer les insights
   */
  const fetchJobInsights = async () => {
    try {
      const response = await jobOffersService.getJobInsights()
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des insights'
      throw err
    }
  }
  
  /**
   * Récupérer l'évolution des candidatures
   */
  const fetchApplicationsEvolution = async (period?: 'daily' | 'weekly' | 'monthly') => {
    try {
      const response = await jobOffersService.getApplicationsEvolution(period)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement de l\'évolution des candidatures'
      throw err
    }
  }
  
  /**
   * Nettoyer les statistiques
   */
  const clearStats = () => {
    dashboardStats.value = null
    offersStats.value = null
    applicationsStats.value = null
  }
  
  const downloadJobAttachment = async (attachmentId: string, filename: string) => {
    try {
      // Simuler le téléchargement - dans une vraie implémentation, cela ferait un appel API
      const link = document.createElement('a')
      link.href = '#' // URL du fichier depuis l'API
      link.download = filename
      link.click()
    } catch (err: any) {
      error.value = 'Erreur lors du téléchargement du fichier'
      throw err
    }
  }

  return {
    // State
    jobOffers,
    currentJobOffer,
    jobApplications,
    currentJobApplication,
    applicationAttachments,
    isLoading,
    error,
    jobOffersPagination,
    applicationsPagination,
    
    // Getters
    hasJobOffers,
    hasApplications,
    hasAttachments,
    applicationStats,
    activeJobOffers,
    
    // Job Offers Actions
    fetchJobOffers,
    getJobOfferById,
    createJobOffer,
    updateJobOffer,
    deleteJobOffer,
    searchJobOffers,
    
    // Job Applications Actions
    fetchJobApplications,
    getJobApplicationById,
    createJobApplication,
    updateApplicationStatus,
    requestApplicationOTP,
    updateApplicationByCandidate,
    fetchApplicationAttachments,
    
    // Simplified Actions
    getJobOffers,
    getJobApplications,
    updateJobApplication,
    deleteJobApplication,
    downloadJobAttachment,
    
    // Utility Actions
    getJobOfferStats,
    clearError,
    clearData,
    clearJobOffers,
    clearApplications,
    filterOffersByStatus,
    
    // Statistics State
    dashboardStats,
    offersStats,
    applicationsStats,
    statsLoading,
    
    // Statistics Getters
    hasStatsData,
    offersGrowthRate,
    applicationsGrowthRate,
    acceptanceRate,
    
    // Statistics Actions
    fetchDashboardStats,
    fetchOffersStats,
    fetchApplicationsStats,
    fetchContractTypesStats,
    fetchLocationsStats,
    fetchSalaryStats,
    fetchMonthlyStats,
    fetchTopOffers,
    fetchJobInsights,
    fetchApplicationsEvolution,
    clearStats,
  }
})
