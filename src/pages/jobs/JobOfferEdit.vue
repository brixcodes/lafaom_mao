<template>
  <div class="job-offer-edit pa-6">
    <!-- En-tête -->
    <div class="d-flex align-center mb-6">
      <VBtn icon="ri-arrow-left-line" variant="text" @click="goBack" class="me-4" />

      <div class="flex-grow-1">
        <h1 class="text-h4 mb-2">
          <VIcon icon="ri-edit-line" class="me-3" color="primary" />
          Modifier l'offre d'emploi
        </h1>
        <p v-if="jobOffer" class="text-body-1 text-medium-emphasis">
          {{ jobOffer.title }} - {{ jobOffer.reference }}
        </p>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="text-center py-12">
      <VProgressCircular indeterminate size="60" width="6" color="primary" class="mb-4" />
      <p class="text-body-1 text-medium-emphasis">Chargement de l'offre d'emploi...</p>
    </div>

    <!-- Offre introuvable -->
    <div v-else-if="error" class="text-center py-12">
      <VIcon icon="ri-error-warning-line" size="80" class="text-error mb-6" />
      <h3 class="text-h5 mb-4">Offre d'emploi introuvable</h3>
      <p class="text-body-1 text-medium-emphasis mb-6">
        L'offre d'emploi demandée n'existe pas ou a été supprimée.
      </p>
      <VBtn variant="outlined" prepend-icon="ri-arrow-left-line" @click="goBack">
        Retour à la liste
      </VBtn>
    </div>

    <!-- Formulaire d'édition -->
    <div v-else-if="jobOffer">
      <JobForm :job-offer="jobOffer" :mode="'edit'" :loading="submitting" @submit="handleSubmit"
        @cancel="handleCancel" />

      <!-- Actions supplémentaires
      <VCard elevation="2" class="mt-6">
        <VCardTitle>Actions avancées</VCardTitle>
        <VCardText>
          <div class="d-flex flex-wrap gap-3">
            <VBtn
              variant="outlined"
              prepend-icon="ri-eye-line"
              @click="previewOffer"
            >
              Aperçu
            </VBtn>

            <VBtn
              variant="outlined"
              prepend-icon="ri-file-copy-line"
              @click="duplicateOffer"
            >
              Dupliquer
            </VBtn>

            <VBtn
              variant="outlined"
              prepend-icon="ri-history-line"
              @click="showHistory = true"
            >
              Historique
            </VBtn>

            <VSpacer />

            <VBtn
              variant="outlined"
              color="error"
              prepend-icon="ri-delete-bin-line"
              @click="confirmDelete"
              :disabled="jobOffer.status === 'ACTIVE'"
            >
              Supprimer
            </VBtn>
          </div>
        </VCardText>
      </VCard> -->
    </div>

    <!-- Dialog d'historique -->
    <VDialog v-model="showHistory" max-width="800" scrollable>
      <VCard>
        <VCardTitle>Historique des modifications</VCardTitle>
        <VCardText>
          <VTimeline v-if="history.length > 0">
            <VTimelineItem v-for="(event, index) in history" :key="index" :dot-color="getEventColor(event.type)"
              size="small">
              <template #icon>
                <VIcon :icon="getEventIcon(event.type)" size="small" />
              </template>

              <VCard variant="tonal">
                <VCardText class="py-3">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <h6 class="text-subtitle-2">{{ event.title }}</h6>
                    <span class="text-caption text-medium-emphasis">
                      {{ formatDateTime(event.created_at) }}
                    </span>
                  </div>
                  <p v-if="event.description" class="text-body-2 mb-0">
                    {{ event.description }}
                  </p>
                  <div v-if="event.user" class="text-caption text-medium-emphasis mt-1">
                    Par {{ event.user }}
                  </div>
                </VCardText>
              </VCard>
            </VTimelineItem>
          </VTimeline>

          <div v-else class="text-center py-8">
            <VIcon icon="ri-history-line" size="64" class="text-medium-emphasis mb-4" />
            <p class="text-body-2 text-medium-emphasis">Aucun historique disponible</p>
          </div>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="showHistory = false">Fermer</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Dialog de confirmation de suppression -->
    <VDialog v-model="deleteDialog" max-width="500">
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon icon="ri-error-warning-line" class="me-2" color="error" />
          Confirmer la suppression
        </VCardTitle>
        <VCardText>
          <p class="text-body-1 mb-4">
            Êtes-vous sûr de vouloir supprimer cette offre d'emploi ?
          </p>

          <VAlert type="warning" variant="tonal" class="mb-4">
            <div class="text-body-2">
              <strong>Cette action est irréversible.</strong><br>
              Toutes les candidatures associées seront également supprimées.
            </div>
          </VAlert>

          <div v-if="applicationCount > 0" class="mb-4">
            <VAlert type="error" variant="tonal">
              <div class="text-body-2">
                <strong>Attention :</strong> Cette offre a {{ applicationCount }} candidature(s).
                Toutes les candidatures seront perdues définitivement.
              </div>
            </VAlert>
          </div>
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn variant="text" @click="deleteDialog = false">Annuler</VBtn>
          <VBtn variant="flat" color="error" :loading="deleting" @click="deleteOffer">
            Supprimer définitivement
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Dialog de confirmation d'annulation -->
    <VDialog v-model="cancelDialog" max-width="500">
      <VCard>
        <VCardTitle>Annuler les modifications ?</VCardTitle>
        <VCardText>
          <p class="text-body-1">
            Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter sans sauvegarder ?
          </p>
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn variant="text" @click="cancelDialog = false">Continuer l'édition</VBtn>
          <VBtn variant="flat" color="warning" @click="confirmCancel">
            Quitter sans sauvegarder
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { useJobOffersStore } from '@/stores/jobOffers'
import type { JobOffer, JobOfferUpdateInput } from '@/types/jobOffers'
import JobForm from '@/components/jobs/JobForm.vue'

