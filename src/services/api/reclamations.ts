import { apiService } from './base'

// ===== INTERFACES RECLAMATIONS =====

export interface ReclamationCreateInput {
  application_number: string
  subject: string
  reclamation_type: number
  priority?: string
  description: string
}

export interface ReclamationAdminUpdateInput {
  status?: string
}

export interface ReclamationOut {
  id: number
  admin_id?: string
  reclamation_number: string
  application_number: string
  subject: string
  reclamation_type: number
  priority: string
  status: string
  description: string
  closure_date?: string
  created_at: string
  updated_at: string
}

export interface ReclamationFullOut extends ReclamationOut {
  admin_name?: string
  reclamation_type_name?: string
}

export interface ReclamationOutSuccess {
  success: boolean
  message: string
  data: ReclamationFullOut
}

export interface ReclamationsPageOutSuccess {
  data: ReclamationOut[]
  page: number
  number: number
  total_number: number
}

// ===== INTERFACES RECLAMATION TYPES =====

export interface ReclamationTypeCreateInput {
  name: string
  description?: string
}

export interface ReclamationTypeUpdateInput {
  name?: string
  description?: string
}

export interface ReclamationTypeOut {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface ReclamationTypeOutSuccess {
  success: boolean
  message: string
  data: ReclamationTypeOut
}

export interface ReclamationTypeListOutSuccess {
  success: boolean
  message: string
  data: ReclamationTypeOut[]
}

// ===== SERVICE RECLAMATIONS =====

class ReclamationsService {
  // === MY RECLAMATIONS ===

  /**
   * Récupérer mes réclamations avec filtres
   */
  async getMyReclamations(filters: {
    page?: number
    page_size?: number
    search?: string
    status?: string
    priority?: string
    reclamation_type?: number
    admin_id?: string
    application_number?: string
    order_by?: 'created_at' | 'subject' | 'priority'
    asc?: 'asc' | 'desc'
  } = {}): Promise<ReclamationsPageOutSuccess> {
    const response = await apiService.get('/my-reclamations', { params: filters })
    return response as ReclamationsPageOutSuccess
  }

  /**
   * Créer une nouvelle réclamation
   */
  async createMyReclamation(data: ReclamationCreateInput): Promise<ReclamationOutSuccess> {
    const response = await apiService.post('/my-reclamations', data)
    return response as ReclamationOutSuccess
  }

  /**
   * Récupérer ma réclamation par ID
   * Note: Cet endpoint n'existe pas encore dans le backend
   */
  async getMyReclamationById(reclamationId: number): Promise<ReclamationOutSuccess> {
    // TODO: Implémenter l'endpoint dans le backend
    // Pour l'instant, on retourne une erreur explicite
    throw new Error('Endpoint /my-reclamations/{id} not implemented in backend yet')
  }

  /**
   * Récupérer ma réclamation par ID avec fallback
   * Essaie d'abord l'API, puis retourne des données de base si l'endpoint n'existe pas
   */
  async getMyReclamationByIdWithFallback(reclamationId: number): Promise<ReclamationOutSuccess> {
    try {
      return await this.getMyReclamationById(reclamationId)
    } catch (error: any) {
      if (error.message?.includes('not implemented')) {
        // Retourner des données de base pour permettre l'affichage
        const mockData = {
          id: reclamationId,
          title: 'Réclamation #' + reclamationId,
          description: 'Détails non disponibles - Endpoint en cours de développement',
          status: 'NEW',
          priority: 'MEDIUM',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: 0,
          reclamation_type_id: 0,
          reclamation_type: {
            id: 0,
            name: 'Type non disponible',
            description: 'Type de réclamation non disponible'
          }
        }
        
        return {
          message: 'Réclamation chargée avec des données de base',
          data: mockData
        } as ReclamationOutSuccess
      }
      throw error
    }
  }

  /**
   * Mettre à jour ma réclamation
   */
  async updateMyReclamation(reclamationId: number, data: ReclamationCreateInput): Promise<ReclamationOutSuccess> {
    const response = await apiService.put(`/my-reclamations/${reclamationId}`, data)
    return response as ReclamationOutSuccess
  }

  /**
   * Supprimer ma réclamation
   */
  async deleteMyReclamation(reclamationId: number): Promise<ReclamationOutSuccess> {
    const response = await apiService.delete(`/my-reclamations/${reclamationId}`)
    return response as ReclamationOutSuccess
  }

  // === ADMIN RECLAMATIONS ===

  /**
   * Récupérer toutes les réclamations (admin) avec filtres
   */
  async getAllReclamations(filters: {
    page?: number
    page_size?: number
    search?: string
    status?: string
    priority?: string
    reclamation_type?: number
    admin_id?: string
    application_number?: string
    order_by?: 'created_at' | 'subject' | 'priority'
    asc?: 'asc' | 'desc'
  } = {}): Promise<ReclamationsPageOutSuccess> {
    const response = await apiService.get('/reclamations', { params: filters })
    return response as ReclamationsPageOutSuccess
  }

  /**
   * Récupérer une réclamation par ID (admin)
   */
  async getReclamationById(reclamationId: number): Promise<ReclamationOutSuccess> {
    const response = await apiService.get(`/reclamations/${reclamationId}`)
    return response as ReclamationOutSuccess
  }

  /**
   * Mettre à jour le statut d'une réclamation (admin)
   */
  async updateReclamationStatus(reclamationId: number, data: ReclamationAdminUpdateInput): Promise<ReclamationOutSuccess> {
    const response = await apiService.put(`/reclamations/${reclamationId}/status`, data)
    return response as ReclamationOutSuccess
  }

  // === RECLAMATION TYPES ===

  /**
   * Récupérer tous les types de réclamation actifs
   */
  async getActiveReclamationTypes(): Promise<ReclamationTypeListOutSuccess> {
    const response = await apiService.get('/reclamation-types/active/all')
    return response as ReclamationTypeListOutSuccess
  }

  /**
   * Créer un nouveau type de réclamation
   */
  async createReclamationType(data: ReclamationTypeCreateInput): Promise<ReclamationTypeOutSuccess> {
    const response = await apiService.post('/reclamation-types', data)
    return response as ReclamationTypeOutSuccess
  }

  /**
   * Récupérer un type de réclamation par ID
   */
  async getReclamationTypeById(typeId: number): Promise<ReclamationTypeOutSuccess> {
    const response = await apiService.get(`/reclamation-types/${typeId}`)
    return response as ReclamationTypeOutSuccess
  }

  /**
   * Mettre à jour un type de réclamation
   */
  async updateReclamationType(typeId: number, data: ReclamationTypeUpdateInput): Promise<ReclamationTypeOutSuccess> {
    const response = await apiService.put(`/reclamation-types/${typeId}`, data)
    return response as ReclamationTypeOutSuccess
  }

  /**
   * Supprimer un type de réclamation
   */
  async deleteReclamationType(typeId: number): Promise<ReclamationTypeOutSuccess> {
    const response = await apiService.delete(`/reclamation-types/${typeId}`)
    return response as ReclamationTypeOutSuccess
  }
}

export const reclamationsService = new ReclamationsService()
