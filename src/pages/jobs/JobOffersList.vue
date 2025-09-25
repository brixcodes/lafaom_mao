<template>
  <div class="job-offers-page">
      <!-- En-tête -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 mb-2">
            <VIcon icon="ri-briefcase-line" class="me-3" color="primary" />
            Offres d'emploi
          </h1>
          <p class="text-body-1 text-medium-emphasis">
            Gérez et consultez toutes les offres d'emploi disponibles
          </p>
        </div>
        <!-- Bouton créer - Permission: CAN_CREATE_JOB_OFFER -->
        <VBtn 
          prepend-icon="ri-add-line" 
          color="primary" 
          :to="{ name: 'job-offers-create' }"
        >
          Créer une offre
        </VBtn>
      </div>

    <!-- Filtres et recherche -->
    <VCard class="mb-6">
      <VCardText>
        <VRow>
          <VCol cols="12" md="3">
            <VTextField v-model="searchQuery" prepend-inner-icon="ri-search-line" label="Rechercher une offre..."
              variant="outlined" density="compact" clearable />
          </VCol>
          <VCol cols="12" md="3">
            <VSelect v-model="filterLocation" :items="locationOptions" label="Localisation" variant="outlined"
              density="compact" clearable />
          </VCol>
          <VCol cols="12" md="3">
            <VSelect v-model="filterContractType" :items="contractTypeOptions" label="Type de contrat"
              variant="outlined" density="compact" clearable />
          </VCol>
          <VCol cols="12" md="2">
            <VSelect v-model="sortBy" :items="sortOptions" label="Trier par" variant="outlined" density="compact" />
          </VCol>
          <VCol cols="12" md="1" class="d-flex align-center">
            <VBtn variant="outlined" prepend-icon="ri-refresh-line" @click="resetFilters" :disabled="!hasActiveFilters">
              Reset
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Indicateur de filtres actifs -->
    <div v-if="hasActiveFilters" class="mb-4">
      <VAlert type="info" variant="tonal" class="d-flex align-center">
        <div class="d-flex align-center flex-grow-1">
          <VIcon icon="ri-filter-line" class="me-2" />
          <span>{{ filteredOffers.length }} sur {{ allOffers.length }} offre(s) correspond(ent) aux filtres</span>
        </div>
        <VBtn variant="text" size="small" prepend-icon="ri-close-line" @click="resetFilters">
          Effacer
        </VBtn>
      </VAlert>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="text-center py-12">
      <VProgressCircular indeterminate size="60" width="6" color="primary" class="mb-4" />
      <p class="text-body-1 text-medium-emphasis">Chargement des offres d'emploi...</p>
    </div>

    <!-- Liste des offres -->
    <div v-else-if="hasJobOffers">
      <VRow>
        <VCol v-for="offer in jobOffers" :key="offer.id" cols="12" sm="6" md="6" lg="4">
          <VCard class="mx-auto my-6">
            <!-- Header -->
            <VCardItem>
              <VCardTitle class="text-h6 line-clamp-2">{{ truncateText(offer.title, 45) }}</VCardTitle>
              <VCardSubtitle class="d-flex align-center gap-1">
                <span class="text-body-2">{{ offer.reference }}</span>
                <VIcon color="error" size="small">ri-fire-fill</VIcon>
              </VCardSubtitle>
            </VCardItem>

            <!-- Rating -->
            <VCardText>
              <VRow class="align-center mb-3">
                <VRating :model-value="4.5" color="amber" density="compact" size="small" half-increments readonly />
                <span class="text-grey text-caption ms-2">4.5 (413)</span>
              </VRow>

              <!-- Details -->
              <VRow class="text-body-2 ma-0 pa-0" no-gutters>
                <VCol cols="12" md="8" class="d-flex align-center mb-2">
                  <VIcon icon="ri-map-pin-line" size="small" class="me-2 text-primary" />
                  <span>{{ offer.location }}</span>
                </VCol>

                <VCol cols="12" md="4" class="d-flex align-center mb-2">
                  <VIcon icon="ri-money-euro-circle-line" size="small" class="me-2 text-success" />
                  <span>{{ formatSalary(offer.salary || 0, offer.currency || 'EUR') }}</span>
                </VCol>

                <VCol cols="12" md="12" class="d-flex align-center mb-2">
                  <VIcon icon="ri-calendar-line" size="small" class="me-2" />
                  <span class="text-body-2">Expire le {{ formatDate(offer.submission_deadline) }}</span>
                </VCol>
              </VRow>

              <v-divider class="my-2"></v-divider>

              <!-- Attachments -->
              <v-card-title>Pièces à joindre</v-card-title>
              <div v-if="offer.attachment && offer.attachment.length > 0">
                <v-chip v-for="(doc, index) in offer.attachment.slice(0, 2)" :key="doc" size="x-small" class="mx-1"
                  style="font-size: 10px; font-weight: bold;">
                  {{ doc }}
                </v-chip>

                <v-chip v-if="offer.attachment.length > 2" size="x-small" class="mx-1"
                  style="font-size: 10px; font-weight: bold; background-color: #f5f5f5; cursor: pointer;">
                  Voir plus...
                </v-chip>
              </div>
              <v-chip v-else size="x-small" class="mx-1"
                style="font-size: 10px; font-weight: bold; background-color: #f0f0f0;">
                Aucune pièce à joindre
              </v-chip>

              <!-- Actions -->
              <VCardActions>
                <VSpacer />
                <VBtn variant="flat" size="x-small" icon :ripple="false" @click="toggleOfferDetails(offer.id)"
                  aria-label="Toggle details">
                  <VIcon>
                    {{ expandedOffers.has(offer.id) ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line' }}
                  </VIcon>
                </VBtn>

                <VMenu offset-y>
                  <template #activator="{ props }">
                    <VBtn icon="ri-more-2-line" variant="flat" size="x-small" v-bind="props" />
                  </template>
                  <VList>
                    <VListItem prepend-icon="ri-eye-line" title="Voir les détails"
                      :to="{ name: 'job-offers-detail', params: { id: offer.id } }" />
                    <VListItem prepend-icon="ri-edit-line" title="Modifier"
                      :to="{ name: 'job-offers-edit', params: { id: offer.id } }" />
                    <VListItem prepend-icon="ri-booklet-line" title="Candidater"
                      :to="{ name: 'job-offers-apply', params: { id: offer.id } }" />
                    <VListItem prepend-icon="ri-group-2-line" title="Voir les candidatures"
                      :to="{ name: 'job-applications', query: { job_offer_id: offer.id } }" />
                    <VDivider />
                    <VListItem prepend-icon="ri-delete-bin-line" title="Supprimer" class="text-error"
                      @click="confirmDelete(offer)" />
                  </VList>
                </VMenu>
              </VCardActions>

              <!-- Expandable Details -->
              <v-expand-transition>
                <div v-show="expandedOffers.has(offer.id)">
                  <v-divider class="my-2"></v-divider>
                  <v-timeline align="start" density="compact" class="pa-3">
                    <v-timeline-item size="x-small">
                      <div class="font-weight-medium mb-2"><strong>Mission principale</strong> :</div>
                      <div style="margin-left: 10px;" v-html="offer.main_mission"></div>
                    </v-timeline-item>
                    <v-timeline-item size="x-small">
                      <div class="font-weight-medium mb-2"><strong>Responsabilités</strong> :</div>
                      <div style="margin-left: 15px;" v-html="offer.responsibilities"></div>
                    </v-timeline-item>
                    <v-timeline-item size="x-small">
                      <div class="font-weight-medium mb-2"><strong>Compétences requises</strong> :</div>
                      <div style="margin-left: 15px;" v-html="offer.competencies"></div>
                    </v-timeline-item>
                  </v-timeline>
                </div>
              </v-expand-transition>
            </VCardText>
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
      <h2 class="text-h5 mb-4">
        {{ hasActiveFilters ? 'Aucun résultat' : "Aucune offre d'emploi" }}
      </h2>
      <p class="text-body-1 text-medium-emphasis mb-6">
        {{
          hasActiveFilters
            ? 'Aucune offre ne correspond à vos critères de recherche.'
            : "Commencez par créer votre première offre d'emploi."
        }}
      </p>
      <div class="d-flex justify-center gap-3">
        <VBtn v-if="hasActiveFilters" variant="outlined" prepend-icon="ri-refresh-line" @click="resetFilters">
          Réinitialiser les filtres
        </VBtn>
        <VBtn v-if="!hasActiveFilters" prepend-icon="ri-add-line" color="primary" size="large"
          :to="{ name: 'job-offers-create' }">
          Créer ma première offre
        </VBtn>
      </div>
    </div>

    <!-- Dialog de confirmation de suppression -->
    <VDialog v-model="deleteDialog" max-width="400">
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon icon="ri-alert-line" color="error" class="me-2" />
          Confirmer la suppression
        </VCardTitle>
        <VCardText>
          Êtes-vous sûr de vouloir supprimer l'offre "{{ offerToDelete?.title }}" ? Cette action est irréversible.
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="deleteDialog = false"> Annuler </VBtn>
          <VBtn color="error" :loading="isLoading" @click="deleteOffer"> Supprimer </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

      <!-- Message d'erreur -->
      <VAlert v-if="error" type="error" class="mt-4" closable @click:close="clearError">
        {{ error }}
      </VAlert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useJobOffersStore } from '@/stores/jobOffers'
import { CONTRACT_TYPES } from '@/types/jobOffers'
import type { JobOfferOut } from '@/types/jobOffers'

// Store
const jobOffersStore = useJobOffersStore()


// Expansion par offre
const expandedOffers = ref<Set<string>>(new Set())
const toggleOfferDetails = (id: string) => {
  if (expandedOffers.value.has(id)) {
    expandedOffers.value.delete(id)
  } else {
    expandedOffers.value.add(id)
  }
}

// Utils
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

// State
const allOffers = ref<JobOfferOut[]>([])
const searchQuery = ref('')
const filterLocation = ref('')
const filterContractType = ref('')
const sortBy = ref('created_at')
const currentPage = ref(1)
const pageSize = ref(12)
const deleteDialog = ref(false)
const offerToDelete = ref<JobOfferOut | null>(null)
const isInitialLoading = ref(true)

// Computed pour filtrage côté client
const filteredOffers = computed(() => {
  if (!allOffers.value || !Array.isArray(allOffers.value)) return []

  let filtered = [...allOffers.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      offer =>
        (offer.title || '').toLowerCase().includes(query) ||
        (offer.location || '').toLowerCase().includes(query) ||
        (offer.reference || '').toLowerCase().includes(query)
    )
  }

  if (filterLocation.value) {
    filtered = filtered.filter(offer => (offer.location || '') === filterLocation.value)
  }

  if (filterContractType.value) {
    filtered = filtered.filter(offer => (offer.contract_type || '') === filterContractType.value)
  }

  filtered.sort((a, b) => {
    let aVal, bVal
    switch (sortBy.value) {
      case 'title':
        aVal = (a.title || '').toLowerCase()
        bVal = (b.title || '').toLowerCase()
        return aVal.localeCompare(bVal)
      case 'submission_deadline':
        aVal = a.submission_deadline ? new Date(a.submission_deadline).getTime() : 0
        bVal = b.submission_deadline ? new Date(b.submission_deadline).getTime() : 0
        return aVal - bVal
      case 'salary':
        aVal = a.salary || 0
        bVal = b.salary || 0
        return bVal - aVal
      case 'created_at':
      default:
        aVal = a.created_at ? new Date(a.created_at).getTime() : 0
        bVal = b.created_at ? new Date(b.created_at).getTime() : 0
        return bVal - aVal
    }
  })

  return filtered
})

