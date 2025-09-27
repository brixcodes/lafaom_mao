import { apiService } from './base'

// ===== INTERFACES ORGANIZATION CENTERS =====

export interface CreateOrganizationCenterInput {
  name: string
  address?: string
  city?: string
  postal_code?: string
  country_code?: string
  telephone_number?: string
  mobile_number?: string
  email: string
  website?: string
  latitude?: number
  longitude?: number
  status?: string
  organization_type?: string
  description?: string
}

export interface UpdateOrganizationCenterInput {
  name: string
  address?: string
  city?: string
  postal_code?: string
  country_code?: string
  telephone_number?: string
  mobile_number?: string
  email: string
  website?: string
  latitude?: number
  longitude?: number
  status: string
  organization_type: string
  description?: string
}

export interface UpdateOrganizationStatusInput {
  status: string
}

export interface OrganizationCenterListInput {
  organization_center_ids: number[]
}

export interface OrganizationCenterOut {
  id: number
  name: string
  address: string
  city: string
  postal_code?: string
  country_code: string
  telephone_number: string
  mobile_number: string
  email: string
  website?: string
  latitude?: number
  longitude?: number
  status: string
  organization_type: string
  description?: string
  created_at: string
  updated_at: string
}

export interface OrganizationCenterOutSuccess {
  success: boolean
  message: string
  data: OrganizationCenterOut
}

export interface OrganizationCenterListOutSuccess {
  success: boolean
  message: string
  data: OrganizationCenterOut[]
}

export interface OrganizationCentersPageOutSuccess {
  data: OrganizationCenterOut[]
  page: number
  number: number
  total_number: number
}

// ===== SERVICE ORGANIZATION CENTERS =====

class OrganizationCentersService {
  // === ORGANIZATION CENTERS ===

  /**
   * Récupérer la liste des centres d'organisation avec filtres
   */
  async getOrganizationCenters(filters: {
    page?: number
    page_size?: number
    search?: string
    status?: string
    organization_type?: string
    country_code?: string
    city?: string
    order_by?: 'created_at' | 'updated_at' | 'name'
    asc?: 'asc' | 'desc'
  } = {}): Promise<OrganizationCentersPageOutSuccess> {
    const response = await apiService.get('/system/organization-centers', { params: filters })
    return response as OrganizationCentersPageOutSuccess
  }

  /**
   * Créer un nouveau centre d'organisation
   */
  async createOrganizationCenter(data: CreateOrganizationCenterInput): Promise<OrganizationCenterOutSuccess> {
    const response = await apiService.post('/system/organization-centers', data)
    return response as OrganizationCenterOutSuccess
  }

  /**
   * Récupérer un centre d'organisation par ID
   */
  async getOrganizationCenterById(organizationId: number): Promise<OrganizationCenterOutSuccess> {
    const response = await apiService.get(`/system/organization-centers/${organizationId}`)
    return response as OrganizationCenterOutSuccess
  }

  /**
   * Mettre à jour un centre d'organisation
   */
  async updateOrganizationCenter(organizationId: number, data: UpdateOrganizationCenterInput): Promise<OrganizationCenterOutSuccess> {
    const response = await apiService.put(`/system/organization-centers/${organizationId}`, data)
    return response as OrganizationCenterOutSuccess
  }

  /**
   * Supprimer un centre d'organisation
   */
  async deleteOrganizationCenter(organizationId: number): Promise<OrganizationCenterOutSuccess> {
    const response = await apiService.delete(`/system/organization-centers/${organizationId}`)
    return response as OrganizationCenterOutSuccess
  }

  /**
   * Changer le statut d'un centre d'organisation
   */
  async changeOrganizationCenterStatus(organizationId: number, data: UpdateOrganizationStatusInput): Promise<OrganizationCenterOutSuccess> {
    const response = await apiService.post(`/system/organization-centers/change-status/${organizationId}`, data)
    return response as OrganizationCenterOutSuccess
  }

  /**
   * Récupérer plusieurs centres d'organisation par IDs (interne)
   */
  async getOrganizationCentersInternal(data: OrganizationCenterListInput): Promise<OrganizationCenterListOutSuccess> {
    const response = await apiService.post('/system/organization-centers/internal', data)
    return response as OrganizationCenterListOutSuccess
  }

  /**
   * Récupérer les centres d'organisation par localisation
   */
  async getOrganizationCentersByLocation(countryCode: string, city?: string): Promise<OrganizationCenterListOutSuccess> {
    const response = await apiService.get(`/system/organization-centers/location/${countryCode}`, { 
      params: city ? { city } : {} 
    })
    return response as OrganizationCenterListOutSuccess
  }
}

export const organizationCentersService = new OrganizationCentersService()
