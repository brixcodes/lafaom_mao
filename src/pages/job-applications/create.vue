<template>
  <div class="job-application-create-page">
    <!-- En-tête -->
    <div class="d-flex align-center mb-6">
      <VBtn icon="ri-arrow-left-line" variant="text" @click="handleBack" class="me-3" />
      <div>
        <h1 class="text-h4 mb-1">
          <VIcon icon="ri-send-plane-line" class="me-2" color="primary" />
          Soumettre votre candidature
        </h1>
        <p class="text-body-1 text-medium-emphasis" v-if="jobOffer">
          Candidature pour : {{ jobOffer.title }} - {{ jobOffer.location }}
        </p>
      </div>
    </div>

    <!-- Chargement de l'offre -->
    <div v-if="isLoadingOffer && !jobOffer" class="text-center pa-8">
      <VProgressCircular indeterminate color="primary" size="64" class="mb-4" />
      <p class="text-body-1">Chargement de l'offre...</p>
    </div>

    <!-- Offre non trouvée -->
    <VAlert v-else-if="!jobOffer && !isLoadingOffer" type="error" class="mb-6">
      L'offre d'emploi demandée n'a pas été trouvée ou n'est plus disponible.
    </VAlert>

    <!-- Formulaire de candidature -->
    <div v-else>
      <!-- Sélection d'offre si pas d'offerId dans l'URL -->
      <VCard class="mb-6" v-if="!hasOfferIdParam">
        <VCardTitle class="d-flex align-center">
          <VIcon icon="ri-search-line" class="me-2" color="primary" />
          Sélectionnez une offre d'emploi
        </VCardTitle>
        <VCardText>
          <VSelect v-model="selectedOfferId" :items="availableOffers" item-title="title" item-value="id"
            label="Choisissez une offre d'emploi" variant="outlined" prepend-inner-icon="ri-briefcase-line"
            @update:model-value="loadSelectedOffer">
            <template #item="{ props, item }">
              <VListItem v-bind="props">
                <template #title>
                  <div class="d-flex align-center">
                    <div class="flex-grow-1">
                      <div class="text-body-1 font-weight-medium">{{ item.raw.title }}</div>
                      <div class="text-body-2 text-medium-emphasis">{{ item.raw.location }} • {{ item.raw.reference }}
                      </div>
                    </div>
                    <VChip size="small" :color="getOfferStatusColor(item.raw)" variant="tonal">
                      {{ getOfferStatusLabel(item.raw) }}
                    </VChip>
                  </div>
                </template>
              </VListItem>
            </template>
          </VSelect>
        </VCardText>
      </VCard>

      <!-- Informations sur l'offre -->
      <VCard class="mb-6" v-if="jobOffer">
        <VCardTitle class="d-flex align-center">
          <VIcon icon="ri-briefcase-line" class="me-2" color="primary" />
          Détails de l'offre
        </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12" md="8">
              <div class="d-flex align-center mb-2">
                <VIcon icon="ri-building-line" size="16" class="me-2" color="medium-emphasis" />
                <span class="text-body-2">{{ jobOffer.title }}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <VIcon icon="ri-map-pin-line" size="16" class="me-2" color="medium-emphasis" />
                <span class="text-body-2">{{ jobOffer.location }}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <VIcon icon="ri-file-list-line" size="16" class="me-2" color="medium-emphasis" />
                <span class="text-body-2">{{ getContractTypeLabel(jobOffer.contract_type) }}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <VIcon icon="ri-calendar-line" size="16" class="me-2" color="medium-emphasis" />
                <span class="text-body-2">Date limite : {{ formatDate(jobOffer.submission_deadline) }}</span>
              </div>
            </VCol>
            <VCol cols="12" md="4">
              <div class="text-end">
                <VChip color="primary" size="small" variant="outlined" class="mb-2">
                  {{ jobOffer.reference }}
                </VChip>
                <p class="text-h6 mb-1" v-if="jobOffer.salary">
                  {{ formatSalary(jobOffer.salary, jobOffer.currency) }}
                </p>
                <p class="text-body-2 text-primary font-weight-medium">
                  Frais de candidature : {{ formatSalary(jobOffer.submission_fee, jobOffer.currency) }}
                </p>
              </div>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>

      <!-- Formulaire -->
      <VForm ref="formRef" @submit.prevent="handleSubmit">
        <VCard>
          <VCardTitle class="d-flex align-center">
            <VIcon icon="ri-user-line" class="me-2" color="primary" />
            Vos informations
          </VCardTitle>

          <VCardText>
            <VRow>
              <!-- Civilité -->
              <VCol cols="12" md="3">
                <VSelect v-model="form.civility" :items="civilityOptions" label="Civilité" variant="outlined"
                  prepend-inner-icon="ri-user-line" :error-messages="errors.civility" />
              </VCol>

              <!-- Prénom -->
              <VCol cols="12" md="4">
                <VTextField v-model="form.first_name" label="Prénom *" variant="outlined"
                  prepend-inner-icon="ri-user-line" :rules="rules.first_name" :error-messages="errors.first_name"
                  required />
              </VCol>

              <!-- Nom -->
              <VCol cols="12" md="5">
                <VTextField v-model="form.last_name" label="Nom de famille *" variant="outlined"
                  prepend-inner-icon="ri-user-line" :rules="rules.last_name" :error-messages="errors.last_name"
                  required />
              </VCol>

              <!-- Email -->
              <VCol cols="12" md="6">
                <VTextField v-model="form.email" label="Adresse email *" type="email" variant="outlined"
                  prepend-inner-icon="ri-mail-line" :rules="rules.email" :error-messages="errors.email" required />
              </VCol>

              <!-- Téléphone -->
              <VCol cols="12" md="6">
                <VTextField v-model="form.phone_number" label="Numéro de téléphone *" type="tel" variant="outlined"
                  prepend-inner-icon="ri-phone-line" :rules="rules.phone_number" :error-messages="errors.phone_number"
                  required />
              </VCol>

              <!-- Code pays -->
              <VCol cols="12" md="6">
                <VTextField v-model="form.country_code" label="Code pays" variant="outlined"
                  prepend-inner-icon="ri-flag-line" :error-messages="errors.country_code" placeholder="+33" />
              </VCol>

              <!-- Date de naissance -->
              <VCol cols="12" md="6">
                <VTextField v-model="form.date_of_birth" label="Date de naissance" type="date" variant="outlined"
                  prepend-inner-icon="ri-calendar-line" :error-messages="errors.date_of_birth" />
              </VCol>
            </VRow>

            <!-- Pièces jointes -->
            <div class="mt-6">
              <h3 class="text-h6 mb-4 d-flex align-center">
                <VIcon icon="ri-attachment-line" class="me-2" color="primary" />
                Documents requis
              </h3>

              <VRow>
                <VCol cols="12">
                  <VFileInput v-model="attachmentFiles" label="Sélectionnez vos documents" variant="outlined"
                    prepend-inner-icon="ri-file-upload-line" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    :error-messages="errors.attachments" chips show-size>
                    <template #selection="{ fileNames }">
                      <template v-for="(fileName, index) in fileNames" :key="fileName">
                        <VChip size="small" color="primary" variant="tonal" class="me-2 mb-2" closable
                          @click:close="removeFile(index)">
                          {{ fileName }}
                        </VChip>
                      </template>
                    </template>
                  </VFileInput>
                  <div class="text-caption text-medium-emphasis mt-2">
                    Formats acceptés : PDF, Word, Images (JPG, PNG). Taille maximale : 10 MB par fichier.
                  </div>
                </VCol>
              </VRow>
            </div>

            <!-- Zone de documents par type -->
            <div class="mt-6">
              <h4 class="text-subtitle-1 mb-3">Types de documents recommandés :</h4>
              <VRow>
                <VCol v-for="docType in documentTypes" :key="docType.value" cols="12" sm="6" md="4">
                  <VCard variant="outlined" class="pa-3">
                    <div class="d-flex align-center">
                      <VIcon :icon="getDocumentIcon(docType.value)" class="me-2" color="primary" />
                      <span class="text-body-2">{{ docType.text }}</span>
                    </div>
                  </VCard>
                </VCol>
              </VRow>
            </div>
          </VCardText>

          <!-- Actions -->
          <VCardActions class="justify-end pa-4">
            <VBtn variant="outlined" prepend-icon="ri-close-line" @click="handleBack" :disabled="isLoading">
              Annuler
            </VBtn>

            <VBtn type="submit" color="primary" prepend-icon="ri-send-plane-line" :loading="isLoading">
              Envoyer ma candidature
            </VBtn>
          </VCardActions>
        </VCard>
      </VForm>
    </div>

    <!-- Messages d'erreur -->
    <VAlert v-if="error" type="error" class="mt-4" closable @click:close="clearError">
      {{ error }}
    </VAlert>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobOffersStore } from '@/stores/jobOffers'
