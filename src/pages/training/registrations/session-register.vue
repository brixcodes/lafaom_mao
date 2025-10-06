<template>
  <VContainer>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="d-flex align-center">
        <VBtn icon variant="text" class="mr-3" @click="goBack">
          <VIcon icon="ri-arrow-left-line" color="primary" />
        </VBtn>
        <div>
          <h1 class="text-h4 font-weight-bold mb-2">
            Inscription à une session
          </h1>
          <p class="text-body-1 text-medium-emphasis">
            Inscrivez-vous à une session de formation
          </p>
        </div>
      </div>
    </div>

    <VFadeTransition>
      <VRow v-if="session">
        <VCol cols="12">
          <!-- En-tête avec design moderne -->
          <VSlideYTransition>
            <VCard class="mb-6 session-registration-header-card overflow-hidden" elevation="3">
              <div class="session-registration-header-overlay">
                <div class="session-registration-header-content">
                  <div class="d-flex align-center mb-4 animate-specialty">
                    <VAvatar size="48" class="mr-3 border-white">
                      <VIcon color="white" size="24">ri-calendar-line</VIcon>
                    </VAvatar>
                    <div>
                      <div class="text-white font-weight-medium">{{ getTrainingName(session.training_id) }}</div>
                      <div class="text-caption text-white">
                        Session ID: {{ session.id }}
                      </div>
                    </div>
                  </div>

                  <h1 class="text-h3 font-weight-bold text-white mb-4 animate-title">
                    Inscription à la session
                  </h1>

                  <div class="d-flex flex-wrap gap-3 mb-4">
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-calendar-line</VIcon>
                      <span>{{ formatDate(session.start_date) }} - {{ formatDate(session.end_date) }}</span>
                    </div>
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-building-line</VIcon>
                      <span>{{ getCenterName(session.center_id) || 'Formation en ligne' }}</span>
                    </div>
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-user-line</VIcon>
                      <span>{{ session.available_slots || 0 }} places disponibles</span>
                    </div>
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-money-euro-circle-line</VIcon>
                      <span>{{ formatCurrency(session.registration_fee) }}</span>
                    </div>
                  </div>

                  <VSlideXTransition group>
                    <VChip key="session-status" :color="statusChip.color" variant="elevated" size="small"
                      class="mr-2 mb-2 animate-tag">
                      {{ statusChip.text }}
                    </VChip>
                    <VChip key="registration-deadline" :color="deadlineChip.color" variant="elevated" size="small"
                      class="mr-2 mb-2 animate-tag">
                      {{ deadlineChip.text }}
                    </VChip>
                  </VSlideXTransition>
                </div>
              </div>
            </VCard>
          </VSlideYTransition>

          <!-- Alerte si l'inscription n'est pas possible -->
          <VAlert v-if="!canRegister && registrationMessage" type="warning" variant="tonal" class="mb-6" closable>
            <template #prepend>
              <VIcon icon="ri-alert-line" />
            </template>
            <div>
              <strong>Inscription non disponible</strong>
              <p class="mb-0">{{ registrationMessage }}</p>
            </div>
          </VAlert>

          <!-- Formulaire d'inscription -->
          <VSlideYTransition>
            <VCard class="mb-6 animate-card" elevation="1">
              <VCardText class="py-4">
                <VForm ref="formRef" @submit.prevent="handleSubmit" :disabled="!canRegister">
                  <VRow>
                    <VCol cols="12" md="6">
                      <VTextField v-model="registration.first_name" label="Prénom" variant="outlined"
                        density="comfortable" prepend-inner-icon="ri-user-line"
                        :rules="[(v: string) => !!v || 'Le prénom est obligatoire']" required />
                    </VCol>

                    <VCol cols="12" md="6">
                      <VTextField v-model="registration.last_name" label="Nom" variant="outlined" density="comfortable"
                        prepend-inner-icon="ri-user-line" :rules="[(v: string) => !!v || 'Le nom est obligatoire']"
                        required />
                    </VCol>

                    <VCol cols="12" md="6">
                      <VTextField v-model="registration.email" label="Email" type="email" variant="outlined"
                        density="comfortable" prepend-inner-icon="ri-mail-line" :rules="[
                          (v: string) => !!v || 'L\'email est obligatoire',
                          (v: string) => /.+@.+\..+/.test(v) || 'L\'email doit être valide'
                        ]" required />
                    </VCol>

                    <VCol cols="12" md="3">
                      <VTextField v-model="registration.phone_number" label="Téléphone" variant="outlined"
                        density="comfortable" prepend-inner-icon="ri-phone-line"
                        :rules="[(v: string) => !!v || 'Le téléphone est obligatoire']" required />
                    </VCol>

                    <VCol cols="12" md="3">
                      <VSelect
                        v-model="registration.country_code"
                        :items="countryOptions"
                        item-title="name"
                        item-value="code"
                        label="Pays"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="ri-flag-line"
                        :rules="[(v: string) => !!v || 'Le pays est obligatoire']"
                        required
                      />
                    </VCol>


                    <VCol cols="12">
                      <VFileInput
                        label="Pièces jointes (optionnel)"
                        variant="outlined"
                        density="comfortable"
                        prepend-icon=""
                        prepend-inner-icon="ri-attachment-line"
                        multiple
                        chips
                        show-size
                        counter
                        @change="handleFileChange"
                      />
                    </VCol>
                  </VRow>

                  <!-- Actions -->
                  <VCardActions class="px-0 pt-6">
                    <VSpacer />
                    <VBtn variant="flat" color="error" @click="goBack">
                      Annuler
                    </VBtn>
                    <VBtn type="submit" variant="flat" color="primary" :loading="isSubmitting"
                      :disabled="isSubmitting || !canRegister">
                      {{ canRegister ? 'Enregistrer' : 'Inscription fermée' }}
                    </VBtn>
                  </VCardActions>
                </VForm>
              </VCardText>
            </VCard>
          </VSlideYTransition>
        </VCol>
      </VRow>
    </VFadeTransition>

    <!-- Chargement -->
    <div v-if="isLoading && !session" class="text-center pa-8">
      <VProgressCircular indeterminate color="primary" size="64" class="mb-4" />
      <p class="text-body-1">Chargement de la session...</p>
    </div>

    <!-- Erreur -->
    <VAlert v-if="error" type="error" class="mt-4" closable @click:close="clearError">
      {{ error }}
    </VAlert>

    <!-- Modal de paiement obligatoire -->
    <VDialog v-model="showPaymentModal" max-width="600" persistent>
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon color="warning" class="mr-2">ri-money-euro-circle-line</VIcon>
          <span class="text-h6">Paiement des frais d'étude de dossier</span>
        </VCardTitle>
        <VDivider />
        <VCardText class="py-4">
          <VAlert type="warning" variant="tonal" class="mb-4">
            <template #prepend>
              <VIcon icon="ri-alert-line" />
            </template>
            <div>
              <strong>Paiement obligatoire</strong>
              <p class="mb-0">Vous devez payer les frais d'étude de dossier avant de pouvoir soumettre votre candidature.</p>
            </div>
          </VAlert>

          <VCard variant="tonal" color="warning" class="mb-4">
            <VCardText>
              <div class="d-flex align-center justify-space-between mb-3">
                <div class="d-flex align-center">
                  <VIcon color="warning" class="mr-2">ri-bank-card-line</VIcon>
                  <span class="text-h6">Frais d'étude de dossier</span>
                </div>
                <span class="text-h5 font-weight-bold text-warning">{{ (session?.registration_fee || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) }}</span>
              </div>
              <p class="text-body-2 text-medium-emphasis mb-3">
                Votre candidature sera créée et vous serez redirigé vers la plateforme de paiement pour régler les frais d'étude de dossier.
              </p>
              <VBtn
                color="warning"
                variant="flat"
                prepend-icon="ri-bank-card-line"
                @click="handlePayment"
                :disabled="isProcessingPayment"
                :loading="isProcessingPayment"
                block
              >
                {{ isProcessingPayment ? 'Traitement en cours...' : 'Créer la candidature et payer' }}
              </VBtn>
            </VCardText>
          </VCard>
        </VCardText>
        <VCardActions class="px-6 pb-4">
          <VSpacer />
          <VBtn 
            variant="outlined" 
            @click="closePaymentModal"
            :disabled="isProcessingPayment"
          >
            Annuler
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { trainingService } from '@/services/api/training'
import { organizationCentersService } from '@/services/api/organization-centers'
import { studentApplicationsService } from '@/services/api/student-applications'
import type { TrainingSession } from '@/types/training'
import { TrainingSessionStatusEnum } from '@/types/training'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'

