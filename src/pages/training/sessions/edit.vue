<template>
  <div class="training-session-edit-page">
    <!-- En-tête -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="d-flex align-center">
        <VBtn icon variant="text" class="mr-3" @click="handleBack">
          <VIcon icon="ri-arrow-left-line" color="primary" />
        </VBtn>
      <div>
          <h1 class="text-h4 mb-2">
            <VIcon icon="ri-edit-line" class="me-3" color="primary" />
          Modifier la session de formation
        </h1>
          <p class="text-body-1 text-medium-emphasis">
            Modifiez les informations de la session de formation
        </p>
        </div>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoadingSession" class="text-center py-12">
      <VProgressCircular indeterminate size="60" width="6" color="primary" class="mb-4" />
      <p class="text-body-1 text-medium-emphasis">Chargement de la session...</p>
    </div>

    <!-- Formulaire de modification -->
    <VCard v-else-if="session" class="mx-auto">
          <VCardText>
        <VForm ref="formRef" @submit.prevent="handleSubmit">
            <VRow>
              <!-- Formation -->
              <VCol cols="12" md="6">
              <VAutocomplete v-model="session.training_id" :items="trainingOptions" item-title="title" item-value="id"
                label="Formation" placeholder="Sélectionnez une formation..." variant="outlined" density="comfortable"
                prepend-inner-icon="ri-graduation-cap-line"
                :rules="[(v: string) => !!v || 'La formation est obligatoire']" required :loading="isLoadingTrainings"
                :search="trainingSearch" @update:search="onTrainingSearch" no-data-text="Aucune formation trouvée" />
              </VCol>

              <!-- Centre de formation -->
              <VCol cols="12" md="6">
              <!-- Alerte pour formation en ligne -->
              <VAlert v-if="isOnlineTraining" type="info" variant="tonal" class="mb-4">
                <template #prepend>
                  <VIcon icon="ri-computer-line" />
                </template>
                <div>
                  <strong>Formation en ligne détectée</strong>
                  <p class="mb-0">Cette formation se déroule en ligne, aucun centre de formation n'est requis.</p>
                </div>
              </VAlert>

              <VAutocomplete v-model="session.center_id" :items="centerOptions" item-title="name" item-value="id"
                :label="isOnlineTraining ? 'Centre de formation (non applicable pour les formations en ligne)' : 'Centre de formation (optionnel)'"
                placeholder="Rechercher un centre..." variant="outlined" density="comfortable" clearable
                :loading="isLoadingCenters" :search="centerSearch" @update:search="onCenterSearch"
                no-data-text="Aucun centre trouvé" prepend-inner-icon="ri-building-line" :disabled="isOnlineTraining"
                :hint="isOnlineTraining ? 'Cette formation se déroule en ligne, aucun centre n\'est requis' : ''"
                persistent-hint />
              </VCol>

              <!-- Date de début -->
              <VCol cols="12" md="6">
              <AppDateTimePicker v-model="session.start_date" label="Date de début"
                placeholder="Sélectionnez la date de début" prepend-inner-icon="ri-calendar-line" :rules="[
                  (v: string) => !!v || 'La date de début est obligatoire',
                  (v: string) => !v || v >= today || 'La date de début ne peut pas être dans le passé'
                ]" required :min="today" />
              </VCol>

              <!-- Date de fin -->
              <VCol cols="12" md="6">
              <AppDateTimePicker v-model="session.end_date" label="Date de fin"
                placeholder="Sélectionnez la date de fin" prepend-inner-icon="ri-calendar-line" :rules="[
                  (v: string) => !!v || 'La date de fin est obligatoire',
                  (v: string) => !v || !session?.start_date || v >= session.start_date || 'La date de fin doit être postérieure à la date de début'
                ]" required :min="minEndDate" />
            </VCol>

            <!-- Nombre de places disponibles -->
            <VCol cols="12" md="3">
              <VTextField v-model.number="session.available_slots" label="Nombre de places" type="number"
                variant="outlined" density="comfortable" prepend-inner-icon="ri-group-line" placeholder="Ex: 30" min="1"
                :rules="[(v: number) => v > 0 || 'Le nombre de places doit être positif']" />
            </VCol>

            <!-- Devise -->
            <VCol cols="12" md="3">
              <VSelect v-model="session.currency" :items="currencyOptions" label="Devise" variant="outlined"
                density="comfortable" prepend-inner-icon="ri-money-dollar-circle-line"
                :rules="[(v: string) => !!v || 'La devise est obligatoire']" required />
              </VCol>

              <!-- Date limite d'inscription -->
              <VCol cols="12" md="6">
              <AppDateTimePicker v-model="session.registration_deadline" label="Date limite d'inscription"
                placeholder="Sélectionnez la date limite" prepend-inner-icon="ri-calendar-check-line" :rules="[
                  (v: string) => !!v || 'La date limite d\'inscription est obligatoire',
                  (v: string) => !v || v >= today || 'La date limite ne peut pas être dans le passé',
                  (v: string) => !v || !session?.start_date || v <= session.start_date || 'La date limite doit être antérieure ou égale à la date de début'
                ]" required :min="minRegistrationDeadline" :max="maxRegistrationDeadline || undefined" />
              </VCol>

            <!-- Statut -->
              <VCol cols="12" md="6">
              <VSelect v-model="session.status" :items="statusOptions" label="Statut de la session" variant="outlined"
                density="comfortable" prepend-inner-icon="ri-flag-line"
                :rules="[(v: string) => !!v || 'Le statut est obligatoire']" required />
              </VCol>

              <!-- Frais d'inscription -->
            <VCol cols="12" md="3">
              <VTextField v-model.number="session.registration_fee" label="Frais d'inscription" type="number"
                step="0.01" variant="outlined" density="comfortable" prepend-inner-icon="ri-money-euro-circle-line"
                placeholder="Ex: 50.00" suffix="€" min="0"
                :rules="[(v: number) => v >= 0 || 'Les frais ne peuvent pas être négatifs']" />
              </VCol>

              <!-- Frais de formation -->
            <VCol cols="12" md="3">
              <VTextField v-model.number="session.training_fee" label="Frais de formation" type="number" step="0.01"
                variant="outlined" density="comfortable" prepend-inner-icon="ri-money-euro-circle-line"
                placeholder="Ex: 800.00" suffix="€" min="0"
                :rules="[(v: number) => v >= 0 || 'Les frais ne peuvent pas être négatifs']" />
              </VCol>
            </VRow>
          <VDivider class="my-4"></VDivider>
          <!-- Actions -->
          <VCardActions class="px-0 pt-6">
            <VSpacer />
            <VBtn variant="flat" color="error" @click="handleBack">
              Annuler
            </VBtn>
            <VBtn variant="flat" type="submit" color="primary" :loading="isSubmitting" :disabled="isSubmitting">
              Modifier
            </VBtn>
          </VCardActions>
        </VForm>
      </VCardText>
      </VCard>

    <!-- Message d'erreur -->
    <VAlert v-if="error" type="error" class="mt-4" closable @click:close="clearError">
      {{ error }}
    </VAlert>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { trainingService } from '@/services/api/training'
