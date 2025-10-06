// Types pour les offres d'emploi et candidatures

export interface JobOfferCreateInput {
  reference: string
  title: string
  location: string
  postal_code: string
  contract_type: string
  uncertain_term: boolean
  start_date?: string
  end_date?: string
  weekly_hours?: number
  driving_license_required: boolean
  submission_deadline: string
  main_mission?: string
  responsibilities?: string
  competencies?: string
  profile?: string
  salary?: number
  benefits?: string
  submission_fee: number
  currency: string
  attachment?: string[]
  conditions?: string
}

export interface JobOfferUpdateInput {
  reference?: string
  title?: string
  location?: string
  postal_code?: string
  contract_type?: string
  uncertain_term?: boolean
  start_date?: string
  end_date?: string
  weekly_hours?: number
  driving_license_required?: boolean
  submission_deadline?: string
  main_mission?: string
  responsibilities?: string
  competencies?: string
  profile?: string
  salary?: number
  benefits?: string
  submission_fee?: number
  currency?: string
  attachment?: string[]
  conditions?: string
}

export interface JobOfferOut {
  id: string
  reference: string
  title: string
  location: string
  postal_code: string
  contract_type: string
  uncertain_term: boolean
  start_date?: string
  end_date?: string
  weekly_hours?: number
  driving_license_required: boolean
  submission_deadline: string
  main_mission?: string
  responsibilities?: string
  competencies?: string
  profile?: string
  salary?: number
  benefits?: string
  submission_fee: number
  currency: string
  attachment?: string[]
  conditions?: string
  created_at: string
  updated_at: string
}

export interface JobOfferOutSuccess {
  success: boolean
  message: string
  data: JobOfferOut
}

export interface JobOffersPageOutSuccess {
  data: JobOfferOut[]
  page: number
  number: number
  total_number: number
}

// === JOB APPLICATIONS ===

export interface JobApplicationCreateInput {
  job_offer_id: string
  email: string
  phone_number: string
  first_name: string
  last_name: string
  civility?: string
  country_code?: string
  city?: string
  address?: string
  date_of_birth?: string
  attachments?: JobAttachmentInput2[]
}

export interface JobApplicationUpdateByCandidateInput {
  application_number: string
  email: string
  otp_code: string
  phone_number?: string
  first_name?: string
  last_name?: string
  civility?: string
  city?: string
  address?: string
  country_code?: string
  date_of_birth?: string
  attachments?: JobAttachmentInput2[]
}

export interface JobApplicationOut {
  id: number
  job_offer_id: string
  application_number: string
  status: string
  refusal_reason?: string
  submission_fee: number
  currency: string
  payment_id?: string
  email: string
  phone_number: string
  first_name: string
  last_name: string
  civility?: string
  country_code?: string
  city?: string
  address?: string
  date_of_birth?: string
  created_at: string
  updated_at: string
}

export interface JobApplicationFullOut extends JobApplicationOut {
  attachments?: JobAttachmentOut[]
}

export interface JobApplicationOutSuccess {
  success: boolean
  message: string
  data: JobApplicationOut
}

export interface JobApplicationsPageOutSuccess {
  data: JobApplicationOut[]
  page: number
  number: number
  total_number: number
}

// === JOB ATTACHMENTS ===

export interface JobAttachmentInput {
  name: string
  file: File
}

export interface JobAttachmentInput2 {
  name: string
  url: string
}

export interface JobAttachmentOut {
  id: number
  application_id?: number
  document_type: string
  file_path: string
  created_at: string
  updated_at: string
}

export interface JobAttachmentOutSuccess {
  success: boolean
  message: string
  data: JobApplicationFullOut
}

export interface JobAttachmentListOutSuccess {
  success: boolean
  message: string
  data: JobAttachmentOut[]
}

// === JOB APPLICATION OTP ===

export interface JobApplicationOTPRequestInput {
  application_number: string
  email: string
}

// === STATUS UPDATE ===

export interface UpdateJobOfferStatusInput {
  application_id: number
  status: 'RECEIVED' | 'REFUSED' | 'APPROVED'
  reason?: string
}

// === PAYMENT ===

export interface InitPaymentOut {
  payment_provider: string
  amount: number
  transaction_id: string
  payment_link?: string
  notify_url?: string
  message?: string
}

export interface InitPaymentOutSuccess {
  success: boolean
  message: string
  data: InitPaymentOut
}
