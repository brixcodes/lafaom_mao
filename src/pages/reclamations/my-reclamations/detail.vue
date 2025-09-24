<template>
  <VContainer class="reclamation-detail-container">
    <!-- Header avec navigation -->
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="d-flex align-center">
        <VBtn icon variant="text" class="mr-3" @click="goBack">
          <VIcon icon="ri-arrow-left-line" color="primary" />
        </VBtn>
        <div>
          <h1 class="font-weight-bold mb-1">Détails de ma réclamation</h1>
          <p class="text-body-2 text-secondary mb-0">
            Suivez le traitement de votre réclamation.
          </p>
        </div>
      </div>
      <div>
        <VBtn color="primary" variant="flat" @click="editReclamation">
          Modifier
        </VBtn>
      </div>
    </div>

    <VFadeTransition>
      <VRow v-if="currentReclamation">
        <VCol cols="12">
          <!-- En-tête avec design moderne -->
          <VSlideYTransition>
            <VCard class="mb-6 reclamation-header-card overflow-hidden" elevation="3">
              <div class="reclamation-header-overlay">
                <div class="reclamation-header-content">
                  <div class="d-flex align-center mb-4 animate-specialty">
                    <VAvatar size="48" class="mr-3 border-white">
                      <VIcon color="white" size="24">ri-file-text-line</VIcon>
                    </VAvatar>
                    <div>
                      <div class="text-white font-weight-medium">{{ reclamationTypeName || 'Réclamation' }}</div>
                      <div class="text-caption text-white">
                        ID: {{ currentReclamation.id }}
                      </div>
                    </div>
                  </div>

                  <h1 class="text-h3 font-weight-bold text-white mb-4 animate-title">
                    {{ currentReclamation.subject }}
                  </h1>

                  <div class="d-flex flex-wrap gap-3 mb-4">
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-file-list-3-line</VIcon>
                      <span>{{ currentReclamation.application_number }}</span>
                    </div>
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-calendar-line</VIcon>
                      <span>{{ formatDate(currentReclamation.created_at) }}</span>
                    </div>
                  </div>

                  <VSlideXTransition group>
                    <VChip key="reclamation-status" :color="statusConfig.color" variant="elevated" size="small"
                      class="mr-2 mb-2 animate-tag">
                      <VIcon :class="statusConfig.icon" class="mr-1" size="small" />
                      {{ statusConfig.text }}
                    </VChip>
                    <VChip key="reclamation-priority" :color="priorityConfig.color" variant="elevated" size="small"
                      class="mr-2 mb-2 animate-tag">
                      <VIcon :class="priorityConfig.icon" class="mr-1" size="small" />
                      {{ priorityConfig.text }}
                    </VChip>
                  </VSlideXTransition>
                </div>
              </div>
            </VCard>
          </VSlideYTransition>

          <!-- Contenu principal -->
          <VRow>
            <VCol cols="12" md="8">
              <!-- Informations de la réclamation -->
              <VSlideYTransition>
                <VCard v-if="currentReclamation" class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-information-line</VIcon>
                    <span class="text-h6">Détails de la réclamation</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="py-4">
                    <v-timeline align="start" density="compact" class="pa-3">
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Description</strong> :</div>
                        <div style="margin-left: 10px; line-height: 1.8;">{{ currentReclamation.description }}</div>
                      </v-timeline-item>
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Type de réclamation</strong> :</div>
                        <div style="margin-left: 10px; line-height: 1.8;">{{ reclamationTypeName || 'Non spécifié' }}</div>
                      </v-timeline-item>
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Numéro de candidature</strong> :</div>
                        <div style="margin-left: 10px; line-height: 1.8;">{{ currentReclamation.application_number }}</div>
                      </v-timeline-item>
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Numéro de réclamation</strong> :</div>
                        <div style="margin-left: 10px; line-height: 1.8;">{{ currentReclamation.reclamation_number }}</div>
                      </v-timeline-item>
                    </v-timeline>
                  </VCardText>
                </VCard>
              </VSlideYTransition>
            </VCol>

            <!-- Sidebar avec informations et actions -->
            <VCol cols="12" md="4">
              <!-- Statut et priorité -->
              <VSlideXReverseTransition>
                <VCard class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-flag-line</VIcon>
                    <span class="text-h6">Statut et priorité</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="pa-4">
                    <div class="d-flex flex-column gap-4">
                      <div class="d-flex align-center justify-space-between">
                        <span class="text-body-1">Statut</span>
                        <VChip :color="statusConfig.color" size="small">
                          <VIcon :class="statusConfig.icon" class="mr-1" size="small" />
                          {{ statusConfig.text }}
                        </VChip>
                      </div>
                      <div class="d-flex align-center justify-space-between">
                        <span class="text-body-1">Priorité</span>
                        <VChip :color="priorityConfig.color" size="small">
                          <VIcon :class="priorityConfig.icon" class="mr-1" size="small" />
                          {{ priorityConfig.text }}
                        </VChip>
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
    <div v-if="isLoading && !currentReclamation" class="text-center pa-8">
      <VProgressCircular indeterminate color="primary" size="64" class="mb-4" />
      <p class="text-body-1">Chargement de la réclamation...</p>
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

    <!-- Réclamation non trouvée -->
    <div v-else-if="!currentReclamation && !isLoading" class="text-center py-8">
      <VIcon size="64" color="medium-emphasis" class="mb-4">ri-file-text-line</VIcon>
      <h3 class="text-h6 mb-2">Réclamation non trouvée</h3>
      <p class="text-body-2 text-medium-emphasis mb-4">
        Cette réclamation n'existe pas ou vous n'avez pas l'autorisation de la consulter.
      </p>
      <VBtn color="primary" @click="goBack">
        <VIcon class="mr-2">ri-arrow-left-line</VIcon>
        Retour à mes réclamations
      </VBtn>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useReclamation } from '@/composables/useReclamation'
