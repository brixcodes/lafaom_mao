import { ref, computed } from 'vue'
import { permissionService } from '@/services/api/permissions'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/components/toast/toastManager'
import { PermissionEnum, RoleEnum, type AssignPermissionsInput, type AssignRoleInput, type RoleOut, type PermissionOut } from '@/types/permissions'

export const useRolePermissionManagement = () => {
  const authStore = useAuthStore()
  
  // States
  const roles = ref<RoleOut[]>([])
  const permissions = ref<string[]>([])
  const userPermissions = ref<PermissionOut[]>([])
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
      const response = await permissionService.getRoles()
      roles.value = response
    } catch (err: any) {
      console.error('Erreur lors du chargement des rôles:', err)
      error.value = 'Erreur lors du chargement des rôles'
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
      const response = await permissionService.getPermissions()
      permissions.value = response
    } catch (err: any) {
      console.error('Erreur lors du chargement des permissions:', err)
      error.value = 'Erreur lors du chargement des permissions'
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
      const response = await permissionService.getUserPermissions(userId)
      userPermissions.value = response.data || []
    } catch (err: any) {
      console.error('Erreur lors du chargement des permissions utilisateur:', err)
      error.value = 'Erreur lors du chargement des permissions utilisateur'
      showToast({
        message: 'Erreur lors du chargement des permissions utilisateur',
        type: 'error'
      })
    } finally {
      isLoading.value = false
    }
  }

  // Assigner des permissions à un utilisateur
  const assignPermissions = async (data: AssignPermissionsInput) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await permissionService.assignPermissions(data)
      
      showToast({
        message: 'Permissions assignées avec succès',
        type: 'success'
      })
      
      // Recharger les permissions de l'utilisateur
      await loadUserPermissions(data.user_id)
      
      return response
    } catch (err: any) {
      console.error('Erreur lors de l\'assignation des permissions:', err)
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
      
      const response = await permissionService.revokePermissions(data)
      
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
      
      const response = await permissionService.assignRole(data)
      
      showToast({
        message: 'Rôle assigné avec succès',
        type: 'success'
      })
      
      // Recharger les permissions de l'utilisateur
      await loadUserPermissions(data.user_id)
      
      return response
    } catch (err: any) {
      console.error('Erreur lors de l\'assignation du rôle:', err)
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
      
      const response = await permissionService.revokeRole(data)
      
      showToast({
        message: 'Rôle révoqué avec succès',
        type: 'success'
      })
      
      // Recharger les permissions de l'utilisateur
      await loadUserPermissions(data.user_id)
      
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
    return userPermissions.value
      .filter(p => p.user_id === userId)
      .map(p => p.permission)
  }

  // Obtenir les rôles d'un utilisateur
  const getUserRoles = (userId: string): number[] => {
    return userPermissions.value
      .filter(p => p.user_id === userId && p.role_id !== null)
      .map(p => p.role_id!)
  }

  return {
    // States
    roles,
    permissions,
    userPermissions,
    isLoading,
    error,
    
    // Computed
    canManageRoles,
    canManagePermissions,
    
    // Methods
    loadRoles,
    loadPermissions,
    loadUserPermissions,
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
