import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { PermissionEnum } from '@/types/permissions'

/**
 * Service de permissions simplifié qui utilise les données de l'utilisateur connecté
 * sans faire d'appels API supplémentaires
 */
class SimplePermissionService {
  private authStore = useAuthStore()

  /**
   * Vérifie si l'utilisateur a une permission spécifique
   * @param permission - La permission à vérifier
   * @returns true si l'utilisateur a la permission
   */
  hasPermission(permission: string | PermissionEnum): boolean {
    if (!this.authStore.isAuthenticated || !this.authStore.user) {
      console.log(`[SimplePermissions] Permission ${permission}: Non authentifié`)
      return false
    }

    // Utiliser les permissions chargées depuis l'API ou localStorage
    const hasPermission = this.authStore.hasPermission(permission.toString())
    console.log(`[SimplePermissions] Permission ${permission}: ${hasPermission} (permissions disponibles: ${this.authStore.userPermissions?.length || 0})`)
    return hasPermission
  }

  /**
   * Vérifie si l'utilisateur a plusieurs permissions
   * @param permissions - Les permissions à vérifier
   * @param requireAll - Si true, toutes les permissions sont requises
   * @returns true si les conditions sont remplies
   */
  hasPermissions(permissions: (string | PermissionEnum)[], requireAll = false): boolean {
    if (!permissions.length) return true

    const hasPermissions = permissions.map(p => this.hasPermission(p))
    
    return requireAll 
      ? hasPermissions.every(Boolean)
      : hasPermissions.some(Boolean)
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   * @param roleName - Le nom du rôle à vérifier
   * @returns true si l'utilisateur a le rôle
   */
  hasRole(roleName: string): boolean {
    if (!this.authStore.isAuthenticated || !this.authStore.user) {
      return false
    }

    // Pour l'instant, on se base sur le type d'utilisateur
    // TODO: Implémenter la gestion des rôles si nécessaire
    return this.authStore.user.user_type === roleName
  }

  /**
   * Vérifie si l'utilisateur a plusieurs rôles
   * @param roleNames - Les noms des rôles à vérifier
   * @param requireAll - Si true, tous les rôles sont requis
   * @returns true si les conditions sont remplies
   */
  hasRoles(roleNames: string[], requireAll = false): boolean {
    if (!roleNames.length) return true

    const hasRoles = roleNames.map(role => this.hasRole(role))
    
    return requireAll 
      ? hasRoles.every(Boolean)
      : hasRoles.some(Boolean)
  }

  /**
   * Vérifie une permission basée sur le rôle de l'utilisateur
   */
  private checkPermissionForRole(permission: string | PermissionEnum, role: string): boolean {
    const permissionStr = permission.toString()
    
    // Super admin a toutes les permissions
    if (role === 'super_admin' || role === 'admin') {
      return true
    }

    // Permissions par rôle
    const rolePermissions: Record<string, string[]> = {
      'manager': [
        'can_view_user', 'can_create_user', 'can_update_user',
        'can_view_blog', 'can_create_blog', 'can_update_blog', 'can_delete_blog', 'can_publish_blog',
        'can_view_job_offer', 'can_create_job_offer', 'can_update_job_offer', 'can_delete_job_offer',
        'can_view_job_application', 'can_change_job_application_status', 'can_delete_job_attachment',
        'can_view_training', 'can_create_training', 'can_update_training', 'can_delete_training',
        'can_view_training_session', 'can_create_training_session', 'can_update_training_session', 'can_delete_training_session',
        'can_view_student_application', 'can_change_student_application_status', 'can_delete_student_attachment',
        'can_view_reclamation', 'can_change_reclamation_status',
        'can_view_organization_center', 'can_create_organization_center', 'can_update_organization_center', 'can_delete_organization_center',
        'can_view_payment'
      ],
      'visitor': [
        'can_view_blog', 'can_view_job_offer', 'can_view_training', 'can_view_training_session'
      ]
    }

    return rolePermissions[role]?.includes(permissionStr) || false
  }

  // Getters réactifs
  get isAdmin() {
    return computed(() => this.hasRole('super_admin') || this.hasRole('admin'))
  }

  get isManager() {
    return computed(() => this.hasRole('manager'))
  }

  get isVisitor() {
    return computed(() => this.hasRole('visitor'))
  }

  get accessLevel() {
    return computed(() => {
      if (this.isAdmin.value) return 'admin'
      if (this.isManager.value) return 'manager'
      if (this.isVisitor.value) return 'visitor'
      return 'none'
    })
  }
}

// Instance singleton
export const simplePermissionService = new SimplePermissionService()

// Export des fonctions utilitaires
export const useSimplePermissions = () => {
  return {
    hasPermission: (permission: string | PermissionEnum) => simplePermissionService.hasPermission(permission),
    hasPermissions: (permissions: (string | PermissionEnum)[], requireAll = false) => 
      simplePermissionService.hasPermissions(permissions, requireAll),
    hasRole: (roleName: string) => simplePermissionService.hasRole(roleName),
    hasRoles: (roleNames: string[], requireAll = false) => simplePermissionService.hasRoles(roleNames, requireAll),
    isAdmin: simplePermissionService.isAdmin,
    isManager: simplePermissionService.isManager,
    isVisitor: simplePermissionService.isVisitor,
    accessLevel: simplePermissionService.accessLevel
  }
}
