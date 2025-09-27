import { apiService } from './base'

// ===== INTERFACES TRAINING =====

export interface TrainingCreateInput {
  title: string
  status?: string
  duration?: number
  duration_unit?: string
  specialty_id: number
  info_sheet?: string
  training_type: string
  presentation?: string
  benefits?: BenefitInput[]
  strengths?: StrengthInput[]
  target_skills?: string
  program?: string
  target_audience?: string
  prerequisites?: string
  enrollment?: string
}

export interface TrainingUpdateInput {
  title?: string
  status?: string
  duration?: number
  duration_unit?: string
  specialty_id?: number
  info_sheet?: string
  training_type?: string
  presentation?: string
  benefits?: BenefitInput[]
  strengths?: StrengthInput[]
  target_skills?: string
  program?: string
  target_audience?: string
  prerequisites?: string
  enrollment?: string
}

export interface BenefitInput {
  image: string
  content: string
  url: string
}

export interface StrengthInput {
  image: string
  content: string
}

export interface TrainingOut {
  id: string
  title: string
  status: string
  duration: number
  duration_unit: string
  specialty_id: number
  info_sheet?: string
  training_type: string
  presentation: string
  benefits?: BenefitInput[]
  strengths?: StrengthInput[]
  target_skills: string
  program: string
  target_audience: string
  prerequisites?: string
  enrollment: string
  created_at: string
  updated_at: string
}

export interface TrainingOutSuccess {
  success: boolean
  message: string
  data: TrainingOut
}

export interface TrainingsPageOutSuccess {
  data: TrainingOut[]
  page: number
  number: number
  total_number: number
}

// ===== INTERFACES TRAINING SESSIONS =====

export interface TrainingSessionCreateInput {
  training_id: string
  center_id?: number
  start_date: string
  end_date: string
  registration_deadline: string
  available_slots: number
  status: string
  registration_fee: number
  training_fee: number
  currency?: string
}

export interface TrainingSessionUpdateInput {
  center_id?: number
  start_date?: string
  end_date?: string
  registration_deadline?: string
  available_slots?: number
  status?: string
  registration_fee?: number
  training_fee?: number
  currency?: string
}

export interface TrainingSessionOut {
  id: string
  training_id: string
  center_id?: number
  start_date?: string
  end_date?: string
  registration_deadline: string
  available_slots?: number
  status: string
  registration_fee?: number
  training_fee?: number
  currency: string
  moodle_course_id?: number
  created_at: string
  updated_at: string
}

export interface TrainingSessionOutSuccess {
  success: boolean
  message: string
  data: TrainingSessionOut
}

export interface TrainingSessionsPageOutSuccess {
  data: TrainingSessionOut[]
  page: number
  number: number
  total_number: number
}

// ===== INTERFACES SPECIALTIES =====

export interface SpecialtyCreateInput {
  name: string
  description?: string
}

export interface SpecialtyUpdateInput {
  name: string
  description?: string
}

export interface SpecialtyOut {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
}

export interface SpecialtyOutSuccess {
  success: boolean
  message: string
  data: SpecialtyOut
}

export interface SpecialtyListOutSuccess {
  success: boolean
  message: string
  data: SpecialtyOut[]
}

export interface SpecialtiesPageOutSuccess {
  data: SpecialtyOut[]
  page: number
  number: number
  total_number: number
}

// ===== SERVICE TRAINING =====

class TrainingService {
  // === TRAININGS ===

  /**
   * Récupérer la liste des formations avec filtres
   */
  async getTrainings(filters: {
    page?: number
    page_size?: number
    search?: string
    status?: string
    specialty_id?: number
    order_by?: 'created_at' | 'title'
    asc?: 'asc' | 'desc'
  } = {}): Promise<TrainingsPageOutSuccess> {
    const response = await apiService.get('/trainings', { params: filters })
    return response as TrainingsPageOutSuccess
  }

  /**
   * Créer une nouvelle formation
   */
  async createTraining(data: TrainingCreateInput): Promise<TrainingOutSuccess> {
    const response = await apiService.post('/trainings', data)
    return response as TrainingOutSuccess
  }

  /**
   * Récupérer une formation par ID
   */
  async getTrainingById(trainingId: string): Promise<TrainingOutSuccess> {
    const response = await apiService.get(`/trainings/${trainingId}`)
    return response as TrainingOutSuccess
  }

