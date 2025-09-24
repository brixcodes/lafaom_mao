// Service API pour les candidatures d'étudiants (My Student Application)

import { apiService } from './base'
import { API_ENDPOINTS } from '@/config/api'
import type {
  StudentApplicationCreateInput,
  StudentApplicationUpdateInput,
  StudentApplicationSubmitInput,
  StudentApplicationFilter,
  StudentAttachmentInput,
  ChangeStudentApplicationStatusInput,
  PayTrainingFeeInstallmentInput,
  StudentApplicationOutSuccess,
  StudentApplicationsPageOutSuccess,
  StudentAttachmentOutSuccess,
  StudentAttachmentListOutSuccess,
  TrainingFeePaymentSuccess,
  PaymentInitSuccess,
  StudentApplicationStatsSuccess,
  BulkUpdateStudentApplicationsInput,
  BulkDeleteStudentApplicationsInput,
  BulkOperationSuccess,
  StudentApplicationExportInput,
  StudentApplicationExportSuccess,
  StudentApplicationNotificationSuccess,
  StudentApplicationHistorySuccess,
  StudentApplicationValidationSuccess,
  StudentApplicationListResponse,
  StudentApplicationDetailResponse,
  StudentApplicationCreateResponse,
  StudentApplicationUpdateResponse,
  StudentApplicationDeleteResponse
} from '@/types/student-application'

export class StudentApplicationService {
  // ===== STUDENT APPLICATION CRUD =====
  
  /**
   * Créer une nouvelle candidature d'étudiant
   */
  async createStudentApplication(data: StudentApplicationCreateInput): Promise<StudentApplicationCreateResponse> {
    return apiService.post(API_ENDPOINTS.STUDENT_APPLICATIONS.CREATE, data)
  }

  /**
   * Récupérer une candidature par ID
   */
  async getStudentApplication(id: number): Promise<StudentApplicationDetailResponse> {
    return apiService.get(API_ENDPOINTS.STUDENT_APPLICATIONS.DETAIL(id))
  }


  /**
   * Mettre à jour une candidature
   */
  async updateStudentApplication(id: number, data: StudentApplicationUpdateInput): Promise<StudentApplicationUpdateResponse> {
    return apiService.put(API_ENDPOINTS.STUDENT_APPLICATIONS.UPDATE(id), data) as Promise<StudentApplicationUpdateResponse>
  }

  /**
   * Mettre à jour une candidature utilisateur
   */
  async updateMyStudentApplication(id: number, data: StudentApplicationCreateInput): Promise<StudentApplicationOutSuccess> {
    return apiService.put(API_ENDPOINTS.STUDENT_APPLICATIONS.MY_UPDATE(id), data) as Promise<StudentApplicationOutSuccess>
  }

  /**
   * Supprimer une candidature
   */
  async deleteStudentApplication(id: number): Promise<StudentApplicationDeleteResponse> {
    return apiService.delete(API_ENDPOINTS.STUDENT_APPLICATIONS.DELETE(id)) as Promise<StudentApplicationDeleteResponse>
  }

  /**
   * Supprimer une candidature utilisateur
   */
  async deleteMyStudentApplication(id: number): Promise<StudentApplicationOutSuccess> {
    return apiService.delete(API_ENDPOINTS.STUDENT_APPLICATIONS.MY_DELETE(id)) as Promise<StudentApplicationOutSuccess>
  }

  /**
   * Lister les candidatures avec filtres
   */
  async listStudentApplications(filters: StudentApplicationFilter): Promise<StudentApplicationsPageOutSuccess> {
    return apiService.get('/student-applications', { params: filters })
  }

  /**
   * Lister les candidatures de l'utilisateur connecté
   */
  async listMyStudentApplications(filters: Partial<StudentApplicationFilter> = {}): Promise<StudentApplicationsPageOutSuccess> {
    return apiService.get(API_ENDPOINTS.STUDENT_APPLICATIONS.MY_APPLICATIONS, { params: filters })
  }

  // ===== STUDENT APPLICATION ACTIONS =====

  /**
   * Soumettre une candidature
   */
  async submitStudentApplication(data: StudentApplicationSubmitInput): Promise<StudentApplicationOutSuccess> {
    return apiService.post('/student-applications/submit', data)
  }

  /**
   * Changer le statut d'une candidature (admin)
   */
  async changeStudentApplicationStatus(data: ChangeStudentApplicationStatusInput): Promise<StudentApplicationOutSuccess> {
    return apiService.put('/student-applications/change-status', data) as Promise<StudentApplicationOutSuccess>
  }

