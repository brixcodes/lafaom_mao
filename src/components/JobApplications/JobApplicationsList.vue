<template>
  <VCard>
    <VCardTitle class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <VIcon icon="ri-file-user-line" class="mr-2" />
        Candidatures d'emploi
      </div>
      <VBtn color="primary" variant="flat" @click="refreshList" :loading="loading">
        <VIcon icon="ri-refresh-line" class="mr-2" />
        Actualiser
      </VBtn>
    </VCardTitle>

    <!-- Filtres -->
    <VCardText>
      <VRow class="mb-4">
        <VCol cols="12" md="3">
          <VTextField v-model="filters.search" label="Rechercher..." prepend-inner-icon="ri-search-line"
            variant="outlined" clearable hide-details @input="debouncedSearch" />
        </VCol>

        <VCol cols="12" md="3">
          <VSelect v-model="filters.status" :items="statusOptions" label="Statut" prepend-inner-icon="ri-filter-3-line"
            variant="outlined" clearable hide-details @update:model-value="fetchApplications" />
        </VCol>

        <VCol cols="12" md="3">
          <VTextField v-model="filters.job_offer_id" label="ID de l'offre" prepend-inner-icon="ri-briefcase-line"
            variant="outlined" clearable hide-details @input="debouncedSearch" />
        </VCol>

        <VCol cols="12" md="3">
          <VSelect v-model="filters.order_by" :items="sortOptions" label="Trier par" prepend-inner-icon="ri-sort-desc"
            variant="outlined" hide-details @update:model-value="fetchApplications" />
        </VCol>
      </VRow>


      <!-- Tableau des candidatures -->
      <VDataTableServer v-model:items-per-page="filters.page_size" v-model:page="filters.page" :headers="headers"
        :items="applications" :items-length="totalApplications" :loading="loading" class="elevation-1"
        @update:options="handleOptionsUpdate">
        <!-- Numéro de candidature -->
        <template #item.application_number="{ item }">
          <VChip color="primary" variant="tonal" size="small">
            {{ item.application_number }}
          </VChip>
        </template>

        <!-- Nom complet -->
        <template #item.candidate="{ item }">
          <div class="d-flex align-center">
            <VAvatar size="32" color="primary" class="mr-3">
              {{ getInitials(item.first_name, item.last_name) }}
            </VAvatar>
            <div>
              <div class="font-weight-medium">{{ item.first_name }} {{ item.last_name }}</div>
              <div class="text-caption text-medium-emphasis">{{ item.email }}</div>
            </div>
          </div>
        </template>

        <!-- Offre d'emploi -->
        <template #item.job_offer="{ item }">
          <div v-if="item.job_offer">
            <div class="font-weight-medium">{{ item.job_offer.title }}</div>
            <div class="text-caption text-medium-emphasis">{{ item.job_offer.reference }}</div>
          </div>
        </template>

        <!-- Statut -->
        <template #item.status="{ item }">
          <VChip :color="getStatusColor(item.status)" :text="getStatusLabel(item.status)" size="small"
            variant="tonal" />
        </template>

        <!-- Date de soumission -->
        <template #item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <div class="d-flex align-center">
            <VBtn size="small" variant="text" color="primary" @click="viewApplication(item)"
              :loading="viewingId === item.id">
              <VIcon icon="ri-eye-line" />
            </VBtn>

            <VMenu>
              <template #activator="{ props }">
                <VBtn size="small" variant="text" color="secondary" v-bind="props"
                  :loading="updatingStatusId === item.id">
                  <VIcon icon="ri-settings-line" />
                </VBtn>
              </template>

              <VList>
                <VListItem v-for="status in availableStatuses" :key="status.value"
                  @click="changeStatus(item, status.value)" :disabled="item.status === status.value">
                  <template #prepend>
                    <VIcon :icon="status.icon" :color="status.color" />
                  </template>
                  <VListItemTitle>{{ status.title }}</VListItemTitle>
                </VListItem>

                <VDivider />

                <VListItem @click="downloadApplicationData(item)" color="info">
                  <template #prepend>
                    <VIcon icon="ri-download-line" />
                  </template>
                  <VListItemTitle>Télécharger les données</VListItemTitle>
                </VListItem>

                <VListItem @click="deleteApplication(item)" color="error" :disabled="!canDeleteApplication(item)">
                  <template #prepend>
                    <VIcon icon="ri-delete-bin-line" />
                  </template>
                  <VListItemTitle>Supprimer</VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </div>
        </template>

        <!-- Footer personnalisé -->
        <template #bottom>
          <div class="d-flex align-center justify-space-between pa-4">
            <div class="text-caption text-medium-emphasis">
              {{ totalApplications }} candidature(s) au total
            </div>
            <VPagination v-model="filters.page" :length="Math.ceil(totalApplications / filters.page_size)"
              :total-visible="5" @update:model-value="fetchApplications" />
          </div>
        </template>
      </VDataTableServer>
    </VCardText>

    <!-- Dialog de confirmation pour changement de statut -->
    <VDialog v-model="statusDialog" max-width="400">
      <VCard>
        <VCardTitle>Changer le statut</VCardTitle>
        <VCardText>
          <p>Changer le statut de la candidature de
            <strong>{{ selectedApplication?.first_name }} {{ selectedApplication?.last_name }}</strong>
            vers <strong>{{ getStatusLabel(newStatus) }}</strong> ?
          </p>

          <VTextarea v-if="newStatus === 'rejected'" v-model="rejectionReason" label="Raison du refus"
            variant="outlined" rows="3" class="mt-4" />
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn color="primary" variant="text" @click="statusDialog = false">
            Annuler
          </VBtn>
          <VBtn color="primary" variant="flat" @click="confirmStatusChange" :loading="updatingStatusId">
            Confirmer
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Dialog de suppression -->
    <VDialog v-model="deleteDialog" max-width="400">
      <VCard>
        <VCardTitle class="text-error">Supprimer la candidature</VCardTitle>
        <VCardText>
          Êtes-vous sûr de vouloir supprimer la candidature de
          <strong>{{ selectedApplication?.first_name }} {{ selectedApplication?.last_name }}</strong> ?
          Cette action est irréversible.
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn color="primary" variant="text" @click="deleteDialog = false">
            Annuler
          </VBtn>
          <VBtn color="error" variant="flat" @click="confirmDelete" :loading="deletingId">
            Supprimer
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VCard>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { jobApplicationsService } from '@/services/api/job-offers'
import type { JobApplication, JobApplicationFilter } from '@/types/jobOffers'
import { debounce } from 'lodash-es'