const router = useRouter()
const route = useRoute()

// State
const session = ref<TrainingSession | null>(null)
const trainings = ref<{ id: string; title: string }[]>([])
const centers = ref<{ id: number; name: string }[]>([])
const isLoading = ref(true)
const error = ref('')
const isSubmitting = ref(false)
const formRef = ref()

// État du paiement obligatoire
const showPaymentModal = ref(false)
const isPaymentCompleted = ref(false)
const isProcessingPayment = ref(false)
const pendingRegistrationData = ref<any>(null)

// Registration data
const registration = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  country_code: 'SN',
  motivation: '',
  attachments: [] as string[]
})

// Options de pays
const countryOptions = [
  { name: 'Sénégal', code: 'SN' },
  { name: 'France', code: 'FR' },
  { name: 'Cameroun', code: 'CM' },
  { name: 'Côte d\'Ivoire', code: 'CI' },
  { name: 'Mali', code: 'ML' },
  { name: 'Burkina Faso', code: 'BF' },
  { name: 'Niger', code: 'NE' },
  { name: 'Tchad', code: 'TD' },
  { name: 'Guinée', code: 'GN' },
  { name: 'Gambie', code: 'GM' },
  { name: 'Guinée-Bissau', code: 'GW' },
  { name: 'Cap-Vert', code: 'CV' },
  { name: 'Sao Tomé-et-Principe', code: 'ST' },
  { name: 'Mauritanie', code: 'MR' }
]

