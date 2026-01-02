import { apiService } from './base'

// ===== INTERFACES STUDENT APPLICATIONS =====

export interface StudentApplicationCreateInput {
  email: string
  target_session_id: string
  first_name?: string
  last_name?: string
  phone_number?: string
  country_code?: string
  attachments?: string[]
}

export interface ChangeStudentApplicationStatusInput {
  status: string
  reason: string
}

export interface StudentAttachmentInput {
  name: string
  file: File
}

export interface PayTrainingFeeInstallmentInput {
  training_session_id: string
  amount: number
}

export interface StudentApplicationOut {
  id: number
  user_id: string
  training_id: string
  target_session_id: string
  application_number: string
  status: string
  payment_id?: string
  refusal_reason?: string
  registration_fee?: number
  training_fee?: number
  currency: string
  training_title: string
  training_session_start_date: string
  training_session_end_date: string
  user_email: string
  user_first_name: string
  user_last_name: string
  phone_number?: string
  created_at: string
  updated_at: string
}

export interface StudentApplicationFullOut {
  id: number
  user_id: string
  training_id: string
  target_session_id: string
  application_number: string
  status: string
  refusal_reason?: string
  registration_fee?: number
  training_fee?: number
  currency: string
  created_at: string
  updated_at: string
  payment_id?: string
  first_name?: string
  last_name?: string
  email?: string
  phone_number?: string
  user_email?: string
  user_first_name?: string
  user_last_name?: string
  training?: any
  training_session?: any
}

export interface StudentApplicationOutSuccess {
  success: boolean
  message: string
  data: StudentApplicationFullOut
}

export interface StudentApplicationsPageOutSuccess {
  data: StudentApplicationOut[]
  page: number
  number: number
  total_number: number
}

export interface StudentAttachmentOut {
  id: number
  application_id: number
  document_type: string
  file_path: string
  created_at: string
  updated_at: string
}

export interface StudentAttachmentListOutSuccess {
  success: boolean
  message: string
  data: StudentAttachmentOut[]
}

export interface StudentAttachmentOutSuccess {
  success: boolean
  message: string
  data: StudentAttachmentOut
}

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

// ===== SERVICE STUDENT APPLICATIONS =====

class StudentApplicationsService {
  // === ADMIN STUDENT APPLICATIONS ===

  /**
   * Récupérer la liste des candidatures étudiantes (admin) avec filtres
   */
  async getStudentApplications(filters: {
    page?: number
    page_size?: number
    search?: string
    training_id?: string
    training_session_id?: string
    is_paid?: boolean
    status?: string
    order_by?: 'created_at'
    asc?: 'asc' | 'desc'
  } = {}): Promise<StudentApplicationsPageOutSuccess> {
    const response = await apiService.get('/student-applications', { params: filters })
    return response as StudentApplicationsPageOutSuccess
  }

  /**
   * Créer une nouvelle candidature étudiante
   */
  async createStudentApplication(data: StudentApplicationCreateInput): Promise<StudentApplicationOutSuccess> {
    const response = await apiService.post('/student-applications', data)
    return response as StudentApplicationOutSuccess
  }

  /**
   * Récupérer une candidature étudiante par ID (admin)
   */
  async getStudentApplicationById(applicationId: number): Promise<StudentApplicationOutSuccess> {
    const response = await apiService.get(`/student-applications/${applicationId}`)
    return response as StudentApplicationOutSuccess
  }

  /**
   * Changer le statut d'une candidature étudiante (admin)
   */
  async changeStudentApplicationStatus(applicationId: number, data: ChangeStudentApplicationStatusInput): Promise<StudentApplicationOutSuccess> {
    const response = await apiService.post(`/student-applications/${applicationId}/status`, data)
    return response as StudentApplicationOutSuccess
  }

  /**
   * Récupérer les attachements d'une candidature étudiante (admin)
   */
  async getStudentApplicationAttachments(applicationId: number): Promise<StudentAttachmentListOutSuccess> {
    const response = await apiService.get(`/student-applications/${applicationId}/attachments`)
    return response as StudentAttachmentListOutSuccess
  }

  // === MY STUDENT APPLICATIONS ===

  /**
   * Récupérer mes candidatures étudiantes avec filtres
   */
  async getMyStudentApplications(filters: {
    page?: number
    page_size?: number
    search?: string
    training_id?: string
    training_session_id?: string
    is_paid?: boolean
    status?: string
    order_by?: 'created_at'
    asc?: 'asc' | 'desc'
  } = {}): Promise<StudentApplicationsPageOutSuccess> {
    const response = await apiService.get('/my-student-applications', { params: filters })
    return response as StudentApplicationsPageOutSuccess
  }

  /**
   * Récupérer ma candidature étudiante par ID
   */
  async getMyStudentApplicationById(applicationId: number): Promise<StudentApplicationOutSuccess> {
    const response = await apiService.get(`/my-student-applications/${applicationId}`)
    return response as StudentApplicationOutSuccess
  }

  /**
   * Mettre à jour ma candidature étudiante
   */
  async updateMyStudentApplication(applicationId: number, data: StudentApplicationCreateInput): Promise<StudentApplicationOutSuccess> {
    const response = await apiService.put(`/my-student-applications/${applicationId}`, data)
    return response as StudentApplicationOutSuccess
  }

  /**
   * Supprimer ma candidature étudiante
   */
  async deleteMyStudentApplication(applicationId: number): Promise<StudentApplicationOutSuccess> {
    const response = await apiService.delete(`/my-student-applications/${applicationId}`)
    return response as StudentApplicationOutSuccess
  }

  /**
   * Récupérer les attachements de ma candidature étudiante
   */
  async getMyStudentApplicationAttachments(applicationId: number): Promise<StudentAttachmentListOutSuccess> {
    const response = await apiService.get(`/my-student-applications/${applicationId}/attachments`)
    return response as StudentAttachmentListOutSuccess
  }

  /**
   * Créer un attachement pour ma candidature étudiante
   */
  async createStudentAttachment(applicationId: number, data: StudentAttachmentInput): Promise<StudentAttachmentOutSuccess> {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('file', data.file)

    const response = await apiService.post(`/my-student-applications/${applicationId}/attachments`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return response as StudentAttachmentOutSuccess
  }

  /**
   * Supprimer mon attachement étudiant
   */
  async deleteMyStudentAttachment(attachmentId: number): Promise<StudentAttachmentOutSuccess> {
    const response = await apiService.delete(`/my-student-attachments/${attachmentId}`)
    return response as StudentAttachmentOutSuccess
  }

  /**
   * Soumettre ma candidature étudiante
   */
  async submitStudentApplication(applicationId: number): Promise<InitPaymentOutSuccess> {
    const response = await apiService.post(`/my-student-applications/${applicationId}/submit`)
    return response as InitPaymentOutSuccess
  }

  /**
   * Payer les frais de formation
   */
  async payTrainingFee(data: PayTrainingFeeInstallmentInput): Promise<InitPaymentOutSuccess> {
    const response = await apiService.post('/my-student-applications/pay-training-fee', data)
    return response as InitPaymentOutSuccess
  }
}

export const studentApplicationsService = new StudentApplicationsService()
