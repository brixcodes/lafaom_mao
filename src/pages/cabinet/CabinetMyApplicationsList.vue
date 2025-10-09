<template>
  <div class="cabinet-my-applications-page">
    <!-- En-tête -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 mb-2">
          <VIcon icon="ri-building-line" class="me-3" color="primary" />
          Mes Candidatures Cabinet
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Consultez et suivez l'état de vos candidatures de cabinet
        </p>
      </div>
      <VBtn 
        prepend-icon="ri-add-line" 
        color="primary" 
        :to="{ name: 'cabinet-application-create' }"
      >
        Nouvelle candidature
      </VBtn>
    </div>

    <!-- Statistiques personnelles -->
    <VRow class="mb-6" v-if="applications.length > 0">
      <VCol cols="12" sm="6" md="3">
        <VCard>
          <VCardText class="d-flex align-center">
            <VIcon icon="ri-file-list-line" size="40" color="primary" class="me-3" />
            <div>
              <div class="text-h6">{{ applications.length }}</div>
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
              <div class="text-h6">{{ pendingCount }}</div>
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
              <div class="text-h6">{{ approvedCount }}</div>
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
              <div class="text-h6">{{ paidCount }}</div>
              <div class="text-body-2 text-medium-emphasis">Payées</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Filtres et recherche -->
    <VCard class="mb-6" v-if="applications.length > 0">
      <VCardText>
        <VRow>
          <VCol cols="12" md="4">
            <VTextField 
              v-model="searchQuery" 
              prepend-inner-icon="ri-search-line" 
              label="Rechercher une candidature..."
              variant="outlined" 
              density="compact" 
              clearable 
            />
          </VCol>
          <VCol cols="12" md="3">
            <VSelect 
              v-model="filterStatus" 
              :items="statusOptions" 
              label="Statut" 
              variant="outlined"
              density="compact" 
              clearable 
            />
          </VCol>
          <VCol cols="12" md="3">
            <VSelect 
              v-model="sortBy" 
              :items="sortOptions" 
              label="Trier par" 
              variant="outlined"
              density="compact" 
            />
          </VCol>
          <VCol cols="12" md="2">
            <VBtn 
              variant="outlined" 
              prepend-icon="ri-refresh-line" 
              @click="resetFilters" 
              :disabled="!hasActiveFilters"
              block
            >
              Reset
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Indicateur de filtres actifs -->
    <div v-if="hasActiveFilters && applications.length > 0" class="mb-4">
      <VChip 
        v-if="searchQuery" 
        closable 
        @click:close="searchQuery = ''" 
        class="me-2 mb-2"
      >
        Recherche: "{{ searchQuery }}"
      </VChip>
      <VChip 
        v-if="filterStatus" 
        closable 
        @click:close="filterStatus = ''" 
        class="me-2 mb-2"
      >
        Statut: {{ getStatusLabel(filterStatus) }}
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
        {{ hasActiveFilters ? 'Aucune candidature ne correspond à vos critères de recherche.' : 'Vous n\'avez pas encore soumis de candidature de cabinet.' }}
      </p>
      <VBtn 
        v-if="!hasActiveFilters" 
        color="primary" 
        :to="{ name: 'cabinet-application-create' }"
      >
        Soumettre votre première candidature
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

                <VCol cols="12" class="d-flex align-center mb-2" v-if="application.payment_date">
                  <VIcon icon="ri-calendar-check-line" size="small" class="me-2 text-success" />
                  <span>Payé le {{ formatDate(application.payment_date) }}</span>
                </VCol>
              </VRow>

              <v-divider class="my-2"></v-divider>

              <!-- Status -->
              <div class="d-flex justify-space-between align-center mb-2">
                <VChip 
                  :color="getStatusColor(application.status)" 
                  size="small"
                  variant="tonal"
                >
                  {{ getStatusLabel(application.status) }}
                </VChip>
                <VChip 
                  :color="getPaymentStatusColor(application.payment_status)" 
                  size="small"
                  variant="tonal"
                >
                  {{ getPaymentStatusLabel(application.payment_status) }}
                </VChip>
              </div>

              <!-- Date -->
              <div class="text-body-2 text-medium-emphasis">
                Soumise le {{ formatDate(application.created_at) }}
              </div>

              <!-- Actions disponibles -->
              <div v-if="application.payment_url && application.payment_status === 'pending'" class="mt-3">
                <VAlert type="warning" variant="tonal" density="compact">
                  <template #prepend>
                    <VIcon icon="ri-time-line" />
                  </template>
                  <div class="text-body-2">
                    Paiement en attente
                    <VBtn 
                      :href="application.payment_url" 
                      target="_blank"
                      color="primary" 
                      size="small" 
                      variant="text"
                      class="ml-2"
                    >
                      Effectuer le paiement
                    </VBtn>
                  </div>
                </VAlert>
              </div>

              <div v-if="application.status === 'approved'" class="mt-3">
                <VAlert type="success" variant="tonal" density="compact">
                  <template #prepend>
                    <VIcon icon="ri-check-line" />
                  </template>
                  <div class="text-body-2">
                    Votre candidature a été approuvée ! Vous devriez recevoir vos identifiants par email.
                  </div>
                </VAlert>
              </div>
            </VCardText>

            <!-- Actions -->
            <VCardActions>
              <VBtn 
                variant="outlined" 
                size="small"
                :to="{ name: 'cabinet-application-detail', params: { id: application.id } }"
              >
                <VIcon icon="ri-eye-line" class="me-1" />
                Voir
              </VBtn>
              <VSpacer />
              <VBtn 
                v-if="application.payment_url && application.payment_status === 'pending'"
                color="primary" 
                size="small"
                :href="application.payment_url"
                target="_blank"
              >
                <VIcon icon="ri-money-euro-circle-line" class="me-1" />
                Payer
              </VBtn>
            </VCardActions>
          </VCard>
        </VCol>
      </VRow>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="d-flex justify-center mt-6">
        <VPagination 
          v-model="currentPage" 
          :length="totalPages" 
          :total-visible="7"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCabinetStore } from '@/stores/cabinet'
