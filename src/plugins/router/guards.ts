import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getRedirectPathAfterLogin, isUserAdmin, canAccessPage } from '@/utils/redirectUtils'

/**
 * Guard de navigation pour gérer les redirections basées sur les rôles
 */
export function setupRoleBasedRedirect(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()
  
  // Si l'utilisateur n'est pas authentifié, laisser passer
  if (!authStore.isAuthenticated || !authStore.user) {
    next()
    return
  }

  // Si on accède à la racine, rediriger selon le rôle
  if (to.path === '/') {
    const redirectPath = getRedirectPathAfterLogin()
    console.log('[Router Guard] Redirecting from root to:', redirectPath)
    next(redirectPath)
    return
  }

  // Vérifier les permissions d'accès aux pages
  if (!canAccessPage(to.path)) {
    console.log('[Router Guard] User does not have access to:', to.path)
    
    // Rediriger selon le type d'utilisateur
    if (isUserAdmin()) {
      next('/dashboard')
    } else {
      next('/profile')
    }
    return
  }

  // Sinon, laisser passer
  next()
}

/**
 * Guard pour vérifier l'authentification
 */
export function setupAuthGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()
  
  // Vérifier si la route nécessite une authentification
  const requiresAuth = to.meta.requiresAuth === true
  
  if (requiresAuth && !authStore.isAuthenticated) {
    console.log('[Router Guard] Route requires auth, redirecting to login')
    next('/login')
    return
  }

  // Si l'utilisateur est authentifié et essaie d'accéder à login/register, rediriger
  if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/register')) {
    const redirectPath = getRedirectPathAfterLogin()
    console.log('[Router Guard] Authenticated user trying to access auth pages, redirecting to:', redirectPath)
    next(redirectPath)
    return
  }

  next()
}
