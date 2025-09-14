// Composable pour la gestion des utilisateurs
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import type { 
  CreateUserInput, 
  UpdateUserInput, 
  UserFilter,
  AssignPermissionsInput,
  AssignRoleInput 
} from '@/types/user'

export function useUsers() {
  const userStore = useUserStore()

  // Getters réactifs
  const users = computed(() => userStore.users)
  const currentUser = computed(() => userStore.currentUser)
  const permissions = computed(() => userStore.permissions)
  const isLoading = computed(() => userStore.isLoading)
  const error = computed(() => userStore.error)
  const pagination = computed(() => userStore.pagination)
  const hasUsers = computed(() => userStore.hasUsers)
  const currentUserPermissions = computed(() => userStore.currentUserPermissions)

  // Actions CRUD
  const fetchUsers = async (filter?: UserFilter) => {
    return await userStore.fetchUsers(filter)
  }

  const createUser = async (userData: CreateUserInput) => {
    return await userStore.createUser(userData)
  }

  const updateUser = async (userId: string, userData: UpdateUserInput) => {
    return await userStore.updateUser(userId, userData)
  }

  const deleteUser = async (userId: string) => {
    return await userStore.deleteUser(userId)
  }

  const getUserById = async (userId: string) => {
    return await userStore.getUserById(userId)
  }

  // Actions de permissions et rôles
  const assignPermissions = async (data: AssignPermissionsInput) => {
    return await userStore.assignPermissions(data)
  }

  const revokePermissions = async (data: AssignPermissionsInput) => {
    return await userStore.revokePermissions(data)
  }

  const assignRole = async (data: AssignRoleInput) => {
    return await userStore.assignRole(data)
  }

  const revokeRole = async (data: AssignRoleInput) => {
    return await userStore.revokeRole(data)
  }

  const fetchUserPermissions = async () => {
    return await userStore.fetchUserPermissions()
  }

  // Actions utilitaires
  const setupUsers = async () => {
    return await userStore.setupUsers()
  }

  const getUserStats = async () => {
    return await userStore.getUserStats()
  }

  const clearError = () => {
    userStore.clearError()
  }

  const clearUsers = () => {
    userStore.clearUsers()
  }

  return {
    // State
    users,
    currentUser,
    permissions,
    isLoading,
    error,
    pagination,
    hasUsers,
    currentUserPermissions,

    // Actions
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    assignPermissions,
    revokePermissions,
    assignRole,
    revokeRole,
    fetchUserPermissions,
    setupUsers,
    getUserStats,
    clearError,
    clearUsers,
  }
}
