// Service API pour la gestion des permissions et rôles
import { apiService } from './base'
import { API_ENDPOINTS } from '@/config/api'
import type { BaseOutSuccess } from '@/types'
import { PermissionEnum, RoleEnum } from '@/types/permissions'

// Types pour les permissions et rôles
export interface PermissionOut {
  user_id: string | null
  role_id: number | null
  permission: string
}

export interface RoleOut {
  id: number
  name: string
  description?: string
}

export interface AssignPermissionsInput {
  user_id: string
  permissions: string[]
}

export interface AssignRoleInput {
  user_id: string
  role_id: number
}

export interface PermissionListOutSuccess extends BaseOutSuccess<PermissionOut[]> {}
export interface RoleListOutSuccess extends BaseOutSuccess<RoleOut[]> {}

export class PermissionService {
  
  // === PERMISSIONS ===
  
  /**
   * Récupérer toutes les permissions d'un utilisateur
   */
  async getUserPermissions(userId: string): Promise<PermissionListOutSuccess> {
    return apiService.get(`/users/permissions/${userId}`)
  }

  /**
   * Récupérer les permissions de l'utilisateur connecté
   */
  async getMyPermissions(): Promise<PermissionListOutSuccess> {
    try {
      const response = await apiService.get('/auth/my-permissions')
      return {
        success: true,
        message: 'Permissions récupérées avec succès',
        data: response.data || []
      }
    } catch (error) {
      console.warn('Impossible de récupérer les permissions depuis l\'API, utilisation des permissions basées sur le rôle:', error)
      // Fallback sur les permissions basées sur le rôle
      return {
        success: true,
        message: 'Permissions basées sur le rôle',
        data: []
      }
    }
  }
  
  /**
   * Assigner des permissions à un utilisateur
   */
  async assignPermissions(data: AssignPermissionsInput): Promise<PermissionListOutSuccess> {
    return apiService.post('/users/assign-permissions', data, {
      successMessage: 'Permissions assignées avec succès',
      errorMessage: 'Erreur lors de l\'assignation des permissions'
    })
  }
  
  /**
   * Révoquer des permissions d'un utilisateur
   */
  async revokePermissions(data: AssignPermissionsInput): Promise<PermissionListOutSuccess> {
    return apiService.post('/users/revoke-permissions', data, {
      successMessage: 'Permissions révoquées avec succès', 
      errorMessage: 'Erreur lors de la révocation des permissions'
    })
  }
  
  /**
   * Récupérer la liste de toutes les permissions disponibles
   */
  async getPermissions(): Promise<string[]> {
    try {
      const response = await apiService.get('/permissions') as { data: string[] }
      return response.data || Object.values(PermissionEnum)
    } catch (error) {
      console.warn('Impossible de récupérer les permissions depuis l\'API, utilisation des permissions par défaut:', error)
      return Object.values(PermissionEnum)
    }
  }
  
  // === ROLES ===
  
  /**
   * Assigner un rôle à un utilisateur
   */
  async assignRole(data: AssignRoleInput): Promise<PermissionListOutSuccess> {
    return apiService.post('/users/assign-roles', data, {
      successMessage: 'Rôle assigné avec succès',
      errorMessage: 'Erreur lors de l\'assignation du rôle'
    })
  }
  
  /**
   * Révoquer un rôle d'un utilisateur  
   */
  async revokeRole(data: AssignRoleInput): Promise<PermissionListOutSuccess> {
    return apiService.post('/users/revoke-role', data, {
      successMessage: 'Rôle révoqué avec succès',
      errorMessage: 'Erreur lors de la révocation du rôle'
    })
  }
  
  /**
   * Récupérer la liste de tous les rôles disponibles
   */
  async getRoles(): Promise<RoleOut[]> {
    try {
      const response = await apiService.get('/roles') as { data: RoleOut[] }
      return response.data || [
        { id: 1, name: RoleEnum.SUPER_ADMIN, description: 'Super administrateur avec tous les droits' },
        { id: 2, name: RoleEnum.MANAGER, description: 'Gestionnaire avec droits étendus' },
        { id: 3, name: RoleEnum.VISITOR, description: 'Visiteur avec droits limités' }
      ]
    } catch (error) {
      console.warn('Impossible de récupérer les rôles depuis l\'API, utilisation des rôles par défaut:', error)
      return [
        { id: 1, name: RoleEnum.SUPER_ADMIN, description: 'Super administrateur avec tous les droits' },
        { id: 2, name: RoleEnum.MANAGER, description: 'Gestionnaire avec droits étendus' },
        { id: 3, name: RoleEnum.VISITOR, description: 'Visiteur avec droits limités' }
      ]
    }
  }
}

// Instance singleton
export const permissionService = new PermissionService()