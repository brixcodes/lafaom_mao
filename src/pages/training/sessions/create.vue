<template>
  <div class="training-session-create-page">
    <!-- En-tête -->
    <div class="d-flex align-center mb-6">
      <VBtn icon="ri-arrow-left-line" variant="text" @click="handleBack" class="me-3" />
      <div>
        <h1 class="text-h4 mb-1">
          <VIcon icon="ri-add-line" class="me-2" color="primary" />
          Créer une session de formation
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Remplissez les informations pour créer une nouvelle session de formation
        </p>
      </div>
    </div>

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

    <!-- Formulaire -->
    <VCard>
      <VForm ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
        <VCardText>
          <VRow>
            <!-- Formation -->
            <VCol cols="12" md="6">
              <VAutocomplete v-model="session.training_id" :items="trainingOptions" item-title="title" item-value="id"
                label="Formation" placeholder="Rechercher une formation..." variant="outlined" density="comfortable"
                :rules="[(v: string) => !!v || 'La formation est obligatoire']" required :loading="isLoadingTrainings"
                :search="trainingSearch" @update:search="onTrainingSearch" no-data-text="Aucune formation trouvée"
                prepend-inner-icon="ri-graduation-cap-line" />
            </VCol>

            <!-- Centre de formation -->
            <VCol cols="12" md="6">
              <VAutocomplete 
                v-model="session.center_id" 
                :items="centerOptions" 
                item-title="name" 
                item-value="id"
                :label="isOnlineTraining ? 'Centre de formation (non applicable pour les formations en ligne)' : 'Centre de formation (optionnel)'" 
                placeholder="Rechercher un centre..." 
                variant="outlined"
                density="comfortable" 
                clearable 
                :loading="isLoadingCenters" 
                :search="centerSearch"
                @update:search="onCenterSearch" 
                no-data-text="Aucun centre trouvé"
                prepend-inner-icon="ri-building-line"
                :disabled="isOnlineTraining"
                :hint="isOnlineTraining ? 'Cette formation se déroule en ligne, aucun centre n\'est requis' : ''"
                persistent-hint
              />
            </VCol>

            <!-- Date de début -->
            <VCol cols="12" md="6">
              <AppDateTimePicker 
                v-model="session.start_date" 
                label="Date de début"
                placeholder="Sélectionnez la date de début" 
                prepend-inner-icon="ri-calendar-line"
                :rules="[
                  (v: string) => !!v || 'La date de début est obligatoire',
                  (v: string) => !v || v >= today || 'La date de début ne peut pas être dans le passé'
                ]" 
                required 
                :min="today"
              />
            </VCol>

            <!-- Date de fin -->
            <VCol cols="12" md="6">
              <AppDateTimePicker 
                v-model="session.end_date" 
                label="Date de fin"
                placeholder="Sélectionnez la date de fin" 
                prepend-inner-icon="ri-calendar-line"
                :rules="[
                  (v: string) => !!v || 'La date de fin est obligatoire',
                  (v: string) => !v || !session.start_date || v >= session.start_date || 'La date de fin doit être postérieure à la date de début'
                ]" 
                required 
                :min="minEndDate"
              />
            </VCol>



            <!-- Nombre de places disponibles -->
            <VCol cols="12" md="3">
              <VTextField v-model.number="session.available_slots" label="Nombre de places disponibles" type="number"
                variant="outlined" density="comfortable" prepend-inner-icon="ri-group-line" min="1"
                placeholder="Ex: 20" />
            </VCol>


            <!-- Devise -->
            <VCol cols="12" md="3">
              <VSelect v-model="session.currency" :items="currencyOptions" label="Devise" variant="outlined"
                density="comfortable" prepend-inner-icon="ri-money-dollar-circle-line"
                :rules="[(v: string) => !!v || 'La devise est obligatoire']" required />
            </VCol>


            <!-- Date limite d'inscription -->
            <VCol cols="12" md="6">
              <AppDateTimePicker 
                v-model="session.registration_deadline" 
                label="Date limite d'inscription"
                placeholder="Sélectionnez la date limite" 
                prepend-inner-icon="ri-calendar-check-line"
                :rules="[
                  (v: string) => !!v || 'La date limite d\'inscription est obligatoire',
                  (v: string) => !v || v >= today || 'La date limite ne peut pas être dans le passé',
                  (v: string) => !v || !session.start_date || v <= session.start_date || 'La date limite doit être antérieure ou égale à la date de début'
                ]" 
                required 
                :min="minRegistrationDeadline"
                :max="maxRegistrationDeadline || undefined"
              />
            </VCol>

            <!-- Frais d'inscription -->
            <VCol cols="12" md="6">
              <VTextField v-model.number="session.registration_fee" label="Frais d'inscription" type="number"
                step="0.01" variant="outlined" density="comfortable" prepend-inner-icon="ri-money-euro-circle-line"
                placeholder="Ex: 50.00" suffix="€" min="0"
                :rules="[(v: number) => v >= 0 || 'Les frais ne peuvent pas être négatifs']" />
            </VCol>

            <!-- Frais de formation -->
            <VCol cols="12" md="6">
              <VTextField v-model.number="session.training_fee" label="Frais de formation" type="number" step="0.01"
                variant="outlined" density="comfortable" prepend-inner-icon="ri-money-euro-circle-line"
                placeholder="Ex: 500.00" suffix="€" min="0"
                :rules="[(v: number) => v >= 0 || 'Les frais ne peuvent pas être négatifs']" />
            </VCol>

          </VRow>
        </VCardText>

        <VDivider />

        <VCardActions class="pa-4">
          <VSpacer />
          <VBtn variant="flat" color="error" @click="handleBack" :disabled="isSaving">
            Annuler
          </VBtn>
          <VBtn variant="flat" type="submit" color="primary" :loading="isSaving" :disabled="!isFormValid">
            Enregistrer
          </VBtn>
        </VCardActions>
      </VForm>
    </VCard>

    <!-- Message d'erreur -->
    <VAlert v-if="error" type="error" class="mt-4" closable @click:close="clearError">
      {{ error }}
    </VAlert>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { trainingService } from '@/services/api/training'
