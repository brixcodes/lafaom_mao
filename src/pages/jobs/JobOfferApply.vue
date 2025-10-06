<template>
  <div class="job-offer-apply pa-6">
    <!-- En-tête -->
    <div class="d-flex align-center mb-6">
      <VBtn icon="ri-arrow-left-line" variant="text" @click="goBack" class="me-4" />

      <div class="flex-grow-1">
        <h1 class="text-h4 mb-2">
          <VIcon icon="ri-send-plane-line" class="me-3" color="primary" />
          Candidater à une offre
        </h1>
        <p v-if="jobOffersStore.currentJobOffer" class="text-body-1 text-medium-emphasis">
          {{ jobOffersStore.currentJobOffer.title }} - {{ jobOffersStore.currentJobOffer.reference }}
        </p>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="jobOffersStore.isLoading" class="text-center py-12">
      <VProgressCircular indeterminate size="60" width="6" color="primary" class="mb-4" />
      <p class="text-body-1 text-medium-emphasis">Chargement de l'offre d'emploi...</p>
    </div>

    <!-- Offre expirée -->
    <div v-else-if="jobOffersStore.currentJobOffer && isExpired" class="text-center py-12">
      <VIcon icon="ri-time-line" size="80" class="text-error mb-6" />
      <h3 class="text-h5 mb-4">Offre d'emploi expirée</h3>
      <p class="text-body-1 text-medium-emphasis mb-6">
        La date limite de candidature pour cette offre est dépassée.
      </p>
      <VBtn variant="outlined" prepend-icon="ri-arrow-left-line" @click="goBack">
        Retour à l'offre
      </VBtn>
    </div>

    <!-- Formulaire de candidature -->
    <div v-else-if="jobOffersStore.currentJobOffer">
      <VRow>
        <!-- Colonne principale - Formulaire -->
        <VCol cols="12" md="7">

          <VCard elevation="3">
            <VCardText class="pb-8">
              <!-- Alerte d'information pour les utilisateurs connectés -->
              <VAlert v-if="authStore.isAuthenticated" type="info" variant="tonal" class="mb-6"
                prepend-icon="ri-information-line">
                <template #title>Informations pré-remplies</template>
                Vos informations personnelles ont été automatiquement remplies. Vous pouvez les modifier si nécessaire.
              </VAlert>

              <!-- Alerte d'erreur de paiement -->
              <VAlert
                v-if="fileErrors.some(error => error.includes('Montant insuffisant'))"
                type="error"
                variant="tonal"
                class="mb-6"
                prepend-icon="ri-error-warning-line"
                closable
                @click:close="fileErrors = []"
              >
                <template #title>Erreur de paiement</template>
                Le montant des frais de candidature est trop faible. Le minimum requis est de 0,20 €.
              </VAlert>

              <VForm ref="formRef" @submit.prevent="handleSubmit">
                <!-- Informations personnelles -->
                <div class="mb-6">
                  <VRow class mb-3>
                    <!-- Civilité -->
                    <VCol cols="12" md="12">
                      <VSelect v-model="form.civility" :items="civilityOptions" prepend-inner-icon="ri-user-line"
                        label="Civilité" variant="outlined" />
                    </VCol>

                    <!-- Prénom -->
                    <VCol cols="12" md="6">
                      <VTextField v-model="form.first_name" prepend-inner-icon="ri-user-line" label="Prénom *"
                        variant="outlined" :rules="rules.first_name" :error-messages="fieldErrors.first_name"
                        required />
                    </VCol>

                    <!-- Nom -->
                    <VCol cols="12" md="6">
                      <VTextField v-model="form.last_name" prepend-inner-icon="ri-user-3-line" label="Nom de famille *"
                        variant="outlined" :rules="rules.last_name" :error-messages="fieldErrors.last_name" required />
                    </VCol>

                    <!-- Email -->
                    <VCol cols="12" md="6">
                      <VTextField v-model="form.email" prepend-inner-icon="ri-mail-line" label="Email *"
                        variant="outlined" type="email" :rules="rules.email" :error-messages="fieldErrors.email"
                        required />
                    </VCol>

                    <!-- Téléphone -->
                    <VCol cols="12" md="6">
                      <VTextField v-model="form.phone_number" prepend-inner-icon="ri-phone-line"
                        label="Numéro de téléphone *" variant="outlined" type="tel" :rules="rules.phone_number"
                        :error-messages="fieldErrors.phone_number" required />
                    </VCol>

                    <!-- Sélection pays -->
                    <VCol cols="12" md="6">
                      <CountryAutocomplete v-model="selectedCountry" label="Pays"
                        placeholder="Sélectionnez votre pays..." prepend-icon="ri-earth-line" variant="outlined"
                        @change="handleCountryChange" :error-messages="fieldErrors.country_code" />
                    </VCol>

                    <!-- Date de naissance -->
                    <VCol cols="12" md="6">
                      <VTextField v-model="form.date_of_birth" prepend-inner-icon="ri-calendar-line"
                        label="Date de naissance" variant="outlined" type="date" />
                    </VCol>
                  </VRow>
                </div>

                <!-- Documents requis -->
                <div class="mb-6" v-if="requiredDocuments.length > 0">
                  <h3 class="text-h6 mb-4 d-flex align-center">
                    <VIcon icon="ri-file-upload-line" class="me-2" color="primary" />
                    Documents requis
                    <VChip size="small" color="error" variant="tonal" class="ml-2">
                      Obligatoire
                    </VChip>
                  </h3>

                  <!-- Liste des documents requis -->
                  <VCard v-if="requiredDocuments.length > 0" variant="tonal" color="info" class="mb-4">
                    <VCardText class="py-3">
                      <div class="d-flex align-center">
                        <VIcon icon="ri-information-line" class="me-2" />
                        <span class="text-body-2">Documents à fournir :</span>
                      </div>
                      <div class="d-flex flex-wrap gap-2 mt-2">
                        <VChip v-for="doc in requiredDocuments" :key="doc" size="small" variant="outlined"
                          prepend-icon="ri-file-line">
                          {{ getDocumentLabel(doc) }}
                        </VChip>
                      </div>
                    </VCardText>
                  </VCard>

                  <!-- Upload de fichiers -->
                  <div class="file-upload-section">
                    <VRow>
                      <VCol v-for="(doc, index) in requiredDocuments" :key="doc" cols="12" md="6">
                        <VCard variant="outlined" class="file-upload-card">
                          <VCardText>
                            <div class="d-flex align-center justify-space-between mb-3">
                              <div class="d-flex align-center">
                                <VIcon icon="ri-file-line" class="me-2 text-primary" />
                                <span class="text-subtitle-2">{{ getDocumentLabel(doc) }}</span>
                                <VChip size="x-small" color="error" variant="text" class="ml-1">*</VChip>
                              </div>
                              <!-- Indicateur d'état upload -->
                              <VChip v-if="uploadedAttachments[doc]?.uploading" size="x-small" color="warning"
                                variant="tonal" prepend-icon="ri-loader-line">
                                Upload...
                              </VChip>
                              <VChip v-else-if="uploadedAttachments[doc]?.url" size="x-small" color="success"
                                variant="tonal" prepend-icon="ri-check-line">
                                Uploadé
                              </VChip>
                              <VChip v-else-if="getUploadedFile(doc)" size="x-small" color="info" variant="tonal"
                                prepend-icon="ri-file-line">
                                Sélectionné
                              </VChip>
                            </div>

                            <VFileInput :key="`file-${doc}-${index}`" v-model="fileInputs[doc]"
                              :label="`Choisir le fichier ${getDocumentLabel(doc)}`" variant="outlined" prepend-icon=""
                              prepend-inner-icon="ri-attachment-line" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              :rules="getFileRules(doc)" @update:model-value="(files) => handleFileChange(doc, files)"
                              clearable>
                              <template #selection="{ fileNames }">
                                <template v-for="fileName in fileNames" :key="fileName">
                                  <VChip size="small" color="primary" variant="tonal" prepend-icon="ri-file-line"
                                    class="me-2">
                                    {{ fileName }}
                                  </VChip>
                                </template>
                              </template>
                            </VFileInput>

                            <div class="text-caption text-medium-emphasis mt-1">
                              Formats acceptés: PDF, Word, JPEG, PNG (max 10MB)
                            </div>
                          </VCardText>
                        </VCard>
                      </VCol>
                    </VRow>

                  </div>
                </div>

                <!-- Erreurs de validation générales -->
                <div v-if="fileErrors.length > 0" class="mb-6">
                  <VAlert type="error" variant="tonal" prepend-icon="ri-error-warning-line">
                    <div class="text-subtitle-2 mb-2">Veuillez corriger les erreurs suivantes :</div>
                    <ul class="ml-4">
                      <li v-for="error in fileErrors" :key="error" class="text-body-2">
                        {{ error }}
                      </li>
                    </ul>
                  </VAlert>
                </div>

                <!-- Actions -->
                <div class="d-flex justify-end gap-3">
                  <VBtn color="error" @click="goBack">
                    Annuler
                  </VBtn>

                  <VBtn type="submit" variant="flat" color="primary" :loading="submitting">
                    Candidater
                  </VBtn>
                </div>
              </VForm>
            </VCardText>
          </VCard>
        </VCol>

          <!-- Colonne latérale - Récapitulatif -->
          <VCol cols="12" md="5">
            <!-- Détails de l'offre d'emploi -->
           

            <!-- Récapitulatif de l'offre -->
            <VCard elevation="2" class="mb-6">
              <VCardText>
              <div class="offer-summary">
                <h4 class="text-h6 mb-2">{{ jobOffersStore.currentJobOffer.title }}</h4>
                <p class="text-body-2 text-medium-emphasis mb-3">
                  Réf: {{ jobOffersStore.currentJobOffer.reference }}
                </p>

                <div class="summary-items">
                  <div>
                    <VIcon icon="ri-map-pin-line" color="primary" size="small" class="me-2" />
                    <span>{{ jobOffersStore.currentJobOffer.location }}</span>
                  </div>

                  <div>
                    <VIcon icon="ri-file-text-line" color="primary" size="small" class="me-2" />
                    <span>{{ contractTypeLabel }}</span>
                  </div>

                  <div>
                    <VIcon icon="ri-calendar-todo-line" color="primary" size="small" class="me-2" />
                    <span>Limite: {{ formatDate(jobOffersStore.currentJobOffer.submission_deadline) }}</span>
                  </div>

                  <div v-if="jobOffersStore.currentJobOffer.salary">
                    <VIcon icon="ri-money-euro-circle-line" color="primary" size="small" class="me-2" />
                    <span>{{ formatSalary(jobOffersStore.currentJobOffer.salary,
                      jobOffersStore.currentJobOffer.currency)
                    }}</span>
                  </div>
                </div>

                <!-- Frais de candidature -->
                <div v-if="jobOffersStore.currentJobOffer.submission_fee > 0" class="mt-4">
                  <VAlert type="warning" variant="tonal" density="compact" prepend-icon="ri-price-tag-3-line">
                    <div class="text-body-2">
                      <strong>Frais de candidature :</strong><br>
                      {{ formatSalary(jobOffersStore.currentJobOffer.submission_fee,
                        jobOffersStore.currentJobOffer.currency) }}
                    </div>
                  </VAlert>
                </div>

                <div v-else class="mt-4">
                  <VAlert type="success" variant="tonal" density="compact" prepend-icon="ri-gift-line">
                    <div class="text-body-2">
                      <strong>Candidature gratuite</strong>
                    </div>
                  </VAlert>
                </div>
              </div>
            </VCardText>
          </VCard>

          <!-- Conseils -->
          <VCard elevation="1" color="info" variant="tonal" class="mb-6">
            <VCardText>
              <h4 class="text-subtitle-1 mb-3 d-flex align-center">
                <VIcon icon="ri-lightbulb-line" class="me-2" />
                Conseils pour votre candidature
              </h4>

              <ul class="text-body-2 pl-4">
                <li class="mb-2">Vérifiez que tous vos documents sont à jour</li>
                <li class="mb-2">Assurez-vous que vos fichiers sont lisibles</li>
                <li class="mb-2">Respectez les formats demandés</li>
                <li class="mb-2">Relisez vos informations personnelles</li>
              </ul>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>

    <!-- Dialog de confirmation -->
    <VDialog v-model="confirmDialog" max-width="600" persistent>
      <VCard class="pa-3">

        <VCardText>
          <p class="text-body-1 mb-4 text-center">
            Êtes-vous sûr de vouloir envoyer votre candidature pour le poste de
            <strong>{{ jobOffersStore.currentJobOffer?.title }}</strong> ?
          </p>

          <div class="candidate-summary pa-3 bg-grey-lighten-4 rounded">
            <h4 class="text-subtitle-2 mb-2">Récapitulatif :</h4>
            <div class="text-body-2">
              <div><strong>Civilité :</strong> {{ form.civility }}</div>
              <div><strong>Nom :</strong> {{ form.first_name }} {{ form.last_name }}</div>
              <div><strong>Email :</strong> {{ form.email }}</div>
              <div><strong>Téléphone :</strong> {{ form.phone_number }}</div>
              <div><strong>Documents transmis :</strong> {{ uploadedFilesCount }} fichier(s)</div>
            </div>
          </div>
        </VCardText>

        <VCardActions class="justify-end">
          <VBtn variant="flat" color="error" @click="confirmDialog = false">Annuler</VBtn>
          <VBtn variant="flat" color="primary" :loading="submitting" @click="submitApplication">
            Soumettre
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Dialog de succès -->
    <VDialog v-model="successDialog" max-width="430" persistent>
      <VCard class="pa-3">
        <VCardText>
          <div class="text-center py-4">
            <VIcon icon="ri-checkbox-circle-line" size="100" color="success" class="mb-4" />
            <h3 class="text-h6 mb-4">
              Votre candidature est sur le point d'être envoyée.
            </h3>

            <!-- <div v-if="applicationNumber" class="mb-4">
              <VAlert type="info" variant="tonal" density="compact">
                <div class="text-body-2">
                  <strong>Numéro de candidature :</strong><br>
                  <code class="text-h6">{{ applicationNumber }}</code>
                </div>
              </VAlert>
              <p class="text-caption text-medium-emphasis mt-2">
                Conservez ce numéro pour suivre votre candidature
              </p>
            </div> -->

            <p class="text-body-2 text-medium-emphasis mb-4">
              plus qu'une étape payez les frais d'étude de dossier afin de garantir la validité de votre candidature!
            </p>
          </div>
          <VCardActions class="justify-center">
            <VBtn variant="flat" color="primary" @click="goBackToOffer">
              Finaliser
            </VBtn>
          </VCardActions>

        </VCardText>


      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobOffersStore } from '@/stores/jobOffers'
