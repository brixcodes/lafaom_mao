import { useAuthStore } from '@/stores/auth'

/**
 * Détermine la page de redirection après connexion basée sur le rôle de l'utilisateur
 */
export function getRedirectPathAfterLogin(): string {
  const authStore = useAuthStore()
  
  if (!authStore.user) {
    return '/profile'
  }

  // Vérifier le type d'utilisateur
  const userType = authStore.user.user_type

  console.log('[Redirect Utils] User type:', userType)

  // Si l'utilisateur est admin, rediriger vers le dashboard par défaut
  if (userType === 'admin') {
    console.log('[Redirect Utils] Redirecting admin to dashboard')
    return '/dashboard'
  }

  // Pour tous les autres utilisateurs, rediriger vers le profil
  console.log('[Redirect Utils] Redirecting user to profile')
  return '/profile'
}

/**
 * Détermine si un utilisateur peut accéder à une page spécifique
 */
export function canAccessPage(path: string): boolean {
  const authStore = useAuthStore()
  
  if (!authStore.user) {
    return false
  }

  const userType = authStore.user.user_type

  // Tous les utilisateurs peuvent accéder au profil
  if (path === '/profile') {
    return true
  }

  // Seuls les admins peuvent accéder au dashboard
  if (path === '/dashboard') {
    return userType === 'admin'
  }

  // Par défaut, permettre l'accès
  return true
}

/**
 * Vérifie si l'utilisateur est admin
 */
export function isUserAdmin(): boolean {
  const authStore = useAuthStore()
  
  if (!authStore.user) {
    return false
  }

  const userType = authStore.user.user_type

  return userType === 'admin'
}

/**
 * Vérifie si l'utilisateur est staff
 */
export function isUserStaff(): boolean {
  const authStore = useAuthStore()
  
  if (!authStore.user) {
    return false
  }

  const userType = authStore.user.user_type
  return userType === 'staff'
}

/**
 * Vérifie si l'utilisateur est teacher
 */
export function isUserTeacher(): boolean {
  const authStore = useAuthStore()
  
  if (!authStore.user) {
    return false
  }

  const userType = authStore.user.user_type
  return userType === 'teacher'
}

/**
 * Vérifie si l'utilisateur est student
 */
export function isUserStudent(): boolean {
  const authStore = useAuthStore()
  
  if (!authStore.user) {
    return false
  }

  const userType = authStore.user.user_type
  return userType === 'student'
}
