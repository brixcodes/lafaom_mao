// Types étendus pour les offres d'emploi

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

export interface JobApplicationFilter {
  page?: number
  page_size?: number
  search?: string
  status?: string
  is_paid?: boolean
  job_offer_id?: string
  order_by?: 'created_at' | 'application_number' | 'status'
  asc?: 'asc' | 'desc'
}

export interface JobApplicationStatus {
  id: string
  status: 'RECEIVED' | 'REFUSED' | 'APPROVED'
  reason?: string
}

export interface JobApplicationUpdateInput {
  id: string
  status?: string
  notes?: string
}

export interface JobDashboardStats {
  offers: {
    total_offers: number
    active_offers: number
    expired_offers: number
    offers_growth_rate: number
  }
  applications: {
    total_applications: number
    pending_applications: number
    accepted_applications: number
    rejected_applications: number
    applications_growth_rate: number
  }
  revenue: {
    total_revenue: number
    monthly_revenue: number
    revenue_growth_rate: number
  }
}

export interface JobOfferStats {
  offers_growth_rate: number
  total_offers: number
  active_offers: number
  expired_offers: number
}

export interface JobApplicationStats {
  applications_growth_rate: number
  acceptance_rate: number
  total_applications: number
  pending_applications: number
  accepted_applications: number
  rejected_applications: number
}
