<template>
  <div class="payment-detail-page">
    <!-- En-tête -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 mb-2">
          <VIcon icon="ri-money-dollar-circle-line" class="me-3" color="primary" />
          Détails du paiement
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Consultez les informations détaillées du paiement
        </p>
      </div>
      <div class="d-flex gap-2">
        <VBtn 
          variant="outlined" 
          prepend-icon="ri-arrow-left-line" 
          :to="{ name: 'payments-index' }"
        >
          Retour à la liste
        </VBtn>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="text-center py-12">
      <VProgressCircular indeterminate size="60" width="6" color="primary" class="mb-4" />
      <p class="text-body-1 text-medium-emphasis">Chargement du paiement...</p>
    </div>

    <!-- Message d'erreur -->
    <VAlert v-if="error" type="error" class="mb-4" closable @click:close="clearError">
      {{ error }}
    </VAlert>

    <!-- Contenu principal -->
    <div v-else-if="currentPayment">
      <VRow>
        <!-- Informations principales -->
        <VCol cols="12" lg="8">
          <!-- Informations du paiement -->
          <VCard class="mb-4">
            <VCardTitle class="d-flex align-center">
              <VIcon icon="ri-information-line" class="me-2" color="primary" />
              <span>Informations du paiement</span>
            </VCardTitle>
            <VDivider />
            <VCardText>
              <VRow>
                <VCol cols="12" md="6">
                  <div class="mb-4">
                    <h4 class="text-h6 mb-2">ID du paiement</h4>
                    <p class="text-body-1 font-weight-medium">#{{ currentPayment.id }}</p>
                  </div>
                </VCol>
                <VCol cols="12" md="6">
                  <div class="mb-4">
                    <h4 class="text-h6 mb-2">Statut</h4>
                    <VChip 
                      :color="getStatusColor(currentPayment.status)" 
                      variant="tonal"
                      size="small"
                    >
                      {{ getStatusLabel(currentPayment.status) }}
                    </VChip>
                  </div>
                </VCol>
                <VCol cols="12" md="6">
                  <div class="mb-4">
                    <h4 class="text-h6 mb-2">Montant</h4>
                    <p class="text-h5 text-primary">{{ currentPayment.amount }} {{ currentPayment.currency }}</p>
                  </div>
                </VCol>
                <VCol cols="12" md="6">
                  <div class="mb-4">
                    <h4 class="text-h6 mb-2">Méthode de paiement</h4>
                    <p class="text-body-1">{{ currentPayment.payment_method || 'N/A' }}</p>
                  </div>
                </VCol>
                <VCol cols="12" v-if="currentPayment.transaction_id">
                  <div class="mb-4">
                    <h4 class="text-h6 mb-2">ID de transaction</h4>
                    <p class="text-body-1 font-mono">{{ currentPayment.transaction_id }}</p>
                  </div>
                </VCol>
                <VCol cols="12" v-if="currentPayment.payment_url">
                  <div class="mb-4">
                    <h4 class="text-h6 mb-2">URL de paiement</h4>
                    <VBtn 
                      variant="outlined" 
                      size="small" 
                      :href="currentPayment.payment_url" 
                      target="_blank"
                      prepend-icon="ri-external-link-line"
                    >
                      Ouvrir le lien de paiement
                    </VBtn>
                  </div>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>

          <!-- Informations du client -->
          <VCard class="mb-4">
            <VCardTitle class="d-flex align-center">
              <VIcon icon="ri-user-line" class="me-2" color="primary" />
              <span>Informations du client</span>
            </VCardTitle>
            <VDivider />
            <VCardText>
              <VRow>
                <VCol cols="12" md="6">
                  <div class="mb-4">
                    <h4 class="text-h6 mb-2">Nom</h4>
                    <p class="text-body-1">{{ currentPayment.customer_name || 'N/A' }}</p>
                  </div>
                </VCol>
                <VCol cols="12" md="6">
                  <div class="mb-4">
                    <h4 class="text-h6 mb-2">Email</h4>
                    <p class="text-body-1">{{ currentPayment.customer_email || 'N/A' }}</p>
                  </div>
                </VCol>
                <VCol cols="12" md="6">
                  <div class="mb-4">
                    <h4 class="text-h6 mb-2">Téléphone</h4>
                    <p class="text-body-1">{{ currentPayment.customer_phone || 'N/A' }}</p>
                  </div>
                </VCol>
                <VCol cols="12" md="6">
                  <div class="mb-4">
                    <h4 class="text-h6 mb-2">Adresse</h4>
                    <p class="text-body-1">{{ currentPayment.customer_address || 'N/A' }}</p>
                  </div>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>

          <!-- Détails CinetPay -->
          <VCard v-if="currentPayment.cinetpay_init">
            <VCardTitle class="d-flex align-center">
              <VIcon icon="ri-bank-card-line" class="me-2" color="primary" />
              <span>Détails CinetPay</span>
            </VCardTitle>
            <VDivider />
            <VCardText>
              <VRow>
                <VCol cols="12" md="6">
                  <div class="mb-4">
                    <h4 class="text-h6 mb-2">Site ID</h4>
                    <p class="text-body-1">{{ currentPayment.cinetpay_init.site_id }}</p>
                  </div>
                </VCol>
                <VCol cols="12" md="6">
                  <div class="mb-4">
                    <h4 class="text-h6 mb-2">API Key</h4>
                    <p class="text-body-1 font-mono">{{ currentPayment.cinetpay_init.api_key.substring(0, 10) }}...</p>
                  </div>
                </VCol>
                <VCol cols="12" md="6">
                  <div class="mb-4">
                    <h4 class="text-h6 mb-2">Transaction ID</h4>
                    <p class="text-body-1 font-mono">{{ currentPayment.cinetpay_init.transaction_id }}</p>
                  </div>
                </VCol>
                <VCol cols="12" md="6">
                  <div class="mb-4">
                    <h4 class="text-h6 mb-2">Méthode</h4>
                    <p class="text-body-1">{{ currentPayment.cinetpay_init.payment_method }}</p>
                  </div>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>

        <!-- Informations secondaires -->
        <VCol cols="12" lg="4">
          <!-- Dates -->
          <VCard class="mb-4">
            <VCardTitle class="d-flex align-center">
              <VIcon icon="ri-calendar-line" class="me-2" color="primary" />
              <span>Dates</span>
            </VCardTitle>
            <VDivider />
            <VCardText>
              <div class="mb-4">
                <h4 class="text-h6 mb-2">Date de création</h4>
                <p class="text-body-1">{{ formatDate(currentPayment.created_at) }}</p>
              </div>
              <div class="mb-4">
                <h4 class="text-h6 mb-2">Dernière modification</h4>
                <p class="text-body-1">{{ formatDate(currentPayment.updated_at) }}</p>
              </div>
              <div class="mb-4" v-if="currentPayment.payment_date">
                <h4 class="text-h6 mb-2">Date de paiement</h4>
                <p class="text-body-1">{{ formatDate(currentPayment.payment_date) }}</p>
              </div>
            </VCardText>
          </VCard>

          <!-- Actions -->
          <VCard>
            <VCardTitle class="d-flex align-center">
              <VIcon icon="ri-settings-3-line" class="me-2" color="primary" />
              <span>Actions</span>
            </VCardTitle>
            <VDivider />
            <VCardActions class="flex-column align-stretch">
              <VBtn 
                v-if="currentPayment.status === 'pending'"
                color="warning" 
                variant="outlined" 
                prepend-icon="ri-check-line"
                @click="verifyPayment"
                block
                class="mb-2"
              >
                Vérifier le paiement
              </VBtn>
              <VBtn 
                v-if="currentPayment.status === 'accepted'"
                color="error" 
                variant="outlined" 
                prepend-icon="ri-refund-line"
                @click="refundPayment"
                block
                class="mb-2"
              >
                Rembourser
              </VBtn>
              <VBtn 
                v-if="currentPayment.payment_url"
                color="primary" 
                variant="outlined" 
                prepend-icon="ri-external-link-line"
                :href="currentPayment.payment_url" 
                target="_blank"
                block
              >
                Ouvrir le lien de paiement
              </VBtn>
            </VCardActions>
          </VCard>
        </VCol>
      </VRow>
    </div>

    <!-- Paiement non trouvé -->
    <VCard v-else>
      <VCardText class="text-center py-12">
        <VIcon icon="ri-error-warning-line" size="60" class="text-error mb-4" />
        <h3 class="text-h5 mb-2">Paiement non trouvé</h3>
        <p class="text-body-1 text-medium-emphasis mb-4">
          Le paiement que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <VBtn color="primary" :to="{ name: 'payments-index' }">
          Retour à la liste
        </VBtn>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePaymentStore } from '@/stores/payments'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'
