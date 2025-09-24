<template>
  <VContainer>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="d-flex align-center">
        <VBtn icon variant="text" class="mr-3" @click="goBack">
          <VIcon icon="ri-arrow-left-line" color="primary" />
        </VBtn>
        <div>
          <h1 class="text-h4 font-weight-bold mb-2">
            Paiement des frais de formation
          </h1>
          <p class="text-body-1 text-medium-emphasis">
            Effectuez le paiement des frais de votre candidature
          </p>
        </div>
      </div>
    </div>

    <!-- Informations de la candidature -->
    <VCard v-if="application" class="mb-6" elevation="1">
      <VCardTitle class="d-flex align-center">
        <VIcon color="primary" class="mr-2">ri-file-list-line</VIcon>
        <span class="text-h6">Détails de la candidature</span>
      </VCardTitle>
      <VDivider />
      <VCardText class="py-4">
        <VRow>
          <VCol cols="12" md="6">
            <div class="d-flex align-center mb-3">
              <VIcon color="primary" class="mr-2">ri-hashtag</VIcon>
              <div>
                <div class="text-caption text-medium-emphasis">Numéro de candidature</div>
                <div class="text-body-1 font-weight-medium">{{ application.application_number }}</div>
              </div>
            </div>
          </VCol>
          <VCol cols="12" md="6">
            <div class="d-flex align-center mb-3">
              <VIcon color="primary" class="mr-2">ri-graduation-cap-line</VIcon>
              <div>
                <div class="text-caption text-medium-emphasis">Formation</div>
                <div class="text-body-1 font-weight-medium">{{ application.training_title || 'Formation non spécifiée' }}</div>
              </div>
            </div>
          </VCol>
          <VCol cols="12" md="6">
            <div class="d-flex align-center mb-3">
              <VIcon color="primary" class="mr-2">ri-calendar-line</VIcon>
              <div>
                <div class="text-caption text-medium-emphasis">Session</div>
                <div class="text-body-1 font-weight-medium">
                  {{ formatDate(application.training_session_start_date) }} - {{ formatDate(application.training_session_end_date) }}
                </div>
              </div>
            </div>
          </VCol>
          <VCol cols="12" md="6">
            <div class="d-flex align-center mb-3">
              <VIcon color="primary" class="mr-2">ri-toggle-line</VIcon>
              <div>
                <div class="text-caption text-medium-emphasis">Statut</div>
                <VChip :color="statusChip.color" size="small" label>
                  <VIcon start :icon="statusChip.icon" />
                  {{ statusChip.text }}
                </VChip>
              </div>
            </div>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Détails des frais -->
    <VCard class="mb-6" elevation="1">
      <VCardTitle class="d-flex align-center">
        <VIcon color="success" class="mr-2">ri-money-euro-circle-line</VIcon>
        <span class="text-h6">Frais à payer</span>
      </VCardTitle>
      <VDivider />
      <VCardText class="py-4">
        <VRow>
          <VCol cols="12" md="6">
            <div class="d-flex justify-space-between align-center mb-3">
              <span class="text-body-1">Frais d'inscription</span>
              <span class="text-h6 font-weight-bold text-primary">
                {{ formatCurrency(application?.registration_fee) }}
              </span>
            </div>
          </VCol>
          <VCol cols="12" md="6">
            <div class="d-flex justify-space-between align-center mb-3">
              <span class="text-body-1">Frais de formation</span>
              <span class="text-h6 font-weight-bold text-primary">
                {{ formatCurrency(application?.training_fee) }}
              </span>
            </div>
          </VCol>
        </VRow>
        <VDivider class="my-4" />
        <div class="d-flex justify-space-between align-center">
          <span class="text-h6 font-weight-bold">Total à payer</span>
          <span class="text-h4 font-weight-bold text-success">
            {{ formatCurrency(totalAmount) }}
          </span>
        </div>
      </VCardText>
    </VCard>

    <!-- Formulaire de paiement -->
    <VCard class="mb-6" elevation="1">
      <VCardTitle class="d-flex align-center">
        <VIcon color="warning" class="mr-2">ri-bank-card-line</VIcon>
        <span class="text-h6">Informations de paiement</span>
      </VCardTitle>
      <VDivider />
      <VCardText class="py-4">
        <VForm ref="formRef" @submit.prevent="handlePayment">
          <VRow>
            <VCol cols="12">
              <VAlert type="info" variant="tonal" class="mb-4">
                <template #prepend>
                  <VIcon icon="ri-information-line" />
                </template>
                <div>
                  <strong>Mode de paiement</strong>
                  <p class="mb-0">Vous serez redirigé vers une plateforme de paiement sécurisée pour effectuer votre paiement.</p>
                </div>
              </VAlert>
            </VCol>

            <VCol cols="12">
              <VCheckbox
                v-model="acceptTerms"
                label="J'accepte les conditions de paiement et la politique de confidentialité"
                :rules="[(v: boolean) => !!v || 'Vous devez accepter les conditions']"
                required
              />
            </VCol>
          </VRow>

          <!-- Actions -->
          <VCardActions class="px-0 pt-6">
            <VSpacer />
            <VBtn variant="outlined" @click="goBack">
              Annuler
            </VBtn>
            <VBtn
              type="submit"
              color="success"
              :loading="isProcessing"
              :disabled="isProcessing || !acceptTerms"
              prepend-icon="ri-bank-card-line"
            >
              Payer {{ formatCurrency(totalAmount) }}
            </VBtn>
          </VCardActions>
        </VForm>
      </VCardText>
    </VCard>

    <!-- Chargement -->
    <div v-if="isLoading" class="text-center pa-8">
      <VProgressCircular indeterminate color="primary" size="64" class="mb-4" />
      <p class="text-body-1">Chargement des informations de paiement...</p>
    </div>

    <!-- Erreur -->
    <VAlert v-if="error" type="error" class="mt-4" closable @click:close="clearError">
      {{ error }}
    </VAlert>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStudentApplication } from '@/composables/useStudentApplication'
