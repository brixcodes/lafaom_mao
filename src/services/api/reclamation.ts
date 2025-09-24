import { apiService } from './base'
import { API_ENDPOINTS } from '@/config/api'
import type {
  Reclamation,
  ReclamationFullOut,
  ReclamationCreateInput,
  ReclamationUpdateStatusInput,
  ReclamationFilter,
  ReclamationType,
  ReclamationTypeCreateInput,
  ReclamationTypeUpdateInput,
  ReclamationOutSuccess,
  ReclamationsPageOutSuccess,
  ReclamationTypeOutSuccess,
  ReclamationTypeListOutSuccess
} from '@/types/reclamation'


export const reclamationService = {
  // User reclamations
  async createMyReclamation(data: ReclamationCreateInput): Promise<ReclamationOutSuccess> {
    return apiService.post(API_ENDPOINTS.RECLAMATIONS.CREATE, data)
  },

  async getMyReclamations(params: ReclamationFilter): Promise<ReclamationsPageOutSuccess> {
    return apiService.get(API_ENDPOINTS.RECLAMATIONS.MY_RECLAMATIONS, { params })
  },

  async getMyReclamation(id: number): Promise<ReclamationOutSuccess> {
    return apiService.get(API_ENDPOINTS.RECLAMATIONS.DETAIL(id))
  },

  // Admin reclamations
  async getReclamations(params: ReclamationFilter): Promise<ReclamationsPageOutSuccess> {
    return apiService.get(API_ENDPOINTS.RECLAMATIONS.LIST, { params })
  },

  async getReclamation(id: number): Promise<ReclamationOutSuccess> {
    return apiService.get(API_ENDPOINTS.RECLAMATIONS.DETAIL(id))
  },

  async updateReclamationStatus(id: number, data: ReclamationUpdateStatusInput): Promise<ReclamationOutSuccess> {
    return apiService.put(API_ENDPOINTS.RECLAMATIONS.UPDATE_STATUS(id), data) as Promise<ReclamationOutSuccess>
  },

  async updateReclamation(id: number, data: ReclamationCreateInput): Promise<ReclamationOutSuccess> {
    return apiService.put(API_ENDPOINTS.RECLAMATIONS.UPDATE(id), data) as Promise<ReclamationOutSuccess>
  },

  async deleteReclamation(id: number): Promise<ReclamationOutSuccess> {
    return apiService.delete(API_ENDPOINTS.RECLAMATIONS.DELETE(id)) as Promise<ReclamationOutSuccess>
  },

  // Reclamation types
  async getReclamationTypes(): Promise<ReclamationTypeListOutSuccess> {
    return apiService.get(API_ENDPOINTS.RECLAMATION_TYPES.LIST)
  },

  async getActiveReclamationTypes(): Promise<ReclamationTypeListOutSuccess> {
    return apiService.get(API_ENDPOINTS.RECLAMATION_TYPES.ACTIVE)
  },

  async createReclamationType(data: ReclamationTypeCreateInput): Promise<ReclamationTypeOutSuccess> {
    return apiService.post(API_ENDPOINTS.RECLAMATION_TYPES.CREATE, data)
  },

  async getReclamationType(id: number): Promise<ReclamationTypeOutSuccess> {
    return apiService.get(API_ENDPOINTS.RECLAMATION_TYPES.DETAIL(id))
  },

  async updateReclamationType(id: number, data: ReclamationTypeUpdateInput): Promise<ReclamationTypeOutSuccess> {
    return apiService.put(API_ENDPOINTS.RECLAMATION_TYPES.UPDATE(id), data) as Promise<ReclamationTypeOutSuccess>
  },

  async deleteReclamationType(id: number): Promise<{ success: boolean; message: string }> {
    return apiService.delete(API_ENDPOINTS.RECLAMATION_TYPES.DELETE(id)) as Promise<{ success: boolean; message: string }>
  }
}
