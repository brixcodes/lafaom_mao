<template>
  <VContainer class="training-detail-container">
    <!-- Header avec navigation -->
    <div class="d-flex justify-space-between align-center mb-4">
      <!-- Partie gauche : bouton retour + titres -->
      <div class="d-flex align-center">
        <VBtn icon variant="text" class="mr-3" @click="goBack">
          <VIcon icon="ri-arrow-left-line" color="primary" />
        </VBtn>
        <div>
          <h1 class="font-weight-bold mb-1">Détails de la formation</h1>
          <p class="text-body-2 text-secondary mb-0">
            Consultez les détails de la formation et inscrivez-vous directement.
          </p>
        </div>
      </div>

      <!-- Partie droite : boutons d'action -->
      <div>
        <VBtn color="primary" variant="outlined" @click="shareTraining" class="action-btn mx-1"
          prepend-icon="ri-share-line">
          Partager
        </VBtn>
        <VBtn color="primary" @click="applyToTraining" class="action-btn" prepend-icon="ri-user-add-line">
          S'inscrire
        </VBtn>
      </div>
    </div>

    <VFadeTransition>
      <VRow v-if="training">
        <VCol cols="12">
          <!-- En-tête avec design moderne -->
          <VSlideYTransition>
            <VCard class="mb-6 training-header-card overflow-hidden" elevation="3">
              <div class="training-header-overlay">
                <div class="training-header-content">
                  <div class="d-flex align-center mb-4 animate-specialty">
                    <VAvatar size="48" class="mr-3 border-white">
                      <VIcon color="white" size="24">ri-graduation-cap-line</VIcon>
                    </VAvatar>
                    <div>
                      <div class="text-white font-weight-medium">{{ getSpecialtyName(training.specialty_id) }}</div>
                      <div class="text-caption text-white">
                        ID: {{ training.id }}
                      </div>
                    </div>
                  </div>

                  <h1 class="text-h3 font-weight-bold text-white mb-4 animate-title">
                    {{ training.title }}
                  </h1>

                  <div class="d-flex flex-wrap gap-3 mb-4">
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-bookmark-line</VIcon>
                      <span>{{ getSpecialtyName(training.specialty_id) }}</span>
                    </div>
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-timer-line</VIcon>
                      <span>{{ training.duration }} {{ getDurationUnitLabel(training.duration_unit) }}</span>
                    </div>
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-calendar-line</VIcon>
                      <span>Créé le {{ formatDate(training.created_at) }}</span>
                    </div>
                  </div>

                  <VSlideXTransition group>
                    <VChip key="training-type" color="white" variant="elevated" size="small"
                      class="mr-2 mb-2 animate-tag">
                      {{ getTrainingTypeLabel(training.training_type) }}
                    </VChip>

                    <VChip :key="statusChip.key" :color="statusChip.color" variant="elevated" size="small"
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
              <!-- Présentation -->
              <VSlideYTransition>
                <VCard class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-file-list-3-line</VIcon>
                    <span class="text-h6">Informations détaillées de la formation</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="py-4 training-content">
                    <v-timeline align="start" density="compact" class="pa-3">
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Présentation</strong> :</div>
                        <div style="margin-left: 10px; line-height: 1.8;" v-html="training.presentation"></div>
                      </v-timeline-item>
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Compétences cibles</strong> :</div>
                        <div style="margin-left: 22px; line-height: 1.8;" v-html="training.target_skills"></div>
                      </v-timeline-item>
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Programme détaillé</strong> :</div>
                        <div style="margin-left: 22px; line-height: 1.8;" v-html="training.program"></div>
                      </v-timeline-item>
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Public cible</strong> :</div>
                        <div style="margin-left: 10px; line-height: 1.8;" v-html="training.target_audience"></div>
                      </v-timeline-item>
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Prérequis</strong> :</div>
                        <div style="margin-left: 22px; line-height: 1.8;" v-html="training.prerequisites"></div>
                      </v-timeline-item>
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Modalités d'inscription</strong> :</div>
                        <div style="margin-left: 22px; line-height: 1.8;" v-html="training.enrollment"></div>
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
                    <span class="text-h6">Informations de la formation</span>
                  </VCardTitle>
                  <VDivider />
                  <VList lines="two" density="comfortable">
                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-bookmark-line</VIcon>
                      </template>
                      <VListItemTitle>Spécialité</VListItemTitle>
                      <VListItemSubtitle>{{ getSpecialtyName(training.specialty_id) }}</VListItemSubtitle>
                    </VListItem>

                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-article-line</VIcon>
                      </template>
                      <VListItemTitle>Type de formation</VListItemTitle>
                      <VListItemSubtitle>{{ getTrainingTypeLabel(training.training_type) }}</VListItemSubtitle>
                    </VListItem>

                    <VListItem>
                      <VRow>
                        <!-- Colonne Durée -->
                        <VCol cols="12" md="6" class="d-flex align-start">
                          <VIcon color="primary" class="mr-2">ri-timer-line</VIcon>
                          <div>
                            <VListItemTitle>Durée</VListItemTitle>
                            <VListItemSubtitle class="font-weight-medium">
                              {{ training.duration }} {{ getDurationUnitLabel(training.duration_unit) }}
                            </VListItemSubtitle>
                          </div>
                        </VCol>

                        <!-- Colonne Statut -->
                        <VCol cols="12" md="6" class="d-flex align-start">
                          <VIcon color="primary" class="mr-2">ri-toggle-line</VIcon>
                          <div>
                            <VListItemTitle>Statut</VListItemTitle>
                            <VListItemSubtitle>
                              {{ getTrainingStatusLabel(training) }}
                            </VListItemSubtitle>
                          </div>
                        </VCol>
                      </VRow>
                    </VListItem>


                    <VListItem>
                      <VRow>
                        <!-- Colonne Statut -->
                        <VCol cols="12" md="6" class="d-flex align-start">
                          <VIcon color="primary" class="mr-2">ri-toggle-line</VIcon>
                          <div>
                            <VListItemTitle>Statut</VListItemTitle>
                            <VListItemSubtitle>
                              {{ getTrainingStatusLabel(training) }}
                            </VListItemSubtitle>
                          </div>
                        </VCol>

                        <!-- Colonne Créée le -->
                        <VCol cols="12" md="6" class="d-flex align-start">
                          <VIcon color="primary" class="mr-2">ri-calendar-line</VIcon>
                          <div>
                            <VListItemTitle>Créée le</VListItemTitle>
                            <VListItemSubtitle>
                              {{ formatDate(training.created_at) }}
                            </VListItemSubtitle>
                          </div>
                        </VCol>
                      </VRow>
                    </VListItem>

                  </VList>

                  <!-- Actions rapides -->
                  <VDivider />
                  <VCardText class="pa-4">
                    <div class="d-flex gap-3 flex-wrap">
                      <VBtn prepend-icon="ri-edit-line" color="primary" variant="outlined"
                        :to="{ name: 'training-trainings-edit', params: { id: training.id } }">
                        Modifier
                      </VBtn>

                      <VBtn prepend-icon="ri-user-line" variant="outlined"
                        :to="{ name: 'training-applications-index', query: { training_id: training.id } }">
                        candidatures
                      </VBtn>

                      <VBtn prepend-icon="ri-add-line" color="success" variant="outlined"
                        :to="{ name: 'training-sessions-create', query: { training_id: training.id } }">
                        session
                      </VBtn>

                      <VBtn prepend-icon="ri-delete-bin-line" color="error" variant="outlined" @click="confirmDelete">
                        Supprimer
                      </VBtn>
                    </div>
                  </VCardText>

                </VCard>
              </VSlideXReverseTransition>

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
                        <span class="text-body-1">Sessions créées</span>
                        <VChip color="primary" size="small">{{ sessionsCount }}</VChip>
                      </div>
                      <div class="d-flex align-center justify-space-between">
                        <span class="text-body-1">Candidatures reçues</span>
                        <VChip color="success" size="small">{{ applicationsCount }}</VChip>
                      </div>
                      <div class="d-flex align-center justify-space-between">
                        <span class="text-body-1">Candidatures approuvées</span>
                        <VChip color="info" size="small">{{ approvedApplicationsCount }}</VChip>
                      </div>
                    </div>
                  </VCardText>
                </VCard>
              </VSlideXReverseTransition>

              <!-- Informations système -->
              <VSlideXReverseTransition>
                <VCard class="animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-information-line</VIcon>
                    <span class="text-h6">Informations système</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="pa-4">
                    <div class="d-flex flex-column gap-3">
                      <div>
                        <span class="text-caption text-medium-emphasis">ID de la formation</span>
                        <p class="text-body-2 font-weight-medium">{{ training.id }}</p>
                      </div>
                      <div>
                        <span class="text-caption text-medium-emphasis">Créé le</span>
                        <p class="text-body-2">{{ formatDate(training.created_at) }}</p>
                      </div>
                      <div>
                        <span class="text-caption text-medium-emphasis">Modifié le</span>
                        <p class="text-body-2">{{ formatDate(training.updated_at) }}</p>
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

    <!-- États de chargement et d'erreur -->
    <VFadeTransition>
      <VRow v-if="isLoading && !training">
        <VCol cols="12" class="text-center py-8">
          <VProgressCircular indeterminate color="primary" size="64" width="6" />
          <div class="mt-4 text-body-1 animate-fade-in">Chargement de la formation...</div>
        </VCol>
      </VRow>
    </VFadeTransition>

    <VFadeTransition>
      <VRow v-if="!isLoading && !training && error">
        <VCol cols="12" class="text-center py-8">
          <VIcon size="x-large" color="error" class="mb-4 animate-bounce">ri-alert-circle-line</VIcon>
          <div class="text-h5 mb-3 animate-fade-in">Erreur de chargement</div>
          <div class="text-body-1 mb-6 animate-fade-in">{{ error }}</div>
          <VBtn color="primary" size="large" @click="loadTraining" prepend-icon="ri-refresh-line"
            class="animate-fade-in">
            Réessayer
          </VBtn>
        </VCol>
      </VRow>
    </VFadeTransition>

    <VFadeTransition>
      <VRow v-if="!isLoading && !training && !error">
        <VCol cols="12" class="text-center py-8">
          <VIcon size="x-large" color="primary" class="mb-4 animate-bounce">ri-search-line</VIcon>
          <div class="text-h5 mb-3 animate-fade-in">Formation introuvable</div>
          <div class="text-body-1 mb-6 animate-fade-in">La formation que vous recherchez n'existe pas ou a été
            supprimée.
          </div>
          <VBtn color="primary" size="large" @click="goBack" prepend-icon="ri-arrow-left-line" class="animate-fade-in">
            Retour aux formations
          </VBtn>
        </VCol>
      </VRow>
    </VFadeTransition>

  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { trainingService } from '@/services/api/training'
