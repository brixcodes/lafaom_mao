import { ApiService } from './apiService'
import type {
  UserSimpleOut,
  UserFullOut,
  CreateUserInput,
  UpdateUserInput,
  UpdateStatusInput,
  UserFilter,
  AssignPermissionsInput,
  AssignRoleInput,
  UserListInput,
  RoleOut,
  PermissionOut,
  UserOutSuccess,
  UserFullOutSuccess,
  UserListOutSuccess,
  UsersPageOutSuccess,
  RoleOutSuccess,
  RoleListOutSuccess,
  PermissionOutSuccess,
  PermissionListOutSuccess,
  UserStatusEnum,
  UserTypeEnum,
  UserWithPermissions,
} from '@/types/user'

// Cache management
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number // Time to live in milliseconds
}

class UserCache {
  private cache = new Map<string, CacheEntry<any>>()
  private readonly defaultTTL = 5 * 60 * 1000 // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const isExpired = Date.now() - entry.timestamp > entry.ttl
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear()
      return
    }

    const keys = Array.from(this.cache.keys())
    const regex = new RegExp(pattern)
    keys.forEach(key => {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    })
  }

  invalidateUser(userId: string): void {
    this.invalidate(`user_${userId}`)
    this.invalidate(`user_full_${userId}`)
    this.invalidate('users_list')
    this.invalidate('users_page')
  }
}

export class UserService {
  private cache = new UserCache()

  constructor(private apiService: ApiService = new ApiService()) {}

  // === USER MANAGEMENT ===

