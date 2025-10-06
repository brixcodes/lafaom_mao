import type { BaseModel, BaseOutPage, BaseOutSuccess } from './index'

// Status types for job applications
export type JobApplicationStatus = 'RECEIVED' | 'REFUSED' | 'APPROVED'

// === JOB APPLICATIONS ===
export interface JobApplicationOut extends BaseModel {
  id: number
  job_offer_id: string
  application_number: string
  status: JobApplicationStatus
  refusal_reason?: string
  submission_fee: number
  email: string
  phone_number: string
  first_name: string
  last_name: string
  civility?: string
  country_code?: string
  date_of_birth?: string
  notes?: string
  attachments?: JobAttachmentOut[]
  job_offer?: {
    id: string
    title: string
    reference: string
    location: string
    contract_type: string
  }
}

// Alias pour faciliter l'usage
export type JobApplication = JobApplicationOut

export interface JobApplicationCreateInput {
  job_offer_id: string
  email: string
  phone_number: string
  first_name: string
  last_name: string
  civility?: string
  country_code?: string
  date_of_birth?: string
  attachments: JobAttachmentInput[]
  backendErrors?: Record<string, string>
}

export interface JobApplicationUpdateInput {
  id: string
  status?: JobApplicationStatus
  refusal_reason?: string
  notes?: string
}

export interface JobApplicationUpdateByCandidateInput {
  application_number: string
  phone_number?: string
  first_name?: string
  last_name?: string
  civility?: string
  country_code?: string
  date_of_birth?: string
  attachments: JobAttachmentInput[]
  otp_code: string
}

export interface JobApplicationOTPRequestInput {
  application_number: string
  email: string
}

export interface JobApplicationFilter {
  page?: number
  page_size?: number
  search?: string
  status?: JobApplicationStatus
  job_offer_id?: string
  order_by?: 'created_at' | 'application_number' | 'status'
  asc?: 'asc' | 'desc'
}

export interface UpdateJobApplicationStatusInput {
  application_id: number
  status: JobApplicationStatus
  reason?: string
}

// === JOB ATTACHMENTS ===
export interface JobAttachmentInput {
  name: string
  file: File
}

export interface JobAttachmentOut extends BaseModel {
  id: number
  application_id: number
  document_type: string
  file_path: string
  name: string
  upload_date?: string
}

// Alias pour faciliter l'usage
export type JobAttachment = JobAttachmentOut

// === RESPONSE TYPES ===
export interface JobApplicationOutSuccess extends BaseOutSuccess<JobApplicationOut> {}
export interface JobApplicationsPageOutSuccess extends BaseOutPage<JobApplicationOut> {}
export interface JobAttachmentOutSuccess extends BaseOutSuccess<JobAttachmentOut> {}
export interface JobAttachmentListOutSuccess extends BaseOutSuccess<JobAttachmentOut[]> {}

// === APPLICATION STATUSES ===
export const APPLICATION_STATUSES = [
  { value: 'RECEIVED', text: 'Reçue', color: 'warning', icon: 'ri-time-line' },
  { value: 'APPROVED', text: 'Approuvée', color: 'success', icon: 'ri-check-circle-line' },
  { value: 'REFUSED', text: 'Refusée', color: 'error', icon: 'ri-close-circle-line' }
] as const

// === STATUS LABELS (pour compatibilité) ===
export const APPLICATION_STATUS_LABELS = {
  ['RECEIVED']: {
    text: 'Reçue',
    color: 'warning',
    icon: 'ri-time-line'
  },
  ['APPROVED']: {
    text: 'Approuvée',
    color: 'success',
    icon: 'ri-check-circle-line'
  },
  ['REFUSED']: {
    text: 'Refusée',
    color: 'error',
    icon: 'ri-close-circle-line'
  }
} as const

// === DOCUMENT TYPES ===
export const APPLICATION_DOCUMENT_TYPES = [
  { value: 'CV', text: 'Curriculum Vitae' },
  { value: 'COVER_LETTER', text: 'Lettre de motivation' },
  { value: 'DIPLOMA', text: 'Diplôme' },
  { value: 'CERTIFICATE', text: 'Certificat' },
  { value: 'RECOMMENDATION', text: 'Lettre de recommandation' },
  { value: 'PORTFOLIO', text: 'Portfolio' },
  { value: 'OTHER', text: 'Autre' }
] as const

// === UTILITY TYPES ===
export interface JobApplicationFormData {
  application: JobApplicationCreateInput
  attachments: File[]
  loading: boolean
  errors: Record<string, string>
}

// === STATISTICS ===
export interface JobApplicationStats {
  total_applications: number
  pending_applications: number
  processing_applications: number
  accepted_applications: number
  rejected_applications: number
  cancelled_applications: number
  applications_this_month: number
  applications_previous_month: number
  applications_growth_rate: number
  applications_growth_percentage: number
  acceptance_rate: number
  conversion_rate: number
  average_time_to_hire: number // en jours
  pending_percentage: number
  processing_percentage: number
  accepted_percentage: number
  rejected_percentage: number
  cancelled_percentage: number
}

export interface JobApplicationStatsOutSuccess extends BaseOutSuccess<JobApplicationStats> {}