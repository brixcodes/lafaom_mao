<template>
  <div class="cabinet-application-page">
    <!-- En-tête -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 mb-2">
          <VIcon icon="ri-building-line" class="me-3" color="primary" />
          Candidature Cabinet
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Rejoignez notre réseau de cabinets partenaires et développez votre activité
        </p>
      </div>
      <VBtn variant="outlined" prepend-icon="ri-arrow-left-line" :to="{ name: 'cabinet-applications' }">
        Retour à la liste
      </VBtn>
    </div>

    <!-- Formulaire de candidature -->
    <VCard>
      <VCardText>
        <VForm ref="formRef" v-model="formValid" @submit.prevent="handleSubmit">
          <VRow>
            <!-- Nom de l'entreprise -->
            <VCol cols="12" md="6">
              <VTextField v-model="form.company_name" label="Nom de l'entreprise *"
                prepend-inner-icon="ri-building-line" variant="outlined" :rules="rules.company_name"
                :error-messages="fieldErrors.company_name" required />
            </VCol>

            <!-- Email de contact -->
            <VCol cols="12" md="6">
              <VTextField v-model="form.contact_email" label="Email de contact *" type="email"
                prepend-inner-icon="ri-mail-line" variant="outlined" :rules="rules.contact_email"
                :error-messages="fieldErrors.contact_email" required />
            </VCol>

            <!-- Téléphone de contact -->
            <VCol cols="12" md="6">
              <VTextField v-model="form.contact_phone" label="Téléphone de contact *" prepend-inner-icon="ri-phone-line"
                variant="outlined" :rules="rules.contact_phone" :error-messages="fieldErrors.contact_phone" required />
            </VCol>

            <!-- Numéro d'enregistrement -->
            <VCol cols="12" md="6">
              <VTextField v-model="form.registration_number" label="Numéro d'enregistrement *"
                prepend-inner-icon="ri-file-text-line" variant="outlined" :rules="rules.registration_number"
                :error-messages="fieldErrors.registration_number" required />
            </VCol>

            <!-- Adresse -->
            <VCol cols="12">
              <VTextarea v-model="form.address" label="Adresse complète *" prepend-inner-icon="ri-map-pin-line"
                variant="outlined" rows="3" :rules="rules.address" :error-messages="fieldErrors.address" required />
            </VCol>

            <!-- Années d'expérience -->
            <VCol cols="12" md="6">
              <VTextField v-model.number="form.experience_years" label="Années d'expérience *" type="number"
                prepend-inner-icon="ri-calendar-line" variant="outlined" :rules="rules.experience_years"
                :error-messages="fieldErrors.experience_years" required />
            </VCol>

            <!-- Qualifications -->
            <VCol cols="12" md="6">
              <VTextField v-model="form.qualifications" label="Qualifications et certifications"
                prepend-inner-icon="ri-award-line" variant="outlined" />
            </VCol>

            <!-- Proposition technique -->
            <VCol cols="12">
              <VTextarea v-model="form.technical_proposal" label="Proposition technique"
                prepend-inner-icon="ri-tools-line" variant="outlined" rows="4"
                hint="Décrivez votre approche technique et méthodologie" persistent-hint />
            </VCol>

            <!-- Proposition financière -->
            <VCol cols="12">
              <VTextarea v-model="form.financial_proposal" label="Proposition financière"
                prepend-inner-icon="ri-money-euro-circle-line" variant="outlined" rows="4"
                hint="Décrivez vos tarifs et conditions financières" persistent-hint />
            </VCol>

            <!-- Références -->
            <VCol cols="12">
              <VTextarea v-model="form.references" label="Références clients" prepend-inner-icon="ri-user-star-line"
                variant="outlined" rows="3" hint="Mentionnez vos principales références clients" persistent-hint />
            </VCol>

            <!-- Informations de paiement -->
            <VCol cols="12">
              <VAlert type="info" variant="tonal" class="mb-4">
                <VAlertTitle>Frais de candidature</VAlertTitle>
                <p class="mb-0">
                  Un frais de candidature de <strong>50 EUR</strong> est requis pour soumettre votre candidature.
                  Ce montant sera déduit de vos honoraires futurs si votre candidature est acceptée.
                </p>
                <p class="text-body-2 mt-2 mb-0">
                  <VIcon icon="ri-information-line" size="small" class="me-1" />
                  Paiement sécurisé par CinetPay - Cartes bancaires acceptées
                </p>
              </VAlert>
            </VCol>

            <!-- Erreurs de validation -->
            <VCol cols="12" v-if="fieldErrors.general">
              <VAlert type="error" variant="tonal">
                {{ fieldErrors.general }}
              </VAlert>
            </VCol>

            <!-- Boutons d'action -->
            <VCol cols="12" class="d-flex justify-end gap-3">
              <VBtn variant="outlined" @click="resetForm" :disabled="isLoading">
                Réinitialiser
              </VBtn>
              <VBtn type="submit" color="primary" :loading="isLoading" :disabled="!formValid">
                <VIcon icon="ri-send-plane-line" class="me-2" />
                Soumettre la candidature
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <!-- Dialog de confirmation -->
    <VDialog v-model="confirmDialog" max-width="500">
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon icon="ri-question-line" class="me-2" color="primary" />
          Confirmer la soumission
        </VCardTitle>
        <VCardText>
          <p>Êtes-vous sûr de vouloir soumettre cette candidature ?</p>
          <p class="text-body-2 text-medium-emphasis">
            Un frais de candidature de <strong>50 EUR</strong> sera requis pour finaliser votre candidature.
          </p>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="outlined" @click="confirmDialog = false">
            Annuler
          </VBtn>
          <VBtn color="primary" @click="submitApplication" :loading="isLoading">
            Confirmer
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Dialog de succès -->
    <VDialog v-model="successDialog" max-width="600" persistent>
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon icon="ri-check-line" class="me-2" color="success" />
          Candidature soumise avec succès
        </VCardTitle>
        <VCardText>
          <p>Votre candidature de cabinet a été soumise avec succès !</p>
          <p class="text-body-2 text-medium-emphasis">
            Vous allez être redirigé vers la page de paiement pour finaliser votre candidature.
          </p>
          <VAlert type="info" variant="tonal" class="mt-4">
            <VAlertTitle>Prochaines étapes</VAlertTitle>
            <ul class="mb-0">
              <li>Effectuez le paiement des frais de candidature (50 EUR)</li>
              <li>Notre équipe examinera votre candidature sous 48h</li>
              <li>Vous recevrez une notification par email</li>
              <li>En cas d'approbation, un compte utilisateur sera créé</li>
            </ul>
          </VAlert>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn color="primary" @click="goToPayment" :disabled="!paymentUrl">
            <VIcon icon="ri-money-euro-circle-line" class="me-2" />
            Procéder au paiement
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCabinetStore } from '@/stores/cabinet'
import { useToast } from '@/composables/useToast'
import type { CabinetApplicationCreate } from '@/types/cabinet'