import { organizationCentersService } from '@/services/api/organization-centers'
import type { TrainingSessionCreateInput } from '@/types/training'
import { TrainingSessionStatusEnum } from '@/types/training'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'
import AppDateTimePicker from '@/components/common/AppDateTimePicker.vue'

const router = useRouter()

// Form ref
const formRef = ref()

// State
const isFormValid = ref(false)
const isSaving = ref(false)
const error = ref('')
const trainings = ref<{ id: string; title: string; training_type: string }[]>([])
const centers = ref<{ id: number; name: string }[]>([])
const isLoadingCenters = ref(false)
const isLoadingTrainings = ref(false)
const centerSearch = ref('')
const trainingSearch = ref('')
const selectedTraining = ref<{ id: string; title: string; training_type: string } | null>(null)

// Session form
const session = ref<TrainingSessionCreateInput>({
  training_id: '',
  center_id: null,
  start_date: '',
  end_date: '',
  registration_deadline: '',
  available_slots: null,
  registration_fee: null,
  training_fee: null,
  currency: 'EUR'
})

// Options
const currencyOptions = [
  { title: 'Euro (EUR)', value: 'EUR' },
  { title: 'Dollar américain (USD)', value: 'USD' },
  { title: 'Franc CFA (XOF)', value: 'XOF' }
]

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
  return session.value.start_date || today.value
})

const minRegistrationDeadline = computed(() => {
  return today.value
})

const maxRegistrationDeadline = computed(() => {
  return session.value.start_date || null
})

