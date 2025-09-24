<template>
  <VContainer>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 mb-2">Gestion des paiements</h1>
        <p class="text-body-1 text-medium-emphasis">Gérez tous les paiements du système</p>
      </div>
      <VBtn color="primary" prepend-icon="ri-add-line" @click="goToCreate">Nouveau paiement</VBtn>
    </div>

    <!-- Filters -->
    <VCard class="mb-5">
      <VCardText>
        <VRow>
          <VCol cols="12" md="3">
            <VSelect
              v-model="filters.status"
              :items="statusOptions"
              label="Statut"
              clearable
              @update:model-value="handleFilterChange"
            />
          </VCol>
          <VCol cols="12" md="3">
            <VSelect
              v-model="filters.payment_method"
              :items="methodOptions"
              label="Méthode de paiement"
              clearable
              @update:model-value="handleFilterChange"
            />
          </VCol>
          <VCol cols="12" md="3">
            <VTextField
              v-model="filters.date_from"
              label="Date de début"
              type="date"
              @update:model-value="handleFilterChange"
            />
          </VCol>
          <VCol cols="12" md="3">
            <VTextField
              v-model="filters.date_to"
              label="Date de fin"
              type="date"
              @update:model-value="handleFilterChange"
            />
          </VCol>
        </VRow>
        <div class="d-flex justify-space-between align-center mt-4">
          <VBtn variant="outlined" @click="clearFilters">Effacer les filtres</VBtn>
          <VBtn variant="outlined" @click="loadPayments(true)">Actualiser</VBtn>
        </div>
      </VCardText>
    </VCard>

    <!-- Payment Table -->
    <PaymentTable
      :payments="payments"
      :headers="headers"
      :isLoading="isLoading"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
      @check-status="handleCheckStatus"
    />

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="d-flex justify-center mt-6">
      <VPagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="5"
        @update:model-value="loadPayments(true)"
      />
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
  loadPayments,
  applyFilters,
  clearFilters
} = usePayment()

// Headers for the data table
const headers = [
  { title: 'ID Paiement', key: 'payment_id', sortable: true },
  { title: 'Transaction', key: 'transaction_id', sortable: true },
  { title: 'Montant', key: 'amount', sortable: true },
  { title: 'Statut', key: 'status', sortable: true },
  { title: 'Méthode', key: 'payment_method', sortable: true },
  { title: 'Date', key: 'created_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Options for filters
const statusOptions = [
  { title: 'En attente', value: PaymentStatusEnum.PENDING },
  { title: 'Réussi', value: PaymentStatusEnum.SUCCESS },
  { title: 'Échoué', value: PaymentStatusEnum.FAILED },
  { title: 'Annulé', value: PaymentStatusEnum.CANCELLED },
  { title: 'Remboursé', value: PaymentStatusEnum.REFUNDED }
]

const methodOptions = [
  { title: 'CinetPay', value: PaymentMethodEnum.CINETPAY },
  { title: 'Mobile Money', value: PaymentMethodEnum.MOBILE_MONEY },
  { title: 'Carte Bancaire', value: PaymentMethodEnum.BANK_CARD }
]

// Methods
const goToCreate = () => {
  router.push({ name: 'payments-create' })
}

const handleView = (id: number) => {
  router.push({ name: 'payments-detail', params: { id } })
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

// Lifecycle
onMounted(() => {
  loadPayments(true)
})
</script>

<style scoped>
.v-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>