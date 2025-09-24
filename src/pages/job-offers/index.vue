<template>
  <div class="job-offers-page">
    <!-- En-tête avec actions -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 mb-2">
          <VIcon icon="ri-briefcase-line" class="me-2" color="primary" />
          Offres d'emploi
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Gérez toutes vos offres d'emploi
        </p>
      </div>
      <div class="d-flex gap-3">
        <VBtn prepend-icon="ri-refresh-line" variant="outlined" :loading="isLoading" @click="refreshOffers">
          Actualiser
        </VBtn>
        <VBtn prepend-icon="ri-add-line" color="primary" :to="{ name: 'job-offers-create' }">
          Nouvelle offre
        </VBtn>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <VCard class="mb-6">
      <VCardText>
        <VRow>
          <VCol cols="12" md="4">
            <VTextField v-model="searchQuery" prepend-inner-icon="ri-search-line" label="Rechercher..."
              variant="outlined" clearable @input="debouncedSearch" />
          </VCol>
          <VCol cols="12" md="3">
            <VSelect v-model="filterLocation" :items="locationOptions" label="Localisation" variant="outlined" clearable
              @update:model-value="applyFilters" />
          </VCol>
          <VCol cols="12" md="3">
            <VSelect v-model="filterContractType" :items="contractTypeOptions" label="Type de contrat"
              variant="outlined" clearable @update:model-value="applyFilters" />
          </VCol>
          <VCol cols="12" md="2">
            <VSelect v-model="sortBy" :items="sortOptions" label="Trier par" variant="outlined"
              @update:model-value="applyFilters" />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Liste des offres -->
    <div v-if="isLoading && !hasJobOffers" class="text-center pa-8">
      <VProgressCircular indeterminate color="primary" size="64" class="mb-4" />
      <p class="text-body-1">Chargement des offres...</p>
    </div>

    <div v-else-if="hasJobOffers">
      <VRow>
        <VCol v-for="offer in jobOffers" :key="offer.id" cols="12" md="6" lg="4">
          <VCard class="h-100 d-flex flex-column">
            <VCardTitle class="d-flex align-center justify-space-between">
              <span class="text-truncate">{{ offer.title }}</span>
              <VMenu>
                <template #activator="{ props }">
                  <VBtn icon="ri-more-2-line" size="small" variant="text" v-bind="props" />
                </template>
                <VList>
                  <VListItem prepend-icon="ri-eye-line" title="Voir détails"
                    :to="{ name: 'job-offers-detail', params: { id: offer.id } }" />
                  <VListItem prepend-icon="ri-edit-line" title="Modifier"
                    :to="{ name: 'job-offers-edit', params: { id: offer.id } }" />
                  <VDivider />
                  <VListItem prepend-icon="ri-delete-bin-line" title="Supprimer" class="text-error"
                    @click="confirmDelete(offer)" />
                </VList>
              </VMenu>
            </VCardTitle>

            <VCardText class="flex-grow-1">
              <div class="mb-3">
                <div class="d-flex align-center mb-2">
                  <VIcon icon="ri-map-pin-line" size="16" class="me-2" color="medium-emphasis" />
                  <span class="text-body-2">{{ offer.location }}</span>
                </div>
                <div class="d-flex align-center mb-2">
                  <VIcon icon="ri-file-list-line" size="16" class="me-2" color="medium-emphasis" />
                  <span class="text-body-2">{{ getContractTypeLabel(offer.contract_type) }}</span>
                </div>
                <div class="d-flex align-center mb-2">
                  <VIcon icon="ri-calendar-line" size="16" class="me-2" color="medium-emphasis" />
                  <span class="text-body-2">Échéance: {{ formatDate(offer.submission_deadline) }}</span>
                </div>
                <div v-if="offer.salary" class="d-flex align-center mb-2">
                  <VIcon icon="ri-money-euro-circle-line" size="16" class="me-2" color="medium-emphasis" />
                  <span class="text-body-2">{{ formatSalary(offer.salary, offer.currency) }}</span>
                </div>
              </div>

              <div class="d-flex align-center justify-space-between">
                <VChip :color="getOfferStatusColor(offer)" size="small" variant="tonal">
                  {{ getOfferStatusLabel(offer) }}
                </VChip>
                <VChip color="primary" size="small" variant="outlined">
                  {{ offer.reference }}
                </VChip>
              </div>
            </VCardText>

            <VCardActions>
              <VBtn variant="outlined" size="small" prepend-icon="ri-eye-line"
                :to="{ name: 'job-offers-detail', params: { id: offer.id } }">
                Voir
              </VBtn>
              <VBtn color="success" size="small" prepend-icon="ri-send-plane-line"
                :to="{ name: 'job-application-create', params: { offerId: offer.id } }">
                Candidater
              </VBtn>
              <VBtn variant="outlined" size="small" prepend-icon="ri-edit-line"
                :to="{ name: 'job-offers-edit', params: { id: offer.id } }">
                Modifier
              </VBtn>
              <VBtn color="error" variant="outlined" size="small" prepend-icon="ri-delete-bin-line"
                @click="confirmDelete(offer)">
                Supprimer
              </VBtn>
              <VSpacer />
              <VBtn icon="ri-user-line" size="small" variant="text"
                :to="{ name: 'job-applications', query: { job_offer_id: offer.id } }">
                <VIcon icon="ri-user-line" />
                <VTooltip activator="parent" location="top">
                  Voir les candidatures
                </VTooltip>
              </VBtn>
            </VCardActions>
          </VCard>
        </VCol>
      </VRow>

      <!-- Pagination -->
      <div class="d-flex justify-center mt-6">
        <VPagination v-model="currentPage" :length="totalPages" :total-visible="7" @update:model-value="changePage" />
      </div>
    </div>

    <!-- État vide -->
    <div v-else class="text-center pa-12">
      <VIcon icon="ri-briefcase-line" size="120" color="medium-emphasis" class="mb-4" />
      <h2 class="text-h5 mb-4">Aucune offre d'emploi</h2>
      <p class="text-body-1 text-medium-emphasis mb-6">
        Commencez par créer votre première offre d'emploi.
      </p>
      <VBtn prepend-icon="ri-add-line" color="primary" size="large" :to="{ name: 'job-offers-create' }">
        Créer ma première offre
      </VBtn>
    </div>

    <!-- Dialog de confirmation de suppression -->
    <VDialog v-model="deleteDialog" max-width="400">
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon icon="ri-alert-line" color="error" class="me-2" />
          Confirmer la suppression
        </VCardTitle>
        <VCardText>
          Êtes-vous sûr de vouloir supprimer l'offre "{{ offerToDelete?.title }}" ?
          Cette action est irréversible.
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="deleteDialog = false">
            Annuler
          </VBtn>
          <VBtn color="error" :loading="isLoading" @click="deleteOffer">
            Supprimer
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Message d'erreur -->
    <VAlert v-if="error" type="error" class="mt-4" closable @click:close="clearError">
      {{ error }}
    </VAlert>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useJobOffersStore } from '@/stores/jobOffers'
