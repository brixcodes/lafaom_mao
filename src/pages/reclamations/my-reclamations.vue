<template>
  <VContainer fluid>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">Mes réclamations</h1>
        <p class="text-body-1 text-medium-emphasis">
          Gérez vos réclamations et suivez leur traitement
        </p>
      </div>
      <VBtn color="primary" @click="goToCreateReclamation" prepend-icon="ri-add-line">
        Nouvelle réclamation
      </VBtn>
    </div>

    <!-- Statistiques -->
    <VRow class="mb-1">
      <VCol cols="12" sm="6" md="3">
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VIcon color="primary" size="large" class="mr-3">ri-file-text-line</VIcon>
              <div>
                <div class="text-h4 font-weight-bold">{{ totalReclamationsCount }}</div>
                <div class="text-body-2 text-medium-emphasis">Total réclamations</div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VIcon color="info" size="large" class="mr-3">ri-add-circle-line</VIcon>
              <div>
                <div class="text-h4 font-weight-bold">{{ getStatusCount(ReclamationStatusEnum.NEW) }}</div>
                <div class="text-body-2 text-medium-emphasis">Nouvelles</div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VIcon color="warning" size="large" class="mr-3">ri-time-line</VIcon>
              <div>
                <div class="text-h4 font-weight-bold">{{ getStatusCount(ReclamationStatusEnum.IN_PROGRESS) }}</div>
                <div class="text-body-2 text-medium-emphasis">En cours</div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VIcon color="success" size="large" class="mr-3">ri-check-circle-line</VIcon>
              <div>
                <div class="text-h4 font-weight-bold">{{ getStatusCount(ReclamationStatusEnum.CLOSED) }}</div>
                <div class="text-body-2 text-medium-emphasis">Fermées</div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Filtres et recherche -->
    <VCard class="mb-6">
      <VCardText>
        <VRow>
          <VCol cols="12" md="5">
            <VTextField v-model="searchQuery" label="Rechercher..." placeholder="Numéro, candidature, sujet..."
              prepend-inner-icon="ri-search-line" variant="outlined" clearable @input="handleSearch"
              @clear="handleSearch('')" />
          </VCol>

          <VCol cols="12" md="2">
            <VSelect v-model="filters.status" :items="statusOptions" label="Statut" placeholder="Tous les statuts"
              variant="outlined" clearable @update:model-value="handleFilterChange" />
          </VCol>

          <VCol cols="12" md="2">
            <VSelect v-model="filters.priority" :items="priorityOptions" label="Priorité"
              placeholder="Toutes les priorités" variant="outlined" clearable
              @update:model-value="handleFilterChange" />
          </VCol>

          <VCol cols="12" md="3">
            <VSelect v-model="filters.reclamation_type" :items="reclamationTypeOptions" label="Type"
              placeholder="Tous les types" variant="outlined" clearable @update:model-value="handleFilterChange" />
          </VCol>

          <!-- <VCol cols="12" md="2" class="d-flex align-center">
            <VBtn variant="outlined" @click="clearFilters" :disabled="!hasActiveFilters">
              <VIcon class="mr-2">ri-filter-off-line</VIcon>
              Effacer
            </VBtn>
          </VCol> -->
        </VRow>
      </VCardText>
    </VCard>

    <!-- Filtres -->
    <VCard class="mb-5">
      <VCardText>
        <VTextField
          v-model="searchQuery"
          label="Rechercher dans mes réclamations"
          clearable
          prepend-inner-icon="ri-search-line"
          @input="searchReclamations"
        />
      </VCardText>
    </VCard>

    <!-- Table des réclamations -->
    <ReclamationTable
      :reclamations="filteredReclamations"
      :headers="headers"
      :isLoading="isLoading"
      @view="handleView"
    />

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="d-flex justify-center mt-6">
      <VPagination 
        v-model="currentPage" 
        :length="totalPages" 
        :total-visible="5"
        @update:model-value="loadMyReclamations(true)" 
      />
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReclamation } from '@/composables/useReclamation'
import { ReclamationStatusEnum, ReclamationPriorityEnum } from '@/types/reclamation'
import ReclamationTable from '@/components/reclamation/ReclamationTable.vue'

// Router
const router = useRouter()

// Composable
const {
  reclamations,
  reclamationTypes,
  isLoading,
  error,
  currentPage,
  totalCount,
  searchQuery,
  filters,
  filteredReclamations,
  totalPages,
  loadMyReclamations,
  loadReclamationTypes,
  searchReclamations,
  applyFilters,
  clearFilters,
  getStatusConfig,
  getPriorityConfig
} = useReclamation()

// Options
const statusOptions = [
  { title: 'Nouvelle', value: ReclamationStatusEnum.NEW },
  { title: 'En cours', value: ReclamationStatusEnum.IN_PROGRESS },
  { title: 'Fermée', value: ReclamationStatusEnum.CLOSED }
]

const priorityOptions = [
  { title: 'Faible', value: ReclamationPriorityEnum.LOW },
  { title: 'Moyenne', value: ReclamationPriorityEnum.MEDIUM },
  { title: 'Élevée', value: ReclamationPriorityEnum.HIGH }
]

const reclamationTypeOptions = computed(() =>
  reclamationTypes.value.map(type => ({
    title: type.name,
    value: type.id
  }))
)

// Headers pour la table
const headers = [
  { title: 'Numéro', key: 'reclamation_number', sortable: true },
  { title: 'Candidature', key: 'application_number', sortable: true },
  { title: 'Priorité', key: 'priority', sortable: true },
  { title: 'Statut', key: 'status', sortable: true },
  { title: 'Date', key: 'created_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Computed
const totalReclamationsCount = computed(() => reclamations.value.length)

const hasActiveFilters = computed(() => {
  return Object.keys(filters.value).some(key =>
    filters.value[key as keyof typeof filters.value] !== undefined &&
    filters.value[key as keyof typeof filters.value] !== ''
  )
})

// Methods
const handleSearch = async (query: string) => {
  await searchReclamations(query)
}

const handleFilterChange = async () => {
  await applyFilters(filters.value)
}

const handleView = (id: number) => {
  router.push({ name: 'my-reclamations-detail', params: { id } })
}

const goToCreateReclamation = () => {
  router.push({ name: 'my-reclamations-create' })
}


const getStatusCount = (status: ReclamationStatusEnum) => {
  return reclamations.value.filter(r => r.status === status).length
}

// Lifecycle
onMounted(() => {
  loadMyReclamations(true)
  loadReclamationTypes()
})
</script>
