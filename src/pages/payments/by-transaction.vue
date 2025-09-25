<template>
  <VContainer class="payment-detail-container">
    <!-- Header avec navigation -->
    <div class="d-flex justify-space-between align-center mb-4">
      <!-- Partie gauche : bouton retour + titres -->
      <div class="d-flex align-center">
        <VBtn icon variant="text" class="mr-3" @click="goBack">
          <VIcon icon="ri-arrow-left-line" color="primary" />
        </VBtn>
        <div>
          <h1 class="font-weight-bold mb-1">Détails du paiement</h1>
          <p class="text-body-2 text-secondary mb-0">
            Consultez les détails de la transaction et son statut.
          </p>
        </div>
      </div>

      <!-- Partie droite : boutons d'action -->
      <div>
        <VBtn color="primary" variant="flat" @click="refreshStatus" class="action-btn mx-1"
          prepend-icon="ri-refresh-line">
          Actualiser
        </VBtn>
      </div>
    </div>

    <VFadeTransition>
      <VRow v-if="paymentData">
        <VCol cols="12">
          <!-- En-tête avec design moderne -->
          <VSlideYTransition>
            <VCard class="mb-6 payment-header-card overflow-hidden" elevation="3">
              <div class="payment-header-overlay">
                <div class="payment-header-content">
                  <div class="d-flex align-center mb-4 animate-payment">
                    <VAvatar size="48" class="mr-3 border-white">
                      <VIcon color="white" size="24">ri-money-dollar-circle-line</VIcon>
                    </VAvatar>
                    <div>
                      <div class="text-white font-weight-medium">Transaction {{ paymentData.payment_type || 'CinetPay'
                        }}</div>
                      <div class="text-caption text-white">
                        ID: {{ paymentData.transaction_id }}
                      </div>
                    </div>
                  </div>

                  <h1 class="text-h3 font-weight-bold text-white mb-4 animate-title">
                    {{ formatAmount(paymentData.product_amount, paymentData.product_currency) }}
                  </h1>

                  <div class="d-flex flex-wrap gap-3 mb-4">
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-exchange-line</VIcon>
                      <span>{{ paymentData.payment_currency }}</span>
                    </div>
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-time-line</VIcon>
                      <span>Taux: {{ paymentData.daily_rate }}</span>
                    </div>
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-building-line</VIcon>
                      <span>{{ paymentData.payable_type }}</span>
                    </div>
                  </div>

                  <VSlideXTransition group>
                    <VChip key="payment-status" :color="statusChip.color" variant="elevated" size="small"
                      class="mr-2 mb-2 animate-tag">
                      <VIcon :icon="statusChip.icon" class="me-1" />
                      {{ statusChip.text }}
                    </VChip>
                    <VChip key="payment-method" color="white" variant="outlined" size="small"
                      class="mr-2 mb-2 animate-tag">
                      {{ getMethodText(paymentData.payment_type) }}
                    </VChip>
                  </VSlideXTransition>
                </div>
              </div>
            </VCard>
          </VSlideYTransition>

          <!-- Contenu principal -->
          <VRow>
            <VCol cols="12" md="8">
              <!-- Détails de la transaction -->
              <VSlideYTransition>
                <VCard v-if="paymentData" class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-information-line</VIcon>
                    <span class="text-h6">Détails de la transaction</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="py-4">
                    <v-timeline align="start" density="compact" class="pa-3">
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Informations de base</strong> :</div>
                        <div style="margin-left: 10px; line-height: 1.8;">
                          ID Transaction: {{ paymentData.transaction_id }}<br>
                          Type de paiement: {{ paymentData.payment_type }}<br>
                          Payable ID: {{ paymentData.payable_id }}<br>
                          Payable Type: {{ paymentData.payable_type }}
                        </div>
                      </v-timeline-item>
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Montants et devises</strong> :</div>
                        <div style="margin-left: 10px; line-height: 1.8;">
                          <div>Montant produit: {{ formatAmount(paymentData.product_amount,
                            paymentData.product_currency) }}</div>
                          <div>Devise de paiement: {{ paymentData.payment_currency }}</div>
                          <div>Taux journalier: {{ paymentData.daily_rate }}</div>
                          <div>Taux USD produit: {{ paymentData.usd_product_currency_rate }}</div>
                          <div>Taux USD paiement: {{ paymentData.usd_payment_currency_rate }}</div>
                        </div>
                      </v-timeline-item>
                    </v-timeline>
                  </VCardText>
                </VCard>
              </VSlideYTransition>
            </VCol>

            <!-- Sidebar avec informations et actions -->
            <VCol cols="12" md="4">
              <VSlideXReverseTransition>
                <VCard class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-information-line</VIcon>
                    <span class="text-h6">Informations du paiement</span>
                  </VCardTitle>
                  <VDivider />
                  <VList lines="two" density="comfortable">
                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-exchange-line</VIcon>
                      </template>
                      <VListItemTitle>ID Transaction</VListItemTitle>
                      <VListItemSubtitle>{{ paymentData.transaction_id }}</VListItemSubtitle>
                    </VListItem>

                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-money-euro-circle-line</VIcon>
                      </template>
                      <VListItemTitle>Montant</VListItemTitle>
                      <VListItemSubtitle class="font-weight-medium">{{ formatAmount(paymentData.product_amount,
                        paymentData.product_currency) }}</VListItemSubtitle>
                    </VListItem>

                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-bank-card-line</VIcon>
                      </template>
                      <VListItemTitle>Méthode de paiement</VListItemTitle>
                      <VListItemSubtitle>{{ getMethodText(paymentData.payment_type) }}</VListItemSubtitle>
                    </VListItem>

                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-building-line</VIcon>
                      </template>
                      <VListItemTitle>Type de payement</VListItemTitle>
                      <VListItemSubtitle>{{ paymentData.payable_type }}</VListItemSubtitle>
                    </VListItem>
                  </VList>

                  <!-- Actions -->
                  <VDivider />
                  <VCardText class="pa-4">
                    <div class="d-flex flex-column gap-3">
                      <VBtn color="primary" prepend-icon="ri-refresh-line" @click="refreshStatus" :loading="isLoading"
                        block>
                        Actualiser le statut
                      </VBtn>
                      <VBtn color="secondary" prepend-icon="ri-download-line" @click="downloadReceipt" block>
                        Télécharger le reçu
                      </VBtn>
                    </div>
                  </VCardText>
                </VCard>
              </VSlideXReverseTransition>
            </VCol>
          </VRow>
        </VCol>
      </VRow>
    </VFadeTransition>

    <!-- États de chargement et d'erreur -->
    <VFadeTransition>
      <VRow v-if="isLoading && !paymentData">
        <VCol cols="12" class="text-center py-8">
          <VProgressCircular indeterminate color="primary" size="64" width="6" />
          <div class="mt-4 text-body-1 animate-fade-in">Chargement des informations de paiement...</div>
        </VCol>
      </VRow>
    </VFadeTransition>

    <VFadeTransition>
      <VRow v-if="!isLoading && !paymentData">
        <VCol cols="12" class="text-center py-8">
          <VIcon size="x-large" color="error" class="mb-4 animate-bounce">ri-alert-circle-line</VIcon>
          <div class="text-h5 mb-3 animate-fade-in">Transaction introuvable</div>
          <div class="text-body-1 mb-6 animate-fade-in">Aucune information de paiement trouvée pour cette transaction.</div>
          <VBtn color="primary" size="large" @click="goBack" prepend-icon="ri-arrow-left-line" class="animate-fade-in">
            Retour aux paiements
          </VBtn>
        </VCol>
      </VRow>
    </VFadeTransition>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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

