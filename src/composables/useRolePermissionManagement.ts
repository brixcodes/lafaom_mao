import { ref, computed } from 'vue'
import { rolesPermissionsService } from '@/services/api/roles-permissions'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/components/toast/toastManager'
import { PermissionEnum, RoleEnum, type AssignPermissionsInput, type AssignRoleInput, type RoleOut, type PermissionOut } from '@/types/permissions'

export const useRolePermissionManagement = () => {
  const authStore = useAuthStore()

  // States
  const roles = ref<RoleOut[]>([])
  const permissions = ref<string[]>([])
  const userPermissions = ref<PermissionOut[]>([])
  const userRole = ref<RoleOut | null>(null)
  const myRole = ref<RoleOut | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const canManageRoles = computed(() => authStore.hasPermission(PermissionEnum.CAN_GIVE_ROLE))
  const canManagePermissions = computed(() => authStore.hasPermission(PermissionEnum.CAN_GIVE_PERMISSION))

  // Charger tous les rôles
  const loadRoles = async () => {
    try {
      isLoading.value = true
      error.value = null
      const response = await rolesPermissionsService.getRoles()
      roles.value = response.data || []
    } catch (err: any) {
      console.error('Erreur lors du chargement des rôles:', err)
      error.value = 'Erreur lors du chargement des rôles'
      roles.value = [] // S'assurer que c'est un tableau
      showToast({
        message: 'Erreur lors du chargement des rôles',
        type: 'error'
      })
    } finally {
      isLoading.value = false
    }
  }

  // Charger toutes les permissions
  const loadPermissions = async () => {
    try {
      isLoading.value = true
      error.value = null
      const response = await rolesPermissionsService.getPermissions()
      permissions.value = response.data || []
    } catch (err: any) {
      console.error('Erreur lors du chargement des permissions:', err)
      error.value = 'Erreur lors du chargement des permissions'
      permissions.value = [] // S'assurer que c'est un tableau
      showToast({
        message: 'Erreur lors du chargement des permissions',
        type: 'error'
      })
    } finally {
      isLoading.value = false
    }
  }

  // Charger les permissions d'un utilisateur
  const loadUserPermissions = async (userId: string) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await rolesPermissionsService.getUserPermissions(userId)
      userPermissions.value = response.data || []
    } catch (err: any) {
      console.error('Erreur lors du chargement des permissions utilisateur:', err)
      
      // Si c'est une erreur 403, ne pas afficher de toast d'erreur
      if (err.response?.status === 403) {
        console.warn('Accès refusé pour les permissions utilisateur - permissions insuffisantes')
        userPermissions.value = [] // Initialiser avec un tableau vide
        return
      }
      
      error.value = 'Erreur lors du chargement des permissions utilisateur'
      showToast({
        message: 'Erreur lors du chargement des permissions utilisateur',
        type: 'error'
      })
    } finally {
      isLoading.value = false
    }
  }

  // Charger le rôle d'un utilisateur
  const loadUserRole = async (userId: string) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await rolesPermissionsService.getUserRole(userId)
      userRole.value = response.data || null
    } catch (err: any) {
      console.error('Erreur lors du chargement du rôle utilisateur:', err)
      // Si l'erreur est "Role not found", c'est normal, l'utilisateur n'a pas de rôle
      if (err.response?.data?.error_code === 'role_not_found') {
        userRole.value = null
        error.value = null // Pas d'erreur, juste pas de rôle
      } else if (err.response?.status === 403) {
        console.warn('Accès refusé pour le rôle utilisateur - permissions insuffisantes')
        userRole.value = null
        error.value = null // Pas d'erreur, juste permissions insuffisantes
      } else {
        error.value = 'Erreur lors du chargement du rôle utilisateur'
        showToast({
          message: 'Erreur lors du chargement du rôle utilisateur',
          type: 'error'
        })
      }
    } finally {
      isLoading.value = false
    }
  }

  // Charger le rôle de l'utilisateur connecté
  const loadMyRole = async () => {
    try {
      isLoading.value = true
      error.value = null
      const response = await rolesPermissionsService.getMyRole()
      myRole.value = response.data || null
    } catch (err: any) {
      console.error('Erreur lors du chargement de mon rôle:', err)
      // Si l'erreur est "Role not found", c'est normal, l'utilisateur n'a pas de rôle
      if (err.response?.data?.error_code === 'role_not_found') {
        myRole.value = null
        error.value = null // Pas d'erreur, juste pas de rôle
      } else {
        error.value = 'Erreur lors du chargement de mon rôle'
        showToast({
          message: 'Erreur lors du chargement de mon rôle',
          type: 'error'
        })
      }
    } finally {
      isLoading.value = false
    }
  }

  // Assigner des permissions à un utilisateur
  const assignPermissions = async (data: AssignPermissionsInput) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await rolesPermissionsService.assignPermissions(data)

      showToast({
        message: 'Permissions assignées avec succès',
        type: 'success'
      })

      // Recharger les permissions de l'utilisateur
      await loadUserPermissions(data.user_id)

      return response
    } catch (err: any) {
      error.value = 'Erreur lors de l\'assignation des permissions'
      showToast({
        message: err.response?.data?.message || 'Erreur lors de l\'assignation des permissions',
        type: 'error'
      })
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Révoquer des permissions d'un utilisateur
  const revokePermissions = async (data: AssignPermissionsInput) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await rolesPermissionsService.revokePermissions(data)

      showToast({
        message: 'Permissions révoquées avec succès',
        type: 'success'
      })

      // Recharger les permissions de l'utilisateur
      await loadUserPermissions(data.user_id)

      return response
    } catch (err: any) {
      console.error('Erreur lors de la révocation des permissions:', err)
      error.value = 'Erreur lors de la révocation des permissions'
      showToast({
        message: err.response?.data?.message || 'Erreur lors de la révocation des permissions',
        type: 'error'
      })
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Assigner un rôle à un utilisateur
  const assignRole = async (data: AssignRoleInput) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await rolesPermissionsService.assignRole(data)

      showToast({
        message: 'Rôle assigné avec succès',
        type: 'success'
      })

      // Recharger les permissions et le rôle de l'utilisateur
      // Ne pas échouer si on n'a pas les permissions pour recharger
      try {
        await Promise.all([
          loadUserPermissions(data.user_id),
          loadUserRole(data.user_id)
        ])
      } catch (reloadErr: any) {
        console.warn('Impossible de recharger les données après assignation:', reloadErr)
        // Ne pas propager l'erreur, l'opération principale a réussi
      }

      return response
    } catch (err: any) {
      error.value = 'Erreur lors de l\'assignation du rôle'
      showToast({
        message: err.response?.data?.message || 'Erreur lors de l\'assignation du rôle',
        type: 'error'
      })
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Révoquer un rôle d'un utilisateur
  const revokeRole = async (data: AssignRoleInput) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await rolesPermissionsService.revokeRole(data)

      showToast({
        message: 'Rôle révoqué avec succès',
        type: 'success'
      })

      // Recharger les permissions et le rôle de l'utilisateur
      // Ne pas échouer si on n'a pas les permissions pour recharger
      try {
        await Promise.all([
          loadUserPermissions(data.user_id),
          loadUserRole(data.user_id)
        ])
      } catch (reloadErr: any) {
        console.warn('Impossible de recharger les données après révocation:', reloadErr)
        // Ne pas propager l'erreur, l'opération principale a réussi
      }

      return response
    } catch (err: any) {
      console.error('Erreur lors de la révocation du rôle:', err)
      error.value = 'Erreur lors de la révocation du rôle'
      showToast({
        message: err.response?.data?.message || 'Erreur lors de la révocation du rôle',
        type: 'error'
      })
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Vérifier si un utilisateur a une permission spécifique
  const hasUserPermission = (userId: string, permission: string): boolean => {
    return userPermissions.value.some(p => p.user_id === userId && p.permission === permission)
  }

  // Vérifier si un utilisateur a un rôle spécifique
  const hasUserRole = (userId: string, roleId: number): boolean => {
    return userPermissions.value.some(p => p.user_id === userId && p.role_id === roleId)
  }

  // Obtenir les permissions d'un utilisateur
  const getUserPermissions = (userId: string): string[] => {
    const permissions = userPermissions.value
      .filter(p => p.user_id === userId)
      .map(p => p.permission)
    return permissions
  }

  // Obtenir les rôles d'un utilisateur
  const getUserRoles = (userId: string): number[] => {
    const roles = userPermissions.value
      .filter(p => p.user_id === userId && p.role_id !== null)
      .map(p => p.role_id!)
    return roles
  }

  return {
    // States
    roles,
    permissions,
    userPermissions,
    userRole,
    myRole,
    isLoading,
    error,

    // Computed
    canManageRoles,
    canManagePermissions,

    // Methods
    loadRoles,
    loadPermissions,
    loadUserPermissions,
    loadUserRole,
    loadMyRole,
    assignPermissions,
    revokePermissions,
    assignRole,
    revokeRole,
    hasUserPermission,
    hasUserRole,
    getUserPermissions,
    getUserRoles,
  }
}