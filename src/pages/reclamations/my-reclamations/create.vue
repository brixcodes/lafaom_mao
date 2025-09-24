<template>
  <VContainer fluid>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">Créer une réclamation</h1>
        <p class="text-body-1 text-medium-emphasis">
          Créez une nouvelle réclamation pour signaler un problème
        </p>
      </div>
      <VBtn variant="outlined" @click="goBack" prepend-icon="ri-arrow-left-line">
      </VBtn>
    </div>

    <!-- Formulaire de création -->
    <VCard>
      <VCardText>
        <ReclamationForm ref="formRef" v-model="formData" :reclamation-types="reclamationTypes"
          :is-submitting="isSubmitting" @submit="handleSubmit" />
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReclamation } from '@/composables/useReclamation'
import { showToast } from '@/components/toast/toastManager'
import type { ReclamationCreateInput } from '@/types/reclamation'

// Composants
import ReclamationForm from '@/components/reclamation/ReclamationForm.vue'

// Router
const router = useRouter()

// Composable
const {
  reclamationTypes,
  createReclamation,
  loadReclamationTypes
} = useReclamation()

// State
const formRef = ref()
const isSubmitting = ref(false)
const formData = ref<ReclamationCreateInput>({
  application_number: '',
  reclamation_type: 0,
  subject: '',
  priority: 'MEDIUM',
  description: ''
})

// Methods
const handleSubmit = async (data: ReclamationCreateInput) => {
  try {
    isSubmitting.value = true

    console.log('🔍 Données de réclamation à envoyer:', data)
    console.log('🔍 Numéro de candidature sélectionné:', data.application_number)
    
    await createReclamation(data)

    showToast({
      message: 'Réclamation créée avec succès',
      type: 'success'
    })

    // Rediriger vers la liste des réclamations de l'utilisateur
    router.push({ name: 'my-reclamations-index' })
  } catch (error: any) {
    console.error('Erreur lors de la création de la réclamation:', error)
    console.error('Response data:', error.response?.data)
    
    let errorMessage = 'Erreur lors de la création de la réclamation'
    
    // Vérifier le message d'erreur du backend
    if (error.response?.data?.message === 'Student application not found') {
      errorMessage = 'Aucune candidature trouvée avec ce numéro. Veuillez sélectionner une candidature valide dans la liste.'
    } else if (error.response?.data?.error_code === 'student_application_not_found') {
      errorMessage = 'Aucune candidature trouvée avec ce numéro. Veuillez sélectionner une candidature valide dans la liste.'
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.response?.status === 400) {
      errorMessage = 'Données invalides. Vérifiez tous les champs du formulaire.'
    }
    
    showToast({
      message: errorMessage,
      type: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.push({ name: 'my-reclamations-index' })
}

// Lifecycle
onMounted(() => {
  loadReclamationTypes()
})
</script>

<style scoped>
.v-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
