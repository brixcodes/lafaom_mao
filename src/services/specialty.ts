import type {
  Specialty,
} from '@/types/training'
import { api } from '@/plugins/axios'
import type { BaseOutSuccess } from '@/types/base'

// Interfaces for specialty operations
export interface SpecialtyOutSuccess extends BaseOutSuccess {
  data: Specialty
}

export interface SpecialtyListOutSuccess extends BaseOutSuccess {
  data: Specialty[]
}

// Base API path for specialties
const SPECIALTY_BASE = '/specialties'

// Specialty API functions
export const getTrainingSpecialties = async (): Promise<SpecialtyListOutSuccess> => {
  return api.get(SPECIALTY_BASE)
}

export const createSpecialty = async (data: { name: string; description?: string }): Promise<SpecialtyOutSuccess> => {
  return api.post(SPECIALTY_BASE, data)
}

export const updateSpecialty = async (id: number, data: { name?: string; description?: string }): Promise<SpecialtyOutSuccess> => {
  return api.patch(`${SPECIALTY_BASE}/${id}`, data)
}

export const deleteSpecialty = async (id: number): Promise<SpecialtyOutSuccess> => {
  return api.delete(`${SPECIALTY_BASE}/${id}`)
}
