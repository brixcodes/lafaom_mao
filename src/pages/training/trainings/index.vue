<template>
  <div class="trainings-page">
    <!-- En-tête -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 mb-2">
          <VIcon icon="ri-graduation-cap-line" class="me-3" color="primary" />
          Formations
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Gérez et consultez toutes les formations disponibles
        </p>
      </div>
      <VBtn prepend-icon="ri-add-line" color="primary" :to="{ name: 'training-trainings-create' }">
        Créer une formation
      </VBtn>
    </div>

    <!-- Filtres et recherche -->
    <VCard class="mb-6">
      <VCardText>
        <VRow>
          <VCol cols="12" md="3">
            <VTextField v-model="searchQuery" prepend-inner-icon="ri-search-line" label="Rechercher une formation..."
              variant="outlined" density="compact" clearable />
          </VCol>
          <VCol cols="12" md="3">
            <VSelect v-model="filterSpecialty" :items="specialtyOptions" label="Spécialité" variant="outlined"
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
          <span>{{ filteredTrainings.length }} sur {{ allTrainings.length }} formation(s) correspond(ent) aux
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
      <p class="text-body-1 text-medium-emphasis">Chargement des formations...</p>
    </div>

    <!-- Liste des formations -->
    <div v-else-if="hasTrainings">
      <VRow>
        <VCol v-for="training in trainings" :key="training.id" cols="12" sm="6" md="6" lg="4">
          <VCard class="mx-auto my-6">
            <!-- Header -->
            <VCardItem>
              <VCardTitle class="text-h6 line-clamp-2">Titre : {{ truncateText(training.title, 45) }}</VCardTitle>
              <VCardSubtitle class="d-flex align-center gap-1">
                <span class="text-body-2">Ref : {{ training.id }}</span>
              </VCardSubtitle>
            </VCardItem>

            <!-- Rating -->
            <VCardText>
              <VRow class="align-center mb-3">
                <VRating :model-value="4.5" color="amber" density="compact" size="small" half-increments readonly />
                <span class="text-grey text-caption ms-2">4.5 ({{ getRandomReviews() }})</span>
              </VRow>

              <!-- Details -->
              <VRow class="text-body-2 ma-0 pa-0" no-gutters>
                <VCol cols="12" md="8" class="d-flex align-center mb-2">
                  <VIcon icon="ri-bookmark-line" size="small" class="me-2 text-primary" />
                  <span>{{ getSpecialtyName(training.specialty_id) }}</span>
                </VCol>

                <VCol cols="12" md="4" class="d-flex align-center mb-2">
                  <VIcon icon="ri-time-line" size="small" class="me-2" />
                  <span>{{ formatDuration(training.duration, training.duration_unit) }}</span>
                </VCol>

                <VCol cols="12" md="8" class="d-flex align-center mb-2">
                  <VIcon icon="ri-map-pin-line" size="small" class="me-2" />
                  <span>{{ training.training_type === 'On-Site' ? 'En ligne' : 'En présentiel' }}</span>
                </VCol>

                <VCol cols="12" md="4" class="d-flex align-center mb-2">
                  <VIcon icon="ri-question-line" size="small" class="me-2" />
                  <span>{{ training.status === TrainingStatusEnum.ACTIVE ? 'Disponible' : 'Indisponible' }}</span>
                </VCol>

                <VCol cols="12" md="12" class="d-flex align-center mb-2">
                  <VIcon icon="ri-calendar-line" size="small" class="me-2" />
                  <span class="text-body-2">Créé le {{ formatDate(training.created_at) }}</span>
                </VCol>
              </VRow>

              <v-divider class="my-2"></v-divider>
              <!-- Actions -->
              <VCardActions>
                <VSpacer />
                <VBtn v-if="training.presentation || training.target_skills || training.program" variant="flat"
                  size="x-small" icon :ripple="false" @click="toggleTrainingDetails(training.id)"
                  aria-label="Toggle details">
                  <VIcon>
                    {{ expandedTrainings.has(training.id) ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line' }}
                  </VIcon>
                </VBtn>


                <VMenu offset-y>
                  <template #activator="{ props }">
                    <VBtn icon="ri-more-2-line" variant="flat" size="x-small" v-bind="props" />
                  </template>
                  <VList>
                    <VListItem prepend-icon="ri-eye-line" title="Voir les détails"
                      :to="{ name: 'training-trainings-detail', params: { id: training.id } }" />
                    <VListItem v-if="training.status === TrainingStatusEnum.ACTIVE" prepend-icon="ri-send-plane-line"
                      title="Candidater" @click="goToApply(training.id)" />
                    <VListItem prepend-icon="ri-edit-line" title="Modifier"
                      :to="{ name: 'training-trainings-edit', params: { id: training.id } }" />
                    <VListItem prepend-icon="ri-group-2-line" title="Voir les candidatures"
                      :to="{ name: 'training-applications-index', query: { training_id: training.id } }" />
                  </VList>
                </VMenu>
              </VCardActions>

              <!-- Expandable Details -->
              <v-expand-transition>
                <div v-show="expandedTrainings.has(training.id)">
                  <v-timeline align="start" density="compact" class="pa-3">
                    <v-timeline-item v-if="training.presentation" size="x-small">
                      <div class="font-weight-medium mb-2"><strong>Présentation</strong> :</div>
                      <div style="margin-left: 10px;" v-html="training.presentation"></div>
                    </v-timeline-item>

                    <v-timeline-item v-if="training.target_skills" size="x-small">
                      <div class="font-weight-medium mb-2"><strong>Compétences cibles</strong> :</div>
                      <div style="margin-left: 15px;" v-html="training.target_skills"></div>
                    </v-timeline-item>

                    <v-timeline-item v-if="training.program" size="x-small">
                      <div class="font-weight-medium mb-2"><strong>Programme détaillé</strong> :</div>
                      <div style="margin-left: 15px;" v-html="training.program"></div>
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
      <VIcon icon="ri-graduation-cap-line" size="120" color="medium-emphasis" class="mb-4" />
      <h2 class="text-h5 mb-4">
        {{ hasActiveFilters ? 'Aucun résultat' : "Aucune formation" }}
      </h2>
      <p class="text-body-1 text-medium-emphasis mb-6">
        {{
          hasActiveFilters
            ? 'Aucune formation ne correspond à vos critères de recherche.'
            : "Commencez par créer votre première formation."
        }}
      </p>
      <div class="d-flex justify-center gap-3">
        <VBtn v-if="hasActiveFilters" variant="outlined" prepend-icon="ri-refresh-line" @click="resetFilters">
          Réinitialiser les filtres
        </VBtn>
        <VBtn v-if="!hasActiveFilters" prepend-icon="ri-add-line" color="primary" size="large"
          :to="{ name: 'training-trainings-create' }">
          Créer ma première formation
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
import type { Training, TrainingStatus, TrainingFilter } from '@/types/training'
import { TrainingTypeEnum, TrainingStatus as TrainingStatusEnum, DurationEnum } from '@/types/training'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'

const router = useRouter()

// Expansion par formation
const expandedTrainings = ref<Set<string>>(new Set())
const toggleTrainingDetails = (id: string) => {
  if (expandedTrainings.value.has(id)) {
    expandedTrainings.value.delete(id)
  } else {
    expandedTrainings.value.add(id)
  }
}

// Utils
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

// State
const allTrainings = ref<Training[]>([])
const searchQuery = ref('')
const filterSpecialty = ref('')
const filterStatus = ref('')
const sortBy = ref('created_at')
const currentPage = ref(1)
const pageSize = ref(12)
const isInitialLoading = ref(true)
const isDeleting = ref(false)
const error = ref('')
const specialties = ref<{ id: number; name: string }[]>([])

// Computed pour filtrage côté client
const filteredTrainings = computed(() => {
  if (!allTrainings.value || !Array.isArray(allTrainings.value)) return []

  let filtered = [...allTrainings.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      training =>
        (training.title || '').toLowerCase().includes(query) ||
        (getSpecialtyName(training.specialty_id) || '').toLowerCase().includes(query) ||
        (training.presentation || '').toLowerCase().includes(query) ||
        (training.target_skills || '').toLowerCase().includes(query)
    )
  }

  if (filterSpecialty.value) {
    filtered = filtered.filter(training => training.specialty_id.toString() === filterSpecialty.value)
  }

  if (filterStatus.value) {
    filtered = filtered.filter(training => training.status === filterStatus.value)
  }

  filtered.sort((a, b) => {
    let aVal, bVal
    switch (sortBy.value) {
      case 'title':
        aVal = (a.title || '').toLowerCase()
        bVal = (b.title || '').toLowerCase()
        return aVal.localeCompare(bVal)
      case 'duration':
        aVal = a.duration || 0
        bVal = b.duration || 0
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
const paginatedTrainings = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredTrainings.value.slice(start, end)
})

const trainings = computed(() => paginatedTrainings.value)
const hasTrainings = computed(() => filteredTrainings.value.length > 0)
const isLoading = computed(() => isInitialLoading.value)

const totalPages = computed(() => Math.ceil(filteredTrainings.value.length / pageSize.value))

// Filtres actifs
const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' || filterSpecialty.value !== '' || filterStatus.value !== '' || sortBy.value !== 'created_at'
})


// Options filtres
const statusOptions = [
  { title: 'Tous les statuts', value: '' },
  { title: 'Actif', value: TrainingStatusEnum.ACTIVE },
  { title: 'Inactif', value: TrainingStatusEnum.INACTIVE },
]

const specialtyOptions = computed(() => [
  { title: 'Toutes les spécialités', value: '' },
  ...specialties.value.map(s => ({ title: s.name, value: s.id.toString() }))
])

const sortOptions = [
  { title: 'Plus récentes', value: 'created_at' },
  { title: 'Titre', value: 'title' },
  { title: 'Durée', value: 'duration' }
]

// Methods
const loadAllTrainings = async () => {
  try {
    isInitialLoading.value = true
    const response = await trainingService.listTrainings({ page: 1, page_size: 1000, order_by: 'created_at', asc: 'desc' })
    allTrainings.value = [...response.data]
  } catch (err) {
    console.error('Erreur lors du chargement des formations:', err)
    error.value = 'Erreur lors du chargement des formations'
  } finally {
    isInitialLoading.value = false
  }
}

const fetchSpecialties = async () => {
  try {
    const response = await trainingService.listSpecialties({})
    specialties.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement des spécialités:', error)
  }
}

const changePage = (page: number) => {
  currentPage.value = page
}

const confirmDelete = async (training: Training) => {
  const confirmed = await confirmAction({
    title: 'Êtes-vous sûr ?',
    text: `Souhaitez-vous réellement supprimer la formation "${training.title}" ?`,
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
    await trainingService.deleteTraining(training.id.toString())
    allTrainings.value = allTrainings.value.filter(t => t.id !== training.id)
    showToast({ message: 'Formation supprimée avec succès', type: 'success' })
  } catch (err) {
    console.error('Erreur lors de la suppression:', err)
    showToast({ message: 'Erreur lors de la suppression de la formation', type: 'error' })
  } finally {
    isDeleting.value = false
  }
}

const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR')

const clearError = () => {
  error.value = ''
}

const goToApply = (trainingId: number | string) => {
  const id = typeof trainingId === 'string' ? trainingId : trainingId.toString()
  console.log('Going to apply for training:', id, 'Type:', typeof id)
  router.push({ name: 'training-application-create', params: { trainingId: id } })
}

const resetFilters = () => {
  searchQuery.value = ''
  filterSpecialty.value = ''
  filterStatus.value = ''
  sortBy.value = 'created_at'
  currentPage.value = 1
}

// Helper functions
const getSpecialtyName = (specialtyId: number) => {
  const specialty = specialties.value.find(s => s.id === specialtyId)
  return specialty?.name || 'Spécialité inconnue'
}

const getTrainingTypeLabel = (type: string) => {
  return type === TrainingTypeEnum.ON_SITE ? 'En présentiel' : 'À distance'
}

const getTrainingTypeColor = (type: string) => {
  return type === TrainingTypeEnum.ON_SITE ? 'success' : 'info'
}

const getDurationUnitLabel = (unit: string) => {
  const labels = {
    [DurationEnum.HOURS]: ' heure(s)',
    [DurationEnum.DAYS]: ' jour(s)',
    [DurationEnum.MONTHS]: ' mois',
    [DurationEnum.YEARS]: ' année(s)'
  }
  return labels[unit as DurationEnum] || unit
}

const formatDuration = (duration: number, unit: string) => {
  const unitLabel = getDurationUnitLabel(unit)
  return `${duration}${unitLabel}`
}

const getTrainingStatusColor = (training: Training) => {
  return training.status === TrainingStatusEnum.ACTIVE ? 'success' : 'error'
}

const getTrainingStatusLabel = (training: Training) => {
  return training.status === TrainingStatusEnum.ACTIVE ? 'Actif' : 'Inactif'
}

const getRandomReviews = () => {
  return Math.floor(Math.random() * 50) + 10
}

// Lifecycle
onMounted(() => {
  loadAllTrainings()
  fetchSpecialties()
})

// Watchers
watch([searchQuery, filterSpecialty, filterStatus, sortBy], () => {
  currentPage.value = 1
})
</script>

<style scoped>
.trainings-page {
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
  .trainings-page {
    padding: 1rem;
  }
}
</style>