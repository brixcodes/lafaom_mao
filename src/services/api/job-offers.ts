// Service pour la gestion des offres d'emploi
import { apiService } from './base'
import type {
  JobOfferCreateInput,
  JobOfferUpdateInput,
  JobOfferOut,
  JobOfferOutSuccess,
  JobOffersPageOutSuccess,
  JobApplicationCreateInput,
  JobApplicationOut,
  JobApplicationOutSuccess,
  JobApplicationsPageOutSuccess,
  JobAttachmentInput,
  JobAttachmentOut,
  JobAttachmentOutSuccess,
  JobAttachmentListOutSuccess,
  JobApplicationOTPRequestInput,
  JobApplicationUpdateByCandidateInput,
  UpdateJobOfferStatusInput,
  InitPaymentOutSuccess,
  PaymentJobApplicationOutSuccess
} from '@/types/job-offers'

export class JobOffersService {
  // === JOB OFFERS ===

  /**
   * Lister les offres d'emploi
   */
  async getJobOffers(params?: {
    page?: number
    page_size?: number
    search?: string
    location?: string
    contract_type?: string
    salary_min?: number
    salary_max?: number
    order_by?: 'created_at' | 'submission_deadline' | 'title' | 'salary'
    asc?: 'asc' | 'desc'
  }): Promise<JobOffersPageOutSuccess> {
    const response = await apiService.get('/job-offers', { params })
    return response as JobOffersPageOutSuccess
  }

  /**
   * Créer une offre d'emploi
   */
  async createJobOffer(jobOfferData: JobOfferCreateInput): Promise<JobOfferOutSuccess> {
    const response = await apiService.post('/job-offers', jobOfferData)
    return response as JobOfferOutSuccess
  }

  /**
   * Récupérer une offre d'emploi par ID
   */
  async getJobOfferById(jobOfferId: string): Promise<JobOfferOutSuccess> {
    const response = await apiService.get(`/job-offers/${jobOfferId}`)
    return response as JobOfferOutSuccess
  }

  /**
   * Mettre à jour une offre d'emploi
   */
  async updateJobOffer(jobOfferId: string, jobOfferData: JobOfferUpdateInput): Promise<JobOfferOutSuccess> {
    const response = await apiService.put(`/job-offers/${jobOfferId}`, jobOfferData)
    return response as JobOfferOutSuccess
  }

  /**
   * Supprimer une offre d'emploi
   */
  async deleteJobOffer(jobOfferId: string): Promise<JobOfferOutSuccess> {
    const response = await apiService.delete(`/job-offers/${jobOfferId}`)
    return response as JobOfferOutSuccess
  }

  // === JOB APPLICATIONS ===

  /**
   * Lister les candidatures
   */
  async getJobApplications(params?: {
    page?: number
    page_size?: number
    search?: string
    status?: string
    is_paid?: boolean
    job_offer_id?: string
    order_by?: 'created_at' | 'application_number' | 'status'
    asc?: 'asc' | 'desc'
  }): Promise<JobApplicationsPageOutSuccess> {
    const response = await apiService.get('/job-applications', { params })
    return response as JobApplicationsPageOutSuccess
  }

  /**
   * Créer une candidature
   */
  async createJobApplication(applicationData: JobApplicationCreateInput): Promise<PaymentJobApplicationOutSuccess> {
    const response = await apiService.post('/job-applications', applicationData)
    return response as PaymentJobApplicationOutSuccess
  }

  /**
   * Uploader un fichier joint pour une candidature
   */
  async uploadJobAttachment(file: File, docType: string): Promise<{ data: { file_path: string } }> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('document_type', docType)
    
    const response = await apiService.upload('/job-attachments/upload', formData)
    return response
  }

  /**
   * Récupérer une candidature par ID
   */
  async getJobApplicationById(applicationId: number): Promise<JobApplicationOutSuccess> {
    const response = await apiService.get(`/job-applications/${applicationId}`)
    return response as JobApplicationOutSuccess
  }

  /**
   * Changer le statut d'une candidature
   */
  async changeJobApplicationStatus(statusData: UpdateJobOfferStatusInput): Promise<JobApplicationOutSuccess> {
    const response = await apiService.post('/job-applications/change-status', statusData)
    return response as JobApplicationOutSuccess
  }

  // === JOB ATTACHMENTS ===

  /**
   * Créer un fichier joint
   */
  async createJobAttachment(attachmentData: JobAttachmentInput): Promise<JobAttachmentOutSuccess> {
    const response = await apiService.post('/job-attachments', attachmentData)
    return response as JobAttachmentOutSuccess
  }

  /**
   * Lister les fichiers joints d'une candidature
   */
  async getJobApplicationAttachments(applicationId: number): Promise<JobAttachmentListOutSuccess> {
    const response = await apiService.get(`/job-applications/${applicationId}/attachments`)
    return response as JobAttachmentListOutSuccess
  }

  /**
   * Supprimer un fichier joint
   */
  async deleteJobAttachment(attachmentId: number): Promise<JobAttachmentOutSuccess> {
    const response = await apiService.delete(`/job-attachments/${attachmentId}`)
    return response as JobAttachmentOutSuccess
  }

  // === JOB APPLICATION OTP ===

  /**
   * Demander un code OTP pour une candidature
   */
  async requestApplicationOTP(otpData: JobApplicationOTPRequestInput): Promise<any> {
    const response = await apiService.post('/job-applications/request-otp', otpData)
    return response
  }

  /**
   * Mettre à jour une candidature par le candidat (avec OTP)
   */
  async updateApplicationByCandidate(updateData: JobApplicationUpdateByCandidateInput): Promise<JobApplicationOutSuccess> {
    const response = await apiService.put('/job-applications/update-by-candidate', updateData)
    return response as JobApplicationOutSuccess
  }

  /**
   * Récupérer les candidatures de l'utilisateur connecté
   */
  async getMyJobApplications(params?: {
    page?: number
    page_size?: number
    search?: string
    status?: string
    job_offer_id?: number
    order_by?: string
    asc?: string
  }): Promise<JobApplicationsPageOutSuccess> {
    const response = await apiService.get('/my-job-applications', { params })
    return response as JobApplicationsPageOutSuccess
  }

  /**
   * Récupérer une candidature spécifique de l'utilisateur connecté
   */
  async getMyJobApplicationById(applicationId: number): Promise<JobApplicationOutSuccess> {
    const response = await apiService.get(`/my-job-applications/${applicationId}`)
    return response as JobApplicationOutSuccess
  }
}

export const jobOffersService = new JobOffersService()
