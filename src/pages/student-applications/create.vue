<template>
  <VContainer>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="d-flex align-center">
        <VBtn icon variant="text" class="mr-3" @click="goBack">
          <VIcon icon="ri-arrow-left-line" color="primary" />
        </VBtn>
        <div>
          <h1 class="text-h4 font-weight-bold mb-2">
            Nouvelle candidature
          </h1>
          <p class="text-body-1 text-medium-emphasis">
            Créez une nouvelle candidature à une formation
          </p>
        </div>
      </div>
    </div>

    <!-- Formulaire de création -->
    <VCardText class="py-4">
      <StudentApplicationForm 
        @submit="handleSubmit" 
        @cancel="goBack" 
        :is-submitting="isSubmitting" 
        :error="error"
      />
    </VCardText>

    <!-- Chargement -->
    <div v-if="isSubmitting" class="text-center pa-8">
      <VProgressCircular indeterminate color="primary" size="64" class="mb-4" />
      <p class="text-body-1">Création de la candidature...</p>
    </div>

    <!-- Erreur -->
    <VAlert v-if="error" type="error" class="mt-4" closable @click:close="clearError">
      {{ error }}
    </VAlert>
  </VContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentApplication } from '@/composables/useStudentApplication'
import StudentApplicationForm from '@/components/student-application/StudentApplicationForm.vue'
import type { StudentApplicationCreateInput } from '@/types/student-application'
import { showToast } from '@/components/toast/toastManager'

const router = useRouter()

// Composable
const {
  createApplication,
  isSubmitting,
  error
} = useStudentApplication()

// Methods
const goBack = () => {
  router.push({ name: 'student-applications-index' })
}

const handleSubmit = async (data: StudentApplicationCreateInput) => {
  try {
    await createApplication(data)
    showToast({ message: 'Candidature créée avec succès', type: 'success' })
    router.push({ name: 'student-applications-index' })
  } catch (error) {
    console.error('Erreur lors de la création:', error)
  }
}

const clearError = () => {
  // TODO: Implémenter la gestion des erreurs
}
</script>

<style scoped>
.student-application-create-page {
  max-width: 800px;
}
</style>