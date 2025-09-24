// Composable pour la gestion des candidatures d'étudiants

import { ref, computed, watch } from 'vue'
import { studentApplicationService } from '@/services/api/student-application'
import { useAuth } from '@/composables/useAuth'
import type {
  StudentApplicationOut,
  StudentApplicationFullOut,
  StudentApplicationCreateInput,
  StudentApplicationUpdateInput,
  StudentApplicationFilter,
  StudentApplicationSearchFilters,
  StudentApplicationFormData,
  StudentApplicationStatusChip,
  StudentApplicationComputed
} from '@/types/student-application'
import { ApplicationStatusEnum } from '@/types/student-application'
import { showToast } from '@/components/toast/toastManager'

export function useStudentApplication() {
  // ===== STATE =====
  const applications = ref<StudentApplicationOut[]>([])
  const currentApplication = ref<StudentApplicationFullOut | null>(null)
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref('')
  const totalCount = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(20)
  const searchQuery = ref('')
  const filters = ref<StudentApplicationSearchFilters>({})
  
  // ===== AUTH =====
  const { user } = useAuth()

  // ===== COMPUTED =====
  const hasApplications = computed(() => applications.value.length > 0)
  const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value))
  const canLoadMore = computed(() => currentPage.value < totalPages.value)
  
  const filteredApplications = computed(() => {
    if (!searchQuery.value && !Object.keys(filters.value).length) {
      // Par défaut, afficher seulement les candidatures payées
      return applications.value.filter(app => !!app.payment_id)
    }
    
    return applications.value.filter(app => {
      // Recherche textuelle
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        const matchesSearch = 
          app.application_number.toLowerCase().includes(query) ||
          (app.training_title?.toLowerCase().includes(query) || false) ||
          (app.user_email?.toLowerCase().includes(query) || false) ||
          (app.user_first_name?.toLowerCase().includes(query) || false) ||
          (app.user_last_name?.toLowerCase().includes(query) || false)
        
        if (!matchesSearch) return false
      }
      
      // Filtres
      if (filters.value.status && app.status !== filters.value.status) return false
      if (filters.value.training_id && app.training_id !== filters.value.training_id) return false
      if (filters.value.training_session_id && app.target_session_id !== filters.value.training_session_id) return false
      if (filters.value.is_paid !== undefined) {
        const isPaid = !!app.payment_id
        if (filters.value.is_paid !== isPaid) return false
      } else {
        // Par défaut, afficher seulement les candidatures payées si aucun filtre de paiement n'est spécifié
        if (!app.payment_id) return false
      }
      
      return true
    })
  })

  // Filtrage pour les candidatures de l'utilisateur (affiche toutes les candidatures)
  const myFilteredApplications = computed(() => {
    if (!searchQuery.value && !Object.keys(filters.value).length) {
      // Afficher toutes les candidatures de l'utilisateur
      return applications.value
    }
    
    return applications.value.filter(app => {
      // Recherche textuelle
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        const matchesSearch = 
          app.application_number.toLowerCase().includes(query) ||
          (app.training_title?.toLowerCase().includes(query) || false) ||
          (app.user_email?.toLowerCase().includes(query) || false) ||
          (app.user_first_name?.toLowerCase().includes(query) || false) ||
          (app.user_last_name?.toLowerCase().includes(query) || false)
        
        if (!matchesSearch) return false
      }
      
      // Filtres
      if (filters.value.status && app.status !== filters.value.status) return false
      if (filters.value.training_id && app.training_id !== filters.value.training_id) return false
      if (filters.value.training_session_id && app.target_session_id !== filters.value.training_session_id) return false
      if (filters.value.is_paid !== undefined) {
        const isPaid = !!app.payment_id
        if (filters.value.is_paid !== isPaid) return false
      }
      
      return true
    })
  })

  // ===== METHODS =====

  /**
   * Charger les candidatures
   */
  const loadApplications = async (reset = false) => {
    try {
      isLoading.value = true
      error.value = ''
      
      if (reset) {
        currentPage.value = 1
        applications.value = []
      }
      
      const params: StudentApplicationFilter = {
        page: currentPage.value,
        page_size: pageSize.value,
        ...filters.value
      }
      
      console.log('🔍 Chargement des candidatures via /student-applications avec params:', params)
      const response = await studentApplicationService.listMyStudentApplications(params)
      console.log('📋 Réponse API candidatures:', response)
      applications.value = reset ? response.data : [...applications.value, ...response.data]
      totalCount.value = response.total_number
      
    } catch (err: any) {
      console.error('Erreur lors du chargement des candidatures:', err)
      error.value = 'Erreur lors du chargement des candidatures'
      showToast({ message: 'Erreur lors du chargement des candidatures', type: 'error' })
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Charger plus de candidatures
   */
  const loadMoreApplications = async () => {
    if (canLoadMore.value && !isLoading.value) {
      currentPage.value++
      await loadApplications(false)
    }
  }

  /**
   * Charger les candidatures de l'utilisateur connecté
   */
  const loadMyApplications = async (reset = false) => {
    try {
      isLoading.value = true
      error.value = ''
      
      if (reset) {
        currentPage.value = 1
        applications.value = []
      }
      
      // Attendre que l'utilisateur soit chargé
      if (!user.value?.id) {
        console.warn('Utilisateur non connecté, impossible de charger les candidatures')
        applications.value = []
        totalCount.value = 0
        return
      }
      
      const params: StudentApplicationFilter = {
        page: currentPage.value,
        page_size: pageSize.value,
        ...filters.value
      }
      
      console.log('🔍 Chargement des candidatures de l\'utilisateur connecté avec params:', params)
      const response = await studentApplicationService.listMyStudentApplications(params)
      console.log('📋 Réponse API candidatures utilisateur:', response)
      applications.value = reset ? response.data : [...applications.value, ...response.data]
      totalCount.value = response.total_number
      
    } catch (err: any) {
      console.error('Erreur lors du chargement des candidatures de l\'utilisateur:', err)
      error.value = 'Erreur lors du chargement de vos candidatures'
      showToast({ message: 'Erreur lors du chargement de vos candidatures', type: 'error' })
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Rechercher des candidatures
   */
  const searchApplications = async (query: string) => {
    searchQuery.value = query
    await loadApplications(true)
  }

  /**
   * Appliquer des filtres
   */
  const applyFilters = async (newFilters: StudentApplicationSearchFilters) => {
    filters.value = { ...filters.value, ...newFilters }
    await loadApplications(true)
  }

  /**
   * Réinitialiser les filtres
   */
  const resetFilters = async () => {
    filters.value = {}
    searchQuery.value = ''
    await loadApplications(true)
  }

  /**
   * Charger une candidature spécifique
   */
  const loadApplication = async (id: number) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await studentApplicationService.getStudentApplication(id)
      currentApplication.value = response.data
      
    } catch (err: any) {
      console.error('Erreur lors du chargement de la candidature:', err)
      error.value = 'Erreur lors du chargement de la candidature'
      showToast({ message: 'Erreur lors du chargement de la candidature', type: 'error' })
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Créer une nouvelle candidature
   */
  const createApplication = async (data: StudentApplicationCreateInput) => {
    try {
      isSubmitting.value = true
      error.value = ''
      
      const response = await studentApplicationService.createStudentApplication(data)
      currentApplication.value = response.data
      
      showToast({ message: 'Candidature créée avec succès', type: 'success' })
      await loadApplications(true) // Recharger la liste
      
      return response.data
      
    } catch (err: any) {
      console.error('Erreur lors de la création de la candidature:', err)
      error.value = 'Erreur lors de la création de la candidature'
      showToast({ message: 'Erreur lors de la création de la candidature', type: 'error' })
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Mettre à jour une candidature
   */
  const updateApplication = async (id: number, data: StudentApplicationUpdateInput) => {
    try {
      isSubmitting.value = true
      error.value = ''
      
      const response = await studentApplicationService.updateStudentApplication(id, data)
      
      // Mettre à jour la candidature dans la liste
      const index = applications.value.findIndex(app => app.id === id)
      if (index !== -1) {
        applications.value[index] = { ...applications.value[index], ...data }
      }
      
      // Mettre à jour la candidature courante si c'est la même
      if (currentApplication.value?.id === id) {
        currentApplication.value = response.data
      }
      
      showToast({ message: 'Candidature mise à jour avec succès', type: 'success' })
      
      return response.data
      
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour de la candidature:', err)
      error.value = 'Erreur lors de la mise à jour de la candidature'
      showToast({ message: 'Erreur lors de la mise à jour de la candidature', type: 'error' })
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Supprimer une candidature
   */
  const deleteApplication = async (id: number) => {
    try {
      isSubmitting.value = true
      error.value = ''
      
      await studentApplicationService.deleteStudentApplication(id)
      
      // Retirer la candidature de la liste
      applications.value = applications.value.filter(app => app.id !== id)
      
      // Vider la candidature courante si c'est la même
      if (currentApplication.value?.id === id) {
        currentApplication.value = null
      }
      
      showToast({ message: 'Candidature supprimée avec succès', type: 'success' })
      
    } catch (err: any) {
      console.error('Erreur lors de la suppression de la candidature:', err)
      error.value = 'Erreur lors de la suppression de la candidature'
      showToast({ message: 'Erreur lors de la suppression de la candidature', type: 'error' })
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  // Méthodes pour les utilisateurs (MY_*)
  const updateMyStudentApplication = async (id: number, data: StudentApplicationCreateInput) => {
    try {
      isSubmitting.value = true
      error.value = ''
      
      const response = await studentApplicationService.updateMyStudentApplication(id, data)
      
      // Mettre à jour la candidature dans la liste
      const index = applications.value.findIndex(app => app.id === id)
      if (index !== -1) {
        applications.value[index] = response.data
      }
      
      // Mettre à jour la candidature courante si c'est la même
      if (currentApplication.value?.id === id) {
        currentApplication.value = response.data
      }
      
      showToast({ message: 'Candidature mise à jour avec succès', type: 'success' })
      
      return response.data
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour de la candidature:', err)
      error.value = 'Erreur lors de la mise à jour de la candidature'
      showToast({ message: 'Erreur lors de la mise à jour de la candidature', type: 'error' })
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  const deleteMyStudentApplication = async (id: number) => {
    try {
      isSubmitting.value = true
      error.value = ''
      
      await studentApplicationService.deleteMyStudentApplication(id)
      
      // Retirer la candidature de la liste
      applications.value = applications.value.filter(app => app.id !== id)
      
      // Vider la candidature courante si c'est la même
      if (currentApplication.value?.id === id) {
        currentApplication.value = null
      }
      
      showToast({ message: 'Candidature supprimée avec succès', type: 'success' })
      
    } catch (err: any) {
      console.error('Erreur lors de la suppression de la candidature:', err)
      error.value = 'Erreur lors de la suppression de la candidature'
      showToast({ message: 'Erreur lors de la suppression de la candidature', type: 'error' })
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Soumettre une candidature
   */
  const submitApplication = async (applicationId: number, sessionId: string) => {
    try {
      isSubmitting.value = true
      error.value = ''
      
      await studentApplicationService.submitStudentApplication({
        application_id: applicationId,
        target_session_id: sessionId
      })
      
      showToast({ message: 'Candidature soumise avec succès', type: 'success' })
      await loadApplications(true) // Recharger la liste
      
    } catch (err: any) {
      console.error('Erreur lors de la soumission de la candidature:', err)
      error.value = 'Erreur lors de la soumission de la candidature'
      showToast({ message: 'Erreur lors de la soumission de la candidature', type: 'error' })
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Payer les frais de formation
   */
  const payTrainingFee = async (data: { training_session_id: string; amount: number }) => {
    try {
      isSubmitting.value = true
      error.value = ''
      
      const response = await studentApplicationService.payTrainingFee(data)
      showToast({ message: 'Redirection vers la plateforme de paiement...', type: 'info' })
      
      return response
    } catch (err: any) {
      console.error('Erreur lors du paiement:', err)
      error.value = err.response?.data?.message || err.message || 'Erreur lors du paiement'
      showToast({ message: error.value, type: 'error' })
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Réinitialiser l'état
   */
  const reset = () => {
    applications.value = []
    currentApplication.value = null
    error.value = ''
    currentPage.value = 1
    searchQuery.value = ''
    filters.value = {}
  }

  // ===== UTILITY FUNCTIONS =====

  /**
   * Obtenir le chip de statut d'une candidature
   */
  const getStatusChip = (status: string): StudentApplicationStatusChip => {
    const statusConfig = {
      [ApplicationStatusEnum.SUBMITTED]: {
        text: 'Soumise',
        color: 'info',
        icon: 'ri-send-plane-line'
      },
      [ApplicationStatusEnum.APPROVED]: {
        text: 'Approuvée',
        color: 'success',
        icon: 'ri-check-line'
      },
      [ApplicationStatusEnum.REFUSED]: {
        text: 'Refusée',
        color: 'error',
        icon: 'ri-close-line'
      },
      [ApplicationStatusEnum.RECEIVED]: {
        text: 'Reçue',
        color: 'primary',
        icon: 'ri-inbox-line'
      }
    }
    
    return statusConfig[status as ApplicationStatusEnum] || {
      text: status,
      color: 'grey',
      icon: 'ri-question-line'
    }
  }

  /**
   * Vérifier si une candidature peut être modifiée
   */
  const canEditApplication = (application: StudentApplicationOut): boolean => {
    return application.status === ApplicationStatusEnum.SUBMITTED
  }

  /**
   * Vérifier si une candidature peut être supprimée
   */
  const canDeleteApplication = (application: StudentApplicationOut): boolean => {
    return application.status === ApplicationStatusEnum.SUBMITTED
  }

  /**
   * Vérifier si une candidature peut être soumise
   */
  const canSubmitApplication = (application: StudentApplicationOut): boolean => {
    return application.status === ApplicationStatusEnum.SUBMITTED
  }

  /**
   * Formater les données du formulaire
   */
  const formatFormData = (formData: StudentApplicationFormData): StudentApplicationCreateInput => {
    return {
      email: formData.email,
      target_session_id: formData.target_session_id,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone_number: formData.phone_number,
      country_code: formData.country_code,
      attachments: formData.attachments.map(file => file.name)
    }
  }

  // ===== WATCHERS =====
  watch([searchQuery, filters], () => {
    loadApplications(true)
  }, { deep: true })

  return {
    // State
    applications,
    currentApplication,
    isLoading,
    isSubmitting,
    error,
    totalCount,
    currentPage,
    pageSize,
    searchQuery,
    filters,
    
    // Computed
    hasApplications,
    totalPages,
    canLoadMore,
    filteredApplications,
    myFilteredApplications,
    
    // Methods
    loadApplications,
    loadMyApplications,
    loadMoreApplications,
    searchApplications,
    applyFilters,
    resetFilters,
    loadApplication,
    createApplication,
    updateApplication,
    deleteApplication,
    updateMyStudentApplication,
    deleteMyStudentApplication,
    submitApplication,
    payTrainingFee,
    reset,
    
    // Utility functions
    getStatusChip,
    canEditApplication,
    canDeleteApplication,
    canSubmitApplication,
    formatFormData
  }
}
