// Composable pour la gestion des candidatures d'étudiants

import { showToast } from '@/components/toast/toastManager'
import { useAuth } from '@/composables/useAuth'
import { studentApplicationsService } from '@/services/api/student-applications'
import { usersService, type UserSimpleOut } from '@/services/api/users'
import type {
    StudentApplicationCreateInput,
    StudentApplicationFilter,
    StudentApplicationFormData,
    StudentApplicationFullOut,
    StudentApplicationOut,
    StudentApplicationSearchFilters,
    StudentApplicationStatusChip
} from '@/types/student-application'
import { ApplicationStatusEnum } from '@/types/student-application'
import { computed, ref } from 'vue'

export function useStudentApplication() {
  // ===== STATE =====
  const applications = ref<StudentApplicationOut[]>([])
  const currentApplication = ref<StudentApplicationFullOut | null>(null)
  const currentUserDetails = ref<UserSimpleOut | null>(null)
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref('')
  const totalCount = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(20)
  const searchQuery = ref('')
  const filters = ref<StudentApplicationSearchFilters>({})
  const sortBy = ref('created_at')
  const sortOrder = ref<'asc' | 'desc'>('desc')
  
  // Stocker toutes les candidatures chargées (sans filtre)
  const allApplications = ref<StudentApplicationOut[]>([])

  // ===== AUTH =====
  const { user } = useAuth()

  // ===== COMPUTED =====
  const hasApplications = computed(() => filteredApplications.value.length > 0)
  const totalPages = computed(() => Math.ceil(filteredApplications.value.length / pageSize.value))
  const canLoadMore = computed(() => currentPage.value < totalPages.value)

  // Computed pour filtrer et trier les candidatures côté frontend
  const filteredApplications = computed(() => {
    let result = [...allApplications.value]

    // Filtre par recherche
    if (searchQuery.value && searchQuery.value.trim() !== '') {
      const query = searchQuery.value.trim().toLowerCase()
      result = result.filter(app => {
        const matchesSearch =
          app.application_number?.toLowerCase().includes(query) ||
          app.training_title?.toLowerCase().includes(query) ||
          app.user_email?.toLowerCase().includes(query) ||
          app.user_first_name?.toLowerCase().includes(query) ||
          app.user_last_name?.toLowerCase().includes(query)
        return matchesSearch
      })
    }

    // Filtre par statut
    if (filters.value.status) {
      result = result.filter(app => app.status === filters.value.status)
    }

    // Filtre par formation
    if (filters.value.training_id) {
      result = result.filter(app => app.training_id === filters.value.training_id)
    }

    // Filtre par session
    if (filters.value.training_session_id) {
      result = result.filter(app => app.target_session_id === filters.value.training_session_id)
    }


    // Tri
    const sortField = sortBy.value === 'created_at_asc' ? 'created_at' : sortBy.value
    const sortAsc = sortBy.value === 'created_at_asc' || sortBy.value === 'application_number' || sortBy.value === 'status' || sortBy.value === 'training_title'
    
    result.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case 'created_at':
          aValue = new Date(a.created_at || 0).getTime()
          bValue = new Date(b.created_at || 0).getTime()
          break
        case 'application_number':
          aValue = a.application_number || ''
          bValue = b.application_number || ''
          break
        case 'status':
          aValue = a.status || ''
          bValue = b.status || ''
          break
        case 'training_title':
          aValue = a.training_title || ''
          bValue = b.training_title || ''
          break
        default:
          aValue = new Date(a.created_at || 0).getTime()
          bValue = new Date(b.created_at || 0).getTime()
      }

      if (aValue < bValue) return sortAsc ? -1 : 1
      if (aValue > bValue) return sortAsc ? 1 : -1
      return 0
    })

    return result
  })

  // Computed pour la pagination côté frontend
  const paginatedApplications = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredApplications.value.slice(start, end)
  })

  const myFilteredApplications = computed(() => {
    return applications.value.filter(app => {
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        const matchesSearch =
          app.application_number.toLowerCase().includes(query) ||
          (app.training_title?.toLowerCase().includes(query) || false) ||
          (app.user_email?.toLowerCase().includes(query) || false) ||
          (app.user_first_name?.toLowerCase().includes(query) || false) ||
          (app.user_last_name?.toLowerCase().includes(query) || false);
        if (!matchesSearch) return false;
      }

      if (filters.value.status && app.status !== filters.value.status) return false;
      if (filters.value.training_id && app.training_id !== filters.value.training_id) return false;
      if (filters.value.training_session_id && app.target_session_id !== filters.value.training_session_id) return false;
      // Déjà commenté : filtre is_paid

      return true;
    });
  });
  // ===== METHODS =====

  /**
   * Charger les candidatures (admin)
   * Charge toutes les candidatures une seule fois pour le filtrage côté frontend
   */
  const loadApplications = async (reset = false) => {
    try {
      isLoading.value = true;
      error.value = '';

      if (reset) {
        currentPage.value = 1;
        allApplications.value = [];
      }

      // Charger TOUTES les candidatures sans pagination ni filtres côté backend
      const params: StudentApplicationFilter = {
        page: 1,
        page_size: 10000, // Grande taille pour récupérer toutes les candidatures
      };

      console.log('🔍 Envoi requête API admin pour charger toutes les candidatures:', params);
      const response = await studentApplicationsService.getStudentApplications(params);
      console.log('📋 Réponse API admin:', response);
      
      // Stocker toutes les candidatures dans allApplications
      allApplications.value = [...response.data];
      totalCount.value = response.total_number;
      
      // Mettre à jour applications pour compatibilité
      applications.value = allApplications.value;
    } catch (err: any) {
      console.error('Erreur lors du chargement des candidatures:', err);
      error.value = 'Erreur lors du chargement des candidatures';
      showToast({ message: 'Erreur lors du chargement des candidatures', type: 'error' });
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Charger plus de candidatures (pagination côté frontend)
   */
  const loadMoreApplications = async () => {
    if (canLoadMore.value && !isLoading.value) {
      currentPage.value++
      // La pagination se fait automatiquement via paginatedApplications
    }
  }

  /**
   * Charger les candidatures de l'utilisateur connecté
   * Charge toutes les candidatures une seule fois pour le filtrage côté frontend
   */
  const loadMyApplications = async (reset = false) => {
    try {
      isLoading.value = true
      error.value = ''

      if (reset) {
        currentPage.value = 1
        allApplications.value = []
      }

      // Vérifier si l'utilisateur est connecté
      if (!user.value?.id) {
        console.warn('Utilisateur non connecté, impossible de charger les candidatures')
        allApplications.value = []
        applications.value = []
        totalCount.value = 0
        return
      }

      // Charger TOUTES les candidatures sans pagination ni filtres côté backend
      const params: StudentApplicationFilter = {
        page: 1,
        page_size: 10000, // Grande taille pour récupérer toutes les candidatures
      }

      console.log('🔍 Chargement de toutes les candidatures de l\'utilisateur connecté:', params)
      const response = await studentApplicationsService.getMyStudentApplications(params)
      console.log('📋 Réponse API candidatures utilisateur:', response)
      
      // Stocker toutes les candidatures dans allApplications
      allApplications.value = [...response.data]
      totalCount.value = response.total_number
      
      // Mettre à jour applications pour compatibilité
      applications.value = allApplications.value

    } catch (err: any) {
      console.error('Erreur lors du chargement des candidatures de l\'utilisateur:', err)
      error.value = 'Erreur lors du chargement de vos candidatures'
      showToast({ message: 'Erreur lors du chargement de vos candidatures', type: 'error' })
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Rechercher des candidatures (filtrage côté frontend)
   */
  const searchApplications = async (query: string, useAdminEndpoint = false) => {
    searchQuery.value = query
    currentPage.value = 1 // Réinitialiser à la première page
    // Le filtrage se fait automatiquement via filteredApplications
    // Si on n'a pas encore chargé les données, les charger
    if (allApplications.value.length === 0) {
    if (useAdminEndpoint) {
      await loadApplications(true)
    } else {
      await loadMyApplications(true)
      }
    }
  }

  /**
   * Appliquer des filtres (filtrage côté frontend)
   */
  const applyFilters = async (newFilters: StudentApplicationSearchFilters, useAdminEndpoint = false) => {
    filters.value = { ...filters.value, ...newFilters }
    currentPage.value = 1 // Réinitialiser à la première page
    // Le filtrage se fait automatiquement via filteredApplications
    // Si on n'a pas encore chargé les données, les charger
    if (allApplications.value.length === 0) {
    if (useAdminEndpoint) {
      await loadApplications(true)
    } else {
      await loadMyApplications(true)
      }
    }
  }

  /**
   * Réinitialiser les filtres (filtrage côté frontend)
   */
  const resetFilters = async (useAdminEndpoint = false) => {
    filters.value = {}
    searchQuery.value = ''
    sortBy.value = 'created_at'
    sortOrder.value = 'desc'
    currentPage.value = 1
    // Le filtrage se fait automatiquement via filteredApplications
  }

  /**
   * Charger une candidature spécifique
   */
  const loadApplication = async (id: number, useAdminEndpoint = false) => {
    try {
      isLoading.value = true
      error.value = ''

      let response
      if (useAdminEndpoint) {
        response = await studentApplicationsService.getStudentApplicationById(id)
      } else {
        response = await studentApplicationsService.getMyStudentApplicationById(id)
      }
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
   * Charger les détails de l'utilisateur
   */
  const loadUserDetails = async (userId: string) => {
    try {
      isLoading.value = true
      error.value = ''
      console.log('🔍 Chargement des détails de l\'utilisateur:', userId)
      const response = await usersService.getUserById(userId)
      currentUserDetails.value = response.data
    } catch (err: any) {
      console.error('Erreur lors du chargement des détails de l\'utilisateur:', err)
      error.value = 'Erreur lors du chargement des détails de l\'utilisateur'
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

      const response = await studentApplicationsService.createStudentApplication(data)
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
  const updateApplication = async (id: number, data: StudentApplicationCreateInput) => {
    try {
      isSubmitting.value = true
      error.value = ''

      const response = await studentApplicationsService.updateMyStudentApplication(id, data)

      // Mettre à jour la candidature dans la liste
      const index = applications.value.findIndex(app => app.id === id)
      if (index !== -1) {
        applications.value[index] = { ...applications.value[index], ...data }
      }
      
      // Mettre à jour aussi dans allApplications
      const allIndex = allApplications.value.findIndex(app => app.id === id)
      if (allIndex !== -1) {
        allApplications.value[allIndex] = { ...allApplications.value[allIndex], ...data }
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
  const deleteApplication = async (id: number, useAdminEndpoint = false) => {
    try {
      isSubmitting.value = true
      error.value = ''

      if (useAdminEndpoint) {
        await studentApplicationsService.deleteStudentApplication(id)
      } else {
        await studentApplicationsService.deleteMyStudentApplication(id)
      }

      // Retirer la candidature de la liste
      applications.value = applications.value.filter(app => app.id !== id)
      allApplications.value = allApplications.value.filter(app => app.id !== id)

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

      const response = await studentApplicationsService.updateMyStudentApplication(id, data)

      // Mettre à jour la candidature dans la liste
      const index = applications.value.findIndex(app => app.id === id)
      if (index !== -1) {
        applications.value[index] = response.data
      }
      
      // Mettre à jour aussi dans allApplications
      const allIndex = allApplications.value.findIndex(app => app.id === id)
      if (allIndex !== -1) {
        allApplications.value[allIndex] = response.data
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

      await studentApplicationsService.deleteMyStudentApplication(id)

      // Retirer la candidature de la liste
      applications.value = applications.value.filter(app => app.id !== id)
      allApplications.value = allApplications.value.filter(app => app.id !== id)

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
  const submitApplication = async (applicationId: number, sessionId?: string, useAdminEndpoint = false) => {
    try {
      isSubmitting.value = true
      error.value = ''

      await studentApplicationsService.submitStudentApplication(applicationId)

      showToast({ message: 'Candidature soumise avec succès', type: 'success' })
      
      // Recharger la liste avec le bon endpoint
      if (useAdminEndpoint) {
        await loadApplications(true)
      } else {
        await loadMyApplications(true)
      }

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

      const response = await studentApplicationsService.payTrainingFee(data)
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
    currentUserDetails.value = null
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
  const canEditApplication = (application: StudentApplicationOut | null): boolean => {
    if (!application) return false
    return application.status === ApplicationStatusEnum.SUBMITTED
  }

  /**
   * Vérifier si une candidature peut être supprimée
   */
  const canDeleteApplication = (application: StudentApplicationOut | null): boolean => {
    if (!application) return false
    return application.status === ApplicationStatusEnum.SUBMITTED
  }

  /**
   * Vérifier si une candidature peut être soumise
   */
  const canSubmitApplication = (application: StudentApplicationOut | null): boolean => {
    if (!application) return false
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
  // Removed auto-watcher to prevent conflicts with manual loading
  // Components should call loadMyApplications or loadApplications explicitly

  return {
    // State
    applications,
    currentApplication,
    currentUserDetails,
    isLoading,
    isSubmitting,
    error,
    totalCount,
    currentPage,
    pageSize,
    searchQuery,
    filters,
    sortBy,
    sortOrder,

    // Computed
    hasApplications,
    totalPages,
    canLoadMore,
    filteredApplications,
    paginatedApplications,
    myFilteredApplications,

    // Methods
    loadApplications,
    loadMyApplications,
    loadMoreApplications,
    searchApplications,
    applyFilters,
    resetFilters,
    loadApplication,
    loadUserDetails,
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