import type { StudentApplicationFullOut } from '@/types/student-application'
import { ApplicationStatusEnum } from '@/types/student-application'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'
import { VForm } from 'vuetify/components'

const router = useRouter()
const route = useRoute()

// Composable
const {
  application,
  isLoading,
  error,
  loadApplication,
  getStatusChip,
  payTrainingFee
} = useStudentApplication()

// Local state
const isProcessing = ref(false)
const acceptTerms = ref(false)
const formRef = ref<VForm | null>(null)

// Computed
const statusChip = computed(() => {
  if (!application.value) return { text: '', color: 'grey', icon: 'ri-question-line' }
  return getStatusChip(application.value.status)
})

const totalAmount = computed(() => {
  if (!application.value) return 0
  const registrationFee = application.value.registration_fee || 0
  const trainingFee = application.value.training_fee || 0
  return registrationFee + trainingFee
})

// Methods
const goBack = () => {
  router.push({ name: 'student-applications-index' })
}

const formatDate = (date: string | undefined) => {
  if (!date) return 'Non définie'
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatCurrency = (amount: number | undefined) => {
  if (!amount) return '0,00 €'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

const handlePayment = async () => {
  if (!application.value) return

  // Validation du formulaire
  const { valid } = await formRef.value!.validate()
  if (!valid) return

  // Confirmation avant paiement
  const confirmed = await confirmAction({
    title: 'Confirmer le paiement',
    html: `Voulez-vous procéder au paiement de <b>${formatCurrency(totalAmount.value)}</b> pour la candidature <b>${application.value.application_number}</b> ?`,
    confirmButtonText: `<span style="color:white">Payer</span>`,
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#6c757d',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })

  if (!confirmed) return

  try {
    isProcessing.value = true

    const paymentData = {
      training_session_id: application.value.target_session_id,
      amount: totalAmount.value
    }

    console.log('💳 Données de paiement:', paymentData)
    const response = await payTrainingFee(paymentData)
    
    // Redirection vers la plateforme de paiement
    if (response.data.payment_url) {
      window.location.href = response.data.payment_url
    } else {
      showToast({ 
        message: 'Redirection vers la plateforme de paiement...', 
        type: 'info' 
      })
    }

  } catch (err: any) {
    console.error('Erreur lors du paiement:', err)
    showToast({ 
      message: 'Erreur lors de l\'initialisation du paiement', 
      type: 'error' 
    })
  } finally {
    isProcessing.value = false
  }
}

const clearError = () => {
  error.value = ''
}

// Lifecycle
onMounted(async () => {
  const applicationId = route.params.id as string
  if (applicationId) {
    await loadApplication(parseInt(applicationId))
  }
})
</script>

<style scoped>
.payment-page {
  max-width: 800px;
}
</style>
