<template>
  <VContainer fluid>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <VBtn variant="outlined" @click="goBack" prepend-icon="ri-arrow-left-line" class="mr-4">
          Retour
        </VBtn>
        <div class="d-inline-block">
          <h1 class="text-h4 font-weight-bold mb-2">Détails de la réclamation</h1>
          <p class="text-body-1 text-medium-emphasis">
            {{ currentReclamation?.reclamation_number }}
          </p>
        </div>
      </div>
      <div class="d-flex gap-2">
        <VBtn v-if="canUpdateStatus" color="primary" @click="goToEdit" prepend-icon="ri-edit-line">
          Modifier le statut
        </VBtn>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-8">
      <VProgressCircular indeterminate color="primary" size="64" />
      <p class="text-body-1 mt-4">Chargement de la réclamation...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-8">
      <VIcon size="64" color="error" class="mb-4">ri-error-warning-line</VIcon>
      <h3 class="text-h6 mb-2">Erreur de chargement</h3>
      <p class="text-body-2 text-medium-emphasis mb-4">{{ error }}</p>
      <VBtn color="primary" @click="loadReclamation">
        <VIcon class="mr-2">ri-refresh-line</VIcon>
        Réessayer
      </VBtn>
    </div>

    <!-- Content -->
    <div v-else-if="currentReclamation">
      <VRow>
        <!-- Informations principales -->
        <VCol cols="12" md="8">
          <VCard class="mb-6">
            <VCardTitle class="d-flex align-center">
              <VIcon class="mr-2">ri-file-text-line</VIcon>
              Informations générales
            </VCardTitle>
            <VCardText>
              <VRow>
                <VCol cols="12" md="6">
                  <div class="mb-4">
                    <div class="text-body-2 text-medium-emphasis mb-1">Numéro de réclamation</div>
                    <div class="text-h6 font-weight-bold">{{ currentReclamation.reclamation_number }}</div>
                  </div>
                </VCol>
                <VCol cols="12" md="6">
                  <div class="mb-4">
                    <div class="text-body-2 text-medium-emphasis mb-1">Numéro de candidature</div>
                    <div class="text-h6 font-weight-bold">{{ currentReclamation.application_number }}</div>
                  </div>
                </VCol>
                <VCol cols="12">
                  <div class="mb-4">
                    <div class="text-body-2 text-medium-emphasis mb-1">Sujet</div>
                    <div class="text-h6 font-weight-bold">{{ currentReclamation.subject }}</div>
                  </div>
                </VCol>
                <VCol cols="12">
                  <div class="mb-4">
                    <div class="text-body-2 text-medium-emphasis mb-1">Description</div>
                    <div class="text-body-1">{{ currentReclamation.description }}</div>
                  </div>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>

          <!-- Historique des modifications -->
          <VCard>
            <VCardTitle class="d-flex align-center">
              <VIcon class="mr-2">ri-history-line</VIcon>
              Historique
            </VCardTitle>
            <VCardText>
              <VTimeline density="compact">
                <VTimelineItem dot-color="primary" size="small">
                  <div class="d-flex align-center">
                    <VIcon class="mr-2" color="primary">ri-add-circle-line</VIcon>
                    <div>
                      <div class="text-body-2 font-weight-bold">Réclamation créée</div>
                      <div class="text-caption text-medium-emphasis">
                        {{ formatDate(currentReclamation.created_at) }}
                      </div>
                    </div>
                  </div>
                </VTimelineItem>

                <VTimelineItem v-if="currentReclamation.closure_date" dot-color="success" size="small">
                  <div class="d-flex align-center">
                    <VIcon class="mr-2" color="success">ri-check-circle-line</VIcon>
                    <div>
                      <div class="text-body-2 font-weight-bold">Réclamation fermée</div>
                      <div class="text-caption text-medium-emphasis">
                        {{ formatDate(currentReclamation.closure_date) }}
                      </div>
                    </div>
                  </div>
                </VTimelineItem>
              </VTimeline>
            </VCardText>
          </VCard>
        </VCol>

        <!-- Sidebar -->
        <VCol cols="12" md="4">
          <!-- Statut et priorité -->
          <VCard class="mb-6">
            <VCardTitle class="d-flex align-center">
              <VIcon class="mr-2">ri-information-line</VIcon>
              Statut et priorité
            </VCardTitle>
            <VCardText>
              <div class="mb-4">
                <div class="text-body-2 text-medium-emphasis mb-2">Statut</div>
                <VChip :color="statusConfig.color" variant="flat" size="large">
                  <VIcon :class="statusConfig.icon" class="mr-2" />
                  {{ statusConfig.text }}
                </VChip>
              </div>

              <div class="mb-4">
                <div class="text-body-2 text-medium-emphasis mb-2">Priorité</div>
                <VChip :color="priorityConfig.color" variant="flat" size="large">
                  <VIcon :class="priorityConfig.icon" class="mr-2" />
                  {{ priorityConfig.text }}
                </VChip>
              </div>
            </VCardText>
          </VCard>

          <!-- Dates -->
          <VCard class="mb-6">
            <VCardTitle class="d-flex align-center">
              <VIcon class="mr-2">ri-calendar-line</VIcon>
              Dates
            </VCardTitle>
            <VCardText>
              <div class="mb-3">
                <div class="text-body-2 text-medium-emphasis mb-1">Créée le</div>
                <div class="text-body-1 font-weight-medium">
                  {{ formatDate(currentReclamation.created_at) }}
                </div>
              </div>

              <div class="mb-3">
                <div class="text-body-2 text-medium-emphasis mb-1">Dernière modification</div>
                <div class="text-body-1 font-weight-medium">
                  {{ formatDate(currentReclamation.updated_at) }}
                </div>
              </div>

              <div v-if="currentReclamation.closure_date">
                <div class="text-body-2 text-medium-emphasis mb-1">Fermée le</div>
                <div class="text-body-1 font-weight-medium">
                  {{ formatDate(currentReclamation.closure_date) }}
                </div>
              </div>
            </VCardText>
          </VCard>

          <!-- Actions -->
          <VCard>
            <VCardTitle class="d-flex align-center">
              <VIcon class="mr-2">ri-settings-3-line</VIcon>
              Actions
            </VCardTitle>
            <VCardText>
              <VBtn block variant="outlined" @click="goBack" class="mb-2">
                <VIcon class="mr-2">ri-arrow-left-line</VIcon>
                Retour à la liste
              </VBtn>

              <VBtn v-if="canUpdateStatus" block color="primary" @click="goToEdit">
                <VIcon class="mr-2">ri-edit-line</VIcon>
                Modifier le statut
              </VBtn>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReclamation } from '@/composables/useReclamation'
