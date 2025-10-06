<template>
  <div class="specialties-page">
    <!-- En-tête -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 mb-2">
          <VIcon icon="ri-award-line" class="me-3" color="primary" />
          Spécialités
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Gérez et consultez toutes les spécialités disponibles
        </p>
      </div>
      <VBtn prepend-icon="ri-add-line" color="primary" :to="{ name: 'specialties-create' }" v-if="hasPermissions([PermissionEnum.CAN_CREATE_SPECIALTY])">
        Créer une spécialité
      </VBtn>
    </div>

    <!-- Filtres et recherche -->
    <VCard class="mb-6">
      <VCardText>
        <VRow>
          <VCol cols="12" md="6">
            <VTextField v-model="searchQuery" prepend-inner-icon="ri-search-line" label="Rechercher une spécialité..."
              variant="outlined" density="compact" clearable />
          </VCol>
          <VCol cols="12" md="3">
            <VSelect v-model="sortBy" :items="sortOptions" label="Trier par" variant="outlined" density="compact" />
          </VCol>
          <VCol cols="12" md="3">
            <VSelect v-model="itemsPerPage" :items="itemsPerPageOptions" label="Par page" variant="outlined"
              density="compact" />
          </VCol>
          <!-- <VCol cols="12" md="1" class="d-flex align-center">
            <VBtn variant="outlined" prepend-icon="ri-refresh-line" @click="resetFilters" :disabled="!hasActiveFilters">
              Reset
            </VBtn>
          </VCol> -->
        </VRow>
      </VCardText>
    </VCard>

    <!-- Indicateur de filtres actifs -->
    <div v-if="hasActiveFilters" class="mb-4">
      <VAlert type="info" variant="tonal" class="d-flex align-center">
        <div class="d-flex align-center flex-grow-1">
          <VIcon icon="ri-filter-line" class="me-2" />
          <span>{{ filteredSpecialties.length }} sur {{ allSpecialties.length }} spécialité(s) correspond(ent) aux
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
      <p class="text-body-1 text-medium-emphasis">Chargement des spécialités...</p>
    </div>

    <!-- Message d'erreur -->
    <VAlert v-if="error" type="error" class="mb-4" closable @click:close="clearError">
      {{ error }}
    </VAlert>

    <!-- Liste des spécialités -->
    <VCard v-else-if="hasSpecialties">
      <VCardText>
        <SpecialtyTable :specialties="filteredSpecialties" :headers="headers" :is-loading="isLoading"
          @detail="goToDetail" @edit="goToEdit" @delete="confirmDelete" />
      </VCardText>
    </VCard>

    <!-- État vide -->
    <div v-else class="text-center py-12">
      <VIcon icon="ri-award-line" size="80" class="text-disabled mb-4" />
      <h3 class="text-h5 mb-2">Aucune spécialité trouvée</h3>
      <p class="text-body-1 text-medium-emphasis mb-4">
        {{ hasActiveFilters ? 'Aucune spécialité ne correspond aux filtres appliqués.' : 'Commencez par créer votre première spécialité.' }}
      </p>
      <VBtn v-if="!hasActiveFilters" color="primary" prepend-icon="ri-add-line" :to="{ name: 'specialties-create' }">
        Créer une spécialité
      </VBtn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTrainingStore } from '@/stores/training'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'
import type { Specialty } from '@/types/specialties'
import SpecialtyTable from '@/components/Specialty/SpecialtyTable.vue'

import { PermissionEnum } from '@/types/permissions'
import { useInstantPermissions } from '@/composables/useInstantPermissions'
const { hasPermission, hasPermissions } = useInstantPermissions()

const router = useRouter()
const trainingStore = useTrainingStore()

// State
const searchQuery = ref('')
const sortBy = ref('name')
const itemsPerPage = ref(10)
const currentPage = ref(1)

// Computed
const isLoading = computed(() => trainingStore.isLoading)
const error = computed(() => trainingStore.error)
const specialties = computed(() => trainingStore.specialties)
const totalPages = computed(() => trainingStore.totalPages)
const allSpecialties = computed(() => trainingStore.specialties)

const hasSpecialties = computed(() => specialties.value.length > 0)
const hasActiveFilters = computed(() =>
  searchQuery.value !== '' ||
  sortBy.value !== 'name' ||
  itemsPerPage.value !== 10
)

const filteredSpecialties = computed(() => {
  let filtered = [...specialties.value]

  // Filtrage par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(specialty =>
      specialty.name.toLowerCase().includes(query) ||
      specialty.description?.toLowerCase().includes(query)
    )
  }

  // Tri
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'created_at':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      default:
        return 0
    }
  })

  return filtered
})

// Options
const sortOptions = [
  { title: 'Nom (A-Z)', value: 'name' },
  { title: 'Date de création', value: 'created_at' },
]

const itemsPerPageOptions = [
  { title: '10', value: 10 },
  { title: '25', value: 25 },
  { title: '50', value: 50 },
  { title: '100', value: 100 },
]

// Headers pour la DataTable
const headers = [
  { title: 'Spécialité', key: 'name', sortable: true },
  { title: 'Description', key: 'description', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, width: '120px' },
]

// Methods
const loadSpecialties = async () => {
  try {
    await trainingStore.loadSpecialties({
      page: currentPage.value,
      limit: itemsPerPage.value,
      search: searchQuery.value || undefined,
    })
  } catch (err) {
    console.error('Error loading specialties:', err)
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadSpecialties()
}

const resetFilters = () => {
  searchQuery.value = ''
  sortBy.value = 'name'
  itemsPerPage.value = 10
  currentPage.value = 1
  loadSpecialties()
}

const confirmDelete = async (specialty: Specialty) => {
  const confirmed = await confirmAction({
    title: 'Supprimer la spécialité',
    text: `Êtes-vous sûr de vouloir supprimer la spécialité "${specialty.name}" ? Cette action est irréversible.`,
    confirmButtonText: '<span style="color:white">Supprimer</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })

  if (confirmed) {
    try {
      await trainingStore.deleteSpecialty(specialty.id)
      showToast({ message: 'Spécialité supprimée avec succès', type: 'success' })
      loadSpecialties()
    } catch (err) {
      console.error('Error deleting specialty:', err)
      showToast({ message: 'Erreur lors de la suppression', type: 'error' })
    }
  }
}

const clearError = () => {
  trainingStore.clearError()
}

// Navigation methods
const goToDetail = (id: string) => {
  router.push({ name: 'specialties-detail', params: { id } })
}

const goToEdit = (id: string) => {
  router.push({ name: 'specialties-edit', params: { id } })
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

// Watchers
watch([searchQuery, sortBy, itemsPerPage], () => {
  currentPage.value = 1
  loadSpecialties()
}, { deep: true })

// Lifecycle
onMounted(() => {
  loadSpecialties()
})

// Export methods for template
defineExpose({
  goToDetail,
  goToEdit,
  confirmDelete,
  clearError
})
</script>

<style scoped>
.specialties-page {
  padding: 24px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
