// Store Pinia pour les rôles et permissions
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { rolesPermissionsService } from '@/services/api/roles-permissions'
import type {
  Role,
  Permission,
  AssignRoleInput,
  AssignPermissionsInput,
  RoleOutSuccess,
  RoleListOutSuccess,
  PermissionOutSuccess,
  PermissionListOutSuccess,
} from '@/types/permissions'

export const useRolesPermissionsStore = defineStore('rolesPermissions', () => {
  // === STATE ===
  
  const roles = ref<Role[]>([])
  const permissions = ref<Permission[]>([])
  const userRoles = ref<Role[]>([])
  const userPermissions = ref<Permission[]>([])
  const myRole = ref<Role | null>(null)
  const myPermissions = ref<Permission[]>([])
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // === GETTERS ===
  
  const hasRoles = computed(() => roles.value.length > 0)
  const hasPermissions = computed(() => permissions.value.length > 0)
  const hasUserRoles = computed(() => userRoles.value.length > 0)
  const hasUserPermissions = computed(() => userPermissions.value.length > 0)
  
  const availableRoles = computed(() => 
    roles.value.filter(role => role.is_active)
  )
  
  const availablePermissions = computed(() => 
    permissions.value.filter(permission => permission.is_active)
  )
  
  const userRoleNames = computed(() => 
    userRoles.value.map(role => role.name)
  )
  
  const userPermissionNames = computed(() => 
    userPermissions.value.map(permission => permission.permission)
  )

  // === ACTIONS RÔLES ===
  
  const loadRoles = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await rolesPermissionsService.getRoles()
      roles.value = response.data || []
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des rôles'
      console.error('Error loading roles:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  const getRole = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await rolesPermissionsService.getRole(id)
      return response
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement du rôle'
      console.error('Error loading role:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // === ACTIONS PERMISSIONS ===
  
  const loadPermissions = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await rolesPermissionsService.getPermissions()
      permissions.value = response.data || []
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des permissions'
      console.error('Error loading permissions:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  const getPermission = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await rolesPermissionsService.getPermission(id)
      return response
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement de la permission'
      console.error('Error loading permission:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // === ACTIONS UTILISATEUR ===
  
  const loadUserRoles = async (userId: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await rolesPermissionsService.getUserRoles(userId)
      userRoles.value = response.data || []
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des rôles utilisateur'
      console.error('Error loading user roles:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  const loadUserPermissions = async (userId: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await rolesPermissionsService.getUserPermissions(userId)
      userPermissions.value = response.data || []
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des permissions utilisateur'
      console.error('Error loading user permissions:', err)
    } finally {
      isLoading.value = false
    }
  }
  
  const loadUserRole = async (userId: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await rolesPermissionsService.getUserRole(userId)
      return response
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement du rôle utilisateur'
      console.error('Error loading user role:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // === ACTIONS MON PROFIL ===
  
  const loadMyRole = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await rolesPermissionsService.getMyRole()
      myRole.value = response.data
      return response
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement de mon rôle'
      console.error('Error loading my role:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const loadMyPermissions = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await rolesPermissionsService.getMyPermissions()
      myPermissions.value = response.data || []
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement de mes permissions'
      console.error('Error loading my permissions:', err)
    } finally {
      isLoading.value = false
    }
  }

  // === ACTIONS ASSIGNATION ===
  
  const assignRole = async (userId: string, roleId: number) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await rolesPermissionsService.assignRole(userId, roleId)
      await loadUserRoles(userId) // Recharger les rôles utilisateur
      return response
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de l\'attribution du rôle'
      console.error('Error assigning role:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const revokeRole = async (userId: string, roleId: number) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await rolesPermissionsService.revokeRole(userId, roleId)
      await loadUserRoles(userId) // Recharger les rôles utilisateur
      return response
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la révocation du rôle'
      console.error('Error revoking role:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const assignPermissions = async (userId: string, permissions: string[]) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await rolesPermissionsService.assignPermissions(userId, permissions)
      await loadUserPermissions(userId) // Recharger les permissions utilisateur
      return response
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de l\'attribution des permissions'
      console.error('Error assigning permissions:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const revokePermissions = async (userId: string, permissions: string[]) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await rolesPermissionsService.revokePermissions(userId, permissions)
      await loadUserPermissions(userId) // Recharger les permissions utilisateur
      return response
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la révocation des permissions'
      console.error('Error revoking permissions:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // === ACTIONS UTILITAIRES ===
  
  const clearError = () => {
    error.value = null
  }
  
  const resetState = () => {
    roles.value = []
    permissions.value = []
    userRoles.value = []
    userPermissions.value = []
    myRole.value = null
    myPermissions.value = []
    isLoading.value = false
    error.value = null
  }
  
  const resetUserData = () => {
    userRoles.value = []
    userPermissions.value = []
  }

  return {
    // State
    roles,
    permissions,
    userRoles,
    userPermissions,
    myRole,
    myPermissions,
    isLoading,
    error,

    // Getters
    hasRoles,
    hasPermissions,
    hasUserRoles,
    hasUserPermissions,
    availableRoles,
    availablePermissions,
    userRoleNames,
    userPermissionNames,

    // Actions Rôles
    loadRoles,
    getRole,

    // Actions Permissions
    loadPermissions,
    getPermission,

    // Actions Utilisateur
    loadUserRoles,
    loadUserPermissions,
    loadUserRole,

    // Actions Mon Profil
    loadMyRole,
    loadMyPermissions,

    // Actions Assignation
    assignRole,
    revokeRole,
    assignPermissions,
    revokePermissions,

    // Actions Utilitaires
    clearError,
    resetState,
    resetUserData,
  }
})