// Methods
const handleBack = () => {
  router.push({ name: 'training-sessions-index' })
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  const confirmed = await confirmAction({
    title: 'Êtes-vous sûr ?',
    text: "Souhaitez-vous réellement enregistrer cette session de formation ?",
    confirmButtonText: `<span style="color:white">Enregistrer</span>`,
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
    // Prepare data for API - ensure proper format
    const sessionData = {
      ...session.value,
      // Ensure center_id is null instead of undefined
      center_id: session.value.center_id || null,
      // Ensure dates are properly formatted
      start_date: session.value.start_date || null,
      end_date: session.value.end_date || null,
      // Ensure numeric values are properly formatted
      available_slots: session.value.available_slots || null,
      registration_fee: session.value.registration_fee || null,
      training_fee: session.value.training_fee || null,
      // Add required status field
      status: 'OPEN_FOR_REGISTRATION'
    }

    // Log the data being sent
    console.log('Data being sent to API:', JSON.stringify(sessionData, null, 2))

    await trainingService.createTrainingSession(sessionData)
    showToast({ message: 'Session de formation créée avec succès', type: 'success' })
    router.push({ name: 'training-sessions-index' })
  } catch (err: any) {
    console.error('Erreur lors de la création:', err)

    // Log detailed error information
    if (err.response?.data) {
      console.error('API Error Details:', err.response.data)
      if (err.response.data.validation_errors) {
        console.error('Validation Errors:', err.response.data.validation_errors)

        // Show specific validation errors
        const validationErrors = err.response.data.validation_errors
        const errorMessages = Object.values(validationErrors).flat()
        if (errorMessages.length > 0) {
          showToast({ message: `Erreurs de validation: ${errorMessages.join(', ')}`, type: 'error' })
          return
        }
      }
    }

    showToast({ message: 'Erreur lors de la création de la session', type: 'error' })
  } finally {
    isSaving.value = false
  }
}

const fetchTrainings = async (search = '') => {
  try {
    isLoadingTrainings.value = true
    const response = await trainingService.listTrainings({
      page: 1,
      page_size: 100,
      search: search || undefined
    })
    trainings.value = response.data.map(t => ({ 
      id: t.id, 
      title: t.title, 
      training_type: t.training_type 
    }))
  } catch (error) {
    console.error('Erreur lors du chargement des formations:', error)
    trainings.value = []
  } finally {
    isLoadingTrainings.value = false
  }
}

const onTrainingSearch = (search: string) => {
  trainingSearch.value = search
  if (search.length >= 2) {
    fetchTrainings(search)
  } else if (search.length === 0) {
    fetchTrainings()
  }
}

const fetchCenters = async (search = '') => {
  try {
    isLoadingCenters.value = true
    const response = await organizationCentersService.getActiveOrganizationCenters({
      page: 1,
      page_size: 100,
      search: search || undefined
    })
    centers.value = response.data.map(c => ({ id: c.id, name: c.name }))
  } catch (error) {
    console.error('Erreur lors du chargement des centres:', error)
    centers.value = []
  } finally {
    isLoadingCenters.value = false
  }
}

const onCenterSearch = (search: string) => {
  centerSearch.value = search
  if (search.length >= 2) {
    fetchCenters(search)
  } else if (search.length === 0) {
    fetchCenters()
  }
}

const clearError = () => {
  error.value = ''
}

// Watchers
watch(() => session.value.training_id, (newTrainingId) => {
  if (newTrainingId) {
    selectedTraining.value = trainings.value.find(t => t.id === newTrainingId) || null
    
    // Si la formation est en ligne, vider le centre sélectionné
    if (isOnlineTraining.value) {
      session.value.center_id = null
    }
  } else {
    selectedTraining.value = null
  }
})

// Watchers pour la cohérence des dates
watch(() => session.value.start_date, (newStartDate) => {
  // Si la date de fin est antérieure à la nouvelle date de début, la vider
  if (session.value.end_date && newStartDate && session.value.end_date < newStartDate) {
    session.value.end_date = ''
  }
  
  // Si la date limite d'inscription est postérieure à la date de début, l'ajuster
  if (session.value.registration_deadline && newStartDate && session.value.registration_deadline > newStartDate) {
    session.value.registration_deadline = newStartDate
  }
})

watch(() => session.value.end_date, (newEndDate) => {
  // Si la date de fin est antérieure à la date de début, la vider
  if (session.value.start_date && newEndDate && newEndDate < session.value.start_date) {
    session.value.end_date = ''
    showToast({ 
      message: 'La date de fin doit être postérieure à la date de début', 
      type: 'warning' 
    })
  }
})

watch(() => session.value.registration_deadline, (newDeadline) => {
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
  fetchTrainings()
  fetchCenters() // Charger les centres au montage
})
</script>

<style scoped>
.training-session-create-page {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .training-session-create-page {
    padding: 1rem;
  }
}
</style>