import { useAuthStore } from '@/stores/auth'
import type { JobApplicationCreateInput, JobAttachmentInput } from '@/types/jobOffers'
import { CONTRACT_TYPES, DOCUMENT_TYPES } from '@/types/jobOffers'
import { jobOffersService } from '@/services/api'
import CountryAutocomplete, { type Country } from '@/components/common/CountryAutocomplete.vue'
import { showToast } from '@/components/toast/toastManager'
import success from '@images/success.gif'

// Composables
const route = useRoute()
const router = useRouter()
const jobOffersStore = useJobOffersStore()
const authStore = useAuthStore()

// State
const formRef = ref<any>(null)
const submitting = ref(false)
const confirmDialog = ref(false)
const successDialog = ref(false)
const applicationNumber = ref('')
const paymentLink = ref('')
const fileErrors = ref<string[]>([])
const fieldErrors = ref<Record<string, string>>({})

const form = reactive<Omit<JobApplicationCreateInput, 'attachments'>>({
  job_offer_id: '',
  email: '',
  phone_number: '',
  first_name: '',
  last_name: '',
  civility: '',
  country_code: '',
  date_of_birth: ''
})

// Pays sélectionné via l'autocomplétion
const selectedCountry = ref<Country | null>(null)

const fileInputs = ref<Record<string, File[]>>({})

