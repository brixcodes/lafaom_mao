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
  const validationError = validate()
  if (validationError) {
    showToast({ message: validationError, type: 'error' })
    return
  }
  try {
    await authStore.validateForgottenPassword(
      form.value.email,
      form.value.code,
      form.value.password
    )
    showToast({ message: 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.', type: 'success' })
    router.push('/login')
  } catch (err: any) {
    showToast({ message: authStore.error || 'Erreur lors de la réinitialisation.', type: 'error' })
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
      <VCardText class="pt-2">
        <p class="mb-0">Saisissez le code reçu et votre nouveau mot de passe.</p>
      </VCardText>
      <VCardText>
        <VForm @submit.prevent="onSubmit">
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                label="Email"
                type="email"
                :disabled="loading"
                prepend-inner-icon="ri-mail-line"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="form.code"
                label="Code reçu par email"
                maxlength="6"
                :disabled="loading"
                prepend-inner-icon="ri-shield-keyhole-line"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Nouveau mot de passe"
                type="password"
                :disabled="loading"
                prepend-inner-icon="ri-lock-password-line"
              />
            </VCol>
            <VCol cols="12">
              <VBtn block type="submit" :loading="loading">Réinitialiser</VBtn>
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
