import type { BaseOutSuccess } from './base'

// Enums
export enum TrainingTypeEnum {
  ON_SITE = 'On-Site',
  OFF_SITE = 'Off-Site',
}

export enum TrainingStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum DurationEnum {
  MONTHS = 'MONTHS',
  YEARS = 'YEARS',
  DAYS = 'DAYS',
  HOURS = 'HOURS',
}

export enum TrainingSessionStatusEnum {
  OPEN_FOR_REGISTRATION = 'OPEN_FOR_REGISTRATION',
  CLOSE_FOR_REGISTRATION = 'CLOSE_FOR_REGISTRATION',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
}

export enum ApplicationStatusEnum {
  RECEIVED = 'RECEIVED',
  REFUSED = 'REFUSED',
  APPROVED = 'APPROVED',
}

// Interfaces
export interface Specialty {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Training {
  id: string
  title: string
  status: TrainingStatus
  duration: number
  duration_unit: DurationEnum
  specialty_id: number
  specialty?: Specialty
  info_sheet?: string
  training_type: TrainingTypeEnum
  presentation: string
  description: string
  objectives: string
  benefits?: Array<{ [key: string]: string }>
  strengths?: Array<{ [key: string]: string }>
  target_skills: string
  program: string
  target_audience: string
  prerequisites: string
  price: number
  enrollment: string
  created_at: string
  updated_at: string
}

export interface TrainingSession {
  id: string
  training_id: string
  center_id?: number
  start_date?: string
  end_date?: string
  registration_deadline: string
  available_slots?: number
  status: TrainingSessionStatusEnum
  registration_fee?: number
  training_fee?: number
  currency: string
  created_at: string
  updated_at: string
  training?: Training
  center?: any // Add TrainingCenter interface if needed
}

export interface StudentApplication {
  id: number
  user_id: string
  training_id: string
  application_number: string
  status: ApplicationStatusEnum
  refusal_reason?: string
  registration_fee: number
  training_fee: number
  installment_percentage: number[]
  created_at: string
  updated_at: string
  training?: Training
  attachments?: StudentAttachment[]
}

export type DocumentType = 'ID_CARD' | 'CV' | 'COVER_LETTER' | 'DIPLOMA' | 'PROOF_OF_ADDRESS' | 'OTHER'

export interface StudentAttachment {
  id: number
  application_id: number
  document_type: DocumentType
  file_path: string
  upload_date?: string
  created_at: string
  updated_at: string
}

// Input/Output Types
export interface TrainingCreateInput {
  title: string
  status?: TrainingStatus
  duration: number
  duration_unit: DurationEnum
  specialty_id: number
  info_sheet?: File
  training_type: TrainingTypeEnum
  presentation: string
  benefits?: Array<{ [key: string]: string }>
  strengths?: Array<{ [key: string]: string }>
  target_skills: string
  program: string
  target_audience: string
  prerequisites?: string
  enrollment: string
}

export interface TrainingUpdateInput extends Partial<TrainingCreateInput> {}

export interface TrainingSessionCreateInput {
  training_id: string
  center_id?: number | null
  start_date?: string | null
  end_date?: string | null
  registration_deadline: string
  available_slots?: number | null
  registration_fee?: number | null
  training_fee?: number | null
  currency?: string
  status?: string
}

export interface TrainingSessionUpdateInput extends Partial<TrainingSessionCreateInput> {}

export interface StudentApplicationCreateInput {
  training_id: string
  attachments?: File[]
}

export interface StudentApplicationUpdateInput {
  status?: ApplicationStatusEnum
  refusal_reason?: string
  registration_fee?: number
  training_fee?: number
  installment_percentage?: number[]
}

// API Response Types
export interface TrainingOutSuccess extends BaseOutSuccess {
  data: Training
}

export interface TrainingListOutSuccess extends BaseOutSuccess {
  data: Training[]
  page: number
  number: number
  total_number: number
}

export interface TrainingSessionOutSuccess extends BaseOutSuccess {
  data: TrainingSession
}

export interface TrainingSessionListOutSuccess extends BaseOutSuccess {
  data: TrainingSession[]
}

export interface StudentApplicationOutSuccess extends BaseOutSuccess {
  data: StudentApplication
}

export interface StudentApplicationListOutSuccess extends BaseOutSuccess {
  data: StudentApplication[]
}

// Filter Types
export interface TrainingFilter {
  search?: string
  specialty_id?: number
  training_type?: TrainingTypeEnum
  status?: TrainingStatus
  duration_unit?: DurationEnum
  page?: number
  page_size?: number
  order_by?: 'title' | 'created_at' | 'updated_at'
  asc?: 'asc' | 'desc'
}

export interface SessionFilter {
  training_id?: string
  center_id?: number
  status?: TrainingSessionStatusEnum
  date_from?: string
  date_to?: string
  page?: number
  page_size?: number
  order_by?: 'start_date' | 'registration_deadline' | 'created_at'
  asc?: 'asc' | 'desc'
}

export interface ApplicationFilter {
  user_id?: string
  training_id?: string
  status?: ApplicationStatusEnum
  date_from?: string
  date_to?: string
  page?: number
  page_size?: number
  order_by?: 'created_at' | 'application_number'
  asc?: 'asc' | 'desc'
}
