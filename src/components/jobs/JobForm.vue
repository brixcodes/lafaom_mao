<template>
  <VCard>
    <VCardText>
      <!-- Stepper Content -->
      <VWindow v-model="currentStep" class="disable-tab-transition">
        <!-- Étape 1: Informations générales -->
        <VWindowItem :value="0">
          <VForm ref="refStep1Form" @submit.prevent="validateStep1">
            <VRow class="pa-3">
              <!-- Référence -->
              <VCol cols="12" md="12">
                <VTextField v-model="form.reference" prepend-inner-icon="ri-hashtag" label="Référence"
                  variant="outlined" :rules="rules.reference" :error-messages="errors.reference"
                  placeholder="EX: REF2024001" />
              </VCol>

              <!-- Titre -->
              <VCol cols="12" md="12">
                <VTextField v-model="form.title" prepend-inner-icon="ri-briefcase-line" label="Titre du poste"
                  variant="outlined" :rules="rules.title" :error-messages="errors.title"
                  placeholder="Ex: Développeur Full Stack" />
              </VCol>

              <!-- Localisation -->
              <VCol cols="12" md="6">
                <VTextField v-model="form.location" prepend-inner-icon="ri-map-pin-line" label="Localisation"
                  variant="outlined" :rules="rules.location" :error-messages="errors.location"
                  placeholder="Ex: Paris, Lyon..." />
              </VCol>

              <!-- Code postal -->
              <VCol cols="12" md="6">
                <VTextField v-model="form.postal_code" prepend-inner-icon="ri-map-2-line" label="Code postal"
                  variant="outlined" :rules="rules.postal_code" :error-messages="errors.postal_code"
                  placeholder="Ex: 75001" />
              </VCol>
              <VDivider class="mt-2 mb-2"></VDivider>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center">
                  <VBtn color="secondary" variant="outlined" disabled>
                    <VIcon icon="ri-arrow-left-line" start class="flip-in-rtl" />
                    Précédent
                  </VBtn>

                  <VBtn type="submit" color="primary">
                    Suivant
                    <VIcon icon="ri-arrow-right-line" end class="flip-in-rtl" />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <!-- Étape 2: Détails du contrat -->
        <VWindowItem :value="1">
          <VForm ref="refStep2Form" @submit.prevent="validateStep2">
            <VRow class="pa-3">
              <!-- Type de contrat -->
              <VCol cols="12" md="6">
                <VSelect v-model="form.contract_type" :items="contractTypes" prepend-inner-icon="ri-file-list-line"
                  label="Type de contrat" variant="outlined" :rules="rules.contract_type"
                  :error-messages="errors.contract_type" placeholder="Sélectionnez le type" />
              </VCol>

              <!-- Heures de travail -->
              <VCol cols="12" md="6">
                <VTextField v-model.number="form.weekly_hours" prepend-inner-icon="ri-time-line"
                  label="Heures hebdomadaires" variant="outlined" type="number" min="1" max="60"
                  :error-messages="errors.weekly_hours" placeholder="35" />
              </VCol>

              <!-- Contrat à terme incertain -->
              <VCol cols="12" md="3">
                <div class="d-flex align-center h-100">
                  <VCheckbox v-model="form.uncertain_term" label="Contrat à terme incertain." color="primary" />
                </div>
              </VCol>

              <!-- Permis de conduire -->
              <VCol cols="12" md="3">
                <div class="d-flex align-center h-100">
                  <VCheckbox v-model="form.driving_license_required" label="Permis de conduire B requis."
                    color="primary" />
                </div>
              </VCol>

              <!-- Date de début -->
              <VCol cols="12" md="6">
                <VTextField v-model="form.start_date" prepend-inner-icon="ri-calendar-event-line"
                  label="Date de début souhaitée" variant="outlined" type="date" :error-messages="errors.start_date" />
              </VCol>

              <!-- Date de fin -->
              <VCol cols="12" md="6">
                <VTextField v-model="form.end_date" prepend-inner-icon="ri-calendar-check-line"
                  label="Date de fin du contrat" variant="outlined" type="date" :error-messages="errors.end_date" />
              </VCol>

              <!-- Date limite de candidature -->
              <VCol cols="12" md="6">
                <VTextField v-model="form.submission_deadline" prepend-inner-icon="ri-calendar-todo-line"
                  label="Date limite de candidature" variant="outlined" type="date" :rules="rules.submission_deadline"
                  :error-messages="errors.submission_deadline" :min="tomorrow" />
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                  <VBtn color="secondary" variant="tonal" @click="currentStep--">
                    <VIcon icon="ri-arrow-left-line" start class="flip-in-rtl" />
                    Précédent
                  </VBtn>

                  <VBtn type="submit" color="primary">
                    Suivant
                    <VIcon icon="ri-arrow-right-line" end class="flip-in-rtl" />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <!-- Étape 3: Mission principale -->
        <VWindowItem :value="2">
          <VForm ref="refStep3Form" @submit.prevent="validateStep3">
            <VRow class="pa-3">
              <VCol cols="12">
                <div class="text-center mb-4">
                  <VIcon size="48" color="primary" class="mb-3">ri-target-line</VIcon>
                  <h3 class="text-h5 mb-2">Mission Principale</h3>
                  <p class="text-body-2 text-medium-emphasis">Décrivez la mission principale de ce poste</p>
                </div>
                
                <QuillEditor 
                  key="main-mission-editor" 
                  editor-id="main-mission-editor" 
                  v-model="form.main_mission"
                  theme="snow" 
                  placeholder="Décrivez la mission principale de ce poste..." 
                  min-height="200px"
                  class="quill-editor-custom"
                />
                <div v-if="errors.main_mission" class="v-messages v-messages--active mt-2">
                  <div class="v-messages__message text-error">{{ errors.main_mission }}</div>
                </div>
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                  <VBtn color="secondary" variant="tonal" @click="currentStep--">
                    <VIcon icon="ri-arrow-left-line" start class="flip-in-rtl" />
                    Précédent
                  </VBtn>

                  <VBtn type="submit" color="primary">
                    Suivant
                    <VIcon icon="ri-arrow-right-line" end class="flip-in-rtl" />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <!-- Étape 4: Responsabilités (Facultatif) -->
        <VWindowItem :value="3">
          <VForm ref="refStep4Form" @submit.prevent="validateStep4">
            <VRow class="pa-3">
              <VCol cols="12">
                <div class="text-center mb-4">
                  <VIcon size="48" color="primary" class="mb-3">ri-task-line</VIcon>
                  <h3 class="text-h5 mb-2">Responsabilités</h3>
                  <p class="text-body-2 text-medium-emphasis">Listez les principales responsabilités du poste (optionnel)</p>
                </div>
                
                <QuillEditor 
                  key="responsibilities-editor" 
                  editor-id="responsibilities-editor"
                  v-model="form.responsibilities" 
                  theme="snow" 
                  placeholder="Listez les principales responsabilités (optionnel)..."
                  min-height="200px"
                  class="quill-editor-custom"
                />
                <div v-if="errors.responsibilities" class="v-messages v-messages--active mt-2">
                  <div class="v-messages__message text-error">{{ errors.responsibilities }}</div>
                </div>
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                  <VBtn color="secondary" variant="tonal" @click="currentStep--">
                    <VIcon icon="ri-arrow-left-line" start class="flip-in-rtl" />
                    Précédent
                  </VBtn>

                  <VBtn type="submit" color="primary">
                    Suivant
                    <VIcon icon="ri-arrow-right-line" end class="flip-in-rtl" />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <!-- Étape 5: Compétences -->
        <VWindowItem :value="4">
          <VForm ref="refStep5Form" @submit.prevent="validateStep5">
            <VRow class="pa-3">
              <VCol cols="12">
                <div class="text-center mb-4">
                  <VIcon size="48" color="primary" class="mb-3">ri-award-line</VIcon>
                  <h3 class="text-h5 mb-2">Compétences Requises</h3>
                  <p class="text-body-2 text-medium-emphasis">Décrivez les compétences nécessaires pour ce poste</p>
                </div>
                
                <QuillEditor 
                  key="competencies-editor" 
                  editor-id="competencies-editor" 
                  v-model="form.competencies"
                  theme="snow" 
                  placeholder="Décrivez les compétences nécessaires..." 
                  min-height="200px"
                  class="quill-editor-custom"
                />
                <div v-if="errors.competencies" class="v-messages v-messages--active mt-2">
                  <div class="v-messages__message text-error">{{ errors.competencies }}</div>
                </div>
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                  <VBtn color="secondary" variant="tonal" @click="currentStep--">
                    <VIcon icon="ri-arrow-left-line" start class="flip-in-rtl" />
                    Précédent
                  </VBtn>

                  <VBtn type="submit" color="primary">
                    Suivant
                    <VIcon icon="ri-arrow-right-line" end class="flip-in-rtl" />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <!-- Étape 6: Profil recherché -->
        <VWindowItem :value="5">
          <VForm ref="refStep6Form" @submit.prevent="validateStep6">
            <VRow class="pa-3">
              <VCol cols="12">
                <div class="text-center mb-4">
                  <VIcon size="48" color="primary" class="mb-3">ri-user-search-line</VIcon>
                  <h3 class="text-h5 mb-2">Profil Recherché</h3>
                  <p class="text-body-2 text-medium-emphasis">Décrivez le profil idéal du candidat</p>
                </div>
                
                <QuillEditor 
                  key="profile-editor" 
                  editor-id="profile-editor" 
                  v-model="form.profile" 
                  theme="snow"
                  placeholder="Décrivez le profil idéal du candidat..." 
                  min-height="200px"
                  class="quill-editor-custom"
                />
                <div v-if="errors.profile" class="v-messages v-messages--active mt-2">
                  <div class="v-messages__message text-error">{{ errors.profile }}</div>
                </div>
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                  <VBtn color="secondary" variant="tonal" @click="currentStep--">
                    <VIcon icon="ri-arrow-left-line" start class="flip-in-rtl" />
                    Précédent
                  </VBtn>

                  <VBtn type="submit" color="primary">
                    Suivant
                    <VIcon icon="ri-arrow-right-line" end class="flip-in-rtl" />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <!-- Étape 7: Conditions de travail -->
        <VWindowItem :value="6">
          <VForm ref="refStep7Form" @submit.prevent="validateStep7">
            <VRow class="pa-3">
              <VCol cols="12">
                <div class="text-center mb-4">
                  <VIcon size="48" color="primary" class="mb-3">ri-settings-3-line</VIcon>
                  <h3 class="text-h5 mb-2">Conditions de Travail</h3>
                  <p class="text-body-2 text-medium-emphasis">Précisez les conditions de travail (optionnel)</p>
                </div>
                
                <QuillEditor 
                  key="conditions-editor" 
                  editor-id="conditions-editor" 
                  v-model="form.conditions"
                  theme="snow" 
                  placeholder="Précisez les conditions de travail..." 
                  min-height="200px"
                  class="quill-editor-custom"
                />
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                  <VBtn color="secondary" variant="tonal" @click="currentStep--">
                    <VIcon icon="ri-arrow-left-line" start class="flip-in-rtl" />
                    Précédent
                  </VBtn>

                  <VBtn type="submit" color="primary">
                    Suivant
                    <VIcon icon="ri-arrow-right-line" end class="flip-in-rtl" />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <!-- Étape 8: Rémunération et avantages -->
        <VWindowItem :value="7">
          <VForm ref="refStep8Form" @submit.prevent="validateStep8">
            <VRow class="pa-3">
              <!-- Salaire -->
              <VCol cols="12" md="4">
                <VTextField v-model.number="form.salary" prepend-inner-icon="ri-money-euro-circle-line"
                  label="Salaire (brut mensuel)" variant="outlined" type="number" min="0" :rules="rules.salary"
                  :error-messages="errors.salary" placeholder="3500" required />
              </VCol>

              <!-- Devise -->
              <VCol cols="12" md="4">
                <VSelect v-model="form.currency" :items="currencies" prepend-inner-icon="ri-exchange-line"
                  label="Devise" variant="outlined" :rules="rules.currency" :error-messages="errors.currency" />
              </VCol>

              <!-- Frais de candidature -->
              <VCol cols="12" md="4">
                <VTextField v-model.number="form.submission_fee" prepend-inner-icon="ri-coins-line"
                  label="Frais de candidature" variant="outlined" type="number" min="0" :rules="rules.submission_fee"
                  :error-messages="errors.submission_fee" placeholder="0" />
              </VCol>

              <!-- Avantages -->
              <VCol cols="12">
                <div class="text-center mb-4">
                  <VIcon size="48" color="primary" class="mb-3">ri-gift-line</VIcon>
                  <h3 class="text-h5 mb-2">Avantages</h3>
                  <p class="text-body-2 text-medium-emphasis">Décrivez les avantages offerts (optionnel)</p>
                </div>
                
                <QuillEditor 
                  key="benefits-editor" 
                  editor-id="benefits-editor" 
                  v-model="form.benefits" 
                  theme="snow"
                  placeholder="Décrivez les avantages offerts (mutuelle, tickets restaurant, formations...)"
                  min-height="150px"
                  class="quill-editor-custom"
                />
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                  <VBtn color="secondary" variant="tonal" @click="currentStep--">
                    <VIcon icon="ri-arrow-left-line" start class="flip-in-rtl" />
                    Précédent
                  </VBtn>

                  <VBtn type="submit" color="primary">
                    Suivant
                    <VIcon icon="ri-arrow-right-line" end class="flip-in-rtl" />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <!-- Étape 9: Documents requis -->
        <VWindowItem :value="8">
          <VForm ref="refStep9Form" @submit.prevent="validateStep9">
            <VRow class="pa-3">
              <VCol cols="12">
                <div class="text-center mb-4">
                  <VIcon size="48" color="primary" class="mb-3">ri-file-list-3-line</VIcon>
                  <h3 class="text-h5 mb-2">Documents Requis</h3>
                  <p class="text-body-2 text-medium-emphasis">Sélectionnez les types de documents à fournir</p>
                </div>
                
                <VAutocomplete v-model="form.attachment" :items="documentTypes" prepend-inner-icon="ri-file-list-3-line"
                  label="Documents à fournir" variant="outlined" multiple chips closable-chips
                  :error-messages="errors.attachment" clearable placeholder="Sélectionnez les types de documents" />
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                  <VBtn color="secondary" variant="tonal" @click="currentStep--">
                    <VIcon icon="ri-arrow-left-line" start class="flip-in-rtl" />
                    Précédent
                  </VBtn>

                  <VBtn type="submit" color="success" :loading="loading">
                    <VIcon icon="ri-save-line" start />
                    {{ isEditing ? 'Modifier l\'offre' : 'Enregistrer l\'offre' }}
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { JobOfferCreateInput, JobOfferUpdateInput, JobOfferOut } from '@/types/jobOffers'
import { CONTRACT_TYPES, CURRENCIES, DOCUMENT_TYPES } from '@/types/jobOffers'
import QuillEditor from '@/components/common/QuillEditor.vue'
import { confirmAction } from '@/utils/confirm'
// Nous utilisons un stepper de base, nous pouvons remplacer AppStepper par VStepper si nécessaire

