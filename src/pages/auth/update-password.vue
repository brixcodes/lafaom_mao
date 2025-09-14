// Fichier déplacé dans auth/

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/components/toast/toastManager'
import { validateMinLength, validateRequired } from '@/utils/validation'
import logo from '@images/logo.svg?raw'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'

const form = ref({
  password: '',
  new_password: '',
})

const router = useRouter()
const authStore = useAuthStore()
const loading = computed(() => authStore.isLoading)
const vuetifyTheme = useTheme()
const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light'
    ? authV1MaskLight
    : authV1MaskDark
})

const validate = () => {
  const passCheck = validateRequired(form.value.password, 'Mot de passe actuel')
  if (!passCheck.valid) {
    return passCheck.error
  }

  const newPassCheck = validateMinLength(form.value.new_password, 8, 'Nouveau mot de passe')
  if (!newPassCheck.valid) {
    return newPassCheck.error
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
    await authStore.updatePassword(form.value.password, form.value.new_password)
    showToast({ message: 'Mot de passe modifié avec succès.', type: 'success' })
    router.push('/dashboard')
  } catch (err: any) {
    showToast({ message: authStore.error || 'Erreur lors du changement de mot de passe.', type: 'error' })
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
        <h4 class="text-h4 mb-1">Changer le mot de passe</h4>
        <p class="mb-0">Saisissez votre mot de passe actuel et le nouveau mot de passe.</p>
      </VCardText>
      <VCardText>
        <VForm @submit.prevent="onSubmit">
          <VRow>
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
              <VTextField
                v-model="form.new_password"
                label="Nouveau mot de passe"
                type="password"
                :disabled="loading"
                prepend-inner-icon="ri-lock-unlock-line"
              />
            </VCol>
            <VCol cols="12">
              <VBtn block type="submit" :loading="loading" :disabled="loading">Changer</VBtn>
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
