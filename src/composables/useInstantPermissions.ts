import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { PermissionEnum } from '@/types/permissions'

/**
 * Composable pour les permissions instantanées
 * Utilise les permissions préchargées depuis localStorage
 */
export function useInstantPermissions() {
  const authStore = useAuthStore()

  // Vérification de permission réactive
  const hasPermission = computed(() => (permission: string | PermissionEnum) => {
    if (!authStore.isAuthenticated || !authStore.user) {
      return false
    }

    // Utiliser les permissions déjà chargées (depuis localStorage ou API)
    return authStore.hasPermission(permission.toString())
  })

  // Vérification de plusieurs permissions
  const hasPermissions = computed(() => (permissions: (string | PermissionEnum)[], requireAll = false) => {
    if (!permissions.length) return true
    if (!authStore.isAuthenticated || !authStore.user) return false

    const hasPermissions = permissions.map(p => hasPermission.value(p))
    
    return requireAll 
      ? hasPermissions.every(Boolean)
      : hasPermissions.some(Boolean)
  })

  // Vérification de rôle (RoleEnum)
  const hasRole = computed(() => (roleName: string) => {
    if (!authStore.isAuthenticated || !authStore.user) return false
    return authStore.user.roles?.[0]?.name === roleName
  })

  // Vérification de type d'utilisateur (UserTypeEnum)
  const hasUserType = computed(() => (userType: string) => {
    if (!authStore.isAuthenticated || !authStore.user) return false
    return authStore.user.user_type === userType
  })

  // Vérification de plusieurs rôles
  const hasRoles = computed(() => (roleNames: string[], requireAll = false) => {
    if (!roleNames.length) return true
    if (!authStore.isAuthenticated || !authStore.user) return false

    const hasRoles = roleNames.map(role => hasRole.value(role))
    
    return requireAll 
      ? hasRoles.every(Boolean)
      : hasRoles.some(Boolean)
  })

  // Getters réactifs
  const isAdmin = computed(() => hasRole.value('super_admin') || hasRole.value('admin'))
  const isManager = computed(() => hasRole.value('manager'))
  const isVisitor = computed(() => hasRole.value('visitor'))
  
  // Getters pour les types d'utilisateur
  const isUserTypeAdmin = computed(() => hasUserType.value('admin'))
  const isUserTypeStaff = computed(() => hasUserType.value('staff'))
  const isUserTypeTeacher = computed(() => hasUserType.value('teacher'))
  const isUserTypeStudent = computed(() => hasUserType.value('student'))

  const accessLevel = computed(() => {
    if (isAdmin.value) return 'admin'
    if (isManager.value) return 'manager'
    if (isVisitor.value) return 'visitor'
    return 'none'
  })

  // Permissions spécifiques pour la gestion des utilisateurs
  const canManageUsers = computed(() => 
    hasPermission.value('can_view_user') || 
    hasPermission.value('can_create_user') || 
    hasPermission.value('can_update_user') || 
    hasPermission.value('can_delete_user')
  )

  const canManagePermissions = computed(() => 
    hasPermission.value('can_give_permission') || 
    hasPermission.value('can_give_role')
  )

  const canManageRoles = computed(() => 
    hasPermission.value('can_give_role') || 
    hasPermission.value('can_view_role') || 
    hasPermission.value('can_create_role') || 
    hasPermission.value('can_update_role') || 
    hasPermission.value('can_delete_role')
  )

  return {
    hasPermission,
    hasPermissions,
    hasRole,
    hasRoles,
    hasUserType,
    isAdmin,
    isManager,
    isVisitor,
    isUserTypeAdmin,
    isUserTypeStaff,
    isUserTypeTeacher,
    isUserTypeStudent,
    accessLevel,
    canManageUsers,
    canManagePermissions,
    canManageRoles
  }
}
