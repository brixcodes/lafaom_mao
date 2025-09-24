<template>
  <div class="training-sessions-page">
    <!-- En-tête -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 mb-2">
          <VIcon icon="ri-calendar-line" class="me-3" color="primary" />
          Sessions de Formation
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Gérez et consultez toutes les sessions de formation disponibles
        </p>
      </div>
      <VBtn prepend-icon="ri-add-line" color="primary" :to="{ name: 'training-sessions-create' }">
        Créer une session
      </VBtn>
    </div>

    <!-- Filtres et recherche -->
    <VCard class="mb-6">
      <VCardText>
        <VRow>
          <VCol cols="12" md="3">
            <VTextField v-model="searchQuery" prepend-inner-icon="ri-search-line" label="Rechercher une session..."
              variant="outlined" density="compact" clearable />
          </VCol>
          <VCol cols="12" md="3">
            <VSelect v-model="filterTraining" :items="trainingOptions" label="Formation" variant="outlined"
              density="compact" clearable />
          </VCol>
          <VCol cols="12" md="3">
            <VSelect v-model="filterStatus" :items="statusOptions" label="Statut" variant="outlined" density="compact"
              clearable />
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
          <span>{{ filteredSessions.length }} sur {{ allSessions.length }} session(s) correspond(ent) aux
            filtres</span>
        </div>
        <VBtn variant="text" size="small" prepend-icon="ri-close-line" @click="resetFilters">
          Effacer
        </VBtn>
      </VAlert>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="text-center py-12">
      <VProgressCircular indeterminate size="60" width="6" color="primary" class="mb-4" />
      <p class="text-body-1 text-medium-emphasis">Chargement des sessions...</p>
    </div>

    <!-- Liste des sessions -->
    <div v-else-if="hasSessions">
      <VRow>
        <VCol v-for="session in sessions" :key="session.id" cols="12" sm="6" md="6" lg="4">
          <VCard class="mx-auto my-6">
            <!-- Header -->
            <VCardItem>
              <VCardTitle class="text-h6 line-clamp-2">{{ getTrainingName(session.training_id) }}</VCardTitle>
              <VCardSubtitle class="d-flex align-center gap-1">
                <span class="text-body-2">Ref : {{ session.id }}</span>
              </VCardSubtitle>
            </VCardItem>

            <!-- Rating -->
            <VCardText>

              <!-- Details -->
              <VRow class="text-body-2 ma-0 pa-0" no-gutters>
                <VCol cols="12" md="12" class="d-flex align-center mb-2">
                  <VIcon icon="ri-graduation-cap-line" size="small" class="me-2" />
                  <span>{{ getTrainingName(session.training_id) }}</span>
                </VCol>

                <VCol cols="12" md="12" class="d-flex align-center mb-2">
                  <VIcon icon="ri-calendar-line" size="small" class="me-2" />
                  <span>Période : {{ formatDate(session.start_date) }} - {{ formatDate(session.end_date) }}</span>
                </VCol>

                <VCol cols="12" md="12" class="d-flex align-center mb-2">
                  <VIcon icon="ri-money-euro-circle-line" size="small" class="me-2" />
                  <span>Frais de formation : {{ formatCurrency(session.training_fee) }}</span>
                </VCol>

                <VCol cols="12" md="12" class="d-flex align-center mb-2">
                  <VIcon icon="ri-money-euro-circle-line" size="small" class="me-2" />
                  <span>Frais d'inscription : {{ formatCurrency(session.registration_fee) }}</span>
                </VCol>

                <VCol cols="12" md="12" class="d-flex align-center mb-2">
                  <VIcon icon="ri-user-line" size="small" class="me-2" />
                  <span>Places disponibles : {{ session.available_slots || 0 }} places</span>
                </VCol>

                <VCol cols="12" md="12" class="d-flex align-center mb-2">
                  <VIcon icon="ri-time-line" size="small" class="me-2" />
                  <span class="text-body-2">Inscription jusqu'au {{ formatDate(session.registration_deadline) }}</span>
                </VCol>

                <VCol cols="12" md="12" class="d-flex align-center mb-2">
                  <VIcon icon="ri-time-line" size="small" class="me-2" />
                  statut session :
                  <v-chip size="x-small" class="mx-1" :color="getSessionStatusColor(session.status)"
                    style="font-size: 10px; font-weight: bold;">
                    {{ getSessionStatusLabel(session.status) }}
                  </v-chip>
                </VCol>
              </VRow>

              <v-divider class="my-2"></v-divider>

              <!-- Actions -->
              <VCardActions>
                <VSpacer />
                <VMenu offset-y>
                  <template #activator="{ props }">
                    <VBtn icon="ri-more-2-line" variant="flat" size="x-small" v-bind="props" />
                  </template>
                  <VList>
                    <VListItem prepend-icon="ri-eye-line" title="Voir les détails"
                      :to="{ name: 'training-sessions-detail', params: { id: session.id } }" />
                    <VListItem prepend-icon="ri-edit-line" title="Modifier"
                      :to="{ name: 'training-sessions-edit', params: { id: session.id } }" />
                    <VListItem  prepend-icon="ri-delete-bin-line" title="Supprimer"
                       @click="confirmDelete(session)" />
                  </VList>
                </VMenu>
              </VCardActions>

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
      <VIcon icon="ri-calendar-line" size="120" color="medium-emphasis" class="mb-4" />
      <h2 class="text-h5 mb-4">
        {{ hasActiveFilters ? 'Aucun résultat' : "Aucune session" }}
      </h2>
      <p class="text-body-1 text-medium-emphasis mb-6">
        {{
          hasActiveFilters
            ? 'Aucune session ne correspond à vos critères de recherche.'
            : "Commencez par créer votre première session."
        }}
      </p>
      <div class="d-flex justify-center gap-3">
        <VBtn v-if="hasActiveFilters" variant="outlined" prepend-icon="ri-refresh-line" @click="resetFilters">
          Réinitialiser les filtres
        </VBtn>
        <VBtn v-if="!hasActiveFilters" prepend-icon="ri-add-line" color="primary" size="large"
          :to="{ name: 'training-sessions-create' }">
          Créer ma première session
        </VBtn>
      </div>
    </div>

    <!-- Message d'erreur -->
    <VAlert v-if="error" type="error" class="mt-4" closable @click:close="clearError">
      {{ error }}
    </VAlert>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { trainingService } from '@/services/api/training'
