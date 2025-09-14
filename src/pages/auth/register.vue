// Fichier déplacé dans auth/

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import logo from '@images/logo.svg?raw'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/components/toast/toastManager'
import { validateRequired, validateEmail, validateMinLength } from '@/utils/validation'

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  privacyPolicies: false,
})
const isPasswordVisible = ref(false)
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
  const firstNameCheck = validateRequired(form.value.first_name, 'Prénom')
  if (!firstNameCheck.valid) return firstNameCheck.error

  const lastNameCheck = validateRequired(form.value.last_name, 'Nom')
  if (!lastNameCheck.valid) return lastNameCheck.error

  const emailCheck = validateEmail(form.value.email, 'Email')
  if (!emailCheck.valid) return emailCheck.error

  const passwordCheck = validateMinLength(form.value.password, 8, 'Mot de passe')
  if (!passwordCheck.valid) return passwordCheck.error

  if (!form.value.privacyPolicies) return 'Vous devez accepter la politique de confidentialité.'

  return null
}

const onSubmit = async () => {
  const validationError = validate()
  if (validationError) {
    showToast({ message: validationError, type: 'error' })
    return
  }
  try {
    await authStore.register({
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      email: form.value.email,
      password: form.value.password,
      status: 'active',
      lang: 'fr',
      user_type: 'user',
      two_factor_enabled: false,
    })
    showToast({ message: 'Inscription réussie. Connectez-vous.', type: 'success' })
    router.push('/login')
  } catch (err: any) {
    showToast({ message: authStore.error || 'Erreur lors de l\'inscription', type: 'error' })
  }
}
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->

  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
    >
      <VCardItem class="justify-center">
        <RouterLink
          to="/"
          class="d-flex align-center gap-3"
        >
          <!-- eslint-disable vue/no-v-html -->
          <div
            class="d-flex"
            v-html="logo"
          />
          <h2 class="font-weight-medium text-2xl text-uppercase">
            Materio
          </h2>
        </RouterLink>
      </VCardItem>

      <VCardText class="pt-2">
        <h4 class="text-h4 mb-1">
          Adventure starts here 🚀
        </h4>
        <p class="mb-0">
          Make your app management easy and fun!
        </p>
      </VCardText>

      <VCardText>
  <VForm @submit.prevent="onSubmit">
          <VRow>
            <!-- Prénom -->
            <VCol cols="12">
              <VTextField
                v-model="form.first_name"
                label="Prénom"
                placeholder="Jean"
                :disabled="loading"
                prepend-inner-icon="ri-user-line"
              />
            </VCol>
            <!-- Nom -->
            <VCol cols="12">
              <VTextField
                v-model="form.last_name"
                label="Nom"
                placeholder="Dupont"
                :disabled="loading"
                prepend-inner-icon="ri-user-line"
              />
            </VCol>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                label="Email"
                placeholder="jean.dupont@email.com"
                type="email"
                :disabled="loading"
                prepend-inner-icon="ri-mail-line"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Mot de passe"
                placeholder="················"
                :type="isPasswordVisible ? 'text' : 'password'"
                autocomplete="password"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
                :disabled="loading"
                prepend-inner-icon="ri-lock-password-line"
              />
              <div class="d-flex align-center my-6">
                <VCheckbox
                  id="privacy-policy"
                  v-model="form.privacyPolicies"
                  inline
                  :disabled="loading"
                />
                <VLabel
                  for="privacy-policy"
                  style="opacity: 1;"
                >
                  <span class="me-1">J'accepte la</span>
                  <a
                    href="javascript:void(0)"
                    class="text-primary"
                  >politique de confidentialité</a>
                </VLabel>
              </div>

              <VBtn
                block
                type="submit"
                :loading="loading"
                :disabled="loading"
              >
                S'inscrire
              </VBtn>
            </VCol>

            <!-- login instead -->
            <VCol
              cols="12"
              class="text-center text-base"
            >
              <span>Déjà un compte ?</span>
              <RouterLink
                class="text-primary ms-2"
                to="/login"
              >
                Se connecter
              </RouterLink>
            </VCol>

            <VCol
              cols="12"
              class="d-flex align-center"
            >
              <VDivider />
              <span class="mx-4">or</span>
              <VDivider />
            </VCol>

            <!-- auth providers -->
            <VCol
              cols="12"
              class="text-center"
            >
              <AuthProvider />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <VImg
      class="auth-footer-start-tree d-none d-md-block"
      :src="authV1Tree"
      :width="250"
    />

    <VImg
      :src="authV1Tree2"
      class="auth-footer-end-tree d-none d-md-block"
      :width="350"
    />

    <!-- bg img -->
    <VImg
      class="auth-footer-mask d-none d-md-block"
      :src="authThemeMask"
    />
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
