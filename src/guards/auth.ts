import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Routes qui ne nécessitent pas d'authentification
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/two-factor',
  '/change-email',
  '/validate-change-email',
  '/update-password'
]

export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()
  
  // Si c'est une route publique, autoriser l'accès
  if (publicRoutes.includes(to.path)) {
    next()
    return
  }

  try {
    // Vérifier si l'utilisateur est authentifié
    if (!authStore.isAuthenticated) {
      // Si pas de token, rediriger vers login
      if (!authStore.token) {
        console.log('Aucun token, redirection vers login')
        next('/login')
        return
      }

      // Si token présent mais pas d'utilisateur, essayer de recharger
      if (authStore.token && !authStore.user) {
        console.log('Token présent mais pas d\'utilisateur, rechargement du profil')
        await authStore.loadUserProfile()
      }

      // Vérifier à nouveau après le rechargement
      if (!authStore.isAuthenticated) {
        console.log('Utilisateur non authentifié après vérification, redirection vers login')
        next('/login')
        return
      }
    }

    // Si authentifié, autoriser l'accès
    next()
  } catch (error: any) {
    console.error('Erreur lors de la vérification d\'authentification:', error)
    
    // Si erreur 401 (Unauthorized), token invalide
    if (error.response?.status === 401) {
      console.log('Token invalide (401), redirection vers login')
      await authStore.logout()
      next('/login')
    } else {
      // Autres erreurs, rediriger aussi pour sécurité
      console.log('Erreur d\'authentification, redirection vers login')
      next('/login')
    }
  }
}
