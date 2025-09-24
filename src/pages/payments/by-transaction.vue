<template>
  <VContainer>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 mb-2">Paiement par transaction</h1>
        <p class="text-body-1 text-medium-emphasis">Détails du paiement pour la transaction {{ transactionId }}</p>
      </div>
      <VBtn variant="outlined" prepend-icon="ri-arrow-left-line" @click="goBack">Retour</VBtn>
    </div>

    <VCard v-if="paymentData">
      <VCardText>
        <VRow>
          <VCol cols="12" md="6">
            <VCard variant="outlined">
              <VCardTitle>Informations de la transaction</VCardTitle>
              <VCardText>
                <div class="mb-2">
                  <strong>ID Transaction:</strong> {{ paymentData.transaction_id }}
                </div>
                <div class="mb-2">
                  <strong>Statut:</strong> 
                  <VChip :color="getStatusColor(paymentData.status)" size="small">
                    {{ getStatusText(paymentData.status) }}
                  </VChip>
                </div>
                <div class="mb-2">
                  <strong>Montant:</strong> {{ formatAmount(paymentData.amount, paymentData.currency) }}
                </div>
                <div class="mb-2">
                  <strong>Méthode:</strong> {{ getMethodText(paymentData.payment_method) }}
                </div>
                <div class="mb-2">
                  <strong>Créé le:</strong> {{ formatDate(paymentData.created_at) }}
                </div>
                <div class="mb-2">
                  <strong>Mis à jour le:</strong> {{ formatDate(paymentData.updated_at) }}
                </div>
              </VCardText>
            </VCard>
          </VCol>
          <VCol cols="12" md="6">
            <VCard variant="outlined">
              <VCardTitle>Actions</VCardTitle>
              <VCardText>
                <div class="d-flex flex-column gap-2">
                  <VBtn 
                    color="primary" 
                    prepend-icon="ri-refresh-line"
                    @click="refreshStatus"
                    :loading="isLoading"
                  >
                    Actualiser le statut
                  </VBtn>
                  <VBtn 
                    color="secondary" 
                    prepend-icon="ri-eye-line"
                    @click="viewDetails"
                  >
                    Voir les détails complets
                  </VBtn>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <VCard v-else-if="isLoading">
      <VCardText class="text-center">
        <VProgressCircular indeterminate />
        <div class="mt-2">Chargement des informations de paiement...</div>
      </VCardText>
    </VCard>

    <VCard v-else>
      <VCardText class="text-center">
        <VIcon icon="ri-error-warning-line" size="48" color="error" />
        <div class="mt-2">Aucune information de paiement trouvée pour cette transaction</div>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePayment } from '@/composables/usePayment'
import { PaymentStatusEnum, PaymentMethodEnum } from '@/types/payment'

// Router
const router = useRouter()
const route = useRoute()

// Composable
const { getPaymentByTransaction, checkPaymentStatus, isLoading } = usePayment()

// State
const paymentData = ref<any>(null)
const transactionId = ref(route.params.transactionId as string)

// Methods
const loadPaymentData = async () => {
  try {
    const data = await getPaymentByTransaction(transactionId.value)
    paymentData.value = data
  } catch (error) {
    console.error('Erreur lors du chargement des données de paiement:', error)
  }
}

const refreshStatus = async () => {
  try {
    const data = await checkPaymentStatus(transactionId.value)
    paymentData.value = data
  } catch (error) {
    console.error('Erreur lors de la vérification du statut:', error)
  }
}

const viewDetails = () => {
  if (paymentData.value?.id) {
    router.push({ name: 'payments-detail', params: { id: paymentData.value.id } })
  }
}

const goBack = () => {
  router.push({ name: 'payments-index' })
}

// Status configuration
const getStatusColor = (status: PaymentStatusEnum) => {
  const colors = {
    PENDING: 'warning',
    SUCCESS: 'success',
    FAILED: 'error',
    CANCELLED: 'info',
    REFUNDED: 'secondary'
  }
  return colors[status] || 'default'
}

const getStatusText = (status: PaymentStatusEnum) => {
  const texts = {
    PENDING: 'En attente',
    SUCCESS: 'Réussi',
    FAILED: 'Échoué',
    CANCELLED: 'Annulé',
    REFUNDED: 'Remboursé'
  }
  return texts[status] || status
}

const getMethodText = (method: PaymentMethodEnum) => {
  const texts = {
    CINETPAY: 'CinetPay',
    MOBILE_MONEY: 'Mobile Money',
    BANK_CARD: 'Carte Bancaire'
  }
  return texts[method] || method
}

const formatAmount = (amount: number, currency: string) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  loadPaymentData()
})
</script>

<style scoped>
.v-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
