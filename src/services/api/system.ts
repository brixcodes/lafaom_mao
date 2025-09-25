import { apiService } from './base'

// Types pour le système
export interface OrganizationCenter {
  id: number
  name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  status: string
  created_at: string
  updated_at: string
}

export interface OrganizationCenterFilter {
  page?: number
  limit?: number
  search?: string
  status?: string
  country?: string
  city?: string
}

export interface CreateOrganizationCenterRequest {
  name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  country?: string
}

export interface UpdateOrganizationCenterRequest {
  name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  country?: string
}

export interface UpdateOrganizationStatusRequest {
  status: string
}

export interface OrganizationCenterListInput {
  organization_center_ids: number[]
}

class SystemService {
  // === CENTRES D'ORGANISATION ===
  // Récupérer la liste des centres d'organisation
  async getOrganizationCenters(filters: OrganizationCenterFilter = {}): Promise<any> {
    return await apiService.get('/organization-centers', { params: filters })
  }

  // Récupérer un centre d'organisation par ID
  async getOrganizationCenterById(organizationId: number): Promise<OrganizationCenter> {
    return await apiService.get(`/organization-centers/${organizationId}`)
  }

  // Créer un centre d'organisation
  async createOrganizationCenter(organizationData: CreateOrganizationCenterRequest): Promise<OrganizationCenter> {
    return await apiService.post('/organization-centers', organizationData)
  }

  // Mettre à jour un centre d'organisation
  async updateOrganizationCenter(organizationId: number, organizationData: UpdateOrganizationCenterRequest): Promise<OrganizationCenter> {
    return await apiService.put(`/organization-centers/${organizationId}`, organizationData)
  }

  // Supprimer un centre d'organisation
  async deleteOrganizationCenter(organizationId: number): Promise<void> {
    return await apiService.delete(`/organization-centers/${organizationId}`)
  }

  // Changer le statut d'un centre d'organisation
  async changeOrganizationCenterStatus(organizationId: number, status: UpdateOrganizationStatusRequest): Promise<OrganizationCenter> {
    return await apiService.post(`/organization-centers/change-status/${organizationId}`, status)
  }

  // Récupérer plusieurs centres d'organisation par IDs (usage interne)
  async getOrganizationCentersByIds(organizationIds: number[]): Promise<OrganizationCenter[]> {
    return await apiService.post('/organization-centers/internal', { organization_center_ids: organizationIds })
  }

  // Récupérer les centres d'organisation par localisation
  async getOrganizationCentersByLocation(countryCode: string, city?: string): Promise<OrganizationCenter[]> {
    const params: any = {}
    if (city) params.city = city
    return await apiService.get(`/organization-centers/location/${countryCode}`, { params })
  }

  // === DASHBOARD ===
  // Récupérer les statistiques du dashboard
  async getDashboardStats(): Promise<any> {
    return await apiService.get('/dashboard/stats')
  }

  // Récupérer les données des graphiques
  async getDashboardCharts(period: string = 'month'): Promise<any> {
    return await apiService.get('/dashboard/charts', { params: { period } })
  }

  // Récupérer les activités récentes
  async getDashboardActivities(limit: number = 10): Promise<any> {
    return await apiService.get('/dashboard/activities', { params: { limit } })
  }

  // Récupérer les alertes du dashboard
  async getDashboardAlerts(): Promise<any> {
    return await apiService.get('/dashboard/alerts')
  }

  // Récupérer les métriques par période
  async getDashboardMetrics(period: string): Promise<any> {
    return await apiService.get('/dashboard/metrics', { params: { period } })
  }

  // Récupérer les statistiques de performance
  async getDashboardPerformance(): Promise<any> {
    return await apiService.get('/dashboard/performance')
  }
}

export const systemService = new SystemService()
