// Fichier déplacé dans auth/

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/components/toast/toastManager'
import { validateEmail, validateRequired } from '@/utils/validation'
import { useRouter } from 'vue-router'
import logo from '@images/logo.svg?raw'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'
import { useTheme } from 'vuetify'

import { useRoute } from 'vue-router'
const route = useRoute()
const form = ref({
  email: route.query.email ? String(route.query.email) : '',
  code: '',
})
const authStore = useAuthStore()
const loading = computed(() => authStore.isLoading)
const router = useRouter()
const vuetifyTheme = useTheme()
const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light'
    ? authV1MaskLight
    : authV1MaskDark
})

const validate = () => {
  const emailCheck = validateRequired(form.value.email, 'Email')
  if (!emailCheck.valid) return emailCheck.error

  const emailFormat = validateEmail(form.value.email, 'Email')
  if (!emailFormat.valid) return emailFormat.error

  const codeCheck = validateRequired(form.value.code, 'Code')
  if (!codeCheck.valid) return codeCheck.error
  if (form.value.code.length !== 6) return 'Le code doit contenir 6 chiffres.'

  return null
}

const onSubmit = async () => {
  const validationError = validate()
  if (validationError) {
    showToast({ message: validationError, type: 'error' })
    return
  }
  try {
    await authStore.validateChangeEmail(form.value.email, form.value.code)
    showToast({ message: 'Email changé avec succès.', type: 'success' })
    // Redirige vers le profil ou la page d'accueil après succès
    router.push('/profile')
  } catch (err: any) {
    showToast({ message: authStore.error || 'Erreur lors de la validation.', type: 'error' })
  }
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard class="auth-card pa-4 pt-7" max-width="448">
      <VCardItem class="justify-center">
        <RouterLink to="/" class="d-flex align-center gap-3">
          <div class="d-flex" v-html="logo" />
          <h2 class="font-weight-medium text-2xl text-uppercase">Materio</h2>
        </RouterLink>
      </VCardItem>
      <VCardText class="pt-2">
        <h4 class="text-h4 mb-1">Valider le changement d'email</h4>
        <p class="mb-0">Saisissez le code reçu sur votre nouvel email.</p>
      </VCardText>
      <VCardText>
        <VForm @submit.prevent="onSubmit">
          <VRow>
            <VCol cols="12">
              <VTextField v-model="form.email" label="Email" type="email" :disabled="loading" prepend-inner-icon="ri-mail-line" />
            </VCol>
            <VCol cols="12">
              <VTextField v-model="form.code" label="Code reçu" maxlength="6" :disabled="loading" prepend-inner-icon="ri-shield-keyhole-line" />
            </VCol>
            <VCol cols="12">
              <VBtn block type="submit" :loading="loading">Valider</VBtn>
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
