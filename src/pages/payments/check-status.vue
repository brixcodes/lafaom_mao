<template>
  <VContainer>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 mb-2">Vérifier le statut du paiement</h1>
        <p class="text-body-1 text-medium-emphasis">Vérifier le statut de la transaction {{ transactionId }}</p>
      </div>
      <VBtn variant="outlined" prepend-icon="ri-arrow-left-line" @click="goBack">Retour</VBtn>
    </div>

    <VCard>
      <VCardText>
        <VRow>
          <VCol cols="12" md="8">
            <VCard variant="outlined">
              <VCardTitle>Statut de la transaction</VCardTitle>
              <VCardText>
                <div v-if="statusData" class="space-y-4">
                  <div class="d-flex align-center gap-3">
                    <VIcon :icon="getStatusIcon(statusData.status)" :color="getStatusColor(statusData.status)" size="32" />
                    <div>
                      <div class="text-h6">{{ getStatusText(statusData.status) }}</div>
                      <div class="text-body-2 text-medium-emphasis">Transaction: {{ statusData.transaction_id }}</div>
                    </div>
                  </div>
                  
                  <VDivider />
                  
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <div class="text-caption text-medium-emphasis">Montant</div>
                      <div class="text-h6">{{ formatAmount(statusData.amount, statusData.currency) }}</div>
                    </div>
                    <div>
                      <div class="text-caption text-medium-emphasis">Méthode</div>
                      <div class="text-h6">{{ getMethodText(statusData.payment_method) }}</div>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <div class="text-caption text-medium-emphasis">Créé le</div>
                      <div class="text-body-2">{{ formatDate(statusData.created_at) }}</div>
                    </div>
                    <div>
                      <div class="text-caption text-medium-emphasis">Mis à jour le</div>
                      <div class="text-body-2">{{ formatDate(statusData.updated_at) }}</div>
                    </div>
                  </div>
                </div>
                
                <div v-else-if="isLoading" class="text-center py-8">
                  <VProgressCircular indeterminate />
                  <div class="mt-2">Vérification du statut en cours...</div>
                </div>
                
                <div v-else class="text-center py-8">
                  <VIcon icon="ri-error-warning-line" size="48" color="error" />
                  <div class="mt-2">Impossible de récupérer le statut de cette transaction</div>
                </div>
              </VCardText>
            </VCard>
          </VCol>
          
          <VCol cols="12" md="4">
            <VCard variant="outlined">
              <VCardTitle>Actions</VCardTitle>
              <VCardText>
                <div class="d-flex flex-column gap-2">
                  <VBtn 
                    color="primary" 
                    prepend-icon="ri-refresh-line"
                    @click="checkStatus"
                    :loading="isLoading"
                    block
                  >
                    Actualiser
                  </VBtn>
                  <VBtn 
                    color="secondary" 
                    prepend-icon="ri-eye-line"
                    @click="viewTransaction"
                    :disabled="!statusData"
                    block
                  >
                    Voir la transaction
                  </VBtn>
                  <VBtn 
                    color="info" 
                    prepend-icon="ri-list-line"
                    @click="goBack"
                    block
                  >
                    Liste des paiements
                  </VBtn>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
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
const { checkPaymentStatus, isLoading } = usePayment()

// State
const statusData = ref<any>(null)
const transactionId = ref(route.params.transactionId as string)

// Methods
const checkStatus = async () => {
  try {
    const data = await checkPaymentStatus(transactionId.value)
    statusData.value = data
  } catch (error) {
    console.error('Erreur lors de la vérification du statut:', error)
  }
}

const viewTransaction = () => {
  router.push({ name: 'payments-by-transaction', params: { transactionId: transactionId.value } })
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

const getStatusIcon = (status: PaymentStatusEnum) => {
  const icons = {
    PENDING: 'ri-time-line',
    SUCCESS: 'ri-check-line',
    FAILED: 'ri-close-line',
    CANCELLED: 'ri-close-circle-line',
    REFUNDED: 'ri-refresh-line'
  }
  return icons[status] || 'ri-question-line'
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
  checkStatus()
})
</script>

<style scoped>
.v-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.grid {
  display: grid;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gap-4 {
  gap: 1rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>
