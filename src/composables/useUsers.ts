import { ref, computed } from 'vue'
import { userService } from '@/services/api/user'
import { showToast } from '@/components/toast/toastManager'

export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  user_type: string
  status: string
  picture?: string
  created_at: string
  updated_at: string
}

export const useUsers = () => {
  // States
  const users = ref<User[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const totalUsers = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(20)

  // Computed
  const totalPages = computed(() => Math.ceil(totalUsers.value / pageSize.value))

  // Charger la liste des utilisateurs
  const loadUsers = async (page = 1, size = 20, search = '') => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await userService.getUsers({
        page,
        limit: size,
        search
      })
      
      users.value = response.data || []
      totalUsers.value = response.total_number || 0
      currentPage.value = page
      pageSize.value = size
      
    } catch (err: any) {
      console.error('Erreur lors du chargement des utilisateurs:', err)
      error.value = 'Erreur lors du chargement des utilisateurs'
      showToast({
        message: 'Erreur lors du chargement des utilisateurs',
        type: 'error'
      })
    } finally {
      isLoading.value = false
    }
  }

  // Charger un utilisateur par ID
  const loadUser = async (userId: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      // Validation de l'ID utilisateur (peut être string ou number)
      if (!userId || userId.trim() === '') {
        throw new Error('ID utilisateur invalide')
      }
      
      const response = await userService.getUser(userId)
      return response.data
    } catch (err: any) {
      console.error('Erreur lors du chargement de l\'utilisateur:', err)
      error.value = 'Erreur lors du chargement de l\'utilisateur'
      showToast({
        message: 'Erreur lors du chargement de l\'utilisateur',
        type: 'error'
      })
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Créer un utilisateur
  const createUser = async (userData: any) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await userService.createUser(userData)
      
      showToast({
        message: 'Utilisateur créé avec succès',
        type: 'success'
      })
      
      // Recharger la liste
      await loadUsers(currentPage.value, pageSize.value)
      
      return response
    } catch (err: any) {
      console.error('Erreur lors de la création de l\'utilisateur:', err)
      error.value = 'Erreur lors de la création de l\'utilisateur'
      showToast({
        message: err.response?.data?.message || 'Erreur lors de la création de l\'utilisateur',
        type: 'error'
      })
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Mettre à jour un utilisateur
  const updateUser = async (userId: string, userData: any) => {
    try {
      isLoading.value = true
      error.value = null
      
      if (!userId || userId.trim() === '') {
        throw new Error('ID utilisateur invalide')
      }
      
      // Les IDs sont des UUIDs (strings) dans le backend
      const response = await userService.updateUser(userId, userData)
      
      showToast({
        message: 'Utilisateur mis à jour avec succès',
        type: 'success'
      })
      
      // Recharger la liste
      await loadUsers(currentPage.value, pageSize.value)
      
      return response
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', err)
      error.value = 'Erreur lors de la mise à jour de l\'utilisateur'
      showToast({
        message: err.response?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur',
        type: 'error'
      })
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Supprimer un utilisateur
  const deleteUser = async (userId: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      if (!userId || userId.trim() === '') {
        throw new Error('ID utilisateur invalide')
      }
      
      // Les IDs sont des UUIDs (strings) dans le backend
      const response = await userService.deleteUser(userId)
      
      showToast({
        message: 'Utilisateur supprimé avec succès',
        type: 'success'
      })
      
      // Recharger la liste
      await loadUsers(currentPage.value, pageSize.value)
      
      return response
    } catch (err: any) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', err)
      error.value = 'Erreur lors de la suppression de l\'utilisateur'
      showToast({
        message: err.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur',
        type: 'error'
      })
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Rechercher des utilisateurs
  const searchUsers = async (searchTerm: string) => {
    await loadUsers(1, pageSize.value, searchTerm)
  }

  // Changer de page
  const changePage = async (page: number) => {
    await loadUsers(page, pageSize.value)
  }

  // Changer la taille de page
  const changePageSize = async (size: number) => {
    await loadUsers(1, size)
  }

  return {
    // States
    users,
    isLoading,
    error,
    totalUsers,
    currentPage,
    pageSize,
    
    // Computed
    totalPages,
    
    // Methods
    loadUsers,
    loadUser,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    changePage,
    changePageSize,
  }
}