import { showToast } from '@/components/toast/toastManager'
import type { ReclamationStatusEnum, ReclamationPriorityEnum } from '@/types/reclamation'

// Router
const router = useRouter()
const route = useRoute()

// Composable
const {
  currentReclamation,
  reclamationTypes,
  isLoading,
  error,
  getReclamation,
  loadReclamationTypes
} = useReclamation()

// State
const reclamationId = ref<number>(parseInt(route.params.id as string))

// Computed
const statusConfig = computed(() => {
  if (!currentReclamation.value) return { text: '', color: '', icon: '' }
  
  const status = currentReclamation.value.status as ReclamationStatusEnum
  const configs = {
    NEW: { text: 'Nouvelle', color: 'info', icon: 'ri-add-circle-line' },
    IN_PROGRESS: { text: 'En cours', color: 'warning', icon: 'ri-time-line' },
    CLOSED: { text: 'Fermée', color: 'success', icon: 'ri-check-circle-line' }
  }
  
  return configs[status] || { text: status, color: 'default', icon: 'ri-question-line' }
})

const priorityConfig = computed(() => {
  if (!currentReclamation.value) return { text: '', color: '', icon: '' }
  
  const priority = currentReclamation.value.priority as ReclamationPriorityEnum
  const configs = {
    LOW: { text: 'Faible', color: 'success', icon: 'ri-arrow-down-line' },
    MEDIUM: { text: 'Moyenne', color: 'info', icon: 'ri-arrow-right-line' },
    HIGH: { text: 'Élevée', color: 'warning', icon: 'ri-arrow-up-line' },
  }
  
  return configs[priority] || { text: priority, color: 'default', icon: 'ri-question-line' }
})

const reclamationTypeName = computed(() => {
  if (!currentReclamation.value?.reclamation_type || !reclamationTypes.value.length) return null
  const type = reclamationTypes.value.find((t: any) => t.id === currentReclamation.value?.reclamation_type)
  return type?.name || null
})

// Methods
const loadReclamation = async () => {
  try {
    await getReclamation(reclamationId.value)
  } catch (error) {
    console.error('Erreur lors du chargement de la réclamation:', error)
    showToast({
      message: 'Erreur lors du chargement de la réclamation',
      type: 'error'
    })
  }
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

const goBack = () => {
  router.push({ name: 'my-reclamations-index' })
}

const editReclamation = () => {
  router.push({ name: 'my-reclamations-edit', params: { id: currentReclamation.value?.id } })
}

const clearError = () => {
  error.value = ''
}

// Lifecycle
onMounted(async () => {
  await loadReclamationTypes()
  await loadReclamation()
})
</script>

<style scoped>
.reclamation-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 3rem;
}

.reclamation-header-card {
  position: relative;
  overflow: hidden;
}

.reclamation-header-overlay {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  padding: 2rem;
  color: white;
}

.reclamation-header-overlay:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.reclamation-header-overlay::before {
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

.reclamation-header-content {
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
  .reclamation-detail-container {
    padding: 1rem;
  }
}
</style>