// Computed
const statusChip = computed(() => {
  if (!paymentData.value) return { text: '', color: 'grey', icon: 'ri-question-line' }

  const status = paymentData.value.status
  const statusConfig = {
    pending: { text: 'En attente', color: 'warning', icon: 'ri-time-line' },
    success: { text: 'Réussi', color: 'success', icon: 'ri-check-line' },
    failed: { text: 'Échoué', color: 'error', icon: 'ri-close-line' },
    refused: { text: 'Refusé', color: 'error', icon: 'ri-close-line' },
    cancelled: { text: 'Annulé', color: 'info', icon: 'ri-close-circle-line' },
    refunded: { text: 'Remboursé', color: 'secondary', icon: 'ri-refresh-line' }
  }

  return statusConfig[status] || { text: status, color: 'grey', icon: 'ri-question-line' }
})

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
  // Fallback currency if not provided or invalid
  const validCurrency = currency && currency.length >= 3 ? currency : 'XOF'

  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: validCurrency
    }).format(amount)
  } catch (error) {
    // Fallback if currency is not supported
    return `${amount} ${validCurrency}`
  }
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
.payment-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 3rem;
}

.payment-header-card {
  position: relative;
  overflow: hidden;
}

.payment-header-overlay {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  padding: 2rem;
  color: white;
}

.payment-header-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7));
  border-radius: 12px;
  transition: opacity 0.3s ease;
}

.payment-header-content {
  position: relative;
  z-index: 2;
}

.border-white {
  border: 2px solid rgba(255, 255, 255, 0.7);
}

.animate-payment {
  animation: slideInLeft 0.6s ease-out;
}

.animate-title {
  animation: slideInUp 0.8s ease-out;
}

.animate-tag {
  animation: fadeInUp 1s ease-out;
}

.animate-card {
  animation: slideInUp 0.6s ease-out;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-bounce {
  animation: bounce 1s ease infinite;
}

.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Animations */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .payment-detail-container {
    padding: 1rem;
  }
  
  .payment-header-overlay {
    padding: 1.5rem;
  }
  
  .payment-header-content h1 {
    font-size: 1.5rem !important;
  }
}
</style>
