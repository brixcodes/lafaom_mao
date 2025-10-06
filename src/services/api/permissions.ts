import { apiService } from './base'
import { useAuthStore } from '@/stores/auth'
import type { PermissionOut, RoleOut } from '@/types/permissions'

// Types pour les réponses API
export interface UserPermissionsResponse {
  data: PermissionOut[]
  message: string
  success: boolean
}

export interface UserRolesResponse {
  data: RoleOut[]
  message: string
  success: boolean
}

// Service API pour les permissions
class PermissionsApiService {
  /**
   * Récupère toutes les permissions de l'utilisateur connecté
   * Utilise l'endpoint existant qui nécessite l'ID utilisateur
   */
  async getUserPermissions(): Promise<PermissionOut[]> {
    const authStore = useAuthStore()
    if (!authStore.user?.id) {
      throw new Error('User not authenticated')
    }
    
    const response = await apiService.get<UserPermissionsResponse>(`/users/permissions/${authStore.user.id}`)
    return response.data
  }

  /**
   * Récupère tous les rôles de l'utilisateur connecté
   * Utilise l'endpoint existant qui nécessite l'ID utilisateur
   */
  async getUserRoles(): Promise<RoleOut[]> {
    const authStore = useAuthStore()
    if (!authStore.user?.id) {
      throw new Error('User not authenticated')
    }
    
    const response = await apiService.get<UserRolesResponse>(`/users/role/${authStore.user.id}`)
    return [response.data] // L'endpoint retourne un seul rôle, on le met dans un array
  }

  /**
   * Récupère les permissions et rôles de l'utilisateur connecté
   */
  async getUserPermissionsAndRoles(): Promise<{
    permissions: PermissionOut[]
    roles: RoleOut[]
  }> {
    try {
      const [permissions, roles] = await Promise.all([
        this.getUserPermissions(),
        this.getUserRoles()
      ])
      
      return { permissions, roles }
    } catch (error) {
      console.warn('Impossible de charger les permissions depuis l\'API, utilisation des permissions par défaut')
      
      // Fallback: utiliser les permissions basées sur le rôle de l'utilisateur
      const authStore = useAuthStore()
      const userRole = authStore.user?.role || 'visitor'
      
      return {
        permissions: this.getDefaultPermissionsForRole(userRole),
        roles: [{ id: 1, name: userRole, description: `Rôle ${userRole}` }]
      }
    }
  }

  /**
   * Récupère les permissions par défaut basées sur le rôle
   */
  private getDefaultPermissionsForRole(role: string): PermissionOut[] {
    const permissions: PermissionOut[] = []
    
    // Permissions basées sur le rôle
    switch (role.toLowerCase()) {
      case 'super_admin':
      case 'admin':
        // Toutes les permissions
        Object.values(require('@/types/permissions').PermissionEnum).forEach(permission => {
          permissions.push({
            user_id: null,
            role_id: null,
            permission: permission
          })
        })
        break
        
      case 'manager':
        // Permissions de gestion
        const managerPermissions = [
          'can_view_user', 'can_create_user', 'can_update_user',
          'can_view_blog', 'can_create_blog', 'can_update_blog', 'can_delete_blog', 'can_publish_blog',
          'can_view_job_offer', 'can_create_job_offer', 'can_update_job_offer', 'can_delete_job_offer',
          'can_view_job_application', 'can_change_job_application_status',
          'can_view_training', 'can_create_training', 'can_update_training', 'can_delete_training',
          'can_view_training_session', 'can_create_training_session', 'can_update_training_session', 'can_delete_training_session',
          'can_view_student_application', 'can_change_student_application_status',
          'can_view_reclamation', 'can_change_reclamation_status',
          'can_view_organization_center', 'can_create_organization_center', 'can_update_organization_center', 'can_delete_organization_center',
          'can_view_payment'
        ]
        managerPermissions.forEach(permission => {
          permissions.push({
            user_id: null,
            role_id: null,
            permission: permission
          })
        })
        break
        
      case 'visitor':
      default:
        // Permissions de lecture uniquement
        const visitorPermissions = [
          'can_view_blog', 'can_view_job_offer', 'can_view_training', 'can_view_training_session'
        ]
        visitorPermissions.forEach(permission => {
          permissions.push({
            user_id: null,
            role_id: null,
            permission: permission
          })
        })
        break
    }
    
    return permissions
  }
}

// Instance singleton
export const permissionsApiService = new PermissionsApiService()
