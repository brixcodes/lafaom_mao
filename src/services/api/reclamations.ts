import { apiService } from './base'
import type {
  Reclamation,
  ReclamationCreateInput,
  ReclamationUpdateInput,
  ReclamationAdminUpdateInput,
  ReclamationFilter,
  ReclamationOutSuccess,
  ReclamationListOutSuccess,
  ReclamationPageOutSuccess,
  ReclamationType,
  ReclamationTypeListOutSuccess,
} from '@/types/reclamations'

export class ReclamationService {
  // ===========================================
  // RECLAMATION CRUD
  // ===========================================

  async getReclamations(filters: ReclamationFilter): Promise<ReclamationPageOutSuccess> {
    return apiService.get('/reclamations', { params: filters })
  }

  async getReclamation(reclamationId: number): Promise<ReclamationOutSuccess> {
    return apiService.get(`/reclamations/${reclamationId}`)
  }

  async createReclamation(data: ReclamationCreateInput): Promise<ReclamationOutSuccess> {
    return apiService.post('/reclamations', data) as Promise<ReclamationOutSuccess>
  }

  async updateReclamation(reclamationId: number, data: ReclamationUpdateInput): Promise<ReclamationOutSuccess> {
    return apiService.put(`/reclamations/${reclamationId}`, data) as Promise<ReclamationOutSuccess>
  }

  async deleteReclamation(reclamationId: number): Promise<ReclamationOutSuccess> {
    return apiService.delete(`/reclamations/${reclamationId}`) as Promise<ReclamationOutSuccess>
  }

  // ===========================================
  // ADMIN OPERATIONS
  // ===========================================

  async getAllReclamationsAdmin(filters: ReclamationFilter): Promise<ReclamationPageOutSuccess> {
    return apiService.get('/reclamations/admin', { params: filters })
  }

  async updateReclamationStatus(reclamationId: number, data: ReclamationAdminUpdateInput): Promise<ReclamationOutSuccess> {
    return apiService.put(`/reclamations/${reclamationId}/status`, data)
  }

  // ===========================================
  // USER OPERATIONS
  // ===========================================

  async getMyReclamations(filters: ReclamationFilter): Promise<ReclamationPageOutSuccess> {
    return apiService.get('/my-reclamations', { params: filters })
  }

  async getMyReclamation(reclamationId: number): Promise<ReclamationOutSuccess> {
    return apiService.get(`/my-reclamations/${reclamationId}`)
  }

  async createMyReclamation(data: ReclamationCreateInput): Promise<ReclamationOutSuccess> {
    return apiService.post('/my-reclamations', data)
  }

  // ===========================================
  // RECLAMATION TYPES
  // ===========================================

  async getActiveReclamationTypes(): Promise<ReclamationTypeListOutSuccess> {
    return apiService.get('/reclamation-types/active/all')
  }

  async createReclamationType(data: any): Promise<any> {
    return apiService.post('/reclamation-types', data)
  }

  async getReclamationType(typeId: number): Promise<any> {
    return apiService.get(`/reclamation-types/${typeId}`)
  }

  async updateReclamationType(typeId: number, data: any): Promise<any> {
    return apiService.put(`/reclamation-types/${typeId}`, data)
  }

  async deleteReclamationType(typeId: number): Promise<any> {
    return apiService.delete(`/reclamation-types/${typeId}`)
  }
}

export const reclamationService = new ReclamationService()
