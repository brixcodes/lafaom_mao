<template>
  <div class="cabinet-application-detail-page">
    <!-- En-tête -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 mb-2">
          <VIcon icon="ri-building-line" class="me-3" color="primary" />
          Détails de la candidature
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Cabinet : {{ application?.company_name }}
        </p>
      </div>
      <div class="d-flex gap-2">
        <VBtn 
          variant="outlined" 
          prepend-icon="ri-arrow-left-line" 
          :to="{ name: 'cabinet-applications' }"
        >
          Retour à la liste
        </VBtn>
        <VBtn 
          v-if="hasPermissions([PermissionEnum.CAN_CHANGE_JOB_APPLICATION_STATUS]) && application?.status === 'pending'"
          color="success" 
          prepend-icon="ri-check-line"
          @click="approveApplication"
          :loading="isLoading"
        >
          Approuver
        </VBtn>
        <VBtn 
          v-if="hasPermissions([PermissionEnum.CAN_CHANGE_JOB_APPLICATION_STATUS]) && application?.status === 'pending'"
          color="error" 
          prepend-icon="ri-close-line"
          @click="rejectApplication"
          :loading="isLoading"
        >
          Rejeter
        </VBtn>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="d-flex justify-center py-8">
      <VProgressCircular indeterminate color="primary" size="64" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="d-flex justify-center py-8">
      <VAlert type="error" variant="tonal">
        {{ error }}
      </VAlert>
    </div>

    <!-- Application details -->
    <div v-else-if="application">
      <VRow>
        <!-- Informations principales -->
        <VCol cols="12" lg="8">
          <!-- Informations de l'entreprise -->
          <VCard class="mb-6">
            <VCardTitle class="d-flex align-center">
              <VIcon icon="ri-building-line" class="me-2" color="primary" />
              Informations de l'entreprise
            </VCardTitle>
            <VCardText>
              <VRow>
                <VCol cols="12" md="6">
                  <div class="mb-4">
                    <div class="text-body-2 text-medium-emphasis mb-1">Nom de l'entreprise</div>
                    <div class="text-h6">{{ application.company_name }}</div>
                  </div>
                </VCol>
                <VCol cols="12" md="6">
                  <div class="mb-4">
                    <div class="text-body-2 text-medium-emphasis mb-1">Email de contact</div>
                    <div class="text-body-1">
                      <VIcon icon="ri-mail-line" size="small" class="me-1" />
                      {{ application.contact_email }}
                    </div>
                  </div>
                </VCol>
                <VCol cols="12" md="6">
                  <div class="mb-4">
                    <div class="text-body-2 text-medium-emphasis mb-1">Téléphone</div>
                    <div class="text-body-1">
                      <VIcon icon="ri-phone-line" size="small" class="me-1" />
                      {{ application.contact_phone }}
                    </div>
                  </div>
                </VCol>
                <VCol cols="12" md="6">
                  <div class="mb-4">
                    <div class="text-body-2 text-medium-emphasis mb-1">Numéro d'enregistrement</div>
                    <div class="text-body-1">
                      <VIcon icon="ri-file-text-line" size="small" class="me-1" />
                      {{ application.registration_number }}
                    </div>
                  </div>
                </VCol>
                <VCol cols="12">
                  <div class="mb-4">
                    <div class="text-body-2 text-medium-emphasis mb-1">Adresse</div>
                    <div class="text-body-1">
                      <VIcon icon="ri-map-pin-line" size="small" class="me-1" />
                      {{ application.address }}
                    </div>
                  </div>
                </VCol>
                <VCol cols="12" md="6">
                  <div class="mb-4">
                    <div class="text-body-2 text-medium-emphasis mb-1">Années d'expérience</div>
                    <div class="text-body-1">
                      <VIcon icon="ri-calendar-line" size="small" class="me-1" />
                      {{ application.experience_years }} ans
                    </div>
                  </div>
                </VCol>
                <VCol cols="12" md="6" v-if="application.qualifications">
                  <div class="mb-4">
                    <div class="text-body-2 text-medium-emphasis mb-1">Qualifications</div>
                    <div class="text-body-1">
                      <VIcon icon="ri-award-line" size="small" class="me-1" />
                      {{ application.qualifications }}
                    </div>
                  </div>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>

          <!-- Propositions -->
          <VCard class="mb-6" v-if="application.technical_proposal || application.financial_proposal">
            <VCardTitle class="d-flex align-center">
              <VIcon icon="ri-file-text-line" class="me-2" color="primary" />
              Propositions
            </VCardTitle>
            <VCardText>
              <div v-if="application.technical_proposal" class="mb-4">
                <div class="text-body-2 text-medium-emphasis mb-2">Proposition technique</div>
                <div class="text-body-1">{{ application.technical_proposal }}</div>
              </div>
              <div v-if="application.financial_proposal">
                <div class="text-body-2 text-medium-emphasis mb-2">Proposition financière</div>
                <div class="text-body-1">{{ application.financial_proposal }}</div>
              </div>
            </VCardText>
          </VCard>

          <!-- Références -->
          <VCard class="mb-6" v-if="application.references">
            <VCardTitle class="d-flex align-center">
              <VIcon icon="ri-user-star-line" class="me-2" color="primary" />
              Références
            </VCardTitle>
            <VCardText>
              <div class="text-body-1">{{ application.references }}</div>
            </VCardText>
          </VCard>
        </VCol>

        <!-- Sidebar -->
        <VCol cols="12" lg="4">
          <!-- Statut et informations de paiement -->
          <VCard class="mb-6">
            <VCardTitle class="d-flex align-center">
              <VIcon icon="ri-information-line" class="me-2" color="primary" />
              Statut et paiement
            </VCardTitle>
            <VCardText>
              <div class="mb-4">
                <div class="text-body-2 text-medium-emphasis mb-2">Statut de la candidature</div>
                <VChip 
                  :color="getStatusColor(application.status)" 
                  variant="tonal"
                  class="mb-2"
                >
                  {{ getStatusLabel(application.status) }}
                </VChip>
              </div>
              
              <div class="mb-4">
                <div class="text-body-2 text-medium-emphasis mb-2">Statut du paiement</div>
                <VChip 
                  :color="getPaymentStatusColor(application.payment_status)" 
                  variant="tonal"
                  class="mb-2"
                >
                  {{ getPaymentStatusLabel(application.payment_status) }}
                </VChip>
              </div>

              <div class="mb-4">
                <div class="text-body-2 text-medium-emphasis mb-2">Montant</div>
                <div class="text-h6">{{ formatCurrency(application.payment_amount) }}</div>
              </div>

              <div class="mb-4" v-if="application.payment_reference">
                <div class="text-body-2 text-medium-emphasis mb-2">Référence de paiement</div>
                <div class="text-body-1 font-mono">{{ application.payment_reference }}</div>
              </div>

              <div class="mb-4" v-if="application.payment_date">
                <div class="text-body-2 text-medium-emphasis mb-2">Date de paiement</div>
                <div class="text-body-1">{{ formatDate(application.payment_date) }}</div>
              </div>

              <div class="mb-4" v-if="application.payment_url">
                <VBtn 
                  color="primary" 
                  variant="outlined" 
                  block
                  :href="application.payment_url"
                  target="_blank"
                >
                  <VIcon icon="ri-money-euro-circle-line" class="me-2" />
                  Lien de paiement
                </VBtn>
              </div>
            </VCardText>
          </VCard>

          <!-- Informations système -->
          <VCard class="mb-6">
            <VCardTitle class="d-flex align-center">
              <VIcon icon="ri-settings-line" class="me-2" color="primary" />
              Informations système
            </VCardTitle>
            <VCardText>
              <div class="mb-4">
                <div class="text-body-2 text-medium-emphasis mb-2">Date de soumission</div>
                <div class="text-body-1">{{ formatDate(application.created_at) }}</div>
              </div>

              <div class="mb-4">
                <div class="text-body-2 text-medium-emphasis mb-2">Dernière modification</div>
                <div class="text-body-1">{{ formatDate(application.updated_at) }}</div>
              </div>

              <div class="mb-4">
                <div class="text-body-2 text-medium-emphasis mb-2">Compte créé</div>
                <VChip 
                  :color="application.account_created ? 'success' : 'warning'" 
                  size="small"
                  variant="tonal"
                >
                  {{ application.account_created ? 'Oui' : 'Non' }}
                </VChip>
              </div>

              <div class="mb-4">
                <div class="text-body-2 text-medium-emphasis mb-2">Identifiants envoyés</div>
                <VChip 
                  :color="application.credentials_sent ? 'success' : 'warning'" 
                  size="small"
                  variant="tonal"
                >
                  {{ application.credentials_sent ? 'Oui' : 'Non' }}
                </VChip>
              </div>
            </VCardText>
          </VCard>

          <!-- Actions rapides -->
          <VCard v-if="hasPermissions([PermissionEnum.CAN_APPROVE_CABINET_APPLICATION, PermissionEnum.CAN_REJECT_CABINET_APPLICATION])">
            <VCardTitle class="d-flex align-center">
              <VIcon icon="ri-tools-line" class="me-2" color="primary" />
              Actions
            </VCardTitle>
            <VCardText>
              <VBtn 
                v-if="hasPermissions([PermissionEnum.CAN_CHANGE_JOB_APPLICATION_STATUS]) && application.status === 'pending'"
                color="success" 
                variant="outlined" 
                block
                class="mb-2"
                @click="approveApplication"
                :loading="isLoading"
              >
                <VIcon icon="ri-check-line" class="me-2" />
                Approuver la candidature
              </VBtn>
              
              <VBtn 
                v-if="hasPermissions([PermissionEnum.CAN_CHANGE_JOB_APPLICATION_STATUS]) && application.status === 'pending'"
                color="error" 
                variant="outlined" 
                block
                @click="rejectApplication"
                :loading="isLoading"
              >
                <VIcon icon="ri-close-line" class="me-2" />
                Rejeter la candidature
              </VBtn>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>

    <!-- Dialog de confirmation d'approbation -->
    <VDialog v-model="approveDialog" max-width="500">
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon icon="ri-check-line" class="me-2" color="success" />
          Confirmer l'approbation
        </VCardTitle>
        <VCardText>
          <p>Êtes-vous sûr de vouloir approuver cette candidature de cabinet ?</p>
          <p class="text-body-2 text-medium-emphasis">
            Cette action créera un compte utilisateur pour le cabinet et enverra les identifiants par email.
            Le cabinet pourra alors accéder à la plateforme et commencer à recevoir des clients.
          </p>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="outlined" @click="approveDialog = false">
            Annuler
          </VBtn>
          <VBtn color="success" @click="confirmApprove" :loading="isLoading">
            Approuver
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Dialog de confirmation de rejet -->
    <VDialog v-model="rejectDialog" max-width="500">
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon icon="ri-close-line" class="me-2" color="error" />
          Confirmer le rejet
        </VCardTitle>
        <VCardText>
          <p>Êtes-vous sûr de vouloir rejeter cette candidature de cabinet ?</p>
          <VTextarea
            v-model="rejectReason"
            label="Raison du rejet (optionnel)"
            variant="outlined"
            rows="3"
            class="mt-4"
            hint="Cette raison sera communiquée au cabinet par email"
            persistent-hint
          />
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="outlined" @click="rejectDialog = false">
            Annuler
          </VBtn>
          <VBtn color="error" @click="confirmReject" :loading="isLoading">
            Rejeter
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCabinetStore } from '@/stores/cabinet'
import { useToast } from '@/composables/useToast'
import { useInstantPermissions } from '@/composables/useInstantPermissions'
import { PermissionEnum } from '@/types/permissions'
import { 
  CabinetApplicationStatus, 
  PaymentStatus,
  CABINET_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  CABINET_STATUS_COLORS,
  PAYMENT_STATUS_COLORS
} from '@/types/cabinet'

