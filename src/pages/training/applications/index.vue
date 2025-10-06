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
    const response = await trainingService.getTrainings({})

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

// Statistiques
const totalApplicationsCount = computed(() => applications.value.length)

const getStatusCount = (status: string) => {
  return applications.value.filter(app => app.status === status).length
}

const getPaidCount = () => {
  return applications.value.filter(app => app.payment_id).length
}

const getUnpaidCount = () => {
  return applications.value.filter(app => !app.payment_id).length
}

// Fonction pour obtenir la couleur du statut
const getStatusColor = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return 'success'
    case 'REFUSED':
      return 'error'
    case 'RECEIVED':
      return 'warning'
    default:
      return 'primary'
  }
}

// Fonction pour mettre à jour le statut d'une candidature
const updateApplicationStatus = async (application: any) => {
  try {
    // Ici, vous devrez appeler l'API pour mettre à jour le statut
    // Pour l'instant, on affiche juste un message
    console.log('Mise à jour du statut pour la candidature:', application.id, 'nouveau statut:', application.status)
    
    // TODO: Appeler l'API pour mettre à jour le statut
    // await trainingService.updateApplicationStatus(application.id, { status: application.status })
    
    showError('Fonctionnalité de mise à jour du statut en cours de développement')
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error)
    showError('Erreur lors de la mise à jour du statut')
  }
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
        <!-- Statistiques -->
        <VRow class="mb-6">
          <VCol cols="12" sm="6" md="3">
            <VCard class="total-applications-card" elevation="2">
              <VCardText class="d-flex align-center">
                <div class="stats-icon">
                  <VIcon icon="ri-file-list-line" size="50" />
                </div>
                <div class="flex-grow-1">
                  <div class="stats-value">{{ totalApplicationsCount.toLocaleString() }}</div>
                  <div>Total Candidatures</div>
                </div>
              </VCardText>
            </VCard>
          </VCol>

          <VCol cols="12" sm="6" md="3">
            <VCard class="submitted-applications-card" elevation="2">
              <VCardText class="d-flex align-center">
                <div class="stats-icon">
                  <VIcon icon="ri-user-heart-line" size="50" />
                </div>
                <div class="flex-grow-1">
                  <div class="stats-value">{{ getStatusCount('RECEIVED').toLocaleString() }}</div>
                  <div>Reçues</div>
                </div>
              </VCardText>
            </VCard>
          </VCol>

          <VCol cols="12" sm="6" md="3">
            <VCard class="approved-applications-card" elevation="2">
              <VCardText class="d-flex align-center">
                <div class="stats-icon">
                  <VIcon icon="ri-user-follow-line" size="50" />
                </div>
                <div class="flex-grow-1">
                  <div class="stats-value">{{ getStatusCount('APPROVED').toLocaleString() }}</div>
                  <div>Approuvées</div>
                </div>
              </VCardText>
            </VCard>
          </VCol>

          <VCol cols="12" sm="6" md="3">
            <VCard class="refused-applications-card" elevation="2">
              <VCardText class="d-flex align-center">
                <div class="stats-icon">
                  <VIcon icon="ri-user-unfollow-line" size="50" />
                </div>
                <div class="flex-grow-1">
                  <div class="stats-value">{{ getStatusCount('REFUSED').toLocaleString() }}</div>
                  <div>Refusées</div>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>

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
                <VSelect
                  v-model="application.status"
                  :items="statusOptions"
                  variant="outlined"
                  density="compact"
                  hide-details
                  @update:model-value="updateApplicationStatus(application)"
                  :disabled="!hasUpdatePermission"
                >
                  <template #selection="{ item }">
                    <VChip
                      :color="getStatusColor(item.value)"
                      size="small"
                      class="ma-1"
                    >
                      {{ item.title }}
                    </VChip>
                  </template>
                </VSelect>
              </td>
              <td>{{ application.registration_fee }} €</td>
              <td>{{ application.training_fee }} €</td>
              <td>{{ formatDate(application.created_at) }}</td>
              <td>
                <VBtn icon="ri-eye-line" size="small" variant="text"
                  :to="{ name: 'student-applications-detail', params: { id: application.id } }" />
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

/* Statistiques */
.stats-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.stats-value {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 4px;
}

.total-applications-card .stats-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.submitted-applications-card .stats-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.approved-applications-card .stats-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.refused-applications-card .stats-icon {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.total-applications-card {
  border-left: 4px solid #667eea;
}

.submitted-applications-card {
  border-left: 4px solid #f093fb;
}

.approved-applications-card {
  border-left: 4px solid #4facfe;
}

.refused-applications-card {
  border-left: 4px solid #fa709a;
}
</style>
