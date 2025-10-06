<template>
  <div class="my-applications-page">
    <!-- En-tête -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 mb-2">
          <VIcon icon="ri-file-user-line" class="me-3" color="primary" />
          Mes candidatures
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Consultez et suivez l'état de vos candidatures
        </p>
      </div>
      <VBtn prepend-icon="ri-refresh-line" variant="outlined" color="primary" @click="refreshData"
        :loading="jobOffersStore.isLoading">
        Actualiser
      </VBtn>
    </div>

    <!-- Filtres et recherche -->
    <VCard class="mb-6">
      <VCardText>
        <VRow>
          <VCol cols="12" md="4">
            <VTextField v-model="filters.search" prepend-inner-icon="ri-search-line"
              label="Rechercher une candidature..." variant="outlined" density="compact" clearable
              @input="debouncedSearch" />
          </VCol>

          <VCol cols="12" md="3">
            <VSelect v-model="filters.status" :items="statusOptions" prepend-inner-icon="ri-filter-3-line"
              label="Statut" variant="outlined" density="compact" clearable @update:model-value="applyFilters" />
          </VCol>

          <VCol cols="12" md="3">
            <VSelect v-model="filters.job_offer_id" :items="jobOfferOptions" prepend-inner-icon="ri-briefcase-line"
              label="Offre d'emploi" variant="outlined" density="compact" clearable
              @update:model-value="applyFilters" />
          </VCol>

          <VCol cols="12" md="2">
            <VSelect v-model="sortBy" :items="sortOptions" prepend-inner-icon="ri-sort-desc" label="Trier par"
              variant="outlined" density="compact" @update:model-value="applyFilters" />
          </VCol>
        </VRow>

      </VCardText>
    </VCard>

    <!-- Indicateur de filtres actifs -->
    <div v-if="hasActiveFilters" class="mb-4">
      <VAlert type="info" variant="tonal" class="d-flex align-center">
        <div class="d-flex align-center flex-grow-1">
          <VIcon icon="ri-filter-line" class="me-2" />
          <span>{{ applications.length }} candidature(s) correspond(ent) aux filtres</span>
        </div>
        <VBtn variant="text" size="small" prepend-icon="ri-close-line" @click="resetFilters">
          Effacer
        </VBtn>
      </VAlert>
    </div>

    <!-- État de chargement -->
    <div v-if="jobOffersStore.isLoading" class="text-center py-12">
      <VProgressCircular indeterminate size="60" width="6" color="primary" class="mb-4" />
      <p class="text-body-1 text-medium-emphasis">Chargement de vos candidatures...</p>
    </div>

    <!-- Liste des candidatures -->
    <div v-else-if="applications.length > 0">
      <VRow>
        <VCol v-for="application in applications" :key="application.id" cols="12" md="6" lg="4">
          <VCard class="mx-auto application-card pa-2" elevation="2" hover>
            <!-- Header avec avatar et nom -->
            <VCardItem>
              <template #prepend>
                <VAvatar :color="getAvatarColor(application.first_name)" size="40">
                  <span class="text-white font-weight-bold text-body-1">
                    {{ getInitials(application.first_name, application.last_name) }}
                  </span>
                </VAvatar>
              </template>
              <VCardTitle class="text-h6 line-clamp-1">
                {{ application.first_name }} {{ application.last_name }}
              </VCardTitle>
              <VCardSubtitle class="d-flex align-center gap-2">
                <span class="text-body-2">{{ application.application_number }}</span>
                <VChip :color="getStatusColor(application.status)" size="x-small"
                  :prepend-icon="getStatusIcon(application.status)">
                  {{ getStatusLabel(application.status) }}
                </VChip>
              </VCardSubtitle>
            </VCardItem>

            <!-- Contenu principal -->
            <VCardText>
              <!-- Offre d'emploi -->
              <div class="mb-3 h3">
                <VIcon icon="ri-briefcase-line" size="small" class="me-2" />
                {{ truncateText(getJobOfferTitle(application.job_offer_id), 50) }}
              </div>

              <!-- Details -->
              <VRow class="text-body-2 ma-0 pa-0" no-gutters>
                <VCol cols="12" md="6" class="d-flex align-center mb-2">
                  <VIcon icon="ri-mail-line" size="small" class="me-2" />
                  <span class="text-truncate">{{ application.email }}</span>
                </VCol>

                <VCol cols="12" md="6" class="d-flex align-center mb-2">
                  <VIcon icon="ri-phone-line" size="small" class="me-2" />
                  <span>{{ formatPhoneNumber(application.phone_number) }}</span>
                </VCol>

                <VCol cols="12" md="6" class="d-flex align-center mb-2">
                  <VIcon icon="ri-calendar-line" size="small" class="me-2" />
                  <span class="text-body-2">{{ formatDateTime(application.created_at) }}</span>
                </VCol>

                <VCol cols="12" md="6" class="d-flex align-center mb-2">
                  <VIcon icon="ri-file-pdf-line" size="small" class="me-2" />
                  <span class="text-body-2">{{ application.attachments?.length || 0 }} document(s)</span>
                </VCol>

                <VCol cols="12" class="d-flex align-center mb-2 mt-2">
                  <VIcon icon="ri-shield-user-line" size="small" class="me-2" />
                  Statut candidature :
                  <VChip :color="getStatusColor1(application.status as any)" class="mx-1" size="small">
                    {{ getStatusLabel1(application.status as any) }}
                  </VChip>
                </VCol>

                <!-- Indicateur de paiement des frais -->
                <VCol cols="12" class="d-flex align-center mb-2">
                  <VIcon icon="ri-money-dollar-circle-line" size="small" class="me-2" />
                  Frais d'étude :
                  <VChip :color="application.submission_fee > 0 ? 'success' : 'warning'" class="mx-1" size="small">
                    {{ application.submission_fee > 0 ? 'Payés' : 'En attente' }}
                  </VChip>
                </VCol>

              </VRow>
            </VCardText>

            <!-- Actions -->
            <VCardActions>
              <VSpacer />
              <VBtn variant="flat" size="x-small" icon @click="toggleExpanded(application.id)"
                aria-label="Toggle details">
                <VIcon>{{ expandedApplications.includes(application.id) ? 'ri-arrow-up-s-line' :
                  'ri-arrow-down-s-line' }}</VIcon>
              </VBtn>

              <VMenu offset-y>
                <template #activator="{ props }">
                  <VBtn icon="ri-more-2-line" variant="flat" size="x-small" v-bind="props" />
                </template>
                <VList>
                  <VListItem prepend-icon="ri-eye-line" title="Voir les détails"
                    @click="viewApplication(application)" />
                  <VListItem prepend-icon="ri-mail-send-line" title="Envoyer email" @click="sendEmail(application)" />
                  <VListItem v-if="application.attachments && application.attachments.length > 0"
                    prepend-icon="ri-download-line" title="Télécharger documents"
                    @click="downloadDocuments(application)" :loading="downloading[application.id]" />
                  <VDivider />
                  <VListItem v-if="application.submission_fee <= 0" prepend-icon="ri-money-dollar-circle-line"
                    title="Payer les frais" @click="payFees(application)" />
                </VList>
              </VMenu>
            </VCardActions>

            <!-- Expandable Details -->
            <VExpandTransition>
              <div v-show="expandedApplications.includes(application.id)">
                <VDivider class="mx-4" />
                <VCardText class="pt-0">
                  <div class="mt-2">
                    <div class="text-caption text-medium-emphasis mb-2">Informations complémentaires</div>

                    <div v-if="application.civility" class="mb-1">
                      <span class="text-body-2 font-weight-medium">Civilité :</span>
                      <span class="text-body-2 ml-2">{{ application.civility }}</span>
                    </div>

                    <div v-if="application.date_of_birth" class="mb-1">
                      <span class="text-body-2 font-weight-medium">Date de naissance :</span>
                      <span class="text-body-2 ml-2">{{ formatDate(application.date_of_birth) }}</span>
                    </div>

                    <div v-if="application.city" class="mb-1">
                      <span class="text-body-2 font-weight-medium">Ville :</span>
                      <span class="text-body-2 ml-2">{{ application.city }}</span>
                    </div>

                    <div v-if="application.updated_at !== application.created_at" class="mb-1">
                      <span class="text-body-2 font-weight-medium">Dernière modification :</span>
                      <span class="text-body-2 ml-2">{{ formatDateTime(application.updated_at) }}</span>
                    </div>

                    <div v-if="application.refusal_reason" class="mb-1">
                      <span class="text-body-2 font-weight-medium">Motif de refus :</span>
                      <span class="text-body-2 ml-2">{{ application.refusal_reason }}</span>
                    </div>

                    <!-- Informations de paiement -->
                    <div v-if="(application as any).payment_info" class="mb-1">
                      <span class="text-body-2 font-weight-medium">Informations de paiement :</span>
                      <span class="text-body-2 ml-2">{{ (application as any).payment_info }}</span>
                    </div>
                  </div>
                </VCardText>
              </div>
            </VExpandTransition>
          </VCard>
        </VCol>
      </VRow>

      <!-- Pagination -->
      <div class="d-flex justify-center mt-6">
        <VPagination v-model="currentPage" :length="totalPages" :total-visible="7" @update:model-value="changePage" />
      </div>
    </div>

    <!-- État vide -->
    <div v-else class="text-center py-12">
      <VIcon icon="ri-file-user-line" size="80" class="text-medium-emphasis mb-6" />
      <h3 class="text-h5 mb-4">Aucune candidature trouvée</h3>
      <p class="text-body-1 text-medium-emphasis mb-6">
        <template v-if="hasActiveFilters">
          Aucune candidature ne correspond à vos critères de recherche.
        </template>
        <template v-else>
          Vous n'avez pas encore soumis de candidatures.
        </template>
      </p>

      <div class="d-flex justify-center gap-3">
        <VBtn v-if="hasActiveFilters" variant="outlined" prepend-icon="ri-filter-off-line" @click="resetFilters">
          Réinitialiser les filtres
        </VBtn>

        <VBtn variant="flat" color="primary" prepend-icon="ri-add-line"
          @click="$router.push({ name: 'job-offers-list' })">
          Voir les offres d'emploi
        </VBtn>
      </div>
    </div>

    <!-- Dialog paiement des frais -->
    <VDialog v-model="paymentDialog" max-width="500">
      <VCard>
        <VCardTitle>
          <VIcon icon="ri-money-dollar-circle-line" class="me-2" />
          Paiement des frais d'étude
        </VCardTitle>

        <VCardText>
          <p v-if="selectedApplication" class="text-body-2 mb-4">
            Candidature <strong>{{ selectedApplication.application_number }}</strong>
          </p>

          <VAlert type="info" variant="tonal" class="mb-4">
            <div class="text-body-2">
              Les frais d'étude doivent être payés pour que votre candidature soit prise en compte.
            </div>
          </VAlert>

          <VTextField v-model="paymentAmount" label="Montant des frais (FCFA)" type="number" variant="outlined"
            prepend-icon="ri-money-dollar-circle-line" readonly :value="selectedApplication?.submission_fee || 0" />
        </VCardText>

        <VCardActions class="justify-end">
          <VBtn variant="text" @click="closePaymentDialog">Annuler</VBtn>
          <VBtn variant="flat" color="primary" :loading="processingPayment" @click="processPayment">
            Procéder au paiement
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useJobOffersStore } from '@/stores/jobOffers'
import type { JobApplication } from '@/types/jobOffers'
import { APPLICATION_STATUSES } from '@/types/jobOffers'

