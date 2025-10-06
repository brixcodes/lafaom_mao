import { ref, computed, watch } from 'vue'
import { permissionsApiService } from './api/permissions'
import { useAuthStore } from '@/stores/auth'
import type { PermissionOut, RoleOut, PermissionEnum } from '@/types/permissions'

// Interface pour le cache des permissions
interface PermissionCache {
  permissions: PermissionOut[]
  roles: RoleOut[]
  lastUpdated: number
  userId: string | null
}

// Service de permissions en temps réel
class PermissionService {
  // État réactif
  private permissions = ref<PermissionOut[]>([])
  private roles = ref<RoleOut[]>([])
  private isLoading = ref(false)
  private lastUpdated = ref<number>(0)
  private cache = ref<PermissionCache | null>(null)
  
  // Configuration
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  private readonly REFRESH_INTERVAL = 30 * 1000 // 30 secondes
  private refreshTimer: NodeJS.Timeout | null = null

  constructor() {
    this.initializeService()
  }

  /**
   * Initialise le service de permissions
   */
  private initializeService() {
    const authStore = useAuthStore()
    
    // Écouter les changements d'authentification
    watch(
      () => authStore.isAuthenticated,
      (isAuthenticated) => {
        if (isAuthenticated) {
          // Charger les permissions seulement si l'utilisateur est connecté
          this.loadUserPermissions()
        } else {
          this.clearPermissions()
          this.stopAutoRefresh()
        }
      },
      { immediate: false } // Ne pas charger immédiatement pour éviter les erreurs
    )

    // Écouter les changements d'utilisateur
    watch(
      () => authStore.user?.id,
      (userId) => {
        if (userId && authStore.isAuthenticated) {
          this.loadUserPermissions()
        }
      }
    )
  }

