<!-- Exemple d'utilisation de l'intégration auth dans un composant Vue -->
<template>
  <div class="auth-example">
    <!-- État de connexion -->
    <div v-if="isAuthenticated" class="user-info">
      <h2>Bienvenue, {{ userFullName }}!</h2>
      <p>Email: {{ user?.email }}</p>
      <p>Initiales: {{ userInitials }}</p>
      
      <!-- Boutons d'action -->
      <div class="actions">
        <button @click="handleLogout" :disabled="isLoading">
          {{ isLoading ? 'Déconnexion...' : 'Se déconnecter' }}
        </button>
        <button @click="handleUpdateProfile" :disabled="isLoading">
          Mettre à jour le profil
        </button>
      </div>
    </div>

    <!-- Formulaire de connexion -->
    <div v-else class="login-form">
      <h2>Connexion</h2>
      
      <!-- Formulaire de login -->
      <form v-if="!twoFactorRequired" @submit.prevent="handleLogin">
        <div>
          <label>Email:</label>
          <input v-model="loginForm.email" type="email" required />
        </div>
        <div>
          <label>Mot de passe:</label>
          <input v-model="loginForm.password" type="password" required />
        </div>
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <!-- Formulaire 2FA -->
      <form v-else @submit.prevent="handleTwoFactor">
        <h3>Authentification à deux facteurs</h3>
        <p>Un code a été envoyé à {{ twoFactorEmail }}</p>
        <div>
          <label>Code de vérification:</label>
          <input v-model="twoFactorCode" type="text" required />
        </div>
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Vérification...' : 'Vérifier' }}
        </button>
        <button type="button" @click="resetTwoFactor">
          Annuler
        </button>
      </form>

      <!-- Mot de passe oublié -->
      <div class="forgot-password">
        <button @click="showForgotPassword = !showForgotPassword">
          Mot de passe oublié?
        </button>
        
        <form v-if="showForgotPassword" @submit.prevent="handleForgotPassword">
          <div>
            <label>Email:</label>
            <input v-model="forgotEmail" type="email" required />
          </div>
          <button type="submit" :disabled="isLoading">
            Envoyer le code
          </button>
        </form>
      </div>
    </div>

    <!-- Messages d'erreur -->
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="clearError">Fermer</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import type { LoginInput, UpdateUserProfile } from '@/types/auth'

// Utilisation du composable auth
const {
  isAuthenticated,
  user,
  userFullName,
  userInitials,
  isLoading,
  error,
  twoFactorRequired,
  twoFactorEmail,
  login,
  twoFactorAuth,
  logout,
  updateProfile,
  passwordForgotten,
  clearError,
  resetTwoFactor,
  initialize,
} = useAuth()

// État local
const loginForm = reactive<LoginInput>({
  email: '',
  password: ''
})

const twoFactorCode = ref('')
const showForgotPassword = ref(false)
const forgotEmail = ref('')

// Actions
const handleLogin = async () => {
  try {
    const result = await login(loginForm)
    
    if (result.success) {
      console.log('Connexion réussie!')
    } else if (result.requiresTwoFactor) {
      console.log('2FA requis')
    }
  } catch (err) {
    console.error('Erreur de connexion:', err)
  }
}

const handleTwoFactor = async () => {
  try {
    const result = await twoFactorAuth(twoFactorCode.value)
    
    if (result.success) {
      console.log('2FA réussi!')
      twoFactorCode.value = ''
    }
  } catch (err) {
    console.error('Erreur 2FA:', err)
  }
}

const handleLogout = async () => {
  try {
    await logout()
    console.log('Déconnexion réussie!')
  } catch (err) {
    console.error('Erreur de déconnexion:', err)
  }
}

const handleUpdateProfile = async () => {
  try {
    const profileData: UpdateUserProfile = {
      first_name: user.value?.first_name || '',
      last_name: user.value?.last_name || '',
      birth_date: user.value?.birth_date || '',
      civility: user.value?.civility || '',
      mobile_number: user.value?.mobile_number || '',
      fix_number: user.value?.fix_number || '',
      two_factor_enabled: user.value?.two_factor_enabled || false,
      lang: user.value?.lang || 'fr'
    }
    
    await updateProfile(profileData)
    console.log('Profil mis à jour!')
  } catch (err) {
    console.error('Erreur de mise à jour:', err)
  }
}

const handleForgotPassword = async () => {
  try {
    await passwordForgotten(forgotEmail.value)
    console.log('Code envoyé!')
    showForgotPassword.value = false
    forgotEmail.value = ''
  } catch (err) {
    console.error('Erreur mot de passe oublié:', err)
  }
}

// Initialisation
onMounted(async () => {
  await initialize()
})
</script>

<style scoped>
.auth-example {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.user-info {
  text-align: center;
}

.actions {
  margin-top: 20px;
}

.actions button {
  margin: 0 10px;
  padding: 10px 20px;
}

.login-form {
  text-align: center;
}

.login-form form {
  margin: 20px 0;
}

.login-form div {
  margin: 10px 0;
}

.login-form label {
  display: block;
  margin-bottom: 5px;
}

.login-form input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-form button {
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
}

.login-form button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}

.forgot-password {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ccc;
}
</style>