import { organizationCentersService } from '@/services/api/organization-centers'
import type { TrainingSession, TrainingSessionCreateInput } from '@/types/training'
import { TrainingSessionStatusEnum } from '@/types/training'
import AppDateTimePicker from '@/components/common/AppDateTimePicker.vue'
import { showToast } from '@/components/toast/toastManager'

const router = useRouter()
const route = useRoute()

// State
const session = ref<TrainingSession | null>(null)
const isLoadingSession = ref(false)
const isSubmitting = ref(false)
const error = ref('')
const formRef = ref()

// Form data
const trainings = ref<{ id: string; title: string; training_type: string }[]>([])
const centers = ref<{ id: number; name: string }[]>([])
const selectedTraining = ref<{ id: string; title: string; training_type: string } | null>(null)

// Loading states
const isLoadingTrainings = ref(false)
const isLoadingCenters = ref(false)

// Search states
const trainingSearch = ref('')
const centerSearch = ref('')

// Options
const currencyOptions = [
  { title: 'Euro (EUR)', value: 'EUR' },
  { title: 'Dollar américain (USD)', value: 'USD' },
  { title: 'Franc CFA (XOF)', value: 'XOF' }
]

const statusOptions = [
  { title: 'Ouverte aux inscriptions', value: TrainingSessionStatusEnum.OPEN_FOR_REGISTRATION },
  { title: 'Fermée aux inscriptions', value: TrainingSessionStatusEnum.CLOSE_FOR_REGISTRATION },
  { title: 'En cours', value: TrainingSessionStatusEnum.ONGOING },
  { title: 'Terminée', value: TrainingSessionStatusEnum.COMPLETED }
]

