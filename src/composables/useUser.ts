import { ref, computed, reactive, watch } from 'vue'
import { userService } from '@/services/userService'
import type {
  UserSimpleOut,
  UserFullOut,
  UserFilter,
  CreateUserInput,
  UpdateUserInput,
  UserStatusEnum,
  UserTypeEnum,
  UserWithPermissions,
  RoleOut,
  PermissionOut,
  UsersPageOutSuccess,
  USER_SORT_OPTIONS,
  USER_STATUS_MAP,
  USER_TYPE_MAP,
} from '@/types/user'

// === COMPOSABLE PRINCIPAL POUR LA GESTION DES UTILISATEURS ===
export function useUsers() {
  // État réactif
  const users = ref<UserSimpleOut[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const currentPage = ref(1)
  const totalPages = ref(0)

  // Filtres
  const filters = reactive<UserFilter>({
    page: 1,
    page_size: 20,
    search: '',
    user_type: undefined,
    country_code: '',
    order_by: 'created_at',
    asc: 'desc'
  })

  // Sélection multiple
  const selectedUsers = ref<string[]>([])
  const selectAll = ref(false)

  // Computed properties
  const hasUsers = computed(() => users.value.length > 0)
  const hasError = computed(() => !!error.value)
  const isEmpty = computed(() => !loading.value && !hasUsers.value && !hasError.value)
  const canLoadMore = computed(() => currentPage.value < totalPages.value)
  
  const selectedUsersData = computed(() => 
    users.value.filter(user => selectedUsers.value.includes(user.id))
  )

  const hasSelection = computed(() => selectedUsers.value.length > 0)
  const selectedCount = computed(() => selectedUsers.value.length)

  // Methods
  const fetchUsers = async (resetPage = false) => {
    try {
      loading.value = true
      error.value = null

      if (resetPage) {
        filters.page = 1
        currentPage.value = 1
      }

      const response = await userService.getUsers(filters)
      
      users.value = response.data
      total.value = response.total_number
      currentPage.value = response.page
      totalPages.value = Math.ceil(response.total_number / (filters.page_size || 20))

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur inconnue'
      console.error('Erreur lors du chargement des utilisateurs:', err)
    } finally {
      loading.value = false
    }
  }

  const searchUsers = async (searchTerm: string) => {
    filters.search = searchTerm
    await fetchUsers(true)
  }

  const filterByType = async (userType?: UserTypeEnum) => {
    filters.user_type = userType
    await fetchUsers(true)
  }

  const filterByCountry = async (countryCode: string) => {
    filters.country_code = countryCode
    await fetchUsers(true)
  }

  const sortUsers = async (orderBy: string, direction: 'asc' | 'desc' = 'desc') => {
    filters.order_by = orderBy as any
    filters.asc = direction
    await fetchUsers(true)
  }

  const loadMore = async () => {
    if (!canLoadMore.value || loading.value) return

    try {
      loading.value = true
      filters.page = currentPage.value + 1

      const response = await userService.getUsers(filters)
      
      users.value.push(...response.data)
      currentPage.value = response.page

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement'
    } finally {
      loading.value = false
    }
  }

  const refresh = () => fetchUsers(true)

  const clearFilters = () => {
    Object.assign(filters, {
      page: 1,
      page_size: 20,
      search: '',
      user_type: undefined,
      country_code: '',
      order_by: 'created_at',
      asc: 'desc'
    })
    fetchUsers(true)
  }

  // Sélection
  const toggleUser = (userId: string) => {
    const index = selectedUsers.value.indexOf(userId)
    if (index > -1) {
      selectedUsers.value.splice(index, 1)
    } else {
      selectedUsers.value.push(userId)
    }
  }

  const toggleSelectAll = () => {
    if (selectAll.value) {
      selectedUsers.value = users.value.map(user => user.id)
    } else {
      selectedUsers.value = []
    }
  }

  const clearSelection = () => {
    selectedUsers.value = []
    selectAll.value = false
  }

  // Mise à jour réactive de selectAll
  watch(selectedUsers, () => {
    selectAll.value = users.value.length > 0 && 
                     selectedUsers.value.length === users.value.length
  }, { deep: true })

  // Opérations en masse
  const bulkUpdateStatus = async (status: UserStatusEnum) => {
    if (!hasSelection.value) return

    try {
      loading.value = true
      await userService.bulkUpdateStatus(selectedUsers.value, status)
      await fetchUsers()
      clearSelection()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la mise à jour'
    } finally {
      loading.value = false
    }
  }

  const bulkDelete = async () => {
    if (!hasSelection.value) return

    try {
      loading.value = true
      await userService.bulkDeleteUsers(selectedUsers.value)
      await fetchUsers()
      clearSelection()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la suppression'
    } finally {
      loading.value = false
    }
  }

  return {
    // État
    users,
    loading,
    error,
    total,
    currentPage,
    totalPages,
    filters,
    
    // Sélection
    selectedUsers,
    selectedUsersData,
    selectAll,
    hasSelection,
    selectedCount,
    
    // Computed
    hasUsers,
    hasError,
    isEmpty,
    canLoadMore,
    
    // Méthodes
    fetchUsers,
    searchUsers,
    filterByType,
    filterByCountry,
    sortUsers,
    loadMore,
    refresh,
    clearFilters,
    
    // Sélection
    toggleUser,
    toggleSelectAll,
    clearSelection,
    
    // Bulk operations
    bulkUpdateStatus,
    bulkDelete,
  }
}

// === COMPOSABLE POUR UN UTILISATEUR SPÉCIFIQUE ===
export function useUser(initialUserId?: string) {
  const user = ref<UserSimpleOut | null>(null)
  const userFull = ref<UserFullOut | null>(null)
  const userWithPermissions = ref<UserWithPermissions | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const hasUser = computed(() => !!user.value)
  const fullName = computed(() => 
    user.value ? `${user.value.first_name} ${user.value.last_name}` : ''
  )
  
  const statusDisplay = computed(() => 
    user.value ? USER_STATUS_MAP[user.value.status] : null
  )
  
  const typeDisplay = computed(() => 
    user.value ? USER_TYPE_MAP[user.value.user_type] : null
  )

  // Methods
  const fetchUser = async (userId: string, full = false) => {
    try {
      loading.value = true
      error.value = null

      if (full) {
        const response = await userService.getUserFull(userId)
        userFull.value = response.data
        user.value = response.data
      } else {
        const response = await userService.getUser(userId)
        user.value = response.data
      }

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement'
      user.value = null
      userFull.value = null
    } finally {
      loading.value = false
    }
  }

  const fetchUserWithPermissions = async (userId: string) => {
    try {
      loading.value = true
      error.value = null

      const userData = await userService.getUserWithPermissions(userId)
      userWithPermissions.value = userData
      user.value = userData

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement'
      userWithPermissions.value = null
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (userId: string, userData: UpdateUserInput) => {
    try {
      loading.value = true
      error.value = null

      const response = await userService.updateUser(userId, userData)
      user.value = response.data
      return response.data

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la mise à jour'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateStatus = async (userId: string, status: UserStatusEnum) => {
    try {
      loading.value = true
      error.value = null

      const response = await userService.updateUserStatus(userId, status)
      if (user.value) {
        user.value.status = status
      }
      return response.data

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la mise à jour'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      loading.value = true
      error.value = null

      await userService.deleteUser(userId)
      user.value = null
      userFull.value = null
      userWithPermissions.value = null

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la suppression'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Auto-load si un ID initial est fourni
  if (initialUserId) {
    fetchUser(initialUserId)
  }

  return {
    // État
    user,
    userFull,
    userWithPermissions,
    loading,
    error,
    
    // Computed
    hasUser,
    fullName,
    statusDisplay,
    typeDisplay,
    
    // Méthodes
    fetchUser,
    fetchUserWithPermissions,
    updateUser,
    updateStatus,
    deleteUser,
  }
}

// === COMPOSABLE POUR LA CRÉATION D'UTILISATEURS ===
export function useUserCreation() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  const createUser = async (userData: CreateUserInput): Promise<UserSimpleOut | null> => {
    try {
      loading.value = true
      error.value = null
      success.value = false

      const response = await userService.createUser(userData)
      success.value = true
      return response.data

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la création'
      return null
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    loading.value = false
    error.value = null
    success.value = false
  }

  return {
    loading,
    error,
    success,
    createUser,
    reset,
  }
}

// === COMPOSABLE POUR LA GESTION DES RÔLES ET PERMISSIONS ===
export function useUserRolesPermissions(userId?: string) {
  const roles = ref<RoleOut[]>([])
  const permissions = ref<PermissionOut[]>([])
  const allRoles = ref<RoleOut[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchUserRolesPermissions = async (targetUserId: string) => {
    try {
      loading.value = true
      error.value = null

      const [rolesResponse, permissionsResponse] = await Promise.all([
        userService.getRoles(),
        userService.getUserPermissions(targetUserId).catch(() => ({ data: [] }))
      ])

      allRoles.value = rolesResponse.data
      permissions.value = permissionsResponse.data

      // Extraire les rôles de l'utilisateur à partir des permissions
      const userRoleIds = [...new Set(permissions.value
        .filter(p => p.role_id)
        .map(p => p.role_id!))]
      
      roles.value = allRoles.value.filter(role => userRoleIds.includes(role.id))

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement'
    } finally {
      loading.value = false
    }
  }

  const assignRole = async (targetUserId: string, roleId: number) => {
    try {
      loading.value = true
      error.value = null

      await userService.assignRole(targetUserId, roleId)
      await fetchUserRolesPermissions(targetUserId)

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de l\'attribution'
      throw err
    } finally {
      loading.value = false
    }
  }

  const revokeRole = async (targetUserId: string, roleId: number) => {
    try {
      loading.value = true
      error.value = null

      await userService.revokeRole(targetUserId, roleId)
      await fetchUserRolesPermissions(targetUserId)

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la révocation'
      throw err
    } finally {
      loading.value = false
    }
  }

  const assignPermissions = async (targetUserId: string, permissionsList: string[]) => {
    try {
      loading.value = true
      error.value = null

      await userService.assignPermissions(targetUserId, permissionsList)
      await fetchUserRolesPermissions(targetUserId)

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de l\'attribution'
      throw err
    } finally {
      loading.value = false
    }
  }

  const revokePermissions = async (targetUserId: string, permissionsList: string[]) => {
    try {
      loading.value = true
      error.value = null

      await userService.revokePermissions(targetUserId, permissionsList)
      await fetchUserRolesPermissions(targetUserId)

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la révocation'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Computed
  const hasRoles = computed(() => roles.value.length > 0)
  const hasPermissions = computed(() => permissions.value.length > 0)
  const availableRoles = computed(() => 
    allRoles.value.filter(role => !roles.value.some(userRole => userRole.id === role.id))
  )

  // Auto-load si un userId est fourni
  if (userId) {
    fetchUserRolesPermissions(userId)
  }

  return {
    // État
    roles,
    permissions,
    allRoles,
    loading,
    error,
    
    // Computed
    hasRoles,
    hasPermissions,
    availableRoles,
    
    // Méthodes
    fetchUserRolesPermissions,
    assignRole,
    revokeRole,
    assignPermissions,
    revokePermissions,
  }
}

// === HELPERS ET CONSTANTES ===
export const userSortOptions = USER_SORT_OPTIONS
export const userStatusMap = USER_STATUS_MAP
export const userTypeMap = USER_TYPE_MAP

export function formatUserStatus(status: UserStatusEnum) {
  return USER_STATUS_MAP[status]
}

export function formatUserType(userType: UserTypeEnum) {
  return USER_TYPE_MAP[userType]
}

export function formatFullName(user: UserSimpleOut | UserFullOut) {
  return `${user.first_name} ${user.last_name}`
}

export function getUserInitials(user: UserSimpleOut | UserFullOut) {
  return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
}