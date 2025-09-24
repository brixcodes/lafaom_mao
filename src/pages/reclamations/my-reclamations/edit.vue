<template>
  <VContainer fluid>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">Modifier ma réclamation</h1>
        <p class="text-body-1 text-medium-emphasis">
          Modifiez votre réclamation existante
        </p>
      </div>
      <VBtn variant="outlined" @click="goBack" prepend-icon="ri-arrow-left-line">
        Retour
      </VBtn>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-8">
      <VProgressCircular indeterminate color="primary" size="64" />
      <p class="text-body-1 mt-4">Chargement de la réclamation...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-8">
      <VIcon size="64" color="error" class="mb-4">ri-error-warning-line</VIcon>
      <h3 class="text-h6 mb-2">Erreur de chargement</h3>
      <p class="text-body-2 text-medium-emphasis mb-4">{{ error }}</p>
      <VBtn color="primary" @click="loadReclamation">
        <VIcon class="mr-2">ri-refresh-line</VIcon>
        Réessayer
      </VBtn>
    </div>

    <!-- Form -->
    <div v-else-if="currentReclamation">
      <VCard>
        <VCardText>
          <ReclamationForm 
            ref="formRef" 
            v-model="formData" 
            :reclamation-types="reclamationTypes"
            :is-submitting="isSubmitting" 
            @submit="handleSubmit" 
          />
        </VCardText>
      </VCard>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReclamation } from '@/composables/useReclamation'
import { showToast } from '@/components/toast/toastManager'
import type { ReclamationCreateInput } from '@/types/reclamation'

// Composants
import ReclamationForm from '@/components/reclamation/ReclamationForm.vue'

// Route & Router
const route = useRoute()
const router = useRouter()

// Composable
const {
  currentReclamation,
  reclamationTypes,
  isLoading,
  error,
  getReclamation,
  updateReclamation,
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

// Computed
const reclamationId = computed(() => Number(route.params.id))

// Methods
const loadReclamation = async () => {
  try {
    await getReclamation(reclamationId.value)
    if (currentReclamation.value) {
      // Pré-remplir le formulaire avec les données existantes
      formData.value = {
        application_number: currentReclamation.value.application_number,
        reclamation_type: currentReclamation.value.reclamation_type,
        subject: currentReclamation.value.subject,
        priority: currentReclamation.value.priority,
        description: currentReclamation.value.description
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement de la réclamation:', error)
  }
}

const handleSubmit = async (data: ReclamationCreateInput) => {
  try {
    isSubmitting.value = true

    console.log('🔍 Données de réclamation à modifier:', data)
    console.log('🔍 ID de la réclamation:', reclamationId.value)
    
    await updateReclamation(reclamationId.value, data)

    showToast({
      message: 'Réclamation modifiée avec succès',
      type: 'success'
    })

    // Rediriger vers la liste des réclamations de l'utilisateur
    router.push({ name: 'my-reclamations-index' })
  } catch (error: any) {
    console.error('Erreur lors de la modification de la réclamation:', error)
    console.error('Response data:', error.response?.data)
    
    let errorMessage = 'Erreur lors de la modification de la réclamation'
    
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
onMounted(async () => {
  await loadReclamationTypes()
  await loadReclamation()
})
</script>

<style scoped>
.v-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