import { CONTRACT_TYPES } from '@/types/jobOffers'
import type { JobOfferOut, JobOfferFilter } from '@/types/jobOffers'
import { debounce } from '@/utils/debounce'

// Store
const jobOffersStore = useJobOffersStore()

// State
const searchQuery = ref('')
const filterLocation = ref('')
const filterContractType = ref('')
const sortBy = ref('created_at')
const currentPage = ref(1)
const pageSize = ref(12)
const deleteDialog = ref(false)
const offerToDelete = ref<JobOfferOut | null>(null)

// Computed
const {
  jobOffers,
  hasJobOffers,
  isLoading,
  error,
  jobOffersPagination,
} = jobOffersStore

const totalPages = computed(() => {
  return Math.ceil(jobOffersPagination.total / pageSize.value)
})

const contractTypeOptions = computed(() => [
  { title: 'Tous les types', value: '' },
  ...CONTRACT_TYPES.map(type => ({
    title: type.text,
    value: type.value
  }))
])

const locationOptions = computed(() => {
  const locations = [...new Set(jobOffers.map(offer => offer.location))]
  return [
    { title: 'Toutes les localisations', value: '' },
    ...locations.map(location => ({ title: location, value: location }))
  ]
})

const sortOptions = [
  { title: 'Plus récentes', value: 'created_at' },
  { title: 'Titre', value: 'title' },
  { title: 'Échéance', value: 'submission_deadline' },
  { title: 'Salaire', value: 'salary' },
]

// Methods
const refreshOffers = async () => {
  await fetchOffers()
}

const fetchOffers = async () => {
  const filters: JobOfferFilter = {
    page: currentPage.value,
    page_size: pageSize.value,
    search: searchQuery.value || undefined,
    location: filterLocation.value || undefined,
    contract_type: filterContractType.value || undefined,
    order_by: sortBy.value as any,
    asc: 'desc'
  }

  try {
    await jobOffersStore.fetchJobOffers(filters)
  } catch (err) {
    console.error('Erreur lors du chargement des offres:', err)
  }
}

const debouncedSearch = debounce(() => {
  currentPage.value = 1
  fetchOffers()
}, 500)

const applyFilters = () => {
  currentPage.value = 1
  fetchOffers()
}

const changePage = (page: number) => {
  currentPage.value = page
  fetchOffers()
}

const confirmDelete = (offer: JobOfferOut) => {
  offerToDelete.value = offer
  deleteDialog.value = true
}

const deleteOffer = async () => {
  if (!offerToDelete.value) return

  try {
    await jobOffersStore.deleteJobOffer(offerToDelete.value.id)
    deleteDialog.value = false
    offerToDelete.value = null
    await fetchOffers()
  } catch (err) {
    console.error('Erreur lors de la suppression:', err)
  }
}

const getContractTypeLabel = (type: string) => {
  const contractType = CONTRACT_TYPES.find(ct => ct.value === type)
  return contractType?.text || type
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatSalary = (salary: number, currency: string) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency || 'EUR'
  }).format(salary)
}

const getOfferStatusColor = (offer: JobOfferOut) => {
  const today = new Date()
  const deadline = new Date(offer.submission_deadline)

  if (deadline < today) return 'error'
  if (deadline <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) return 'warning'
  return 'success'
}

const getOfferStatusLabel = (offer: JobOfferOut) => {
  const today = new Date()
  const deadline = new Date(offer.submission_deadline)

  if (deadline < today) return 'Expirée'
  if (deadline <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) return 'Expire bientôt'
  return 'Active'
}

const clearError = () => {
  jobOffersStore.clearError()
}

// Lifecycle
onMounted(() => {
  fetchOffers()
})

// Watch for changes
watch([filterLocation, filterContractType, sortBy], applyFilters)
</script>

<style scoped>
.job-offers-page {
  padding: 1.5rem;
}

.gap-3 {
  gap: 12px;
}

@media (max-width: 768px) {
  .job-offers-page {
    padding: 1rem;
  }
}
</style>