// Composables
const router = useRouter()
const jobOffersStore = useJobOffersStore()

// State
const paymentDialog = ref(false)
const selectedApplication = ref<JobApplication | null>(null)
const processingPayment = ref(false)
const downloading = ref<Record<string, boolean>>({})
const expandedApplications = ref<number[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const sortBy = ref('created_at')
const sortOrder = ref<'asc' | 'desc'>('desc')
const paymentAmount = ref('') // Montant dynamique basé sur submission_fee

// TypeScript : définir les statuts possibles
type LocalJobApplicationStatus = 'RECEIVED' | 'REFUSED' | 'APPROVED';

// Couleurs associées aux statuts
const statusColors: Record<LocalJobApplicationStatus, string> = {
  RECEIVED: 'primary',
  REFUSED: 'error',
  APPROVED: 'success',
};

// Icônes associées aux statuts
const statusIcons: Record<LocalJobApplicationStatus, string> = {
  RECEIVED: 'ri-mail-line',
  REFUSED: 'ri-close-circle-line',
  APPROVED: 'ri-check-line',
};

// Labels à afficher
const statusLabels: Record<LocalJobApplicationStatus, string> = {
  RECEIVED: 'En étude de dossier',
  REFUSED: 'Refusée',
  APPROVED: 'Approuvée',
};

// Fonctions utilitaires pour le template
const getStatusColor1 = (status: LocalJobApplicationStatus) => statusColors[status] || 'grey lighten-2';
const getStatusIcon1 = (status: LocalJobApplicationStatus) => statusIcons[status] || 'ri-question-line';
const getStatusLabel1 = (status: LocalJobApplicationStatus) => statusLabels[status] || status;

const filters = reactive({
  search: '',
  status: '',
  job_offer_id: ''
})

// Computed
const applications = computed(() => {
  // Filtrer les candidatures de l'utilisateur connecté
  // Note: Ce filtrage sera amélioré côté backend
  return jobOffersStore.jobApplications
})

const totalPages = computed(() => {
  return Math.ceil(jobOffersStore.applicationsPagination.total / jobOffersStore.applicationsPagination.pageSize)
})

const hasActiveFilters = computed(() => {
  return filters.search !== '' || filters.status !== '' || filters.job_offer_id !== ''
})

// Options
const statusOptions = APPLICATION_STATUSES.map(status => ({
  title: status.text,
  value: status.value
}))

const sortOptions = [
  { title: 'Plus récentes', value: 'created_at' },
  { title: 'Plus anciennes', value: 'created_at_asc' },
  { title: 'Numéro de candidature', value: 'application_number' },
  { title: 'Statut', value: 'status' }
]

const jobOfferOptions = computed(() => {
  return jobOffersStore.jobOffers.map(offer => ({
    title: offer.title,
    value: offer.id
  }))
})

// Methods
const refreshData = async () => {
  await loadApplications()
}

const loadApplications = async () => {
  try {
    // Déterminer l'ordre de tri
    let orderBy = sortBy.value
    let asc: 'asc' | 'desc' = 'desc'

    if (sortBy.value === 'created_at_asc') {
      orderBy = 'created_at'
      asc = 'asc'
    } else if (sortBy.value !== 'created_at') {
      asc = 'asc'
    }

    await jobOffersStore.fetchMyJobApplications({
      search: filters.search || undefined,
      status: filters.status || undefined as any,
      job_offer_id: filters.job_offer_id || undefined,
      page: currentPage.value,
      page_size: pageSize.value,
      order_by: orderBy as 'created_at' | 'application_number' | 'status',
      asc: asc
    })
  } catch (error) {
    console.error('Erreur lors du chargement des candidatures:', error)
  }
}

const debouncedSearch = (() => {
  let timeout: ReturnType<typeof setTimeout>
  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      applyFilters()
    }, 500)
  }
})()

