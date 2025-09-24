<template>
  <VContainer class="training-session-detail-container">
    <!-- Header avec navigation -->
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="d-flex align-center">
        <VBtn icon variant="text" class="mr-3" @click="goBack">
          <VIcon icon="ri-arrow-left-line" color="primary" />
        </VBtn>
        <div>
          <h1 class="font-weight-bold mb-1">Détails de la session</h1>
          <p class="text-body-2 text-secondary mb-0">
            Consultez les détails de la session de formation.
          </p>
        </div>
      </div>
      <div>
        <VBtn  color="primary" variant="flat" class="mx-2" @click="editSession" prepend-icon="ri-edit-line">
          Modifier
        </VBtn>
        <VBtn color="primary" @click="registerToSession" prepend-icon="ri-user-add-line">
          S'inscrire
        </VBtn>
      </div>
    </div>

    <VFadeTransition>
      <VRow v-if="session">
        <VCol cols="12">
          <!-- En-tête avec design moderne -->
          <VSlideYTransition>
            <VCard class="mb-6 training-session-header-card overflow-hidden" elevation="3">
              <div class="training-session-header-overlay">
                <div class="training-session-header-content">
                  <div class="d-flex align-center mb-4 animate-specialty">
                    <VAvatar size="48" class="mr-3 border-white">
                      <VIcon color="white" size="24">ri-calendar-line</VIcon>
                    </VAvatar>
                    <div>
                      <div class="text-white font-weight-medium">{{ getTrainingName(session.training_id) }}</div>
                      <div class="text-caption text-white">
                        ID: {{ session.id }}
                      </div>
                    </div>
                  </div>

                  <h1 class="text-h3 font-weight-bold text-white mb-4 animate-title">
                    Session de Formation
                  </h1>

                  <div class="d-flex flex-wrap gap-3 mb-4">
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-calendar-line</VIcon>
                      <span>{{ formatDate(session.start_date) }} - {{ formatDate(session.end_date) }}</span>
                    </div>
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-money-euro-circle-line</VIcon>
                      <span>{{ formatCurrency(session.training_fee) }}</span>
                    </div>
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-user-line</VIcon>
                      <span>{{ session.available_slots || 0 }} places disponibles</span>
                    </div>
                  </div>

                  <VSlideXTransition group>
                    <VChip key="session-status" :color="statusChip.color" variant="elevated" size="small"
                      class="mr-2 mb-2 animate-tag">
                      {{ statusChip.text }}
                    </VChip>
                  </VSlideXTransition>
                </div>
              </div>
            </VCard>
          </VSlideYTransition>

          <!-- Contenu principal -->
          <VRow>
            <VCol cols="12" md="8">
              <!-- Informations de la session -->
              <VSlideYTransition>
                <VCard v-if="session" class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-information-line</VIcon>
                    <span class="text-h6">Informations de la session</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="py-4">
                    <v-timeline align="start" density="compact" class="pa-3">
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Formation</strong> :</div>
                        <div style="margin-left: 10px; line-height: 1.8;">{{ getTrainingName(session.training_id) }}</div>
                      </v-timeline-item>
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Période</strong> :</div>
                        <div style="margin-left: 10px; line-height: 1.8;">
                          Du {{ formatDate(session.start_date) }} au {{ formatDate(session.end_date) }}
                        </div>
                      </v-timeline-item>
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Date limite d'inscription</strong> :</div>
                        <div style="margin-left: 10px; line-height: 1.8;">{{ formatDate(session.registration_deadline) }}</div>
                      </v-timeline-item>
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Places disponibles</strong> :</div>
                        <div style="margin-left: 10px; line-height: 1.8;">{{ session.available_slots || 0 }} places</div>
                      </v-timeline-item>
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Frais</strong> :</div>
                        <div style="margin-left: 10px; line-height: 1.8;">
                          <div>Frais d'inscription : {{ formatCurrency(session.registration_fee) }}</div>
                          <div>Frais de formation : {{ formatCurrency(session.training_fee) }}</div>
                        </div>
                      </v-timeline-item>
                    </v-timeline>
                  </VCardText>
                </VCard>
              </VSlideYTransition>
            </VCol>

            <!-- Sidebar avec informations et actions -->
            <VCol cols="12" md="4">
              <!-- Statistiques -->
              <VSlideXReverseTransition>
                <VCard class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-bar-chart-line</VIcon>
                    <span class="text-h6">Statistiques</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="pa-4">
                    <div class="d-flex flex-column gap-4">
                      <div class="d-flex align-center justify-space-between">
                        <span class="text-body-1">Places disponibles</span>
                        <VChip color="primary" size="small">{{ session.available_slots || 0 }}</VChip>
                      </div>
                      <div class="d-flex align-center justify-space-between">
                        <span class="text-body-1">Participants inscrits</span>
                        <VChip color="success" size="small">{{ participantsCount }}</VChip>
                      </div>
                      <div class="d-flex align-center justify-space-between">
                        <span class="text-body-1">Taux d'occupation</span>
                        <VChip color="info" size="small">{{ occupationRate }}%</VChip>
                      </div>
                    </div>
                  </VCardText>
                </VCard>
              </VSlideXReverseTransition>
            </VCol>
          </VRow>
        </VCol>
      </VRow>
    </VFadeTransition>

    <!-- Chargement -->
    <div v-if="isLoading && !session" class="text-center pa-8">
      <VProgressCircular indeterminate color="primary" size="64" class="mb-4" />
      <p class="text-body-1">Chargement de la session...</p>
    </div>

    <!-- Erreur -->
    <VAlert
      v-if="error"
      type="error"
      class="mt-4"
      closable
      @click:close="clearError"
    >
      {{ error }}
    </VAlert>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { trainingService } from '@/services/api/training'