// Computed
const offerId = computed(() => route.params.id as string)

const isExpired = computed(() => {
  if (!jobOffersStore.currentJobOffer) return false
  const today = new Date()
  const deadline = new Date(jobOffersStore.currentJobOffer.submission_deadline)
  return deadline < today
})

const requiredDocuments = computed(() => {
  return jobOffersStore.currentJobOffer?.attachment || []
})

const contractTypeLabel = computed(() => {
  if (!jobOffersStore.currentJobOffer) return ''
  const contractType = CONTRACT_TYPES.find(type => type.value === jobOffersStore.currentJobOffer!.contract_type)
  return contractType?.text || jobOffersStore.currentJobOffer.contract_type
})

const uploadedFilesCount = computed(() => {
  return Object.keys(fileInputs.value).filter(key =>
    fileInputs.value[key] && fileInputs.value[key].length > 0
  ).length
})

const isFormValid = computed(() => {
  const hasRequiredFields = form.first_name && form.last_name && form.email && form.phone_number
  const hasAllFiles = requiredDocuments.value.every(doc =>
    fileInputs.value[doc] && fileInputs.value[doc].length > 0
  )
  return hasRequiredFields && hasAllFiles && fileErrors.value.length === 0
})

// Options
const civilityOptions = [
  { title: 'Monsieur', value: 'M.' },
  { title: 'Madame', value: 'Mme' },
  { title: 'Mademoiselle', value: 'Mlle' }
]

