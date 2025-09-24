import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Specialty } from '@/types/training'
import { trainingService } from '@/services/api/training'

export const useSpecialtyStore = defineStore('specialty', () => {
  // === STATE ===
  const specialties = ref<Specialty[]>([])
  const currentSpecialty = ref<Specialty | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Pagination
  const pagination = ref({
    page: 1,
    pageSize: 20,
    total: 0
  })

  // === GETTERS ===
  const hasSpecialties = computed(() => specialties.value.length > 0)
  
  const specialtiesList = computed(() => {
    return specialties.value.map(specialty => ({
      value: specialty.id,
      label: specialty.name
    }))
  })

  // === ACTIONS ===
  const fetchSpecialties = async () => {
    try {
      isLoading.value = true
      error.value = null
      const response = await trainingService.listSpecialties({})
      specialties.value = response.data
      pagination.value.total = response.total_number || response.data.length
      return response
    } catch (err: any) {
      error.value = err.message || 'Error fetching specialties'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getSpecialtyById = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null
      const specialty = specialties.value.find(s => s.id === id)
      if (specialty) {
        currentSpecialty.value = specialty
        return specialty
      }
      // If not found in cache, fetch from server
      const response = await trainingService.listSpecialties({})
      const foundSpecialty = response.data.find((s: Specialty) => s.id === id)
      if (foundSpecialty) {
        currentSpecialty.value = foundSpecialty
        return foundSpecialty
      }
      throw new Error('Specialty not found')
    } catch (err: any) {
      error.value = err.message || 'Error fetching specialty'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createSpecialty = async (data: { name: string; description?: string }) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await trainingService.createSpecialty(data)
      specialties.value.unshift(response.data)
      return response
    } catch (err: any) {
      error.value = err.message || 'Error creating specialty'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateSpecialty = async (id: number, data: { name?: string; description?: string }) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await trainingService.updateSpecialty(id, data)
      // Update in list if present
      const index = specialties.value.findIndex(s => s.id === id)
      if (index !== -1) {
        specialties.value[index] = response.data
      }
      // Update current if it's the same
      if (currentSpecialty.value?.id === id) {
        currentSpecialty.value = response.data
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Error updating specialty'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteSpecialty = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null
      await trainingService.deleteSpecialty(id)
      specialties.value = specialties.value.filter(s => s.id !== id)
      if (currentSpecialty.value?.id === id) {
        currentSpecialty.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Error deleting specialty'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearData = () => {
    specialties.value = []
    currentSpecialty.value = null
    error.value = null
    pagination.value = { page: 1, pageSize: 20, total: 0 }
  }

  return {
    // State
    specialties,
    currentSpecialty,
    isLoading,
    error,
    pagination,
    
    // Getters
    hasSpecialties,
    specialtiesList,
    
    // Actions
    fetchSpecialties,
    getSpecialtyById,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,
    clearError,
    clearData,
  }
})
