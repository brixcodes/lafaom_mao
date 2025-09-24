import type { BaseModel, BaseOutPage, BaseOutSuccess } from './index'

// Status types for job applications
export type JobApplicationStatus = 'pending' | 'processing' | 'accepted' | 'rejected' | 'cancelled'

// === JOB OFFERS ===
export interface JobOfferOut extends BaseModel {
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
  deadline: string
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

export interface JobOfferCreateInput {
  reference: string
  title: string
  location: string
  postal_code: string
  contract_type: string
  uncertain_term?: boolean
  start_date?: string
  end_date?: string
  deadline?: string
  weekly_hours?: number
  driving_license_required?: boolean
  submission_deadline: string
  main_mission?: string
  responsibilities?: string
  competencies?: string
  profile?: string
  salary?: number
  benefits?: string
  submission_fee: number
  currency?: string
  attachment?: string[]
  conditions?: string
  backendErrors?: Record<string, string>
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
  deadline?: string
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

export interface JobOfferFilter {
  page?: number
  page_size?: number
  search?: string
  location?: string
  contract_type?: string
  salary_min?: number
  salary_max?: number
  order_by?: 'created_at' | 'submission_deadline' | 'title' | 'salary'
  asc?: 'asc' | 'desc'
}

// === JOB ATTACHMENTS ===
// Pour upload de fichiers individuels
export interface JobAttachmentInput {
  name: string
  file: File
}

// Pour référence d'attachments par URL (backend format)
export interface JobAttachmentInput2 {
  name: string
  url: string
}

export interface JobApplicationOut extends BaseModel {
  id: number
  job_offer_id: string
  application_number: string
  status: JobApplicationStatus
  refusal_reason?: string
  submission_fee: number
  currency: string
  email: string
  phone_number: string
  first_name: string
  last_name: string
  civility?: string
  country_code?: string
  city?: string
  address?: string
  date_of_birth?: string
  attachments?: JobAttachmentOut[]
  job_offer?: JobOfferOut
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
  city?: string
  address?: string
  date_of_birth?: string
  attachments?: JobAttachmentInput2[] // URLs des fichiers déjà uploadés
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

export interface UpdateJobOfferStatusInput {
  application_id: number
  status: JobApplicationStatus
  reason?: string
}

// === JOB ATTACHMENTS ===
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
export interface JobOfferOutSuccess extends BaseOutSuccess<JobOfferOut> {}
export interface JobOffersPageOutSuccess extends BaseOutPage<JobOfferOut> {}
export interface JobApplicationOutSuccess extends BaseOutSuccess<JobApplicationOut> {}
export interface JobApplicationsPageOutSuccess extends BaseOutPage<JobApplicationOut> {}

export interface PaymentJobApplicationOut {
  job_application: JobApplicationOut
  payment: {
    payment_provider: string
    amount: number
    transaction_id: string
    payment_link?: string
    notify_url?: string
  }
}

export interface PaymentJobApplicationOutSuccess extends BaseOutSuccess<PaymentJobApplicationOut> {}
export interface JobAttachmentOutSuccess extends BaseOutSuccess<JobAttachmentOut> {}
export interface JobAttachmentListOutSuccess extends BaseOutSuccess<JobAttachmentOut[]> {}

// === UTILITY TYPES ===
export interface JobOfferFormData {
  offer: JobOfferCreateInput | JobOfferUpdateInput
  isEditing: boolean
  loading: boolean
  errors: Record<string, string>
}

export interface JobApplicationFormData {
  application: JobApplicationCreateInput
  attachments: File[]
  loading: boolean
  errors: Record<string, string>
}

// === CONTRACT TYPES ===
export const CONTRACT_TYPES = [
  { value: 'CDI', text: 'Contrat à Durée Indéterminée' },
  { value: 'CDD', text: 'Contrat à Durée Déterminée' },
  { value: 'STAGE', text: 'Stage' },
  { value: 'FREELANCE', text: 'Freelance' },
  { value: 'INTERIM', text: 'Intérim' },
  { value: 'APPRENTISSAGE', text: 'Apprentissage' },
  { value: 'ALTERNANCE', text: 'Alternance' }
] as const

// === CURRENCIES ===
export const CURRENCIES = [
  { value: 'EUR', text: 'Euro (€)' },
  { value: 'USD', text: 'Dollar US ($)' },
  { value: 'XAF', text: 'Franc CFA (FCFA)' },
  { value: 'GBP', text: 'Livre Sterling (£)' }
] as const

// === DOCUMENT TYPES ===
export const DOCUMENT_TYPES = [
  { value: 'CV', text: 'Curriculum Vitae' },
  { value: 'COVER_LETTER', text: 'Lettre de motivation' },
  { value: 'DIPLOMA', text: 'Diplôme / Certification' },
  { value: 'TRANSCRIPT', text: 'Relevé de notes' },
  { value: 'PORTFOLIO', text: 'Portfolio / Réalisations' },
  { value: 'RECOMMENDATION', text: 'Lettre de recommandation' },
  { value: 'WORK_PERMIT', text: 'Autorisation / Visa de travail' },
  { value: 'CRIMINAL_RECORD', text: 'Extrait de casier judiciaire' },
  { value: 'MEDICAL_CERTIFICATE', text: 'Certificat médical' },
  { value: 'DRIVING_LICENSE', text: 'Permis de conduire' },
  { value: 'PHOTO_ID', text: 'Carte d’identité / Passeport' },
  { value: 'PROOF_OF_ADDRESS', text: 'Justificatif de domicile' },
  { value: 'SOCIAL_SECURITY_NUMBER', text: 'Numéro de sécurité sociale / Identification fiscale' },
  { value: 'REFERENCE_LIST', text: 'Liste de références professionnelles' },
  { value: 'AWARDS', text: 'Prix et distinctions' },
  { value: 'CERTIFICATES', text: 'Certificats de formation complémentaire' },
  { value: 'LANGUAGE_CERTIFICATES', text: 'Certificats de langue' },
  { value: 'PORTFOLIO_LINK', text: 'Lien vers portfolio en ligne' },
  { value: 'PHOTO', text: 'Photo professionnelle' },
  { value: 'ETHICS_DECLARATION', text: 'Déclaration d’éthique / Conformité' },
  { value: 'OTHER', text: 'Autre' }
] as const


// === APPLICATION STATUSES ===
export const APPLICATION_STATUSES = [
  { value: 'pending', text: 'En attente', color: 'warning', icon: 'ri-time-line' },
  { value: 'processing', text: 'En traitement', color: 'info', icon: 'ri-loader-line' },
  { value: 'accepted', text: 'Acceptée', color: 'success', icon: 'ri-check-circle-line' },
  { value: 'rejected', text: 'Rejetée', color: 'error', icon: 'ri-close-circle-line' },
  { value: 'cancelled', text: 'Annulée', color: 'surface', icon: 'ri-forbid-line' }
] as const

// === STATUS LABELS (pour compatibilité) ===
export const APPLICATION_STATUS_LABELS = {
  ['pending']: {
    text: 'En attente',
    color: 'warning',
    icon: 'ri-time-line'
  },
  ['processing']: {
    text: 'En traitement',
    color: 'info',
    icon: 'ri-loader-line'
  },
  ['accepted']: {
    text: 'Acceptée',
    color: 'success',
    icon: 'ri-check-circle-line'
  },
  ['rejected']: {
    text: 'Rejetée',
    color: 'error',
    icon: 'ri-close-circle-line'
  },
  ['cancelled']: {
    text: 'Annulée',
    color: 'surface',
    icon: 'ri-forbid-line'
  }
} as const

// === JOB STATISTICS ===
export interface JobOfferStats {
  total_offers: number
  active_offers: number
  expired_offers: number
  draft_offers: number
  offers_this_month: number
  offers_growth_rate: number
  offers_previous_month: number
  offers_growth_percentage: number
}

export interface JobApplicationStats {
  total_applications: number
  pending_applications: number
  processing_applications: number
  accepted_applications: number
  rejected_applications: number
  cancelled_applications: number
  applications_this_month: number
  applications_growth_rate: number
  applications_previous_month: number
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

export interface JobContractTypeStats {
  contract_type: string
  count: number
  percentage: number
}

export interface JobLocationStats {
  location: string
  count: number
  percentage: number
}

export interface TopJobOffer {
  id: string
  title: string
  location: string
  applications_count: number
  conversion_rate: number
  created_at: string
}

export interface JobInsight {
  type: 'growth' | 'opportunity' | 'optimization' | 'warning'
  title: string
  description: string
  metric?: string
  value?: string | number
  trend?: 'up' | 'down' | 'stable'
}

export interface ApplicationEvolution {
  period: string // 'YYYY-MM' ou 'YYYY-MM-DD'
  applications_count: number
  offers_count: number
  conversion_rate: number
}

export interface JobSalaryStats {
  min_salary: number
  max_salary: number
  average_salary: number
  median_salary: number
  currency: string
}

export interface JobMonthlyStats {
  month: string
  year: number
  offers_count: number
  applications_count: number
}

export interface JobDashboardStats {
  offers: JobOfferStats
  applications: JobApplicationStats
  contract_types: JobContractTypeStats[]
  locations: JobLocationStats[]
  salary_stats: JobSalaryStats
  monthly_stats: JobMonthlyStats[]
  top_offers: TopJobOffer[]
  insights: JobInsight[]
  applications_evolution: ApplicationEvolution[]
  recent_activity: {
    recent_offers: JobOfferOut[]
    recent_applications: JobApplicationOut[]
  }
}

// === RESPONSE TYPES FOR STATISTICS ===
export interface JobDashboardStatsOutSuccess extends BaseOutSuccess<JobDashboardStats> {}
export interface JobOfferStatsOutSuccess extends BaseOutSuccess<JobOfferStats> {}
export interface JobApplicationStatsOutSuccess extends BaseOutSuccess<JobApplicationStats> {}
