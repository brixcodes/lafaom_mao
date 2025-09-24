<template>
  <div class="job-applications-page">
    <!-- En-tête avec actions -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 mb-2">
          <VIcon icon="ri-user-line" class="me-2" color="primary" />
          Candidatures
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Gérez toutes les candidatures aux offres d'emploi
        </p>
      </div>
      <div class="d-flex gap-3">
        <VBtn
          prepend-icon="ri-refresh-line"
          variant="outlined"
          :loading="isLoading"
          @click="refreshApplications"
        >
          Actualiser
        </VBtn>
        <VBtn
          prepend-icon="ri-add-line"
          color="primary"
          :to="{ name: 'job-application-create-general' }"
        >
          Nouvelle candidature
        </VBtn>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <VCard class="mb-6">
      <VCardText>
        <VRow>
          <VCol cols="12" md="4">
            <VTextField
              v-model="searchQuery"
              prepend-inner-icon="ri-search-line"
              label="Rechercher (nom, email, numéro)..."
              variant="outlined"
              clearable
              @input="debouncedSearch"
            />
          </VCol>
          <VCol cols="12" md="3">
            <VSelect
              v-model="filterStatus"
              :items="statusOptions"
              label="Statut"
              variant="outlined"
              clearable
              @update:model-value="applyFilters"
            />
          </VCol>
          <VCol cols="12" md="3">
            <VSelect
              v-model="filterJobOffer"
              :items="jobOfferOptions"
              label="Offre d'emploi"
              variant="outlined"
              clearable
              @update:model-value="applyFilters"
            />
          </VCol>
          <VCol cols="12" md="2">
            <VSelect
              v-model="sortBy"
              :items="sortOptions"
              label="Trier par"
              variant="outlined"
              @update:model-value="applyFilters"
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Statistiques rapides -->
    <VRow class="mb-6">
      <VCol cols="6" md="3">
        <VCard>
          <VCardText class="text-center">
            <VIcon icon="ri-file-user-line" size="32" color="primary" class="mb-2" />
            <p class="text-h5 font-weight-bold mb-1">{{ applicationStats.total }}</p>
            <p class="text-caption">Total</p>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="6" md="3">
        <VCard>
          <VCardText class="text-center">
            <VIcon icon="ri-time-line" size="32" color="warning" class="mb-2" />
            <p class="text-h5 font-weight-bold mb-1">{{ applicationStats.pending }}</p>
            <p class="text-caption">En attente</p>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="6" md="3">
        <VCard>
          <VCardText class="text-center">
            <VIcon icon="ri-check-circle-line" size="32" color="success" class="mb-2" />
            <p class="text-h5 font-weight-bold mb-1">{{ applicationStats.accepted }}</p>
            <p class="text-caption">Acceptées</p>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="6" md="3">
        <VCard>
          <VCardText class="text-center">
            <VIcon icon="ri-close-circle-line" size="32" color="error" class="mb-2" />
            <p class="text-h5 font-weight-bold mb-1">{{ applicationStats.rejected }}</p>
            <p class="text-caption">Rejetées</p>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Liste des candidatures -->
    <div v-if="isLoading && !hasApplications" class="text-center pa-8">
      <VProgressCircular indeterminate color="primary" size="64" class="mb-4" />
      <p class="text-body-1">Chargement des candidatures...</p>
    </div>

    <div v-else-if="hasApplications">
      <VCard>
        <VCardText>
          <VDataTable
            :headers="headers"
            :items="jobApplications"
            :loading="isLoading"
            :items-per-page="pageSize"
            :page="currentPage"
            @update:page="changePage"
            class="elevation-0"
          >
            <template #item.candidate="{ item }">
              <div class="d-flex align-center">
                <VAvatar color="primary" class="me-3">
                  <span class="text-white font-weight-bold">
                    {{ getInitials(item.first_name, item.last_name) }}
                  </span>
                </VAvatar>
                <div>
                  <p class="text-body-2 font-weight-medium mb-1">
                    {{ item.first_name }} {{ item.last_name }}
                  </p>
                  <p class="text-caption text-medium-emphasis mb-0">
                    {{ item.email }}
                  </p>
                  <p class="text-caption text-medium-emphasis">
                    {{ item.phone_number }}
                  </p>
                </div>
              </div>
            </template>

            <template #item.job_offer="{ item }">
              <div v-if="item.job_offer">
                <p class="text-body-2 font-weight-medium mb-1">{{ item.job_offer.title }}</p>
                <p class="text-caption text-medium-emphasis">
                  {{ item.job_offer.location }} • {{ item.job_offer.reference }}
                </p>
              </div>
              <span v-else class="text-medium-emphasis">N/A</span>
            </template>

            <template #item.status="{ item }">
              <VChip
                :color="getStatusColor(item.status)"
                size="small"
                variant="tonal"
              >
                {{ getStatusLabel(item.status) }}
              </VChip>
            </template>

            <template #item.created_at="{ item }">
              <span class="text-body-2">{{ formatDate(item.created_at) }}</span>
            </template>

            <template #item.actions="{ item }">
              <div class="d-flex gap-2">
                <VBtn
                  icon="ri-eye-line"
                  size="small"
                  variant="text"
                  :to="{ name: 'job-applications-detail', params: { id: item.id } }"
                >
                  <VIcon icon="ri-eye-line" />
                  <VTooltip activator="parent" location="top">
                    Voir détails
                  </VTooltip>
                </VBtn>
                
                <VMenu>
                  <template #activator="{ props }">
                    <VBtn
                      icon="ri-edit-line"
                      size="small"
                      variant="text"
                      v-bind="props"
                    >
                      <VIcon icon="ri-edit-line" />
                    </VBtn>
                  </template>
                  <VList>
                    <VListItem
                      prepend-icon="ri-check-line"
                      title="Accepter"
                      @click="updateStatus(item, 'accepted')"
                    />
                    <VListItem
                      prepend-icon="ri-loader-line"
                      title="Mettre en traitement"
                      @click="updateStatus(item, 'processing')"
                    />
                    <VListItem
                      prepend-icon="ri-close-line"
                      title="Rejeter"
                      @click="updateStatus(item, 'rejected')"
                    />
                    <VListItem
                      prepend-icon="ri-forbid-line"
                      title="Annuler"
                      @click="updateStatus(item, 'cancelled')"
                    />
                  </VList>
                </VMenu>
              </div>
            </template>
          </VDataTable>
        </VCardText>
      </VCard>

      <!-- Pagination -->
      <div class="d-flex justify-center mt-6">
        <VPagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="7"
          @update:model-value="changePage"
        />
      </div>
    </div>

    <!-- État vide -->
    <div v-else class="text-center pa-12">
      <VIcon icon="ri-file-user-line" size="120" color="medium-emphasis" class="mb-4" />
      <h2 class="text-h5 mb-4">Aucune candidature</h2>
      <p class="text-body-1 text-medium-emphasis mb-6">
        Les candidatures aux offres d'emploi apparaîtront ici.
      </p>
      <VBtn
        prepend-icon="ri-briefcase-line"
        color="primary"
        size="large"
        :to="{ name: 'job-offers-list' }"
      >
        Voir les offres d'emploi
      </VBtn>
    </div>

    <!-- Message d'erreur -->
    <VAlert
      v-if="error"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useJobOffersStore } from '@/stores/jobOffers'
