// Service API pour les candidatures (Job Applications)
import { apiService } from './base'
import { API_ENDPOINTS } from '@/config/api'
import type {
  JobApplicationCreateInput,
  JobApplicationUpdateByCandidateInput,
  JobApplicationOTPRequestInput,
  JobApplicationOutSuccess,
  JobApplicationsPageOutSuccess,
  JobApplicationFilter,
  UpdateJobApplicationStatusInput,
  JobAttachmentListOutSuccess,
  JobApplicationStatsOutSuccess,
} from '@/types/jobApplications'
import type { BaseOutSuccess } from '@/types'

export class JobApplicationsService {
  // === JOB APPLICATIONS ===

  /**
   * Récupérer la liste des candidatures avec filtres
   */
  async getJobApplications(filter?: JobApplicationFilter): Promise<JobApplicationsPageOutSuccess> {
    return apiService.get(API_ENDPOINTS.JOB_APPLICATIONS.LIST, filter)
  }

  /**
   * Récupérer une candidature par ID
   */
  async getJobApplicationById(id: number): Promise<JobApplicationOutSuccess> {
    return apiService.get(API_ENDPOINTS.JOB_APPLICATIONS.DETAIL(id))
  }

  /**
   * Créer une nouvelle candidature
   */
  async createJobApplication(data: JobApplicationCreateInput): Promise<JobApplicationOutSuccess> {
    const formData = new FormData()
    
    // Données obligatoires
    formData.append('job_offer_id', data.job_offer_id)
    formData.append('email', data.email)
    formData.append('phone_number', data.phone_number)
    formData.append('first_name', data.first_name)
    formData.append('last_name', data.last_name)
    
    // Données optionnelles
    if (data.civility) formData.append('civility', data.civility)
    if (data.country_code) formData.append('country_code', data.country_code)
    if (data.date_of_birth) formData.append('date_of_birth', data.date_of_birth)
    
    // Pièces jointes
    if (data.attachments && data.attachments.length > 0) {
      data.attachments.forEach((attachment, index) => {
        formData.append(`attachments[${index}].name`, attachment.name)
        formData.append(`attachments[${index}].file`, attachment.file)
      })
    }

    return apiService.upload(API_ENDPOINTS.JOB_APPLICATIONS.CREATE, formData, {
      successMessage: 'Candidature soumise avec succès',
      errorMessage: 'Erreur lors de la soumission de la candidature'
    })
  }

  /**
   * Mettre à jour le statut d'une candidature (admin)
   */
  async updateJobApplicationStatus(data: UpdateJobApplicationStatusInput): Promise<JobApplicationOutSuccess> {
    console.log('Tentative de changement de statut avec:', data)
    
    // Essayons plusieurs formats de données
    const formats = [
      // Format 1: tel que défini
      data,
      // Format 2: avec id au lieu de application_id
      {
        id: data.application_id,
        status: data.status,
        ...(data.reason && { reason: data.reason })
      },
      // Format 3: avec refusal_reason au lieu de reason
      {
        application_id: data.application_id,
        status: data.status,
        ...(data.reason && { refusal_reason: data.reason })
      },
      // Format 4: format plus simple
      {
        status: data.status,
        ...(data.reason && { refusal_reason: data.reason })
      }
    ]
    
    for (let i = 0; i < formats.length; i++) {
      try {
        console.log(`Essai format ${i + 1}:`, formats[i])
        return await apiService.postNoConfirm(API_ENDPOINTS.JOB_APPLICATIONS.CHANGE_STATUS, formats[i], {
          successMessage: 'Statut mis à jour avec succès',
          errorMessage: 'Erreur lors de la mise à jour du statut'
        })
      } catch (error) {
        console.warn(`Format ${i + 1} échoué:`, error.response?.data)
        if (i === formats.length - 1) {
          // Dernier essai avec PUT sur l'ID direct
          try {
            console.log('Tentative avec PUT direct sur /job-applications/:id')
            const updateData = {
              status: data.status,
              ...(data.reason && { refusal_reason: data.reason })
            }
            
            return await apiService.put(API_ENDPOINTS.JOB_APPLICATIONS.UPDATE(data.application_id), updateData, {
              successMessage: 'Statut mis à jour avec succès',
              errorMessage: 'Erreur lors de la mise à jour du statut'
            })
          } catch (putError) {
            console.error('PUT direct également échoué:', putError.response?.data)
            throw error // On relance l'erreur originale
          }
        }
      }
    }
  }

