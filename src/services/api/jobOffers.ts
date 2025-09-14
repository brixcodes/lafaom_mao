// Service API pour les offres d'emploi
import { apiService } from './base'
import type { BaseOutSuccess } from '@/types/index'

export class JobOffersService {
  // Obtenir les statistiques utilisateur
  async getUserStats(): Promise<BaseOutSuccess> {
    return apiService.getUserStats()
  }

  // Lister les utilisateurs par IDs (endpoint interne)
  async getUsersByIds(userIds: string[]): Promise<any> {
    return apiService.post('/users/internal', { user_ids: userIds })
  }

  // Obtenir un utilisateur par ID
  async getUserById(userId: string): Promise<any> {
    return apiService.get(`/users/${userId}`)
  }

  // Mettre à jour un utilisateur
  async updateUser(userId: string, userData: any): Promise<any> {
    return apiService.put(`/users/${userId}`, userData)
  }

  // Setup des utilisateurs
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

export const jobOffersService = new JobOffersService()