import { useJobApplicationsStore } from '@/stores/jobApplications'
import { APPLICATION_DOCUMENT_TYPES } from '@/types/jobApplications'
// import { CONTRACT_TYPES } from '@/constants/jobOffers'
import type { JobApplicationCreateInput, JobAttachmentInput } from '@/types/jobApplications'
import { CONTRACT_TYPES } from '@/types/jobOffers'

// Composables
const route = useRoute()
const router = useRouter()
const jobOffersStore = useJobOffersStore()
const jobApplicationsStore = useJobApplicationsStore()

// Refs
const formRef = ref<any>(null)
const attachmentFiles = ref<File[]>([])
const selectedOfferId = ref<string>('')
const availableOffers = ref<any[]>([])

// Form data
const form = ref<Omit<JobApplicationCreateInput, 'attachments' | 'job_offer_id'>>({
  email: '',
  phone_number: '',
  first_name: '',
  last_name: '',
  civility: '',
  country_code: '',
  date_of_birth: '',
})

// Errors
const errors = ref<Record<string, string>>({})

// Computed
const { currentJobOffer: jobOffer } = jobOffersStore
const { isLoading, error } = jobApplicationsStore
const isLoadingOffer = computed(() => jobOffersStore.isLoading)

// Vérifier si on a un offerId dans l'URL
const hasOfferIdParam = computed(() => !!(route.params.offerId))

