import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { specialtyService } from '@/services/api/specialties'
import type {
  Specialty,
  SpecialtyCreateInput,
  SpecialtyUpdateInput,
  SpecialtyFilter,
} from '@/types/specialties'

export const useSpecialtyStore = defineStore('specialties', () => {
  // ===========================================
  // STATE
  // ===========================================

  const specialties = ref<Specialty[]>([])
  const currentSpecialty = ref<Specialty | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const totalCount = ref(0)
  const currentPage = ref(1)
  const totalPages = ref(0)

  // ===========================================
  // GETTERS
  // ===========================================

  const getSpecialtyById = computed(() => {
    return (id: number) => specialties.value.find(s => s.id === id)
  })

  const getSpecialtyByName = computed(() => {
    return (name: string) => specialties.value.find(s => s.name.toLowerCase().includes(name.toLowerCase()))
  })

  const sortedSpecialties = computed(() => {
    return [...specialties.value].sort((a, b) => a.name.localeCompare(b.name))
  })

  // ===========================================
  // ACTIONS
  // ===========================================

  // Fetch specialties with filters
  const fetchSpecialties = async (filters: SpecialtyFilter = {}) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await specialtyService.getSpecialties(filters)
      specialties.value = response.data
      totalCount.value = response.total_number
      currentPage.value = response.page
      totalPages.value = Math.ceil(response.total_number / (filters.limit || 10))
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des spécialités'
      console.error('Error fetching specialties:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Fetch single specialty
  const fetchSpecialty = async (specialtyId: number) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await specialtyService.getSpecialty(specialtyId)
      currentSpecialty.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement de la spécialité'
      console.error('Error fetching specialty:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Create specialty
  const createSpecialty = async (data: SpecialtyCreateInput) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await specialtyService.createSpecialty(data)
      specialties.value.unshift(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la création de la spécialité'
      console.error('Error creating specialty:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Update specialty
  const updateSpecialty = async (specialtyId: number, data: SpecialtyUpdateInput) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await specialtyService.updateSpecialty(specialtyId, data)
      const index = specialties.value.findIndex(s => s.id === specialtyId)
      if (index !== -1) {
        specialties.value[index] = response.data
      }
      if (currentSpecialty.value?.id === specialtyId) {
        currentSpecialty.value = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la mise à jour de la spécialité'
      console.error('Error updating specialty:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Delete specialty
  const deleteSpecialty = async (specialtyId: number) => {
    isLoading.value = true
    error.value = null
    
    try {
      await specialtyService.deleteSpecialty(specialtyId)
      specialties.value = specialties.value.filter(s => s.id !== specialtyId)
      if (currentSpecialty.value?.id === specialtyId) {
        currentSpecialty.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la suppression de la spécialité'
      console.error('Error deleting specialty:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Fetch all specialties (for dropdowns, etc.)
  const fetchAllSpecialties = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await specialtyService.getAllSpecialties()
      specialties.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des spécialités'
      console.error('Error fetching all specialties:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Clear error
  const clearError = () => {
    error.value = null
  }

  // Reset state
  const resetState = () => {
    specialties.value = []
    currentSpecialty.value = null
    isLoading.value = false
    error.value = null
    totalCount.value = 0
    currentPage.value = 1
    totalPages.value = 0
  }

  return {
    // State
    specialties,
    currentSpecialty,
    isLoading,
    error,
    totalCount,
    currentPage,
    totalPages,
    
    // Getters
    getSpecialtyById,
    getSpecialtyByName,
    sortedSpecialties,
    
    // Actions
    fetchSpecialties,
    fetchSpecialty,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,
    fetchAllSpecialties,
    clearError,
    resetState,
  }
})
