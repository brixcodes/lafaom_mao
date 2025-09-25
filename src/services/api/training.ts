import { apiService } from './base'

// Types pour les formations
export interface Training {
  id: number
  title: string
  description: string
  type: string
  status: string
  duration: number
  created_at: string
  updated_at: string
}

export interface TrainingSession {
  id: number
  training_id: number
  start_date: string
  end_date: string
  status: string
  max_participants: number
  current_participants: number
  created_at: string
}

export interface StudentApplication {
  id: number
  application_number: string
  training_id: number
  user_id: number
  status: string
  created_at: string
  updated_at: string
  attachments?: StudentAttachment[]
}

export interface StudentAttachment {
  id: number
  application_id: number
  file_name: string
  file_path: string
  file_type: string
  created_at: string
}

export interface Specialty {
  id: number
  name: string
  description: string
  is_active: boolean
  created_at: string
}

export interface Reclamation {
  id: number
  user_id: number
  application_id?: number
  type_id: number
  subject: string
  description: string
  status: string
  priority: string
  created_at: string
  updated_at: string
}

export interface ReclamationType {
  id: number
  name: string
  description: string
  is_active: boolean
  created_at: string
}

export interface TrainingFilter {
  page?: number
  limit?: number
  search?: string
  type?: string
  status?: string
}

export interface StudentApplicationFilter {
  page?: number
  limit?: number
  search?: string
  status?: string
  training_id?: number
}

export interface CreateTrainingRequest {
  title: string
  description: string
  type: string
  duration: number
}

export interface CreateTrainingSessionRequest {
  training_id: number
  start_date: string
  end_date: string
  max_participants: number
}

export interface CreateStudentApplicationRequest {
  training_id: number
  attachments?: File[]
}

export interface CreateReclamationRequest {
  application_id?: number
  type_id: number
  subject: string
  description: string
  priority: string
}

class TrainingService {
  // === FORMATIONS ===
  async getTrainings(filters: TrainingFilter = {}): Promise<any> {
    return await apiService.get('/trainings', { params: filters })
  }

  async getTrainingById(trainingId: number): Promise<Training> {
    return await apiService.get(`/trainings/${trainingId}`)
  }

  async createTraining(trainingData: CreateTrainingRequest): Promise<Training> {
    return await apiService.post('/trainings', trainingData)
  }

  async updateTraining(trainingId: number, trainingData: Partial<CreateTrainingRequest>): Promise<Training> {
    return await apiService.put(`/trainings/${trainingId}`, trainingData) as Training
  }

  async deleteTraining(trainingId: number): Promise<void> {
    return await apiService.delete(`/trainings/${trainingId}`)
  }

  // === SESSIONS DE FORMATION ===
  async getTrainingSessions(filters: any = {}): Promise<any> {
    return await apiService.get('/training-sessions', { params: filters })
  }

  async getTrainingSessionById(sessionId: number): Promise<TrainingSession> {
    return await apiService.get(`/training-sessions/${sessionId}`)
  }

  async createTrainingSession(sessionData: CreateTrainingSessionRequest): Promise<TrainingSession> {
    return await apiService.post('/training-sessions', sessionData)
  }

  async updateTrainingSession(sessionId: number, sessionData: Partial<CreateTrainingSessionRequest>): Promise<TrainingSession> {
    return await apiService.put(`/training-sessions/${sessionId}`, sessionData) as TrainingSession
  }

  async deleteTrainingSession(sessionId: number): Promise<void> {
    return await apiService.delete(`/training-sessions/${sessionId}`)
  }

  async getSessionMembers(sessionId: number): Promise<any[]> {
    return await apiService.get(`/training-sessions/${sessionId}/members`)
  }

  // === CANDIDATURES ÉTUDIANTES ===
  async getStudentApplications(filters: StudentApplicationFilter = {}): Promise<any> {
    return await apiService.get('/student-applications', { params: filters })
  }

  async getStudentApplicationById(applicationId: number): Promise<StudentApplication> {
    return await apiService.get(`/student-applications/${applicationId}`)
  }

  async changeApplicationStatus(applicationId: number, status: string): Promise<StudentApplication> {
    return await apiService.post(`/student-applications/${applicationId}/status`, { status })
  }

  async getApplicationAttachments(applicationId: number): Promise<StudentAttachment[]> {
    return await apiService.get(`/student-applications/${applicationId}/attachments`)
  }

  // === MES CANDIDATURES ===
  async createStudentApplication(applicationData: CreateStudentApplicationRequest): Promise<StudentApplication> {
    return await apiService.post('/student-applications', applicationData)
  }

  async getMyStudentApplications(filters: StudentApplicationFilter = {}): Promise<any> {
    return await apiService.get('/my-student-applications', { params: filters })
  }