// Composables
const route = useRoute()
const router = useRouter()
const jobOffersStore = useJobOffersStore()

// State
const loading = ref(true)
const error = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const showHistory = ref(false)
const deleteDialog = ref(false)
const cancelDialog = ref(false)
const hasUnsavedChanges = ref(false)
const jobOffer = ref<JobOffer | null>(null)

// Computed
const offerId = computed(() => route.params.id as string)

const applicationCount = computed(() => {
  // Ici vous devriez compter les candidatures réelles
  return 0 // Temporaire
})

const history = computed(() => [
  {
    type: 'created',
    title: 'Offre créée',
    description: 'L\'offre d\'emploi a été créée',
    created_at: jobOffer.value?.created_at,
    user: 'Admin'
  },
  {
    type: 'updated',
    title: 'Offre modifiée',
    description: 'Mise à jour des informations de l\'offre',
    created_at: jobOffer.value?.updated_at,
    user: 'Admin'
  }
])

// Methods
const loadJobOffer = async () => {
  try {
    loading.value = true
    error.value = false

    await jobOffersStore.getJobOfferById(offerId.value)

    if (jobOffersStore.currentJobOffer) {
      jobOffer.value = { ...jobOffersStore.currentJobOffer }
    } else {
      error.value = true
    }
  } catch (err) {
    console.error('Erreur lors du chargement de l\'offre:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

const handleSubmit = async (formData: JobOfferUpdateInput) => {
  if (!jobOffer.value) return

  try {
    submitting.value = true

    // Extraire l'ID et les données séparément
    const { id, ...updateData } = formData

    await jobOffersStore.updateJobOffer(jobOffer.value.id, updateData)

    hasUnsavedChanges.value = false

    // Rediriger vers la liste ou les détails
    router.push({
      name: 'job-offers-detail',
      params: { id: jobOffer.value.id }
    })

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'offre:', error)
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  if (hasUnsavedChanges.value) {
    cancelDialog.value = true
  } else {
    goBack()
  }
}

const confirmCancel = () => {
  hasUnsavedChanges.value = false
  cancelDialog.value = false
  goBack()
}

const goBack = () => {
  if (jobOffer.value) {
    router.push({
      name: 'job-offers-detail',
      params: { id: jobOffer.value.id }
    })
  } else {
    router.push({ name: 'job-offers-list' })
  }
}

const previewOffer = () => {
  if (!jobOffer.value) return

  const routeData = router.resolve({
    name: 'job-offers-detail',
    params: { id: jobOffer.value.id }
  })
  window.open(routeData.href, '_blank')
}

const duplicateOffer = () => {
  if (!jobOffer.value) return

  // Créer une copie de l'offre sans l'ID
  const duplicateData = {
    ...jobOffer.value,
    title: `${jobOffer.value.title} (Copie)`,
    reference: `${jobOffer.value.reference}-COPY`,
    status: 'DRAFT' as const
  }

  router.push({
    name: 'job-offers-create',
    query: {
      duplicate: 'true',
      data: btoa(JSON.stringify(duplicateData))
    }
  })
}

const confirmDelete = () => {
  deleteDialog.value = true
}

const deleteOffer = async () => {
  if (!jobOffer.value) return

  try {
    deleting.value = true
    await jobOffersStore.deleteJobOffer(jobOffer.value.id)
    deleteDialog.value = false
    router.push({ name: 'job-offers-list' })
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'offre:', error)
  } finally {
    deleting.value = false
  }
}

const getEventColor = (eventType: string) => {
  const colors: Record<string, string> = {
    created: 'primary',
    updated: 'info',
    published: 'success',
    closed: 'warning',
    deleted: 'error'
  }
  return colors[eventType] || 'surface'
}

const getEventIcon = (eventType: string) => {
  const icons: Record<string, string> = {
    created: 'ri-add-circle-line',
    updated: 'ri-edit-line',
    published: 'ri-check-circle-line',
    closed: 'ri-pause-circle-line',
    deleted: 'ri-delete-bin-line'
  }
  return icons[eventType] || 'ri-circle-line'
}

const formatDateTime = (dateString?: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  loadJobOffer()
})

// Détecter les changements non sauvegardés
watch(
  () => jobOffer.value,
  () => {
    hasUnsavedChanges.value = true
  },
  { deep: true }
)

// Prévenir la fermeture accidentelle avec des changements non sauvegardés
onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    const answer = window.confirm(
      'Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter cette page ?'
    )
    if (answer) {
      next()
    } else {
      next(false)
    }
  } else {
    next()
  }
})
</script>

<style scoped>
.job-offer-edit {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
}
</style>
