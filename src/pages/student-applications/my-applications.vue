<template>
  <VContainer class="my-student-applications-page">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">
          <VIcon icon="ri-user-line" class="me-3" color="primary" />
          Mes candidatures
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Gérez vos candidatures aux formations (payées et non payées)
        </p>
      </div>
      <VBtn color="primary" @click="goToCreateApplication">
        <VIcon class="mr-2">ri-add-line</VIcon>
        Nouvelle candidature
      </VBtn>
    </div>

    <!-- Filtres et recherche -->
    <VCard class="mb-6" elevation="1">
      <VCardText class="py-4">
        <VRow>
          <VCol cols="12" md="4">
            <VTextField v-model="searchQuery" label="Rechercher" variant="outlined" density="comfortable"
              prepend-inner-icon="ri-search-line" placeholder="Numéro, formation..." clearable
              @input="handleSearch" />
          </VCol>
          <VCol cols="12" md="3">
            <VSelect v-model="filters.status" :items="statusOptions" label="Statut" variant="outlined"
              density="comfortable" clearable @update:model-value="handleFilterChange" />
          </VCol>
          <VCol cols="12" md="3">
            <VSelect v-model="filters.is_paid" :items="paymentOptions" label="Paiement" variant="outlined"
              density="comfortable" clearable @update:model-value="handleFilterChange" />
          </VCol>
          <VCol cols="12" md="2">
            <VBtn variant="outlined" color="primary" @click="resetFilters" :disabled="!hasActiveFilters" block>
              <VIcon class="mr-2">ri-refresh-line</VIcon>
              Réinitialiser
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Statistiques -->
    <VRow class="mb-6">
      <VCol cols="12" md="3">
        <VCard>
          <VCardText class="d-flex flex-column align-center">
            <div class="rounded-circle d-flex align-center justify-center mb-3">
              <VIcon size="28" color="primary">ri-file-list-line</VIcon>
            </div>
            <div class="text-h4 font-weight-bold text-primary">{{ totalApplicationsCount }}</div>
            <div class="text-caption mt-1">Total candidatures</div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="3">
        <VCard>
          <VCardText class="d-flex flex-column align-center">
            <div class="rounded-circle d-flex align-center justify-center mb-3">
              <VIcon size="28" color="info">ri-send-plane-line</VIcon>
            </div>
            <div class="text-h4 font-weight-bold text-info">{{ getStatusCount('SUBMITTED') }}</div>
            <div class="text-caption mt-1">Soumises</div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="3">
        <VCard>
          <VCardText class="d-flex flex-column align-center">
            <div class="rounded-circle d-flex align-center justify-center mb-3">
              <VIcon size="28" color="success">ri-check-line</VIcon>
            </div>
            <div class="text-h4 font-weight-bold text-success">{{ getStatusCount('APPROVED') }}</div>
            <div class="text-caption mt-1">Approuvées</div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="3">
        <VCard>
          <VCardText class="d-flex flex-column align-center">
            <div class="rounded-circle d-flex align-center justify-center mb-3">
              <VIcon size="28" color="error">ri-close-line</VIcon>
            </div>
            <div class="text-h4 font-weight-bold text-error">{{ getStatusCount('REFUSED') }}</div>
            <div class="text-caption mt-1">Refusées</div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Liste des candidatures -->
    <VRow>
      <VCol v-for="application in myFilteredApplications" :key="application.id" cols="12" md="6" lg="4">
        <StudentApplicationCard :application="application" @view="handleView" @delete="handleDelete"
          @submit="handleSubmit" @pay="handlePay" />
      </VCol>
    </VRow>

    <!-- Bouton charger plus -->
    <div v-if="!canLoadMore" class="text-center pa-4">
      <VBtn variant="outlined" color="primary" :loading="isLoading" @click="loadMoreApplications">
        <VIcon class="mr-2">ri-arrow-down-line</VIcon>
        Charger plus
      </VBtn>
    </div>

    <!-- État vide -->
    <VCard v-else-if="!isLoading && !hasApplications" elevation="1">
      <VCardText class="text-center py-12">
        <VIcon size="64" color="grey-lighten-1" class="mb-4">ri-file-list-line</VIcon>
        <h3 class="text-h6 mb-2">Aucune candidature</h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Vous n'avez pas encore de candidatures aux formations.
        </p>
        <VBtn color="primary" @click="goToCreateApplication">
          <VIcon class="mr-2">ri-add-line</VIcon>
          Créer ma première candidature
        </VBtn>
      </VCardText>
    </VCard>

    <!-- Chargement -->
    <VCard v-if="isLoading" elevation="1">
      <VCardText class="text-center py-12">
        <VProgressCircular indeterminate color="primary" size="64" class="mb-4" />
        <p class="text-body-1">Chargement des candidatures...</p>
      </VCardText>
    </VCard>

    <!-- Utilisateur non connecté -->
    <VCard v-if="!isAuthenticated" elevation="1">
      <VCardText class="text-center py-12">
        <VIcon size="64" color="warning" class="mb-4">ri-user-line</VIcon>
        <h3 class="text-h6 mb-2">Connexion requise</h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Vous devez être connecté pour accéder à vos candidatures.
        </p>
        <VBtn color="primary" @click="router.push('/login')">
          <VIcon class="mr-2">ri-login-box-line</VIcon>
          Se connecter
        </VBtn>
      </VCardText>
    </VCard>

    <!-- Erreur -->
    <VCard v-else-if="error" elevation="1">
      <VCardText class="text-center py-12">
        <VIcon size="64" color="error" class="mb-4">ri-error-warning-line</VIcon>
        <h3 class="text-h6 mb-2">Erreur de chargement</h3>
        <p class="text-body-2 text-medium-emphasis mb-4">{{ error }}</p>
        <VBtn color="primary" @click="loadMyApplications(true)">
          <VIcon class="mr-2">ri-refresh-line</VIcon>
          Réessayer
        </VBtn>
      </VCardText>
    </VCard>

    <!-- Modal de paiement rapide -->
    <VDialog v-model="showPaymentModal" max-width="500" persistent>
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon class="mr-2" color="warning">ri-bank-card-line</VIcon>
          Paiement des frais
        </VCardTitle>
        <VCardText>
          <VAlert type="info" variant="tonal" class="mb-4">
            <VIcon class="mr-2">ri-information-line</VIcon>
            Vous devez payer les frais d'étude de dossier pour finaliser votre candidature.
          </VAlert>
          
          <div class="mb-4">
            <h4 class="text-h6 mb-2">Détails de la candidature</h4>
            <p class="text-body-2 mb-1"><strong>Formation:</strong> {{ selectedApplication?.training_title }}</p>
            <p class="text-body-2 mb-1"><strong>Numéro:</strong> {{ selectedApplication?.application_number }}</p>
          </div>

          <!-- Frais d'étude de dossier -->
          <VCard v-if="!isRegistrationFeePaid" variant="tonal" color="warning" class="mb-4">
            <VCardText>
              <div class="d-flex align-center justify-space-between mb-3">
                <div class="d-flex align-center">
                  <VIcon color="warning" class="mr-2">ri-file-text-line</VIcon>
                  <span class="text-h6">Frais d'étude de dossier</span>
                </div>
                <span class="text-h5 font-weight-bold text-warning">{{ formatCurrency(selectedApplication?.registration_fee || 0) }}</span>
              </div>
              <p class="text-body-2 text-medium-emphasis mb-3">
                Frais obligatoires pour l'étude de votre candidature
              </p>
              <VBtn 
                color="warning" 
                variant="flat" 
                @click="handlePayRegistrationFee"
                :disabled="isProcessingPayment"
                :loading="isProcessingPayment"
                block
              >
                <VIcon class="mr-2">ri-bank-card-line</VIcon>
                {{ isProcessingPayment ? 'Traitement...' : 'Payer les frais d\'étude' }}
              </VBtn>
            </VCardText>
          </VCard>

          <!-- Frais de formation -->
          <VCard v-if="!isTrainingFeePaid && isRegistrationFeePaid" variant="tonal" color="info" class="mb-4">
            <VCardText>
              <div class="d-flex align-center justify-space-between mb-3">
                <div class="d-flex align-center">
                  <VIcon color="info" class="mr-2">ri-graduation-cap-line</VIcon>
                  <span class="text-h6">Frais de formation</span>
                </div>
                <span class="text-h5 font-weight-bold text-info">{{ formatCurrency(selectedApplication?.training_fee || 0) }}</span>
              </div>
              <p class="text-body-2 text-medium-emphasis mb-3">
                Frais pour participer à la formation
              </p>
              <VBtn 
                color="info" 
                variant="flat" 
                @click="handlePayTrainingFee"
                :disabled="isProcessingPayment"
                :loading="isProcessingPayment"
                block
              >
                <VIcon class="mr-2">ri-bank-card-line</VIcon>
                {{ isProcessingPayment ? 'Traitement...' : 'Payer les frais de formation' }}
              </VBtn>
            </VCardText>
          </VCard>

          <!-- Résumé des paiements -->
          <VCard variant="outlined" class="mb-4">
            <VCardText>
              <h4 class="text-h6 mb-3">Résumé des frais</h4>
              <div class="d-flex align-center justify-space-between mb-2">
                <span class="text-body-2">Frais d'inscription</span>
                <div class="d-flex align-center">
                  <span class="text-body-2 mr-2">{{ formatCurrency(selectedApplication?.registration_fee || 0) }}</span>
                  <VIcon v-if="isRegistrationFeePaid" color="success" size="small">ri-check-line</VIcon>
                  <VIcon v-else color="warning" size="small">ri-time-line</VIcon>
                </div>
              </div>
              <div class="d-flex align-center justify-space-between mb-2">
                <span class="text-body-2">Frais de formation</span>
                <div class="d-flex align-center">
                  <span class="text-body-2 mr-2">{{ formatCurrency(selectedApplication?.training_fee || 0) }}</span>
                  <VIcon v-if="isTrainingFeePaid" color="success" size="small">ri-check-line</VIcon>
                  <VIcon v-else color="warning" size="small">ri-time-line</VIcon>
                </div>
              </div>
              <VDivider class="my-2" />
              <div class="d-flex align-center justify-space-between">
                <span class="text-h6 font-weight-bold">Total à payer</span>
                <span class="text-h6 font-weight-bold text-primary">{{ formatCurrency(totalPaymentAmount) }}</span>
              </div>
            </VCardText>
          </VCard>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="outlined" @click="closePaymentModal" :disabled="isProcessingPayment">
            Fermer
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentApplication } from '@/composables/useStudentApplication'
import { useAuth } from '@/composables/useAuth'
import { ApplicationStatusEnum } from '@/types/student-application'
import StudentApplicationCard from '@/components/student-application/StudentApplicationCard.vue'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'
import { studentApplicationsService } from '@/services/api/student-applications'