import type { Training } from '@/types/training'
import { TrainingTypeEnum, TrainingStatus as TrainingStatusEnum, DurationEnum } from '@/types/training'
import { usePermissions } from '@/composables/usePermissions'
import { TrainingPermission } from '@/types/permissions'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'

const router = useRouter()
const route = useRoute()
const { hasPermission } = usePermissions()

// Data
const training = ref<Training | null>(null)
const specialties = ref<{ id: number; name: string }[]>([])
const isLoading = ref(true)
const error = ref('')
const isDeleting = ref(false)

// Statistiques (simulées pour l'instant)
const sessionsCount = ref(0)
const applicationsCount = ref(0)
const approvedApplicationsCount = ref(0)

// Computed
const hasUpdatePermission = computed(() => hasPermission(TrainingPermission.EDIT_TRAINING))
const hasDeletePermission = computed(() => hasPermission(TrainingPermission.DELETE_TRAINING))

const statusChip = computed(() => {
  if (!training.value) return { key: 'unknown', text: 'Inconnu', color: 'grey' }
  return training.value.status === TrainingStatusEnum.ACTIVE
    ? { key: 'active', text: 'Actif', color: 'success' }
    : { key: 'inactive', text: 'Inactif', color: 'error' }
})

// Methods
const loadTraining = async () => {
  const trainingId = route.params.id as string
  if (!trainingId) {
    error.value = 'ID de formation manquant'
    isLoading.value = false
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const response = await trainingService.getTraining(trainingId)
    training.value = response.data

    // Charger les spécialités pour l'affichage
    await fetchSpecialties()
  } catch (err) {
    error.value = 'Erreur lors du chargement de la formation'
    console.error('Erreur:', err)
  } finally {
    isLoading.value = false
  }
}

