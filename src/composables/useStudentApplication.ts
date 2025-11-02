// Composable pour la gestion des candidatures d'étudiants

import { ref, computed, watch } from 'vue'
import { studentApplicationsService } from '@/services/api/student-applications'
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
      // Supprimé : filtre is_paid (laisser l'API gérer)

      return true;
    });
  });

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
   */
  const loadApplications = async (reset = false) => {
    try {
      isLoading.value = true;
      error.value = '';

      if (reset) {
        currentPage.value = 1;
        applications.value = [];
      }

      const params: StudentApplicationFilter = {
        page: currentPage.value,
        page_size: pageSize.value,
        ...filters.value,
      };

      // Ajouter le paramètre de recherche si présent
      if (searchQuery.value) {
        params.search = searchQuery.value;
      }

      console.log('🔍 Envoi requête API admin avec params:', params);
      const response = await studentApplicationsService.getStudentApplications(params);
      console.log('📋 Réponse API admin:', response);
      applications.value = reset ? response.data : [...applications.value, ...response.data];
      totalCount.value = response.total_number;
    } catch (err: any) {
      console.error('Erreur lors du chargement des candidatures:', err);
      error.value = 'Erreur lors du chargement des candidatures';
      showToast({ message: 'Erreur lors du chargement des candidatures', type: 'error' });
    } finally {
      isLoading.value = false;
    }
  };

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

      // Vérifier si l'utilisateur est connecté
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

      // Ajouter le paramètre de recherche si présent
      if (searchQuery.value) {
        params.search = searchQuery.value
      }

      console.log('🔍 Chargement des candidatures de l\'utilisateur connecté avec params:', params)
      const response = await studentApplicationsService.getMyStudentApplications(params)
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
   * Rechercher des candidatures (utilise loadApplications pour admin par défaut)
   */
  const searchApplications = async (query: string, useAdminEndpoint = false) => {
    searchQuery.value = query
    if (useAdminEndpoint) {
      await loadApplications(true)
    } else {
      await loadMyApplications(true)
    }
  }

  /**
   * Appliquer des filtres (utilise loadApplications pour admin par défaut)
   */
  const applyFilters = async (newFilters: StudentApplicationSearchFilters, useAdminEndpoint = false) => {
    filters.value = { ...filters.value, ...newFilters }
    if (useAdminEndpoint) {
      await loadApplications(true)
    } else {
      await loadMyApplications(true)
    }
  }

  /**
   * Réinitialiser les filtres (utilise loadApplications pour admin par défaut)
   */
  const resetFilters = async (useAdminEndpoint = false) => {
    filters.value = {}
    searchQuery.value = ''
    if (useAdminEndpoint) {
      await loadApplications(true)
    } else {
      await loadMyApplications(true)
    }
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

      await studentApplicationsService.deleteMyStudentApplication(id)

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

      const response = await studentApplicationsService.updateMyStudentApplication(id, data)

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

      await studentApplicationsService.deleteMyStudentApplication(id)

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