// Pagination
const paginatedOffers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredOffers.value.slice(start, end)
})

const jobOffers = computed(() => paginatedOffers.value)
const hasJobOffers = computed(() => filteredOffers.value.length > 0)
const isLoading = computed(() => isInitialLoading.value)
const error = computed(() => jobOffersStore.error)

const totalPages = computed(() => Math.ceil(filteredOffers.value.length / pageSize.value))

// Filtres actifs
const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' || filterLocation.value !== '' || filterContractType.value !== '' || sortBy.value !== 'created_at'
})


// Options filtres
const contractTypeOptions = computed(() => [
  { title: 'Tous les types', value: '' },
  ...CONTRACT_TYPES.map(type => ({ title: type.text, value: type.value }))
])

const locationOptions = computed(() => {
  if (!allOffers.value || !Array.isArray(allOffers.value)) return [{ title: 'Toutes les localisations', value: '' }]
  const locations = [...new Set(allOffers.value.map(offer => offer.location).filter(location => location && location.trim() !== ''))]
  return [{ title: 'Toutes les localisations', value: '' }, ...locations.map(location => ({ title: location, value: location }))]
})

const sortOptions = [
  { title: 'Plus récentes', value: 'created_at' },
  { title: 'Titre', value: 'title' },
  { title: 'Échéance', value: 'submission_deadline' },
  { title: 'Salaire', value: 'salary' }
]