const router = useRouter()

// State
const applications = ref<JobApplication[]>([])
const loading = ref(false)
const totalApplications = ref(0)
const viewingId = ref<number | null>(null)
const updatingStatusId = ref<number | null>(null)
const deletingId = ref<number | null>(null)

// Dialogs
const statusDialog = ref(false)
const deleteDialog = ref(false)
const selectedApplication = ref<JobApplication | null>(null)
const newStatus = ref('')
const rejectionReason = ref('')

// Filters
const filters = ref<JobApplicationFilter>({
  page: 1,
  page_size: 10,
  search: '',
  status: undefined,
  job_offer_id: undefined,
  order_by: 'created_at',
  asc: 'desc'
})

// Table headers
const headers = [
  { title: 'N° Candidature', key: 'application_number', sortable: true, width: '150px' },
  { title: 'Candidat', key: 'candidate', sortable: false, width: '250px' },
  { title: 'Offre d\'emploi', key: 'job_offer', sortable: false, width: '200px' },
  { title: 'Statut', key: 'status', sortable: true, width: '120px' },
  { title: 'Date de soumission', key: 'created_at', sortable: true, width: '150px' },
  { title: 'Actions', key: 'actions', sortable: false, width: '120px', align: 'center' }
]

// Options
const statusOptions = [
  { title: 'En attente', value: 'pending' },
  { title: 'En traitement', value: 'processing' },
  { title: 'Acceptée', value: 'accepted' },
  { title: 'Rejetée', value: 'rejected' },
  { title: 'Annulée', value: 'cancelled' }
]

const sortOptions = [
  { title: 'Date de création', value: 'created_at' },
  { title: 'Numéro de candidature', value: 'application_number' },
  { title: 'Statut', value: 'status' }
]

