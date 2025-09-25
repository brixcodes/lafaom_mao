<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsers } from '@/composables/useUsers'
import { confirmAction } from '@/utils/confirm'
import { showToast } from '@/components/toast/toastManager'

const router = useRouter()
const route = useRoute()
const { loadUser, updateUser, isLoading } = useUsers()

const userId = route.params.id as string
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

// Form ref
const form = ref()

const goBack = () => {
  router.push('/users')
}

const fetchUser = async () => {
  try {
    console.log('🔍 Chargement de l\'utilisateur ID:', userId)
    const user = await loadUser(userId)
    console.log('✅ Utilisateur chargé:', user)

    // Mapper les données de l'utilisateur vers le formulaire
    formData.value = {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      password: '', // Ne pas pré-remplir le mot de passe
      user_type: user.user_type || '',
      status: user.status || 'active',
      civility: user.civility || '',
      mobile_number: user.mobile_number || '',
      country_code: user.country_code || '',
      lang: user.lang || 'fr',
      two_factor_enabled: user.two_factor_enabled || false,
      birth_date: user.birth_date || null,
      fix_number: user.fix_number || null,
      web_token: user.web_token || null
    }

    console.log('📋 Données du formulaire:', formData.value)
  } catch (err) {
    console.error('❌ Erreur lors du chargement de l\'utilisateur:', err)
    showToast({
      message: 'Erreur lors du chargement de l\'utilisateur.',
      type: 'error'
    })
  }
}

onMounted(async () => {
  await fetchUser()
})


const handleSubmit = async () => {
  const validation = await form.value?.validate()
  if (!validation?.valid) return

  const confirmed = await confirmAction({
    method: 'put',
    title: 'Êtes vous sûres?',
    text: `Souhaitez-vous réellement enregistrer les modifications pour ${formData.value.first_name} ${formData.value.last_name} ?`,
    confirmButtonText: '<span style="color:white">Enregistrer</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })

  if (!confirmed) return

  try {
    console.log('🔍 Données à envoyer:', formData.value)
    await updateUser(userId, formData.value)
    showToast({
      message: 'Utilisateur modifié avec succès',
      type: 'success'
    })
    router.push('/users')
  } catch (error) {
    console.error('❌ Erreur lors de la modification:', error)
    console.error('📋 Détails de l\'erreur:', error.response?.data)
    showToast({
      message: 'Erreur lors de la modification de l\'utilisateur',
      type: 'error'
    })
  }
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h2 class="text-h4 font-weight-bold">
          <VIcon icon="ri-arrow-left-line" variant="outlined" color="primary" class="mr-3" @click="goBack" />
          Modifier un utilisateur
        </h2>
        <p class="text-body-1 text-medium-emphasis ml-5 mt-1">
          Modifiez les informations de l'utilisateur
        </p>
      </div>
    </div>

    <!-- Formulaire de modification -->
    <VCard>

      <VCardText>
        <VForm ref="form" @submit.prevent="handleSubmit">
          <VRow>
            <!-- Informations personnelles -->
            <VCol cols="12" md="6">
              <VTextField v-model="formData.first_name" label="Prénom *" prepend-inner-icon="ri-user-line"
                variant="outlined" :rules="[v => !!v || 'Le prénom est requis']" required />
            </VCol>

            <VCol cols="12" md="6">
              <VTextField v-model="formData.last_name" label="Nom *" prepend-inner-icon="ri-user-line"
                variant="outlined" :rules="[v => !!v || 'Le nom est requis']" required />
            </VCol>

            <VCol cols="12" md="6">
              <VTextField v-model="formData.email" label="Email *" type="email" prepend-inner-icon="ri-mail-line"
                variant="outlined"
                :rules="[v => !!v || 'L\'email est requis', v => /.+@.+\..+/.test(v) || 'Email invalide']" required />
            </VCol>

            <VCol cols="12" md="6">
              <VTextField v-model="formData.password" label="Mot de passe" type="password"
                prepend-inner-icon="ri-lock-line" variant="outlined"
                hint="Laissez vide pour ne pas changer le mot de passe" persistent-hint />
            </VCol>

            <!-- Civilité -->
            <VCol cols="12" md="6">
              <VSelect v-model="formData.civility" :items="civilityOptions" label="Civilité"
                prepend-inner-icon="ri-user-heart-line" variant="outlined" />
            </VCol>

            <!-- Type d'utilisateur -->
            <VCol cols="12" md="6">
              <VSelect v-model="formData.user_type" :items="userTypeOptions" label="Type d'utilisateur *"
                prepend-inner-icon="ri-shield-user-line" variant="outlined"
                :rules="[v => !!v || 'Le type d\'utilisateur est requis']" required />
            </VCol>

            <!-- Statut -->
            <VCol cols="12" md="6">
              <VSelect v-model="formData.status" :items="statusOptions" label="Statut *"
                prepend-inner-icon="ri-check-line" variant="outlined" :rules="[v => !!v || 'Le statut est requis']"
                required />
            </VCol>

            <!-- Informations de contact -->
            <VCol cols="12" md="6">
              <VTextField v-model="formData.mobile_number" label="Numéro de mobile"
                prepend-inner-icon="ri-smartphone-line" variant="outlined" />
            </VCol>

            <VCol cols="12" md="6">
              <VTextField v-model="formData.fix_number" label="Numéro de téléphone fixe"
                prepend-inner-icon="ri-phone-line" variant="outlined" />
            </VCol>

            <VCol cols="12" md="6">
              <VTextField v-model="formData.country_code" label="Code pays" prepend-inner-icon="ri-flag-line"
                variant="outlined" />
            </VCol>

            <VCol cols="12" md="6">
              <VTextField v-model="formData.lang" label="Langue" prepend-inner-icon="ri-translate-2"
                variant="outlined" />
            </VCol>

            <!-- Date de naissance -->
            <VCol cols="12" md="6">
              <VTextField v-model="formData.birth_date" label="Date de naissance" type="date"
                prepend-inner-icon="ri-calendar-line" variant="outlined" />
            </VCol>

            <!-- Authentification à deux facteurs -->
            <VCol cols="12" md="6">
              <VSwitch v-model="formData.two_factor_enabled" label="Authentification à deux facteurs" color="primary"
                inset />
            </VCol>
          </VRow>

          <!-- Boutons d'action -->
          <div class="d-flex justify-end gap-3 mt-6">
            <VBtn color="error" variant="flat" @click="goBack">
              Annuler
            </VBtn>
            <VBtn type="submit" color="primary" variant="flat" :loading="isLoading">
              Modifier
            </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped>
.user-edit-page {
  padding: 2rem;
}
</style>