// Props
interface Props {
  jobOffer?: JobOfferOut | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  jobOffer: null,
  loading: false,
})

// Emits
const emit = defineEmits<{
  submit: [data: JobOfferCreateInput | JobOfferUpdateInput]
  cancel: []
}>()

// Stepper items
const stepperItems = [
  {
    title: 'Informations générales',
    subtitle: 'Données de base'
  },
  {
    title: 'Détails du contrat',
    subtitle: 'Conditions contractuelles'
  },
  {
    title: 'Descriptions',
    subtitle: 'Mission et profil'
  },
  {
    title: 'Rémunération',
    subtitle: 'Salaire et avantages'
  },
  {
    title: 'Documents',
    subtitle: 'Pièces requises'
  }
]

// Refs for forms
const refStep1Form = ref()
const refStep2Form = ref()
const refStep3Form = ref()
const refStep4Form = ref()
const refStep5Form = ref()
const refStep6Form = ref()
const refStep7Form = ref()
const refStep8Form = ref()
const refStep9Form = ref()

// State
const currentStep = ref(0)
const isCurrentStepValid = ref(true)

// Computed
const isEditing = computed(() => !!props.jobOffer)

const tomorrow = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().split('T')[0]
})

// Form data
const form = ref<JobOfferCreateInput>({
  reference: '',
  title: '',
  location: '',
  postal_code: '',
  contract_type: '',
  uncertain_term: false,
  start_date: '',
  end_date: '',
  deadline: '',
  weekly_hours: undefined,
  driving_license_required: false,
  submission_deadline: '',
  main_mission: '',
  responsibilities: '',
  competencies: '',
  profile: '',
  salary: undefined,
  benefits: '',
  submission_fee: 0,
  currency: 'EUR',
  attachment: [],
  conditions: ''
})