// Router et stores
const router = useRouter()
const cabinetStore = useCabinetStore()
const { showToast } = useToast()

// Form state
const formRef = ref()
const formValid = ref(false)
const confirmDialog = ref(false)
const successDialog = ref(false)
const paymentUrl = ref('')

// Form data
const form = reactive<CabinetApplicationCreate>({
  company_name: '',
  contact_email: '',
  contact_phone: '',
  address: '',
  registration_number: '',
  experience_years: 0,
  qualifications: '',
  technical_proposal: '',
  financial_proposal: '',
  references: ''
})

// Field errors
const fieldErrors = reactive<Record<string, string>>({})

// Computed
const isLoading = computed(() => cabinetStore.isLoading)

// Validation rules
const rules = {
  company_name: [
    (v: string) => !!v || 'Le nom de l\'entreprise est obligatoire',
    (v: string) => (v && v.length >= 2) || 'Le nom doit contenir au moins 2 caractères',
    (v: string) => (v && v.length <= 255) || 'Le nom ne peut pas dépasser 255 caractères'
  ],
  contact_email: [
    (v: string) => !!v || 'L\'email est obligatoire',
    (v: string) => /.+@.+\..+/.test(v) || 'L\'email doit être valide'
  ],
  contact_phone: [
    (v: string) => !!v || 'Le téléphone est obligatoire',
    (v: string) => (v && v.length >= 8) || 'Le téléphone doit contenir au moins 8 caractères',
    (v: string) => (v && v.length <= 50) || 'Le téléphone ne peut pas dépasser 50 caractères'
  ],
  address: [
    (v: string) => !!v || 'L\'adresse est obligatoire',
    (v: string) => (v && v.length >= 10) || 'L\'adresse doit contenir au moins 10 caractères'
  ],
  registration_number: [
    (v: string) => !!v || 'Le numéro d\'enregistrement est obligatoire',
    (v: string) => (v && v.length >= 5) || 'Le numéro doit contenir au moins 5 caractères',
    (v: string) => (v && v.length <= 100) || 'Le numéro ne peut pas dépasser 100 caractères'
  ],
  experience_years: [
    (v: number) => v !== null && v !== undefined || 'Les années d\'expérience sont obligatoires',
    (v: number) => v >= 0 || 'Les années d\'expérience doivent être positives',
    (v: number) => v <= 50 || 'Les années d\'expérience ne peuvent pas dépasser 50'
  ]
}

// Methods
const resetForm = () => {
  Object.assign(form, {
    company_name: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    registration_number: '',
    experience_years: 0,
    qualifications: '',
    technical_proposal: '',
    financial_proposal: '',
    references: ''
  })

  // Clear errors
  Object.keys(fieldErrors).forEach(key => {
    delete fieldErrors[key]
  })

  // Reset form validation
  formRef.value?.reset()
}

const handleSubmit = () => {
  // Clear previous errors
  Object.keys(fieldErrors).forEach(key => {
    delete fieldErrors[key]
  })

  // Validate form
  if (!formValid.value) {
    fieldErrors.general = 'Veuillez corriger les erreurs dans le formulaire'
    return
  }

  // Show confirmation dialog
  confirmDialog.value = true
}

const submitApplication = async () => {
  try {
    confirmDialog.value = false

    const application = await cabinetStore.createApplication(form)

    // Debug: log the application object
    console.log('Application created:', application)

    // Store payment URL
    paymentUrl.value = application.payment_url || ''

    // Show success dialog
    successDialog.value = true

    showToast('Candidature de cabinet soumise avec succès !', 'success')

  } catch (error: any) {
    console.error('Erreur lors de la soumission:', error)

    if (error.response?.data?.detail) {
      fieldErrors.general = error.response.data.detail
    } else {
      fieldErrors.general = 'Erreur lors de la soumission de la candidature'
    }

    showToast('Erreur lors de la soumission de la candidature de cabinet', 'error')
  }
}

const goToPayment = () => {
  if (paymentUrl.value) {
    window.open(paymentUrl.value, '_blank')
  }
}
</script>

<style scoped>
.cabinet-application-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
</style>
