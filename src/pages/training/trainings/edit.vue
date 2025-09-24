<template>
  <div class="training-edit-page">
    <!-- En-tête -->
    <div class="d-flex align-center mb-6">
      <VBtn
        icon="ri-arrow-left-line"
        variant="text"
        @click="handleBack"
        class="me-3"
      />
      <div>
        <h1 class="text-h4 mb-1">
          <VIcon icon="ri-edit-line" class="me-2" color="primary" />
          Modifier la formation
        </h1>
        <p class="text-body-1 text-medium-emphasis" v-if="currentTraining">
          Titre : {{ currentTraining.title }} || Ref : {{ currentTraining.id }}
        </p>
      </div>
    </div>

    <!-- Chargement -->
    <div v-if="isLoading && !currentTraining" class="text-center pa-8">
      <VProgressCircular indeterminate color="primary" size="64" class="mb-4" />
      <p class="text-body-1">Chargement de la formation...</p>
    </div>

    <!-- Formulaire -->
    <div v-else-if="currentTraining">
      <VCard>
        <VCardText>
          <VForm ref="form" @submit.prevent="saveTraining">
            <VRow>
              <!-- Titre -->
              <VCol cols="12" md="6">
                <VTextField v-model="training.title" label="Titre de la formation" prepend-inner-icon="ri-file-text-line"
                  :rules="[(v: string) => !!v || 'Le titre est requis']" required />
              </VCol>

              <!-- Spécialité -->
              <VCol cols="12" md="6">
                <VAutocomplete v-model="training.specialty_id" :items="specialties" item-title="name" item-value="id"
                  label="Spécialité" prepend-inner-icon="ri-bookmark-line" :loading="isLoading"
                  :rules="[(v: number) => !!v || 'La spécialité est requise']" required />
              </VCol>

              <!-- Type de formation -->
              <VCol cols="12" md="3">
                <VAutocomplete v-model="training.training_type" :items="trainingTypes" item-title="title"
                  item-value="value" label="Type de formation" prepend-inner-icon="ri-article-line"
                  :rules="[(v: string) => !!v || 'Le type de formation est requis']" required />
              </VCol>

              <!-- Statut -->
              <VCol cols="12" md="3">
                <VAutocomplete v-model="training.status" :items="statusOptions" item-title="title" item-value="value"
                  label="Statut" prepend-inner-icon="ri-toggle-line" :rules="[(v: string) => !!v || 'Le statut est requis']"
                  required />
              </VCol>

              <!-- Durée -->
              <VCol cols="12" md="3">
                <VTextField v-model.number="training.duration" label="Durée" type="number"
                  prepend-inner-icon="ri-timer-line" :rules="[
                    (v: number) => !!v || 'La durée est requise',
                    (v: number) => v > 0 || 'La durée doit être supérieure à 0'
                  ]" required />
              </VCol>

              <!-- Unité de durée -->
              <VCol cols="12" md="3">
                <VAutocomplete v-model="training.duration_unit" :items="durationUnits" item-title="title"
                  item-value="value" label="Unité de durée" prepend-inner-icon="ri-calendar-2-line"
                  :rules="[(v: string) => !!v || 'L\'unité de durée est requise']" required />
              </VCol>

              <!-- Présentation -->
              <VCol cols="12">
                <QuillEditor 
                  key="presentation-editor" 
                  editor-id="presentation-editor" 
                  v-model="training.presentation"
                  label="Présentation"
                  placeholder="Contexte, défis et vision globale de la formation"
                  :rules="[(v: string) => !!v || 'La présentation est requise']"
                  required
                />
              </VCol>

              <!-- Compétences cibles -->
              <VCol cols="12" md="6">
                <QuillEditor 
                  key="target-skills-editor" 
                  editor-id="target-skills-editor" 
                  v-model="training.target_skills"
                  label="Compétences cibles"
                  placeholder="Compétences et savoir-faire à acquérir"
                  :rules="[(v: string) => !!v || 'Les compétences cibles sont requises']"
                  required
                />
              </VCol>

              <!-- Programme -->
              <VCol cols="12" md="6">
                <QuillEditor 
                  key="program-editor" 
                  editor-id="program-editor" 
                  v-model="training.program"
                  label="Programme détaillé"
                  placeholder="Contenu et structure détaillée de la formation"
                  :rules="[(v: string) => !!v || 'Le programme est requis']"
                  required
                />
              </VCol>

              <!-- Public cible -->
              <VCol cols="12" md="6">
                <QuillEditor 
                  key="target-audience-editor" 
                  editor-id="target-audience-editor" 
                  v-model="training.target_audience"
                  label="Public cible"
                  placeholder="Public visé et prérequis"
                  :rules="[(v: string) => !!v || 'Le public cible est requis']"
                  required
                />
              </VCol>

              <!-- Prérequis -->
              <VCol cols="12" md="6">
                <QuillEditor 
                  key="prerequisites-editor" 
                  editor-id="prerequisites-editor" 
                  v-model="training.prerequisites"
                  label="Prérequis"
                  placeholder="Prérequis nécessaires pour suivre la formation"
                />
              </VCol>

              <!-- Inscription -->
              <VCol cols="12">
                <QuillEditor 
                  key="enrollment-editor" 
                  editor-id="enrollment-editor" 
                  v-model="training.enrollment"
                  label="Modalités d'inscription"
                  placeholder="Méthodes d'inscription, durée, rythme"
                  :rules="[(v: string) => !!v || 'Les modalités d\'inscription sont requises']"
                  required
                />
              </VCol>
            </VRow>

            <VDivider class="my-4" />
            <VCardActions class="justify-end">
              <VBtn color="error" variant="flat" size="large" @click="handleBack">
                Annuler
              </VBtn>
              <VBtn color="primary" variant="flat" size="large" type="submit" :loading="isSaving">
                Modifier
              </VBtn>
            </VCardActions>
          </VForm>
        </VCardText>
      </VCard>
    </div>

    <!-- Erreur -->
    <VAlert
      v-else-if="error"
      type="error"
      class="mt-4"
      closable
      @click:close="clearError"
    >
      {{ error }}
    </VAlert>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { trainingService } from '@/services/api/training'
