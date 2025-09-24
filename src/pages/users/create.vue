<template>
  <div class="user-create-page">
    <div class="d-flex align-center mb-4">
      <VBtn icon variant="text" class="mr-3" aria-label="Retour" title="Retour" @click="goBack">
        <VIcon icon="ri-arrow-left-line" color="primary" />
      </VBtn>

      <div>
        <h1 class="font-weight-bold mb-1">
          Créer un utilisateur
        </h1>
        <p class="text-body-2 text-secondary mb-0">
          Remplissez le formulaire pour ajouter un nouvel utilisateur à la plateforme.
        </p>
      </div>
    </div>

    <UserFormGuard 
      :form="form" 
      :user-type-options="userTypeOptions" 
      :status-options="statusOptions" 
      title="Créer un utilisateur"
      submit-label="Créer"
      @submit="handleSubmit"
      @cancel="goBack"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UserForm from '@/components/User/UserForm.vue'
import UserFormGuard from '@/components/Permission/UserFormGuard.vue'
import { userService } from '@/services/api/user'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'
import type { CreateUserInput } from '@/types/user'


const router = useRouter()

// Initial form state
const form = ref<CreateUserInput>({
  first_name: '',
  last_name: '',
  password: '',
  birth_date: null,
  civility: null,
  country_code: null,
  mobile_number: '',
  fix_number: null,
  email: '',
  status: 'active',
  lang: 'fr',
  web_token: null,
  user_type: 'admin',
  two_factor_enabled: false,
})

// Options (should be fetched from API ideally)
const userTypeOptions = ref([
  { value: 'admin', title: 'Administrateur' },
  { value: 'staff', title: 'Staff' },
  { value: 'teacher', title: 'Enseignant' },
  { value: 'student', title: 'Étudiant' },
])
const statusOptions = ref([
  { value: 'active', title: 'Actif' },
  { value: 'inactive', title: 'Inactif' },
  { value: 'blocked', title: 'Bloqué' },
  { value: 'deleted', title: 'Supprimé' },
])

const goBack = () => {
  router.push('/users')
}

const handleSubmit = async (data: CreateUserInput) => {
  const payload: CreateUserInput = {
    ...data,
    password: data.password || 'defaultPassword',
    status: data.status || 'active',
    user_type: data.user_type || 'admin',
    lang: data.lang || 'fr',
    two_factor_enabled: false,
    web_token: null,
    birth_date: data.birth_date ?? null,
    civility: data.civility ?? null,
    country_code: data.country_code ?? null,
    fix_number: data.fix_number ?? null,
  }

  const confirmed = await confirmAction({
    method: 'post',
    title: 'Êtes vous sûres?',
    text: "Souhaitez-vous réellement enregistrer l'utilisateur ?",
    confirmButtonText: '<span style="color:white">Enregistrer</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })
  if (!confirmed) return
  console.log('[DEBUG] Payload envoyé à l’API:', payload)
  try {
    const res = await userService.createUser(payload)
    console.log('[DEBUG] Réponse API:', res)
    if (res && res.success) {
      showToast({ message: 'Utilisateur créé avec succès.', type: 'success' })
      router.push('/users')
    } else {
      showToast({ message: res?.message || 'Erreur lors de la création.', type: 'error' })
      console.error('[DEBUG] Erreur API:', res)
    }
  } catch (err) {
    showToast({ message: 'Erreur serveur ou réseau.', type: 'error' })
    console.error('[DEBUG] Exception API:', err)
  }
}
</script>

<style>
.swal2-confirm-white {
  color: #fff !important;
}
.swal2-cancel-white {
  color: #fff !important;
}
</style>