import type { TrainingSession } from '@/types/training'
import { TrainingSessionStatusEnum } from '@/types/training'
import { usePermissions } from '@/composables/usePermissions'
import { TrainingPermission } from '@/types/permissions'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'

const router = useRouter()
const { hasPermission } = usePermissions()

// Expansion par session
const expandedSessions = ref<Set<string>>(new Set())
const toggleSessionDetails = (id: string) => {
  if (expandedSessions.value.has(id)) {
    expandedSessions.value.delete(id)
  } else {
    expandedSessions.value.add(id)
  }
}

// Utils
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

// State
const allSessions = ref<TrainingSession[]>([])
const searchQuery = ref('')
const filterTraining = ref('')
const filterStatus = ref('')
const sortBy = ref('created_at')
const currentPage = ref(1)
const pageSize = ref(12)
const isInitialLoading = ref(true)
const isDeleting = ref(false)
const error = ref('')
const trainings = ref<{ id: string; title: string }[]>([])

// Computed pour filtrage côté client
const filteredSessions = computed(() => {
  if (!allSessions.value || !Array.isArray(allSessions.value)) return []

  let filtered = [...allSessions.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      session =>
        (getTrainingName(session.training_id) || '').toLowerCase().includes(query) ||
        (session.id || '').toLowerCase().includes(query)
    )
  }

  if (filterTraining.value) {
    filtered = filtered.filter(session => session.training_id === filterTraining.value)
  }

  if (filterStatus.value) {
    filtered = filtered.filter(session => session.status === filterStatus.value)
  }

  filtered.sort((a, b) => {
    let aVal, bVal
    switch (sortBy.value) {
      case 'start_date':
        aVal = a.start_date ? new Date(a.start_date).getTime() : 0
        bVal = b.start_date ? new Date(b.start_date).getTime() : 0
        return aVal - bVal
      case 'training_fee':
        aVal = a.training_fee || 0
        bVal = b.training_fee || 0
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
const paginatedSessions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredSessions.value.slice(start, end)
})

const sessions = computed(() => paginatedSessions.value)
const hasSessions = computed(() => filteredSessions.value.length > 0)
const isLoading = computed(() => isInitialLoading.value)

const totalPages = computed(() => Math.ceil(filteredSessions.value.length / pageSize.value))

// Filtres actifs
const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' || filterTraining.value !== '' || filterStatus.value !== '' || sortBy.value !== 'created_at'
})

// Permissions
const hasUpdatePermission = computed(() => hasPermission(TrainingPermission.EDIT_TRAINING))
const hasDeletePermission = computed(() => hasPermission(TrainingPermission.DELETE_TRAINING))

