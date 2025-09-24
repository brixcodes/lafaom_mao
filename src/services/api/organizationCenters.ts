// Service API pour les Organization Centers
import { apiService } from './base'
import type {
  OrganizationCenterCreateInput,
  OrganizationCenterUpdateInput,
  OrganizationCenterStatusUpdateInput,
  OrganizationCenterFilter,
  OrganizationCenterListInput,
  OrganizationCenterOutSuccess,
  OrganizationCenterListOutSuccess,
  OrganizationCenterListOutSuccess,
  OrganizationCenterLocation,
} from '@/types/organizationCenters'

export class OrganizationCenterService {
  // Organization Center CRUD
  async createOrganizationCenter(data: OrganizationCenterCreateInput): Promise<OrganizationCenterOutSuccess> {
    return apiService.post('/system/organization-centers', data)
  }

  async updateOrganizationCenter(id: number, data: OrganizationCenterUpdateInput): Promise<OrganizationCenterOutSuccess> {
    return apiService.put(`/system/organization-centers/${id}`, data)
  }

  async getOrganizationCenter(id: number): Promise<OrganizationCenterOutSuccess> {
    return apiService.get(`/system/organization-centers/${id}`)
  }

  async listOrganizationCenters(filters: OrganizationCenterFilter): Promise<OrganizationCenterListOutSuccess> {
    return apiService.get('/system/organization-centers', { params: filters })
  }

  async deleteOrganizationCenter(id: number): Promise<OrganizationCenterOutSuccess> {
    return apiService.delete(`/system/organization-centers/${id}`)
  }

  // Status Management
  async updateOrganizationCenterStatus(id: number, status: OrganizationCenterStatusUpdateInput): Promise<OrganizationCenterOutSuccess> {
    return apiService.post(`/system/organization-centers/change-status/${id}`, status)
  }

  // Internal Operations
  async getOrganizationCentersByIds(data: OrganizationCenterListInput): Promise<OrganizationCenterListOutSuccess> {
    return apiService.post('/system/organization-centers/internal', data)
  }

  // Location-based Operations
  async getOrganizationCentersByLocation(countryCode: string, city?: string): Promise<OrganizationCenterListOutSuccess> {
    const params = city ? { city } : {}
    return apiService.get(`/system/organization-centers/location/${countryCode}`, { params })
  }

  // Utility Methods
  async getOrganizationCentersByCountry(countryCode: string): Promise<OrganizationCenterListOutSuccess> {
    return this.getOrganizationCentersByLocation(countryCode)
  }

  async getOrganizationCentersByCity(countryCode: string, city: string): Promise<OrganizationCenterListOutSuccess> {
    return this.getOrganizationCentersByLocation(countryCode, city)
  }

  // Search and Filter Methods
  async searchOrganizationCenters(query: string, filters?: Partial<OrganizationCenterFilter>): Promise<OrganizationCenterListOutSuccess> {
    return this.listOrganizationCenters({
      search: query,
      ...filters,
    })
  }

  async getActiveOrganizationCenters(filters?: Partial<OrganizationCenterFilter>): Promise<OrganizationCenterListOutSuccess> {
    return this.listOrganizationCenters({
      status: 'ACTIVE' as any,
      ...filters,
    })
  }

  async getOrganizationCentersByType(type: string, filters?: Partial<OrganizationCenterFilter>): Promise<OrganizationCenterListOutSuccess> {
    return this.listOrganizationCenters({
      organization_type: type as any,
      ...filters,
    })
  }
}

// Export singleton instance
export const organizationCenterService = new OrganizationCenterService()