// Validation rules
const rules = {
  first_name: [
    (v: string) => !!v || 'Le prénom est obligatoire',
    (v: string) => (v && v.length >= 2) || 'Le prénom doit contenir au moins 2 caractères'
  ],
  last_name: [
    (v: string) => !!v || 'Le nom est obligatoire',
    (v: string) => (v && v.length >= 2) || 'Le nom doit contenir au moins 2 caractères'
  ],
  email: [
    (v: string) => !!v || 'L\'email est obligatoire',
    (v: string) => /.+@.+\..+/.test(v) || 'L\'email doit être valide'
  ],
  phone_number: [
    (v: string) => !!v || 'Le numéro de téléphone est obligatoire',
    (v: string) => (v && v.length >= 8) || 'Le numéro doit contenir au moins 8 chiffres'
  ]
}

// Methods
const handleCountryChange = (country: Country | null) => {
  selectedCountry.value = country
  // Mettre à jour le code pays dans le formulaire
  form.country_code = country ? country.code : ''

  console.log('🌍 Pays sélectionné:', {
    name: country?.name,
    code: country?.code,
    flag: country?.flag
  })

  // Effacer les erreurs de pays si présentes
  if (country && fieldErrors.value.country_code) {
    delete fieldErrors.value.country_code
  }
}