const civilityOptions = [
  { title: 'Monsieur', value: 'M.' },
  { title: 'Madame', value: 'Mme' },
  { title: 'Mademoiselle', value: 'Mlle' },
]

const documentTypes = APPLICATION_DOCUMENT_TYPES.map(type => ({
  title: type.text,
  value: type.value
}))

// Validation rules
const rules = {
  first_name: [
    (v: string) => !!v || 'Le prénom est obligatoire',
    (v: string) => (v && v.length >= 2) || 'Le prénom doit contenir au moins 2 caractères',
  ],
  last_name: [
    (v: string) => !!v || 'Le nom est obligatoire',
    (v: string) => (v && v.length >= 2) || 'Le nom doit contenir au moins 2 caractères',
  ],
  email: [
    (v: string) => !!v || 'L\'email est obligatoire',
    (v: string) => /.+@.+\..+/.test(v) || 'L\'email doit être valide',
  ],
  phone_number: [
    (v: string) => !!v || 'Le numéro de téléphone est obligatoire',
    (v: string) => (v && v.length >= 10) || 'Le numéro doit contenir au moins 10 chiffres',
  ],
}

// Methods
const loadJobOffer = async () => {
  const offerId = route.params.offerId as string
  if (offerId) {
    try {
      await jobOffersStore.getJobOfferById(offerId)
    } catch (err) {
      console.error('Erreur lors du chargement de l\'offre:', err)
    }
  } else {
    // Charger la liste des offres disponibles
    await loadAvailableOffers()
  }
}

