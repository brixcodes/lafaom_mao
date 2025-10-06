<template>
  <VContainer class="student-application-detail-container">
    <!-- Header avec navigation -->
    <div class="d-flex justify-space-between align-center mb-4">
      <!-- Partie gauche : bouton retour + titres -->
      <div class="d-flex align-center">
        <VBtn icon variant="text" class="mr-3" @click="goBack">
          <VIcon icon="ri-arrow-left-line" color="primary" />
        </VBtn>
        <div>
          <h1 class="font-weight-bold mb-1">Détails de la candidature</h1>
          <p class="text-body-2 text-secondary mb-0">
            {{ application?.application_number || 'Chargement...' }}
          </p>
        </div>
      </div>

      <!-- Partie droite : boutons d'action -->
      <div>
        <VBtn color="primary" variant="outlined" @click="refreshApplication" class="action-btn mx-1"
          prepend-icon="ri-refresh-line">
          Actualiser
        </VBtn>
        <VBtn v-if="application && canSubmitApplication(application)" color="success" @click="handleSubmit(application.id)" 
          class="action-btn" prepend-icon="ri-send-plane-line" :loading="isSubmitting">
          Soumettre
        </VBtn>
      </div>
    </div>

    <VFadeTransition>
      <VRow v-if="application">
        <VCol cols="12">
          <!-- En-tête avec design moderne -->
          <VSlideYTransition>
            <VCard class="mb-6 application-header-card overflow-hidden" elevation="3">
              <div class="application-header-overlay">
                <div class="application-header-content">
                  <div class="d-flex align-center mb-4 animate-user">
                    <VAvatar size="48" class="mr-3 border-white">
                      <VIcon color="white" size="24">ri-file-list-line</VIcon>
                    </VAvatar>
                    <div>
                      <div class="text-white font-weight-medium">Candidature</div>
                      <div class="text-caption text-white">
                        ID: {{ application.id }}
                      </div>
                    </div>
                  </div>

                  <h1 class="text-h3 font-weight-bold text-white mb-4 animate-title">
                    {{ application.training_title || 'Formation' }}
                  </h1>

                  <div class="d-flex flex-wrap gap-3 mb-4">
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-mail-line</VIcon>
                      <span>{{ application.user_email || application.email }}</span>
                    </div>
                    <div v-if="application.phone_number" class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-phone-line</VIcon>
                      <span>{{ application.phone_number }}</span>
                    </div>
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-calendar-line</VIcon>
                      <span>Créée le {{ formatDate(application.created_at) }}</span>
                    </div>
                  </div>

                  <VSlideXTransition group>
                    <VChip key="application-status" :color="getStatusChip(application.status).color" variant="elevated"
                      size="small" class="mr-2 mb-2 animate-tag">
                      <VIcon :icon="getStatusChip(application.status).icon" class="me-1" />
                      {{ getStatusChip(application.status).text }}
                    </VChip>
                    <VChip key="payment-status" :color="application.payment_id ? 'success' : 'warning'"
                      variant="elevated" size="small" class="mr-2 mb-2 animate-tag">
                      <VIcon :icon="application.payment_id ? 'ri-checkbox-circle-line' : 'ri-time-line'" class="me-1" />
                      {{ application.payment_id ? 'Payé' : 'En attente' }}
                    </VChip>
                    <VChip key="total-amount" color="white" variant="outlined" size="small"
                      class="mr-2 mb-2 animate-tag">
                      {{ formatCurrency(application.registration_fee + application.training_fee) }}
                    </VChip>
                  </VSlideXTransition>
                </div>
              </div>
            </VCard>
          </VSlideYTransition>

          <!-- Contenu principal -->
          <VRow>
            <VCol cols="12" md="8">
              <!-- Informations de la candidature -->
              <VSlideYTransition>
                <VCard v-if="application" class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-file-list-3-line</VIcon>
                    <span class="text-h6">Informations de la candidature</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="py-4">
                    <v-timeline align="start" density="compact" class="pa-3">
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Informations de base</strong> :</div>
                        <div style="margin-left: 10px; line-height: 1.8;">
                          <div>Numéro: {{ application.application_number }}</div>
                          <div>Email: {{ application.user_email || application.email }}</div>
                          <div>Téléphone: {{ application.phone_number || 'Non renseigné' }}</div>
                          <div>Formation: {{ application.training_title || 'Non définie' }}</div>
                          <div>Session: {{ application.training_session_start_date ?
                            formatDate(application.training_session_start_date) : 'Non définie' }}</div>
                        </div>
                      </v-timeline-item>
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Informations financières</strong> :</div>
                        <div style="margin-left: 10px; line-height: 1.8;">
                          <div>Frais d'inscription: {{ formatCurrency(application.registration_fee) }}</div>
                          <div>Frais de formation: {{ formatCurrency(application.training_fee) }}</div>
                          <div>Total: {{ formatCurrency(application.registration_fee + application.training_fee) }}
                          </div>
                          <div>Devise: {{ application.currency }}</div>
                          <div>Statut paiement: {{ application.payment_id ? 'Payé' : 'En attente' }}</div>
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
                    <span class="text-h6">Résumé</span>
                  </VCardTitle>
                  <VDivider />
                  <VList lines="two" density="comfortable">
                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-file-list-line</VIcon>
                      </template>
                      <VListItemTitle>Numéro de candidature</VListItemTitle>
                      <VListItemSubtitle>{{ application.application_number }}</VListItemSubtitle>
                    </VListItem>

                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-school-line</VIcon>
                      </template>
                      <VListItemTitle>Formation</VListItemTitle>
                      <VListItemSubtitle class="font-weight-medium">{{ application.training_title || 'Non définie' }}
                      </VListItemSubtitle>
                    </VListItem>

                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-money-dollar-circle-line</VIcon>
                      </template>
                      <VListItemTitle>Montant total</VListItemTitle>
                      <VListItemSubtitle>{{ formatCurrency(application.registration_fee + application.training_fee) }}
                      </VListItemSubtitle>
                    </VListItem>

                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-calendar-line</VIcon>
                      </template>
                      <VListItemTitle>Date de création</VListItemTitle>
                      <VListItemSubtitle>{{ formatDate(application.created_at) }}</VListItemSubtitle>
                    </VListItem>
                  </VList>

                  <!-- Actions -->
                  <VDivider />
                  <VCardText class="pa-4">
                    <div class="d-flex flex-column gap-3">
                      <VBtn v-if="application && !application.payment_id" color="success" @click="handlePay(application.id)"
                        :loading="isProcessingPayment" block>
                        <VIcon class="mr-2">ri-money-dollar-circle-line</VIcon>
                        Payer
                      </VBtn>

                      <VBtn v-if="application && canSubmitApplication(application)" color="primary"
                        @click="handleSubmit(application.id)" :loading="isSubmitting" block>
                        <VIcon class="mr-2">ri-send-plane-line</VIcon>
                        Soumettre
                      </VBtn>

                      <VBtn v-if="application && canDeleteApplication(application)" color="error" variant="outlined"
                        @click="handleDelete(application.id)" :loading="isDeleting" block>
                        <VIcon class="mr-2">ri-delete-bin-line</VIcon>
                        Supprimer
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
      <VRow v-if="isLoading && !application">
        <VCol cols="12" class="text-center py-8">
          <VProgressCircular indeterminate color="primary" size="64" width="6" />
          <div class="mt-4 text-body-1 animate-fade-in">Chargement de la candidature...</div>
        </VCol>
      </VRow>
    </VFadeTransition>

    <VFadeTransition>
      <VRow v-if="!isLoading && !application && error">
        <VCol cols="12" class="text-center py-8">
          <VIcon size="x-large" color="error" class="mb-4 animate-bounce">ri-alert-circle-line</VIcon>
          <div class="text-h5 mb-3 animate-fade-in">Erreur de chargement</div>
          <div class="text-body-1 mb-6 animate-fade-in">{{ error }}</div>
          <VBtn color="primary" size="large" @click="refreshApplication" prepend-icon="ri-refresh-line"
            class="animate-fade-in">
            Réessayer
          </VBtn>
        </VCol>
      </VRow>
    </VFadeTransition>

    <VFadeTransition>
      <VRow v-if="!isLoading && !application && !error">
        <VCol cols="12" class="text-center py-8">
          <VIcon size="x-large" color="primary" class="mb-4 animate-bounce">ri-file-search-line</VIcon>
          <div class="text-h5 mb-3 animate-fade-in">Candidature non trouvée</div>
          <div class="text-body-1 mb-6 animate-fade-in">La candidature demandée n'existe pas ou a été supprimée.
          </div>
          <VBtn color="primary" size="large" @click="goBack" prepend-icon="ri-arrow-left-line" class="animate-fade-in">
            Retour
          </VBtn>
        </VCol>
      </VRow>
    </VFadeTransition>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStudentApplication } from '@/composables/useStudentApplication'
