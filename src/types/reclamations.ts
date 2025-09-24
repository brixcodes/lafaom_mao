import type { BaseOutSuccess, BaseOutPage } from './base'
import { ReclamationStatusEnum, ReclamationPriorityEnum } from './enums'

// ===========================================
// RECLAMATION TYPES
// ===========================================

export interface ReclamationType {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Reclamation {
  id: number
  admin_id?: string
  reclamation_number: string
  application_number: string
  subject: string
  reclamation_type: number
  priority: ReclamationPriorityEnum
  status: ReclamationStatusEnum
  description: string
  closure_date?: string
  created_at: string
  updated_at: string
  
  // Relations
  admin?: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
  reclamation_type_obj?: ReclamationType
}

// ===========================================
// INPUT SCHEMAS
// ===========================================

export interface ReclamationCreateInput {
  application_number: string
  subject: string
  reclamation_type: number
  priority: ReclamationPriorityEnum
  description: string
}

export interface ReclamationUpdateInput {
  subject?: string
  reclamation_type?: number
  priority?: ReclamationPriorityEnum
  description?: string
}

export interface ReclamationAdminUpdateInput {
  admin_id: string
  priority: ReclamationPriorityEnum
  status: ReclamationStatusEnum
  description: string
}

export interface ReclamationFilter {
  page?: number
  limit?: number
  search?: string
  status?: ReclamationStatusEnum
  priority?: ReclamationPriorityEnum
  reclamation_type?: number
  admin_id?: string
  application_number?: string
  reclamation_number?: string
  created_from?: string
  created_to?: string
}

// ===========================================
// OUTPUT SCHEMAS
// ===========================================

export interface ReclamationOutSuccess extends BaseOutSuccess {
  data: Reclamation
}

export interface ReclamationListOutSuccess extends BaseOutSuccess {
  data: Reclamation[]
}

export interface ReclamationPageOutSuccess extends BaseOutPage {
  data: Reclamation[]
}

export interface ReclamationTypeOutSuccess extends BaseOutSuccess {
  data: ReclamationType
}

export interface ReclamationTypeListOutSuccess extends BaseOutSuccess {
  data: ReclamationType[]
}
