import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useAuthStore } from './auth'
import { permissionService } from '@/services/api/permissions'
import { usePermissionEvents } from '@/utils/permissionEvents'
import { PermissionEnum, RoleEnum, rolePermissions, userRoleToRoleEnum, UserRole } from '@/types/permissions'

export const usePermissionStore = defineStore('permission', () => {
  // State
  const permissions = ref<string[]>([])
  const userRoles = ref<string[]>([])
  const { permissionEvents } = usePermissionEvents()

  // Getters
  const hasPermission = computed(() => (permission: string) => {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) return false
    
    // Vérifier les permissions directes de l'utilisateur
    if (permissions.value.includes(permission)) {
      return true
    }
    
    // Vérifier les permissions basées sur les rôles
    const user = authStore.user
    if (!user) return false
    
    // Déterminer le rôle de l'utilisateur
    const professionalStatus = user.professions_status?.professional_status
    let userRole: UserRole = UserRole.STUDENT
    
    if (professionalStatus === 'admin' || professionalStatus === 'ADMIN') {
      userRole = UserRole.ADMIN
    } else if (professionalStatus === 'teacher' || professionalStatus === 'instructor') {
      userRole = UserRole.INSTRUCTOR
    }
    
    const roleEnum = userRoleToRoleEnum[userRole]
    const rolePermissionsList = rolePermissions[roleEnum] || []
    
    return rolePermissionsList.includes(permission as PermissionEnum)
  })

  const hasAnyPermission = computed(() => (permissionList: string[]) => {
    return permissionList.some(permission => hasPermission.value(permission))
  })

  const hasAllPermissions = computed(() => (permissionList: string[]) => {
    return permissionList.every(permission => hasPermission.value(permission))
  })

  const hasRole = computed(() => (role: string) => {
    return userRoles.value.includes(role)
  })

  const hasAnyRole = computed(() => (roleList: string[]) => {
    return roleList.some(role => hasRole.value(role))
  })

  const hasAllRoles = computed(() => (roleList: string[]) => {
    return roleList.every(role => hasRole.value(role))
  })

  // Actions
  const setPermissions = (newPermissions: string[]) => {
    permissions.value = newPermissions
  }

  const setUserRoles = (roles: string[]) => {
    userRoles.value = roles
  }

  const addPermission = (permission: string) => {
    if (!permissions.value.includes(permission)) {
      permissions.value.push(permission)
    }
  }

  const removePermission = (permission: string) => {
    const index = permissions.value.indexOf(permission)
    if (index > -1) {
      permissions.value.splice(index, 1)
    }
  }

  const addRole = (role: string) => {
    if (!userRoles.value.includes(role)) {
      userRoles.value.push(role)
    }
  }

  const removeRole = (role: string) => {
    const index = userRoles.value.indexOf(role)
    if (index > -1) {
      userRoles.value.splice(index, 1)
    }
  }

  const clearPermissions = () => {
    permissions.value = []
  }

  const clearRoles = () => {
    userRoles.value = []
  }

  const clearAll = () => {
    clearPermissions()
    clearRoles()
  }

  // Charger les permissions depuis l'API
  const loadPermissions = async () => {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      permissions.value = []
      return
    }

    try {
      const response = await permissionService.getMyPermissions()
      permissions.value = response.data?.map(p => p.permission) || []
    } catch (error) {
      console.error('Erreur lors du chargement des permissions:', error)
      // Fallback sur les permissions basées sur le rôle
      const currentRole = getCurrentRole()
      const currentRoleEnum = userRoleToRoleEnum[currentRole]
      permissions.value = rolePermissions[currentRoleEnum] || []
    }
  }

  const getCurrentRole = (): UserRole => {
    const authStore = useAuthStore()
    const user = authStore.user
    if (!user) return UserRole.STUDENT
    
    const professionalStatus = user.professions_status?.professional_status
    
    if (professionalStatus === 'admin' || professionalStatus === 'ADMIN') {
      return UserRole.ADMIN
    } else if (professionalStatus === 'teacher' || professionalStatus === 'instructor') {
      return UserRole.INSTRUCTOR
    } else {
      return UserRole.STUDENT
    }
  }

  // Écouter les événements de mise à jour des permissions
  watch(permissionEvents, (newEvents) => {
    if (newEvents.permissionsUpdated) {
      loadPermissions()
    }
  }, { deep: true })

  return {
    // State
    permissions,
    userRoles,
    
    // Getters
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    
    // Actions
    setPermissions,
    setUserRoles,
    addPermission,
    removePermission,
    addRole,
    removeRole,
    clearPermissions,
    clearRoles,
    clearAll,
    loadPermissions
  }
})