// Computed properties
const trainingOptions = computed(() => trainings.value)
const centerOptions = computed(() => centers.value)

// Computed properties for training type logic
const isOnlineTraining = computed(() => {
  return selectedTraining.value?.training_type === 'Off-Site'
})

const isCenterRequired = computed(() => {
  return !isOnlineTraining.value
})

// Computed properties for date validation
const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const minStartDate = computed(() => {
  return today.value
})

const minEndDate = computed(() => {
  return session.value?.start_date || today.value
})

const minRegistrationDeadline = computed(() => {
  return today.value
})

const maxRegistrationDeadline = computed(() => {
  return session.value?.start_date || null
})

// Methods
const handleBack = () => {
  router.push({ name: 'training-sessions-index' })
}

const loadSession = async () => {
  try {
    isLoadingSession.value = true
    const sessionId = route.params.id as string

    if (!sessionId) {
      error.value = 'ID de session manquant'
      return
    }

    const response = await trainingService.getTrainingSession(sessionId)
    session.value = response.data

    // Charger les formations pour trouver le type de formation
    await fetchTrainings()

    // Trouver la formation sélectionnée
    if (session.value?.training_id) {
      selectedTraining.value = trainings.value.find(t => t.id === session.value!.training_id) || null
    }

  } catch (err: any) {
    console.error('Erreur lors du chargement de la session:', err)
    error.value = 'Erreur lors du chargement de la session'
  } finally {
    isLoadingSession.value = false
  }
}

const fetchTrainings = async () => {
  try {
    isLoadingTrainings.value = true
    const response = await trainingService.listTrainings({ page: 1, page_size: 1000 })
    trainings.value = response.data.map(t => ({
      id: t.id,
      title: t.title,
      training_type: t.training_type
    }))
  } catch (error) {
    console.error('Erreur lors du chargement des formations:', error)
  } finally {
    isLoadingTrainings.value = false
  }
}

const fetchCenters = async () => {
  try {
    isLoadingCenters.value = true
    const response = await organizationCentersService.listOrganizationCenters({ page: 1, page_size: 1000 })
    centers.value = response.data.map((c: any) => ({ id: c.id, name: c.name }))
  } catch (error) {
    console.error('Erreur lors du chargement des centres:', error)
  } finally {
    isLoadingCenters.value = false
  }
}

const onTrainingSearch = (searchTerm: string) => {
  trainingSearch.value = searchTerm
  if (searchTerm.length >= 2) {
    fetchTrainings()
  }
}

const onCenterSearch = (searchTerm: string) => {
  centerSearch.value = searchTerm
  if (searchTerm.length >= 2) {
    fetchCenters()
  }
}