  async getMyStudentApplicationById(applicationId: number): Promise<StudentApplication> {
    return await apiService.get(`/my-student-applications/${applicationId}`)
  }

  async updateMyStudentApplication(applicationId: number, applicationData: Partial<CreateStudentApplicationRequest>): Promise<StudentApplication> {
    return await apiService.put(`/my-student-applications/${applicationId}`, applicationData) as StudentApplication
  }

  async deleteMyStudentApplication(applicationId: number): Promise<void> {
    return await apiService.delete(`/my-student-applications/${applicationId}`)
  }

  async getMyApplicationAttachments(applicationId: number): Promise<StudentAttachment[]> {
    return await apiService.get(`/my-student-applications/${applicationId}/attachments`)
  }

  async addApplicationAttachment(applicationId: number, file: File): Promise<StudentAttachment> {
    const formData = new FormData()
    formData.append('file', file)
    return await apiService.post(`/my-student-applications/${applicationId}/attachments`, formData)
  }

  async deleteApplicationAttachment(attachmentId: number): Promise<void> {
    return await apiService.delete(`/my-student-attachments/${attachmentId}`)
  }

  async submitStudentApplication(applicationId: number): Promise<any> {
    return await apiService.post(`/my-student-applications/${applicationId}/submit`)
  }

  async payTrainingFee(paymentData: any): Promise<any> {
    return await apiService.post('/my-student-applications/pay-training-fee', paymentData)
  }

  // === SPÉCIALITÉS ===
  async getSpecialties(filters: any = {}): Promise<any> {
    return await apiService.get('/specialties', { params: filters })
  }

  async getSpecialtyById(specialtyId: number): Promise<Specialty> {
    return await apiService.get(`/specialties/${specialtyId}`)
  }

  async createSpecialty(specialtyData: Partial<Specialty>): Promise<Specialty> {
    return await apiService.post('/specialties', specialtyData)
  }

  async updateSpecialty(specialtyId: number, specialtyData: Partial<Specialty>): Promise<Specialty> {
    return await apiService.put(`/specialties/${specialtyId}`, specialtyData) as Specialty
  }

  async deleteSpecialty(specialtyId: number): Promise<void> {
    return await apiService.delete(`/specialties/${specialtyId}`)
  }

  async getActiveSpecialties(): Promise<Specialty[]> {
    return await apiService.get('/specialties/active/all')
  }

  // === RÉCLAMATIONS ===
  async createReclamation(reclamationData: CreateReclamationRequest): Promise<Reclamation> {
    return await apiService.post('/my-reclamations', reclamationData)
  }

  async getMyReclamations(filters: any = {}): Promise<any> {
    return await apiService.get('/my-reclamations', { params: filters })
  }

  async getMyReclamationById(reclamationId: number): Promise<Reclamation> {
    return await apiService.get(`/my-reclamations/${reclamationId}`)
  }

  async updateMyReclamation(reclamationId: number, reclamationData: Partial<CreateReclamationRequest>): Promise<Reclamation> {
    return await apiService.put(`/my-reclamations/${reclamationId}`, reclamationData) as Reclamation
  }

  async deleteMyReclamation(reclamationId: number): Promise<void> {
    return await apiService.delete(`/my-reclamations/${reclamationId}`)
  }

  // === ADMIN RÉCLAMATIONS ===
  async getAllReclamations(filters: any = {}): Promise<any> {
    return await apiService.get('/reclamations', { params: filters })
  }

  async getReclamationById(reclamationId: number): Promise<Reclamation> {
    return await apiService.get(`/reclamations/${reclamationId}`)
  }

  async updateReclamationStatus(reclamationId: number, status: string): Promise<Reclamation> {
    return await apiService.put(`/reclamations/${reclamationId}/status`, { status }) as Reclamation
  }

  // === TYPES DE RÉCLAMATIONS ===
  async getActiveReclamationTypes(): Promise<ReclamationType[]> {
    return await apiService.get('/reclamation-types/active/all')
  }

  async createReclamationType(typeData: Partial<ReclamationType>): Promise<ReclamationType> {
    return await apiService.post('/reclamation-types', typeData)
  }

  async getReclamationTypeById(typeId: number): Promise<ReclamationType> {
    return await apiService.get(`/reclamation-types/${typeId}`)
  }

  async updateReclamationType(typeId: number, typeData: Partial<ReclamationType>): Promise<ReclamationType> {
    return await apiService.put(`/reclamation-types/${typeId}`, typeData) as ReclamationType
  }

  async deleteReclamationType(typeId: number): Promise<void> {
    return await apiService.delete(`/reclamation-types/${typeId}`)
  }
}

export const trainingService = new TrainingService()
