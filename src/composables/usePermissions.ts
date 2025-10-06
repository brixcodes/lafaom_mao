import { computed } from 'vue'
import { permissionService } from '@/services/permissions'
import { useAuthStore } from '@/stores/auth'
import type { PermissionEnum } from '@/types/permissions'

/**
 * Composable pour la gestion des permissions
 * Fournit une interface réactive pour vérifier les permissions de l'utilisateur
 */
export function usePermissions() {
  const authStore = useAuthStore()

  // État réactif
  const permissions = computed(() => permissionService.permissionsList.value)
  const roles = computed(() => permissionService.rolesList.value)
  const loading = computed(() => permissionService.loading.value)
  const isInitialized = computed(() => permissionService.isInitialized.value)
  const lastUpdateTime = computed(() => permissionService.lastUpdateTime.value)

  /**
   * Vérifie si l'utilisateur a une permission spécifique
   * @param permission - La permission à vérifier
   * @returns true si l'utilisateur a la permission
   */
  const hasPermission = (permission: string | PermissionEnum): boolean => {
    if (!authStore.isAuthenticated) return false
    return permissionService.hasPermission(permission)
  }

  /**
   * Vérifie si l'utilisateur a plusieurs permissions
   * @param permissions - Les permissions à vérifier
   * @param requireAll - Si true, toutes les permissions sont requises
   * @returns true si les conditions sont remplies
   */
  const hasPermissions = (
    permissions: (string | PermissionEnum)[], 
    requireAll = false
  ): boolean => {
    if (!authStore.isAuthenticated) return false
    return permissionService.hasPermissions(permissions, requireAll)
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   * @param roleName - Le nom du rôle à vérifier
   * @returns true si l'utilisateur a le rôle
   */
  const hasRole = (roleName: string): boolean => {
    if (!authStore.isAuthenticated) return false
    return permissionService.hasRole(roleName)
  }

  /**
   * Vérifie si l'utilisateur a plusieurs rôles
   * @param roleNames - Les noms des rôles à vérifier
   * @param requireAll - Si true, tous les rôles sont requis
   * @returns true si les conditions sont remplies
   */
  const hasRoles = (roleNames: string[], requireAll = false): boolean => {
    if (!authStore.isAuthenticated) return false
    return permissionService.hasRoles(roleNames, requireAll)
  }

  /**
   * Vérifie si l'utilisateur peut effectuer une action sur un sujet
   * @param action - L'action (create, read, update, delete)
   * @param subject - Le sujet (user, blog, job_offer, etc.)
   * @returns true si l'utilisateur peut effectuer l'action
   */
  const can = (action: string, subject: string): boolean => {
    const permission = `can_${action}_${subject}`.toLowerCase()
    return hasPermission(permission)
  }

  /**
   * Vérifie si l'utilisateur peut voir un module
   * @param module - Le nom du module
   * @returns true si l'utilisateur peut voir le module
   */
  const canView = (module: string): boolean => {
    return can('view', module)
  }

  /**
   * Vérifie si l'utilisateur peut créer dans un module
   * @param module - Le nom du module
   * @returns true si l'utilisateur peut créer
   */
  const canCreate = (module: string): boolean => {
    return can('create', module)
  }

  /**
   * Vérifie si l'utilisateur peut modifier dans un module
   * @param module - Le nom du module
   * @returns true si l'utilisateur peut modifier
   */
  const canUpdate = (module: string): boolean => {
    return can('update', module)
  }

  /**
   * Vérifie si l'utilisateur peut supprimer dans un module
   * @param module - Le nom du module
   * @returns true si l'utilisateur peut supprimer
   */
  const canDelete = (module: string): boolean => {
    return can('delete', module)
  }

  /**
   * Récupère toutes les permissions de l'utilisateur
   */
  const getAllPermissions = () => {
    return permissionService.getAllPermissions()
  }

  /**
   * Récupère tous les rôles de l'utilisateur
   */
  const getAllRoles = () => {
    return permissionService.getAllRoles()
  }

  /**
   * Récupère les permissions par catégorie
   */
  const getPermissionsByCategory = () => {
    return permissionService.getPermissionsByCategory()
  }

  /**
   * Force le rafraîchissement des permissions
   */
  const refreshPermissions = async () => {
    await permissionService.refreshPermissions()
  }

  /**
   * Vérifie si l'utilisateur est administrateur
   */
  const isAdmin = computed(() => {
    return hasRole('super_admin') || hasRole('admin')
  })

  /**
   * Vérifie si l'utilisateur est manager
   */
  const isManager = computed(() => {
    return hasRole('manager')
  })

  /**
   * Vérifie si l'utilisateur est visiteur
   */
  const isVisitor = computed(() => {
    return hasRole('visitor')
  })

  /**
   * Récupère le niveau d'accès de l'utilisateur
   */
  const accessLevel = computed(() => {
    if (isAdmin.value) return 'admin'
    if (isManager.value) return 'manager'
    if (isVisitor.value) return 'visitor'
    return 'none'
  })

  return {
    // État
    permissions,
    roles,
    loading,
    isInitialized,
    lastUpdateTime,
    
    // Vérifications de permissions
    hasPermission,
    hasPermissions,
    hasRole,
    hasRoles,
    
    // Vérifications d'actions
    can,
    canView,
    canCreate,
    canUpdate,
    canDelete,
    
    // Récupération de données
    getAllPermissions,
    getAllRoles,
    getPermissionsByCategory,
    
    // Actions
    refreshPermissions,
    
    // Helpers
    isAdmin,
    isManager,
    isVisitor,
    accessLevel
  }
}