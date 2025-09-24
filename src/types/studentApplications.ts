import type { BaseOutSuccess, BaseOutPage } from './base'
import { ApplicationStatusEnum } from './enums'

// ===========================================
// STUDENT APPLICATION TYPES
// ===========================================

export interface StudentAttachment {
  id: number
  application_id: number
  document_type: string
  file_path: string
  upload_date?: string
  created_at: string
  updated_at: string
}

export interface StudentApplication {
  id: number
  user_id: string
  training_id: string
  target_session_id: string
  application_number?: string
  status: ApplicationStatusEnum
  refusal_reason?: string
  registration_fee?: number
  training_fee?: number
  currency: string
  installment_percentage?: number[]
  payment_id?: string
  created_at: string
  updated_at: string
  
  // Relations
  user?: {
    id: string
    first_name: string
    last_name: string
    email: string
    mobile_number?: string
  }
  training?: {
    id: string
    title: string
    status: string
  }
  training_session?: {
    id: string
    start_date?: string
    end_date?: string
    registration_deadline: string
    available_slots?: number
    status: string
  }
  attachments?: StudentAttachment[]
}

// ===========================================
// INPUT SCHEMAS
// ===========================================

export interface StudentApplicationCreateInput {
  training_id: string
  target_session_id: string
  registration_fee?: number
  training_fee?: number
  currency?: string
  installment_percentage?: number[]
  attachments?: {
    document_type: string
    file_path: string
  }[]
}

export interface StudentApplicationUpdateInput {
  status?: ApplicationStatusEnum
  refusal_reason?: string
  registration_fee?: number
  training_fee?: number
  currency?: string
  installment_percentage?: number[]
}

export interface ChangeStudentApplicationStatusInput {
  status: ApplicationStatusEnum
  reason: string
}

export interface StudentApplicationFilter {
  page?: number
  limit?: number
  search?: string
  status?: ApplicationStatusEnum
  training_id?: string
  target_session_id?: string
  user_id?: string
  application_number?: string
  created_from?: string
  created_to?: string
}

// ===========================================
// OUTPUT SCHEMAS
// ===========================================

export interface StudentApplicationOutSuccess extends BaseOutSuccess {
  data: StudentApplication
}

export interface StudentApplicationListOutSuccess extends BaseOutSuccess {
  data: StudentApplication[]
}

export interface StudentApplicationPageOutSuccess extends BaseOutPage {
  data: StudentApplication[]
}
