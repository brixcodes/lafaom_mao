import { apiService } from './base'
import type {
  Specialty,
  SpecialtyCreateInput,
  SpecialtyUpdateInput,
  SpecialtyFilter,
  SpecialtyOutSuccess,
  SpecialtyListOutSuccess,
  SpecialtyPageOutSuccess,
} from '@/types/specialties'

export class SpecialtyService {
  // ===========================================
  // SPECIALTY CRUD
  // ===========================================

  async getSpecialties(filters: SpecialtyFilter): Promise<SpecialtyPageOutSuccess> {
    return apiService.get('/specialties', { params: filters })
  }

  async getSpecialty(specialtyId: number): Promise<SpecialtyOutSuccess> {
    return apiService.get(`/specialties/${specialtyId}`)
  }

  async createSpecialty(data: SpecialtyCreateInput): Promise<SpecialtyOutSuccess> {
    return apiService.post('/specialties', data)
  }

  async updateSpecialty(specialtyId: number, data: SpecialtyUpdateInput): Promise<SpecialtyOutSuccess> {
    return apiService.put(`/specialties/${specialtyId}`, data) as Promise<SpecialtyOutSuccess>
  }

  async deleteSpecialty(specialtyId: number): Promise<SpecialtyOutSuccess> {
    return apiService.delete(`/specialties/${specialtyId}`) as Promise<SpecialtyOutSuccess>
  }

  // ===========================================
  // LIST OPERATIONS
  // ===========================================

  async getAllSpecialties(): Promise<SpecialtyListOutSuccess> {
    return apiService.get('/specialties/all')
  }

  async getActiveSpecialties(): Promise<SpecialtyListOutSuccess> {
    return apiService.get('/specialties/active/all')
  }
}

export const specialtyService = new SpecialtyService()
