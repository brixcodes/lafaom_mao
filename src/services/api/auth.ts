import { apiService } from './base'
import type { UserFullOutSuccess, UserFullOut, Token, UserTokenOut, UpdateUserProfile, UpdateAddressInput, UpdateDeviceInput, UpdatePasswordInput, ClientACcessTokenInput, LoginInput, ValidateChangeCodeInput, RefreshTokenInput, ForgottenPasswordInput, ValidateForgottenCodeInput, ChangeEmailInput } from '@/types/user'
import type { PermissionListOutSuccess, RoleOutSuccess } from '@/types/permissions'

// ===== INTERFACES AUTH =====


















// ===== SERVICE AUTH =====

class AuthService {
  // === AUTHENTICATION ===
  
  /**
   * Connexion avec email et mot de passe
   */
  async login(data: LoginInput): Promise<UserTokenOut> {
    const response = await apiService.post('/auth/token', data)
    return response as UserTokenOut
  }

  /**
   * Validation du code à deux facteurs
   */
  async validateTwoFactorToken(data: ValidateChangeCodeInput): Promise<UserTokenOut> {
    const response = await apiService.post('/auth/two-factor-token', data)
    return response as UserTokenOut
  }

  /**
   * Rafraîchir le token d'accès
   */
  async refreshToken(data: RefreshTokenInput): Promise<UserTokenOut> {
    const response = await apiService.post('/auth/refresh-token', data)
    return response as UserTokenOut
  }

  /**
   * Mot de passe oublié
   */
  async passwordForgotten(data: ForgottenPasswordInput): Promise<any> {
    return await apiService.post('/auth/password-forgotten', data)
  }

  /**
   * Validation du code de mot de passe oublié
   */
  async validatePasswordForgottenCode(data: ValidateForgottenCodeInput): Promise<UserTokenOut> {
    const response = await apiService.post('/auth/validate-password-forgotten-code', data)
    return response as UserTokenOut
  }

  /**
   * Changer l'email
   */
  async changeEmail(data: ChangeEmailInput): Promise<any> {
    return await apiService.post('/auth/change-email', data)
  }

  /**
   * Validation du code de changement d'email
   */
  async validateChangeEmailCode(data: ValidateChangeCodeInput): Promise<UserFullOutSuccess> {
    const response = await apiService.post('/auth/validate-change-email-code', data)
    return response as UserFullOutSuccess
  }

  // === USER PROFILE ===

  /**
   * Récupérer les informations de l'utilisateur connecté
   */
  async getMe(): Promise<UserFullOutSuccess> {
    const response = await apiService.get('/auth/me')
    return response as UserFullOutSuccess
  }

  /**
   * Récupérer les informations de l'utilisateur connecté (alias pour getMe)
   */
  async getCurrentUser(): Promise<UserFullOutSuccess> {
    return await this.getMe()
  }

  /**
   * Récupérer les permissions de l'utilisateur connecté
   */
  async getMyPermissions(): Promise<PermissionListOutSuccess> {
    const response = await apiService.get('/auth/my-permissions')
    return response as PermissionListOutSuccess
  }

  /**
   * Récupérer le rôle de l'utilisateur connecté
   */
  async getMyRole(): Promise<RoleOutSuccess> {
    const response = await apiService.get('/auth/my-role')
    return response as RoleOutSuccess
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  async updateProfile(data: UpdateUserProfile): Promise<UserFullOutSuccess> {
    const response = await apiService.post('/auth/update-profile', data)
    return response as UserFullOutSuccess
  }

  /**
   * Mettre à jour les adresses
   */
  async updateAddresses(data: UpdateAddressInput): Promise<UserFullOutSuccess> {
    const response = await apiService.post('/auth/update-addresses', data)
    return response as UserFullOutSuccess
  }

  /**
   * Mettre à jour l'ID web
   */
  async updateWebId(data: UpdateDeviceInput): Promise<UserFullOutSuccess> {
    const response = await apiService.post('/auth/update-web-id', data)
    return response as UserFullOutSuccess
  }

  /**
   * Mettre à jour le mot de passe
   */
  async updatePassword(data: UpdatePasswordInput): Promise<UserFullOutSuccess> {
    const response = await apiService.post('/auth/update-password', data)
    return response as UserFullOutSuccess
  }

  /**
   * Upload de l'image de profil
   */
  async uploadProfileImage(image: File): Promise<UserFullOutSuccess> {
    const formData = new FormData()
    formData.append('image', image)
    
    const response = await apiService.post('/auth/upload-profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response as UserFullOutSuccess
  }

  // === OAUTH ===

  /**
   * Obtenir le token d'accès client
   */
  async getClientAccessToken(data: ClientACcessTokenInput): Promise<any> {
    return await apiService.post('/auth/oauth/token', data)
  }

  /**
   * Récupérer les clés JWKS
   */
  async getJwks(): Promise<any> {
    return await apiService.get('/auth/jwks.json')
  }
}

export const authService = new AuthService()