// Router
const router = useRouter()

// Auth
const { user, isAuthenticated } = useAuth()

// Composable
const {
  applications,
  isLoading,
  isSubmitting,
  error,
  totalCount,
  searchQuery,
  filters,
  hasApplications,
  canLoadMore,
  filteredApplications,
  myFilteredApplications,
  loadApplications,
  loadMyApplications,
  loadMoreApplications,
  searchApplications,
  applyFilters,
  resetFilters,
  deleteApplication,
  submitApplication,
  payTrainingFee,
  reset,
  getStatusChip,
  canDeleteApplication,
  canSubmitApplication
} = useStudentApplication()

// Local state pour le modal de paiement
const showPaymentModal = ref(false)
const selectedApplication = ref<any>(null)
const isProcessingPayment = ref(false)

// Options
const statusOptions = [
  { title: 'Soumise', value: ApplicationStatusEnum.SUBMITTED },
  { title: 'Approuvée', value: ApplicationStatusEnum.APPROVED },
  { title: 'Refusée', value: ApplicationStatusEnum.REFUSED }
]

const paymentOptions = [
  { title: 'Payée', value: true },
  { title: 'Non payée', value: false }
]

// Computed
const hasActiveFilters = computed(() => {
  return !!(
    searchQuery.value ||
    filters.value.status ||
    filters.value.is_paid !== undefined
  )
})

