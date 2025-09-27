// Service API de base
import axios, { type AxiosInstance, type AxiosResponse, type AxiosRequestConfig } from 'axios'
import { showToast } from '../../components/toast/toastManager'
import { API_CONFIG } from '@/config/api'
import type { BaseOutFail } from '@/types'

export class ApiService {
  private api: AxiosInstance

  constructor(baseURL?: string) {
    const defaultBaseURL = API_CONFIG.BASE_URL

    this.api = axios.create({
      baseURL: baseURL || defaultBaseURL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      withCredentials: false,
      validateStatus: status => status >= 200 && status < 300,
    })

    // Request interceptor pour ajouter le token d'authentification
    this.api.interceptors.request.use(
      config => {
        const token = localStorage.getItem('access_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        if (config.method === 'get') {
          config.params = {
            ...config.params,
            _t: Date.now(),
          }
        }
        return config
      },
      error => Promise.reject(error),
    )

    // Response interceptor pour gérer les erreurs
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async error => {
        const status = error.response?.status

        if (status === 401) {
          // gestion token expired...
        } else if (status === 403) {
          showToast({ message: "Accès refusé. Vous n'avez pas les permissions nécessaires.", type: 'error' })
        } else if (status === 422) {
          const errorData = error.response?.data
          if (errorData?.error && Array.isArray(errorData.error)) {
            const errorMessages = errorData.error.map((err: any) => `${err.loc?.join('.')}: ${err.msg}`).join(', ')
            showToast({ message: `Erreur de validation: ${errorMessages}`, type: 'error' })
          } else {
            showToast({ message: errorData?.message || 'Erreur de validation', type: 'error' })
          }
        } else if (status && status >= 500) {
          showToast({ message: 'Erreur serveur. Veuillez réessayer plus tard.', type: 'error' })
        } else if (error.code === 'ECONNABORTED') {
          showToast({ message: 'La requête a pris trop de temps. Vérifiez que le serveur est accessible.', type: 'error' })
        } else if (error.code === 'ERR_NETWORK') {
          showToast({ message: 'Impossible de se connecter au serveur. Vérifiez la connexion internet ou les paramètres CORS.', type: 'error' })
        } else if (!error.response) {
          showToast({ message: 'Erreur de connexion au serveur. Vérifiez votre connexion internet.', type: 'error' })
        }

        console.error('[API Error]', error.response?.data || error.message)
        return Promise.reject(error)
      },
    )
  }

  // Méthodes génériques
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.api.get(url, { params })
    return response.data
  }

  async postNoConfirm<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.post(url, data)
    return response.data
  }

  async post<T>(url: string, data?: any, confirmOptions?: any): Promise<T> {
    try {
      const response = await this.api.post(url, data)
      return response.data
    } catch (error) {
      if (confirmOptions?.errorMessage) {
        showToast({ message: confirmOptions.errorMessage, type: 'error' })
      }
      throw error
    }
  }

  async put<T>(url: string, data?: any, confirmOptions?: any): Promise<T | undefined> {
    try {
      const response = await this.api.put(url, data)
      return response.data
    } catch (error) {
      showToast({ message: confirmOptions?.errorMessage || 'Erreur lors de la modification', type: 'error' })
      throw error
    }
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.patch(url, data)
    return response.data
  }

  async delete<T>(url: string, confirmOptions?: any): Promise<T | undefined> {
    try {
      const response = await this.api.delete(url)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async upload<T>(url: string, formData: FormData): Promise<T> {
    const response = await this.api.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  }

  async postFormData<T>(url: string, formData: FormData, confirmOptions?: any): Promise<T> {
    try {
      const response = await this.api.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    } catch (error) {
      if (confirmOptions?.errorMessage) showToast({ message: confirmOptions.errorMessage, type: 'error' })
      throw error
    }
  }

  async putFormData<T>(url: string, formData: FormData, confirmOptions?: any): Promise<T> {
    try {
      const response = await this.api.put(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    } catch (error) {
      if (confirmOptions?.errorMessage) showToast({ message: confirmOptions.errorMessage, type: 'error' })
      throw error
    }
  }

  async downloadFile(url: string): Promise<Blob> {
    const response = await this.api.get(url, { responseType: 'blob' })
    return response.data
  }

  async uploadPut(url: string, data: FormData, config: AxiosRequestConfig = {}): Promise<any> {
    try {
      const response = await this.api.put(url, data, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...config.headers,
        },
      })
      return response.data
    } catch (error: any) {
      console.error('[uploadPut API Error]', error.response?.data || error.message)
      throw error
    }
  }

  private async refreshToken(refreshToken: string) {
    return this.api.post('/auth/refresh-token', {
      refresh_token: refreshToken,
      device_id: localStorage.getItem('device_id') || '',
    })
  }

  private clearAuthData() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('device_id')
  }

  handleApiError(error: any): BaseOutFail {
    if (error.response?.data) return error.response.data

    return {
      message: "Une erreur inattendue s'est produite",
      error_code: 'UNKNOWN_ERROR',
      success: false,
    }
  }

  async getUserStats(): Promise<any> {
    return this.get('/stats/get-user-stat')
  }

  async testRedisGet(testNumber: number): Promise<any> {
    return this.get(`/test-get-data-to-redis?test_number=${testNumber}`)
  }

  async testRedisSet(testNumber: number): Promise<any> {
    return this.get(`/test-add-data-to-redis?test_number=${testNumber}`)
  }

  async testEmail(email: string): Promise<any> {
    return this.get(`/test-send-email?email=${email}`)
  }

  async setupUsers(): Promise<any> {
    return this.get('/setup-users')
  }
}

// Instance singleton
export const apiService = new ApiService()
