// Fichier déplacé dans auth/

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/components/toast/toastManager'
import { validateEmail } from '@/utils/validation'
import logo from '@images/logo.svg?raw'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'
import { useTheme } from 'vuetify'

const form = ref({
  email: '',
})
const authStore = useAuthStore()
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
  return null
}

import { useRouter } from 'vue-router'
const router = useRouter()

const onSubmit = async () => {
  const validationError = validate()
  if (validationError) {
    showToast({ message: validationError, type: 'error' })
    return
  }
  try {
    await authStore.passwordForgotten(form.value.email)
    showToast({ message: 'Un email de réinitialisation a été envoyé.', type: 'success' })
    // Redirige vers la page de saisie du code avec l'email en query
    router.push({ path: '/reset-password', query: { email: form.value.email } })
  } catch (err: any) {
    showToast({ message: authStore.error || 'Erreur lors de la demande.', type: 'error' })
  }
}
</script>


<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard class="auth-card pa-4 pt-7" max-width="448">
      <VCardItem class="justify-center">
        <RouterLink to="/" class="d-flex align-center gap-1">
          <VImg src="https://i.postimg.cc/P5MGxkBt/logo-lafaom.png" width="60" height="40" contain />
          <h2 class="font-weight-medium text-2xl">LAFAOM-MAO</h2>
        </RouterLink>
      </VCardItem>
      <VCardText class="pt-2 text-center">
        <p class="mb-0">Saisissez votre email pour recevoir votre code OTP de réinitialisation par mail.</p>
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
              <VBtn block type="submit" :loading="loading">Envoyer</VBtn>
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
