<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePermissionStore } from '@/stores/permission'
import { useAuthStore } from '@/stores/auth'
import { trainingService } from '@/services/api/training'
import type { StudentApplication, Training } from '@/types/training'
import { useSnackbar } from '@/composables/snackbar'
import { debounce } from 'lodash-es'

const { showError } = useSnackbar()

// Auth
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

// Permissions
const permissionStore = usePermissionStore()
const { hasPermission } = storeToRefs(permissionStore)

const hasCreatePermission = computed(() => hasPermission.value('CAN_CREATE_STUDENT_APPLICATION'))
const hasUpdatePermission = computed(() => hasPermission.value('CAN_UPDATE_STUDENT_APPLICATION'))
const hasDeletePermission = computed(() => hasPermission.value('CAN_DELETE_STUDENT_APPLICATION'))

// État
const applications = ref<StudentApplication[]>([])
const trainings = ref<Training[]>([])
const totalItems = ref(0)
const totalPages = computed(() => Math.ceil(totalItems.value / filters.page_size))

// Filtres
const filters = reactive({
  page: 1,
  page_size: 20,
  search: '',
  status: null as string | null,
  training_id: null as string | null,
  order_by: 'created_at',
  asc: 'desc',
})

const statusOptions = [
  { title: 'Reçue', value: 'RECEIVED' },
  { title: 'Refusée', value: 'REFUSED' },
  { title: 'Approuvée', value: 'APPROVED' },
]

// Fonctions
const fetchApplications = async () => {
  try {
    // Si l'utilisateur n'est pas un admin, on ne récupère que ses candidatures
    const filterWithUser = user.value?.is_admin
      ? filters
      : { ...filters, user_id: user.value?.id }

    const response = await trainingService.listApplications(filterWithUser)

    applications.value = response.data
    totalItems.value = response.total_number
  }
  catch (error) {
    showError('Erreur lors du chargement des candidatures')
  }
}

const fetchTrainings = async () => {
  try {
    const response = await trainingService.listTrainings({})

    trainings.value = response.data
  }
  catch (error) {
    showError('Erreur lors du chargement des formations')
  }
}

const getTrainingTitle = (id: string) => {
  const training = trainings.value.find(t => t.id === id)

  return training ? training.title : '-'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

// Recherche
const debouncedFilter = debounce(() => {
  filters.page = 1
  fetchApplications()
}, 300)

// Initialisation
onMounted(() => {
  fetchApplications()
  fetchTrainings()
})
</script>

<template>
  <div class="training-applications-index-page">
    <VCard>
      <VCardTitle class="d-flex justify-space-between align-center pa-4">
        <div>
          <h1 class="text-h5">
            Candidatures aux formations
          </h1>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Gérer les candidatures aux formations
          </p>
        </div>

        <VBtn v-if="hasCreatePermission" color="primary" prepend-icon="ri-add-line"
          :to="{ name: 'training-applications-create' }">
          Nouvelle candidature
        </VBtn>
      </VCardTitle>

      <VCardText>
        <VRow>
          <VCol cols="12" md="4">
            <VSelect v-model="filters.training_id" :items="trainings" label="Formation" item-title="title"
              item-value="id" clearable hide-details @update:model-value="fetchApplications" />
          </VCol>

          <VCol cols="12" md="4">
            <VSelect v-model="filters.status" :items="statusOptions" label="Statut" clearable hide-details
              @update:model-value="fetchApplications" />
          </VCol>

          <VCol cols="12" md="4">
            <VTextField v-model="filters.search" label="Rechercher" prepend-inner-icon="ri-search-line" single-line
              hide-details @update:model-value="debouncedFilter" />
          </VCol>
        </VRow>

        <VTable class="mt-4">
          <thead>
            <tr>
              <th>N° de candidature</th>
              <th>Formation</th>
              <th>Statut</th>
              <th>Frais d'inscription</th>
              <th>Frais de formation</th>
              <th>Date de création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="application in applications" :key="application.id">
              <td>{{ application.application_number }}</td>
              <td>{{ getTrainingTitle(application.training_id) }}</td>
              <td>
                <VChip
                  :color="application.status === 'APPROVED' ? 'success' : (application.status === 'REFUSED' ? 'error' : 'warning')"
                  size="small">
                  {{ application.status }}
                </VChip>
              </td>
              <td>{{ application.registration_fee }} €</td>
              <td>{{ application.training_fee }} €</td>
              <td>{{ formatDate(application.created_at) }}</td>
              <td>
                <VBtn icon="ri-eye-line" size="small" variant="text"
                  :to="{ name: 'training-applications-detail', params: { id: application.id } }" />
                <VBtn v-if="hasUpdatePermission" icon="ri-edit-line" size="small" variant="text"
                  :to="{ name: 'training-applications-edit', params: { id: application.id } }" />
                <VBtn v-if="hasDeletePermission" icon="ri-delete-bin-line" size="small" variant="text" color="error"
                  @click="confirmDelete(application)" />
              </td>
            </tr>
          </tbody>
        </VTable>

        <VPagination v-model="filters.page" :length="totalPages" :total-visible="7" class="mt-4"
          @update:model-value="fetchApplications" />
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped>
.training-applications-index-page {
  padding: 2rem;
}
</style>
