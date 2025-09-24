import type { BaseOutSuccess, BaseOutPage } from './base'

// ===========================================
// SPECIALTY TYPES
// ===========================================

export interface Specialty {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
}

// ===========================================
// INPUT SCHEMAS
// ===========================================

export interface SpecialtyCreateInput {
  name: string
  description?: string
}

export interface SpecialtyUpdateInput {
  name?: string
  description?: string
}

export interface SpecialtyFilter {
  page?: number
  limit?: number
  search?: string
  name?: string
}

// ===========================================
// OUTPUT SCHEMAS
// ===========================================

export interface SpecialtyOutSuccess extends BaseOutSuccess {
  data: Specialty
}

export interface SpecialtyListOutSuccess extends BaseOutSuccess {
  data: Specialty[]
}

export interface SpecialtyPageOutSuccess extends BaseOutPage {
  data: Specialty[]
}
