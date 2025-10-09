<template>
  <div class="cabinet-applications-page">
    <!-- En-tête -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 mb-2">
          <VIcon icon="ri-building-line" class="me-3" color="primary" />
          Candidatures Cabinet
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Gérez les candidatures de cabinets partenaires et suivez leur progression
        </p>
      </div>
      <VBtn prepend-icon="ri-add-line" color="primary" :to="{ name: 'cabinet-application-create' }"
        v-if="hasPermissions([PermissionEnum.CAN_CREATE_JOB_OFFER])">
        Nouvelle candidature
      </VBtn>
    </div>

    <!-- Statistiques -->
    <VRow class="mb-6" v-if="stats">
      <VCol cols="12" sm="6" md="3">
        <VCard>
          <VCardText class="d-flex align-center">
            <VIcon icon="ri-file-list-line" size="40" color="primary" class="me-3" />
            <div>
              <div class="text-h6">{{ stats.total_applications }}</div>
              <div class="text-body-2 text-medium-emphasis">Total candidatures</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" md="3">
        <VCard>
          <VCardText class="d-flex align-center">
            <VIcon icon="ri-time-line" size="40" color="warning" class="me-3" />
            <div>
              <div class="text-h6">{{ stats.pending_applications }}</div>
              <div class="text-body-2 text-medium-emphasis">En attente</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" md="3">
        <VCard>
          <VCardText class="d-flex align-center">
            <VIcon icon="ri-check-line" size="40" color="success" class="me-3" />
            <div>
              <div class="text-h6">{{ stats.approved_applications }}</div>
              <div class="text-body-2 text-medium-emphasis">Approuvées</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" md="3">
        <VCard>
          <VCardText class="d-flex align-center">
            <VIcon icon="ri-money-euro-circle-line" size="40" color="info" class="me-3" />
            <div>
              <div class="text-h6">{{ formatCurrency(stats.total_revenue) }}</div>
              <div class="text-body-2 text-medium-emphasis">Revenus totaux</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Filtres et recherche -->
    <VCard class="mb-6">
      <VCardText>
        <VRow>
          <VCol cols="12" md="4">
            <VTextField v-model="searchQuery" prepend-inner-icon="ri-search-line" label="Rechercher une candidature..."
              variant="outlined" density="compact" clearable />
          </VCol>
          <VCol cols="12" md="3">
            <VSelect v-model="filterStatus" :items="statusOptions" label="Statut" variant="outlined" density="compact"
              clearable />
          </VCol>
          <VCol cols="12" md="3">
            <VSelect v-model="filterPaymentStatus" :items="paymentStatusOptions" label="Statut paiement"
              variant="outlined" density="compact" clearable />
          </VCol>
          <VCol cols="12" md="2">
            <VBtn variant="outlined" prepend-icon="ri-refresh-line" @click="resetFilters" :disabled="!hasActiveFilters"
              block>
              Reset
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Indicateur de filtres actifs -->
    <div v-if="hasActiveFilters" class="mb-4">
      <VChip v-if="searchQuery" closable @click:close="searchQuery = ''" class="me-2 mb-2">
        Recherche: "{{ searchQuery }}"
      </VChip>
      <VChip v-if="filterStatus" closable @click:close="filterStatus = ''" class="me-2 mb-2">
        Statut: {{ getStatusLabel(filterStatus) }}
      </VChip>
      <VChip v-if="filterPaymentStatus" closable @click:close="filterPaymentStatus = ''" class="me-2 mb-2">
        Paiement: {{ getPaymentStatusLabel(filterPaymentStatus) }}
      </VChip>
    </div>

    <!-- Liste des candidatures -->
    <div v-if="isLoading" class="d-flex justify-center py-8">
      <VProgressCircular indeterminate color="primary" size="64" />
    </div>

    <div v-else-if="error" class="d-flex justify-center py-8">
      <VAlert type="error" variant="tonal">
        {{ error }}
      </VAlert>
    </div>

    <div v-else-if="!hasApplications" class="d-flex flex-column align-center py-8">
      <VIcon icon="ri-building-line" size="64" color="disabled" class="mb-4" />
      <h3 class="text-h6 mb-2">Aucune candidature de cabinet trouvée</h3>
      <p class="text-body-2 text-medium-emphasis mb-4">
        {{ hasActiveFilters ? 'Aucune candidature ne correspond à vos critères de recherche.' : 'Aucune candidature de
        cabinet n\'a été soumise pour le moment.' }}
      </p>
      <VBtn v-if="!hasActiveFilters" color="primary" :to="{ name: 'cabinet-application-create' }">
        Soumettre la première candidature
      </VBtn>
    </div>

    <div v-else>
      <VRow>
        <VCol v-for="application in paginatedApplications" :key="application.id" cols="12" sm="6" md="6" lg="4">
          <VCard class="mx-auto my-6">
            <!-- Header -->
            <VCardItem>
              <VCardTitle class="text-h6 line-clamp-2">{{ application.company_name }}</VCardTitle>
              <VCardSubtitle class="d-flex align-center gap-1">
                <span class="text-body-2">{{ application.contact_email }}</span>
              </VCardSubtitle>
            </VCardItem>

            <!-- Content -->
            <VCardText>
              <!-- Details -->
              <VRow class="text-body-2 ma-0 pa-0" no-gutters>
                <VCol cols="12" class="d-flex align-center mb-2">
                  <VIcon icon="ri-phone-line" size="small" class="me-2 text-primary" />
                  <span>{{ application.contact_phone }}</span>
                </VCol>

                <VCol cols="12" class="d-flex align-center mb-2">
                  <VIcon icon="ri-calendar-line" size="small" class="me-2 text-primary" />
                  <span>{{ application.experience_years }} ans d'expérience</span>
                </VCol>

                <VCol cols="12" class="d-flex align-center mb-2">
                  <VIcon icon="ri-money-euro-circle-line" size="small" class="me-2 text-primary" />
                  <span>{{ formatCurrency(application.payment_amount) }}</span>
                </VCol>
              </VRow>

              <v-divider class="my-2"></v-divider>

              <!-- Status -->
              <div class="d-flex justify-space-between align-center mb-2">
                <VChip :color="getStatusColor(application.status)" size="small" variant="tonal">
                  {{ getStatusLabel(application.status) }}
                </VChip>
                <VChip :color="getPaymentStatusColor(application.payment_status)" size="small" variant="tonal">
                  {{ getPaymentStatusLabel(application.payment_status) }}
                </VChip>
              </div>

              <!-- Date -->
              <div class="text-body-2 text-medium-emphasis">
                Soumise le {{ formatDate(application.created_at) }}
              </div>
            </VCardText>

            <!-- Actions -->
            <VCardActions>
              <VBtn variant="outlined" size="small"
                :to="{ name: 'cabinet-application-detail', params: { id: application.id } }">
                <VIcon icon="ri-eye-line" class="me-1" />
                Voir
              </VBtn>
              <VSpacer />
              <VBtn
                v-if="hasPermissions([PermissionEnum.CAN_CHANGE_JOB_APPLICATION_STATUS]) && application.status === 'pending'"
                color="success" size="small" @click="approveApplication(application.id)" :loading="isLoading">
                <VIcon icon="ri-check-line" class="me-1" />
                Approuver
              </VBtn>
              <VBtn
                v-if="hasPermissions([PermissionEnum.CAN_CHANGE_JOB_APPLICATION_STATUS]) && application.status === 'pending'"
                color="error" size="small" @click="rejectApplication(application.id)" :loading="isLoading">
                <VIcon icon="ri-close-line" class="me-1" />
                Rejeter
              </VBtn>
            </VCardActions>
          </VCard>
        </VCol>
      </VRow>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="d-flex justify-center mt-6">
        <VPagination v-model="currentPage" :length="totalPages" :total-visible="7" />
      </div>
    </div>

    <!-- Dialog de confirmation d'approbation -->
    <VDialog v-model="approveDialog" max-width="500">
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon icon="ri-check-line" class="me-2" color="success" />
          Confirmer l'approbation
        </VCardTitle>
        <VCardText>
          <p>Êtes-vous sûr de vouloir approuver cette candidature de cabinet ?</p>
          <p class="text-body-2 text-medium-emphasis">
            Cette action créera un compte utilisateur pour le cabinet et enverra les identifiants par email.
            Le cabinet pourra alors accéder à la plateforme et commencer à recevoir des clients.
          </p>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="outlined" @click="approveDialog = false">
            Annuler
          </VBtn>
          <VBtn color="success" @click="confirmApprove" :loading="isLoading">
            Approuver
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Dialog de confirmation de rejet -->
    <VDialog v-model="rejectDialog" max-width="500">
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon icon="ri-close-line" class="me-2" color="error" />
          Confirmer le rejet
        </VCardTitle>
        <VCardText>
          <p>Êtes-vous sûr de vouloir rejeter cette candidature de cabinet ?</p>
          <VTextarea v-model="rejectReason" label="Raison du rejet (optionnel)" variant="outlined" rows="3" class="mt-4"
            hint="Cette raison sera communiquée au cabinet par email" persistent-hint />
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="outlined" @click="rejectDialog = false">
            Annuler
          </VBtn>
          <VBtn color="error" @click="confirmReject" :loading="isLoading">
            Rejeter
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCabinetStore } from '@/stores/cabinet'
import { useToast } from '@/composables/useToast'
import { useInstantPermissions } from '@/composables/useInstantPermissions'
import { PermissionEnum } from '@/types/permissions'
import {
  CabinetApplicationStatus,
  PaymentStatus,
  CABINET_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  CABINET_STATUS_COLORS,
  PAYMENT_STATUS_COLORS,
  type CabinetApplicationOut
} from '@/types/cabinet'

