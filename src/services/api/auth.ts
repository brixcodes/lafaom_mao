import { apiService } from './base'

// Types pour l'authentification
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  status: string
  created_at: string
  last_login?: string
}

export interface RegisterRequest {
  email: string
  password: string
  first_name: string
  last_name: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  new_password: string
}

class AuthService {
  // Connexion
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return await apiService.post('/auth/token', credentials)
  }

  // Inscription
  async register(userData: RegisterRequest): Promise<LoginResponse> {
    return await apiService.post('/auth/register', userData)
  }

  // Récupérer l'utilisateur actuel
  async getCurrentUser(): Promise<User> {
    return await apiService.get('/auth/me')
  }

  // Déconnexion
  async logout(): Promise<void> {
    return await apiService.post('/auth/logout')
  }

  // Rafraîchir le token
  async refreshToken(): Promise<LoginResponse> {
    return await apiService.post('/auth/refresh')
  }

  // Mot de passe oublié
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    return await apiService.post('/auth/forgot-password', data)
  }

  // Réinitialiser le mot de passe
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    return await apiService.post('/auth/reset-password', data)
  }

  // Vérifier l'email
  async verifyEmail(token: string): Promise<void> {
    return await apiService.post('/auth/verify-email', { token })
  }

  // Renvoyer l'email de vérification
  async resendVerificationEmail(): Promise<void> {
    return await apiService.post('/auth/resend-verification')
  }

  // Méthodes supplémentaires pour le store auth
  async twoFactorToken(data: { email: string; code: string }): Promise<LoginResponse> {
    return await apiService.post('/auth/two-factor', data)
  }

  async updateProfile(data: any): Promise<any> {
    return await apiService.put('/auth/profile', data)
  }

  async passwordForgotten(data: ForgotPasswordRequest): Promise<void> {
    return await apiService.post('/auth/forgot-password', data)
  }

  async validateForgottenCode(data: { email: string; code: string; password: string }): Promise<LoginResponse> {
    return await apiService.post('/auth/validate-forgotten-code', data)
  }

  async changeEmail(data: { email: string; password: string }): Promise<any> {
    return await apiService.post('/auth/change-email', data)
  }

  async validateChangeEmailCode(data: { email: string; code: string }): Promise<any> {
    return await apiService.post('/auth/validate-change-email', data)
  }

  async updatePassword(data: { password: string; new_password: string }): Promise<any> {
    return await apiService.post('/auth/update-password', data)
  }

  async uploadProfileImage(data: FormData): Promise<any> {
    return await apiService.post('/auth/upload-profile-image', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export const authService = new AuthService()