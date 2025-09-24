// Types pour les réclamations
export enum ReclamationStatusEnum {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED'
}

export enum ReclamationPriorityEnum {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface ReclamationType {
  id: number
  name: string
  description?: string
  is_active: boolean
  sort_order?: number
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
}

export interface ReclamationFullOut extends Reclamation {
  admin_name?: string
  reclamation_type_name?: string
}

export interface ReclamationCreateInput {
  application_number: string
  subject: string
  reclamation_type: number
  priority: ReclamationPriorityEnum
  description: string
}

export interface ReclamationUpdateStatusInput {
  status: ReclamationStatusEnum
  admin_id?: string
}

export interface ReclamationFilter {
  page: number
  page_size: number
  search?: string
  status?: ReclamationStatusEnum
  priority?: ReclamationPriorityEnum
  reclamation_type?: number
  application_number?: string
  order_by?: 'created_at' | 'updated_at' | 'priority'
  asc?: 'asc' | 'desc'
}

export interface ReclamationTypeCreateInput {
  name: string
  description?: string
  is_active?: boolean
  sort_order?: number
}

export interface ReclamationTypeUpdateInput {
  name?: string
  description?: string
  is_active?: boolean
  sort_order?: number
}

// Response types
export interface ReclamationOutSuccess {
  success: boolean
  message: string
  data: Reclamation
}

export interface ReclamationsPageOutSuccess {
  success: boolean
  message: string
  data: Reclamation[]
  page: number
  number: number
  total_number: number
}

export interface ReclamationTypeOutSuccess {
  success: boolean
  message: string
  data: ReclamationType
}

export interface ReclamationTypeListOutSuccess {
  success: boolean
  message: string
  data: ReclamationType[]
}

// Status configuration for UI
export interface ReclamationStatusConfig {
  text: string
  color: string
  icon: string
}

export interface ReclamationPriorityConfig {
  text: string
  color: string
  icon: string
}