const loadJobOffer = async () => {
  try {
    await jobOffersStore.getJobOfferById(offerId.value)
    if (jobOffersStore.currentJobOffer) {
      form.job_offer_id = jobOffersStore.currentJobOffer.id
    }
  } catch (error) {
    console.error('Erreur lors du chargement de l\'offre:', error)
  }
}

const getDocumentLabel = (docType: string) => {
  const doc = DOCUMENT_TYPES.find(d => d.value === docType)
  return doc?.text || docType
}

const getUploadedFile = (docType: string) => {
  return fileInputs.value[docType]?.[0] || null
}

const getFileRules = (docType: string) => {
  return [
    (files: File[] | null | undefined) => {
      if (!files || files.length === 0) {
        return 'Ce document est requis'
      }

      // Validate the first file
      const file = files[0]
      if (!file) {
        return 'Fichier invalide'
      }

      // Check file size and type
      const errors = validateFile(file, docType)
      if (errors.length > 0) {
        return errors[0] // Return first error
      }

      return true
    }
  ]
}

// Store pour les URLs des fichiers uploadés
const uploadedAttachments = ref<Record<string, { url: string; uploading: boolean }>>({})

const handleFileChange = async (docType: string, input: File[] | File | null | undefined) => {
  console.log(`📎 HandleFileChange appelé pour ${docType}:`, { input, type: typeof input, isArray: Array.isArray(input) })

  // Normaliser l'input en tableau
  let files: File[] | null = null

  if (!input) {
    files = null
  } else if (Array.isArray(input)) {
    files = input.length > 0 ? input : null
  } else if (input instanceof File) {
    files = [input]
  } else {
    console.warn(`Type d'input inattendu pour ${docType}:`, typeof input)
    files = null
  }

  console.log(`🔄 Fichiers normalisés pour ${docType}:`, { files, length: files?.length || 0 })

  // Si pas de fichier, nettoyer et arrêter
  if (!files || files.length === 0) {
    console.log(`❌ Aucun fichier pour ${docType}, suppression`)
    delete fileInputs.value[docType]
    delete uploadedAttachments.value[docType]
    return
  }

  const file = files[0]
  console.log(`📄 Fichier sélectionné pour ${docType}:`, {
    name: file.name,
    size: file.size,
    type: file.type
  })

  // Valider le fichier
  const errors = validateFile(file, docType)
  if (errors.length > 0) {
    console.log(`❌ Erreurs de validation pour ${docType}:`, errors)
    fileErrors.value = [...fileErrors.value, ...errors]
    delete fileInputs.value[docType]
    delete uploadedAttachments.value[docType]
    return
  }

  // Fichier valide - l'uploader automatiquement
  console.log(`✅ Fichier valide pour ${docType}, upload automatique...`)
  uploadedAttachments.value[docType] = { url: '', uploading: true }

  try {
    const uploadResponse = await jobOffersService.uploadJobAttachment(file, docType)
    const fileUrl = uploadResponse.data.file_path

    console.log(`🎉 Upload réussi pour ${docType}:`, fileUrl)
    uploadedAttachments.value[docType] = { url: fileUrl, uploading: false }
    fileInputs.value[docType] = files // Garder aussi pour l'affichage

    // Effacer les erreurs précédentes pour ce type
    fileErrors.value = fileErrors.value.filter(error => !error.includes(getDocumentLabel(docType)))

  } catch (error: any) {
    console.error(`❌ Échec upload pour ${docType}:`, error)
    uploadedAttachments.value[docType] = { url: '', uploading: false }
    fileErrors.value = [...fileErrors.value, `Échec upload ${getDocumentLabel(docType)}: ${error.message}`]
    delete fileInputs.value[docType]
  }
}