import type { Training, TrainingCreateInput } from '@/types/training'
import { TrainingTypeEnum, TrainingStatus, DurationEnum } from '@/types/training'
import { confirmAction } from '@/utils/confirm'
import { showToast } from '@/components/toast/toastManager'
import QuillEditor from '@/components/common/QuillEditor.vue'

const route = useRoute()
const router = useRouter()
const form = ref()
const currentTraining = ref<Training | null>(null)
const specialties = ref<{ id: number; name: string }[]>([])
const isSaving = ref(false)
const isLoading = ref(true)
const error = ref('')

// Options de formulaire
const trainingTypes = [
  { title: 'En présentiel', value: TrainingTypeEnum.ON_SITE },
  { title: 'À distance', value: TrainingTypeEnum.OFF_SITE },
]

const durationUnits = [
  { title: 'Heures', value: DurationEnum.HOURS },
  { title: 'Jours', value: DurationEnum.DAYS },
  { title: 'Mois', value: DurationEnum.MONTHS },
  { title: 'Années', value: DurationEnum.YEARS },
]

const statusOptions = [
  { title: 'Actif', value: TrainingStatus.ACTIVE },
  { title: 'Inactif', value: TrainingStatus.INACTIVE },
]

// Formulaire
const training = reactive<TrainingCreateInput>({
  title: '',
  status: TrainingStatus.INACTIVE,
  duration: 0,
  duration_unit: DurationEnum.HOURS,
  specialty_id: 0,
  training_type: TrainingTypeEnum.ON_SITE,
  presentation: '',
  target_skills: '',
  program: '',
  target_audience: '',
  prerequisites: '',
  enrollment: '',
})

// Chargement des données
const loadTraining = async () => {
  const trainingId = route.params.id as string
  if (!trainingId) return

  isLoading.value = true
  try {
    const response = await trainingService.getTraining(trainingId)
    currentTraining.value = response.data
    
    // Remplir le formulaire avec les données existantes
    Object.assign(training, {
      title: currentTraining.value.title,
      status: currentTraining.value.status,
      duration: currentTraining.value.duration,
      duration_unit: currentTraining.value.duration_unit,
      specialty_id: currentTraining.value.specialty_id,
      training_type: currentTraining.value.training_type,
      presentation: currentTraining.value.presentation,
      target_skills: currentTraining.value.target_skills,
      program: currentTraining.value.program,
      target_audience: currentTraining.value.target_audience,
      prerequisites: currentTraining.value.prerequisites || '',
      enrollment: currentTraining.value.enrollment,
    })
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement de la formation'
  } finally {
    isLoading.value = false
  }
}

const fetchSpecialties = async () => {
  try {
    const response = await trainingService.listSpecialties({})
    specialties.value = response.data
  } catch (err: any) {
    showToast({ message: 'Erreur lors du chargement des spécialités', type: 'error' })
  }
}

// Sauvegarde avec confirmation
const saveTraining = async () => {
  if (!form.value) return
  const { valid } = await form.value.validate()
  if (!valid) return

  const confirmed = await confirmAction({
    title: 'Êtes-vous sûr ?',
    text: "Souhaitez-vous réellement modifier cette formation?",
    confirmButtonText: `<span style="color:white">Modifier</span>`,
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
    const trainingId = route.params.id as string
    await trainingService.updateTraining(trainingId, training)
    showToast({ message: 'Formation modifiée avec succès', type: 'success' })
    router.push({ name: 'training-trainings-detail', params: { id: trainingId } })
  } catch (err: any) {
    showToast({ message: 'Erreur lors de la modification de la formation', type: 'error' })
  } finally {
    isSaving.value = false
  }
}

const handleBack = () => {
  const trainingId = route.params.id as string
  if (trainingId) {
    router.push({ name: 'training-trainings-detail', params: { id: trainingId } })
  } else {
    router.push({ name: 'training-trainings-index' })
  }
}

const clearError = () => {
  error.value = ''
}

// Initialisation
onMounted(() => {
  loadTraining()
  fetchSpecialties()
})
</script>

<style scoped>
.training-edit-page {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .training-edit-page {
    padding: 1rem;
  }
}
</style>