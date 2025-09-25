// Fichier déplacé dans auth/

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/components/toast/toastManager'
import { validateEmail, validateRequired } from '@/utils/validation'
import logo from '@images/logo.svg?raw'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'

const form = ref({
  email: '',
  password: '',
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
  const emailCheck = validateEmail(form.value.email, 'Nouvel email')
  if (!emailCheck.valid) {
    return emailCheck.error
  }

  const passCheck = validateRequired(form.value.password, 'Mot de passe')
  if (!passCheck.valid) {
    return passCheck.error
  }

  return null
}

const onSubmit = async () => {
  const validationError = validate()
  if (validationError) {
    showToast({ message: validationError, type: 'error' })
    return
  }
  try {
    await authStore.changeEmail(form.value.email, form.value.password)
    showToast({ message: 'Un code de confirmation a été envoyé à votre nouvel email.', type: 'success' })
    // Redirige vers la page de validation du code avec l'email en query
    router.push({ path: '/validate-change-email', query: { email: form.value.email } })
  } catch (err: any) {
    showToast({ message: authStore.error || "Erreur lors du changement d'email.", type: 'error' })
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
        <p class="mb-0">Saisissez votre nouvel email et votre mot de passe actuel.</p>
      </VCardText>
      <VCardText>
        <VForm @submit.prevent="onSubmit">
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                label="Nouvel email"
                type="email"
                :disabled="loading"
                prepend-inner-icon="ri-mail-edit-line"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Mot de passe actuel"
                type="password"
                :disabled="loading"
                prepend-inner-icon="ri-lock-password-line"
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
