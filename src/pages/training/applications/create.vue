<template>
  <div class="training-application-create-page">
    <!-- En-tête -->
    <div class="d-flex align-center mb-6">
      <VBtn icon="ri-arrow-left-line" variant="text" @click="handleBack" class="me-3" />
      <div>
        <h1 class="text-h4 mb-1">
          <VIcon icon="ri-send-plane-line" class="me-2" color="primary" />
          Candidater à une formation
        </h1>
        <p class="text-body-1 text-medium-emphasis" v-if="training">
          Candidature pour : {{ training.title }} - {{ training.training_type }}
        </p>
      </div>
    </div>

    <!-- Chargement de la formation -->
    <div v-if="isLoadingTraining && !training" class="text-center pa-8">
      <VProgressCircular indeterminate color="primary" size="64" class="mb-4" />
      <p class="text-body-1">Chargement de la formation...</p>
    </div>

    <!-- Formation non trouvée -->
    <VAlert v-else-if="!training && !isLoadingTraining" type="error" class="mb-6">
      La formation demandée n'a pas été trouvée ou n'est plus disponible.
    </VAlert>

    <!-- Formation non disponible -->
    <VAlert v-else-if="training && training.status !== TrainingStatusEnum.ACTIVE" type="warning" class="mb-6">
      Cette formation n'est plus disponible pour les candidatures.
    </VAlert>

    <!-- Formulaire de candidature -->
    <div v-else>
      <VRow>
        <!-- Colonne principale - Formulaire -->
        <VCol cols="12" lg="12">
          <VCard elevation="3">
            <VCardText class="pb-8">
              <VForm ref="formRef" @submit.prevent="handleSubmit">
                <!-- Informations personnelles -->
                <div class="mb-6">
                  <h3 class="text-h6 mb-4">Informations personnelles</h3>
                  <VRow>
                    <!-- Civilité -->
                    <VCol cols="12" md="12">
                      <VSelect v-model="form.civility" :items="civilityOptions" prepend-inner-icon="ri-user-line"
                        label="Civilité" variant="outlined" />
                    </VCol>

                    <!-- Prénom -->
                    <VCol cols="12" md="6">
                      <VTextField v-model="form.first_name" prepend-inner-icon="ri-user-line" label="Prénom"
                        variant="outlined" :rules="rules.first_name" :error-messages="fieldErrors.first_name" required />
                    </VCol>

                    <!-- Nom -->
                    <VCol cols="12" md="6">
                      <VTextField v-model="form.last_name" prepend-inner-icon="ri-user-3-line" label="Nom de famille"
                        variant="outlined" :rules="rules.last_name" :error-messages="fieldErrors.last_name" required />
                    </VCol>

                    <!-- Email -->
                    <VCol cols="12" md="6">
                      <VTextField v-model="form.email" prepend-inner-icon="ri-mail-line" label="Email"
                        variant="outlined" type="email" :rules="rules.email" :error-messages="fieldErrors.email" required />
                    </VCol>

                    <!-- Téléphone -->
                    <VCol cols="12" md="6">
                      <VTextField v-model="form.phone" prepend-inner-icon="ri-phone-line" label="Téléphone"
                        variant="outlined" :rules="rules.phone" :error-messages="fieldErrors.phone" required />
                    </VCol>

                    <!-- Date de naissance -->
                    <VCol cols="12" md="6">
                      <VTextField v-model="form.birth_date" prepend-inner-icon="ri-calendar-line" label="Date de naissance"
                        variant="outlined" type="date" />
                    </VCol>

                    <!-- Adresse -->
                    <VCol cols="12" md="6">
                      <VTextField v-model="form.address" prepend-inner-icon="ri-map-pin-line" label="Adresse"
                        variant="outlined" />
                    </VCol>
                  </VRow>
                </div>

                <!-- Informations académiques -->
                <div class="mb-6">
                  <h3 class="text-h6 mb-4">Informations académiques</h3>
                  <VRow>
                    <!-- Niveau d'études -->
                    <VCol cols="12" md="6">
                      <VSelect v-model="form.education_level" :items="educationLevelOptions" prepend-inner-icon="ri-graduation-cap-line"
                        label="Niveau d'études" variant="outlined" />
                    </VCol>

                    <!-- Expérience professionnelle -->
                    <VCol cols="12" md="6">
                      <VSelect v-model="form.experience_years" :items="experienceOptions" prepend-inner-icon="ri-briefcase-line"
                        label="Années d'expérience" variant="outlined" />
                    </VCol>

                    <!-- Motivation -->
                    <VCol cols="12">
                      <VTextarea v-model="form.motivation" prepend-inner-icon="ri-quill-pen-line" label="Lettre de motivation"
                        variant="outlined" rows="4" :rules="rules.motivation" :error-messages="fieldErrors.motivation" required
                        placeholder="Expliquez pourquoi vous souhaitez suivre cette formation et comment elle s'inscrit dans votre projet professionnel..." />
                    </VCol>
                  </VRow>
                </div>

                <!-- Pièces jointes -->
                <div class="mb-6">
                  <h3 class="text-h6 mb-4">Pièces jointes</h3>
                  <VRow>
                    <VCol cols="12">
                      <VFileInput v-model="attachmentFiles"  prepend-icon="" prepend-inner-icon="ri-attachment-line" label="Documents à joindre"
                        variant="outlined" multiple chips show-size accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        placeholder="Sélectionnez vos documents (CV, diplômes, etc.)" />
                      <div class="text-caption text-medium-emphasis mt-2">
                        Formats acceptés : PDF, DOC, DOCX, JPG, PNG (max 10MB par fichier)
                      </div>
                    </VCol>
                  </VRow>
                </div>

                <!-- Actions -->
                <div class="d-flex justify-space-between align-center mt-6">
                  <VBtn variant="outlined" @click="handleBack">
                    <VIcon icon="ri-arrow-left-line" class="me-2" />
                    Annuler
                  </VBtn>
                  <VBtn type="submit" color="primary" :loading="isSubmitting" :disabled="!isFormValid">
                    <VIcon icon="ri-send-plane-line" class="me-2" />
                    Soumettre ma candidature
                  </VBtn>
                </div>
              </VForm>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { trainingService } from '@/services/api/training'