const fetchSpecialties = async () => {
  try {
    const response = await trainingService.listSpecialties({})
    specialties.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement des spécialités:', error)
  }
}

const goBack = () => {
  router.back()
}

const shareTraining = () => {
  if (navigator.share) {
    navigator.share({
      title: training.value?.title,
      text: `Découvrez cette formation : ${training.value?.title}`,
      url: window.location.href
    })
  } else {
    // Fallback - copy to clipboard
    navigator.clipboard.writeText(window.location.href)
    showToast({ message: 'Lien copié dans le presse-papiers', type: 'success' })
  }
}

const applyToTraining = () => {
  if (training.value?.id) {
    router.push({ name: 'training-applications-create', query: { training_id: training.value.id } })
  }
}

const confirmDelete = async () => {
  if (!training.value) return

  const confirmed = await confirmAction({
    title: 'Êtes-vous sûr ?',
    html: `Souhaitez-vous réellement supprimer la formation <b>${training.value.title}</b> ?`,
    confirmButtonText: `<span style="color:white">Supprimer</span>`,
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })
  
  if (!confirmed) return

  isDeleting.value = true
  try {
    await trainingService.deleteTraining(training.value.id.toString())
    showToast({ message: 'Formation supprimée avec succès', type: 'success' })
    router.push({ name: 'training-trainings-index' })
  } catch (error) {
    showToast({ message: 'Erreur lors de la suppression de la formation', type: 'error' })
  } finally {
    isDeleting.value = false
  }
}