const validateFile = (file: File | undefined, docType: string): string[] => {
  const errors: string[] = []

  // Check if file exists
  if (!file) {
    errors.push(`${getDocumentLabel(docType)}: Aucun fichier sélectionné`)
    return errors
  }

  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'] // PDF, Word, Images

  if (file.size > maxSize) {
    errors.push(`${getDocumentLabel(docType)}: Le fichier est trop volumineux (max 10MB)`)
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push(`${getDocumentLabel(docType)}: Type de fichier non autorisé. Formats acceptés: PDF, Word, JPEG, PNG`)
  }

  return errors
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatSalary = (amount: number, currency: string) => {
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency || 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return formatter.format(amount)
}

const handleSubmit = async () => {
  // Clear previous errors
  fileErrors.value = []
  fieldErrors.value = {}

  // Validate form fields with Vuetify
  const { valid } = await formRef.value?.validate()

  let hasErrors = false

  // Validate required fields manually and set field errors
  if (!form.first_name.trim()) {
    fieldErrors.value.first_name = 'Le prénom est obligatoire'
    hasErrors = true
  }

  if (!form.last_name.trim()) {
    fieldErrors.value.last_name = 'Le nom est obligatoire'
    hasErrors = true
  }

  if (!form.email.trim()) {
    fieldErrors.value.email = 'L\'email est obligatoire'
    hasErrors = true
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    fieldErrors.value.email = 'L\'email n\'est pas valide'
    hasErrors = true
  }

  if (!form.phone_number.trim()) {
    fieldErrors.value.phone_number = 'Le numéro de téléphone est obligatoire'
    hasErrors = true
  }

  // Validate required files
  let fileValidationErrors: string[] = []

  console.log('🔍 Debug - Validation des fichiers:')
  console.log('📁 Documents requis:', requiredDocuments.value)
  console.log('📎 Fichiers uploadés:', Object.keys(fileInputs.value))
  console.log('📂 Contenu fileInputs:', fileInputs.value)

  for (const docType of requiredDocuments.value) {
    const files = fileInputs.value[docType]
    console.log(`📋 Vérification du document ${docType}:`, files)

    if (!files || files.length === 0) {
      console.log(`❌ Document ${docType} manquant`)
      fileValidationErrors.push(`Le document "${getDocumentLabel(docType)}" est requis`)
      hasErrors = true
    } else {
      console.log(`✅ Document ${docType} présent:`, files[0]?.name)
      // Validate each file
      const file = files[0]
      const fileValidationErrs = validateFile(file, docType)
      if (fileValidationErrs.length > 0) {
        console.log(`❌ Erreur de validation pour ${docType}:`, fileValidationErrs)
        fileValidationErrors.push(...fileValidationErrs)
        hasErrors = true
      }
    }
  }

  // If there are file errors, show them
  if (fileValidationErrors.length > 0) {
    fileErrors.value = fileValidationErrors
  }

  if (hasErrors || !valid) {
    console.log('Validation échouée - hasErrors:', hasErrors, 'valid:', valid)
    // Scroll to first error
    const firstErrorElement = document.querySelector('.v-field--error, .v-alert--type-error')
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  // All validations passed, show confirmation dialog
  confirmDialog.value = true
}

const submitApplication = async () => {
  try {
    submitting.value = true

    // Vérifier que tous les fichiers ont été uploadés
    console.log('📋 Vérification des uploads...')
    console.log('📁 Documents requis:', requiredDocuments.value)
    console.log('📤 Attachments uploadés:', uploadedAttachments.value)

    const missingUploads: string[] = []
    const stillUploading: string[] = []

    for (const docType of requiredDocuments.value) {
      const attachment = uploadedAttachments.value[docType]
      if (!attachment) {
        missingUploads.push(docType)
      } else if (attachment.uploading) {
        stillUploading.push(docType)
      } else if (!attachment.url) {
        missingUploads.push(docType)
      }
    }

    if (stillUploading.length > 0) {
      fileErrors.value = [`Upload en cours pour: ${stillUploading.map(d => getDocumentLabel(d)).join(', ')}`]
      return
    }

    if (missingUploads.length > 0) {
      fileErrors.value = [`Documents manquants: ${missingUploads.map(d => getDocumentLabel(d)).join(', ')}`]
      return
    }

    // Préparer les attachments avec URLs
    const attachments = requiredDocuments.value.map(docType => ({
      name: docType,
      url: uploadedAttachments.value[docType].url
    }))

    // Données de candidature avec attachments URLs
    const applicationData: JobApplicationCreateInput = {
      job_offer_id: form.job_offer_id,
      email: form.email,
      phone_number: form.phone_number,
      first_name: form.first_name,
      last_name: form.last_name,
      civility: form.civility || undefined,
      country_code: form.country_code || undefined,
      city: undefined, // Requis pour le paiement
      address: undefined, // Requis pour le paiement
      date_of_birth: form.date_of_birth || undefined,
      attachments: attachments.length > 0 ? attachments : []
    }

    console.log('📤 Données candidature finales:')
    console.log('👤 Form data:', applicationData)
    console.log('📎 Attachments avec URLs:', attachments)
    console.log('🏂 Offre d’emploi:', {
      id: jobOffersStore.currentJobOffer?.id,
      title: jobOffersStore.currentJobOffer?.title,
      submission_deadline: jobOffersStore.currentJobOffer?.submission_deadline,
      attachment: jobOffersStore.currentJobOffer?.attachment
    })

    // Vérifier la cohérence avec les documents requis
    if (jobOffersStore.currentJobOffer?.attachment) {
      const documentsRequis = jobOffersStore.currentJobOffer.attachment
      const documentsEnvoyes = attachments.map(a => a.name)
      const manquants = documentsRequis.filter(req => !documentsEnvoyes.includes(req))
      const extras = documentsEnvoyes.filter(env => !documentsRequis.includes(env))

      console.log('📋 Comparaison documents:')
      console.log('  Requis par l\'offre:', documentsRequis)
      console.log('  Envoyés:', documentsEnvoyes)
      console.log('  Manquants:', manquants)
      console.log('  Extras:', extras)

      if (manquants.length > 0) {
        fileErrors.value = [`Documents manquants requis par l'offre: ${manquants.join(', ')}`]
        return
      }
    }

    console.log('🚀 Envoi candidature...')
    const response = await jobOffersStore.createJobApplication(applicationData)

    paymentLink.value = response.data.payment.payment_link

    console.log("Lien de paiement : ", paymentLink.value)


    applicationNumber.value = response.data.job_application.application_number
    confirmDialog.value = false
    successDialog.value = true

  } catch (error: any) {
    console.error('Erreur lors de l\'envoi de la candidature:', error)

    // Gestion spécifique de l'erreur de montant trop faible
    if (error.response?.data?.error_code === 'payment_initiation_failed' && 
        error.response?.data?.message?.includes('ERROR_AMOUNT_TOO_LOW')) {
      
      showToast({
        message: 'Le montant des frais de candidature est trop faible. Le minimum requis est de 0,20 €.',
        type: 'error',
        duration: 6000
      })
      
      // Afficher aussi l'erreur dans l'interface
      fileErrors.value = ['Montant insuffisant: Le minimum requis est de 0,20 €']
      
    } else if (error.response?.data?.error_code === 'payment_initiation_failed') {
      
      const errorMessage = error.response?.data?.message || 'Erreur inconnue'
      
      showToast({
        message: `Erreur de paiement: ${errorMessage}. Veuillez réessayer ou contacter le support.`,
        type: 'error',
        duration: 5000
      })
      
      fileErrors.value = ['Erreur de paiement: ' + errorMessage]
      
    } else if (error.response?.data?.message?.includes('payment') || 
               error.response?.data?.message?.includes('Payment')) {
      
      showToast({
        message: `Erreur de paiement: ${error.response?.data?.message}. Veuillez contacter le support si le problème persiste.`,
        type: 'error',
        duration: 5000
      })
      
      fileErrors.value = ['Erreur de paiement: ' + error.response?.data?.message]
      
    } else if (error.response?.data?.error && Array.isArray(error.response.data.error)) {
      const errors = error.response.data.error.map((err: any) => err.msg).join(', ')
      
      showToast({
        message: `Erreur de validation: ${errors}`,
        type: 'error',
        duration: 5000
      })
      
      fileErrors.value = [`Erreur: ${errors}`]
    } else {
      const errorMessage = error.message || 'Erreur inconnue'
      
      showToast({
        message: `Erreur: ${errorMessage}`,
        type: 'error',
        duration: 4000
      })
      
      fileErrors.value = [`Erreur: ${errorMessage}`]
    }
  } finally {
    submitting.value = false
  }
}

const goBack = () => {
  router.push({
    name: 'job-offers-detail',
    params: { id: offerId.value }
  })
}

const goBackToOffer = () => {
  successDialog.value = false
  if (paymentLink.value) {
    window.open(paymentLink.value, '_blank') // ouvre dans un nouvel onglet/page
  }
}

// Fonction pour pré-remplir le formulaire avec les informations de l'utilisateur
const populateUserInfo = () => {
  if (authStore.isAuthenticated && authStore.user) {
    const user = authStore.user

    // Pré-remplir les champs avec les informations de l'utilisateur connecté
    form.email = user.email || ''
    form.first_name = user.first_name || ''
    form.last_name = user.last_name || ''
    form.phone_number = user.mobile_number || user.fix_number || ''
    form.civility = user.civility || ''
    form.country_code = user.country_code || ''
    form.date_of_birth = user.birth_date || ''

    // Si l'utilisateur a un pays, le sélectionner dans l'autocomplétion
    if (user.country_code) {
      selectedCountry.value = {
        code: user.country_code,
        name: user.country_code, // Utiliser le code comme nom par défaut
        code3: user.country_code,
        flag: '',
        region: '',
        subregion: ''
      }
    }

    console.log('[JobOfferApply] Formulaire pré-rempli avec les informations utilisateur:', {
      email: form.email,
      first_name: form.first_name,
      last_name: form.last_name,
      phone_number: form.phone_number
    })
  }
}

// Watcher pour surveiller les changements d'authentification
watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      console.log('[JobOfferApply] Utilisateur connecté, pré-remplissage du formulaire')
      populateUserInfo()
    }
  }
)

