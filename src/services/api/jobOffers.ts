// Service API pour les offres d'emploi
import { apiService } from './base'
import { API_ENDPOINTS } from '@/config/api'
import type {
  JobOfferCreateInput,
  JobOfferUpdateInput,
  JobOfferOutSuccess,
  JobOffersPageOutSuccess,
  JobOfferFilter,
  JobApplicationCreateInput,
  JobApplicationUpdateByCandidateInput,
  JobApplicationOTPRequestInput,
  JobApplicationOutSuccess,
  JobApplicationsPageOutSuccess,
  JobApplicationFilter,
  UpdateJobOfferStatusInput,
  JobAttachmentInput2,
  JobAttachmentOutSuccess,
  JobAttachmentListOutSuccess,
  PaymentJobApplicationOutSuccess,
  JobDashboardStatsOutSuccess,
  JobOfferStatsOutSuccess,
  JobApplicationStatsOutSuccess,
} from '@/types/jobOffers'
import type { BaseOutSuccess } from '@/types'

export class JobOffersService {
  // === JOB OFFERS ===

  async getJobOffers(filter?: JobOfferFilter): Promise<JobOffersPageOutSuccess> {
    return apiService.get(API_ENDPOINTS.JOB_OFFERS.LIST, filter)
  }

  async getJobOfferById(id: string): Promise<JobOfferOutSuccess> {
    return apiService.get(API_ENDPOINTS.JOB_OFFERS.DETAIL(id))
  }

  async createJobOffer(data: JobOfferCreateInput): Promise<JobOfferOutSuccess> {
    return apiService.postNoConfirm(API_ENDPOINTS.JOB_OFFERS.CREATE, data)
  }

  async updateJobOffer(id: string, data: JobOfferCreateInput): Promise<JobOfferOutSuccess> {
    return apiService.put(API_ENDPOINTS.JOB_OFFERS.UPDATE(id), data, {
      successMessage: 'Offre mise à jour avec succès',
      errorMessage: 'Erreur lors de la mise à jour'
    })
  }

  async deleteJobOffer(id: string): Promise<JobOfferOutSuccess> {
    return apiService.delete(API_ENDPOINTS.JOB_OFFERS.DELETE(id), {
      successMessage: 'Offre supprimée avec succès',
      errorMessage: 'Erreur lors de la suppression'
    })
  }

  // === JOB APPLICATIONS ===

  async getJobApplications(filter?: JobApplicationFilter): Promise<JobApplicationsPageOutSuccess> {
    return apiService.get(API_ENDPOINTS.JOB_OFFERS.APPLICATIONS.LIST, filter)
  }

  async getJobApplicationById(id: number): Promise<JobApplicationOutSuccess> {
    return apiService.get(API_ENDPOINTS.JOB_OFFERS.APPLICATIONS.DETAIL(id))
  }

  // Upload individual attachment file and return JobAttachmentOut
  async uploadJobAttachment(file: File, documentType: string): Promise<JobAttachmentOutSuccess> {
    console.log(`📤 Upload attachment: ${documentType}`, {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    })
    
    const formData = new FormData()
    formData.append('name', documentType)
    formData.append('file', file)
    
    return apiService.upload(API_ENDPOINTS.JOB_OFFERS.ATTACHMENTS.UPLOAD, formData)
  }

