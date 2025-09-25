import { ref, computed } from 'vue'

// Fonction debounce simple
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const useRolePermissionOptimization = () => {
  // Cache pour éviter les appels API redondants
  const rolesCache = ref<Map<string, any>>(new Map())
  const permissionsCache = ref<Map<string, any>>(new Map())
  const userPermissionsCache = ref<Map<string, any>>(new Map())
  
  // Timestamps pour la gestion du cache
  const cacheTimestamps = ref<Map<string, number>>(new Map())
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  // Debounced functions pour éviter les appels multiples
  const debouncedLoadUserPermissions = debounce(async (userId: string, loadFunction: () => Promise<void>) => {
    await loadFunction()
  }, 300)

  const debouncedLoadRoles = debounce(async (loadFunction: () => Promise<void>) => {
    await loadFunction()
  }, 300)

  const debouncedLoadPermissions = debounce(async (loadFunction: () => Promise<void>) => {
    await loadFunction()
  }, 300)

  // Vérifier si le cache est valide
  const isCacheValid = (key: string): boolean => {
    const timestamp = cacheTimestamps.value.get(key)
    if (!timestamp) return false
    
    const now = Date.now()
    return (now - timestamp) < CACHE_DURATION
  }

  // Mettre à jour le cache
  const updateCache = (key: string, data: any) => {
    rolesCache.value.set(key, data)
    permissionsCache.value.set(key, data)
    userPermissionsCache.value.set(key, data)
    cacheTimestamps.value.set(key, Date.now())
  }

  // Obtenir les données du cache
  const getFromCache = (key: string) => {
    if (isCacheValid(key)) {
      return rolesCache.value.get(key) || 
             permissionsCache.value.get(key) || 
             userPermissionsCache.value.get(key)
    }
    return null
  }

  // Invalider le cache
  const invalidateCache = (key?: string) => {
    if (key) {
      rolesCache.value.delete(key)
      permissionsCache.value.delete(key)
      userPermissionsCache.value.delete(key)
      cacheTimestamps.value.delete(key)
    } else {
      rolesCache.value.clear()
      permissionsCache.value.clear()
      userPermissionsCache.value.clear()
      cacheTimestamps.value.clear()
    }
  }

  // Optimiser le chargement des permissions utilisateur
  const optimizedLoadUserPermissions = async (
    userId: string, 
    loadFunction: () => Promise<void>,
    forceRefresh = false
  ) => {
    const cacheKey = `user_permissions_${userId}`
    
    if (!forceRefresh && isCacheValid(cacheKey)) {
      console.log('📦 Utilisation du cache pour les permissions utilisateur')
      return
    }

    await debouncedLoadUserPermissions(userId, loadFunction)
  }

  // Optimiser le chargement des rôles
  const optimizedLoadRoles = async (
    loadFunction: () => Promise<void>,
    forceRefresh = false
  ) => {
    const cacheKey = 'roles'
    
    if (!forceRefresh && isCacheValid(cacheKey)) {
      console.log('📦 Utilisation du cache pour les rôles')
      return
    }

    await debouncedLoadRoles(loadFunction)
  }

  // Optimiser le chargement des permissions
  const optimizedLoadPermissions = async (
    loadFunction: () => Promise<void>,
    forceRefresh = false
  ) => {
    const cacheKey = 'permissions'
    
    if (!forceRefresh && isCacheValid(cacheKey)) {
      console.log('📦 Utilisation du cache pour les permissions')
      return
    }

    await debouncedLoadPermissions(loadFunction)
  }

  // Statistiques du cache
  const cacheStats = computed(() => ({
    rolesCacheSize: rolesCache.value.size,
    permissionsCacheSize: permissionsCache.value.size,
    userPermissionsCacheSize: userPermissionsCache.value.size,
    totalCacheSize: rolesCache.value.size + permissionsCache.value.size + userPermissionsCache.value.size,
    cacheTimestamps: Array.from(cacheTimestamps.value.entries()).map(([key, timestamp]) => ({
      key,
      timestamp,
      age: Date.now() - timestamp,
      isValid: isCacheValid(key)
    }))
  }))

  return {
    // Cache management
    isCacheValid,
    updateCache,
    getFromCache,
    invalidateCache,
    
    // Optimized loaders
    optimizedLoadUserPermissions,
    optimizedLoadRoles,
    optimizedLoadPermissions,
    
    // Cache stats
    cacheStats,
    
    // Debounced functions
    debouncedLoadUserPermissions,
    debouncedLoadRoles,
    debouncedLoadPermissions
  }
}