  /**
   * Payer les frais de formation
   */
  async payTrainingFee(data: PayTrainingFeeInstallmentInput): Promise<PaymentInitSuccess> {
    return apiService.post(API_ENDPOINTS.STUDENT_APPLICATIONS.PAY_TRAINING_FEE, data)
  }

  /**
   * Soumettre une candidature avec paiement
   */
  async submitApplicationWithPayment(applicationId: number): Promise<PaymentInitSuccess> {
    return apiService.post(`/my-student-applications/${applicationId}/submit`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
  }

  // ===== ATTACHMENTS MANAGEMENT =====

  /**
   * Lister les pièces jointes d'une candidature
   */
  async listStudentAttachments(applicationId: number): Promise<StudentAttachmentListOutSuccess> {
    return apiService.get(`/student-applications/${applicationId}/attachments`)
  }

  /**
   * Ajouter une pièce jointe à une candidature
   */
  async createStudentAttachment(applicationId: number, data: StudentAttachmentInput): Promise<StudentAttachmentOutSuccess> {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('file', data.file)
    
    return apiService.post(`/student-applications/${applicationId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  /**
   * Supprimer une pièce jointe
   */
  async deleteStudentAttachment(applicationId: number, attachmentId: number): Promise<{ message: string; success: boolean }> {
    return apiService.delete(`/student-applications/${applicationId}/attachments/${attachmentId}`) as Promise<{ message: string; success: boolean }>
  }

  // ===== STATISTICS =====

  /**
   * Récupérer les statistiques des candidatures
   */
  async getStudentApplicationStats(): Promise<StudentApplicationStatsSuccess> {
    return apiService.get('/student-applications/stats')
  }

  // ===== SEARCH AND FILTER =====

  /**
   * Rechercher des candidatures
   */
  async searchStudentApplications(query: string, filters: Partial<StudentApplicationFilter> = {}): Promise<StudentApplicationsPageOutSuccess> {
    return apiService.get('/student-applications/search', { 
      params: { 
        q: query, 
        ...filters 
      } 
    })
  }

  /**
   * Exporter les candidatures
   */
  async exportStudentApplications(data: StudentApplicationExportInput): Promise<StudentApplicationExportSuccess> {
    return apiService.post('/student-applications/export', data)
  }

  // ===== BULK OPERATIONS =====

  /**
   * Opérations en lot sur les candidatures
   */
  async bulkUpdateStudentApplications(data: BulkUpdateStudentApplicationsInput): Promise<BulkOperationSuccess> {
    return apiService.put('/student-applications/bulk-update', data) as Promise<BulkOperationSuccess>
  }

  /**
   * Supprimer plusieurs candidatures
   */
  async bulkDeleteStudentApplications(data: BulkDeleteStudentApplicationsInput): Promise<BulkOperationSuccess> {
    return apiService.delete('/student-applications/bulk-delete', { data }) as Promise<BulkOperationSuccess>
  }

  // ===== UTILITY METHODS =====

  /**
   * Vérifier si une candidature peut être modifiée
   */
  async canEditStudentApplication(applicationId: number): Promise<StudentApplicationValidationSuccess> {
    return apiService.get(`/student-applications/${applicationId}/can-edit`)
  }

  /**
   * Récupérer l'historique d'une candidature
   */
  async getStudentApplicationHistory(applicationId: number): Promise<StudentApplicationHistorySuccess> {
    return apiService.get(`/student-applications/${applicationId}/history`)
  }

  /**
   * Dupliquer une candidature
   */
  async duplicateStudentApplication(applicationId: number, newSessionId: string): Promise<StudentApplicationCreateResponse> {
    return apiService.post(`/student-applications/${applicationId}/duplicate`, {
      target_session_id: newSessionId
    })
  }

  /**
   * Récupérer les notifications de candidature
   */
  async getStudentApplicationNotifications(): Promise<StudentApplicationNotificationSuccess> {
    return apiService.get('/student-applications/notifications')
  }

  /**
   * Marquer une notification comme lue
   */
  async markNotificationAsRead(notificationId: string): Promise<{ message: string; success: boolean }> {
    return apiService.put(`/student-applications/notifications/${notificationId}/read`) as Promise<{ message: string; success: boolean }>
  }
}

// Instance du service
export const studentApplicationService = new StudentApplicationService()
