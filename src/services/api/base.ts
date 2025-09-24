// Service API de base
import axios, { type AxiosInstance, type AxiosResponse, type AxiosRequestConfig } from 'axios'
import { showToast } from '../../components/toast/toastManager'
import { API_CONFIG } from '@/config/api'
import type { BaseOutSuccess, BaseOutFail, BaseOutPage, ErrorMessage } from '@/types'

export class ApiService {
  private api: AxiosInstance

  constructor(baseURL?: string) {
    // Configuration dynamique selon l'environnement
    const defaultBaseURL = API_CONFIG.BASE_URL

    this.api = axios.create({
      baseURL: baseURL || defaultBaseURL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      // Configuration pour les cookies et CORS
      withCredentials: false, // Désactivé car nous utilisons JWT
      validateStatus: status => {
        // Considérer les codes 200-299 comme valides
        return status >= 200 && status < 300
      },
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
        if (import.meta.env.DEV) {
          console.log(`[DEBUG] Interceptor - Config: ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params,
            headers: config.headers,
          })
          if (config.data instanceof FormData) {
            for (const [key, value] of config.data.entries()) {
              console.log(`[DEBUG] Interceptor - FormData: ${key}=${value}`)
            }
          }
        }
        return config
      },
      error => {
        console.error('[DEBUG] Interceptor - Error:', error)
        return Promise.reject(error)
      },
    )

    // Response interceptor pour gérer les erreurs
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        if (import.meta.env.DEV) {
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data,
          })
        }
        return response
      },
      async error => {
        // Récupération sécurisée du config
        const method = error.config?.method?.toUpperCase() || 'UNKNOWN_METHOD'
        const url = error.config?.url || 'UNKNOWN_URL'
        const status = error.response?.status

        if (import.meta.env.DEV) {
          console.error(`❌ API Error: ${method} ${url}`, {
            status,
            data: error.response?.data,
            message: error.message,
          })
          
          // Log detailed error information for debugging
          if (status === 422) {
            console.error('🔍 Validation Error Details:', {
              requestData: error.config?.data,
              validationErrors: error.response?.data,
              headers: error.config?.headers,
            })
          }
        }

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
          // Timeout Axios
          showToast({ message: 'La requête a pris trop de temps. Vérifiez que le serveur est accessible.', type: 'error' })
        } else if (error.code === 'ERR_NETWORK') {
          // Erreur réseau (serveur inaccessible ou CORS)
          showToast({ message: 'Impossible de se connecter au serveur. Vérifiez la connexion internet ou les paramètres CORS.', type: 'error' })
        } else if (!error.response) {
          // Pas de réponse, réseau ou CORS
          showToast({ message: 'Erreur de connexion au serveur. Vérifiez votre connexion internet.', type: 'error' })
        } else {
          showToast({ message: error.response?.data?.message || 'Une erreur est survenue.', type: 'error' })
        }

        return Promise.reject(error)
      },
    )
  }

  // Méthodes génériques
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.api.get(url, { params })
    return response.data
  }

  // POST sans confirmation (pour les routes auth)
  async postNoConfirm<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.post(url, data)
    return response.data
  }

  // POST avec gestion des messages de succès/erreur
  async post<T>(url: string, data?: any, confirmOptions?: any): Promise<T> {
    try {
      const response = await this.api.post(url, data)
      if (confirmOptions?.successMessage) {
        // showToast({ message: confirmOptions.successMessage, type: 'success' })
      }
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
      // showToast({ message: confirmOptions?.successMessage || 'Modification réussie', type: 'success' })
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
      // showToast({ message: confirmOptions?.successMessage || 'Suppression réussie', type: 'success' })
      return response.data
    } catch (error) {
      showToast({ message: confirmOptions?.errorMessage || 'Erreur lors de la suppression', type: 'error' })
      throw error
    }
  }

  async upload<T>(url: string, formData: FormData): Promise<T> {
    console.log('🚀 BaseService upload - URL:', url)
    console.log('📄 BaseService upload - FormData contents:')
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`)
      } else {
        console.log(`  ${key}: ${value}`)
      }
    }
    
    const response = await this.api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    console.log('✅ BaseService upload - Réponse reçue:', response.data)
    return response.data
  }

  // POST avec FormData
  async postFormData<T>(url: string, formData: FormData, confirmOptions?: any): Promise<T> {
    try {
      const response = await this.api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (confirmOptions?.successMessage) {
        // showToast({ message: confirmOptions.successMessage, type: 'success' })
      }
      return response.data
    } catch (error) {
      if (confirmOptions?.errorMessage) {
        showToast({ message: confirmOptions.errorMessage, type: 'error' })
      }
      throw error
    }
  }

  // PUT avec FormData
  async putFormData<T>(url: string, formData: FormData, confirmOptions?: any): Promise<T> {
    try {
      const response = await this.api.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (confirmOptions?.successMessage) {
        // showToast({ message: confirmOptions.successMessage, type: 'success' })
      }
      return response.data
    } catch (error) {
      if (confirmOptions?.errorMessage) {
        showToast({ message: confirmOptions.errorMessage, type: 'error' })
      }
      throw error
    }
  }

  // Méthode pour télécharger des fichiers
  async downloadFile(url: string): Promise<Blob> {
    const response = await this.api.get(url, {
      responseType: 'blob'
    })
    return response.data
  }

  async uploadPut(url: string, data: FormData, config: AxiosRequestConfig = {}): Promise<any> {
    console.log('[DEBUG] url:', url)
    console.log('[DEBUG] Payload to send:', data)
    for (const [key, value] of data.entries()) {
      console.log(`[DEBUG] FormData entry in uploadPut: ${key}=${value}`)
    }
    try {
      const response = await this.api.put(url, data, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...config.headers, // Placer après pour éviter d'écraser Content-Type
        },
      })
      console.log('[DEBUG] API Response:', response.data)
      return response.data
    } catch (error: any) {
      console.error('[DEBUG] API Error:', error.response?.data || error.message)
      throw error
    }
  }

  // Méthode pour rafraîchir le token
  private async refreshToken(refreshToken: string) {
    return this.api.post('/auth/refresh-token', {
      refresh_token: refreshToken,
      device_id: localStorage.getItem('device_id') || '',
    })
  }

  // Méthode pour nettoyer les données d'authentification
  private clearAuthData() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('device_id')
  }

  // Méthode pour gérer les erreurs API
  handleApiError(error: any): BaseOutFail {
    if (error.response?.data) {
      return error.response.data
    }

    return {
      message: "Une erreur inattendue s'est produite",
      error_code: 'UNKNOWN_ERROR',
      success: false,
    }
  }

  // Méthode pour obtenir les statistiques utilisateur
  async getUserStats(): Promise<any> {
    return this.get('/stats/get-user-stat')
  }

  // Méthode pour les tests Redis
  async testRedisGet(testNumber: number): Promise<any> {
    return this.get(`/test-get-data-to-redis?test_number=${testNumber}`)
  }

  async testRedisSet(testNumber: number): Promise<any> {
    return this.get(`/test-add-data-to-redis?test_number=${testNumber}`)
  }

  // Méthode pour tester l'envoi d'email
  async testEmail(email: string): Promise<any> {
    return this.get(`/test-send-email?email=${email}`)
  }

  // Méthode pour setup des utilisateurs
  async setupUsers(): Promise<any> {
    return this.get('/setup-users')
  }
}

// Instance singleton
export const apiService = new ApiService()
