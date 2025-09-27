// Store Pinia pour les utilisateurs
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { usersService } from '@/services/api/users'
import type {
  CreateUserInput,
  UpdateUserInput,
  UserFilter,
  UserListInput,
  AssignPermissionsInput,
  AssignRoleInput,
  UserSimpleOut,
  UsersPageOutSuccess,
  UserOutSuccess,
  PermissionListOutSuccess,
} from '@/types/user'
import type { BaseOutSuccess } from '@/types/index'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<UserSimpleOut[]>([])
  const currentUser = ref<UserSimpleOut | null>(null)
  const permissions = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0,
  })

  // Getters
  const hasUsers = computed(() => users.value.length > 0)
  const currentUserPermissions = computed(() => permissions.value)

  // Actions
  const fetchUsers = async (filter?: UserFilter) => {
    try {
      isLoading.value = true
      error.value = null
      const response: UsersPageOutSuccess = await usersService.getUsers(filter)
      users.value = response.data
      pagination.value = {
        page: response.page,
        pageSize: response.number,
        total: response.total_number,
      }
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des utilisateurs'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createUser = async (userData: CreateUserInput) => {
    try {
      isLoading.value = true
      error.value = null
      const response: UserOutSuccess = await usersService.createUser(userData)
      users.value.unshift(response.data)
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la création de l\'utilisateur'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateUser = async (userId: string, userData: UpdateUserInput) => {
    try {
      isLoading.value = true
      error.value = null
      const response: UserOutSuccess = await usersService.updateUser(userId, userData)
      const index = users.value.findIndex(user => user.id === userId)
      if (index !== -1) {
        users.value[index] = response.data
      }
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      isLoading.value = true
      error.value = null
      await usersService.deleteUser(userId)
      users.value = users.value.filter(user => user.id !== userId)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const assignPermissions = async (data: AssignPermissionsInput) => {
    try {
      isLoading.value = true
      error.value = null
      const response: PermissionListOutSuccess = await usersService.assignPermissions(data)
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de l\'attribution des permissions'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const revokePermissions = async (data: AssignPermissionsInput) => {
    try {
      isLoading.value = true
      error.value = null
      const response: PermissionListOutSuccess = await usersService.revokePermissions(data)
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la révocation des permissions'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const assignRole = async (data: AssignRoleInput) => {
    try {
      isLoading.value = true
      error.value = null
      const response: PermissionListOutSuccess = await usersService.assignRole(data)
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de l\'attribution du rôle'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const revokeRole = async (data: AssignRoleInput) => {
    try {
      isLoading.value = true
      error.value = null
      const response: PermissionListOutSuccess = await usersService.revokeRole(data)
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la révocation du rôle'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchUserPermissions = async () => {
    try {
      isLoading.value = true
      error.value = null
      const response: PermissionListOutSuccess = await usersService.getUserPermissions()
      permissions.value = response.data
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des permissions'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getUserById = async (userId: string) => {
    try {
      isLoading.value = true
      error.value = null
      const response: UserOutSuccess = await usersService.getUserById(userId)
      currentUser.value = response.data
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement de l\'utilisateur'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const setupUsers = async () => {
    try {
      isLoading.value = true
      error.value = null
      const response: BaseOutSuccess = await usersService.setupUsers()
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de l\'initialisation des utilisateurs'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearUsers = () => {
    users.value = []
    currentUser.value = null
    permissions.value = []
  }

  return {
    // State
    users,
    currentUser,
    permissions,
    isLoading,
    error,
    pagination,
    
    // Getters
    hasUsers,
    currentUserPermissions,
    
    // Actions
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    assignPermissions,
    revokePermissions,
    assignRole,
    revokeRole,
    fetchUserPermissions,
    getUserById,
    setupUsers,
    clearError,
    clearUsers,
  }
})