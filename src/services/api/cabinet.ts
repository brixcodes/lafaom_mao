import { apiService } from './base'
import type { 
  CabinetApplicationCreate, 
  CabinetApplicationOut, 
  CabinetApplicationUpdate,
  CabinetApplicationStats 
} from '@/types/cabinet'

export class CabinetService {
  /**
   * Créer une candidature de cabinet
   */
  async createApplication(data: CabinetApplicationCreate): Promise<{ data: CabinetApplicationOut }> {
    const response = await apiService.post('/cabinet-application', data)
    console.log('Cabinet service response:', response)
    return { data: response as CabinetApplicationOut }
  }

  /**
   * Récupérer une candidature par ID
   */
  async getApplication(id: string): Promise<{ data: CabinetApplicationOut }> {
    const response = await apiService.get(`/cabinet-application/${id}`)
    return { data: response as CabinetApplicationOut }
  }

  /**
   * Lister toutes les candidatures (admin)
   */
  async listApplications(params?: {
    skip?: number
    limit?: number
    status?: string
  }): Promise<{ data: CabinetApplicationOut[] }> {
    const queryParams = new URLSearchParams()
    if (params?.skip) queryParams.append('skip', params.skip.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.status) queryParams.append('status', params.status)
    
    const url = `/cabinet-application${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    const response = await apiService.get(url)
    return { data: response as CabinetApplicationOut[] }
  }

  /**
   * Récupérer les candidatures payées
   */
  async getPaidApplications(params?: {
    skip?: number
    limit?: number
  }): Promise<{ data: CabinetApplicationOut[] }> {
    const queryParams = new URLSearchParams()
    if (params?.skip) queryParams.append('skip', params.skip.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    
    const url = `/cabinet-application/paid${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    const response = await apiService.get(url)
    return { data: response as CabinetApplicationOut[] }
  }

  /**
   * Récupérer les candidatures de l'utilisateur connecté
   */
  async getMyApplications(params?: {
    skip?: number
    limit?: number
  }): Promise<{ data: CabinetApplicationOut[] }> {
    const queryParams = new URLSearchParams()
    if (params?.skip) queryParams.append('skip', params.skip.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    
    const url = `/cabinet-application/my-applications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    const response = await apiService.get(url)
    return { data: response as CabinetApplicationOut[] }
  }

  /**
   * Mettre à jour une candidature
   */
  async updateApplication(id: string, data: CabinetApplicationUpdate): Promise<{ data: CabinetApplicationOut }> {
    const response = await apiService.put(`/cabinet-application/${id}`, data)
    return { data: response as CabinetApplicationOut }
  }

  /**
   * Supprimer une candidature
   */
  async deleteApplication(id: string): Promise<{ message: string }> {
    const response = await apiService.delete(`/cabinet-application/${id}`)
    return { message: response as string }
  }

  /**
   * Approuver une candidature
   */
  async approveApplication(id: string): Promise<{ data: CabinetApplicationOut }> {
    const response = await apiService.patch(`/cabinet-application/${id}/approve`)
    return { data: response as CabinetApplicationOut }
  }

  /**
   * Rejeter une candidature
   */
  async rejectApplication(id: string, reason?: string): Promise<{ data: CabinetApplicationOut }> {
    const response = await apiService.patch(`/cabinet-application/${id}/reject`, { reason })
    return { data: response as CabinetApplicationOut }
  }

  /**
   * Récupérer les statistiques des candidatures
   */
  async getStats(): Promise<{ data: CabinetApplicationStats }> {
    const response = await apiService.get('/cabinet-application/stats/overview')
    return { data: response as CabinetApplicationStats }
  }

  /**
   * Vérifier le statut de paiement
   */
  async checkPaymentStatus(applicationId: string): Promise<{ data: CabinetApplicationOut }> {
    const response = await apiService.get(`/cabinet-application/${applicationId}/payment-status`)
    return { data: response as CabinetApplicationOut }
  }
}

export const cabinetService = new CabinetService()
