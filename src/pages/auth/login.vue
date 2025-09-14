<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import logo from '@images/logo.svg?raw'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/components/toast/toastManager'
import { validateEmail, validateMinLength } from '@/utils/validation'

const form = ref({
  email: '',
  password: '',
  remember: false,
})
const isPasswordVisible = ref(false)
const router = useRouter()
const authStore = useAuthStore()
const loading = computed(() => authStore.isLoading)
const vuetifyTheme = useTheme()
const authThemeMask = computed(() =>
  vuetifyTheme.global.name.value === 'light' ? authV1MaskLight : authV1MaskDark
)

const emailRules = [
  (v: string) => {
    const res = validateEmail(v, 'Email')
    return res.valid ? true : res.error
  },
]
const passwordRules = [
  (v: string) => {
    const res = validateMinLength(v, 5, 'Mot de passe')
    return res.valid ? true : res.error
  },
]

const validate = () => {
  const emailCheck = validateEmail(form.value.email, 'Email')
  if (!emailCheck.valid) return emailCheck.error

  const passCheck = validateMinLength(form.value.password, 5, 'Mot de passe')
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
    const result = await authStore.login({
      email: form.value.email,
      password: form.value.password,
    })
    
    if (result.success) {
      showToast({ message: 'Connexion réussie.', type: 'success' })
      router.push('/dashboard')
    } else if (result.requiresTwoFactor) {
      showToast({ message: 'Vérification 2FA requise.', type: 'info' })
      router.push({ path: '/two-factor', query: { email: form.value.email } })
    }
  } catch (err: any) {
    showToast({ message: authStore.error || 'Erreur de connexion', type: 'error' })
  }
}
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->

  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard class="auth-card pa-4 pt-7" max-width="448">
      <VCardItem class="justify-center">
        <RouterLink to="/" class="d-flex align-center gap-3">
          <!-- eslint-disable vue/no-v-html -->
          <div class="d-flex" v-html="logo" />
          <h2 class="font-weight-medium text-2xl text-uppercase">
            Materio
          </h2>
        </RouterLink>
      </VCardItem>

      <VCardText class="pt-2 text-center">
        <h4 class="text-h4 mb-1">
          Bienvenue sur Materio ! 👋🏻
        </h4>
        <p class="mb-0">
          Connectez-vous à votre compte pour commencer l'aventure
        </p>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="onSubmit">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField v-model="form.email" label="Email" type="email" prepend-inner-icon="ri-mail-line"
                :disabled="loading" :rules="emailRules" autocomplete="email" />
            </VCol>

            <!-- password -->
            <VCol cols="12">

              <VTextField v-model="form.password" label="Mot de passe" placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'" autocomplete="current-password"
                prepend-inner-icon="ri-lock-password-line"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible" :disabled="loading"
                :rules="passwordRules" />

              <!-- remember me checkbox -->
              <div class="d-flex align-center justify-space-between flex-wrap my-6">
                <VCheckbox v-model="form.remember" label="Se souvenir de moi" />

                <RouterLink to="/forgot-password" class="text-primary">
                  Mot de passe oublié ?
                </RouterLink>
              </div>

              <!-- login button -->
              <VBtn block type="submit" :loading="loading" :disabled="loading">
                Connexion
              </VBtn>

            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <VImg class="auth-footer-start-tree d-none d-md-block" :src="authV1Tree" :width="250" />
    <VImg :src="authV1Tree2" class="auth-footer-end-tree d-none d-md-block" :width="350" />
    <!-- bg img -->
    <VImg class="auth-footer-mask d-none d-md-block" :src="authThemeMask" />
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