  /**
   * Demander un code OTP pour modifier une candidature
   */
  async requestApplicationOTP(data: JobApplicationOTPRequestInput): Promise<BaseOutSuccess> {
    return apiService.postNoConfirm(API_ENDPOINTS.JOB_APPLICATIONS.REQUEST_OTP, data, {
      successMessage: 'Code OTP envoyé avec succès',
      errorMessage: 'Erreur lors de l\'envoi du code OTP'
    })
  }

  /**
   * Mettre à jour une candidature avec OTP (candidat)
   */
  async updateApplicationByCandidate(data: JobApplicationUpdateByCandidateInput): Promise<JobApplicationOutSuccess> {
    const formData = new FormData()
    
    // Données obligatoires
    formData.append('application_number', data.application_number)
    formData.append('otp_code', data.otp_code)
    
    // Données optionnelles
    if (data.phone_number) formData.append('phone_number', data.phone_number)
    if (data.first_name) formData.append('first_name', data.first_name)
    if (data.last_name) formData.append('last_name', data.last_name)
    if (data.civility) formData.append('civility', data.civility)
    if (data.country_code) formData.append('country_code', data.country_code)
    if (data.date_of_birth) formData.append('date_of_birth', data.date_of_birth)
    
    // Pièces jointes
    if (data.attachments && data.attachments.length > 0) {
      data.attachments.forEach((attachment, index) => {
        formData.append(`attachments[${index}].name`, attachment.name)
        formData.append(`attachments[${index}].file`, attachment.file)
      })
    }

    return apiService.upload(API_ENDPOINTS.JOB_APPLICATIONS.UPDATE_BY_CANDIDATE, formData, {
      successMessage: 'Candidature mise à jour avec succès',
      errorMessage: 'Erreur lors de la mise à jour de la candidature'
    })
  }

  /**
   * Récupérer les pièces jointes d'une candidature
   */
  async getApplicationAttachments(applicationId: number): Promise<JobAttachmentListOutSuccess> {
    return apiService.get(API_ENDPOINTS.JOB_APPLICATIONS.ATTACHMENTS(applicationId))
  }

  /**
   * Supprimer une candidature (admin)
   */
  async deleteJobApplication(id: number): Promise<BaseOutSuccess> {
    return apiService.delete(API_ENDPOINTS.JOB_APPLICATIONS.DELETE(id), {
      successMessage: 'Candidature supprimée avec succès',
      errorMessage: 'Erreur lors de la suppression de la candidature'
    })
  }

  // === STATISTIQUES ===

  /**
   * Récupérer les statistiques des candidatures
   */
  async getApplicationsStats(): Promise<JobApplicationStatsOutSuccess> {
    return apiService.get(API_ENDPOINTS.JOB_APPLICATIONS.STATS.APPLICATIONS)
  }

  /**
   * Rechercher des candidatures par critères
   */
  async searchJobApplications(query: string, filters?: Partial<JobApplicationFilter>): Promise<JobApplicationsPageOutSuccess> {
    return await this.getJobApplications({
      search: query,
      ...filters,
      page: filters?.page || 1,
      page_size: filters?.page_size || 20
    })
  }

  /**
   * Télécharger une pièce jointe
   */
  async downloadAttachment(attachmentId: number, filename: string): Promise<void> {
    try {
      const response = await apiService.downloadFile(`/job-applications/attachments/${attachmentId}/download`)
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response]))
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      throw new Error('Erreur lors du téléchargement du fichier')
    }
  }
}

// Instance singleton
export const jobApplicationsService = new JobApplicationsService()