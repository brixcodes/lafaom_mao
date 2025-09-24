<template>
  <div class="payment-init-page">
    <!-- En-tête -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 mb-2">
          <VIcon icon="ri-add-line" class="me-3" color="primary" />
          Nouveau paiement
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Initialisez un nouveau paiement
        </p>
      </div>
      <VBtn variant="outlined" prepend-icon="ri-arrow-left-line" :to="{ name: 'payments-index' }">
        Retour à la liste
      </VBtn>
    </div>

    <!-- Formulaire -->
    <VCard>
      <VForm ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
        <VCardTitle class="d-flex align-center">
          <VIcon icon="ri-money-dollar-circle-line" class="me-2" color="primary" />
          <span>Informations du paiement</span>
        </VCardTitle>
        <VDivider />
        <VCardText>
          <VRow>
            <!-- Montant -->
            <VCol cols="12" md="6">
              <VTextField
                v-model.number="payment.amount"
                label="Montant *"
                type="number"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="ri-money-euro-circle-line"
                :rules="[(v: number) => !!v && v > 0 || 'Le montant est obligatoire et doit être positif']"
                required
              />
            </VCol>

            <!-- Devise -->
            <VCol cols="12" md="6">
              <VSelect
                v-model="payment.currency"
                :items="currencyOptions"
                label="Devise *"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="ri-money-dollar-circle-line"
                :rules="[(v: string) => !!v || 'La devise est obligatoire']"
                required
              />
            </VCol>

            <!-- Méthode de paiement -->
            <VCol cols="12" md="6">
              <VSelect
                v-model="payment.payment_method"
                :items="paymentMethodOptions"
                label="Méthode de paiement"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="ri-bank-card-line"
              />
            </VCol>

            <!-- Description -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="payment.description"
                label="Description"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="ri-file-text-line"
              />
            </VCol>

            <!-- Informations du client -->
            <VCol cols="12">
              <VDivider class="my-4">
                <span class="text-h6">Informations du client</span>
              </VDivider>
            </VCol>

            <!-- Nom du client -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="payment.customer_name"
                label="Nom du client"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="ri-user-line"
              />
            </VCol>

            <!-- Email du client -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="payment.customer_email"
                label="Email du client"
                type="email"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="ri-mail-line"
              />
            </VCol>

            <!-- Téléphone du client -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="payment.customer_phone"
                label="Téléphone du client"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="ri-phone-line"
              />
            </VCol>

            <!-- Adresse du client -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="payment.customer_address"
                label="Adresse du client"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="ri-map-pin-line"
              />
            </VCol>

            <!-- URL de retour -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="payment.return_url"
                label="URL de retour"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="ri-links-line"
                hint="URL vers laquelle rediriger après le paiement"
                persistent-hint
              />
            </VCol>

            <!-- URL d'annulation -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="payment.cancel_url"
                label="URL d'annulation"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="ri-close-circle-line"
                hint="URL vers laquelle rediriger en cas d'annulation"
                persistent-hint
              />
            </VCol>
          </VRow>
        </VCardText>

        <VDivider />

        <VCardActions class="pa-4">
          <VBtn 
            variant="outlined" 
            :to="{ name: 'payments-index' }"
            :disabled="isSaving"
          >
            Annuler
          </VBtn>
          <VSpacer />
          <VBtn 
            type="submit" 
            color="primary" 
            :loading="isSaving"
            :disabled="!isFormValid"
          >
            <VIcon icon="ri-save-line" class="me-1" />
            Initialiser le paiement
          </VBtn>
        </VCardActions>
      </VForm>
    </VCard>

    <!-- Message d'erreur -->
    <VAlert v-if="error" type="error" class="mt-4" closable @click:close="clearError">
      {{ error }}
    </VAlert>

    <!-- Résultat du paiement -->
    <VCard v-if="paymentResult" class="mt-4">
      <VCardTitle class="d-flex align-center">
        <VIcon icon="ri-check-circle-line" class="me-2" color="success" />
        <span>Paiement initialisé avec succès</span>
      </VCardTitle>
      <VDivider />
      <VCardText>
        <VRow>
          <VCol cols="12" md="6">
            <div class="mb-4">
              <h4 class="text-h6 mb-2">ID du paiement</h4>
              <p class="text-body-1 font-weight-medium">{{ paymentResult.payment_id }}</p>
            </div>
          </VCol>
          <VCol cols="12" md="6">
            <div class="mb-4">
              <h4 class="text-h6 mb-2">URL de paiement</h4>
              <VBtn 
                variant="outlined" 
                size="small" 
                :href="paymentResult.payment_url" 
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePaymentStore } from '@/stores/payments'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'
import type { PaymentInitInput } from '@/types/payments'

const router = useRouter()
const paymentStore = usePaymentStore()

// Form ref
const formRef = ref()

// State
const isFormValid = ref(false)
const isSaving = ref(false)
const error = ref('')
const paymentResult = ref<any>(null)

// Payment form
const payment = ref<PaymentInitInput>({
  amount: 0,
  currency: 'EUR',
  payment_method: '',
  description: '',
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  customer_address: '',
  return_url: '',
  cancel_url: ''
})

// Options
const currencyOptions = [
  { title: 'EUR', value: 'EUR' },
  { title: 'USD', value: 'USD' },
  { title: 'XOF', value: 'XOF' },
]

const paymentMethodOptions = [
  { title: 'Carte bancaire', value: 'card' },
  { title: 'Mobile Money', value: 'mobile_money' },
  { title: 'Virement bancaire', value: 'bank_transfer' },
  { title: 'Espèces', value: 'cash' },
]

// Methods
const handleSubmit = async () => {
  if (!isFormValid.value) return

  const confirmed = await confirmAction({
    title: 'Initialiser le paiement',
    text: `Êtes-vous sûr de vouloir initialiser un paiement de ${payment.value.amount} ${payment.value.currency} ?`,
    confirmButtonText: '<span style="color:white">Initialiser</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })

  if (!confirmed) return

  isSaving.value = true
  try {
    const result = await paymentStore.initPayment(payment.value)
    paymentResult.value = result
    showToast({ message: 'Paiement initialisé avec succès', type: 'success' })
  } catch (err: any) {
    console.error('Erreur lors de l\'initialisation:', err)
    error.value = err.message || 'Erreur lors de l\'initialisation du paiement'
    showToast({ message: 'Erreur lors de l\'initialisation', type: 'error' })
  } finally {
    isSaving.value = false
  }
}

const clearError = () => {
  error.value = ''
}
</script>

<style scoped>
.payment-init-page {
  padding: 24px;
}
</style>
