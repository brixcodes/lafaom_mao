<template>
  <VContainer fluid>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">Créer une réclamation</h1>
        <p class="text-body-1 text-medium-emphasis">
          Soumettez une réclamation concernant votre candidature
        </p>
      </div>
      <VBtn
        variant="outlined"
        @click="goBack"
        prepend-icon="ri-arrow-left-line"
      >
        Retour
      </VBtn>
    </div>

    <!-- Formulaire -->
    <VRow justify="center">
      <VCol cols="12" md="8" lg="6">
        <VCard>
          <VCardText>
            <ReclamationForm
              ref="formRef"
              :is-loading="isSubmitting"
              @submit="handleSubmit"
              @cancel="goBack"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useReclamation } from '@/composables/useReclamation'
import { showToast } from '@/components/toast/toastManager'
import type { ReclamationCreateInput } from '@/types/reclamation'
import ReclamationForm from '@/components/reclamation/ReclamationForm.vue'

// Router
const router = useRouter()

// Composable
const { createReclamation, loadReclamationTypes } = useReclamation()

// State
const isSubmitting = ref(false)
const formRef = ref()

// Methods
const handleSubmit = async (data: ReclamationCreateInput) => {
  try {
    isSubmitting.value = true
    
    await createReclamation(data)
    
    showToast({
      message: 'Réclamation créée avec succès',
      type: 'success'
    })
    
    // Rediriger vers la liste des réclamations
    router.push({ name: 'my-reclamations' })
    
  } catch (error) {
    console.error('Erreur lors de la création de la réclamation:', error)
    // L'erreur est déjà gérée dans le composable
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.push({ name: 'my-reclamations' })
}

// Lifecycle
onMounted(() => {
  loadReclamationTypes()
})
</script>