import { showToast } from '@/components/toast/toastManager'

// Props
const props = defineProps<{
  id: string
}>()

// Composables
const route = useRoute()
const router = useRouter()

// Composable
const {
  currentApplication,
  isLoading,
  isSubmitting,
  isDeleting,
  error,
  loadApplication,
  deleteApplication,
  submitApplication,
  payTrainingFee,
  getStatusChip,
  canDeleteApplication,
  canSubmitApplication
} = useStudentApplication()

// Local state
const isProcessingPayment = ref(false)

// Computed
const application = computed(() => currentApplication.value)

// Methods
const goBack = () => {
  window.history.back()
}

const refreshApplication = async () => {
  const applicationId = parseInt(props.id)
  if (applicationId) {
    await loadApplication(applicationId)
  }
}

// Methods
const formatDate = (dateString: string) => {
  if (!dateString) return 'Non renseigné'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: number) => {
  if (!amount) return '0€'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const handleDelete = async (id: number) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) return

  try {
    await deleteApplication(id)
    showToast({ message: 'Candidature supprimée avec succès', type: 'success' })
    router.push({ name: 'student-applications-index' })
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
}

const handleSubmit = async (id: number) => {
  if (!application.value) return

  if (!confirm('Êtes-vous sûr de vouloir soumettre cette candidature ?')) return

  try {
    await submitApplication(id, application.value.target_session_id)
    showToast({ message: 'Candidature soumise avec succès', type: 'success' })
    await loadApplication(parseInt(props.id))
  } catch (error) {
    console.error('Erreur lors de la soumission:', error)
  }
}

