
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UserForm from '@/components/User/UserForm.vue'
import { useUserStore } from '@/stores/user'
import { confirmAction } from '@/utils/confirm'
import { showToast } from '@/components/toast/toastManager'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const userId = route.params.id as string
const form = ref<any>({})
const isLoading = ref(false)

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

const fetchUser = async () => {
  isLoading.value = true
  try {
    await userStore.getUserById(userId)
    form.value = { ...userStore.currentUser }
    console.log('[DEBUG] Données utilisateur chargées:', form.value)
  } catch (err) {
    showToast({ message: 'Erreur lors du chargement de l’utilisateur.', type: 'error' })
    console.error('[DEBUG] Erreur chargement utilisateur:', err)
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchUser()
})

const handleSubmit = async (data: any) => {
  const confirmed = await confirmAction({
    method: 'put',
    title: 'Êtes vous sûres?',
    text: `Souhaitez-vous réellement enregistrer les modifications pour ${data.first_name} ${data.last_name} ?`,
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

  // Formatage du payload comme pour la création
  const payload = {
    ...data,
    password: data.password || 'defaultPassword',
    status: data.status || 'active',
    user_type: data.user_type || 'admin',
    lang: data.lang || 'fr',
    two_factor_enabled: !!data.two_factor_enabled,
    web_token: data.web_token ?? null,
    birth_date: data.birth_date ?? null,
    civility: data.civility ?? null,
    country_code: data.country_code ?? null,
    fix_number: data.fix_number ?? null,
  }

  console.log('[DEBUG] Payload envoyé à l’API:', payload)
  try {
    const res = await userStore.updateUser(userId, payload)

    console.log('[DEBUG] Réponse API:', res)

    if (res && res.success) {
      showToast({ message: 'Utilisateur modifié avec succès.', type: 'success' })
      router.push('/users')
    }
    else {
      showToast({ message: res?.message || 'Erreur lors de la modification.', type: 'error' })
      console.error('[DEBUG] Erreur API:', res)
    }
  }
  catch (err) {
    showToast({ message: 'Erreur serveur ou réseau.', type: 'error' })
    console.error('[DEBUG] Exception API:', err)
  }
}
</script>

<template>
  <div class="user-edit-page">
    <div class="d-flex align-center mb-4">
      <VBtn
        icon
        variant="text"
        aria-label="Retour"
        title="Retour"
        @click="goBack"
      >
        <VIcon
          icon="ri-arrow-left-line"
          color="primary"
        />
      </VBtn>

      <div>
        <h1 class="font-weight-bold mb-1">
          Modifier un utilisateur
        </h1>
        <p class="text-body-2 text-secondary mb-0">
          Modifiez les informations de l'utilisateur puis enregistrez les
          changements.
        </p>
      </div>
    </div>

    <div class="text-body-2 text-medium-emphasis mb-4" />
    <UserForm
      :form="form"
      :user-type-options="userTypeOptions"
      :status-options="statusOptions"
      submit-label="Modifier"
      @submit="handleSubmit"
    />
  </div>
</template>

<style scoped>
.user-edit-page {
  padding: 2rem;
}
</style>