// Computed
const statusChip = computed(() => {
  if (!session.value) return { text: '', color: 'grey' }

  const status = session.value.status
  const statusConfig = {
    [TrainingSessionStatusEnum.OPEN_FOR_REGISTRATION]: { text: 'Ouverte aux inscriptions', color: 'success' },
    [TrainingSessionStatusEnum.CLOSE_FOR_REGISTRATION]: { text: 'Fermée aux inscriptions', color: 'warning' },
    [TrainingSessionStatusEnum.ONGOING]: { text: 'En cours', color: 'info' },
    [TrainingSessionStatusEnum.COMPLETED]: { text: 'Terminée', color: 'grey' }
  }

  return statusConfig[status as TrainingSessionStatusEnum] || { text: status, color: 'grey' }
})

// Vérifier si l'inscription est possible
const canRegister = computed(() => {
  if (!session.value) return false

  const today = new Date()
  const registrationDeadline = new Date(session.value.registration_deadline)

  // Vérifier si la date limite n'est pas dépassée
  const isDeadlinePassed = today > registrationDeadline

  // Vérifier le statut de la session
  const isStatusOpen = session.value.status === TrainingSessionStatusEnum.OPEN_FOR_REGISTRATION

  return !isDeadlinePassed && isStatusOpen
})

// Message d'erreur si l'inscription n'est pas possible
const registrationMessage = computed(() => {
  if (!session.value) return ''

  const today = new Date()
  const registrationDeadline = new Date(session.value.registration_deadline)

  if (today > registrationDeadline) {
    return `Les inscriptions sont fermées. La date limite était le ${formatDate(session.value.registration_deadline)}.`
  }

  if (session.value.status !== TrainingSessionStatusEnum.OPEN_FOR_REGISTRATION) {
    return `Cette session n'est pas ouverte aux inscriptions (statut: ${getSessionStatusLabel(session.value.status)}).`
  }

  return ''
})

const deadlineChip = computed(() => {
  if (!session.value?.registration_deadline) return { text: '', color: 'grey' }

  const deadline = new Date(session.value.registration_deadline)
  const now = new Date()
  const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (daysLeft < 0) {
    return { text: 'Inscriptions fermées', color: 'error' }
  } else if (daysLeft <= 3) {
    return { text: `${daysLeft} jours restants`, color: 'warning' }
  } else {
    return { text: `${daysLeft} jours restants`, color: 'success' }
  }
})

// Methods
const goBack = () => {
  router.push({ name: 'training-sessions-index' })
}

const loadSession = async () => {
  try {
    isLoading.value = true
    const sessionId = route.params.id as string

    if (!sessionId) {
      error.value = 'ID de session manquant'
      return
    }

    const response = await trainingService.getTrainingSessionById(sessionId)
    session.value = response.data

  } catch (err: any) {
    console.error('Erreur lors du chargement de la session:', err)
    error.value = 'Erreur lors du chargement de la session'
  } finally {
    isLoading.value = false
  }
}

const fetchTrainings = async () => {
  try {
    const response = await trainingService.getTrainings({ page: 1, page_size: 1000 })
    trainings.value = response.data.map(t => ({ id: t.id, title: t.title }))
  } catch (error) {
    console.error('Erreur lors du chargement des formations:', error)
  }
}

const fetchCenters = async () => {
  try {
    const response = await organizationCentersService.getOrganizationCenters({ page: 1, page_size: 1000 })
    centers.value = response.data.map((c: any) => ({ id: c.id, name: c.name }))
  } catch (error) {
    console.error('Erreur lors du chargement des centres:', error)
  }
}

const getTrainingName = (trainingId: string) => {
  const training = trainings.value.find(t => t.id === trainingId)
  return training?.title || 'Formation inconnue'
}

const getCenterName = (centerId: number | null | undefined) => {
  if (!centerId) return null
  const center = centers.value.find(c => c.id === centerId)
  return center?.name || 'Centre inconnu'
}

