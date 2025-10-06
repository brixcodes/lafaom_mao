<template>
  <div class="job-offer-create-page">
    <!-- En-tête -->
    <div class="d-flex align-center mb-6">
      <VBtn icon="ri-arrow-left-line" variant="text" :to="{ name: 'job-offers-list' }" class="me-3" />
      <div>
        <h1 class="text-h4 mb-1">
          <VIcon icon="ri-add-line" class="me-2" color="primary" />
          Créer une offre d'emploi
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Remplissez le formulaire pour créer une nouvelle offre d'emploi
        </p>
      </div>
    </div>

    <!-- Formulaire -->
    <JobForm ref="jobFormRef" :loading="isLoading" @submit="handleSubmit" @cancel="handleCancel" />

    <!-- Message d'erreur -->
    <VAlert v-if="error" type="error" class="mt-4" closable @click:close="clearError">
      {{ error }}
    </VAlert>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useJobOffersStore } from '@/stores/jobOffers'
import JobForm from '@/components/jobs/JobForm.vue'
import type { JobOfferCreateInput } from '@/types/jobOffers'

// Composables
const router = useRouter()
const jobOffersStore = useJobOffersStore()

// Refs
const jobFormRef = ref<InstanceType<typeof JobForm> | null>(null)

// Computed
const { isLoading, error } = jobOffersStore

// Methods
const handleSubmit = async (data: JobOfferCreateInput) => {
  try {
    await jobOffersStore.createJobOffer(data)

    // Rediriger vers la liste des offres
    router.push({ name: 'job-offers-list' })
  } catch (err: any) {
    console.error('Erreur lors de la création:', err)

    // Gérer les erreurs de validation backend
    if (err.response?.data?.validation_errors) {
      jobFormRef.value?.handleBackendErrors(err.response.data.validation_errors)
    }
  }
}

const handleCancel = () => {
  router.push({ name: 'job-offers-list' })
}

const clearError = () => {
  jobOffersStore.clearError()
}
</script>

<style scoped>
.job-offer-create-page {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .job-offer-create-page {
    padding: 1rem;
  }
}
</style>
