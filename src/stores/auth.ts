// Store Pinia pour l'authentification
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { authService } from '@/services/api/auth'
import type {
  LoginInput,
  UpdateUserProfile,
  UserTokenOut,
  ValidateChangeCodeInput,
  ValidateForgottenCodeInput,
} from '@/types/auth'
import type { UserFullOut, UserFullOutSuccess } from '@/types/user'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<UserFullOut | null>(null)
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'))
  const deviceId = ref<string | null>(localStorage.getItem('device_id'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const twoFactorRequired = ref(false)
  const twoFactorEmail = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userFullName = computed(() => {
    if (!user.value) return ''
    return `${user.value.first_name} ${user.value.last_name}`
  })
  const userInitials = computed(() => {
    if (!user.value) return ''
    return `${user.value.first_name[0]}${user.value.last_name[0]}`.toUpperCase()
  })
  
  // Vérification des permissions (à adapter selon votre structure backend)
  const hasPermission = computed(() => (permission: string) => {
    // TODO: Implémenter la logique de vérification des permissions
    // selon la structure des rôles/permissions dans votre backend
    return false
  })

  // Actions
  // Utilitaires auth
  function setAuthData(authData: UserTokenOut) {
    token.value = authData.access_token.token
    refreshToken.value = authData.access_token.refresh_token ?? null
    deviceId.value = authData.access_token.device_id ?? null
    user.value = authData.user
    twoFactorRequired.value = false
    twoFactorEmail.value = null
    
    // Stockage dans localStorage
    localStorage.setItem('access_token', authData.access_token.token)
    if (authData.access_token.refresh_token)
      localStorage.setItem('refresh_token', authData.access_token.refresh_token)
    if (authData.access_token.device_id)
      localStorage.setItem('device_id', authData.access_token.device_id)
  }

  function clearAuthData() {
    user.value = null
    token.value = null
    refreshToken.value = null
    deviceId.value = null
    error.value = null
    twoFactorRequired.value = false
    twoFactorEmail.value = null
    
    // Nettoyage du localStorage
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('device_id')
  }

  // Inscription d'un nouvel utilisateur
  const register = async (userData: {
    first_name: string
    last_name: string
    email: string
    password: string
    status?: string
    lang?: string
    user_type?: string
    two_factor_enabled?: boolean
  }) => {
    try {
      isLoading.value = true
      error.value = null
      
      // Utiliser le service user pour créer l'utilisateur
      const { userService } = await import('@/services/api/user')
      const response = await userService.createUser(userData)
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de l\'inscription'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Login principal
  const login = async (credentials: LoginInput) => {
    try {
      isLoading.value = true
      error.value = null
      twoFactorRequired.value = false
      
      const response = await authService.login(credentials)
      
      // Vérifier si c'est une réponse 2FA ou un token complet
      if ('access_token' in response) {
        // Login réussi avec token
        setAuthData(response as UserTokenOut)
        return { success: true, requiresTwoFactor: false }
      } else if ('two_factor_enabled' in response) {
        // 2FA requis
        twoFactorRequired.value = true
        twoFactorEmail.value = credentials.email
        return { success: false, requiresTwoFactor: true, email: credentials.email }
      }
      
      return { success: false, requiresTwoFactor: false }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur de connexion'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Authentification à deux facteurs
  const twoFactorAuth = async (code: string) => {
    try {
      if (!twoFactorEmail.value) {
        throw new Error('Email pour 2FA non disponible')
      }
      
      isLoading.value = true
      error.value = null
      
      const response = await authService.twoFactorToken({
        email: twoFactorEmail.value,
        code: code
      })
      
      setAuthData(response)
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Code 2FA invalide'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Logout
  const logout = async () => {
    clearAuthData()
  }

  // Refresh token
  const refreshAuthToken = async () => {
    try {
      if (!refreshToken.value || !deviceId.value) {
        throw new Error('Tokens de rafraîchissement manquants')
      }
      
      const response = await authService.refreshToken({
        refresh_token: refreshToken.value,
        device_id: deviceId.value,
      })
      
      setAuthData(response)
      return response
    } catch (err) {
      clearAuthData()
      throw err
    }
  }

  // Mise à jour du profil
  const updateProfile = async (profileData: UpdateUserProfile) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response: UserFullOutSuccess = await authService.updateProfile(profileData)
      user.value = response.data
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur de mise à jour du profil'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Mot de passe oublié
  const passwordForgotten = async (email: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authService.passwordForgotten({ email })
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || "Erreur d'envoi du code"
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Validation du code de mot de passe oublié
  const validateForgottenPassword = async (email: string, code: string, newPassword: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authService.validateForgottenCode({
        email,
        code,
        password: newPassword
      })
      
      setAuthData(response)
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Code invalide ou expiré'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Changement d'email
  const changeEmail = async (newEmail: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authService.changeEmail({
        email: newEmail,
        password: password
      })
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur de changement d\'email'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Validation du code de changement d'email
  const validateChangeEmail = async (email: string, code: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authService.validateChangeEmailCode({
        email,
        code
      })
      
      user.value = response.data
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Code invalide ou expiré'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Mise à jour du mot de passe
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authService.updatePassword({
        password: currentPassword,
        new_password: newPassword,
      })
      
      user.value = response.data
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur de changement de mot de passe'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Upload de l'image de profil
  const uploadProfileImage = async (file: File) => {
    try {
      isLoading.value = true
      error.value = null
      
      const formData = new FormData()
      formData.append('image', file)
      
      const response = await authService.uploadProfileImage(formData)
      user.value = response.data
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur d\'upload de l\'image'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Chargement du profil utilisateur
  const loadUserProfile = async () => {
    try {
      if (!token.value) return
      
      const response: UserFullOutSuccess = await authService.getMe()
      user.value = response.data
    } catch (err) {
      console.error('Erreur lors du chargement du profil:', err)
      clearAuthData()
    }
  }

  // Nettoyage des erreurs
  const clearError = () => {
    error.value = null
  }

  // Réinitialisation du 2FA
  const resetTwoFactor = () => {
    twoFactorRequired.value = false
    twoFactorEmail.value = null
  }

  // Initialisation du store au démarrage
  const initialize = async () => {
    if (token.value) {
      await loadUserProfile()
    }
  }

  return {
    // State
    user,
    token,
    refreshToken,
    deviceId,
    isLoading,
    error,
    twoFactorRequired,
    twoFactorEmail,
    
    // Getters
    isAuthenticated,
    userFullName,
    userInitials,
    hasPermission,
    
    // Actions
    register,
    login,
    twoFactorAuth,
    logout,
    refreshAuthToken,
    updateProfile,
    passwordForgotten,
    validateForgottenPassword,
    changeEmail,
    validateChangeEmail,
    updatePassword,
    uploadProfileImage,
    loadUserProfile,
    clearError,
    resetTwoFactor,
    initialize,
  }
})