// Composables
const cabinetStore = useCabinetStore()
const { showToast } = useToast()
const { hasPermissions } = useInstantPermissions()

// State
const searchQuery = ref('')
const filterStatus = ref('')
const filterPaymentStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const approveDialog = ref(false)
const rejectDialog = ref(false)
const applicationToApprove = ref<string | null>(null)
const applicationToReject = ref<string | null>(null)
const rejectReason = ref('')

// Computed
const applications = computed(() => cabinetStore.applications)
const stats = computed(() => cabinetStore.stats)
const isLoading = computed(() => cabinetStore.isLoading)
const error = computed(() => cabinetStore.error)
const hasApplications = computed(() => applications.value.length > 0)

// Options pour les filtres
const statusOptions = [
  { value: CabinetApplicationStatus.PENDING, title: CABINET_STATUS_LABELS[CabinetApplicationStatus.PENDING] },
  { value: CabinetApplicationStatus.PAID, title: CABINET_STATUS_LABELS[CabinetApplicationStatus.PAID] },
  { value: CabinetApplicationStatus.APPROVED, title: CABINET_STATUS_LABELS[CabinetApplicationStatus.APPROVED] },
  { value: CabinetApplicationStatus.REJECTED, title: CABINET_STATUS_LABELS[CabinetApplicationStatus.REJECTED] },
  { value: CabinetApplicationStatus.CANCELLED, title: CABINET_STATUS_LABELS[CabinetApplicationStatus.CANCELLED] }
]

