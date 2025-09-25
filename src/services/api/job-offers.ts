import { apiService } from './base'

// Types pour les offres d'emploi
export interface JobOffer {
  id: number
  title: string
  description: string
  company: string
  location: string
  salary_min?: number
  salary_max?: number
  employment_type: string
  status: string
  created_at: string
  updated_at: string
}

export interface JobApplication {
  id: number
  job_offer_id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  cover_letter: string
  status: string
  created_at: string
  attachments?: JobAttachment[]
}

export interface JobAttachment {
  id: number
  application_id: number
  file_name: string
  file_path: string
  file_type: string
  created_at: string
}

export interface JobOfferFilter {
  page?: number
  limit?: number
  search?: string
  location?: string
  employment_type?: string
  status?: string
}

export interface CreateJobOfferRequest {
  title: string
  description: string
  company: string
  location: string
  salary_min?: number
  salary_max?: number
  employment_type: string
}

export interface CreateJobApplicationRequest {
  job_offer_id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  cover_letter: string
  attachments?: File[]
}

class JobOffersService {
  // === OFFRES D'EMPLOI ===
  // Récupérer la liste des offres d'emploi
  async getJobOffers(filters: JobOfferFilter = {}): Promise<any> {
    return await apiService.get('/job-offers', { params: filters })
  }

  // Récupérer une offre d'emploi par ID
  async getJobOfferById(jobOfferId: number): Promise<JobOffer> {
    return await apiService.get(`/job-offers/${jobOfferId}`)
  }

  // Créer une offre d'emploi
  async createJobOffer(jobOfferData: CreateJobOfferRequest): Promise<JobOffer> {
    return await apiService.post('/job-offers', jobOfferData)
  }

  // Mettre à jour une offre d'emploi
  async updateJobOffer(jobOfferId: number, jobOfferData: Partial<CreateJobOfferRequest>): Promise<JobOffer> {
    return await apiService.put(`/job-offers/${jobOfferId}`, jobOfferData) as JobOffer
  }

  // Supprimer une offre d'emploi
  async deleteJobOffer(jobOfferId: number): Promise<void> {
    return await apiService.delete(`/job-offers/${jobOfferId}`)
  }

  // === CANDIDATURES D'EMPLOI ===
  // Récupérer la liste des candidatures (admin)
  async getJobApplications(filters: any = {}): Promise<any> {
    return await apiService.get('/job-applications', { params: filters })
  }

  // Récupérer une candidature par ID (admin)
  async getJobApplicationById(applicationId: number): Promise<JobApplication> {
    return await apiService.get(`/job-applications/${applicationId}`)
  }

  // Changer le statut d'une candidature (admin)
  async changeJobApplicationStatus(applicationId: number, status: string): Promise<JobApplication> {
    return await apiService.post(`/job-applications/${applicationId}/status`, { status })
  }

  // Récupérer les pièces jointes d'une candidature
  async getJobApplicationAttachments(applicationId: number): Promise<JobAttachment[]> {
    return await apiService.get(`/job-applications/${applicationId}/attachments`)
  }

  // === MES CANDIDATURES D'EMPLOI ===
  // Créer une candidature d'emploi
  async createJobApplication(applicationData: CreateJobApplicationRequest): Promise<JobApplication> {
    return await apiService.post('/my-job-applications', applicationData)
  }

  // Récupérer mes candidatures d'emploi
  async getMyJobApplications(filters: any = {}): Promise<any> {
    return await apiService.get('/my-job-applications', { params: filters })
  }

  // Récupérer ma candidature d'emploi par ID
  async getMyJobApplicationById(applicationId: number): Promise<JobApplication> {
    return await apiService.get(`/my-job-applications/${applicationId}`)
  }

  // Mettre à jour ma candidature d'emploi
  async updateMyJobApplication(applicationId: number, applicationData: Partial<CreateJobApplicationRequest>): Promise<JobApplication> {
    return await apiService.put(`/my-job-applications/${applicationId}`, applicationData) as JobApplication
  }

  // Supprimer ma candidature d'emploi
  async deleteMyJobApplication(applicationId: number): Promise<void> {
    return await apiService.delete(`/my-job-applications/${applicationId}`)
  }

  // Récupérer les pièces jointes de ma candidature d'emploi
  async getMyJobApplicationAttachments(applicationId: number): Promise<JobAttachment[]> {
    return await apiService.get(`/my-job-applications/${applicationId}/attachments`)
  }

  // Ajouter une pièce jointe à ma candidature d'emploi
  async addJobApplicationAttachment(applicationId: number, file: File): Promise<JobAttachment> {
    const formData = new FormData()
    formData.append('file', file)
    return await apiService.post(`/my-job-applications/${applicationId}/attachments`, formData)
  }

  // Supprimer une pièce jointe de candidature d'emploi
  async deleteJobApplicationAttachment(attachmentId: number): Promise<void> {
    return await apiService.delete(`/my-job-attachments/${attachmentId}`)
  }
}

export const jobOffersService = new JobOffersService()
