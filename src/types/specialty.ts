import type { BaseOutSuccess } from './base'

export interface Specialty {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface SpecialtyCreateInput {
  name: string
  description?: string
}

export interface SpecialtyUpdateInput extends Partial<SpecialtyCreateInput> {}

export interface SpecialtyOutSuccess extends BaseOutSuccess {
  data: Specialty
}

export interface SpecialtyListOutSuccess extends BaseOutSuccess {
  data: Specialty[]
  page: number
  number: number
  total_number: number
}
