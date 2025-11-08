// Service pour la gestion des offres d'emploi
import type {
  InitPaymentOutSuccess,
  JobApplicationCreateInput,
  JobApplicationOTPRequestInput,
  JobApplicationOutSuccess,
  JobApplicationsPageOutSuccess,
  JobApplicationUpdateByCandidateInput,
  JobAttachmentInput,
  JobAttachmentListOutSuccess,
  JobAttachmentOutSuccess,
  JobOfferCreateInput,
  JobOfferOutSuccess,
  JobOffersPageOutSuccess,
  JobOfferUpdateInput,
  UpdateJobOfferStatusInput
} from '@/types/job-offers'
import { apiService } from './base'

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
  async createJobApplication(applicationData: JobApplicationCreateInput): Promise<InitPaymentOutSuccess> {
    const response = await apiService.post('/job-applications', applicationData)
    return response as InitPaymentOutSuccess
  }

  /**
   * Uploader un fichier joint pour une candidature
   */
  async uploadJobAttachment(file: File, docType: string): Promise<any> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', docType)
    
    // Utiliser la méthode spécialisée pour FormData
    const response = await apiService.upload('/job-attachments', formData)
    return response as { data: { file_path: string } }
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

  /**
   * Supprimer une candidature
   */
  async deleteJobApplication(applicationId: number): Promise<void> {
    console.log('🗑️ Appel API DELETE pour supprimer la candidature:', applicationId)
    await apiService.delete(`/job-applications/${applicationId}`)
    console.log('✅ API DELETE réussie pour la candidature:', applicationId)
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
   * Télécharger un fichier joint
   */
  async downloadAttachment(attachmentId: number, filename: string, filePath?: string): Promise<void> {
    try {
      let downloadUrl: string
      
      // Si file_path est fourni et est une URL complète, l'utiliser directement
      if (filePath && (filePath.startsWith('http://') || filePath.startsWith('https://'))) {
        downloadUrl = filePath
      } else {
        // Utiliser l'endpoint de téléchargement de l'API
        // L'API retourne un JSON avec download_url, pas un blob directement
        const apiResponse = await apiService.get(`/job-attachments/${attachmentId}/download`)
        
        console.log('Réponse API download (raw):', apiResponse)
        console.log('Type de réponse:', typeof apiResponse)
        
        // La réponse peut être directement l'objet ou dans une propriété data
        let responseData = apiResponse
        if (apiResponse && typeof apiResponse === 'object' && 'data' in apiResponse) {
          responseData = (apiResponse as any).data
        }
        
        // Vérifier si la réponse contient download_url
        if (responseData && typeof responseData === 'object' && 'download_url' in responseData) {
          downloadUrl = (responseData as { download_url: string }).download_url
          console.log('✅ URL de téléchargement extraite:', downloadUrl)
        } else if (responseData && typeof responseData === 'string' && responseData.startsWith('http')) {
          // Si c'est directement une URL string
          downloadUrl = responseData
          console.log('✅ URL directe trouvée:', downloadUrl)
        } else if (filePath && filePath.startsWith('/')) {
          // Fallback: utiliser file_path si disponible
          const baseURL = import.meta.env.VITE_API_URL || 'https://api.lafaom-mao.org/api/v1'
          downloadUrl = `${baseURL}${filePath}`
          console.log('✅ Utilisation de file_path:', downloadUrl)
        } else {
          console.error('❌ Structure de réponse inattendue:', responseData)
          throw new Error('Impossible de trouver l\'URL de téléchargement dans la réponse API')
        }
      }
      
      // Vérifier que downloadUrl est défini
      if (!downloadUrl || typeof downloadUrl !== 'string') {
        throw new Error('URL de téléchargement invalide')
      }
      
      console.log('Téléchargement depuis:', downloadUrl)
      console.log('Type de downloadUrl:', typeof downloadUrl)
      
      // Pour les URLs S3 publiques, utiliser window.open pour contourner CORS
      const isPublicUrl = downloadUrl.includes('s3.') || 
                          downloadUrl.includes('amazonaws.com') ||
                          downloadUrl.includes('s3.amazonaws.com')
      
      console.log('isPublicUrl:', isPublicUrl, 'pour URL:', downloadUrl)
      console.log('Vérifications:', {
        'contient s3.': downloadUrl.includes('s3.'),
        'contient amazonaws.com': downloadUrl.includes('amazonaws.com'),
        'contient s3.amazonaws.com': downloadUrl.includes('s3.amazonaws.com')
      })
      
      if (isPublicUrl) {
        // Pour les URLs publiques S3, télécharger via fetch avec mode 'no-cors' ou utiliser un proxy
        // Si CORS bloque, on essaie d'abord avec fetch, sinon on utilise un lien direct
        console.log('✅ Téléchargement depuis URL publique S3:', downloadUrl)
        
        try {
          // Essayer de télécharger via fetch (peut échouer à cause de CORS)
          const response = await fetch(downloadUrl, { 
            mode: 'cors',
            cache: 'no-cache'
          })
          
          if (response.ok) {
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = filename || `attachment-${attachmentId}`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            console.log('✅ Fichier téléchargé avec succès')
            return
          }
        } catch (fetchError) {
          console.warn('⚠️ Fetch échoué à cause de CORS, utilisation d\'un lien direct:', fetchError)
          // Si fetch échoue à cause de CORS, utiliser un lien direct
          // Le navigateur téléchargera le fichier si les headers Content-Disposition sont corrects
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = filename || `attachment-${attachmentId}`
          link.target = '_blank'
          link.style.display = 'none'
          document.body.appendChild(link)
          link.click()
          setTimeout(() => {
            if (link.parentNode) {
              document.body.removeChild(link)
            }
          }, 100)
          return
        }
      }
      
      console.log('⚠️ URL non-S3 détectée, utilisation de fetch')
      
      // Pour les URLs privées, télécharger via fetch
      const fetchOptions: RequestInit = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
        }
      }
      
      console.log('Appel fetch vers:', downloadUrl)
      const response = await fetch(downloadUrl, fetchOptions)
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }
      
      const blob = await response.blob()
      console.log('Blob téléchargé, type:', blob.type, 'taille:', blob.size)
      
      // Vérifier que ce n'est pas du JSON
      if (blob.type === 'application/json' || blob.size < 100) {
        const text = await blob.text()
        console.warn('⚠️ Réponse JSON détectée au lieu du fichier:', text)
        // Essayer de parser le JSON et extraire l'URL
        try {
          const jsonData = JSON.parse(text)
          if (jsonData.download_url) {
            // Récursion: télécharger depuis la vraie URL
            return await this.downloadAttachment(attachmentId, filename, jsonData.download_url)
          }
        } catch (e) {
          // Ignorer l'erreur de parsing
        }
        throw new Error('Le serveur a retourné du JSON au lieu du fichier')
      }
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename || `attachment-${attachmentId}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      console.log('✅ Téléchargement terminé:', filename)
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error)
      throw error
    }
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