import { TrainingStatus as TrainingStatusEnum, TrainingTypeEnum, DurationEnum } from '@/types/training'
import { showToast } from '@/components/toast/toastManager'
import type { Training } from '@/types/training'

const router = useRouter()
const route = useRoute()

// State
const training = ref<Training | null>(null)
const isLoadingTraining = ref(true)
const isSubmitting = ref(false)
const error = ref('')
const errors = ref<Record<string, string[]>>({})

// Form data
const form = ref({
  civility: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  birth_date: '',
  address: '',
  education_level: '',
  experience_years: '',
  motivation: ''
})

const attachmentFiles = ref<File[]>([])

// Form ref
const formRef = ref()

// Options
const civilityOptions = [
  { title: 'Monsieur', value: 'M' },
  { title: 'Madame', value: 'F' },
  { title: 'Mademoiselle', value: 'Mlle' }
]

const educationLevelOptions = [
  { "title": "Sans diplôme", "value": "no_diploma" },
  { "title": "Certificat d'alphabétisation", "value": "literacy_certificate" },
  { "title": "Certificat d'études primaires (CEP)", "value": "cep" },

  { "title": "BEPC", "value": "bepc" },
  { "title": "CAP", "value": "cap" },
  { "title": "BEP", "value": "bep" },
  { "title": "BAC Général", "value": "bac_general" },
  { "title": "BAC Technique / Professionnel", "value": "bac_tech" },
  { "title": "GCE O-Level", "value": "gce_o_level" },
  { "title": "GCE A-Level", "value": "gce_a_level" },

  { "title": "BTS", "value": "bts" },
  { "title": "DUT", "value": "dut" },
  { "title": "DEUG", "value": "deug" },
  { "title": "Licence", "value": "licence" },
  { "title": "Licence Professionnelle", "value": "licence_pro" },

  { "title": "Maîtrise (ancien système)", "value": "maitrise" },
  { "title": "Master 1", "value": "master_1" },
  { "title": "Master 2", "value": "master_2" },
  { "title": "MBA", "value": "mba" },
  { "title": "Diplôme d’ingénieur", "value": "ingenieur" },

  { "title": "Doctorat", "value": "doctorat" },
  { "title": "HDR (Habilitation à Diriger des Recherches)", "value": "hdr" },
  { "title": "Post-doctorat", "value": "post_doc" },

  { "title": "Diplôme d’État (santé, social, etc.)", "value": "diplome_etat" },
  { "title": "Certificat Professionnel", "value": "certificat_pro" },
  { "title": "Certificat International (Cisco, Microsoft, etc.)", "value": "certificat_international" }
]


const experienceOptions = [
  { title: 'Débutant (0-1 an)', value: '0-1' },
  { title: 'Junior (1-3 ans)', value: '1-3' },
  { title: 'Intermédiaire (3-5 ans)', value: '3-5' },
  { title: 'Senior (5-10 ans)', value: '5-10' },
  { title: 'Expert (10+ ans)', value: '10+' }
]

