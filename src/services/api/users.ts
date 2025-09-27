import { apiService } from './base'

// ===== INTERFACES USERS =====

export interface CreateUserInput {
  first_name: string
  last_name: string
  password: string
  birth_date?: string
  civility?: string
  country_code?: string
  mobile_number?: string
  fix_number?: string
  email?: string
  status: string
  lang?: string
  web_token?: string
  user_type: string
  two_factor_enabled: boolean
}

export interface UpdateUserInput {
  first_name?: string
  last_name?: string
  user_type?: string
  password?: string
  birth_date?: string
  civility?: string
  country_code?: string
  mobile_number?: string
  fix_number?: string
  email?: string
  status?: string
  lang?: string
  web_token?: string
  two_factor_enabled?: boolean
}

export interface UserListInput {
  user_ids: string[]
}

export interface UpdateStatusInput {
  status: string
}

export interface UserSimpleOut {
  id: string
  first_name: string
  last_name: string
  birth_date?: string
  civility?: string
  country_code?: string
  mobile_number?: string
  fix_number?: string
  email?: string
  picture?: string
  status: string
  lang: string
  web_token?: string
  last_login?: string
  user_type: string
  two_factor_enabled: boolean
  created_at: string
}

export interface UserOutSuccess {
  success: boolean
  message: string
  data: UserSimpleOut
}

export interface UserListOutSuccess {
  success: boolean
  message: string
  data: UserSimpleOut[]
}

export interface UsersPageOutSuccess {
  data: UserSimpleOut[]
  page: number
  number: number
  total_number: number
}

// ===== SERVICE USERS =====

class UsersService {
  // === USER MANAGEMENT ===

  /**
   * Récupérer la liste des utilisateurs avec pagination et filtres
   */
  async getUsers(filters: {
    page?: number
    page_size?: number
    search?: string
    user_type?: string
    country_code?: string
    order_by?: 'created_at' | 'last_login' | 'first_name' | 'last_name'
    asc?: 'asc' | 'desc'
  } = {}): Promise<UsersPageOutSuccess> {
    const response = await apiService.get('/users', { params: filters })
    return response as UsersPageOutSuccess
  }

  /**
   * Créer un nouvel utilisateur
   */
  async createUser(data: CreateUserInput): Promise<UserOutSuccess> {
    const response = await apiService.post('/users', data)
    return response as UserOutSuccess
  }

  /**
   * Récupérer la liste des utilisateurs par IDs (interne)
   */
  async getUsersInternal(data: UserListInput): Promise<UserListOutSuccess> {
    const response = await apiService.post('/users/internal', data)
    return response as UserListOutSuccess
  }

  /**
   * Récupérer un utilisateur par ID
   */
  async getUserById(userId: string): Promise<UserOutSuccess> {
    const response = await apiService.get(`/users/${userId}`)
    return response as UserOutSuccess
  }

  /**
   * Récupérer un utilisateur par ID (alias pour getUserById)
   */
  async getUser(userId: string): Promise<UserOutSuccess> {
    return await this.getUserById(userId)
  }

  /**
   * Mettre à jour un utilisateur
   */
  async updateUser(userId: string, data: UpdateUserInput): Promise<UserOutSuccess> {
    const response = await apiService.put(`/users/${userId}`, data)
    return response as UserOutSuccess
  }

  /**
   * Supprimer un utilisateur
   */
  async deleteUser(userId: string): Promise<UserOutSuccess> {
    const response = await apiService.delete(`/users/${userId}`)
    return response as UserOutSuccess
  }

  /**
   * Changer le statut d'un utilisateur
   */
  async changeUserStatus(userId: string, data: UpdateStatusInput): Promise<UserOutSuccess> {
    const response = await apiService.post(`/users/change-status/${userId}`, data)
    return response as UserOutSuccess
  }

  // === SETUP ===

  /**
   * Configuration des utilisateurs
   */
  async setupUsers(): Promise<any> {
    return await apiService.get('/setup-users')
  }
}

export const usersService = new UsersService()