  /**
   * Charge les permissions de l'utilisateur connecté
   */
  async loadUserPermissions(forceRefresh = false): Promise<void> {
    try {
      // Vérifier le cache si pas de refresh forcé
      if (!forceRefresh && this.isCacheValid()) {
        this.restoreFromCache()
        return
      }

      this.isLoading.value = true
      
      const { permissions, roles } = await permissionsApiService.getUserPermissionsAndRoles()
      
      this.permissions.value = permissions
      this.roles.value = roles
      this.lastUpdated.value = Date.now()
      
      // Mettre à jour le cache
      this.updateCache()
      
    } catch (error) {
      console.error('Erreur lors du chargement des permissions:', error)
      
      // En cas d'erreur, essayer de restaurer depuis le cache
      if (this.cache.value) {
        this.restoreFromCache()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  /**
   * Vérifie si l'utilisateur a une permission spécifique
   * @param permission - La permission à vérifier
   * @returns true si l'utilisateur a la permission, false sinon
   */
  hasPermission(permission: string | PermissionEnum): boolean {
    if (!this.permissions.value.length) {
      return false
    }

    return this.permissions.value.some(p => p.permission === permission)
  }

  /**
   * Vérifie si l'utilisateur a plusieurs permissions
   * @param permissions - Les permissions à vérifier
   * @param requireAll - Si true, toutes les permissions sont requises. Si false, au moins une.
   * @returns true si les conditions sont remplies
   */
  hasPermissions(permissions: (string | PermissionEnum)[], requireAll = false): boolean {
    if (!permissions.length) return true

    const hasPermissions = permissions.map(p => this.hasPermission(p))
    
    return requireAll 
      ? hasPermissions.every(Boolean)
      : hasPermissions.some(Boolean)
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   * @param roleName - Le nom du rôle à vérifier
   * @returns true si l'utilisateur a le rôle
   */
  hasRole(roleName: string): boolean {
    return this.roles.value.some(role => role.name === roleName)
  }

  /**
   * Vérifie si l'utilisateur a plusieurs rôles
   * @param roleNames - Les noms des rôles à vérifier
   * @param requireAll - Si true, tous les rôles sont requis
   * @returns true si les conditions sont remplies
   */
  hasRoles(roleNames: string[], requireAll = false): boolean {
    if (!roleNames.length) return true

    const hasRoles = roleNames.map(role => this.hasRole(role))
    
    return requireAll 
      ? hasRoles.every(Boolean)
      : hasRoles.some(Boolean)
  }

  /**
   * Récupère toutes les permissions de l'utilisateur
   */
  getAllPermissions(): PermissionOut[] {
    return [...this.permissions.value]
  }

  /**
   * Récupère tous les rôles de l'utilisateur
   */
  getAllRoles(): RoleOut[] {
    return [...this.roles.value]
  }

  /**
   * Récupère les permissions par catégorie
   */
  getPermissionsByCategory(): Record<string, PermissionOut[]> {
    const categories: Record<string, PermissionOut[]> = {}
    
    this.permissions.value.forEach(permission => {
      const category = permission.permission.split('_')[1] || 'other'
      if (!categories[category]) {
        categories[category] = []
      }
      categories[category].push(permission)
    })
    
    return categories
  }

  /**
   * Force le rafraîchissement des permissions
   */
  async refreshPermissions(): Promise<void> {
    await this.loadUserPermissions(true)
  }

  /**
   * Démarre le rafraîchissement automatique
   * Désactivé pour éviter les erreurs répétées
   */
  private startAutoRefresh(): void {
    // Désactivé temporairement pour éviter les erreurs répétées
    // this.stopAutoRefresh() // Arrêter le timer existant
    
    // this.refreshTimer = setInterval(() => {
    //   this.loadUserPermissions()
    // }, this.REFRESH_INTERVAL)
  }

  /**
   * Arrête le rafraîchissement automatique
   */
  private stopAutoRefresh(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
      this.refreshTimer = null
    }
  }

  /**
   * Vérifie si le cache est valide
   */
  private isCacheValid(): boolean {
    if (!this.cache.value) return false
    
    const now = Date.now()
    const authStore = useAuthStore()
    
    return (
      this.cache.value.userId === authStore.user?.id &&
      (now - this.cache.value.lastUpdated) < this.CACHE_DURATION
    )
  }

  /**
   * Met à jour le cache
   */
  private updateCache(): void {
    const authStore = useAuthStore()
    
    this.cache.value = {
      permissions: [...this.permissions.value],
      roles: [...this.roles.value],
      lastUpdated: this.lastUpdated.value,
      userId: authStore.user?.id || null
    }
  }

  /**
   * Restaure depuis le cache
   */
  private restoreFromCache(): void {
    if (!this.cache.value) return
    
    this.permissions.value = [...this.cache.value.permissions]
    this.roles.value = [...this.cache.value.roles]
    this.lastUpdated.value = this.cache.value.lastUpdated
  }

  /**
   * Vide les permissions
   */
  private clearPermissions(): void {
    this.permissions.value = []
    this.roles.value = []
    this.lastUpdated.value = 0
    this.cache.value = null
  }

  /**
   * Nettoie les ressources
   */
  destroy(): void {
    this.stopAutoRefresh()
    this.clearPermissions()
  }

  // Getters réactifs
  get permissionsList() {
    return computed(() => this.permissions.value)
  }

  get rolesList() {
    return computed(() => this.roles.value)
  }

  get loading() {
    return computed(() => this.isLoading.value)
  }

  get lastUpdateTime() {
    return computed(() => this.lastUpdated.value)
  }

  get isInitialized() {
    return computed(() => this.permissions.value.length > 0)
  }
}

// Instance singleton
export const permissionService = new PermissionService()

// Export des fonctions utilitaires
export const usePermissions = () => {
  return {
    hasPermission: (permission: string | PermissionEnum) => permissionService.hasPermission(permission),
    hasPermissions: (permissions: (string | PermissionEnum)[], requireAll = false) => 
      permissionService.hasPermissions(permissions, requireAll),
    hasRole: (roleName: string) => permissionService.hasRole(roleName),
    hasRoles: (roleNames: string[], requireAll = false) => permissionService.hasRoles(roleNames, requireAll),
    getAllPermissions: () => permissionService.getAllPermissions(),
    getAllRoles: () => permissionService.getAllRoles(),
    getPermissionsByCategory: () => permissionService.getPermissionsByCategory(),
    refreshPermissions: () => permissionService.refreshPermissions(),
    permissions: permissionService.permissionsList,
    roles: permissionService.rolesList,
    loading: permissionService.loading,
    lastUpdateTime: permissionService.lastUpdateTime,
    isInitialized: permissionService.isInitialized
  }
}
