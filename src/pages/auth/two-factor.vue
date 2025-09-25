<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from 'vuetify'
import logo from '@images/logo.svg?raw'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/api/auth'
import { showToast } from '@/components/toast/toastManager'
import { validateMinLength } from '@/utils/validation'

const form = ref({
  email: '',
  code: '',
})
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const loading = ref(false)
const resendLoading = ref(false)
const countdown = ref(0)
const canResend = ref(true)
const vuetifyTheme = useTheme()
const authThemeMask = computed(() =>
  vuetifyTheme.global.name.value === 'light' ? authV1MaskLight : authV1MaskDark
)

// Récupérer l'email depuis les paramètres de route
onMounted(() => {
  if (route.query.email) {
    form.value.email = route.query.email as string
  }
  // Démarrer le compte à rebours
  startCountdown()
})

// Compte à rebours pour le renvoi de code
const startCountdown = () => {
  countdown.value = 60 // 60 secondes
  canResend.value = false
  
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      canResend.value = true
    }
  }, 1000)
}

// Formatage du temps
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const codeRules = [
  (v: string) => {
    if (!v) return 'Le code est requis'
    if (v.length < 6) return 'Le code doit contenir 6 chiffres'
    if (!/^\d{6}$/.test(v)) return 'Le code doit contenir uniquement des chiffres'
    return true
  },
]

const validate = () => {
  const codeCheck = validateMinLength(form.value.code, 6, 'Code de vérification')
  if (!codeCheck.valid) return codeCheck.error

  return null
}

const onSubmit = async () => {
  const validationError = validate()
  if (validationError) {
    showToast({ message: validationError, type: 'error' })
    return
  }
  
  try {
    loading.value = true
    const result = await authService.twoFactorToken({
      email: form.value.email,
      code: form.value.code,
    })
    
    if (result) {
      showToast({ message: 'Authentification à deux facteurs réussie.', type: 'success' })
      // Mettre à jour le store avec les nouvelles données
      await authStore.twoFactorAuth(form.value.code)
      router.push('/dashboard')
    }
  } catch (err: any) {
    console.error('Erreur 2FA:', err)
    showToast({ 
      message: err.response?.data?.detail?.message || 'Code de vérification invalide', 
      type: 'error' 
    })
  } finally {
    loading.value = false
  }
}

const resendCode = async () => {
  if (!canResend.value) return
  
  try {
    resendLoading.value = true
    // TODO: Implémenter la logique de renvoi de code
    // await authService.resendTwoFactorCode({ email: form.value.email })
    showToast({ message: 'Code de vérification renvoyé.', type: 'success' })
    startCountdown() // Redémarrer le compte à rebours
  } catch (err: any) {
    showToast({ message: 'Erreur lors du renvoi du code', type: 'error' })
  } finally {
    resendLoading.value = false
  }
}

const handleCodeInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, '') // Ne garder que les chiffres
  form.value.code = value
  
  // Auto-soumettre si le code fait 6 caractères
  if (value.length === 6) {
    setTimeout(() => {
      onSubmit()
    }, 500)
  }
}