import type { TrainingSession } from '@/types/training'
import { TrainingSessionStatusEnum } from '@/types/training'
import { usePermissions } from '@/composables/usePermissions'
import { TrainingPermission } from '@/types/permissions'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'

const router = useRouter()
const route = useRoute()
const { hasPermission } = usePermissions()

// Data
const session = ref<TrainingSession | null>(null)
const trainings = ref<{ id: string; title: string }[]>([])
const isLoading = ref(true)
const error = ref('')
const participantsCount = ref(0) // TODO: Fetch from API
const isDeleting = ref(false)

// Permissions
const hasUpdatePermission = computed(() => hasPermission(TrainingPermission.EDIT_TRAINING))
const hasDeletePermission = computed(() => hasPermission(TrainingPermission.DELETE_TRAINING))

// Computed
const statusChip = computed(() => {
  if (!session.value) return { text: '', color: 'grey' }
  
  const status = session.value.status
  const statusConfig = {
    [TrainingSessionStatusEnum.OPEN_FOR_REGISTRATION]: { text: 'Ouverte aux inscriptions', color: 'success' },
    [TrainingSessionStatusEnum.CLOSE_FOR_REGISTRATION]: { text: 'Fermée aux inscriptions', color: 'warning' },
    [TrainingSessionStatusEnum.ONGOING]: { text: 'En cours', color: 'info' },
    [TrainingSessionStatusEnum.COMPLETED]: { text: 'Terminée', color: 'grey' }
  }
  
  return statusConfig[status as TrainingSessionStatusEnum] || { text: status, color: 'grey' }
})

const occupationRate = computed(() => {
  if (!session.value?.available_slots) return 0
  const total = session.value.available_slots + participantsCount.value
  return total > 0 ? Math.round((participantsCount.value / total) * 100) : 0
})

// Methods
const goBack = () => {
  router.push({ name: 'training-sessions-index' })
}

const shareSession = () => {
  // TODO: Implement share functionality
  showToast({ message: 'Fonctionnalité de partage à implémenter', type: 'info' })
}

const editSession = () => {
  if (session.value?.id) {
    router.push({ name: 'training-sessions-edit', params: { id: session.value.id } })
  }
}

const registerToSession = () => {
  if (session.value?.id) {
    router.push({ name: 'training-session-register', params: { id: session.value.id } })
  }
}

const confirmDelete = async () => {
  if (!session.value) return

  const confirmed = await confirmAction({
    title: 'Êtes-vous sûr ?',
    html: `Souhaitez-vous réellement supprimer la session <b>${getTrainingName(session.value.training_id)}</b> ?`,
    confirmButtonText: `<span style="color:white">Supprimer</span>`,
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })
  
  if (!confirmed) return

  isDeleting.value = true
  try {
    await trainingService.deleteTrainingSession(session.value.id)
    showToast({ message: 'Session supprimée avec succès', type: 'success' })
    router.push({ name: 'training-sessions-index' })
  } catch (error) {
    showToast({ message: 'Erreur lors de la suppression de la session', type: 'error' })
  } finally {
    isDeleting.value = false
  }
}

const loadSession = async () => {
  try {
    isLoading.value = true
    const sessionId = route.params.id as string
    const response = await trainingService.getTrainingSession(sessionId)
    session.value = response.data
  } catch (err) {
    console.error('Erreur lors du chargement de la session:', err)
    error.value = 'Erreur lors du chargement de la session'
  } finally {
    isLoading.value = false
  }
}

const fetchTrainings = async () => {
  try {
    const response = await trainingService.listTrainings({ page: 1, page_size: 1000 })
    trainings.value = response.data.map(t => ({ id: t.id, title: t.title }))
  } catch (error) {
    console.error('Erreur lors du chargement des formations:', error)
  }
}

// Helper functions
const getTrainingName = (trainingId: string) => {
  const training = trainings.value.find(t => t.id === trainingId)
  return training?.title || 'Formation inconnue'
}

const getSessionStatusLabel = (status: string) => {
  const labels = {
    [TrainingSessionStatusEnum.OPEN_FOR_REGISTRATION]: 'Ouverte aux inscriptions',
    [TrainingSessionStatusEnum.CLOSE_FOR_REGISTRATION]: 'Fermée aux inscriptions',
    [TrainingSessionStatusEnum.ONGOING]: 'En cours',
    [TrainingSessionStatusEnum.COMPLETED]: 'Terminée'
  }
  return labels[status as TrainingSessionStatusEnum] || status
}

const formatDate = (date: string | undefined) => {
  if (!date) return 'Non définie'
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatCurrency = (amount: number | undefined) => {
  if (!amount) return 'Non défini'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

const clearError = () => {
  error.value = ''
}

// Lifecycle
onMounted(() => {
  loadSession()
  fetchTrainings()
})
</script>

<style scoped>
.training-session-detail-container {
  padding: 1.5rem;
}

.training-session-header-card {
  position: relative;
  overflow: hidden;
}

.training-session-header-overlay {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  color: white;
}

.training-session-header-content {
  position: relative;
  z-index: 2;
}

.animate-specialty {
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

@media (max-width: 768px) {
  .training-session-detail-container {
    padding: 1rem;
  }
}
</style>