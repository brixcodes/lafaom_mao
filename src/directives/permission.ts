import type { Directive, DirectiveBinding } from 'vue'
import { usePermissions } from '@/composables/usePermissions'
import type { PermissionEnum } from '@/types/permissions'

/**
 * Interface pour les options de la directive
 */
interface PermissionDirectiveValue {
  permission?: string | PermissionEnum
  permissions?: (string | PermissionEnum)[]
  role?: string
  roles?: string[]
  requireAll?: boolean
  fallback?: 'hide' | 'disable'
}

/**
 * Directive pour masquer/afficher des éléments basés sur les permissions
 * Usage: v-permission="{ permission: 'can_view_user' }"
 * Usage: v-permission="{ permissions: ['can_view_user', 'can_create_user'], requireAll: false }"
 * Usage: v-permission="{ role: 'admin' }"
 * Usage: v-permission="{ roles: ['admin', 'manager'], requireAll: false }"
 */
export const vPermission: Directive<HTMLElement, PermissionDirectiveValue> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<PermissionDirectiveValue>) {
    checkPermission(el, binding)
  },
  
  updated(el: HTMLElement, binding: DirectiveBinding<PermissionDirectiveValue>) {
    checkPermission(el, binding)
  }
}

/**
 * Vérifie les permissions et applique les styles appropriés
 */
function checkPermission(el: HTMLElement, binding: DirectiveBinding<PermissionDirectiveValue>) {
  const { hasPermission, hasPermissions, hasRole, hasRoles } = usePermissions()
  const value = binding.value
  
  if (!value) {
    showElement(el)
    return
  }

  let hasAccess = false

  // Vérifier une permission unique
  if (value.permission) {
    hasAccess = hasPermission(value.permission)
  }
  // Vérifier plusieurs permissions
  else if (value.permissions && value.permissions.length > 0) {
    hasAccess = hasPermissions(value.permissions, value.requireAll || false)
  }
  // Vérifier un rôle unique
  else if (value.role) {
    hasAccess = hasRole(value.role)
  }
  // Vérifier plusieurs rôles
  else if (value.roles && value.roles.length > 0) {
    hasAccess = hasRoles(value.roles, value.requireAll || false)
  }

  // Appliquer le résultat
  if (hasAccess) {
    showElement(el)
  } else {
    if (value.fallback === 'disable') {
      disableElement(el)
    } else {
      hideElement(el)
    }
  }
}

/**
 * Affiche l'élément
 */
function showElement(el: HTMLElement) {
  el.style.display = ''
  el.style.visibility = 'visible'
  el.style.opacity = '1'
  el.removeAttribute('disabled')
  el.classList.remove('permission-disabled')
}

/**
 * Masque l'élément
 */
function hideElement(el: HTMLElement) {
  el.style.display = 'none'
  el.classList.add('permission-hidden')
}

/**
 * Désactive l'élément
 */
function disableElement(el: HTMLElement) {
  el.style.opacity = '0.5'
  el.style.pointerEvents = 'none'
  el.setAttribute('disabled', 'true')
  el.classList.add('permission-disabled')
}

/**
 * Directive pour les permissions avec fallback
 * Usage: v-permission-fallback="{ permission: 'can_edit_user', fallback: 'disable' }"
 */
export const vPermissionFallback: Directive<HTMLElement, PermissionDirectiveValue> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<PermissionDirectiveValue>) {
    checkPermissionWithFallback(el, binding)
  },
  
  updated(el: HTMLElement, binding: DirectiveBinding<PermissionDirectiveValue>) {
    checkPermissionWithFallback(el, binding)
  }
}

/**
 * Vérifie les permissions avec fallback
 */
function checkPermissionWithFallback(el: HTMLElement, binding: DirectiveBinding<PermissionDirectiveValue>) {
  const { hasPermission, hasPermissions, hasRole, hasRoles } = usePermissions()
  const value = binding.value
  
  if (!value) {
    showElement(el)
    return
  }

  let hasAccess = false

  // Vérifier une permission unique
  if (value.permission) {
    hasAccess = hasPermission(value.permission)
  }
  // Vérifier plusieurs permissions
  else if (value.permissions && value.permissions.length > 0) {
    hasAccess = hasPermissions(value.permissions, value.requireAll || false)
  }
  // Vérifier un rôle unique
  else if (value.role) {
    hasAccess = hasRole(value.role)
  }
  // Vérifier plusieurs rôles
  else if (value.roles && value.roles.length > 0) {
    hasAccess = hasRoles(value.roles, value.requireAll || false)
  }

  // Appliquer le résultat avec fallback
  if (hasAccess) {
    showElement(el)
  } else {
    const fallback = value.fallback || 'hide'
    
    if (fallback === 'disable') {
      disableElement(el)
    } else {
      hideElement(el)
    }
  }
}

/**
 * Directive pour les actions (boutons, liens)
 * Usage: v-action="{ permission: 'can_delete_user' }"
 */
export const vAction: Directive<HTMLElement, string | PermissionEnum> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | PermissionEnum>) {
    checkActionPermission(el, binding)
  },
  
  updated(el: HTMLElement, binding: DirectiveBinding<string | PermissionEnum>) {
    checkActionPermission(el, binding)
  }
}

/**
 * Vérifie les permissions pour les actions
 */
function checkActionPermission(el: HTMLElement, binding: DirectiveBinding<string | PermissionEnum>) {
  const { hasPermission } = usePermissions()
  const permission = binding.value
  
  if (!permission) {
    showElement(el)
    return
  }

  const hasAccess = hasPermission(permission)

  if (hasAccess) {
    showElement(el)
  } else {
    disableElement(el)
  }
}