const paymentStatusOptions = [
  { value: PaymentStatus.PENDING, title: PAYMENT_STATUS_LABELS[PaymentStatus.PENDING] },
  { value: PaymentStatus.PAID, title: PAYMENT_STATUS_LABELS[PaymentStatus.PAID] },
  { value: PaymentStatus.FAILED, title: PAYMENT_STATUS_LABELS[PaymentStatus.FAILED] },
  { value: PaymentStatus.REFUNDED, title: PAYMENT_STATUS_LABELS[PaymentStatus.REFUNDED] }
]

// Filtrage côté client
const filteredApplications = computed(() => {
  let filtered = [...applications.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      app =>
        app.company_name.toLowerCase().includes(query) ||
        app.contact_email.toLowerCase().includes(query) ||
        app.contact_phone.toLowerCase().includes(query)
    )
  }

  if (filterStatus.value) {
    filtered = filtered.filter(app => app.status === filterStatus.value)
  }

  if (filterPaymentStatus.value) {
    filtered = filtered.filter(app => app.payment_status === filterPaymentStatus.value)
  }

  return filtered
})

// Pagination
const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredApplications.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredApplications.value.length / pageSize.value))

const hasActiveFilters = computed(() =>
  searchQuery.value || filterStatus.value || filterPaymentStatus.value
)

// Methods
const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  filterPaymentStatus.value = ''
  currentPage.value = 1
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const getStatusLabel = (status: string) => {
  return CABINET_STATUS_LABELS[status as CabinetApplicationStatus] || status
}

const getPaymentStatusLabel = (status: string) => {
  return PAYMENT_STATUS_LABELS[status as PaymentStatus] || status
}

const getStatusColor = (status: string) => {
  return CABINET_STATUS_COLORS[status as CabinetApplicationStatus] || 'default'
}

const getPaymentStatusColor = (status: string) => {
  return PAYMENT_STATUS_COLORS[status as PaymentStatus] || 'default'
}

const approveApplication = (id: string) => {
  applicationToApprove.value = id
  approveDialog.value = true
}

const confirmApprove = async () => {
  if (!applicationToApprove.value) return

  try {
    await cabinetStore.approveApplication(applicationToApprove.value)
    showToast('Candidature de cabinet approuvée avec succès', 'success')
    approveDialog.value = false
    applicationToApprove.value = null
  } catch (error) {
    console.error('Erreur lors de l\'approbation:', error)
    showToast('Erreur lors de l\'approbation de la candidature de cabinet', 'error')
  }
}

const rejectApplication = (id: string) => {
  applicationToReject.value = id
  rejectReason.value = ''
  rejectDialog.value = true
}

const confirmReject = async () => {
  if (!applicationToReject.value) return

  try {
    await cabinetStore.rejectApplication(applicationToReject.value, rejectReason.value || undefined)
    showToast('Candidature de cabinet rejetée avec succès', 'success')
    rejectDialog.value = false
    applicationToReject.value = null
    rejectReason.value = ''
  } catch (error) {
    console.error('Erreur lors du rejet:', error)
    showToast('Erreur lors du rejet de la candidature de cabinet', 'error')
  }
}

// Lifecycle
onMounted(async () => {
  try {
    await Promise.all([
      cabinetStore.fetchApplications(),
      cabinetStore.fetchStats()
    ])
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  }
})
</script>

<style scoped>
.cabinet-applications-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}
</style>
