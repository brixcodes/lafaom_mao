<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h2 class="text-h4 font-weight-bold">Créer un utilisateur</h2>
        <p class="text-body-1 text-medium-emphasis">
          Ajoutez un nouvel utilisateur au système
        </p>
      </div>
      <VBtn
        color="info"
        variant="outlined"
        to="/users"
      >
        <VIcon icon="ri-arrow-left-line" class="me-2" />
        Retour à la liste
      </VBtn>
    </div>

    <!-- Formulaire de création -->
    <VCard>
      <VCardTitle>
        <VIcon icon="ri-user-add-line" class="me-2" />
        Informations de l'utilisateur
      </VCardTitle>
      
      <VCardText>
        <VForm ref="form" @submit.prevent="handleSubmit">
          <VRow>
            <!-- Informations personnelles -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.first_name"
                label="Prénom *"
                variant="outlined"
                :rules="[v => !!v || 'Le prénom est requis']"
                required
              />
            </VCol>
            
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.last_name"
                label="Nom *"
                variant="outlined"
                :rules="[v => !!v || 'Le nom est requis']"
                required
              />
            </VCol>
            
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.email"
                label="Email *"
                type="email"
                variant="outlined"
                :rules="[v => !!v || 'L\'email est requis', v => /.+@.+\..+/.test(v) || 'Email invalide']"
                required
              />
            </VCol>
            
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.password"
                label="Mot de passe *"
                type="password"
                variant="outlined"
                :rules="[v => !!v || 'Le mot de passe est requis', v => v.length >= 6 || 'Minimum 6 caractères']"
                required
              />
            </VCol>
            
            <VCol cols="12" md="6">
              <VSelect
                v-model="formData.user_type"
                :items="userTypeOptions"
                label="Type d'utilisateur *"
                variant="outlined"
                :rules="[v => !!v || 'Le type d\'utilisateur est requis']"
                required
              />
            </VCol>
            
            <VCol cols="12" md="6">
              <VSelect
                v-model="formData.status"
                :items="statusOptions"
                label="Statut *"
                variant="outlined"
                :rules="[v => !!v || 'Le statut est requis']"
                required
              />
            </VCol>
            
            <VCol cols="12" md="6">
              <VSelect
                v-model="formData.civility"
                :items="civilityOptions"
                label="Civilité"
                variant="outlined"
              />
            </VCol>
            
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.mobile_number"
                label="Numéro de téléphone"
                variant="outlined"
              />
            </VCol>
            
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.country_code"
                label="Code pays"
                variant="outlined"
                placeholder="ex: CM"
              />
            </VCol>
            
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.lang"
                label="Langue"
                variant="outlined"
                placeholder="ex: fr"
              />
            </VCol>
            
            <VCol cols="12" md="6">
              <VSwitch
                v-model="formData.two_factor_enabled"
                label="Authentification à deux facteurs"
                color="primary"
              />
            </VCol>
          </VRow>
          
          <!-- Actions -->
          <VRow class="mt-4">
            <VCol cols="12">
              <div class="d-flex gap-3 justify-end">
                <VBtn
                  color="secondary"
                  variant="outlined"
                  @click="resetForm"
                  :disabled="isLoading"
                >
                  <VIcon icon="ri-refresh-line" class="me-1" />
                  Réinitialiser
                </VBtn>
                
                <VBtn
                  color="primary"
                  type="submit"
                  :loading="isLoading"
                  :disabled="!isFormValid"
                >
                  <VIcon icon="ri-save-line" class="me-1" />
                  Créer l'utilisateur
                </VBtn>
              </div>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUsers } from '@/composables/useUsers'
import { usePermissions } from '@/composables/usePermissions'
import { showToast } from '@/components/toast/toastManager'

const router = useRouter()
const { createUser, isLoading } = useUsers()

// Permissions
const { canCreateUsers } = usePermissions()

// Form data
const formData = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  user_type: '',
  status: 'active',
  civility: '',
  mobile_number: '',
  country_code: '',
  lang: 'fr',
  two_factor_enabled: false
})

// Form ref
const form = ref()

// Options
const userTypeOptions = [
  { title: 'Admin', value: 'admin' },
  { title: 'Staff', value: 'staff' },
  { title: 'Teacher', value: 'teacher' },
  { title: 'Student', value: 'student' }
]

const statusOptions = [
  { title: 'Actif', value: 'active' },
  { title: 'Inactif', value: 'inactive' },
  { title: 'Bloqué', value: 'blocked' }
]

const civilityOptions = [
  { title: 'Monsieur', value: 'Mr' },
  { title: 'Madame', value: 'Mme' },
  { title: 'Mademoiselle', value: 'Mlle' }
]

// Computed
const isFormValid = computed(() => {
  return formData.value.first_name &&
         formData.value.last_name &&
         formData.value.email &&
         formData.value.password &&
         formData.value.user_type &&
         formData.value.status
})

// Methods
const handleSubmit = async () => {
  const validation = await form.value?.validate()
  if (!validation?.valid) return

  // Vérifier les permissions
  if (!canCreateUsers.value) {
    showToast({
      message: 'Vous n\'avez pas les permissions nécessaires pour créer un utilisateur',
      type: 'error'
    })
    return
  }

  try {
    await createUser(formData.value)
    showToast({
      message: 'Utilisateur créé avec succès',
      type: 'success'
    })
    router.push('/users')
  } catch (error) {
    console.error('Erreur lors de la création:', error)
    showToast({
      message: 'Erreur lors de la création de l\'utilisateur',
      type: 'error'
    })
  }
}

const resetForm = () => {
  formData.value = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    user_type: '',
    status: 'active',
    civility: '',
    mobile_number: '',
    country_code: '',
    lang: 'fr',
    two_factor_enabled: false
  }
  form.value?.reset()
}
</script>