// Computed
const isFormValid = computed(() => {
  return form.value.first_name && 
         form.value.last_name && 
         form.value.email && 
         form.value.phone && 
         form.value.motivation
})

// Validation rules
const rules = {
  first_name: [(v: string) => !!v || 'Le prénom est requis'],
  last_name: [(v: string) => !!v || 'Le nom est requis'],
  email: [
    (v: string) => !!v || 'L\'email est requis',
    (v: string) => /.+@.+\..+/.test(v) || 'Email invalide'
  ],
  phone: [(v: string) => !!v || 'Le téléphone est requis'],
  motivation: [(v: string) => !!v || 'La lettre de motivation est requise']
}

// Field errors
const fieldErrors = computed(() => {
  const fieldErrors: Record<string, string> = {}
  Object.keys(errors.value).forEach(field => {
    if (errors.value[field] && errors.value[field].length > 0) {
      fieldErrors[field] = errors.value[field][0]
    }
  })
  return fieldErrors
})

// Methods
const loadTraining = async () => {
  try {
    isLoadingTraining.value = true
    const trainingId = route.params.trainingId as string
    
    console.log('Training ID from route:', trainingId, 'Type:', typeof trainingId)
    console.log('All route params:', route.params)
    console.log('Route path:', route.path)
    console.log('Route name:', route.name)
    
    if (!trainingId || trainingId === 'undefined') {
      console.error('Training ID is invalid:', trainingId)
      error.value = 'ID de formation manquant ou invalide'
      return
    }
    
    console.log('About to call API with training ID:', trainingId)
    const response = await trainingService.getTraining(trainingId)
    training.value = response.data
  } catch (err: any) {
    console.error('Erreur lors du chargement de la formation:', err)
    error.value = 'Erreur lors du chargement de la formation'
  } finally {
    isLoadingTraining.value = false
  }
}

const handleSubmit = async () => {
  const { valid } = await formRef.value?.validate()

  if (!valid) return
  if (!training.value) {
    error.value = 'Aucune formation sélectionnée'
    return
  }

  // Clear backend errors
  errors.value = {}

  // Préparer les pièces jointes
  const attachments = attachmentFiles.value.map(file => ({
    name: file.name,
    file
  }))

  // Préparer les données de candidature
  const applicationData = {
    training_id: training.value.id,
    ...form.value,
    attachments
  }

  try {
    isSubmitting.value = true
    // TODO: Implémenter l'appel API pour créer la candidature
    // await trainingApplicationService.createTrainingApplication(applicationData)
    
    showToast({ message: 'Candidature soumise avec succès', type: 'success' })
    
    // Rediriger vers une page de confirmation
    router.push({
      name: 'training-application-success',
      query: { trainingId: training.value.id }
    })
  } catch (err: any) {
    console.error('Erreur lors de la soumission:', err)
    
    // Gérer les erreurs de validation backend
    if (err.response?.data?.validation_errors) {
      errors.value = err.response.data.validation_errors
    } else {
      showToast({ message: 'Erreur lors de la soumission de la candidature', type: 'error' })
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleBack = () => {
  const trainingId = route.params.trainingId as string
  if (trainingId) {
    router.push({ name: 'training-trainings-detail', params: { id: trainingId } })
  } else {
    router.push({ name: 'training-trainings-index' })
  }
}

// Helper functions
const getSpecialtyName = (specialtyId: number) => {
  // TODO: Récupérer le nom de la spécialité depuis le store ou l'API
  return `Spécialité ${specialtyId}`
}

const getTrainingTypeLabel = (type: string) => {
  return type === TrainingTypeEnum.ON_SITE ? 'En présentiel' : 'À distance'
}

const getTrainingTypeColor = (type: string) => {
  return type === TrainingTypeEnum.ON_SITE ? 'success' : 'info'
}

const getDurationUnitLabel = (unit: string) => {
  const labels = {
    [DurationEnum.HOURS]: ' heure(s)',
    [DurationEnum.DAYS]: ' jour(s)',
    [DurationEnum.MONTHS]: ' mois',
    [DurationEnum.YEARS]: ' année(s)'
  }
  return labels[unit as DurationEnum] || unit
}

const formatDuration = (duration: number, unit: string) => {
  const unitLabel = getDurationUnitLabel(unit)
  return `${duration}${unitLabel}`
}

// Lifecycle
onMounted(() => {
  console.log('Route params:', route.params)
  console.log('Route query:', route.query)
  loadTraining()
})
</script>

<style scoped>
.training-application-create-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.sticky-card {
  position: sticky;
  top: 24px;
}
</style>
