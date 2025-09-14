// Fichier déplacé dans auth/


<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/components/toast/toastManager'
import { validateRequired } from '@/utils/validation'
import logo from '@images/logo.svg?raw'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'
import { useTheme } from 'vuetify'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const form = ref({
  code: '',
})
const email = computed(() => route.query.email ? String(route.query.email) : '')
const loading = computed(() => authStore.isLoading)
const vuetifyTheme = useTheme()
const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light'
    ? authV1MaskLight
    : authV1MaskDark
})

const validate = () => {
  const emailCheck = validateRequired(email.value, 'Email')
  if (!emailCheck.valid) return emailCheck.error

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
    await authStore.twoFactorAuth(form.value.code)
    showToast({ message: 'Authentification à deux facteurs réussie.', type: 'success' })
    router.push('/dashboard')
  } catch (err: any) {
    showToast({ message: authStore.error || 'Code invalide.', type: 'error' })
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
      <VCardText class="pt-2 text-center">
        <h4 class="text-h4 mb-1">Vérification 2FA</h4>
        <p class="mb-0">Saisissez le code reçu pour valider votre connexion.</p>
      </VCardText>
      <VCardText>
  <VForm @submit.prevent="onSubmit">
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="form.code"
                label="Code 2FA"
                maxlength="6"
                :disabled="loading"
                prepend-inner-icon="ri-shield-keyhole-line"
              />
            </VCol>
            <VCol cols="12">
              <VBtn block type="submit" :loading="loading" :disabled="loading">Valider</VBtn>
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