const handleSubmit = async () => {
  if (!session.value) return

  // Validation du formulaire
  const { valid } = await formRef.value.validate()
  if (!valid) return

  // Validation côté client
  if (!session.value.training_id) {
    showToast({ message: 'Veuillez sélectionner une formation', type: 'error' })
    return
  }

  if (!session.value.registration_deadline) {
    showToast({ message: 'Veuillez sélectionner une date limite d\'inscription', type: 'error' })
    return
  }

  try {
    isSubmitting.value = true

    const sessionData: TrainingSessionCreateInput = {
      training_id: session.value.training_id,
      center_id: session.value.center_id || undefined,
      start_date: session.value.start_date || null,
      end_date: session.value.end_date || null,
      registration_deadline: session.value.registration_deadline,
      available_slots: session.value.available_slots || null,
      registration_fee: session.value.registration_fee || null,
      training_fee: session.value.training_fee || null,
      currency: session.value.currency || 'EUR',
      status: session.value.status || TrainingSessionStatusEnum.OPEN_FOR_REGISTRATION
    }

    await trainingService.updateTrainingSession(session.value.id.toString(), sessionData)

    showToast({
      message: 'Session mise à jour avec succès',
      type: 'success'
    })

    router.push({ name: 'training-sessions-index' })

  } catch (err: any) {
    console.error('Erreur lors de la mise à jour:', err)

    if (err.response?.data?.error) {
      const errorDetails = err.response.data.error
      if (Array.isArray(errorDetails) && errorDetails.length > 0) {
        const firstError = errorDetails[0]
        showToast({
          message: `Erreur de validation: ${firstError.msg}`,
          type: 'error'
        })
      } else {
        showToast({
          message: 'Erreur lors de la mise à jour de la session',
          type: 'error'
        })
      }
    } else {
      showToast({
        message: 'Erreur lors de la mise à jour de la session',
        type: 'error'
      })
    }
  } finally {
    isSubmitting.value = false
  }
}

const clearError = () => {
  error.value = ''
}

// Watchers
watch(() => session.value?.training_id, (newTrainingId) => {
  if (newTrainingId) {
    selectedTraining.value = trainings.value.find(t => t.id === newTrainingId) || null

    // Si la formation est en ligne, vider le centre sélectionné
    if (isOnlineTraining.value && session.value) {
      session.value.center_id = undefined
    }
  } else {
    selectedTraining.value = null
  }
})

// Watchers pour la cohérence des dates
watch(() => session.value?.start_date, (newStartDate) => {
  if (!session.value) return

  // Si la date de fin est antérieure à la nouvelle date de début, la vider
  if (session.value.end_date && newStartDate && session.value.end_date < newStartDate) {
    session.value.end_date = ''
  }

  // Si la date limite d'inscription est postérieure à la date de début, l'ajuster
  if (session.value.registration_deadline && newStartDate && session.value.registration_deadline > newStartDate) {
    session.value.registration_deadline = newStartDate
  }
})

watch(() => session.value?.end_date, (newEndDate) => {
  if (!session.value) return

  // Si la date de fin est antérieure à la date de début, la vider
  if (session.value.start_date && newEndDate && newEndDate < session.value.start_date) {
    session.value.end_date = ''
    showToast({
      message: 'La date de fin doit être postérieure à la date de début',
      type: 'warning'
    })
  }
})

watch(() => session.value?.registration_deadline, (newDeadline) => {
  if (!session.value) return

  // Si la date limite d'inscription est postérieure à la date de début, l'ajuster
  if (session.value.start_date && newDeadline && newDeadline > session.value.start_date) {
    session.value.registration_deadline = session.value.start_date
    showToast({
      message: 'La date limite d\'inscription doit être antérieure ou égale à la date de début',
      type: 'warning'
    })
  }
})

// Lifecycle
onMounted(() => {
  loadSession()
  fetchCenters() // Charger les centres au montage
})
</script>

<style scoped>
.training-session-edit-page {
  padding: 1.5rem;
}

@media (max-width: 768px) {
  .training-session-edit-page {
    padding: 1rem;
  }
}
</style>