const getSessionStatusLabel = (status: string) => {
  const labels = {
    [TrainingSessionStatusEnum.OPEN_FOR_REGISTRATION]: 'Ouverte aux inscriptions',
    [TrainingSessionStatusEnum.CLOSE_FOR_REGISTRATION]: 'Fermée aux inscriptions',
    [TrainingSessionStatusEnum.ONGOING]: 'En cours',
    [TrainingSessionStatusEnum.COMPLETED]: 'Terminée'
  }
  return labels[status as TrainingSessionStatusEnum] || status
}

const formatDate = (date: string | undefined) => {
  if (!date) return 'Non définie'
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatCurrency = (amount: number | undefined) => {
  if (!amount) return 'Non défini'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    registration.value.attachments = Array.from(input.files).map(file => file.name)
  }
}

const handleSubmit = async () => {
  if (!session.value) return

  // Vérifier si l'inscription est possible
  if (!canRegister.value) {
    showToast({
      message: 'L\'inscription n\'est pas possible pour cette session',
      type: 'warning'
    })
    return
  }

  // Validation du formulaire
  const { valid } = await formRef.value.validate()
  if (!valid) return

  // Préparer les données d'inscription
  const registrationData = {
    email: registration.value.email,
    target_session_id: session.value.id,
    first_name: registration.value.first_name,
    last_name: registration.value.last_name,
    phone_number: registration.value.phone_number,
    country_code: registration.value.country_code,
    attachments: registration.value.attachments
  }

  // Stocker les données en attente et afficher le modal de paiement
  pendingRegistrationData.value = registrationData
  showPaymentModal.value = true
}

const clearError = () => {
  error.value = ''
}

// Méthodes pour le modal de paiement
const handlePayment = async () => {
  if (!pendingRegistrationData.value) return

  try {
    isProcessingPayment.value = true
    
    // 1. D'abord créer la candidature
    console.log('Création de la candidature:', pendingRegistrationData.value)
    const applicationResponse = await studentApplicationsService.createStudentApplication(pendingRegistrationData.value)
    
    console.log('Candidature créée:', applicationResponse)
    console.log('Structure de la réponse:', JSON.stringify(applicationResponse, null, 2))
    
    // 2. Récupérer les informations complètes de la candidature créée
    console.log('Récupération des informations de la candidature créée...')
    const fullApplication = await studentApplicationsService.getStudentApplicationById(applicationResponse.data.id)
    console.log('Candidature complète récupérée:', fullApplication)
    
    // 3. Initier le paiement avec l'ID de la candidature (contournement CORS)
    const applicationId = applicationResponse.data.id
    
    console.log('ID de la candidature créée:', applicationId)
    console.log('ID de la session de formation:', applicationResponse.data.target_session_id)
    console.log('Montant des frais d\'inscription:', session.value?.registration_fee)
    console.log('Utilisation de l\'endpoint submit avec l\'ID de candidature dans le body:', applicationId)
    
    const paymentResponse = await studentApplicationsService.submitStudentApplication(applicationId)
    
    console.log('Réponse du paiement:', paymentResponse)
    
    // 3. Rediriger vers la plateforme de paiement
    if (paymentResponse.data?.payment_link) {
      console.log('Redirection vers:', paymentResponse.data.payment_link)
      window.location.href = paymentResponse.data.payment_link
    } else {
      console.log('Aucun lien de paiement trouvé dans la réponse:', paymentResponse.data)
      showToast({
        message: 'Aucun lien de paiement trouvé',
        type: 'error'
      })
    }
    
  } catch (error: any) {
    console.error('Erreur lors du processus de paiement:', error)
    console.error('Détails de l\'erreur:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })
    
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'initialisation du paiement'
      showToast({
        message: errorMessage,
        type: 'error'
      })
    } else {
      showToast({
        message: 'Erreur lors de la création de la candidature',
        type: 'error'
      })
    }
  } finally {
    isProcessingPayment.value = false
  }
}

const closePaymentModal = () => {
  showPaymentModal.value = false
  isPaymentCompleted.value = false
  pendingRegistrationData.value = null
}


// Lifecycle
onMounted(() => {
  loadSession()
  fetchTrainings()
  fetchCenters()
})
</script>

<style scoped>
.session-registration-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 3rem;
}

.session-registration-header-card {
  position: relative;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.session-registration-header-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
}

.session-registration-header-overlay {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  padding: 2rem;
  color: white;
}

.session-registration-header-overlay:hover {
  background-color: rgba(0, 0, 0, 0.5);
}



.session-registration-header-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7));
  border-radius: 12px;
  transition: opacity 0.3s ease;
}

.session-registration-header-content {
  position: relative;
  z-index: 2;
}

.animate-specialty {
  animation: slideInLeft 0.6s ease-out;
}

.animate-title {
  animation: slideInUp 0.8s ease-out;
}

.animate-tag {
  animation: fadeInUp 1s ease-out;
}

.animate-card {
  animation: slideInUp 0.6s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .session-registration-container {
    padding: 1rem;
  }
}
</style>