const applyFilters = () => {
  currentPage.value = 1
  loadApplications()
}

const resetFilters = () => {
  filters.search = ''
  filters.status = ''
  filters.job_offer_id = ''
  sortBy.value = 'created_at'
  applyFilters()
}

const changePage = (page: number) => {
  currentPage.value = page
  loadApplications()
}

const toggleExpanded = (applicationId: number) => {
  const index = expandedApplications.value.indexOf(applicationId)
  if (index > -1) {
    expandedApplications.value.splice(index, 1)
  } else {
    expandedApplications.value.push(applicationId)
  }
}

const truncateText = (text: string, maxLength: number = 50): string => {
  if (!text) return ""
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
}

const getJobOfferTitle = (jobOfferId: string) => {
  const jobOffer = jobOffersStore.jobOffers.find(offer => offer.id === jobOfferId)
  return jobOffer?.title || 'Offre supprimée'
}

const getStatusLabel = (status: string) => {
  const statusObj = APPLICATION_STATUSES.find(s => s.value === status)
  return statusObj?.text || status
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'warning',
    processing: 'info',
    accepted: 'success',
    rejected: 'error',
    cancelled: 'surface'
  }
  return colors[status] || 'surface'
}

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    pending: 'ri-time-line',
    processing: 'ri-loader-line',
    accepted: 'ri-check-circle-line',
    rejected: 'ri-close-circle-line',
    cancelled: 'ri-forbid-line'
  }
  return icons[status] || 'ri-question-line'
}

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

