import type {
  Training,
  TrainingSession,
  StudentApplication,
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
import { api } from '@/plugins/axios'
import type { AxiosRequestConfig } from 'axios'
import { buildQueryString } from '@core/utils/helpers'

// Base API paths
const TRAINING_BASE = '/training'
const SESSION_BASE = '/training-session'
const APPLICATION_BASE = '/student-application'

// Training API functions
export const getTrainings = async (filters?: TrainingFilter): Promise<TrainingListOutSuccess> => {
  const queryString = filters ? buildQueryString(filters) : ''
  return api.get(`${TRAINING_BASE}${queryString}`)
}

export const getTraining = async (id: string): Promise<TrainingOutSuccess> => {
  return api.get(`${TRAINING_BASE}/${id}`)
}

export const createTraining = async (data: TrainingCreateInput): Promise<TrainingOutSuccess> => {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value)
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, JSON.stringify(item))
      })
    } else if (value !== undefined) {
      formData.append(key, JSON.stringify(value))
    }
  })

  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }

  return api.post(TRAINING_BASE, formData, config)
}

export const updateTraining = async (id: string, data: TrainingUpdateInput): Promise<TrainingOutSuccess> => {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value)
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, JSON.stringify(item))
      })
    } else if (value !== undefined) {
      formData.append(key, JSON.stringify(value))
    }
  })

  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }

  return api.patch(`${TRAINING_BASE}/${id}`, formData, config)
}

export const deleteTraining = async (id: string): Promise<TrainingOutSuccess> => {
  return api.delete(`${TRAINING_BASE}/${id}`)
}

// Training Session API functions
export const getSessions = async (filters?: SessionFilter): Promise<TrainingSessionListOutSuccess> => {
  const queryString = filters ? buildQueryString(filters) : ''
  return api.get(`${SESSION_BASE}${queryString}`)
}

export const getSession = async (id: string): Promise<TrainingSessionOutSuccess> => {
  return api.get(`${SESSION_BASE}/${id}`)
}

export const createSession = async (data: TrainingSessionCreateInput): Promise<TrainingSessionOutSuccess> => {
  return api.post(SESSION_BASE, data)
}

export const updateSession = async (id: string, data: TrainingSessionUpdateInput): Promise<TrainingSessionOutSuccess> => {
  return api.patch(`${SESSION_BASE}/${id}`, data)
}

export const deleteSession = async (id: string): Promise<TrainingSessionOutSuccess> => {
  return api.delete(`${SESSION_BASE}/${id}`)
}

// Student Application API functions
export const getApplications = async (filters?: ApplicationFilter): Promise<StudentApplicationListOutSuccess> => {
  const queryString = filters ? buildQueryString(filters) : ''
  return api.get(`${APPLICATION_BASE}${queryString}`)
}

export const getApplication = async (id: number): Promise<StudentApplicationOutSuccess> => {
  return api.get(`${APPLICATION_BASE}/${id}`)
}

export const createApplication = async (data: StudentApplicationCreateInput): Promise<StudentApplicationOutSuccess> => {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'attachments' && Array.isArray(value)) {
      value.forEach((file: File, index) => {
        formData.append(`attachments[${index}]`, file)
      })
    } else if (value !== undefined) {
      formData.append(key, JSON.stringify(value))
    }
  })

  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }

  return api.post(APPLICATION_BASE, formData, config)
}

export const updateApplication = async (id: number, data: StudentApplicationUpdateInput): Promise<StudentApplicationOutSuccess> => {
  return api.patch(`${APPLICATION_BASE}/${id}`, data)
}

export const deleteApplication = async (id: number): Promise<StudentApplicationOutSuccess> => {
  return api.delete(`${APPLICATION_BASE}/${id}`)
}

// Additional helper functions
export const getTrainingSpecialties = async () => {
  return api.get('/specialties')
}

export const getTrainingCenters = async () => {
  return api.get('/training-centers')
}
