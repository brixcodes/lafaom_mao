import { apiService } from './base'

// ===== INTERFACES SYSTEM =====

export interface TestDataInput {
  test_number: number
}

export interface EmailTestInput {
  email: string
}

// ===== SERVICE SYSTEM =====

class SystemService {
  // === TEST ENDPOINTS ===

  /**
   * Récupérer des données Redis pour test
   */
  async getDataFromRedis(testNumber: number): Promise<any> {
    return await apiService.get('/test-get-data-to-redis', { 
      params: { test_number: testNumber } 
    })
  }

  /**
   * Ajouter des données Redis pour test
   */
  async addDataToRedis(testNumber: number): Promise<any> {
    return await apiService.get('/test-add-data-to-redis', { 
      params: { test_number: testNumber } 
    })
  }

  /**
   * Tester l'envoi d'email
   */
  async testSendEmail(email: string): Promise<any> {
    return await apiService.get('/test-send-email', { 
      params: { email } 
    })
  }

  // === ROOT ===

  /**
   * Endpoint racine
   */
  async getRoot(): Promise<any> {
    return await apiService.get('/')
  }
}

export const systemService = new SystemService()