const getAvatarColor = (name: string) => {
  const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'error']
  const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0)
  return colors[hash % colors.length]
}

const formatPhoneNumber = (phone: string, countryCode?: string) => {
  if (countryCode && !phone.startsWith('+')) {
    return `${countryCode} ${phone}`
  }
  return phone
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const viewApplication = (application: JobApplication) => {
  router.push({
    name: 'job-applications-detail',
    params: { id: application.id.toString() }
  })
}

const downloadDocuments = async (application: JobApplication) => {
  if (!application.attachments || application.attachments.length === 0) return

  try {
    downloading.value[application.id] = true

    for (const attachment of application.attachments) {
      await jobOffersStore.downloadJobAttachment(attachment.id.toString(), attachment.name)
    }

  } catch (error) {
    console.error('Erreur lors du téléchargement des documents:', error)
  } finally {
    downloading.value[application.id] = false
  }
}

const sendEmail = (application: JobApplication) => {
  const subject = `Candidature ${application.application_number}`
  const mailtoUrl = `mailto:${application.email}?subject=${encodeURIComponent(subject)}`
  window.open(mailtoUrl, '_blank')
}

const payFees = (application: JobApplication) => {
  selectedApplication.value = application
  paymentAmount.value = application.submission_fee?.toString() || '0'
  paymentDialog.value = true
}

const closePaymentDialog = () => {
  paymentDialog.value = false
  selectedApplication.value = null
}

const processPayment = async () => {
  if (!selectedApplication.value) return

  try {
    processingPayment.value = true

    // Construire l'URL de paiement avec les paramètres nécessaires
    const paymentUrl = `https://lafaom.vertex-cam.com/api/v1/payments/initiate-payment`

    // Paramètres pour l'initiation du paiement
    const paymentParams = {
      application_id: selectedApplication.value.id,
      amount: selectedApplication.value.submission_fee,
      currency: selectedApplication.value.currency || 'XOF',
      application_number: selectedApplication.value.application_number
    }

    console.log('Redirection vers le paiement:', paymentUrl, paymentParams)

    // Rediriger vers la page de paiement
    window.open(paymentUrl, '_blank')

    paymentDialog.value = false

  } catch (error) {
    console.error('Erreur lors du paiement:', error)
  } finally {
    processingPayment.value = false
  }
}

// Lifecycle
onMounted(async () => {
  // Charger les offres d'emploi pour les filtres
  try {
    await jobOffersStore.fetchJobOffers()
  } catch (error) {
    console.error('Erreur lors du chargement des offres d\'emploi:', error)
  }

  // Charger les candidatures
  loadApplications()
})

// Watch filters for real-time updates
watch(
  () => filters.search,
  () => {
    if (filters.search === '') {
      applyFilters()
    }
  }
)
</script>

<style scoped>
.my-applications-page {
  padding: 24px;
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
}

.application-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

.application-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
  border-color: rgba(var(--v-theme-primary), 0.2);
}

.application-card .v-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
}

.application-card .v-card-subtitle {
  opacity: 0.8;
  font-size: 0.85rem;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

code {
  background-color: rgba(var(--v-theme-on-surface), 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-family: 'Courier New', monospace;
}

@media (max-width: 960px) {
  .my-applications-page {
    padding: 16px;
  }

  .application-card {
    max-width: none !important;
  }
}
</style>
