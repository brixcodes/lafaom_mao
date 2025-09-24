<template>
  <div class="job-offer-edit-page">
    <!-- En-tête -->
    <div class="d-flex align-center mb-6">
      <VBtn
        icon="ri-arrow-left-line"
        variant="text"
        @click="handleBack"
        class="me-3"
      />
      <div>
        <h1 class="text-h4 mb-1">
          <VIcon icon="ri-edit-line" class="me-2" color="primary" />
          Modifier l'offre d'emploi
        </h1>
        <p class="text-body-1 text-medium-emphasis" v-if="currentJobOffer">
          Édition : {{ currentJobOffer.title }}
        </p>
      </div>
    </div>

    <!-- Chargement -->
    <div v-if="isLoading && !currentJobOffer" class="text-center pa-8">
      <VProgressCircular indeterminate color="primary" size="64" class="mb-4" />
      <p class="text-body-1">Chargement de l'offre...</p>
    </div>

    <!-- Formulaire -->
    <div v-else-if="currentJobOffer">
      <JobForm
        ref="jobFormRef"
        :job-offer="currentJobOffer"
        :loading="isLoading"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>

    <!-- Erreur -->
    <VAlert
      v-else-if="error"
      type="error"
      class="mt-4"
      closable
      @click:close="clearError"
    >
      {{ error }}
    </VAlert>

    <!-- Message d'erreur général -->
    <VAlert
      v-if="error && currentJobOffer"
      type="error"
      class="mt-4"
      closable
      @click:close="clearError"
    >
      {{ error }}
    </VAlert>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobOffersStore } from '@/stores/jobOffers'
import JobForm from '@/components/jobs/JobForm.vue'
import type { JobOfferCreateInput } from '@/types/jobOffers'

// Composables
const route = useRoute()
const router = useRouter()
const jobOffersStore = useJobOffersStore()

// Refs
const jobFormRef = ref<InstanceType<typeof JobForm> | null>(null)

// Computed
const { currentJobOffer, isLoading, error } = jobOffersStore

// Methods
const loadJobOffer = async () => {
  const offerId = route.params.id as string
  if (offerId) {
    try {
      await jobOffersStore.getJobOfferById(offerId)
    } catch (err) {
      console.error('Erreur lors du chargement de l\'offre:', err)
    }
  }
}

const handleSubmit = async (data: JobOfferCreateInput) => {
  const offerId = route.params.id as string
  if (!offerId) return
  
  try {
    await jobOffersStore.updateJobOffer(offerId, data)
    
    // Rediriger vers le détail de l'offre
    router.push({ name: 'job-offers-detail', params: { id: offerId } })
  } catch (err: any) {
    console.error('Erreur lors de la mise à jour:', err)
    
    // Gérer les erreurs de validation backend
    if (err.response?.data?.validation_errors) {
      jobFormRef.value?.handleBackendErrors(err.response.data.validation_errors)
    }
  }
}

const handleCancel = () => {
  handleBack()
}

const handleBack = () => {
  const offerId = route.params.id as string
  if (offerId) {
    router.push({ name: 'job-offers-detail', params: { id: offerId } })
  } else {
    router.push({ name: 'job-offers-list' })
  }
}

const clearError = () => {
  jobOffersStore.clearError()
}

// Lifecycle
onMounted(() => {
  loadJobOffer()
})
</script>

<style scoped>
.job-offer-edit-page {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .job-offer-edit-page {
    padding: 1rem;
  }
}
</style>
