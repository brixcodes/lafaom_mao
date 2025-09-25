// Service API pour la gestion des utilisateurs
import { apiService } from './base'
import { API_ENDPOINTS } from '@/config/api'
import type { BaseOutSuccess, BaseOutPage } from '@/types'

// Types pour les utilisateurs
export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  user_type: string
  status: string
  picture?: string
  created_at: string
  updated_at: string
}

export interface UserFilter {
  page?: number
  page_size?: number
  search?: string
  user_type?: string
  country_code?: string
  order_by?: 'created_at' | 'last_login' | 'first_name' | 'last_name'
  asc?: 'asc' | 'desc'
}

export interface CreateUserInput {
  first_name: string
  last_name: string
  email: string
  password: string
  user_type: string
  status?: string
  birth_date?: string
  civility?: string
  country_code?: string
  mobile_number?: string
  fix_number?: string
  lang?: string
  two_factor_enabled?: boolean
}

export interface UpdateUserInput {
  first_name?: string
  last_name?: string
  email?: string
  password?: string
  user_type?: string
  status?: string
  birth_date?: string
  civility?: string
  country_code?: string
  mobile_number?: string
  fix_number?: string
  lang?: string
  two_factor_enabled?: boolean
}

export interface UserOutSuccess extends BaseOutSuccess {
  data: User
}

export interface UserListOutSuccess extends BaseOutSuccess {
  data: User[]
}

export interface UsersPageOutSuccess extends BaseOutPage {
  data: User[]
}

export class UserService {
  
  /**
   * Récupérer la liste des utilisateurs avec pagination
   */
  async getUsers(filters: UserFilter = {}): Promise<UsersPageOutSuccess> {
    return apiService.get('/users', { params: filters })
  }

  /**
   * Récupérer un utilisateur par ID
   */
  async getUser(userId: string): Promise<UserOutSuccess> {
    return apiService.get(`/users/${userId}`)
  }

  /**
   * Créer un nouvel utilisateur
   */
  async createUser(userData: CreateUserInput): Promise<UserOutSuccess> {
    return apiService.post('/users', userData, {
      successMessage: 'Utilisateur créé avec succès',
      errorMessage: 'Erreur lors de la création de l\'utilisateur'
    })
  }

  /**
   * Mettre à jour un utilisateur
   */
  async updateUser(userId: string, userData: UpdateUserInput): Promise<UserOutSuccess> {
    return apiService.put(`/users/${userId}`, userData, {
      successMessage: 'Utilisateur mis à jour avec succès',
      errorMessage: 'Erreur lors de la mise à jour de l\'utilisateur'
    })
  }

  /**
   * Supprimer un utilisateur
   */
  async deleteUser(userId: string): Promise<UserOutSuccess> {
    return apiService.delete(`/users/${userId}`, {
      successMessage: 'Utilisateur supprimé avec succès',
      errorMessage: 'Erreur lors de la suppression de l\'utilisateur'
    })
  }

  /**
   * Mettre à jour le statut d'un utilisateur
   */
  async updateUserStatus(userId: string, status: string): Promise<UserOutSuccess> {
    return apiService.patch(`/users/${userId}/status`, { status }, {
      successMessage: 'Statut utilisateur mis à jour avec succès',
      errorMessage: 'Erreur lors de la mise à jour du statut'
    })
  }

  /**
   * Rechercher des utilisateurs
   */
  async searchUsers(searchTerm: string, filters: Omit<UserFilter, 'search'> = {}): Promise<UsersPageOutSuccess> {
    return this.getUsers({ ...filters, search: searchTerm })
  }

  /**
   * Obtenir les utilisateurs par type
   */
  async getUsersByType(userType: string, filters: Omit<UserFilter, 'user_type'> = {}): Promise<UsersPageOutSuccess> {
    return this.getUsers({ ...filters, user_type: userType })
  }

  /**
   * Obtenir les utilisateurs par pays
   */
  async getUsersByCountry(countryCode: string, filters: Omit<UserFilter, 'country_code'> = {}): Promise<UsersPageOutSuccess> {
    return this.getUsers({ ...filters, country_code: countryCode })
  }
}

// Instance singleton
export const userService = new UserService()