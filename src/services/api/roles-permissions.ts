import { apiService } from './base'

// ===== INTERFACES ROLES & PERMISSIONS =====

export interface AssignPermissionsInput {
  user_id: string
  permissions: string[]
}

export interface AssignRoleInput {
  user_id: string
  role_id: number
}

export interface PermissionOut {
  user_id?: string
  role_id?: number
  permission: string
}

export interface RoleOut {
  id: number
  name: string
  description?: string
}

export interface PermissionListOutSuccess {
  success: boolean
  message: string
  data: PermissionOut[]
}

export interface RoleOutSuccess {
  success: boolean
  message: string
  data: RoleOut
}

export interface RoleListOutSuccess {
  success: boolean
  message: string
  data: RoleOut[]
}

export interface PermissionSmallListOutSuccess {
  success: boolean
  message: string
  data: string[]
}

// ===== SERVICE ROLES & PERMISSIONS =====

class RolesPermissionsService {
  // === PERMISSIONS ===

  /**
   * Assigner des permissions à un utilisateur
   */
  async assignPermissions(data: AssignPermissionsInput): Promise<PermissionListOutSuccess> {
    const response = await apiService.post('/users/assign-permissions', data)
    return response as PermissionListOutSuccess
  }

  /**
   * Révoquer des permissions d'un utilisateur
   */
  async revokePermissions(data: AssignPermissionsInput): Promise<PermissionListOutSuccess> {
    const response = await apiService.post('/users/revoke-permissions', data)
    return response as PermissionListOutSuccess
  }

  /**
   * Récupérer toutes les permissions d'un utilisateur
   */
  async getUserPermissions(userId: string): Promise<PermissionListOutSuccess> {
    const response = await apiService.get(`/users/permissions/${userId}`)
    return response as PermissionListOutSuccess
  }

  // === ROLES ===

  /**
   * Assigner un rôle à un utilisateur
   */
  async assignRole(data: AssignRoleInput): Promise<PermissionListOutSuccess> {
    const response = await apiService.post('/users/assign-roles', data)
    return response as PermissionListOutSuccess
  }

  /**
   * Révoquer un rôle d'un utilisateur
   */
  async revokeRole(data: AssignRoleInput): Promise<PermissionListOutSuccess> {
    const response = await apiService.post('/users/revoke-role', data)
    return response as PermissionListOutSuccess
  }

  /**
   * Récupérer le rôle d'un utilisateur
   */
  async getUserRole(userId: string): Promise<RoleOutSuccess> {
    const response = await apiService.get(`/users/role/${userId}`)
    return response as RoleOutSuccess
  }

  /**
   * Récupérer mes permissions (utilisateur connecté)
   */
  async getMyPermissions(): Promise<PermissionSmallListOutSuccess> {
    const response = await apiService.get('/auth/my-permissions')
    return response as PermissionSmallListOutSuccess
  }

  /**
   * Récupérer mon rôle (utilisateur connecté)
   */
  async getMyRole(): Promise<RoleOutSuccess> {
    const response = await apiService.get('/auth/my-role')
    return response as RoleOutSuccess
  }

  // === ROLES & PERMISSIONS LISTS ===

  /**
   * Récupérer la liste de tous les rôles disponibles
   */
  async getRoles(): Promise<RoleListOutSuccess> {
    const response = await apiService.get('/roles')
    return response as RoleListOutSuccess
  }

  /**
   * Récupérer la liste de toutes les permissions disponibles
   */
  async getPermissions(): Promise<PermissionSmallListOutSuccess> {
    const response = await apiService.get('/permissions')
    return response as PermissionSmallListOutSuccess
  }
}

export const rolesPermissionsService = new RolesPermissionsService()