// Fonctions de support
const contactSupport = () => {
  // Numéro de téléphone du support (à configurer selon vos besoins)
  const supportPhone = '+237 6XX XX XX XX'
  window.open(`tel:${supportPhone}`, '_self')
}

const emailSupport = () => {
  // Email du support (à configurer selon vos besoins)
  const supportEmail = 'support@lafaom.com'
  const subject = `Support candidature - ${jobOffersStore.currentJobOffer?.title || 'Offre d\'emploi'}`
  const body = `Bonjour,\n\nJe rencontre des difficultés pour candidater à l'offre d'emploi "${jobOffersStore.currentJobOffer?.title || ''}" (Réf: ${jobOffersStore.currentJobOffer?.reference || ''}).\n\nPouvez-vous m'aider ?\n\nMerci.`
  
  window.open(`mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_self')
}

const openChat = () => {
  // Ouvrir le chat en direct (à configurer selon votre système de chat)
  console.log('Ouverture du chat en direct...')
  // Ici vous pouvez intégrer votre système de chat (Intercom, Zendesk, etc.)
  alert('Fonctionnalité de chat en direct à venir prochainement !')
}

// Lifecycle
onMounted(() => {
  loadJobOffer()
  populateUserInfo()
})
</script>

<style scoped>
.job-offer-apply {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
}

.file-upload-card {
  transition: border-color 0.2s ease-in-out;
}

.file-upload-card:hover {
  border-color: rgb(var(--v-theme-primary));
}

.offer-summary {
  padding: 12px 0;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-item {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface-variant));
}

.candidate-summary {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
