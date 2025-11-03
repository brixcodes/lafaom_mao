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
  const isInitialized = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userFullName = computed(() => {
    if (!user.value) return ''
    return `${user.value.first_name} ${user.value.last_name}`
  })
  const userEmail = computed(() => {
    if (!user.value) return null
    return user.value.email
  })
  const userInitials = computed(() => {
    if (!user.value) return ''
    return `${user.value.first_name[0]}${user.value.last_name[0]}`.toUpperCase()
  })
  
  // État pour les permissions
  const userPermissions = ref<string[]>([])
  const userRoles = ref<any[]>([])

  // Vérification des permissions
  const hasPermission = computed(() => (permission: string) => {
    try {
      if (!user.value || !userPermissions.value || !userPermissions.value.length) return false
      return userPermissions.value.includes(permission)
    } catch (error) {
      console.warn('Erreur lors de la vérification de permission:', error)
      return false
    }
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
    isInitialized.value = true
    
    // Stockage dans localStorage
    localStorage.setItem('access_token', authData.access_token.token)
    if (authData.access_token.refresh_token)
      localStorage.setItem('refresh_token', authData.access_token.refresh_token)
    if (authData.access_token.device_id)
      localStorage.setItem('device_id', authData.access_token.device_id)
    
    // Sauvegarder les informations utilisateur dans localStorage
    if (authData.user && authData.user.id) {
      localStorage.setItem('user_data', JSON.stringify(authData.user))
      console.log('[Auth] Données utilisateur sauvegardées dans localStorage:', authData.user.first_name, authData.user.last_name)
    } else {
      console.warn('[Auth] Données utilisateur incomplètes, pas de sauvegarde dans localStorage')
    }
    
    // Charger les permissions après la connexion
    loadUserPermissions()
  }

  function clearAuthData() {
    user.value = null
    token.value = null
    refreshToken.value = null
    deviceId.value = null
    error.value = null
    twoFactorRequired.value = false
    twoFactorEmail.value = null
    isInitialized.value = false
    userPermissions.value = []
    userRoles.value = []
    
    // Nettoyage du localStorage
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('device_id')
    localStorage.removeItem('user_data')
    localStorage.removeItem('user_permissions')
    console.log('[Auth] Données d\'authentification nettoyées')
  }

  // Charger les permissions de l'utilisateur
  async function loadUserPermissions() {
    try {
      if (!token.value) return
      
      const response = await authService.getMyPermissions()
      userPermissions.value = response.data.map((p: any) => p.permission)
      
      // Sauvegarder les permissions dans localStorage pour un chargement instantané
      localStorage.setItem('user_permissions', JSON.stringify(userPermissions.value))
      
      // console.log('[Auth] Permissions chargées:', userPermissions.value)
    } catch (error) {
      console.error('[Auth] Erreur lors du chargement des permissions:', error)
      userPermissions.value = []
    }
  }

  // Fonction utilitaire pour nettoyer les données corrompues
  function clearCorruptedData() {
    console.log('[Auth] Nettoyage des données corrompues...')
    localStorage.removeItem('user_data')
    // Optionnel : nettoyer aussi les tokens si nécessaire
    // localStorage.removeItem('access_token')
    // localStorage.removeItem('refresh_token')
  }

  // Fonction d'initialisation pour recharger les données utilisateur
  async function initializeAuth() {
    if (isInitialized.value) return
    
    console.log('[Auth] Initialisation de l\'authentification...')
    
    // D'abord, essayer de charger les données depuis localStorage
    if (token.value && !user.value) {
      const savedUserData = localStorage.getItem('user_data')
      const savedPermissions = localStorage.getItem('user_permissions')
      
      if (savedUserData) {
        try {
          const parsedUserData = JSON.parse(savedUserData)
          
          // Vérifier que les données utilisateur sont valides
          if (parsedUserData && parsedUserData.id && (parsedUserData.first_name || parsedUserData.last_name)) {
            user.value = parsedUserData
            
            // Charger les permissions depuis localStorage si disponibles
            if (savedPermissions) {
              try {
                userPermissions.value = JSON.parse(savedPermissions)
                console.log('[Auth] Permissions chargées depuis localStorage:', userPermissions.value.length)
              } catch (error) {
                console.warn('[Auth] Erreur lors du parsing des permissions:', error)
                userPermissions.value = []
              }
            }
            
            isInitialized.value = true
            console.log('[Auth] Utilisateur chargé depuis localStorage:', user.value.first_name, user.value.last_name)
            
            // Charger les permissions en arrière-plan pour les mettre à jour
            loadUserPermissions()
            return
          } else {
            console.warn('[Auth] Données utilisateur invalides dans localStorage, nettoyage...')
            clearCorruptedData()
          }
        } catch (error) {
          console.error('[Auth] Erreur lors du parsing des données utilisateur:', error)
          clearCorruptedData()
        }
      }
      
      // Si pas de données sauvegardées ou erreur, recharger depuis l'API
      try {
        console.log('[Auth] Rechargement des informations utilisateur depuis l\'API...')
        isLoading.value = true
        const response = await authService.getMe()
        
        // Extraire les données utilisateur de la réponse API
        // L'API retourne {success: true, message: '...', data: {...}}
        const userData = response.data || response
        user.value = userData
        isInitialized.value = true
        
        // Vérifier que les données utilisateur sont valides avant de les sauvegarder
        if (user.value && user.value.id && (user.value.first_name || user.value.last_name)) {
          localStorage.setItem('user_data', JSON.stringify(user.value))
          console.log('[Auth] Utilisateur rechargé depuis l\'API:', user.value.first_name, user.value.last_name)
        } else {
          console.warn('[Auth] Données utilisateur incomplètes reçues de l\'API:', user.value)
        }
      } catch (error) {
        console.error('[Auth] Erreur lors du rechargement de l\'utilisateur:', error)
        // Si le token est invalide, nettoyer les données et rediriger silencieusement
        clearAuthData()
        // Redirection silencieuse vers login
        await redirectToLoginSilently()
      } finally {
        isLoading.value = false
      }
    } else if (!token.value) {
      // Pas de token, marquer comme initialisé
      isInitialized.value = true
      console.log('[Auth] Aucun token trouvé')
    } else {
      // Token et utilisateur présents, marquer comme initialisé
      isInitialized.value = true
      console.log('[Auth] Utilisateur déjà chargé')
    }
  }

  // Fonction pour rediriger silencieusement vers la page de connexion
  async function redirectToLoginSilently() {
    try {
      // Attendre un petit délai pour que l'utilisateur ne remarque pas la redirection
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Rediriger vers la page de connexion sans notification
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('[Auth] Erreur lors de la redirection silencieuse:', error)
    }
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
      const { usersService } = await import('@/services/api/users')
      const response = await usersService.createUser(userData)
      
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
      console.log('[Auth Store] Login response:', response)
      
      // Vérifier si c'est une réponse 2FA ou un token complet
      if ('access_token' in response) {
        // Login réussi avec token
        console.log('[Auth Store] Login successful with token')
        setAuthData(response as UserTokenOut)
        return { success: true, requiresTwoFactor: false }
      } else if (response.data && response.data.two_factor_enabled === true) {
        // 2FA requis
        console.log('[Auth Store] 2FA required for:', credentials.email)
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
      console.log('[Auth Store] 2FA state check:', {
        twoFactorRequired: twoFactorRequired.value,
        twoFactorEmail: twoFactorEmail.value,
        code: code
      })
      
      if (!twoFactorEmail.value) {
        throw new Error('Email pour 2FA non disponible')
      }
      
      console.log('[Auth Store] Validating 2FA code for:', twoFactorEmail.value)
      console.log('[Auth Store] Sending 2FA request with:', { code, email: twoFactorEmail.value })
      isLoading.value = true
      error.value = null
      
      const response = await authService.validateTwoFactorToken({
        code: code,
        email: twoFactorEmail.value
      })
      
      console.log('[Auth Store] 2FA validation response:', response)
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
      
      const response = await authService.updateProfile(profileData)
      
      // Extraire les données utilisateur de la réponse API
      const userData = response.data || response
      user.value = userData
      
      // Vérifier que les données utilisateur sont valides avant de les sauvegarder
      if (user.value && user.value.id && (user.value.first_name || user.value.last_name)) {
        localStorage.setItem('user_data', JSON.stringify(user.value))
        console.log('[Auth] Profil mis à jour et sauvegardé dans localStorage:', user.value.first_name, user.value.last_name)
      } else {
        console.warn('[Auth] Données utilisateur incomplètes après mise à jour:', user.value)
      }
      
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
      
      // Extraire les données utilisateur de la réponse API
      const userData = response.data || response
      user.value = userData
      
      // Vérifier que les données utilisateur sont valides avant de les sauvegarder
      if (user.value && user.value.id && (user.value.first_name || user.value.last_name)) {
        localStorage.setItem('user_data', JSON.stringify(user.value))
        console.log('[Auth] Email mis à jour et sauvegardé dans localStorage:', user.value.first_name, user.value.last_name)
      } else {
        console.warn('[Auth] Données utilisateur incomplètes après changement d\'email:', user.value)
      }
      
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
      
      // Extraire les données utilisateur de la réponse API
      const userData = response.data || response
      user.value = userData
      
      // Vérifier que les données utilisateur sont valides avant de les sauvegarder
      if (user.value && user.value.id && (user.value.first_name || user.value.last_name)) {
        localStorage.setItem('user_data', JSON.stringify(user.value))
        console.log('[Auth] Mot de passe mis à jour et sauvegardé dans localStorage:', user.value.first_name, user.value.last_name)
      } else {
        console.warn('[Auth] Données utilisateur incomplètes après changement de mot de passe:', user.value)
      }
      
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
      
      // Extraire les données utilisateur de la réponse API
      const userData = response.data || response
      user.value = userData
      
      // Vérifier que les données utilisateur sont valides avant de les sauvegarder
      if (user.value && user.value.id && (user.value.first_name || user.value.last_name)) {
        localStorage.setItem('user_data', JSON.stringify(user.value))
        console.log('[Auth] Image de profil mise à jour et sauvegardée dans localStorage:', user.value.first_name, user.value.last_name)
      } else {
        console.warn('[Auth] Données utilisateur incomplètes après upload d\'image:', user.value)
      }
      
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
      
      const response = await authService.getCurrentUser()
      
      // Extraire les données utilisateur de la réponse API
      // L'API retourne {success: true, message: '...', data: {...}}
      const userData = response.data || response
      user.value = userData
      
      // Vérifier que les données utilisateur sont valides avant de les sauvegarder
      if (user.value && user.value.id && (user.value.first_name || user.value.last_name)) {
        localStorage.setItem('user_data', JSON.stringify(user.value))
        console.log('[Auth] Profil utilisateur sauvegardé dans localStorage:', user.value.first_name, user.value.last_name)
      } else {
        console.warn('[Auth] Données utilisateur incomplètes reçues de l\'API:', user.value)
      }
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
      // Charger le profil et les permissions en parallèle pour plus de rapidité
      await Promise.all([
        loadUserProfile(),
        loadUserPermissions()
      ])
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
    isInitialized,
    
    // Getters
    isAuthenticated,
    userFullName,
    userEmail,
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
    loadUserPermissions,
    clearError,
    resetTwoFactor,
    initialize,
    initializeAuth,
    redirectToLoginSilently,
  }
})