const loadAvailableOffers = async () => {
  try {
    const response = await jobOffersStore.fetchJobOffers({
      page: 1,
      page_size: 100,
      asc: 'desc',
      order_by: 'created_at'
    })
    availableOffers.value = jobOffersStore.jobOffers.filter(offer => {
      // Filtrer les offres actives seulement
      const deadline = new Date(offer.submission_deadline)
      const today = new Date()
      return deadline >= today
    })
  } catch (err) {
    console.error('Erreur lors du chargement des offres:', err)
  }
}

const loadSelectedOffer = async (offerId: string) => {
  if (offerId) {
    try {
      await jobOffersStore.getJobOfferById(offerId)
    } catch (err) {
      console.error('Erreur lors du chargement de l\'offre sélectionnée:', err)
    }
  }
}

const handleSubmit = async () => {
  const { valid } = await formRef.value?.validate()

  if (!valid) return
  if (!jobOffer.value) {
    error.value = 'Aucune offre d\'emploi sélectionnée'
    return
  }

  // Clear backend errors
  errors.value = {}

  // Préparer les pièces jointes
  const attachments: JobAttachmentInput[] = attachmentFiles.value.map(file => ({
    name: file.name,
    file
  }))

  // Préparer les données de candidature
  const applicationData: JobApplicationCreateInput = {
    job_offer_id: jobOffer.value.id,
    ...form.value,
    attachments
  }

  try {
    await jobApplicationsStore.createJobApplication(applicationData)

    // Rediriger vers une page de confirmation
    router.push({
      name: 'job-application-success',
      query: { offerId: jobOffer.value.id }
    })
  } catch (err: any) {
    console.error('Erreur lors de la soumission:', err)

    // Gérer les erreurs de validation backend
    if (err.response?.data?.validation_errors) {
      errors.value = err.response.data.validation_errors
    }
  }
}

const handleBack = () => {
  const offerId = route.params.offerId as string
  if (offerId) {
    router.push({ name: 'job-offers-detail', params: { id: offerId } })
  } else {
    router.push({ name: 'job-applications' })
  }
}

const removeFile = (index: number) => {
  attachmentFiles.value.splice(index, 1)
}

const getContractTypeLabel = (type: string) => {
  const contractType = CONTRACT_TYPES.find(ct => ct.value === type)
  return contractType?.text || type
}

const getDocumentIcon = (type: string) => {
  const icons: Record<string, string> = {
    CV: 'ri-file-text-line',
    COVER_LETTER: 'ri-mail-line',
    DIPLOMA: 'ri-award-line',
    CERTIFICATE: 'ri-medal-line',
    RECOMMENDATION: 'ri-star-line',
    PORTFOLIO: 'ri-folder-image-line',
    OTHER: 'ri-file-line',
  }
  return icons[type] || 'ri-file-line'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatSalary = (salary: number, currency: string) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency || 'EUR'
  }).format(salary)
}

const clearError = () => {
  jobApplicationsStore.clearError()
}

const getOfferStatusColor = (offer: any) => {
  const today = new Date()
  const deadline = new Date(offer.submission_deadline)

  if (deadline < today) return 'error'
  if (deadline <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) return 'warning'
  return 'success'
}

const getOfferStatusLabel = (offer: any) => {
  const today = new Date()
  const deadline = new Date(offer.submission_deadline)

  if (deadline < today) return 'Expirée'
  if (deadline <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) return 'Expire bientôt'
  return 'Active'
}

// Lifecycle
onMounted(() => {
  loadJobOffer()
})
</script>

<style scoped>
.job-application-create-page {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .job-application-create-page {
    padding: 1rem;
  }
}
</style>