  async createJobApplication(data: JobApplicationCreateInput, files?: { [docType: string]: File }): Promise<PaymentJobApplicationOutSuccess> {
    console.log('🚀 Service createJobApplication - Démarrage processus 2 étapes')
    console.log('1. Données candidature:', {
      job_offer_id: data.job_offer_id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name
    })
    console.log('2. Fichiers à uploader:', files ? Object.keys(files) : [])
    
    let attachmentUrls: JobAttachmentInput2[] = []
    
    // Étape 1: Upload des fichiers individuellement si fournis
    if (files && Object.keys(files).length > 0) {
      console.log(`📤 Étape 1: Upload de ${Object.keys(files).length} fichiers...`)
      
      for (const [docType, file] of Object.entries(files)) {
        try {
          console.log(`⬆️ Upload ${docType}: ${file.name}`)
          const uploadResult = await this.uploadJobAttachment(file, docType)
          
          attachmentUrls.push({
            name: docType,
            url: uploadResult.data.file_path
          })
          
          console.log(`✅ Upload réussi ${docType}: ${uploadResult.data.file_path}`)
        } catch (error) {
          console.error(`❌ Échec upload ${docType}:`, error)
          throw new Error(`Échec upload du fichier ${docType}: ${error}`)
        }
      }
      
      console.log(`✅ Étape 1 terminée: ${attachmentUrls.length} fichiers uploadés`)
    }
    
    // Étape 2: Création de l'application avec les URLs
    console.log('📋 Étape 2: Création candidature avec URLs')
    
    const applicationData: JobApplicationCreateInput = {
      ...data,
      attachments: attachmentUrls.length > 0 ? attachmentUrls : data.attachments
    }
    
    console.log('Données finales à envoyer:', {
      ...applicationData,
      attachments: applicationData.attachments?.map(att => ({
        name: att.name,
        url: att.url
      }))
    })
    
    // Envoi en JSON, pas FormData !
    return apiService.postNoConfirm(API_ENDPOINTS.JOB_OFFERS.APPLICATIONS.CREATE, applicationData)
  }

  // Méthode directe pour créer une application avec URLs déjà uploadées
  async createJobApplicationWithUrls(data: JobApplicationCreateInput): Promise<PaymentJobApplicationOutSuccess> {
    console.log('🚀 Service createJobApplicationWithUrls - Envoi direct:')
    console.log('📄 Données complètes:', JSON.stringify(data, null, 2))
    console.log('🎯 Endpoint:', API_ENDPOINTS.JOB_OFFERS.APPLICATIONS.CREATE)
    
    // Vérification des champs obligatoires
    const required = ['job_offer_id', 'email', 'phone_number', 'first_name', 'last_name']
    const missing = required.filter(field => !data[field])
    if (missing.length > 0) {
      console.error('❌ Champs obligatoires manquants:', missing)
      throw new Error(`Champs obligatoires manquants: ${missing.join(', ')}`)
    }
    
    // Vérification des attachments
    if (!data.attachments || data.attachments.length === 0) {
      console.warn('⚠️ Aucun attachment - le backend pourrait rejeter')
    } else {
      console.log(`📎 ${data.attachments.length} attachments prêts:`, data.attachments)
    }
    
    try {
      // Envoi direct en JSON avec les URLs des attachments
      const response = await apiService.postNoConfirm(API_ENDPOINTS.JOB_OFFERS.APPLICATIONS.CREATE, data)
      console.log('✅ Réponse réussie:', response)
      return response
    } catch (error: any) {
      console.error('❌ Échec de l\'envoi:')
      console.error('Status:', error.response?.status)
      console.error('Data:', error.response?.data)
      console.error('Message:', error.message)
      
      // Afficher plus de détails sur l'erreur 400
      if (error.response?.status === 400) {
        console.error('🔴 Détails erreur 400:')
        console.error('Backend response:', JSON.stringify(error.response.data, null, 2))
      }
      
      throw error
    }
  }


  async updateJobApplicationStatus(data: UpdateJobOfferStatusInput): Promise<JobApplicationOutSuccess> {
    return apiService.postNoConfirm(API_ENDPOINTS.JOB_OFFERS.APPLICATIONS.CHANGE_STATUS, data)
  }

  async requestApplicationOTP(data: JobApplicationOTPRequestInput): Promise<BaseOutSuccess> {
    return apiService.postNoConfirm(API_ENDPOINTS.JOB_OFFERS.APPLICATIONS.REQUEST_OTP, data)
  }

