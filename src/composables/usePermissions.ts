import { computed, ref, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { permissionService } from '@/services/api/permissions'
import { usePermissionEvents } from '@/utils/permissionEvents'
import { 
  PermissionEnum, 
  RoleEnum, 
  TrainingPermission, 
  UserRole, 
  rolePermissions, 
  legacyRolePermissions,
  userRoleToRoleEnum 
} from '@/types/permissions'

export const usePermissions = () => {
  const authStore = useAuthStore()
  const { permissionEvents } = usePermissionEvents()
  
  // States
  const userPermissions = ref<string[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Charger les permissions depuis l'API
  const loadUserPermissions = async () => {
    if (!authStore.isAuthenticated) {
      userPermissions.value = []
      return
    }

    try {
      isLoading.value = true
      error.value = null
      const response = await permissionService.getMyPermissions()
      userPermissions.value = response.data?.map(p => p.permission) || []
    } catch (err) {
      console.error('Erreur lors du chargement des permissions:', err)
      error.value = 'Erreur lors du chargement des permissions'
      // Fallback sur les permissions basées sur le rôle
      userPermissions.value = getFallbackPermissions()
    } finally {
      isLoading.value = false
    }
  }

  // Permissions de fallback basées sur le rôle
  const getFallbackPermissions = (): string[] => {
    const currentRole = getCurrentRole()
    const currentRoleEnum = userRoleToRoleEnum[currentRole]
    return rolePermissions[currentRoleEnum] || []
  }

  const getCurrentRole = (): UserRole => {
    const user = authStore.user
    if (!user) return UserRole.STUDENT
    
    // Essayer de déterminer le rôle basé sur les données utilisateur
    const professionalStatus = user.professions_status?.professional_status
    
    // Mapping des statuts professionnels vers les rôles
    if (professionalStatus === 'admin' || professionalStatus === 'ADMIN') {
      return UserRole.ADMIN
    } else if (professionalStatus === 'teacher' || professionalStatus === 'instructor') {
      return UserRole.INSTRUCTOR
    } else {
      return UserRole.STUDENT
    }
  }

  const currentRole = computed(() => getCurrentRole())
  const currentRoleEnum = computed(() => userRoleToRoleEnum[currentRole.value])

  // Charger les permissions au montage
  onMounted(() => {
    loadUserPermissions()
  })

  // Écouter les événements de mise à jour des permissions
  watch(permissionEvents, (newEvents) => {
    if (newEvents.permissionsUpdated) {
      loadUserPermissions()
    }
  }, { deep: true })

  // Méthodes de vérification des permissions
  const hasPermission = (permission: PermissionEnum | TrainingPermission): boolean => {
    return userPermissions.value.includes(permission as PermissionEnum)
  }

  const hasAnyPermission = (permissions: (PermissionEnum | TrainingPermission)[]): boolean => {
    return permissions.some(permission => hasPermission(permission))
  }

  const hasAllPermissions = (permissions: (PermissionEnum | TrainingPermission)[]): boolean => {
    return permissions.every(permission => hasPermission(permission))
  }

  // Permissions spécifiques aux formations (pour compatibilité)
  const canViewTrainings = computed(() => hasPermission(TrainingPermission.VIEW_TRAININGS))
  const canCreateTraining = computed(() => hasPermission(TrainingPermission.CREATE_TRAINING))
  const canEditTraining = computed(() => hasPermission(TrainingPermission.EDIT_TRAINING))
  const canDeleteTraining = computed(() => hasPermission(TrainingPermission.DELETE_TRAINING))
  const canManageSessions = computed(() => hasPermission(TrainingPermission.MANAGE_SESSIONS))
  const canReviewApplications = computed(() => hasPermission(TrainingPermission.REVIEW_APPLICATIONS))

  // Permissions générales
  const canViewUsers = computed(() => hasPermission(PermissionEnum.CAN_VIEW_USER))
  const canCreateUsers = computed(() => hasPermission(PermissionEnum.CAN_CREATE_USER))
  const canUpdateUsers = computed(() => hasPermission(PermissionEnum.CAN_UPDATE_USER))
  const canDeleteUsers = computed(() => hasPermission(PermissionEnum.CAN_DELETE_USER))
  
  const canViewBlogs = computed(() => hasPermission(PermissionEnum.CAN_VIEW_BLOG))
  const canCreateBlogs = computed(() => hasPermission(PermissionEnum.CAN_CREATE_BLOG))
  const canUpdateBlogs = computed(() => hasPermission(PermissionEnum.CAN_UPDATE_BLOG))
  const canDeleteBlogs = computed(() => hasPermission(PermissionEnum.CAN_DELETE_BLOG))
  const canPublishBlogs = computed(() => hasPermission(PermissionEnum.CAN_PUBLISH_BLOG))
  
  const canViewJobOffers = computed(() => hasPermission(PermissionEnum.CAN_VIEW_JOB_OFFER))
  const canCreateJobOffers = computed(() => hasPermission(PermissionEnum.CAN_CREATE_JOB_OFFER))
  const canUpdateJobOffers = computed(() => hasPermission(PermissionEnum.CAN_UPDATE_JOB_OFFER))
  const canDeleteJobOffers = computed(() => hasPermission(PermissionEnum.CAN_DELETE_JOB_OFFER))
  
  const canViewJobApplications = computed(() => hasPermission(PermissionEnum.CAN_VIEW_JOB_APPLICATION))
  const canChangeJobApplicationStatus = computed(() => hasPermission(PermissionEnum.CAN_CHANGE_JOB_APPLICATION_STATUS))
  
  const canViewStudentApplications = computed(() => hasPermission(PermissionEnum.CAN_VIEW_STUDENT_APPLICATION))
  const canChangeStudentApplicationStatus = computed(() => hasPermission(PermissionEnum.CAN_CHANGE_STUDENT_APPLICATION_STATUS))
  
  const canViewPayments = computed(() => hasPermission(PermissionEnum.CAN_VIEW_PAYMENT))
  
  const canGivePermissions = computed(() => hasPermission(PermissionEnum.CAN_GIVE_PERMISSION))
  const canGiveRoles = computed(() => hasPermission(PermissionEnum.CAN_GIVE_ROLE))

  return {
    // États
    currentRole,
    currentRoleEnum,
    userPermissions,
    isLoading,
    error,
    
    // Méthodes
    loadUserPermissions,
    
    // Méthodes de vérification
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    
    // Permissions spécifiques aux formations
    canViewTrainings,
    canCreateTraining,
    canEditTraining,
    canDeleteTraining,
    canManageSessions,
    canReviewApplications,
    
    // Permissions utilisateurs
    canViewUsers,
    canCreateUsers,
    canUpdateUsers,
    canDeleteUsers,
    
    // Permissions blog
    canViewBlogs,
    canCreateBlogs,
    canUpdateBlogs,
    canDeleteBlogs,
    canPublishBlogs,
    
    // Permissions offres d'emploi
    canViewJobOffers,
    canCreateJobOffers,
    canUpdateJobOffers,
    canDeleteJobOffers,
    
    // Permissions candidatures emploi
    canViewJobApplications,
    canChangeJobApplicationStatus,
    
    // Permissions candidatures formation
    canViewStudentApplications,
    canChangeStudentApplicationStatus,
    
    // Permissions paiements
    canViewPayments,
    
    // Permissions de gestion
    canGivePermissions,
    canGiveRoles,
  }
}