import { ReclamationStatusEnum, ReclamationPriorityEnum } from '@/types/reclamation'

// Route & Router
const route = useRoute()
const router = useRouter()

// Composable
const {
  currentReclamation,
  isLoading,
  error,
  getReclamation,
  getStatusConfig,
  getPriorityConfig
} = useReclamation()

// Computed
const reclamationId = computed(() => Number(route.params.id))

const canUpdateStatus = computed(() => {
  // Seuls les admins peuvent modifier le statut
  // Cette logique sera implémentée selon les permissions
  return true
})

const statusConfig = computed(() => {
  if (!currentReclamation.value) return { text: '', color: '', icon: '', variant: 'flat' }
  return getStatusConfig(currentReclamation.value.status)
})

const priorityConfig = computed(() => {
  if (!currentReclamation.value) return { text: '', color: '', icon: '' }
  return getPriorityConfig(currentReclamation.value.priority)
})

// Methods
const loadReclamation = async () => {
  try {
    await getReclamation(reclamationId.value)
  } catch (error) {
    console.error('Erreur lors du chargement de la réclamation:', error)
  }
}

const goBack = () => {
  router.go(-1)
}

const goToEdit = () => {
  router.push({ name: 'reclamations-edit', params: { id: reclamationId.value } })
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
  loadReclamation()
})
</script>
