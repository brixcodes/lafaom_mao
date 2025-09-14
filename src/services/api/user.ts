// Service API pour les utilisateurs
import { apiService } from './base'
import type {
  AssignPermissionsInput,
  AssignRoleInput,
  CreateUserInput,
  ListDataInput,
  PermissionListOutSuccess,
  RoleListOutSuccess,
  RoleOutSuccess,
  UpdateUserInput,
  UserFilter,
  UserFullOutSuccess,
  UserListInput,
  UserListOutSuccess,
  UserOutSuccess,
  UsersPageOutSuccess,
} from '@/types/user'
import type { BaseOutSuccess } from '@/types/index'

export class UserService {
  // Créer un utilisateur
  async createUser(data: CreateUserInput): Promise<UserOutSuccess> {
    return apiService.postNoConfirm('/users', data)
  }

  // Obtenir un utilisateur par ID
  async getUserById(id: string): Promise<UserOutSuccess> {
    return apiService.get(`/users/${id}`)
  }

  // Obtenir le profil complet d'un utilisateur
  async getUserFullProfile(id: string): Promise<UserFullOutSuccess> {
    return apiService.get(`/users/${id}/full`)
  }

  // Mettre à jour un utilisateur
  async updateUser(id: string, data: UpdateUserInput): Promise<UserOutSuccess> {
    return apiService.put(`/users/${id}`, data)
  }

  // Supprimer un utilisateur
  async deleteUser(id: string): Promise<BaseOutSuccess> {
    return apiService.delete(`/users/${id}`)
  }

  // Lister les utilisateurs avec filtres
  async getUsers(filter?: UserFilter): Promise<UsersPageOutSuccess> {
    return apiService.get('/users', filter)
  }

  // Lister les utilisateurs par IDs (endpoint interne)
  async getUsersByIds(data: UserListInput): Promise<UserListOutSuccess> {
    return apiService.post('/users/internal', data)
  }

  // Assigner des permissions à un utilisateur
  async assignPermissions(data: AssignPermissionsInput): Promise<BaseOutSuccess> {
    return apiService.post('/users/assign-permissions', data)
  }

  // Révocation des permissions
  async revokePermissions(data: AssignPermissionsInput): Promise<PermissionListOutSuccess> {
    return apiService.post('/users/revoke-permissions', data)
  }

  // Assigner un rôle à un utilisateur
  async assignRole(data: AssignRoleInput): Promise<PermissionListOutSuccess> {
    return apiService.post('/users/assign-roles', data)
  }

  // Révocation d'un rôle
  async revokeRole(data: AssignRoleInput): Promise<PermissionListOutSuccess> {
    return apiService.post('/users/revoke-role', data)
  }

  // Obtenir les permissions de l'utilisateur actuel
  async getUserPermissions(): Promise<PermissionListOutSuccess> {
    return apiService.get('/users/permissions')
  }

  // Obtenir tous les rôles disponibles
  async getRoles(): Promise<RoleListOutSuccess> {
    return apiService.get('/users/roles')
  }

  // Obtenir un rôle par ID
  async getRoleById(id: number): Promise<RoleOutSuccess> {
    return apiService.get(`/users/roles/${id}`)
  }

  // Créer un rôle
  async createRole(data: { name: string; description?: string }): Promise<RoleOutSuccess> {
    return apiService.post('/users/roles', data)
  }

  // Mettre à jour un rôle
  async updateRole(id: number, data: { name?: string; description?: string }): Promise<RoleOutSuccess> {
    return apiService.put(`/users/roles/${id}`, data)
  }

  // Supprimer un rôle
  async deleteRole(id: number): Promise<BaseOutSuccess> {
    return apiService.delete(`/users/roles/${id}`)
  }

  // Obtenir toutes les permissions disponibles
  async getPermissions(): Promise<PermissionListOutSuccess> {
    return apiService.get('/users/permissions')
  }

  // Supprimer des utilisateurs en lot
  async deleteUsers(data: ListDataInput): Promise<BaseOutSuccess> {
    return apiService.post('/users/delete-batch', data)
  }

  // Activer/désactiver un utilisateur
  async toggleUserStatus(id: string): Promise<BaseOutSuccess> {
    return apiService.patch(`/users/${id}/toggle-status`)
  }

  // Obtenir les statistiques des utilisateurs
  async getUserStats(): Promise<BaseOutSuccess> {
    return apiService.getUserStats()
  }

  // Setup des utilisateurs (initialisation des permissions)
  async setupUsers(): Promise<BaseOutSuccess> {
    return apiService.setupUsers()
  }

  // Tests Redis
  async testRedisGet(testNumber: number): Promise<any> {
    return apiService.testRedisGet(testNumber)
  }

  async testRedisSet(testNumber: number): Promise<any> {
    return apiService.testRedisSet(testNumber)
  }

  // Test d'envoi d'email
  async testEmail(email: string): Promise<any> {
    return apiService.testEmail(email)
  }
}

export const userService = new UserService()