  /**
   * Mettre à jour une formation
   */
  async updateTraining(trainingId: string, data: TrainingUpdateInput): Promise<TrainingOutSuccess> {
    const response = await apiService.put(`/trainings/${trainingId}`, data)
    return response as TrainingOutSuccess
  }

  /**
   * Supprimer une formation
   */
  async deleteTraining(trainingId: string): Promise<TrainingOutSuccess> {
    const response = await apiService.delete(`/trainings/${trainingId}`)
    return response as TrainingOutSuccess
  }

  // === TRAINING SESSIONS ===

  /**
   * Récupérer la liste des sessions de formation avec filtres
   */
  async getTrainingSessions(filters: {
    page?: number
    page_size?: number
    training_id?: string
    center_id?: number
    status?: string
    order_by?: 'created_at' | 'registration_deadline' | 'start_date'
    asc?: 'asc' | 'desc'
  } = {}): Promise<TrainingSessionsPageOutSuccess> {
    const response = await apiService.get('/training-sessions', { params: filters })
    return response as TrainingSessionsPageOutSuccess
  }

  /**
   * Créer une nouvelle session de formation
   */
  async createTrainingSession(data: TrainingSessionCreateInput): Promise<TrainingSessionOutSuccess> {
    const response = await apiService.post('/training-sessions', data)
    return response as TrainingSessionOutSuccess
  }

  /**
   * Récupérer les membres d'une session de formation
   */
  async getTrainingSessionMembers(sessionId: string): Promise<any> {
    return await apiService.get(`/training-sessions/${sessionId}/members`)
  }

  /**
   * Récupérer une session de formation par ID
   */
  async getTrainingSessionById(sessionId: string): Promise<TrainingSessionOutSuccess> {
    const response = await apiService.get(`/training-sessions/${sessionId}`)
    return response as TrainingSessionOutSuccess
  }

  /**
   * Mettre à jour une session de formation
   */
  async updateTrainingSession(sessionId: string, data: TrainingSessionUpdateInput): Promise<TrainingSessionOutSuccess> {
    const response = await apiService.put(`/training-sessions/${sessionId}`, data)
    return response as TrainingSessionOutSuccess
  }

  /**
   * Supprimer une session de formation
   */
  async deleteTrainingSession(sessionId: string): Promise<TrainingSessionOutSuccess> {
    const response = await apiService.delete(`/training-sessions/${sessionId}`)
    return response as TrainingSessionOutSuccess
  }

  // === SPECIALTIES ===

  /**
   * Récupérer la liste des spécialités avec filtres
   */
  async getSpecialties(filters: {
    page?: number
    page_size?: number
    search?: string
    order_by?: 'created_at' | 'name'
    asc?: 'asc' | 'desc'
  } = {}): Promise<SpecialtiesPageOutSuccess> {
    const response = await apiService.get('/specialties', { params: filters })
    return response as SpecialtiesPageOutSuccess
  }

  /**
   * Créer une nouvelle spécialité
   */
  async createSpecialty(data: SpecialtyCreateInput): Promise<SpecialtyOutSuccess> {
    const response = await apiService.post('/specialties', data)
    return response as SpecialtyOutSuccess
  }

  /**
   * Récupérer une spécialité par ID
   */
  async getSpecialtyById(specialtyId: number): Promise<SpecialtyOutSuccess> {
    const response = await apiService.get(`/specialties/${specialtyId}`)
    return response as SpecialtyOutSuccess
  }

  /**
   * Mettre à jour une spécialité
   */
  async updateSpecialty(specialtyId: number, data: SpecialtyUpdateInput): Promise<SpecialtyOutSuccess> {
    const response = await apiService.put(`/specialties/${specialtyId}`, data)
    return response as SpecialtyOutSuccess
  }

  /**
   * Supprimer une spécialité
   */
  async deleteSpecialty(specialtyId: number): Promise<SpecialtyOutSuccess> {
    const response = await apiService.delete(`/specialties/${specialtyId}`)
    return response as SpecialtyOutSuccess
  }

  /**
   * Récupérer toutes les spécialités actives
   */
  async getActiveSpecialties(): Promise<SpecialtyListOutSuccess> {
    const response = await apiService.get('/specialties/active/all')
    return response as SpecialtyListOutSuccess
  }
}

export const trainingService = new TrainingService()
