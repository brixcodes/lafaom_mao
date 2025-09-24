// Service API pour les formations
import { apiService } from './base'
import type {
  TrainingCreateInput,
  TrainingUpdateInput,
  TrainingSessionCreateInput,
  TrainingSessionUpdateInput,
  StudentApplicationCreateInput,
  StudentApplicationUpdateInput,
  TrainingFilter,
  SessionFilter,
  ApplicationFilter,
  TrainingOutSuccess,
  TrainingListOutSuccess,
  TrainingSessionOutSuccess,
  TrainingSessionListOutSuccess,
  StudentApplicationOutSuccess,
  StudentApplicationListOutSuccess,
} from '@/types/training'
import type {
  SpecialtyCreateInput,
  SpecialtyUpdateInput,
  SpecialtyOutSuccess,
  SpecialtyListOutSuccess,
} from '@/types/specialty'

export class TrainingService {
  // Training CRUD
  async createTraining(data: TrainingCreateInput): Promise<TrainingOutSuccess> {
    return apiService.post('/trainings', data)
  }

  async updateTraining(id: string, data: TrainingUpdateInput): Promise<TrainingOutSuccess> {
    return apiService.put(`/trainings/${id}`, data) as Promise<TrainingOutSuccess>
  }

  async getTraining(id: string): Promise<TrainingOutSuccess> {
    return apiService.get(`/trainings/${id}`)
  }

  async listTrainings(filters: TrainingFilter): Promise<TrainingListOutSuccess> {
    return apiService.get('/trainings', { params: filters })
  }

  async deleteTraining(id: string): Promise<TrainingOutSuccess> {
    return apiService.delete(`/trainings/${id}`) as Promise<TrainingOutSuccess>
  }

  // Training Session CRUD
  async createTrainingSession(data: TrainingSessionCreateInput): Promise<TrainingSessionOutSuccess> {
    return apiService.post('/training-sessions', data)
  }

  async updateTrainingSession(id: string, data: TrainingSessionUpdateInput): Promise<TrainingSessionOutSuccess> {
  return apiService.put(`/training-sessions/${id}`, data) as Promise<TrainingSessionOutSuccess>
  }

  async getTrainingSession(id: string): Promise<TrainingSessionOutSuccess> {
    return apiService.get(`/training-sessions/${id}`)
  }

  async listTrainingSessions(filters: SessionFilter): Promise<TrainingSessionListOutSuccess> {
    return apiService.get('/training-sessions', { params: filters })
  }

  async deleteTrainingSession(id: string): Promise<TrainingSessionOutSuccess> {
    return apiService.delete(`/training-sessions/${id}`) as Promise<TrainingSessionOutSuccess>
  }

  // Training Registration
  async registerToTraining(data: any): Promise<any> {
    return apiService.post('/student-applications', data)
  }

  async registerToSession(data: any): Promise<any> {
    console.log('Appel API registerToSession avec endpoint /student-applications')
    return apiService.post('/student-applications', data)
  }

  async getTrainingRegistrations(filters: any): Promise<any> {
    return apiService.get('/training-registrations', { params: filters })
  }

  async getSessionRegistrations(filters: any): Promise<any> {
    return apiService.get('/student-applications', { params: filters })
  }

  async getTrainingSessionMembers(sessionId: string): Promise<any> {
    return apiService.get(`/training-sessions/${sessionId}/members`)
  }

  // Student Application CRUD
  async createStudentApplication(data: StudentApplicationCreateInput): Promise<StudentApplicationOutSuccess> {
    return apiService.post('/student-applications', data)
  }

  async updateStudentApplication(id: number, data: StudentApplicationUpdateInput): Promise<StudentApplicationOutSuccess> {
  return apiService.put(`/student-applications/${id}`, data) as Promise<StudentApplicationOutSuccess>
  }

  async getStudentApplication(id: number): Promise<StudentApplicationOutSuccess> {
    return apiService.get(`/student-applications/${id}`)
  }

  async listStudentApplications(filters: ApplicationFilter): Promise<StudentApplicationListOutSuccess> {
    return apiService.get('/student-applications', { params: filters })
  }

  async deleteStudentApplication(id: number): Promise<StudentApplicationOutSuccess> {
  return apiService.delete(`/student-applications/${id}`) as Promise<StudentApplicationOutSuccess>
  }

  // My Student Applications
  async listMyStudentApplications(filters: ApplicationFilter): Promise<StudentApplicationListOutSuccess> {
    return apiService.get('/my-student-applications', { params: filters })
  }

  async getMyStudentApplication(id: number): Promise<StudentApplicationOutSuccess> {
    return apiService.get(`/my-student-applications/${id}`)
  }

  async deleteMyStudentApplication(id: number): Promise<StudentApplicationOutSuccess> {
  return apiService.delete(`/my-student-applications/${id}`) as Promise<StudentApplicationOutSuccess>
  }

  // Specialty CRUD
  async createSpecialty(data: SpecialtyCreateInput): Promise<SpecialtyOutSuccess> {
    return apiService.post('/specialties', data)
  }

  async updateSpecialty(id: number, data: SpecialtyUpdateInput): Promise<SpecialtyOutSuccess> {
  return apiService.put(`/specialties/${id}`, data) as Promise<SpecialtyOutSuccess>
  }

  async getSpecialty(id: number): Promise<SpecialtyOutSuccess> {
    return apiService.get(`/specialties/${id}`)
  }

  async listSpecialties(filters: any): Promise<SpecialtyListOutSuccess> {
    return apiService.get('/specialties', { params: filters })
  }

  async deleteSpecialty(id: number): Promise<SpecialtyOutSuccess> {
  return apiService.delete(`/specialties/${id}`) as Promise<SpecialtyOutSuccess>
  }
}

export const trainingService = new TrainingService()