  /**
   * Récupère tous les utilisateurs avec pagination et filtres
   */
  async getUsers(filters?: UserFilter): Promise<UsersPageOutSuccess> {
    try {
      // Créer une clé de cache basée sur les filtres
      const cacheKey = `users_page_${JSON.stringify(filters || {})}`
      const cached = this.cache.get<UsersPageOutSuccess>(cacheKey)
      if (cached) return cached

      const params = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value))
          }
        })
      }

      const url = `/users${params.toString() ? `?${params.toString()}` : ''}`
      const response = await this.apiService.get<UsersPageOutSuccess>(url)
      
      // Cache pour 2 minutes
      this.cache.set(cacheKey, response, 2 * 60 * 1000)
      return response

    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error)
      throw new Error('Impossible de récupérer la liste des utilisateurs')
    }
  }

  /**
   * Récupère un utilisateur par son ID (version simple)
   */
  async getUser(userId: string, useCache: boolean = true): Promise<UserOutSuccess> {
    try {
      const cacheKey = `user_${userId}`
      
      if (useCache) {
        const cached = this.cache.get<UserOutSuccess>(cacheKey)
        if (cached) return cached
      }

      const response = await this.apiService.get<UserOutSuccess>(`/users/${userId}`)
      
      // Cache pour 5 minutes
      this.cache.set(cacheKey, response)
      return response

    } catch (error) {
      console.error(`Erreur lors de la récupération de l\'utilisateur ${userId}:`, error)
      throw new Error(`Impossible de récupérer l\'utilisateur ${userId}`)
    }
  }

  /**
   * Récupère un utilisateur avec toutes ses informations (version complète)
   */
  async getUserFull(userId: string, useCache: boolean = true): Promise<UserFullOutSuccess> {
    try {
      const cacheKey = `user_full_${userId}`
      
      if (useCache) {
        const cached = this.cache.get<UserFullOutSuccess>(cacheKey)
        if (cached) return cached
      }

      const response = await this.apiService.get<UserFullOutSuccess>(`/users/${userId}/full`)
      
      // Cache pour 5 minutes
      this.cache.set(cacheKey, response)
      return response

    } catch (error) {
      console.error(`Erreur lors de la récupération complète de l\'utilisateur ${userId}:`, error)
      throw new Error(`Impossible de récupérer les détails de l\'utilisateur ${userId}`)
    }
  }

  /**
   * Crée un nouvel utilisateur
   */
  async createUser(userData: CreateUserInput): Promise<UserOutSuccess> {
    try {
      const response = await this.apiService.post<UserOutSuccess>('/users', userData)
      
      // Invalider le cache des listes
      this.cache.invalidate('users_page')
      this.cache.invalidate('users_list')
      
      return response

    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error)
      if (error instanceof Error && error.message.includes('409')) {
        throw new Error('Un utilisateur avec cet email existe déjà')
      }
      throw new Error('Impossible de créer l\'utilisateur')
    }
  }

  /**
   * Met à jour un utilisateur
   */
  async updateUser(userId: string, userData: UpdateUserInput): Promise<UserOutSuccess> {
    try {
      const response = await this.apiService.put<UserOutSuccess>(`/users/${userId}`, userData)
      
      // Invalider le cache de cet utilisateur
      this.cache.invalidateUser(userId)
      
      return response

    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l\'utilisateur ${userId}:`, error)
      if (error instanceof Error && error.message.includes('409')) {
        throw new Error('Un utilisateur avec cet email existe déjà')
      }
      throw new Error(`Impossible de mettre à jour l\'utilisateur ${userId}`)
    }
  }

  /**
   * Met à jour le statut d'un utilisateur
   */
  async updateUserStatus(userId: string, status: UserStatusEnum): Promise<UserOutSuccess> {
    try {
      const statusData: UpdateStatusInput = { status }
      const response = await this.apiService.put<UserOutSuccess>(`/users/${userId}/status`, statusData)
      
      // Invalider le cache de cet utilisateur
      this.cache.invalidateUser(userId)
      
      return response

    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut de l\'utilisateur ${userId}:`, error)
      throw new Error(`Impossible de mettre à jour le statut de l\'utilisateur ${userId}`)
    }
  }

  /**
   * Supprime un utilisateur
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      await this.apiService.delete(`/users/${userId}`)
      
      // Invalider le cache de cet utilisateur
      this.cache.invalidateUser(userId)

    } catch (error) {
      console.error(`Erreur lors de la suppression de l\'utilisateur ${userId}:`, error)
      throw new Error(`Impossible de supprimer l\'utilisateur ${userId}`)
    }
  }

  /**
   * Récupère une liste d'utilisateurs par leurs IDs
   */
  async getUsersList(userIds: string[]): Promise<UserListOutSuccess> {
    try {
      const cacheKey = `users_list_${userIds.sort().join(',')}`
      const cached = this.cache.get<UserListOutSuccess>(cacheKey)
      if (cached) return cached

      const userData: UserListInput = { user_ids: userIds }
      const response = await this.apiService.post<UserListOutSuccess>('/users/list', userData)
      
      // Cache pour 3 minutes
      this.cache.set(cacheKey, response, 3 * 60 * 1000)
      return response

    } catch (error) {
      console.error('Erreur lors de la récupération de la liste d\'utilisateurs:', error)
      throw new Error('Impossible de récupérer la liste d\'utilisateurs demandée')
    }
  }

  // === ROLE MANAGEMENT ===

  /**
   * Récupère tous les rôles
   */
  async getRoles(): Promise<RoleListOutSuccess> {
    try {
      const cacheKey = 'roles_list'
      const cached = this.cache.get<RoleListOutSuccess>(cacheKey)
      if (cached) return cached

      const response = await this.apiService.get<RoleListOutSuccess>('/roles')
      
      // Cache pour 10 minutes (les rôles changent moins souvent)
      this.cache.set(cacheKey, response, 10 * 60 * 1000)
      return response

    } catch (error) {
      console.error('Erreur lors de la récupération des rôles:', error)
      throw new Error('Impossible de récupérer la liste des rôles')
    }
  }

  /**
   * Récupère un rôle par son ID
   */
  async getRole(roleId: number): Promise<RoleOutSuccess> {
    try {
      const cacheKey = `role_${roleId}`
      const cached = this.cache.get<RoleOutSuccess>(cacheKey)
      if (cached) return cached

      const response = await this.apiService.get<RoleOutSuccess>(`/roles/${roleId}`)
      
      // Cache pour 10 minutes
      this.cache.set(cacheKey, response, 10 * 60 * 1000)
      return response

    } catch (error) {
      console.error(`Erreur lors de la récupération du rôle ${roleId}:`, error)
      throw new Error(`Impossible de récupérer le rôle ${roleId}`)
    }
  }

  /**
   * Attribue un rôle à un utilisateur
   */
  async assignRole(userId: string, roleId: number): Promise<void> {
    try {
      const roleData: AssignRoleInput = { user_id: userId, role_id: roleId }
      await this.apiService.post('/users/assign-role', roleData)
      
      // Invalider le cache de cet utilisateur
      this.cache.invalidateUser(userId)

    } catch (error) {
      console.error(`Erreur lors de l\'attribution du rôle ${roleId} à l\'utilisateur ${userId}:`, error)
      throw new Error(`Impossible d\'attribuer le rôle à l\'utilisateur ${userId}`)
    }
  }

  /**
   * Révoque un rôle d'un utilisateur
   */
  async revokeRole(userId: string, roleId: number): Promise<void> {
    try {
      const roleData: AssignRoleInput = { user_id: userId, role_id: roleId }
      await this.apiService.delete('/users/revoke-role', roleData)
      
      // Invalider le cache de cet utilisateur
      this.cache.invalidateUser(userId)

    } catch (error) {
      console.error(`Erreur lors de la révocation du rôle ${roleId} de l\'utilisateur ${userId}:`, error)
      throw new Error(`Impossible de révoquer le rôle de l\'utilisateur ${userId}`)
    }
  }

  // === PERMISSION MANAGEMENT ===

  /**
   * Récupère les permissions d'un utilisateur
   */
  async getUserPermissions(userId: string): Promise<PermissionListOutSuccess> {
    try {
      const cacheKey = `user_permissions_${userId}`
      const cached = this.cache.get<PermissionListOutSuccess>(cacheKey)
      if (cached) return cached

      const response = await this.apiService.get<PermissionListOutSuccess>(`/users/${userId}/permissions`)
      
      // Cache pour 5 minutes
      this.cache.set(cacheKey, response)
      return response

    } catch (error) {
      console.error(`Erreur lors de la récupération des permissions de l\'utilisateur ${userId}:`, error)
      throw new Error(`Impossible de récupérer les permissions de l\'utilisateur ${userId}`)
    }
  }

  /**
   * Récupère les permissions d'un rôle
   */
  async getRolePermissions(roleId: number): Promise<PermissionListOutSuccess> {
    try {
      const cacheKey = `role_permissions_${roleId}`
      const cached = this.cache.get<PermissionListOutSuccess>(cacheKey)
      if (cached) return cached

      const response = await this.apiService.get<PermissionListOutSuccess>(`/roles/${roleId}/permissions`)
      
      // Cache pour 10 minutes
      this.cache.set(cacheKey, response, 10 * 60 * 1000)
      return response

    } catch (error) {
      console.error(`Erreur lors de la récupération des permissions du rôle ${roleId}:`, error)
      throw new Error(`Impossible de récupérer les permissions du rôle ${roleId}`)
    }
  }

  /**
   * Attribue des permissions à un utilisateur
   */
  async assignPermissions(userId: string, permissions: string[]): Promise<void> {
    try {
      const permissionData: AssignPermissionsInput = { user_id: userId, permissions }
      await this.apiService.post('/users/assign-permissions', permissionData)
      
      // Invalider le cache des permissions de cet utilisateur
      this.cache.invalidate(`user_permissions_${userId}`)
      this.cache.invalidateUser(userId)

    } catch (error) {
      console.error(`Erreur lors de l\'attribution des permissions à l\'utilisateur ${userId}:`, error)
      throw new Error(`Impossible d\'attribuer les permissions à l\'utilisateur ${userId}`)
    }
  }

  /**
   * Révoque des permissions d'un utilisateur
   */
  async revokePermissions(userId: string, permissions: string[]): Promise<void> {
    try {
      const permissionData: AssignPermissionsInput = { user_id: userId, permissions }
      await this.apiService.delete('/users/revoke-permissions', permissionData)
      
      // Invalider le cache des permissions de cet utilisateur
      this.cache.invalidate(`user_permissions_${userId}`)
      this.cache.invalidateUser(userId)

    } catch (error) {
      console.error(`Erreur lors de la révocation des permissions de l\'utilisateur ${userId}:`, error)
      throw new Error(`Impossible de révoquer les permissions de l\'utilisateur ${userId}`)
    }
  }

  // === UTILITY METHODS ===

  /**
   * Combine les données utilisateur avec ses permissions et rôles
   */
  async getUserWithPermissions(userId: string): Promise<UserWithPermissions> {
    try {
      const [userResponse, permissionsResponse] = await Promise.all([
        this.getUser(userId),
        this.getUserPermissions(userId).catch(() => ({ success: true, message: '', data: [] }))
      ])

      const user = userResponse.data
      const permissions = permissionsResponse.data || []

      // Extraire les rôles uniques des permissions
      const roleIds = [...new Set(permissions
        .filter(p => p.role_id)
        .map(p => p.role_id!))]

      const roles: RoleOut[] = []
      for (const roleId of roleIds) {
        try {
          const roleResponse = await this.getRole(roleId)
          roles.push(roleResponse.data)
        } catch (error) {
          console.warn(`Impossible de récupérer le rôle ${roleId}`)
        }
      }

      return {
        ...user,
        permissions,
        roles,
        computedFullName: `${user.first_name} ${user.last_name}`,
        computedStatus: this.getStatusDisplay(user.status),
        computedUserType: this.getUserTypeDisplay(user.user_type)
      }

    } catch (error) {
      console.error(`Erreur lors de la récupération complète de l\'utilisateur ${userId}:`, error)
      throw new Error(`Impossible de récupérer les informations complètes de l\'utilisateur ${userId}`)
    }
  }

  /**
   * Vérifie si un utilisateur a une permission spécifique
   */
  async userHasPermission(userId: string, permission: string): Promise<boolean> {
    try {
      const permissionsResponse = await this.getUserPermissions(userId)
      return permissionsResponse.data.some(p => p.permission === permission)
    } catch (error) {
      console.warn(`Impossible de vérifier la permission ${permission} pour l\'utilisateur ${userId}`)
      return false
    }
  }

  /**
   * Vérifie si un utilisateur a un rôle spécifique
   */
  async userHasRole(userId: string, roleName: string): Promise<boolean> {
    try {
      const userWithPermissions = await this.getUserWithPermissions(userId)
      return userWithPermissions.roles?.some(r => r.name === roleName) || false
    } catch (error) {
      console.warn(`Impossible de vérifier le rôle ${roleName} pour l\'utilisateur ${userId}`)
      return false
    }
  }

  /**
   * Formate l'affichage du statut utilisateur
   */
  private getStatusDisplay(status: UserStatusEnum) {
    const statusMap = {
      [UserStatusEnum.ACTIVE]: {
        label: 'Actif',
        color: 'success',
        icon: 'ri-check-circle-line',
      },
      [UserStatusEnum.INACTIVE]: {
        label: 'Inactif',
        color: 'warning',
        icon: 'ri-pause-circle-line',
      },
      [UserStatusEnum.BLOCKED]: {
        label: 'Bloqué',
        color: 'error',
        icon: 'ri-forbid-line',
      },
      [UserStatusEnum.DELETED]: {
        label: 'Supprimé',
        color: 'grey',
        icon: 'ri-delete-bin-line',
      },
    }

    return statusMap[status]
  }

  /**
   * Formate l'affichage du type utilisateur
   */
  private getUserTypeDisplay(userType: UserTypeEnum) {
    const typeMap = {
      [UserTypeEnum.ADMIN]: {
        label: 'Administrateur',
        color: 'purple',
        icon: 'ri-admin-line',
      },
      [UserTypeEnum.STAFF]: {
        label: 'Staff',
        color: 'blue',
        icon: 'ri-user-star-line',
      },
      [UserTypeEnum.TEACHER]: {
        label: 'Enseignant',
        color: 'orange',
        icon: 'ri-graduation-cap-line',
      },
      [UserTypeEnum.STUDENT]: {
        label: 'Étudiant',
        color: 'green',
        icon: 'ri-book-open-line',
      },
    }

    return typeMap[userType]
  }

  /**
   * Invalide le cache (utile pour les tests ou refresh forcé)
   */
  clearCache(pattern?: string): void {
    this.cache.invalidate(pattern)
  }

  // === BULK OPERATIONS ===

  /**
   * Met à jour le statut de plusieurs utilisateurs
   */
  async bulkUpdateStatus(userIds: string[], status: UserStatusEnum): Promise<void> {
    try {
      const promises = userIds.map(userId => this.updateUserStatus(userId, status))
      await Promise.all(promises)
      
      // Invalider le cache pour tous ces utilisateurs
      userIds.forEach(userId => this.cache.invalidateUser(userId))

    } catch (error) {
      console.error('Erreur lors de la mise à jour en masse des statuts:', error)
      throw new Error('Impossible de mettre à jour les statuts des utilisateurs sélectionnés')
    }
  }

  /**
   * Supprime plusieurs utilisateurs
   */
  async bulkDeleteUsers(userIds: string[]): Promise<void> {
    try {
      const promises = userIds.map(userId => this.deleteUser(userId))
      await Promise.all(promises)
      
      // Invalider le cache pour tous ces utilisateurs
      userIds.forEach(userId => this.cache.invalidateUser(userId))

    } catch (error) {
      console.error('Erreur lors de la suppression en masse:', error)
      throw new Error('Impossible de supprimer les utilisateurs sélectionnés')
    }
  }

  // === TESTING UTILITIES ===

  /**
   * Test de connexion Redis (pour le développement)
   */
  async testRedis(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.apiService.get<{ success: boolean; message: string }>('/test-redis')
      return response
    } catch (error) {
      console.error('Erreur lors du test Redis:', error)
      return { success: false, message: 'Test Redis échoué' }
    }
  }

  /**
   * Test d'envoi d'email (pour le développement)
   */
  async testEmail(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.apiService.get<{ success: boolean; message: string }>('/test-email')
      return response
    } catch (error) {
      console.error('Erreur lors du test email:', error)
      return { success: false, message: 'Test email échoué' }
    }
  }
}

// Export d'une instance par défaut
export const userService = new UserService()