// Form errors
const errors = ref<Record<string, string>>({})

// Options
const contractTypes = CONTRACT_TYPES.map(type => ({
  title: type.text,
  value: type.value
}))

const currencies = CURRENCIES.map(currency => ({
  title: currency.text,
  value: currency.value
}))

const documentTypes = DOCUMENT_TYPES.map(type => ({
  title: type.text,
  value: type.value
}))

// Validation rules
const rules = {
  reference: [
    (v: string) => !!v || 'La référence est obligatoire',
    (v: string) => (v && v.length >= 2) || 'La référence doit contenir au moins 2 caractères',
  ],
  title: [
    (v: string) => !!v || 'Le titre est obligatoire',
    (v: string) => (v && v.length >= 5) || 'Le titre doit contenir au moins 5 caractères',
  ],
  location: [
    (v: string) => !!v || 'La localisation est obligatoire',
  ],
  postal_code: [
    (v: string) => !!v || 'Le code postal est obligatoire',
    (v: string) => (v && /^\d{3}$/.test(v)) || 'Le code postal doit contenir 3 chiffres',
  ],
  contract_type: [
    (v: string) => !!v || 'Le type de contrat est obligatoire',
  ],
  submission_deadline: [
    (v: string) => !!v || 'La date limite est obligatoire',
    (v: string) => {
      if (!v) return true
      const date = new Date(v)
      const today = new Date()
      return date > today || 'La date limite doit être dans le futur'
    },
  ],
  submission_fee: [
    (v: number) => v >= 0 || 'Les frais ne peuvent pas être négatifs',
  ],
  currency: [
    (v: string) => !!v || 'La devise est obligatoire',
  ],
  main_mission: [
    (v: string) => !!v || 'La mission principale est obligatoire',
    (v: string) => (v && v.length >= 10) || 'La mission doit contenir au moins 10 caractères',
  ],
  salary: [
    (v: number) => v !== undefined && v !== null && v > 0 || 'Le salaire est obligatoire et doit être supérieur à 0',
  ],
}