  async updateApplicationByCandidate(data: JobApplicationUpdateByCandidateInput): Promise<JobApplicationOutSuccess> {
    const formData = new FormData()
    
    formData.append('application_number', data.application_number)
    formData.append('otp_code', data.otp_code)
    
    if (data.phone_number) formData.append('phone_number', data.phone_number)
    if (data.first_name) formData.append('first_name', data.first_name)
    if (data.last_name) formData.append('last_name', data.last_name)
    if (data.civility) formData.append('civility', data.civility)
    if (data.country_code) formData.append('country_code', data.country_code)
    if (data.date_of_birth) formData.append('date_of_birth', data.date_of_birth)
    
    if (data.attachments && data.attachments.length > 0) {
      data.attachments.forEach((attachment, index) => {
        formData.append(`attachments[${index}].name`, attachment.name)
        formData.append(`attachments[${index}].file`, attachment.file)
      })
    }

    return apiService.upload(API_ENDPOINTS.JOB_OFFERS.APPLICATIONS.UPDATE_BY_CANDIDATE, formData)
  }

  async getApplicationAttachments(applicationId: number): Promise<JobAttachmentListOutSuccess> {
    return apiService.get(API_ENDPOINTS.JOB_OFFERS.APPLICATIONS.ATTACHMENTS(applicationId))
  }

  // === STATISTICS ===

  async getDashboardStats(): Promise<JobDashboardStatsOutSuccess> {
    return apiService.get(API_ENDPOINTS.JOB_OFFERS.STATS.DASHBOARD)
  }

  async getOffersStats(): Promise<JobOfferStatsOutSuccess> {
    return apiService.get(API_ENDPOINTS.JOB_OFFERS.STATS.OFFERS)
  }

  async getApplicationsStats(): Promise<JobApplicationStatsOutSuccess> {
    return apiService.get(API_ENDPOINTS.JOB_OFFERS.STATS.APPLICATIONS)
  }

  async getContractTypesStats(): Promise<BaseOutSuccess> {
    return apiService.get(API_ENDPOINTS.JOB_OFFERS.STATS.CONTRACT_TYPES)
  }

  async getLocationsStats(): Promise<BaseOutSuccess> {
    return apiService.get(API_ENDPOINTS.JOB_OFFERS.STATS.LOCATIONS)
  }

  async getSalaryStats(): Promise<BaseOutSuccess> {
    return apiService.get(API_ENDPOINTS.JOB_OFFERS.STATS.SALARY)
  }

  async getMonthlyStats(year?: number): Promise<BaseOutSuccess> {
    const params = year ? { year } : {}
    return apiService.get(API_ENDPOINTS.JOB_OFFERS.STATS.MONTHLY, params)
  }

  async getTopOffersStats(limit?: number): Promise<BaseOutSuccess> {
    const params = limit ? { limit } : {}
    return apiService.get(API_ENDPOINTS.JOB_OFFERS.STATS.TOP_OFFERS, params)
  }

  async getJobInsights(): Promise<BaseOutSuccess> {
    return apiService.get(API_ENDPOINTS.JOB_OFFERS.STATS.INSIGHTS)
  }

  async getApplicationsEvolution(period?: 'daily' | 'weekly' | 'monthly'): Promise<BaseOutSuccess> {
    const params = period ? { period } : {}
    return apiService.get(API_ENDPOINTS.JOB_OFFERS.STATS.EVOLUTION, params)
  }

  // === STATS & UTILITIES ===

  async getUserStats(): Promise<BaseOutSuccess> {
    return apiService.getUserStats()
  }

  async getUsersByIds(userIds: string[]): Promise<any> {
    return apiService.post('/users/internal', { user_ids: userIds })
  }

  async getUserById(userId: string): Promise<any> {
    return apiService.get(`/users/${userId}`)
  }

  async updateUser(userId: string, userData: any): Promise<any> {
    return apiService.put(`/users/${userId}`, userData)
  }

  async setupUsers(): Promise<BaseOutSuccess> {
    return apiService.setupUsers()
  }

  async testRedisGet(testNumber: number): Promise<any> {
    return apiService.testRedisGet(testNumber)
  }

  async testRedisSet(testNumber: number): Promise<any> {
    return apiService.testRedisSet(testNumber)
  }

  async testEmail(email: string): Promise<any> {
    return apiService.testEmail(email)
  }
}

export const jobOffersService = new JobOffersService()