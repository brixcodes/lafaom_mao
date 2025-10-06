// Fichier déplacé dans auth/

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import logo from '@images/logo.svg?raw'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/components/toast/toastManager'
import { validateEmail, validateMinLength, validateRequired } from '@/utils/validation'


const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const formRef = ref()
const form = ref({
  email: route.query.email ? String(route.query.email) : '',
  code: '',
  password: '',
})
const loading = computed(() => authStore.isLoading)
const vuetifyTheme = useTheme()
const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light'
    ? authV1MaskLight
    : authV1MaskDark
})

const validate = () => {
  const emailCheck = validateEmail(form.value.email, 'Email')
  if (!emailCheck.valid) return emailCheck.error

  const codeRequired = validateRequired(form.value.code, 'Code')
  if (!codeRequired.valid) return codeRequired.error
  if (form.value.code.length !== 6) return 'Le code doit contenir 6 chiffres.'

  const passCheck = validateMinLength(form.value.password, 8, 'Nouveau mot de passe')
  if (!passCheck.valid) return passCheck.error

  return null
}

const onSubmit = async () => {
  console.log('🔄 Tentative de réinitialisation du mot de passe...')
  console.log('🔄 Fonction onSubmit appelée !')
  
  // Validation du formulaire Vuetify
  const { valid } = await formRef.value.validate()
  if (!valid) {
    console.log('❌ Formulaire invalide')
    showToast({ message: 'Veuillez corriger les erreurs du formulaire', type: 'error' })
    return
  }
  
  // Validation personnalisée
  const validationError = validate()
  if (validationError) {
    console.log('❌ Erreur de validation:', validationError)
    showToast({ message: validationError, type: 'error' })
    return
  }
  
  console.log('📧 Données du formulaire:', {
    email: form.value.email,
    code: form.value.code,
    password: '***'
  })
  
  try {
    console.log('🔄 Appel de validateForgottenPassword...')
    await authStore.validateForgottenPassword(
      form.value.email,
      form.value.code,
      form.value.password
    )
    console.log('✅ Réinitialisation réussie')
    showToast({ message: 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.', type: 'success' })
    router.push('/login')
  } catch (err: any) {
    console.error('❌ Erreur lors de la réinitialisation:', err)
    console.error('❌ Détails de l\'erreur:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    })
    
    const errorMessage = err.response?.data?.message || authStore.error || 'Erreur lors de la réinitialisation.'
    showToast({ message: errorMessage, type: 'error' })
  }
}
</script>


<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard class="auth-card pa-4 pt-7" max-width="448">
      <VCardItem class="justify-center">
        <RouterLink to="/" class="d-flex align-center gap-1">
          <VImg src="logo_lafaom.png" width="60" height="40" contain />
          <h2 class="font-weight-medium text-2xl">LAFAOM-MAO</h2>
        </RouterLink>
      </VCardItem>
      <VCardText class="pt-2 text-center">
        <p class="mb-0">Saisissez le code reçu et votre nouveau mot de passe.</p>
      </VCardText>
      <VCardText>
        <VForm ref="formRef" @submit.prevent="onSubmit">
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                label="Email"
                type="email"
                :disabled="loading"
                prepend-inner-icon="ri-mail-line"
                :rules="[v => !!v || 'Email requis']"
                required
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="form.code"
                label="Code reçu par email"
                maxlength="5"
                :disabled="loading"
                prepend-inner-icon="ri-shield-keyhole-line"
                :rules="[v => !!v || 'Code requis', v => v.length === 5 || 'Code doit contenir 5 caractères.']"
                required
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Nouveau mot de passe"
                type="password"
                :disabled="loading"
                prepend-inner-icon="ri-lock-password-line"
                :rules="[v => !!v || 'Mot de passe requis', v => v.length >= 8 || 'Minimum 8 caractères']"
                required
              />
            </VCol>
            <VCol cols="12">
              <VBtn 
                block 
                type="submit" 
                :loading="loading"
                :disabled="loading"
                color="primary"
              >
                {{ loading ? 'Réinitialisation...' : 'Réinitialiser' }}
              </VBtn>
            </VCol>
            <VCol cols="12" class="text-center mt-2">
              <RouterLink to="/login" class="text-primary">
                Revenir à la connexion
              </RouterLink>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
    <VImg class="auth-footer-start-tree d-none d-md-block" :src="authV1Tree" :width="250" />
    <VImg :src="authV1Tree2" class="auth-footer-end-tree d-none d-md-block" :width="350" />
    <VImg class="auth-footer-mask d-none d-md-block" :src="authThemeMask" />
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
