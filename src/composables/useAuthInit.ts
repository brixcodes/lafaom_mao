// Composable pour initialiser l'authentification au démarrage
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

export const useAuthInit = () => {
  const authStore = useAuthStore()

  const initializeAuth = async () => {
    // Vérifier si l'authentification est déjà initialisée
    if (authStore.isInitialized) {
      return
    }

    // Initialiser l'authentification
    await authStore.initializeAuth()
  }

  // Initialiser au montage du composant
  onMounted(() => {
    initializeAuth()
  })

  return {
    initializeAuth
  }
}