const availableStatuses = computed(() => [
  { title: 'Mettre en attente', value: 'pending', color: 'warning', icon: 'ri-time-line' },
  { title: 'Mettre en traitement', value: 'processing', color: 'info', icon: 'ri-loader-line' },
  { title: 'Accepter', value: 'accepted', color: 'success', icon: 'ri-check-circle-line' },
  { title: 'Rejeter', value: 'rejected', color: 'error', icon: 'ri-close-circle-line' },
  { title: 'Annuler', value: 'cancelled', color: 'secondary', icon: 'ri-forbid-line' }
])

// Methods
const fetchApplications = async () => {
  loading.value = true
  try {
    const response = await jobApplicationsService.getJobApplications(filters.value)
    applications.value = response.data || []
    totalApplications.value = response.total_number || 0
  } catch (error) {
    console.error('Erreur lors du chargement des candidatures:', error)
  } finally {
    loading.value = false
  }
}

const debouncedSearch = debounce(() => {
  filters.value.page = 1
  fetchApplications()
}, 500)

const handleOptionsUpdate = ({ page, itemsPerPage }: any) => {
  filters.value.page = page
  filters.value.page_size = itemsPerPage
  fetchApplications()
}

const refreshList = () => {
  fetchApplications()
}

const viewApplication = (application: JobApplication) => {
  viewingId.value = application.id
  router.push({
    name: 'job-application-detail',
    params: { id: application.id }
  })
}

const changeStatus = (application: JobApplication, status: string) => {
  selectedApplication.value = application
  newStatus.value = status
  rejectionReason.value = ''
  statusDialog.value = true
}

const confirmStatusChange = async () => {
  if (!selectedApplication.value) return

  try {
    updatingStatusId.value = selectedApplication.value.id

    await jobApplicationsService.updateJobApplicationStatus({
      application_id: selectedApplication.value.id,
      status: newStatus.value as any,
      reason: rejectionReason.value || undefined
    })

    statusDialog.value = false
    await fetchApplications()
  } catch (error) {
    console.error('Erreur lors du changement de statut:', error)
  } finally {
    updatingStatusId.value = null
  }
}

const deleteApplication = (application: JobApplication) => {
  selectedApplication.value = application
  deleteDialog.value = true
}

const confirmDelete = async () => {
  if (!selectedApplication.value) return

  try {
    deletingId.value = selectedApplication.value.id
    await jobApplicationsService.deleteJobApplication(selectedApplication.value.id)
    deleteDialog.value = false
    await fetchApplications()
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  } finally {
    deletingId.value = null
  }
}

const downloadApplicationData = async (application: JobApplication) => {
  try {
    // Créer un objet avec toutes les données de la candidature
    const data = {
      candidature: {
        numero: application.application_number,
        statut: getStatusLabel(application.status),
        date_soumission: application.created_at
      },
      candidat: {
        nom: application.last_name,
        prenom: application.first_name,
        email: application.email,
        telephone: application.phone_number,
        civilite: application.civility,
        code_pays: application.country_code,
        date_naissance: application.date_of_birth
      },
      offre: application.job_offer ? {
        titre: application.job_offer.title,
        reference: application.job_offer.reference,
        localisation: application.job_offer.location
      } : null
    }

    // Créer un fichier JSON
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })

    // Télécharger le fichier
    const url = window.URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `candidature_${application.application_number}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error)
  }
}

// Helpers
const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'pending': 'En attente',
    'processing': 'En traitement',
    'accepted': 'Acceptée',
    'rejected': 'Rejetée',
    'cancelled': 'Annulée'
  }
  return labels[status] || status
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'pending': 'warning',
    'processing': 'info',
    'accepted': 'success',
    'rejected': 'error',
    'cancelled': 'secondary'
  }
  return colors[status] || 'default'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const canDeleteApplication = (application: JobApplication) => {
  return ['pending', 'cancelled'].includes(application.status)
}

// Lifecycle
onMounted(() => {
  fetchApplications()
})
</script>

<style scoped>
.v-data-table-server :deep(.v-data-table__wrapper) {
  min-height: 400px;
}
</style>
