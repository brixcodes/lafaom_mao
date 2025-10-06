import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { usePermissions } from '@/composables/usePermissions'
import { useAuthStore } from '@/stores/auth'
import type { PermissionEnum } from '@/types/permissions'

/**
 * Interface pour les métadonnées de route avec permissions
 */
interface RouteMetaWithPermissions {
  requiresAuth?: boolean
  permissions?: (string | PermissionEnum)[]
  roles?: string[]
  requireAllPermissions?: boolean
  requireAllRoles?: boolean
}

/**
 * Garde de navigation basé sur les permissions
 * @param to - Route de destination
 * @param from - Route d'origine
 * @param next - Fonction de navigation
 */
export function permissionGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()
  const { hasPermission, hasPermissions, hasRole, hasRoles } = usePermissions()
  
  const meta = to.meta as RouteMetaWithPermissions

  // Si la route ne nécessite pas d'authentification, continuer
  if (!meta.requiresAuth) {
    return next()
  }

  // Si l'utilisateur n'est pas authentifié, rediriger vers login
  if (!authStore.isAuthenticated) {
    return next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  }

  // Vérifier les permissions si spécifiées
  if (meta.permissions && meta.permissions.length > 0) {
    const hasRequiredPermissions = meta.requireAllPermissions
      ? hasPermissions(meta.permissions, true)
      : hasPermissions(meta.permissions, false)

    if (!hasRequiredPermissions) {
      return next({
        name: 'forbidden',
        query: { 
          required: meta.permissions.join(','),
          current: to.fullPath 
        }
      })
    }
  }

  // Vérifier les rôles si spécifiés
  if (meta.roles && meta.roles.length > 0) {
    const hasRequiredRoles = meta.requireAllRoles
      ? hasRoles(meta.roles, true)
      : hasRoles(meta.roles, false)

    if (!hasRequiredRoles) {
      return next({
        name: 'forbidden',
        query: { 
          required: meta.roles.join(','),
          current: to.fullPath 
        }
      })
    }
  }

  // Si toutes les vérifications passent, continuer
  next()
}

/**
 * Garde pour vérifier une permission spécifique
 * @param permission - La permission requise
 * @returns Fonction de garde
 */
export function requirePermission(permission: string | PermissionEnum) {
  return (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const { hasPermission } = usePermissions()
    
    if (!hasPermission(permission)) {
      return next({
        name: 'forbidden',
        query: { 
          required: permission,
          current: to.fullPath 
        }
      })
    }
    
    next()
  }
}

/**
 * Garde pour vérifier plusieurs permissions
 * @param permissions - Les permissions requises
 * @param requireAll - Si toutes les permissions sont requises
 * @returns Fonction de garde
 */
export function requirePermissions(
  permissions: (string | PermissionEnum)[],
  requireAll = false
) {
  return (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const { hasPermissions } = usePermissions()
    
    if (!hasPermissions(permissions, requireAll)) {
      return next({
        name: 'forbidden',
        query: { 
          required: permissions.join(','),
          current: to.fullPath 
        }
      })
    }
    
    next()
  }
}

/**
 * Garde pour vérifier un rôle spécifique
 * @param role - Le rôle requis
 * @returns Fonction de garde
 */
export function requireRole(role: string) {
  return (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const { hasRole } = usePermissions()
    
    if (!hasRole(role)) {
      return next({
        name: 'forbidden',
        query: { 
          required: role,
          current: to.fullPath 
        }
      })
    }
    
    next()
  }
}

/**
 * Garde pour vérifier plusieurs rôles
 * @param roles - Les rôles requis
 * @param requireAll - Si tous les rôles sont requis
 * @returns Fonction de garde
 */
export function requireRoles(roles: string[], requireAll = false) {
  return (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const { hasRoles } = usePermissions()
    
    if (!hasRoles(roles, requireAll)) {
      return next({
        name: 'forbidden',
        query: { 
          required: roles.join(','),
          current: to.fullPath 
        }
      })
    }
    
    next()
  }
}