import { useToast } from '@/composables/useToast'
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

// State
const searchQuery = ref('')
const filterStatus = ref('')
const sortBy = ref('created_at')
const currentPage = ref(1)
const pageSize = ref(12)

// Computed
const applications = computed(() => cabinetStore.applications)
const isLoading = computed(() => cabinetStore.isLoading)
const error = computed(() => cabinetStore.error)
const hasApplications = computed(() => applications.value.length > 0)

// Options pour les filtres
const statusOptions = [
  { value: CabinetApplicationStatus.PENDING, title: CABINET_STATUS_LABELS[CabinetApplicationStatus.PENDING] },
  { value: CabinetApplicationStatus.PAID, title: CABINET_STATUS_LABELS[CabinetApplicationStatus.PAID] },
  { value: CabinetApplicationStatus.APPROVED, title: CABINET_STATUS_LABELS[CabinetApplicationStatus.APPROVED] },
  { value: CabinetApplicationStatus.REJECTED, title: CABINET_STATUS_LABELS[CabinetApplicationStatus.REJECTED] }
]

const sortOptions = [
  { value: 'created_at', title: 'Date de soumission' },
  { value: 'payment_date', title: 'Date de paiement' },
  { value: 'company_name', title: 'Nom de l\'entreprise' },
  { value: 'status', title: 'Statut' }
]

// Statistiques personnelles
const pendingCount = computed(() => 
  applications.value.filter(app => app.status === CabinetApplicationStatus.PENDING).length
)

const approvedCount = computed(() => 
  applications.value.filter(app => app.status === CabinetApplicationStatus.APPROVED).length
)

const paidCount = computed(() => 
  applications.value.filter(app => app.payment_status === PaymentStatus.PAID).length
)

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

  // Tri
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'payment_date':
        return new Date(b.payment_date || 0).getTime() - new Date(a.payment_date || 0).getTime()
      case 'created_at':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'company_name':
        return a.company_name.localeCompare(b.company_name)
      case 'status':
        return a.status.localeCompare(b.status)
      default:
        return 0
    }
  })

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
  searchQuery.value || filterStatus.value
)

// Methods
const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  currentPage.value = 1
}

const refreshData = async () => {
  try {
    await cabinetStore.fetchMyApplications()
    showToast('Données actualisées avec succès', 'success')
  } catch (error) {
    console.error('Erreur lors de l\'actualisation:', error)
    showToast('Erreur lors de l\'actualisation des données', 'error')
  }
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

// Lifecycle
onMounted(async () => {
  try {
    await cabinetStore.fetchMyApplications()
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  }
})
</script>

<style scoped>
.cabinet-my-applications-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}
</style>