const goBack = () => {
  router.push('/login')
}
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard class="auth-card pa-4 pt-7" max-width="448">
      <VCardItem class="justify-center">
        <RouterLink to="/" class="d-flex align-center gap-1">
          <VImg src="logo_lafaom.png" width="60" height="40" contain />
          <h2 class="font-weight-medium text-2xl">LAFAOM-MAO</h2>
        </RouterLink>
      </VCardItem>

      <VCardText class="pt-2 text-center">
        <div class="d-flex justify-center mb-4">
          <VAvatar size="64" color="primary" variant="tonal">
            <VIcon size="32" icon="ri-shield-check-line" />
          </VAvatar>
        </div>
        <h4 class="text-h4 mb-1">
          Authentification à deux facteurs 🔐
        </h4>
        <p class="mb-0">
          Entrez le code de vérification envoyé à votre adresse email
        </p>
        <p class="text-caption text-medium-emphasis mt-2">
          {{ form.email }}
        </p>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="onSubmit">
          <VRow>
            <!-- Code de vérification -->
            <VCol cols="12">
              <VTextField 
                v-model="form.code" 
                label="Code de vérification" 
                type="text"
                placeholder="Entrez le code à 6 chiffres"
                prepend-inner-icon="ri-shield-keyhole-line"
                :disabled="loading" 
                :rules="codeRules" 
                autocomplete="one-time-code"
                maxlength="6"
                class="text-center code-input"
                style="font-size: 1.5rem; letter-spacing: 0.5rem;"
                @input="handleCodeInput"
              />
            </VCol>

            <!-- Informations sur le code -->
            <VCol cols="12">
              <VAlert type="info" variant="tonal" class="mb-4">
                <template #prepend>
                  <VIcon icon="ri-information-line" />
                </template>
                <div class="text-body-2">
                  <div class="font-weight-medium mb-1">Code de vérification</div>
                  <div>Vérifiez votre boîte email et entrez le code à 6 chiffres que nous avons envoyé.</div>
                </div>
              </VAlert>
            </VCol>

            <!-- Actions -->
            <VCol cols="12">
              <div class="d-flex flex-column gap-3">
                <!-- Bouton de soumission -->
                <VBtn 
                  block 
                  type="submit" 
                  :loading="loading" 
                  :disabled="loading || !form.code || form.code.length < 6"
                  color="primary"
                  size="large"
                >
                  <VIcon icon="ri-shield-check-line" class="me-2" />
                  Vérifier le code
                </VBtn>

                <!-- Bouton de renvoi -->
                <VBtn 
                  block 
                  variant="outlined" 
                  :loading="resendLoading" 
                  :disabled="!canResend || resendLoading"
                  @click="resendCode"
                  color="secondary"
                >
                  <VIcon icon="ri-refresh-line" class="me-2" />
                  <span v-if="!canResend">Renvoyer le code</span>
                  <span v-else>Renvoyer dans {{ formatTime(countdown) }}</span>
                </VBtn>

                <!-- Bouton retour -->
                <VBtn 
                  block 
                  variant="text" 
                  :disabled="loading"
                  @click="goBack"
                  color="medium-emphasis"
                >
                  <VIcon icon="ri-arrow-left-line" class="me-2" />
                  Retour à la connexion
                </VBtn>
              </div>
            </VCol>

            <!-- Aide -->
            <VCol cols="12">
              <div class="text-center">
                <p class="text-body-2 text-medium-emphasis mb-2">
                  Vous ne recevez pas le code ?
                </p>
                <div class="d-flex justify-center gap-4">
                  <VBtn variant="text" size="small" color="primary">
                    Vérifier les spams
                  </VBtn>
                  <VBtn variant="text" size="small" color="primary">
                    Contacter le support
                  </VBtn>
                </div>
              </div>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <!-- Images de fond -->
    <VImg class="auth-footer-start-tree d-none d-md-block" :src="authV1Tree" :width="250" />
    <VImg :src="authV1Tree2" class="auth-footer-end-tree d-none d-md-block" :width="350" />
    <!-- bg img -->
    <VImg class="auth-footer-mask d-none d-md-block" :src="authThemeMask" />
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";

// Styles personnalisés pour la page 2FA
.auth-card {
  .code-input {
    .v-field__input {
      text-align: center;
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: 0.5rem;
      font-family: 'Courier New', monospace;
    }
    
    .v-field__outline {
      border-radius: 12px;
    }
  }
}

// Animation pour l'avatar
.v-avatar {
  animation: pulse 2s infinite;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary))) !important;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(var(--v-theme-primary), 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0);
  }
}

// Animation pour les boutons
.v-btn {
  transition: all 0.3s ease;
  border-radius: 8px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
}

// Animation pour l'alerte
.v-alert {
  animation: slideInUp 0.5s ease-out;
  border-radius: 12px;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Animation pour le compte à rebours
.countdown-text {
  animation: fadeInOut 1s ease-in-out infinite;
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

// Animation pour le champ de code
.code-input {
  .v-field__input {
    transition: all 0.3s ease;
  }
  
  &:focus-within {
    .v-field__outline {
      border-width: 2px;
      border-color: rgb(var(--v-theme-primary));
    }
  }
}

// Animation d'entrée pour la carte
.auth-card {
  animation: slideInFromTop 0.6s ease-out;
}

@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Animation pour les boutons d'aide
.v-btn.v-btn--variant-text {
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(var(--v-theme-primary), 0.08);
    transform: scale(1.02);
  }
}

// Responsive design
@media (max-width: 600px) {
  .auth-card {
    margin: 0 16px;
  }
  
  .code-input .v-field__input {
    font-size: 1.2rem;
    letter-spacing: 0.3rem;
  }
}
</style>