// Step validation methods
const validateStep1 = () => {
  refStep1Form.value?.validate().then((valid: any) => {
    if (valid.valid) {
      currentStep.value++
      isCurrentStepValid.value = true
    } else {
      isCurrentStepValid.value = false
    }
  })
}

const validateStep2 = () => {
  refStep2Form.value?.validate().then((valid: any) => {
    if (valid.valid) {
      currentStep.value++
      isCurrentStepValid.value = true
    } else {
      isCurrentStepValid.value = false
    }
  })
}

const validateStep3 = () => {
  // Validation pour la mission principale
  const isValid = validateMainMission()
  if (isValid) {
    currentStep.value++
    isCurrentStepValid.value = true
  } else {
    isCurrentStepValid.value = false
  }
}

const validateStep4 = () => {
  // Validation pour les responsabilités (facultatif) - toujours valide
  currentStep.value++
  isCurrentStepValid.value = true
}

const validateStep5 = () => {
  // Validation pour les compétences (ancienne étape 5)
  const isValid = validateCompetencies()
  if (isValid) {
    currentStep.value++
    isCurrentStepValid.value = true
  } else {
    isCurrentStepValid.value = false
  }
}

const validateStep6 = () => {
  // Validation pour le profil recherché (ancienne étape 6)
  const isValid = validateProfile()
  if (isValid) {
    currentStep.value++
    isCurrentStepValid.value = true
  } else {
    isCurrentStepValid.value = false
  }
}

