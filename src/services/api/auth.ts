
import { apiService } from './base'
import type {
  ChangeEmailInput,
  ClientAccessTokenInput,
  ForgottenPasswordInput,
  LoginInput,
  RefreshTokenInput,
  UpdateAddressInput,
  UpdateDeviceInput,
  UpdatePasswordInput,
  UpdateUserProfile,
  UserTokenOut,
  ValidateChangeCodeInput,
  ValidateForgottenCodeInput,
} from '@/types/auth'
import type { BaseOutSuccess } from '@/types/index'
import type { UserFullOutSuccess } from '@/types/user'

export class AuthService {
  // Login principal
  async login(data: LoginInput): Promise<UserTokenOut | BaseOutSuccess> {
    return apiService.postNoConfirm('/auth/token', data)
  }

  // Authentification à deux facteurs
  async twoFactorToken(data: ValidateChangeCodeInput): Promise<UserTokenOut> {
    return apiService.postNoConfirm('/auth/two-factor-token', data)
  }

  // Refresh token
  async refreshToken(data: RefreshTokenInput): Promise<UserTokenOut> {
    return apiService.postNoConfirm('/auth/refresh-token', data)
  }

  // Mot de passe oublié
  async passwordForgotten(data: ForgottenPasswordInput): Promise<BaseOutSuccess> {
    return apiService.postNoConfirm('/auth/password-forgotten', data)
  }

  // Validation du code de mot de passe oublié
  async validateForgottenCode(data: ValidateForgottenCodeInput): Promise<UserTokenOut> {
    return apiService.postNoConfirm('/auth/validate-password-forgotten-code', data)
  }

  // Changement d'email
  async changeEmail(data: ChangeEmailInput): Promise<BaseOutSuccess> {
    return apiService.postNoConfirm('/auth/change-email', data)
  }

  // Validation du code de changement d'email
  async validateChangeEmailCode(data: ValidateChangeCodeInput): Promise<UserFullOutSuccess> {
    return apiService.postNoConfirm('/auth/validate-change-email-code', data)
  }

  // Obtenir le profil utilisateur
  async getMe(): Promise<UserFullOutSuccess> {
    return apiService.get('/auth/me')
  }

  // Mise à jour du profil
  async updateProfile(data: UpdateUserProfile): Promise<UserFullOutSuccess> {
    return apiService.postNoConfirm('/auth/update-profile', data)
  }

  // Mise à jour des adresses
  async updateAddresses(data: UpdateAddressInput): Promise<UserFullOutSuccess> {
    return apiService.postNoConfirm('/auth/update-addresses', data)
  }

  // Mise à jour du device ID
  async updateDevice(data: UpdateDeviceInput): Promise<UserFullOutSuccess> {
    return apiService.postNoConfirm('/auth/update-web-id', data)
  }

  // Mise à jour du mot de passe
  async updatePassword(data: UpdatePasswordInput): Promise<UserFullOutSuccess> {
    return apiService.postNoConfirm('/auth/update-password', data)
  }

  // Upload de l'image de profil
  async uploadProfileImage(formData: FormData): Promise<UserFullOutSuccess> {
    return apiService.upload('/auth/upload-profile-image', formData)
  }

  // Récupérer les permissions de l'utilisateur connecté
  async getMyPermissions(): Promise<{ data: string[]; message: string }> {
    return apiService.get('/auth/my-permissions')
  }

  // Token OAuth2 pour les clients
  async getClientAccessToken(data: ClientAccessTokenInput): Promise<{ access_token: string; token_type: string; expires_in: number }> {
    return apiService.postNoConfirm('/auth/oauth/token', data)
  }

  // Clés JWKS
  async getJwks(): Promise<{ keys: any[] }> {
    return apiService.get('/auth/jwks.json')
  }
}

export const authService = new AuthService()