const handlePay = async (id: number) => {
  try {
    isProcessingPayment.value = true
    
    // Récupérer les données de la candidature pour le paiement
    if (application.value) {
      const paymentData = {
        training_session_id: application.value.training_session_id,
        amount: application.value.training_fee || 0
      }
      await payTrainingFee(paymentData)
      showToast({ message: 'Redirection vers le paiement...', type: 'info' })
    }
  } catch (error) {
    console.error('Erreur lors du paiement:', error)
  } finally {
    isProcessingPayment.value = false
  }
}

// Lifecycle
onMounted(async () => {
  const applicationId = parseInt(props.id)
  if (applicationId) {
    await loadApplication(applicationId)
  }
})
</script>

<style scoped>
.student-application-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 3rem;
}

.application-header-card {
  position: relative;
  overflow: hidden;
}

.application-header-overlay {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  padding: 2rem;
  color: white;
}

.application-header-overlay::before {
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

.application-header-content {
  position: relative;
  z-index: 2;
}

.border-white {
  border: 2px solid rgba(255, 255, 255, 0.7);
}

.animate-user {
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

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .student-application-detail-container {
    padding: 1rem;
  }

  .application-header-overlay {
    padding: 1.5rem;
  }

  .application-header-content h1 {
    font-size: 1.5rem !important;
  }
}
</style>
