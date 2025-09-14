// Composable pour l'authentification
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { LoginInput, UpdateUserProfile } from '@/types/auth'

export function useAuth() {
  const authStore = useAuthStore()

  // Getters réactifs
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const isLoading = computed(() => authStore.isLoading)
  const error = computed(() => authStore.error)
  const twoFactorRequired = computed(() => authStore.twoFactorRequired)
  const twoFactorEmail = computed(() => authStore.twoFactorEmail)
  const userFullName = computed(() => authStore.userFullName)
  const userInitials = computed(() => authStore.userInitials)

  // Actions d'authentification
  const login = async (credentials: LoginInput) => {
    return await authStore.login(credentials)
  }

  const twoFactorAuth = async (code: string) => {
    return await authStore.twoFactorAuth(code)
  }

  const logout = async () => {
    await authStore.logout()
  }

  const refreshToken = async () => {
    return await authStore.refreshAuthToken()
  }

  // Actions de profil
  const updateProfile = async (profileData: UpdateUserProfile) => {
    return await authStore.updateProfile(profileData)
  }

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    return await authStore.updatePassword(currentPassword, newPassword)
  }

  const uploadProfileImage = async (file: File) => {
    return await authStore.uploadProfileImage(file)
  }

  // Actions de récupération
  const passwordForgotten = async (email: string) => {
    return await authStore.passwordForgotten(email)
  }

  const validateForgottenPassword = async (email: string, code: string, newPassword: string) => {
    return await authStore.validateForgottenPassword(email, code, newPassword)
  }

  // Actions de changement d'email
  const changeEmail = async (newEmail: string, password: string) => {
    return await authStore.changeEmail(newEmail, password)
  }

  const validateChangeEmail = async (email: string, code: string) => {
    return await authStore.validateChangeEmail(email, code)
  }

  // Utilitaires
  const clearError = () => {
    authStore.clearError()
  }

  const resetTwoFactor = () => {
    authStore.resetTwoFactor()
  }

  const initialize = async () => {
    await authStore.initialize()
  }

  return {
    // State
    isAuthenticated,
    user,
    isLoading,
    error,
    twoFactorRequired,
    twoFactorEmail,
    userFullName,
    userInitials,

    // Actions
    login,
    twoFactorAuth,
    logout,
    refreshToken,
    updateProfile,
    updatePassword,
    uploadProfileImage,
    passwordForgotten,
    validateForgottenPassword,
    changeEmail,
    validateChangeEmail,
    clearError,
    resetTwoFactor,
    initialize,
  }
}
