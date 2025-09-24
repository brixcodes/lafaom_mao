import { apiService } from './base'
import type {
  StudentApplication,
  StudentApplicationCreateInput,
  StudentApplicationUpdateInput,
  ChangeStudentApplicationStatusInput,
  StudentApplicationFilter,
  StudentApplicationOutSuccess,
  StudentApplicationListOutSuccess,
  StudentApplicationPageOutSuccess,
} from '@/types/studentApplications'

export class StudentApplicationService {
  // ===========================================
  // STUDENT APPLICATION CRUD
  // ===========================================

  async getStudentApplications(filters: StudentApplicationFilter): Promise<StudentApplicationPageOutSuccess> {
    return apiService.get('/student-applications', { params: filters })
  }

  async getStudentApplication(applicationId: number): Promise<StudentApplicationOutSuccess> {
    return apiService.get(`/student-applications/${applicationId}`)
  }

  async createStudentApplication(data: StudentApplicationCreateInput): Promise<StudentApplicationOutSuccess> {
    return apiService.post('/student-applications', data) as Promise<StudentApplicationOutSuccess>
  }

  async updateStudentApplication(applicationId: number, data: StudentApplicationUpdateInput): Promise<StudentApplicationOutSuccess> {
    return apiService.put(`/student-applications/${applicationId}`, data) as Promise<StudentApplicationOutSuccess>
  }

  async deleteStudentApplication(applicationId: number): Promise<StudentApplicationOutSuccess> {
    return apiService.delete(`/student-applications/${applicationId}`) as Promise<StudentApplicationOutSuccess>
  }

  // ===========================================
  // ADMIN OPERATIONS
  // ===========================================

  async getAllStudentApplicationsAdmin(filters: StudentApplicationFilter): Promise<StudentApplicationPageOutSuccess> {
    return apiService.get('/student-applications/admin', { params: filters })
  }

  async changeStudentApplicationStatus(applicationId: number, data: ChangeStudentApplicationStatusInput): Promise<StudentApplicationOutSuccess> {
    return apiService.put(`/student-applications/${applicationId}/status`, data)
  }

  // ===========================================
  // USER OPERATIONS
  // ===========================================

  async getMyStudentApplications(filters: StudentApplicationFilter): Promise<StudentApplicationPageOutSuccess> {
    return apiService.get('/my-student-applications', { params: filters })
  }

  async getMyStudentApplication(applicationId: number): Promise<StudentApplicationOutSuccess> {
    return apiService.get(`/my-student-applications/${applicationId}`)
  }

  async deleteMyStudentApplication(applicationId: number): Promise<StudentApplicationOutSuccess> {
    return apiService.delete(`/my-student-applications/${applicationId}`)
  }

  async submitStudentApplication(applicationId: number): Promise<any> {
    return apiService.post(`/my-student-applications/${applicationId}/submit`)
  }

  async payTrainingFee(data: any): Promise<any> {
    return apiService.post('/my-student-applications/pay-training-fee', data)
  }

  // ===========================================
  // ATTACHMENTS
  // ===========================================

  async getStudentApplicationAttachments(applicationId: number): Promise<any> {
    return apiService.get(`/my-student-applications/${applicationId}/attachments`)
  }

  async createStudentAttachment(applicationId: number, data: any): Promise<any> {
    return apiService.post(`/my-student-applications/${applicationId}/attachments`, data)
  }

  async deleteStudentAttachment(attachmentId: number): Promise<any> {
    return apiService.delete(`/my-student-attachments/${attachmentId}`)
  }
}

export const studentApplicationService = new StudentApplicationService()
