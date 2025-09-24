<template>
  <div class="job-offer-create pa-6">
    <!-- En-tête de la page -->
    <div class="d-flex align-center mb-6">
      <VBtn icon="ri-arrow-left-line" variant="text" @click="goBack" class="me-4" />

      <div>
        <h1 class="text-h4 mb-2">
          Créer une offre d'emploi
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Remplissez les informations nécessaires pour créer une nouvelle offre d'emploi
        </p>
      </div>
    </div>

    <!-- Formulaire -->
    <JobForm ref="jobFormRef" :loading="jobOffersStore.isLoading" @submit="handleSubmit" @cancel="goBack" />

    <!-- Aide contextuelle -->
    <VCard elevation="1" class="mt-6" color="info" variant="tonal">
      <VCardText>
        <h3 class="text-h6 mb-3 d-flex align-center">
          <VIcon icon="ri-lightbulb-line" class="me-2" />
          Conseils pour créer une offre attractive
        </h3>

        <VRow>
          <VCol cols="12" md="6">
            <div class="mb-3">
              <h4 class="text-subtitle-1 mb-2">
                <VIcon icon="ri-edit-2-line" size="small" class="me-1" />
                Titre et description
              </h4>
              <ul class="text-body-2 pl-4">
                <li>Utilisez un titre clair et précis</li>
                <li>Décrivez les missions principales</li>
                <li>Mentionnez les compétences requises</li>
              </ul>
            </div>

            <div class="mb-3">
              <h4 class="text-subtitle-1 mb-2">
                <VIcon icon="ri-map-pin-line" size="small" class="me-1" />
                Localisation
              </h4>
              <ul class="text-body-2 pl-4">
                <li>Précisez la ville et le code postal</li>
                <li>Indiquez si le télétravail est possible</li>
              </ul>
            </div>
          </VCol>

          <VCol cols="12" md="6">
            <div class="mb-3">
              <h4 class="text-subtitle-1 mb-2">
                <VIcon icon="ri-money-euro-circle-line" size="small" class="me-1" />
                Rémunération
              </h4>
              <ul class="text-body-2 pl-4">
                <li>Indiquez le salaire si possible</li>
                <li>Mentionnez les avantages</li>
                <li>Précisez les frais de candidature</li>
              </ul>
            </div>

            <div class="mb-3">
              <h4 class="text-subtitle-1 mb-2">
                <VIcon icon="ri-calendar-line" size="small" class="me-1" />
                Dates importantes
              </h4>
              <ul class="text-body-2 pl-4">
                <li>Fixez une date limite réaliste</li>
                <li>Laissez suffisamment de temps aux candidats</li>
              </ul>
            </div>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
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

// Methods
const handleSubmit = async (formData: JobOfferCreateInput) => {
  try {
    const response = await jobOffersStore.createJobOffer(formData)

    // Rediriger vers la page de détail de l'offre créée
    router.push({
      name: 'job-offers-detail',
      params: { id: response.data.id }
    })

    // Optionnel: afficher un message de succès
    console.log('Offre créée avec succès:', response.data)

  } catch (error: any) {
    console.error('Erreur lors de la création:', error)

    // Gérer les erreurs de validation du backend
    if (error.response?.data?.error && Array.isArray(error.response.data.error)) {
      const backendErrors: Record<string, string> = {}

      error.response.data.error.forEach((err: any) => {
        if (err.loc && err.loc.length > 0) {
          const fieldName = err.loc[err.loc.length - 1]
          backendErrors[fieldName] = err.msg
        }
      })

      // Transmettre les erreurs au formulaire
      jobFormRef.value?.handleBackendErrors(backendErrors)
    }
  }
}

const goBack = () => {
  router.push({ name: 'job-offers-list' })
}

// Meta information pour la page
defineOptions({
  name: 'JobOfferCreate'
})
</script>

<style scoped>
.job-offer-create {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
}
</style>