// Methods
const loadAllOffers = async () => {
  try {
    isInitialLoading.value = true
    await jobOffersStore.fetchJobOffers({ page: 1, page_size: 1000, order_by: 'created_at', asc: 'desc' })
    allOffers.value = [...jobOffersStore.jobOffers]
  } catch (err) {
    console.error('Erreur lors du chargement des offres:', err)
  } finally {
    isInitialLoading.value = false
  }
}

const changePage = (page: number) => {
  currentPage.value = page
}

const confirmDelete = (offer: JobOfferOut) => {
  offerToDelete.value = offer
  deleteDialog.value = true
}

const deleteOffer = async () => {
  if (!offerToDelete.value) return
  try {
    await jobOffersStore.deleteJobOffer(offerToDelete.value.id)
    allOffers.value = allOffers.value.filter(offer => offer.id !== offerToDelete.value!.id)
    deleteDialog.value = false
    offerToDelete.value = null
  } catch (err) {
    console.error('Erreur lors de la suppression:', err)
  }
}

const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR')
const formatSalary = (salary: number, currency: string) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: currency || 'EUR' }).format(salary)

const clearError = () => {
  jobOffersStore.clearError()
}

const resetFilters = () => {
  searchQuery.value = ''
  filterLocation.value = ''
  filterContractType.value = ''
  sortBy.value = 'created_at'
  currentPage.value = 1
}

// Lifecycle
onMounted(async () => {
  await loadAllOffers()
})

// Watchers
watch([searchQuery, filterLocation, filterContractType, sortBy], () => {
  currentPage.value = 1
})
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