// Props
const props = defineProps<{
  id: string
}>()

// Composables
const route = useRoute()
const cabinetStore = useCabinetStore()
const { showToast } = useToast()
const { hasPermissions } = useInstantPermissions()

// State
const approveDialog = ref(false)
const rejectDialog = ref(false)
const rejectReason = ref('')

// Computed
const application = computed(() => cabinetStore.currentApplication)
const isLoading = computed(() => cabinetStore.isLoading)
const error = computed(() => cabinetStore.error)

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const getStatusLabel = (status: string) => {
  return CABINET_STATUS_LABELS[status as CabinetApplicationStatus] || status
}

const getPaymentStatusLabel = (status: string) => {
  return PAYMENT_STATUS_LABELS[status as PaymentStatus] || status
}

const getStatusColor = (status: string) => {
  return CABINET_STATUS_COLORS[status as CabinetApplicationStatus] || 'default'
}

const getPaymentStatusColor = (status: string) => {
  return PAYMENT_STATUS_COLORS[status as PaymentStatus] || 'default'
}

const approveApplication = () => {
  approveDialog.value = true
}

const confirmApprove = async () => {
  if (!application.value) return

  try {
    await cabinetStore.approveApplication(application.value.id)
    showToast('Candidature de cabinet approuvée avec succès', 'success')
    approveDialog.value = false
  } catch (error) {
    console.error('Erreur lors de l\'approbation:', error)
    showToast('Erreur lors de l\'approbation de la candidature de cabinet', 'error')
  }
}

const rejectApplication = () => {
  rejectReason.value = ''
  rejectDialog.value = true
}

const confirmReject = async () => {
  if (!application.value) return

  try {
    await cabinetStore.rejectApplication(application.value.id, rejectReason.value || undefined)
    showToast('Candidature de cabinet rejetée avec succès', 'success')
    rejectDialog.value = false
    rejectReason.value = ''
  } catch (error) {
    console.error('Erreur lors du rejet:', error)
    showToast('Erreur lors du rejet de la candidature de cabinet', 'error')
  }
}

// Lifecycle
onMounted(async () => {
  try {
    const applicationId = props.id || route.params.id as string
    if (applicationId) {
      await cabinetStore.fetchApplication(applicationId)
    }
  } catch (error) {
    console.error('Erreur lors du chargement de la candidature:', error)
  }
})
</script>

<style scoped>
.cabinet-application-detail-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}
</style>
