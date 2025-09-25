import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function useAuthGuard() {
  const router = useRouter()
  const authStore = useAuthStore()
  const isChecking = ref(false)

  // Vérification initiale de l'authentification
  const checkAuth = async () => {
    if (isChecking.value) return
    
    try {
      isChecking.value = true
      
      // Si pas de token, rediriger immédiatement
      if (!authStore.token) {
        console.log('Aucun token trouvé, redirection vers login')
        router.push('/login')
        return
      }

      // Si pas d'utilisateur mais token présent, essayer de recharger
      if (!authStore.user && authStore.token) {
        console.log('Token présent mais pas d\'utilisateur, rechargement du profil')
        await authStore.loadUserProfile()
      }

      // Vérifier si l'utilisateur est maintenant authentifié
      if (!authStore.isAuthenticated) {
        console.log('Utilisateur non authentifié après vérification, redirection vers login')
        router.push('/login')
      }
    } catch (error: any) {
      console.error('Erreur lors de la vérification d\'authentification:', error)
      
      // Si erreur 401 (Unauthorized), token invalide
      if (error.response?.status === 401) {
        console.log('Token invalide (401), redirection vers login')
        await authStore.logout()
        router.push('/login')
      } else {
        // Autres erreurs, rediriger aussi pour sécurité
        console.log('Erreur d\'authentification, redirection vers login')
        router.push('/login')
      }
    } finally {
      isChecking.value = false
    }
  }

  // Vérification au montage
  onMounted(() => {
    checkAuth()
  })

  // Watcher pour surveiller les changements d'état d'authentification
  watch(() => authStore.isAuthenticated, (newValue, oldValue) => {
    // Si l'utilisateur était authentifié et ne l'est plus
    if (oldValue === true && newValue === false) {
      console.log('État d\'authentification changé, redirection vers login')
      router.push('/login')
    }
  })

  // Watcher pour surveiller les erreurs d'authentification
  watch(() => authStore.error, (newError) => {
    if (newError) {
      // Vérifier si l'erreur concerne l'authentification
      const authErrors = ['token', 'unauthorized', 'expired', 'invalid', '401']
      const isAuthError = authErrors.some(errorType => 
        newError.toLowerCase().includes(errorType)
      )
      
      if (isAuthError) {
        console.log('Erreur d\'authentification détectée:', newError)
        router.push('/login')
      }
    }
  })

  // Watcher pour surveiller les changements de token
  watch(() => authStore.token, (newToken, oldToken) => {
    // Si le token était présent et n'est plus
    if (oldToken && !newToken) {
      console.log('Token supprimé, redirection vers login')
      router.push('/login')
    }
  })

  return {
    isChecking,
    checkAuth
  }
}