import { PaymentStatusEnum } from '@/types/enums'
import type { Payment } from '@/types/payments'

const router = useRouter()
const route = useRoute()
const paymentStore = usePaymentStore()

// State
const error = ref('')
const currentPayment = ref<Payment | null>(null)

// Computed
const isLoading = computed(() => paymentStore.isLoading)
const paymentId = computed(() => route.params.id as string)

// Methods
const loadPayment = async () => {
  try {
    const id = paymentId.value
    currentPayment.value = await paymentStore.fetchPayment(id)
  } catch (err: any) {
    console.error('Erreur lors du chargement du paiement:', err)
    error.value = 'Erreur lors du chargement du paiement'
  }
}

const verifyPayment = async () => {
  if (!currentPayment.value) return

  const confirmed = await confirmAction({
    title: 'Vérifier le paiement',
    text: `Êtes-vous sûr de vouloir vérifier ce paiement ?`,
    confirmButtonText: '<span style="color:white">Vérifier</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })

  if (confirmed) {
    try {
      await paymentStore.verifyPayment(currentPayment.value.id)
      showToast({ message: 'Paiement vérifié avec succès', type: 'success' })
      loadPayment()
    } catch (err: any) {
      console.error('Erreur lors de la vérification:', err)
      showToast({ message: 'Erreur lors de la vérification', type: 'error' })
    }
  }
}

const refundPayment = async () => {
  if (!currentPayment.value) return

  const confirmed = await confirmAction({
    title: 'Rembourser le paiement',
    text: `Êtes-vous sûr de vouloir rembourser le paiement de ${currentPayment.value.amount} ${currentPayment.value.currency} ?`,
    confirmButtonText: '<span style="color:white">Rembourser</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })

  if (confirmed) {
    try {
      await paymentStore.refundPayment(currentPayment.value.id)
      showToast({ message: 'Paiement remboursé avec succès', type: 'success' })
      loadPayment()
    } catch (err: any) {
      console.error('Erreur lors du remboursement:', err)
      showToast({ message: 'Erreur lors du remboursement', type: 'error' })
    }
  }
}

const clearError = () => {
  error.value = ''
}

const getStatusLabel = (status: string) => {
  const labels = {
    [PaymentStatusEnum.PENDING]: 'En attente',
    [PaymentStatusEnum.ACCEPTED]: 'Accepté',
    [PaymentStatusEnum.REFUSED]: 'Refusé',
    [PaymentStatusEnum.CANCELLED]: 'Annulé',
    [PaymentStatusEnum.ERROR]: 'Erreur',
    [PaymentStatusEnum.REPAY]: 'Remboursé',
  }
  return labels[status as PaymentStatusEnum] || status
}

const getStatusColor = (status: string) => {
  const colors = {
    [PaymentStatusEnum.PENDING]: 'warning',
    [PaymentStatusEnum.ACCEPTED]: 'success',
    [PaymentStatusEnum.REFUSED]: 'error',
    [PaymentStatusEnum.CANCELLED]: 'grey',
    [PaymentStatusEnum.ERROR]: 'error',
    [PaymentStatusEnum.REPAY]: 'info',
  }
  return colors[status as PaymentStatusEnum] || 'grey'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  loadPayment()
})
</script>

<style scoped>
.payment-detail-page {
  padding: 24px;
}
</style>