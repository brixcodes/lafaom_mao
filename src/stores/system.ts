// Store Pinia pour les services système
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { systemService } from '@/services/api/system'

export const useSystemStore = defineStore('system', () => {
  // === STATE ===
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const testResults = ref<any>(null)

  // === ACTIONS ===
  
  const testRedis = async (testNumber: number) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await systemService.getDataFromRedis(testNumber)
      testResults.value = response
      return response
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du test Redis'
      console.error('Error testing Redis:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const addDataToRedis = async (testNumber: number) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await systemService.addDataToRedis(testNumber)
      testResults.value = response
      return response
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de l\'ajout de données Redis'
      console.error('Error adding data to Redis:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const testEmail = async (email: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await systemService.testSendEmail(email)
      testResults.value = response
      return response
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du test email'
      console.error('Error testing email:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const getRoot = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await systemService.getRoot()
      return response
      
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de l\'accès à la racine'
      console.error('Error getting root:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // === ACTIONS UTILITAIRES ===
  
  const clearError = () => {
    error.value = null
  }
  
  const resetState = () => {
    isLoading.value = false
    error.value = null
    testResults.value = null
  }

  return {
    // State
    isLoading,
    error,
    testResults,

    // Actions
    testRedis,
    addDataToRedis,
    testEmail,
    getRoot,

    // Actions Utilitaires
    clearError,
    resetState,
  }
})
