<template>
  <VContainer>
      <!-- Header avec design moderne -->
      <VSlideYTransition>
      <VCard class="mb-6 payments-header-card overflow-hidden" elevation="3">
        <div class="payments-header-overlay">
          <div class="payments-header-content">
            <div class="d-flex align-center mb-4">
              <VAvatar size="48" class="mr-3 border-white">
                <VIcon color="white" size="24">ri-money-dollar-circle-line</VIcon>
              </VAvatar>
      <div>
                <div class="text-white font-weight-medium">Gestion des paiements</div>
                <div class="text-caption text-white">
                  {{ filteredPayments.length }} paiement(s) trouvé(s)
    </div>
        </div>
    </div>

            <h1 class="text-h3 font-weight-bold text-white mb-4">
              Transactions et paiements
            </h1>

            <div class="d-flex flex-wrap gap-3 mb-4">
              <div class="d-flex align-center text-white">
                <VIcon size="small" class="mr-2">ri-exchange-line</VIcon>
                <span>Transactions en temps réel</span>
              </div>
              <div class="d-flex align-center text-white">
                <VIcon size="small" class="mr-2">ri-shield-check-line</VIcon>
                <span>Paiements sécurisés</span>
              </div>
              <div class="d-flex align-center text-white">
                <VIcon size="small" class="mr-2">ri-time-line</VIcon>
                <span>Statuts mis à jour</span>
              </div>
            </div>
          </div>
              </div>
      </VCard>
    </VSlideYTransition>

    <!-- Filters avec design amélioré -->
    <VSlideYTransition>
      <VCard class="mb-5" elevation="1">
        <VCardTitle class="d-flex align-center">
          <VIcon color="primary" class="mr-2">ri-filter-line</VIcon>
          <span class="text-h6">Filtres et recherche</span>
        </VCardTitle>
        <VDivider />
        <VCardText class="py-4">
          <VRow>
            <VCol cols="12" md="3">
              <VTextField v-model="searchQuery" label="Rechercher par transaction"
                placeholder="Entrez l'ID de transaction..." prepend-inner-icon="ri-search-line"
                :append-inner-icon="isSearching ? 'ri-loader-4-line' : undefined" :loading="isSearching" clearable
                @update:model-value="handleSearchChange" />
            </VCol>
            <VCol cols="12" md="3">
              <VSelect v-model="filters.status" :items="statusOptions" label="Statut" clearable
                @update:model-value="handleFilterChange" />
            </VCol>
            <VCol cols="12" md="3">
              <VSelect v-model="filters.payment_method" :items="methodOptions" label="Méthode de paiement" clearable
                @update:model-value="handleFilterChange" />
            </VCol>
            <VCol cols="12" md="3">
              <VSelect v-model="filters.currency" :items="currencyOptions" label="Devise" clearable
                @update:model-value="handleFilterChange" />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12" md="3">
              <VTextField v-model="filters.date_from" label="Date de début" type="date"
                @update:model-value="handleFilterChange" />
            </VCol>
            <VCol cols="12" md="3">
              <VTextField v-model="filters.date_to" label="Date de fin" type="date"
                @update:model-value="handleFilterChange" />
            </VCol>
            <VCol cols="12" md="3">
              <VTextField v-model="filters.amount_min" label="Montant minimum" type="number" step="0.01"
                @update:model-value="handleFilterChange" />
            </VCol>
            <VCol cols="12" md="3">
              <VTextField v-model="filters.amount_max" label="Montant maximum" type="number" step="0.01"
                @update:model-value="handleFilterChange" />
            </VCol>
          </VRow>
          <div class="d-flex justify-space-between align-center mt-4">
            <div class="d-flex gap-2">
              <VBtn variant="outlined" @click="clearFilters" :disabled="isLoading" color="warning">
                <VIcon icon="ri-refresh-line" class="me-2" />
                Effacer les filtres
              </VBtn>
              <VBtn variant="outlined" @click="loadPayments(true)" :loading="isLoading" color="primary">
                <VIcon icon="ri-refresh-line" class="me-2" />
                Actualiser
              </VBtn>
      </div>
            <div v-if="filteredPayments.length > 0" class="d-flex align-center">
              <VIcon icon="ri-information-line" class="mr-2" color="primary" />
              <span class="text-body-2 text-medium-emphasis">
                {{ filteredPayments.length }} paiement(s) trouvé(s)
              </span>
    </div>
  </div>
        </VCardText>
      </VCard>
    </VSlideYTransition>

    <!-- Payment Table avec design amélioré -->
      <VSlideYTransition>
        <VCard class="" elevation="1">
          <PaymentTable :payments="paginatedPayments" :headers="headers" :isLoading="isLoading" @view="handleView"
            @view-transaction="handleViewTransaction" @edit="handleEdit" @delete="handleDelete"
            @check-status="handleCheckStatus" />
        </VCard>
      </VSlideYTransition>

      <!-- Pagination avec design amélioré -->
      <VSlideYTransition>
        <VCard v-if="totalFilteredPages > 1" class="mt-6 payments-pagination-card" elevation="1">
          <VCardText class="text-center py-4">
            <div class="d-flex align-center justify-center gap-4">
              <span class="text-body-2 text-medium-emphasis">
                Page {{ currentPage }} sur {{ totalFilteredPages }}
              </span>
              <VPagination v-model="currentPage" :length="totalFilteredPages" :total-visible="5"
                color="primary" />
            </div>
          </VCardText>
        </VCard>
      </VSlideYTransition>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePayment } from '@/composables/usePayment'
