import { apiService } from './base'

// Types pour les utilisateurs
export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  status: string
  created_at: string
  last_login?: string
  roles?: Role[]
  permissions?: Permission[]
}

export interface Role {
  id: number
  name: string
  description?: string
}

export interface Permission {
  id: number
  name: string
  description?: string
}

export interface UserFilter {
  page?: number
  limit?: number
  search?: string
  status?: string
  role?: string
}

export interface CreateUserRequest {
  email: string
  password: string
  first_name: string
  last_name: string
  role_ids?: number[]
}

export interface UpdateUserRequest {
  first_name?: string
  last_name?: string
  email?: string
  status?: string
}

export interface AssignRoleRequest {
  user_id: number
  role_ids: number[]
}

export interface AssignPermissionRequest {
  user_id: number
  permission_ids: number[]
}

export interface UpdateUserStatusRequest {
  status: string
}

class UserService {
  // Récupérer la liste des utilisateurs
  async getUsers(filters: UserFilter = {}): Promise<any> {
    return await apiService.get('/users', { params: filters })
  }

  // Récupérer un utilisateur par ID
  async getUserById(userId: number): Promise<User> {
    return await apiService.get(`/users/${userId}`)
  }

  // Alias pour getUserById (pour compatibilité)
  async getUser(userId: string): Promise<{ data: User }> {
    if (!userId || userId.trim() === '') {
      throw new Error('ID utilisateur invalide')
    }
    // Les IDs sont des UUIDs (strings) dans le backend
    const user = await apiService.get(`/users/${userId}`) as User
    return { data: user }
  }

  // Récupérer un utilisateur complet avec toutes les informations
  async getUserFull(userId: string): Promise<{ data: User }> {
    if (!userId || userId.trim() === '') {
      throw new Error('ID utilisateur invalide')
    }
    // Les IDs sont des UUIDs (strings) dans le backend
    const user = await apiService.get(`/users/${userId}`) as User
    return { data: user }
  }

  // Récupérer un utilisateur avec ses permissions
  async getUserWithPermissions(userId: string): Promise<User> {
    if (!userId || userId.trim() === '') {
      throw new Error('ID utilisateur invalide')
    }
    // Les IDs sont des UUIDs (strings) dans le backend
    const user = await apiService.get(`/users/${userId}`) as User
    // Ajouter les permissions si nécessaire
    return user
  }

  // Créer un utilisateur
  async createUser(userData: CreateUserRequest): Promise<User> {
    return await apiService.post('/users', userData)
  }

  // Mettre à jour un utilisateur
  async updateUser(userId: string | number, userData: UpdateUserRequest): Promise<User> {
    return await apiService.put(`/users/${userId}`, userData) as User
  }

  // Supprimer un utilisateur
  async deleteUser(userId: string | number): Promise<void> {
    return await apiService.delete(`/users/${userId}`)
  }

  // Changer le statut d'un utilisateur
  async changeUserStatus(userId: number, status: UpdateUserStatusRequest): Promise<User> {
    return await apiService.post(`/users/change-status/${userId}`, status)
  }

  // Assigner des rôles à un utilisateur
  async assignRoles(data: AssignRoleRequest): Promise<Permission[]> {
    return await apiService.post('/users/assign-roles', data)
  }

  // Retirer des rôles d'un utilisateur
  async revokeRoles(data: AssignRoleRequest): Promise<Permission[]> {
    return await apiService.post('/users/revoke-role', data)
  }

  // Assigner des permissions à un utilisateur
  async assignPermissions(data: AssignPermissionRequest): Promise<Permission[]> {
    return await apiService.post('/users/assign-permissions', data)
  }

  // Retirer des permissions d'un utilisateur
  async revokePermissions(data: AssignPermissionRequest): Promise<Permission[]> {
    return await apiService.post('/users/revoke-permissions', data)
  }

  // Récupérer les permissions d'un utilisateur
  async getUserPermissions(userId: number): Promise<Permission[]> {
    return await apiService.get(`/users/permissions/${userId}`)
  }

  // Récupérer tous les rôles
  async getRoles(): Promise<Role[]> {
    return await apiService.get('/roles')
  }

  // Récupérer toutes les permissions
  async getPermissions(): Promise<Permission[]> {
    return await apiService.get('/permissions')
  }

  // Récupérer plusieurs utilisateurs par IDs (usage interne)
  async getUsersByIds(userIds: number[]): Promise<User[]> {
    return await apiService.post('/users/internal', { user_ids: userIds })
  }

  // Configuration des utilisateurs
  async setupUsers(): Promise<any> {
    return await apiService.get('/setup-users')
  }
}

export const userService = new UserService()