// Helper functions
const getSpecialtyName = (specialtyId: number) => {
  const specialty = specialties.value.find(s => s.id === specialtyId)
  return specialty?.name || 'Spécialité inconnue'
}

const getTrainingTypeLabel = (type: string) => {
  return type === TrainingTypeEnum.ON_SITE ? 'En présentiel' : 'À distance'
}

const getDurationUnitLabel = (unit: string) => {
  const labels = {
    [DurationEnum.HOURS]: 'h',
    [DurationEnum.DAYS]: 'j',
    [DurationEnum.MONTHS]: 'mois',
    [DurationEnum.YEARS]: 'ans'
  }
  return labels[unit as DurationEnum] || unit
}

const getTrainingStatusLabel = (training: Training) => {
  return training.status === TrainingStatusEnum.ACTIVE ? 'Actif' : 'Inactif'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

// Lifecycle
onMounted(() => {
  loadTraining()
})
</script>

<style scoped>
.training-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 3rem;
}

.training-header-card {
  position: relative;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.training-header-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
}

.training-header-overlay {
  position: relative;
  min-height: 350px;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  transition: background-color 0.3s ease;
}

.training-header-overlay:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.training-header-overlay::before {
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

.training-header-content {
  position: relative;
  width: 100%;
  padding: 2rem;
  z-index: 1;
}

.border-white {
  border: 2px solid rgba(255, 255, 255, 0.7);
}

.training-content {
  line-height: 1.7;
}

.training-content h1,
.training-content h2,
.training-content h3 {
  color: rgb(var(--v-theme-primary));
  margin: 1.5rem 0 1rem 0;
}

.training-content ul,
.training-content ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.training-content li {
  margin: 0.5rem 0;
}

.training-content p {
  margin: 1rem 0;
}

.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Animations */
.animate-title {
  animation: fadeInUp 0.8s ease-out;
}

.animate-specialty {
  animation: fadeInUp 0.8s ease-out 0.2s;
  animation-fill-mode: both;
}

.animate-tag {
  transition: all 0.3s ease;
}

.animate-tag:hover {
  transform: translateY(-3px);
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
}

.animate-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.animate-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-bounce {
  animation: bounce 1s ease infinite;
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
@media (max-width: 960px) {
  .training-header-card {
    min-height: 300px;
  }

  .training-header-overlay {
    min-height: 300px;
    padding: 1.5rem;
  }

  .training-header-content {
    padding: 1.5rem;
  }

  .animate-title {
    font-size: 1.75rem !important;
  }
}

@media (max-width: 600px) {
  .training-header-overlay {
    min-height: 250px;
  }

  .training-header-content {
    padding: 1rem;
  }

  .animate-title {
    font-size: 1.5rem !important;
    margin-bottom: 1rem !important;
  }

  .animate-tag {
    margin-bottom: 0.5rem;
  }

  .action-btn {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .training-header-overlay {
    min-height: 220px;
  }

  .animate-title {
    font-size: 1.25rem !important;
    margin-bottom: 0.5rem !important;
  }

  .animate-specialty {
    flex-direction: column;
    align-items: flex-start;
  }

  .animate-specialty .v-avatar {
    margin-bottom: 0.5rem;
  }
}
</style>