// Options filtres
const statusOptions = [
  { title: 'Tous les statuts', value: '' },
  { title: 'Ouverte aux inscriptions', value: TrainingSessionStatusEnum.OPEN_FOR_REGISTRATION },
  { title: 'Fermée aux inscriptions', value: TrainingSessionStatusEnum.CLOSE_FOR_REGISTRATION },
  { title: 'En cours', value: TrainingSessionStatusEnum.ONGOING },
  { title: 'Terminée', value: TrainingSessionStatusEnum.COMPLETED },
]

const trainingOptions = computed(() => [
  { title: 'Toutes les formations', value: '' },
  ...trainings.value.map(t => ({ title: t.title, value: t.id }))
])

const sortOptions = [
  { title: 'Plus récentes', value: 'created_at' },
  { title: 'Date de début', value: 'start_date' },
  { title: 'Frais de formation', value: 'training_fee' }
]

// Methods
const loadAllSessions = async () => {
  try {
    isInitialLoading.value = true
    const response = await trainingService.listTrainingSessions({ page: 1, page_size: 1000, order_by: 'created_at', asc: 'desc' })
    allSessions.value = [...response.data]
  } catch (err) {
    console.error('Erreur lors du chargement des sessions:', err)
    error.value = 'Erreur lors du chargement des sessions'
  } finally {
    isInitialLoading.value = false
  }
}

const fetchTrainings = async () => {
  try {
    const response = await trainingService.listTrainings({ page: 1, page_size: 1000 })
    trainings.value = response.data.map(t => ({ id: t.id, title: t.title }))
  } catch (error) {
    console.error('Erreur lors du chargement des formations:', error)
  }
}

const changePage = (page: number) => {
  currentPage.value = page
}

const confirmDelete = async (session: TrainingSession) => {
  const confirmed = await confirmAction({
    title: 'Êtes-vous sûr ?',
    html: `Souhaitez-vous réellement supprimer la session <b>${getTrainingName(session.training_id)}</b> ?`,
    confirmButtonText: `<span style="color:white">Supprimer</span>`,
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })

  if (!confirmed) return

  try {
    isDeleting.value = true
    await trainingService.deleteTrainingSession(session.id.toString())
    allSessions.value = allSessions.value.filter(s => s.id !== session.id)
    showToast({ message: 'Session supprimée avec succès', type: 'success' })
  } catch (err) {
    console.error('Erreur lors de la suppression:', err)
    showToast({ message: 'Erreur lors de la suppression de la session', type: 'error' })
  } finally {
    isDeleting.value = false
  }
}

const formatDate = (date: string | undefined) => {
  if (!date) return 'Non définie'
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatCurrency = (amount: number | undefined) => {
  if (!amount) return 'Non défini'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

const clearError = () => {
  error.value = ''
}

const resetFilters = () => {
  searchQuery.value = ''
  filterTraining.value = ''
  filterStatus.value = ''
  sortBy.value = 'created_at'
  currentPage.value = 1
}

// Helper functions
const getTrainingName = (trainingId: string) => {
  const training = trainings.value.find(t => t.id === trainingId)
  return training?.title || 'Formation inconnue'
}

const getSessionStatusLabel = (status: string) => {
  const labels = {
    [TrainingSessionStatusEnum.OPEN_FOR_REGISTRATION]: 'Ouverte',
    [TrainingSessionStatusEnum.CLOSE_FOR_REGISTRATION]: 'Fermée',
    [TrainingSessionStatusEnum.ONGOING]: 'En cours',
    [TrainingSessionStatusEnum.COMPLETED]: 'Terminée'
  }
  return labels[status as TrainingSessionStatusEnum] || status
}

const getSessionStatusColor = (status: string) => {
  const colors = {
    [TrainingSessionStatusEnum.OPEN_FOR_REGISTRATION]: 'success',
    [TrainingSessionStatusEnum.CLOSE_FOR_REGISTRATION]: 'warning',
    [TrainingSessionStatusEnum.ONGOING]: 'info',
    [TrainingSessionStatusEnum.COMPLETED]: 'grey'
  }
  return colors[status as TrainingSessionStatusEnum] || 'grey'
}

const getRandomReviews = () => {
  return Math.floor(Math.random() * 50) + 10
}

// Lifecycle
onMounted(() => {
  loadAllSessions()
  fetchTrainings()
})

// Watchers
watch([searchQuery, filterTraining, filterStatus, sortBy], () => {
  currentPage.value = 1
})
</script>

<style scoped>
.training-sessions-page {
  padding: 1.5rem;
}

.gap-3 {
  gap: 12px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .training-sessions-page {
    padding: 1rem;
  }
}
</style>