import { useRoute } from 'vue-router'
import { APPLICATION_STATUS_LABELS } from '@/types/jobOffers'
import type { JobApplicationOut, JobApplicationFilter, JobApplicationStatus } from '@/types/jobOffers'
import { debounce } from '@/utils/debounce'

// Store et route
const jobOffersStore = useJobOffersStore()
const route = useRoute()

// State
const searchQuery = ref('')
const filterStatus = ref('')
const filterJobOffer = ref('')
const sortBy = ref('created_at')
const currentPage = ref(1)
const pageSize = ref(20)

// Computed
const {
  jobApplications,
  hasApplications,
  isLoading,
  error,
  applicationsPagination,
  applicationStats,
  jobOffers,
} = jobOffersStore

const totalPages = computed(() => {
  return Math.ceil(applicationsPagination.total / pageSize.value)
})

const statusOptions = computed(() => [
  { title: 'Tous les statuts', value: '' },
  ...Object.entries(APPLICATION_STATUS_LABELS).map(([value, config]) => ({
    title: config.text,
    value
  }))
])

const jobOfferOptions = computed(() => [
  { title: 'Toutes les offres', value: '' },
  ...jobOffers.map(offer => ({
    title: `${offer.title} (${offer.reference})`,
    value: offer.id
  }))
])

const sortOptions = [
  { title: 'Plus récentes', value: 'created_at' },
  { title: 'Numéro de candidature', value: 'application_number' },
  { title: 'Statut', value: 'status' },
]

const headers = [
  { title: 'Candidat', key: 'candidate', sortable: false },
  { title: 'Numéro', key: 'application_number', sortable: true },
  { title: 'Offre', key: 'job_offer', sortable: false },
  { title: 'Statut', key: 'status', sortable: true },
  { title: 'Date', key: 'created_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, width: 120 },
]

// Methods
const refreshApplications = async () => {
  await fetchApplications()
}

const fetchApplications = async () => {
  const filters: JobApplicationFilter = {
    page: currentPage.value,
    page_size: pageSize.value,
    search: searchQuery.value || undefined,
    status: filterStatus.value as JobApplicationStatus || undefined,
    job_offer_id: filterJobOffer.value || undefined,
    order_by: sortBy.value as any,
    asc: 'desc'
  }
  
  try {
    await jobOffersStore.fetchJobApplications(filters)
  } catch (err) {
    console.error('Erreur lors du chargement des candidatures:', err)
  }
}

const debouncedSearch = debounce(() => {
  currentPage.value = 1
  fetchApplications()
}, 500)

const applyFilters = () => {
  currentPage.value = 1
  fetchApplications()
}

const changePage = (page: number) => {
  currentPage.value = page
  fetchApplications()
}

const updateStatus = async (application: JobApplicationOut, status: JobApplicationStatus) => {
  try {
    await jobOffersStore.updateApplicationStatus({
      application_id: application.id,
      status
    })
    await fetchApplications()
  } catch (err) {
    console.error('Erreur lors de la mise à jour du statut:', err)
  }
}

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

const getStatusColor = (status: JobApplicationStatus) => {
  return APPLICATION_STATUS_LABELS[status]?.color || 'default'
}

const getStatusLabel = (status: JobApplicationStatus) => {
  return APPLICATION_STATUS_LABELS[status]?.text || status
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const clearError = () => {
  jobOffersStore.clearError()
}

// Lifecycle
onMounted(async () => {
  // Charger les offres d'emploi pour les filtres
  await jobOffersStore.fetchJobOffers()
  
  // Si on a un job_offer_id dans les query params, l'utiliser comme filtre
  if (route.query.job_offer_id) {
    filterJobOffer.value = route.query.job_offer_id as string
  }
  
  await fetchApplications()
})

// Watch for changes
watch([filterStatus, filterJobOffer, sortBy], applyFilters)
</script>

<style scoped>
.job-applications-page {
  padding: 1.5rem;
}

.gap-3 {
  gap: 12px;
}

.gap-2 {
  gap: 8px;
}

@media (max-width: 768px) {
  .job-applications-page {
    padding: 1rem;
  }
}
</style>