const totalApplicationsCount = computed(() => {
  return applications.value.length
})

const totalPaymentAmount = computed(() => {
  if (!selectedApplication.value) return 0
  const registrationFee = selectedApplication.value.registration_fee || 0
  const trainingFee = selectedApplication.value.training_fee || 0
  console.log('Calcul du montant total:', {
    registrationFee,
    trainingFee,
    total: registrationFee + trainingFee,
    application: selectedApplication.value
  })
  return registrationFee + trainingFee
})

// Computed pour vérifier les paiements
const isRegistrationFeePaid = computed(() => {
  if (!selectedApplication.value) return false
  // Vérifier si les frais d'inscription sont payés (logique à adapter selon votre backend)
  return selectedApplication.value.registration_fee_paid || false
})

const isTrainingFeePaid = computed(() => {
  if (!selectedApplication.value) return false
  // Vérifier si les frais de formation sont payés (logique à adapter selon votre backend)
  return selectedApplication.value.training_fee_paid || false
})

// Methods
const handleSearch = async (query: string) => {
  await searchApplications(query)
}

const handleFilterChange = async () => {
  await applyFilters(filters.value)
}

const handleView = (id: number) => {
  // Redirection vers la page de création pour voir
  router.push({ name: 'student-applications-create' })
}

const handleDelete = async (id: number) => {
  const application = applications.value.find(app => app.id === id)
  if (!application) return

  const confirmed = await confirmAction({
    title: 'Supprimer la candidature',
    text: `Êtes-vous sûr de vouloir supprimer la candidature ${application.application_number} ?`,
    confirmButtonText: 'Supprimer',
    cancelButtonText: 'Annuler',
    icon: 'error'
  })

  if (confirmed) {
    try {
      await deleteApplication(id)
      showToast({
        message: 'Candidature supprimée avec succès',
        type: 'success'
      })
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

const handleSubmit = async (id: number) => {
  const application = applications.value.find(app => app.id === id)
  if (!application) return

  const confirmed = await confirmAction({
    title: 'Soumettre la candidature',
    text: `Êtes-vous sûr de vouloir soumettre la candidature ${application.application_number} ?`,
    confirmButtonText: 'Soumettre',
    cancelButtonText: 'Annuler',
    icon: 'info'
  })

  if (confirmed) {
    try {
      await submitApplication(id)
      showToast({
        message: 'Candidature soumise avec succès',
        type: 'success'
      })
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
    }
  }
}

const handlePay = (application: any) => {
  console.log('Application sélectionnée pour paiement:', application)
  console.log('Registration fee:', application.registration_fee)
  console.log('Training fee:', application.training_fee)
  selectedApplication.value = application
  showPaymentModal.value = true
}

const closePaymentModal = () => {
  showPaymentModal.value = false
  selectedApplication.value = null
  isProcessingPayment.value = false
}

const handlePayRegistrationFee = async () => {
  if (!selectedApplication.value) return

  try {
    isProcessingPayment.value = true
    
    console.log('Paiement des frais d\'étude pour la candidature:', selectedApplication.value.id)
    
    const paymentResponse = await studentApplicationsService.submitApplicationWithPayment(selectedApplication.value.id)
    
    console.log('Réponse du paiement des frais d\'étude:', paymentResponse)
    
    // Rediriger vers la plateforme de paiement
    if (paymentResponse.data?.payment_link) {
      console.log('Redirection vers:', paymentResponse.data.payment_link)
      window.location.href = paymentResponse.data.payment_link
    } else {
      console.log('Aucun lien de paiement trouvé dans la réponse:', paymentResponse.data)
      showToast({
        message: 'Aucun lien de paiement trouvé',
        type: 'error'
      })
    }
    
  } catch (error: any) {
    console.error('Erreur lors du paiement des frais d\'étude:', error)
    console.error('Détails de l\'erreur:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })
    
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'initialisation du paiement des frais d\'étude'
      showToast({
        message: errorMessage,
        type: 'error'
      })
    } else {
      showToast({
        message: 'Erreur lors de l\'initiation du paiement des frais d\'étude',
        type: 'error'
      })
    }
  } finally {
    isProcessingPayment.value = false
  }
}

const handlePayTrainingFee = async () => {
  if (!selectedApplication.value) return

  try {
    isProcessingPayment.value = true
    
    console.log('Paiement des frais de formation pour la candidature:', selectedApplication.value.id)
    
    const paymentResponse = await studentApplicationsService.submitApplicationWithPayment(selectedApplication.value.id)
    
    console.log('Réponse du paiement des frais de formation:', paymentResponse)
    
    // Rediriger vers la plateforme de paiement
    if (paymentResponse.data?.payment_link) {
      console.log('Redirection vers:', paymentResponse.data.payment_link)
      window.location.href = paymentResponse.data.payment_link
    } else {
      console.log('Aucun lien de paiement trouvé dans la réponse:', paymentResponse.data)
      showToast({
        message: 'Aucun lien de paiement trouvé',
        type: 'error'
      })
    }
    
  } catch (error: any) {
    console.error('Erreur lors du paiement des frais de formation:', error)
    console.error('Détails de l\'erreur:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })
    
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'initialisation du paiement des frais de formation'
      showToast({
        message: errorMessage,
        type: 'error'
      })
    } else {
      showToast({
        message: 'Erreur lors de l\'initiation du paiement des frais de formation',
        type: 'error'
      })
    }
  } finally {
    isProcessingPayment.value = false
  }
}


const goToCreateApplication = () => {
  router.push({ name: 'student-applications-create' })
}

const formatCurrency = (amount: number | undefined) => {
  if (!amount) return '0,00 €'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

const getStatusCount = (status: string) => {
  return applications.value.filter(app => app.status === status).length
}

// Lifecycle
onMounted(() => {
  if (isAuthenticated.value) {
    loadMyApplications(true)
  } else {
    console.warn('Utilisateur non connecté, redirection vers la page de connexion')
    router.push('/login')
  }
})
</script>

<style scoped>
.my-student-applications-page {
  max-width: 1200px;
}
</style>
