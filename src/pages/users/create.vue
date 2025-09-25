<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h2 class="text-h4 font-weight-bold">
          <VIcon icon="ri-arrow-left-line" color="primary" class="me-2" @click="goBack" />
          Créer un utilisateur
        </h2>
        <p class="text-body-1 text-medium-emphasis ml-5 mt-1">
          Ajoutez un nouvel utilisateur au système
        </p>
      </div>
    </div>

    <!-- Formulaire de création -->
    <VCard>
      <VCardText>
        <VForm ref="form" @submit.prevent="handleSubmit">
          <VRow>
            <!-- Informations personnelles -->
            <VCol cols="12" md="6">
              <VTextField v-model="formData.first_name" label="Prénom" variant="outlined"
                :rules="[v => !!v || 'Le prénom est requis']" required />
            </VCol>

            <VCol cols="12" md="6">
              <VTextField v-model="formData.last_name" label="Nom" variant="outlined"
                :rules="[v => !!v || 'Le nom est requis']" required />
            </VCol>

            <VCol cols="12" md="6">
              <VTextField v-model="formData.email" label="Email" type="email" variant="outlined"
                :rules="[v => !!v || 'L\'email est requis', v => /.+@.+\..+/.test(v) || 'Email invalide']" required />
            </VCol>

            <VCol cols="12" md="6">
              <VTextField v-model="formData.password" label="Mot de passe" type="password" variant="outlined"
                :rules="[v => !!v || 'Le mot de passe est requis', v => v.length >= 6 || 'Minimum 6 caractères']"
                required />
            </VCol>

            <VCol cols="12" md="6">
              <VSelect v-model="formData.user_type" :items="userTypeOptions" label="Type d'utilisateur"
                variant="outlined" :rules="[v => !!v || 'Le type d\'utilisateur est requis']" required />
            </VCol>

            <VCol cols="12" md="6">
              <VSelect v-model="formData.status" :items="statusOptions" label="Statut" variant="outlined"
                :rules="[v => !!v || 'Le statut est requis']" required />
            </VCol>

            <VCol cols="12" md="6">
              <VSelect v-model="formData.civility" :items="civilityOptions" label="Civilité" variant="outlined" />
            </VCol>

            <VCol cols="12" md="6">
              <VTextField v-model="formData.mobile_number" label="Numéro de mobile" variant="outlined" />
            </VCol>

            <VCol cols="12" md="6">
              <VTextField v-model="formData.fix_number" label="Numéro de téléphone fixe" variant="outlined" />
            </VCol>

            <VCol cols="12" md="6">
              <VTextField v-model="formData.country_code" label="Code pays" variant="outlined" />
            </VCol>

            <VCol cols="12" md="6">
              <VTextField v-model="formData.lang" label="Langue" variant="outlined" />
            </VCol>

            <!-- Date de naissance -->
            <VCol cols="12" md="6">
              <VTextField v-model="formData.birth_date" label="Date de naissance" type="date" variant="outlined" />
            </VCol>

            <!-- Authentification à deux facteurs -->
            <VCol cols="12" md="6">
              <VSwitch v-model="formData.two_factor_enabled" label="Authentification à deux facteurs" color="primary" />
            </VCol>
          </VRow>

          <!-- Boutons d'action -->
          <div class="d-flex justify-end gap-3 mt-6">
            <VBtn color="error" variant="outlined" @click="resetForm">
              Annuler
            </VBtn>
            <VBtn type="submit" color="primary" :loading="isLoading">
              <VIcon icon="ri-save-line" class="me-2" />
              Enregistrer
            </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsers } from '@/composables/useUsers'
import { showToast } from '@/components/toast/toastManager'

const router = useRouter()
const { createUser, isLoading } = useUsers()


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
  two_factor_enabled: false,
  birth_date: null,
  fix_number: null,
  web_token: null
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


// Methods
const handleSubmit = async () => {
  const validation = await form.value?.validate()
  if (!validation?.valid) return

  try {
    console.log('🔍 Données à envoyer:', formData.value)
    await createUser(formData.value)
    showToast({
      message: 'Utilisateur créé avec succès',
      type: 'success'
    })
    router.push('/users')
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error)
    console.error('📋 Détails de l\'erreur:', error.response?.data)
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
    two_factor_enabled: false,
    birth_date: null,
    fix_number: null,
    web_token: null
  }
  form.value?.reset()
}
</script>