const validateStep7 = () => {
  // Conditions de travail (optionnel) - toujours valide (ancienne étape 7)
  currentStep.value++
  isCurrentStepValid.value = true
}

const validateStep8 = () => {
  // Validation pour la rémunération (ancienne étape 8)
  const isValid = validateSalary()
  if (isValid) {
    currentStep.value++
    isCurrentStepValid.value = true
  } else {
    isCurrentStepValid.value = false
  }
}

const validateStep9 = async () => {
  // Validation finale
  const isValid = await validateAllForms()
  if (isValid) {
    await handleFinalSubmit()
  }
}

// Helper function to clean HTML content
const cleanHtmlContent = (htmlContent: string): string => {
  return htmlContent
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
    .replace(/&amp;/g, '&') // Replace encoded ampersands
    .replace(/</g, '<') // Replace encoded less than
    .replace(/&gt;/g, '>') // Replace encoded greater than
    .replace(/&quot;/g, '"') // Replace encoded quotes
    .replace(/&#39;/g, "'") // Replace encoded apostrophes
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
}

// Individual validation functions
const validateMainMission = () => {
  delete errors.value.main_mission
  const mainMissionText = cleanHtmlContent(form.value.main_mission || '')
  
  if (!mainMissionText || mainMissionText.length < 10) {
    errors.value.main_mission = `La mission principale est obligatoire (min. 10 caractères de texte).`
    return false
  }
  return true
}

const validateResponsibilities = () => {
  delete errors.value.responsibilities
  const responsibilitiesText = cleanHtmlContent(form.value.responsibilities || '')
  
  // Responsabilités facultatives - toujours valide
  return true
}

const validateCompetencies = () => {
  delete errors.value.competencies
  const competenciesText = cleanHtmlContent(form.value.competencies || '')
  
  if (!competenciesText || competenciesText.length < 5) {
    errors.value.competencies = `Les compétences sont obligatoires (min. 5 caractères de texte).`
    return false
  }
  return true
}

const validateProfile = () => {
  delete errors.value.profile
  const profileText = cleanHtmlContent(form.value.profile || '')
  
  if (!profileText || profileText.length < 5) {
    errors.value.profile = `Le profil recherché est obligatoire (min. 5 caractères de texte).`
    return false
  }
  return true
}

const validateSalary = () => {
  delete errors.value.salary
  
  if (!form.value.salary || form.value.salary <= 0) {
    errors.value.salary = 'Le salaire est obligatoire et doit être supérieur à 0.'
    return false
  }
  return true
}

// Helper function to check if QuillEditor content is valid
const hasValidContent = (htmlContent: string, minLength: number = 0): boolean => {
  if (!htmlContent) return minLength === 0

  // Use the same robust HTML cleaning as validateStep3Fields
  const textContent = htmlContent
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
    .replace(/&amp;/g, '&') // Replace encoded ampersands
    .replace(/</g, '<') // Replace encoded less than
    .replace(/&gt;/g, '>') // Replace encoded greater than
    .replace(/&quot;/g, '"') // Replace encoded quotes
    .replace(/&#39;/g, "'") // Replace encoded apostrophes
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()

  return textContent.length >= minLength
}

// Note: Nous utilisons maintenant v-model directement sur les QuillEditor
// Les mises à jour sont automatiques grâce au two-way binding

// Debug function to check QuillEditor content
const debugQuillContent = () => {
  console.log('=== DEBUG QUILL CONTENT ===')
  console.log('Main mission:', form.value.main_mission)
  console.log('Responsibilities:', form.value.responsibilities)
  console.log('Competencies:', form.value.competencies)
  console.log('Profile:', form.value.profile)
  console.log('Conditions:', form.value.conditions)
  console.log('Benefits:', form.value.benefits)
  console.log('==========================')

  // Show alert with summary
  alert(`Contenu des éditeurs:

✅ CHAMPS OBLIGATOIRES:
Mission principale: ${hasValidContent(form.value.main_mission || '', 10) ? 'OK (✓)' : 'Vide ou trop court (✗)'}
Responsabilités: ${hasValidContent(form.value.responsibilities || '', 5) ? 'OK (✓)' : 'Vide ou trop court (✗)'}
Compétences: ${hasValidContent(form.value.competencies || '', 5) ? 'OK (✓)' : 'Vide ou trop court (✗)'}
Profil recherché: ${hasValidContent(form.value.profile || '', 5) ? 'OK (✓)' : 'Vide ou trop court (✗)'}

🔷 CHAMPS OPTIONNELS:
Conditions: ${hasValidContent(form.value.conditions || '') ? 'OK (✓)' : 'Vide'}
Avantages: ${hasValidContent(form.value.benefits || '') ? 'OK (✓)' : 'Vide'}`)
}

const validateAllForms = async () => {
  const step1Valid = await refStep1Form.value?.validate()
  const step2Valid = await refStep2Form.value?.validate()
  const step3Valid = validateMainMission()
  const step4Valid = true // Responsabilités facultatives
  const step5Valid = validateCompetencies()
  const step6Valid = validateProfile()
  const step7Valid = true // Conditions optionnelles
  const step8Valid = validateSalary()
  const step9Valid = await refStep9Form.value?.validate()

  return step1Valid?.valid && step2Valid?.valid && step3Valid && step4Valid && step5Valid && step6Valid && step7Valid && step8Valid && step9Valid?.valid
}

const handleFinalSubmit = async () => {
  // Confirmation avant enregistrement
  const confirmed = await confirmAction({
    title: 'Êtes-vous sûr ?',
    text: isEditing.value
      ? "Souhaitez-vous réellement modifier cette offre d'emploi ?"
      : "Souhaitez-vous réellement enregistrer cette offre d'emploi ?",
    confirmButtonText: `<span style="color:white">${isEditing.value ? 'Modifier' : 'Enregistrer'}</span>`,
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })

  if (!confirmed) {
    return
  }

  // Clear backend errors
  errors.value = {}

  // Debug: Log form content before submitting
  console.log('Form data before submit:', {
    main_mission: form.value.main_mission,
    responsibilities: form.value.responsibilities,
    competencies: form.value.competencies,
    profile: form.value.profile,
    benefits: form.value.benefits,
    conditions: form.value.conditions
  })

  // Prepare form data
  const formData = { ...form.value }

  // Clean empty values but keep QuillEditor content
  Object.keys(formData).forEach(key => {
    const value = formData[key as keyof typeof formData]
    if (value === '' || value === null || value === undefined) {
      // Don't delete QuillEditor fields, even if empty
      const quillFields = ['main_mission', 'responsibilities', 'competencies', 'profile', 'benefits', 'conditions']
      if (!quillFields.includes(key)) {
        delete formData[key as keyof typeof formData]
      }
    }
  })

  emit('submit', formData)
}

const resetForm = () => {
  form.value = {
    reference: '',
    title: '',
    location: '',
    postal_code: '',
    contract_type: '',
    uncertain_term: false,
    start_date: '',
    end_date: '',
    deadline: '',
    weekly_hours: undefined,
    driving_license_required: false,
    submission_deadline: '',
    main_mission: '',
    responsibilities: '',
    competencies: '',
    profile: '',
    salary: undefined,
    benefits: '',
    submission_fee: 0,
    currency: 'EUR',
    attachment: [],
    conditions: ''
  }
  errors.value = {}
  currentStep.value = 0
  isCurrentStepValid.value = true

  // Reset all form validations
  refStep1Form.value?.resetValidation()
  refStep2Form.value?.resetValidation()
  refStep3Form.value?.resetValidation()
  refStep4Form.value?.resetValidation()
  refStep5Form.value?.resetValidation()
  refStep6Form.value?.resetValidation()
  refStep7Form.value?.resetValidation()
  refStep8Form.value?.resetValidation()
  refStep9Form.value?.resetValidation()
}

const populateForm = (jobOffer: JobOfferOut) => {
  form.value = {
    reference: jobOffer.reference || '',
    title: jobOffer.title || '',
    location: jobOffer.location || '',
    postal_code: jobOffer.postal_code || '',
    contract_type: jobOffer.contract_type || '',
    uncertain_term: jobOffer.uncertain_term || false,
    start_date: jobOffer.start_date ? jobOffer.start_date.split('T')[0] : '',
    end_date: jobOffer.end_date ? jobOffer.end_date.split('T')[0] : '',
    deadline: jobOffer.deadline ? jobOffer.deadline.split('T')[0] : '',
    weekly_hours: jobOffer.weekly_hours,
    driving_license_required: jobOffer.driving_license_required || false,
    submission_deadline: jobOffer.submission_deadline ? jobOffer.submission_deadline.split('T')[0] : '',
    main_mission: jobOffer.main_mission || '',
    responsibilities: jobOffer.responsibilities || '',
    competencies: jobOffer.competencies || '',
    profile: jobOffer.profile || '',
    salary: jobOffer.salary,
    benefits: jobOffer.benefits || '',
    submission_fee: jobOffer.submission_fee || 0,
    currency: jobOffer.currency || 'EUR',
    attachment: jobOffer.attachment || [],
    conditions: jobOffer.conditions || ''
  }
}

// Handle backend errors
const handleBackendErrors = (backendErrors: Record<string, string>) => {
  errors.value = backendErrors
}

// Watch for QuillEditor changes to ensure they're captured
watch(() => form.value.main_mission, (newValue) => {
  console.log('Main mission changed:', newValue)
})

watch(() => form.value.responsibilities, (newValue) => {
  console.log('Responsibilities changed:', newValue)
})

watch(() => form.value.competencies, (newValue) => {
  console.log('Competencies changed:', newValue)
})

watch(() => form.value.profile, (newValue) => {
  console.log('Profile changed:', newValue)
})

watch(() => form.value.benefits, (newValue) => {
  console.log('Benefits changed:', newValue)
})

watch(() => form.value.conditions, (newValue) => {
  console.log('Conditions changed:', newValue)
})

// Watch for prop changes
watch(() => props.jobOffer, (newJobOffer) => {
  if (newJobOffer) {
    populateForm(newJobOffer)
  } else {
    resetForm()
  }
}, { immediate: true })

// Expose methods
defineExpose({
  resetForm,
  populateForm,
  handleBackendErrors
})
</script>

<style scoped>
.gap-3 {
  gap: 12px;
}

/* Labels personnalisés pour les QuillEditor */
.v-label.v-field-label {
  font-size: 16px;
  font-weight: 400;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  margin-bottom: 8px;
  display: block;
}

/* Stepper customization */
:deep(.v-stepper-header) {
  box-shadow: none !important;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

:deep(.v-stepper-item) {
  padding: 1rem !important;
}

:deep(.v-stepper-item__icon) {
  background: rgba(var(--v-theme-primary), 0.1) !important;
}

:deep(.v-stepper-item--complete .v-stepper-item__icon) {
  background: rgb(var(--v-theme-success)) !important;
}

:deep(.v-stepper-item--selected .v-stepper-item__icon) {
  background: rgb(var(--v-theme-primary)) !important;
}

/* Styles pour QuillEditor */
.quill-editor-custom {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 4px;
  background-color: rgb(var(--v-theme-surface));
}

.quill-editor-custom :deep(.ql-toolbar) {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 4px 4px 0 0;
}

.quill-editor-custom :deep(.ql-container) {
  border: none;
  border-radius: 0 0 4px 4px;
  font-family: inherit;
}

.quill-editor-custom :deep(.ql-editor) {
  font-family: inherit;
  line-height: 1.5;
}

.quill-editor-custom :deep(.ql-editor.ql-blank::before) {
  font-style: normal;
  color: rgba(var(--v-theme-on-surface), 0.6);
}
</style>