import { PaymentStatusEnum, PaymentMethodEnum } from '@/types/payment'
import PaymentTable from '@/components/payment/PaymentTable.vue'

// Router
const router = useRouter()


// Composable
const {
  payments,
  isLoading,
  totalPages,
  currentPage,
  filters,
  searchQuery,
  filteredPayments,
  totalFilteredPages,
  paginatedPayments,
  hasActiveFilters,
  loadPayments,
  searchPayments,
  applyFilters,
  clearFilters
} = usePayment()

// Headers for the data table
const headers = [
  { title: 'Transaction', key: 'transaction_id', sortable: true },
  { title: 'Montant', key: 'amount', sortable: true },
  { title: 'Statut', key: 'status', sortable: true },
  { title: 'Méthode', key: 'payment_method', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Options for filters (based on real API data)
const statusOptions = [
  { title: 'En attente', value: 'pending' },
  { title: 'Réussi', value: 'success' },
  { title: 'Échoué', value: 'failed' },
  { title: 'Refusé', value: 'refused' },
  { title: 'Annulé', value: 'cancelled' },
  { title: 'Remboursé', value: 'refunded' }
]

const methodOptions = [
  { title: 'CinetPay', value: PaymentMethodEnum.CINETPAY },
  { title: 'Mobile Money', value: PaymentMethodEnum.MOBILE_MONEY },
  { title: 'Carte Bancaire', value: PaymentMethodEnum.BANK_CARD }
]

const currencyOptions = [
  { title: 'XOF (Franc CFA)', value: 'XOF' },
  { title: 'EUR (Euro)', value: 'EUR' },
  { title: 'USD (Dollar US)', value: 'USD' }
]

// Search functionality
const searchTimeout = ref<NodeJS.Timeout | null>(null)
const isSearching = ref(false)

// Methods
const goToCreate = () => {
  router.push({ name: 'payments-create' })
}

const handleView = (id: number | string) => {
  // Si c'est un nombre, utiliser la route detail normale
  if (typeof id === 'number') {
    router.push({ name: 'payments-detail', params: { id } })
  } else {
    // Si c'est une string (transaction_id), utiliser la route by-transaction
    router.push({ name: 'payments-by-transaction', params: { transactionId: id } })
  }
}

const handleViewTransaction = (transactionId: string) => {
  router.push({ name: 'payments-by-transaction', params: { transactionId } })
}

const handleEdit = (id: number) => {
  router.push({ name: 'payments-edit', params: { id } })
}

const handleDelete = async (payment: any) => {
  // Implementation for delete
  console.log('Delete payment:', payment)
}

const handleCheckStatus = (transactionId: string) => {
  router.push({ name: 'payments-check-status', params: { transactionId } })
}

const handleFilterChange = async () => {
  await applyFilters(filters.value)
}

const handleSearchChange = () => {
  // Clear previous timeout
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  // Set new timeout for debounced search
  searchTimeout.value = setTimeout(async () => {
    isSearching.value = true
    try {
      await searchPayments(searchQuery.value.trim())
    } finally {
      isSearching.value = false
    }
  }, 500) // 500ms debounce
}

// Lifecycle
onMounted(async () => {
  await loadPayments(true)
})

// Cleanup
onUnmounted(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})
</script>

<style scoped>
.payments-container {
  max-width: 1400px;
  margin: 0 auto;
  padding-bottom: 3rem;
}

.payments-header-card {
  position: relative;
  overflow: hidden;
}

.payments-header-overlay {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  padding: 2rem;
  color: white;
}

.payments-header-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));
  border-radius: 12px;
  transition: opacity 0.3s ease;
}

.payments-header-content {
  position: relative;
  z-index: 2;
}

.payments-filters-card {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.payments-filters-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.payments-table-card {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.payments-table-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.payments-pagination-card {
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

/* Animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .payments-container {
    padding: 1rem;
  }
  
  .payments-header-overlay {
    padding: 1.5rem;
  }
  
  .payments-header-content h1 {
    font-size: 1.5rem !important;
  }
}

/* Custom scrollbar for better UX */
.payments-table-card ::-webkit-scrollbar {
  height: 8px;
}

.payments-table-card ::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.payments-table-card ::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.payments-table-card ::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>