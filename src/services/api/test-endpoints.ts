// Test script pour vérifier que tous les endpoints sont correctement configurés
import { apiService } from './base'
import { dashboardService } from '../dashboardService'

export class EndpointTester {
  /**
   * Teste tous les endpoints principaux
   */
  static async testAllEndpoints() {
    const results = {
      dashboard: await this.testDashboard(),
      auth: await this.testAuth(),
      system: await this.testSystem()
    }
    
    console.log('Endpoint Test Results:', results)
    return results
  }

  /**
   * Teste les endpoints du dashboard
   */
  static async testDashboard() {
    try {
      const stats = await dashboardService.getComprehensiveStats()
      return {
        comprehensiveStats: '✅ Success',
        data: {
          users: stats.users?.total || 0,
          trainings: (stats.trainings?.total_active || 0) + (stats.trainings?.total_inactive || 0),
          jobOffers: stats.job_offers?.total || 0,
          blog: stats.blog?.total_posts || 0
        }
      }
    } catch (error) {
      return {
        comprehensiveStats: '❌ Error',
        error: error.message
      }
    }
  }

  /**
   * Teste les endpoints d'authentification
   */
  static async testAuth() {
    try {
      // Test de l'endpoint de santé
      const health = await apiService.get('/dashboard/health')
      return {
        health: '✅ Success',
        data: health
      }
    } catch (error) {
      return {
        health: '❌ Error',
        error: error.message
      }
    }
  }

  /**
   * Teste les endpoints système
   */
  static async testSystem() {
    try {
      // Test des centres d'organisation
      const centers = await apiService.get('/system/organization-centers?page=1&number=1')
      return {
        organizationCenters: '✅ Success',
        data: centers
      }
    } catch (error) {
      return {
        organizationCenters: '❌ Error',
        error: error.message
      }
    }
  }
}

// Export pour utilisation dans la console du navigateur
if (typeof window !== 'undefined') {
  (window as any).EndpointTester = EndpointTester
}
