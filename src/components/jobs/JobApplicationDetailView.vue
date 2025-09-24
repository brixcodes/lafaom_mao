<template>
  <div class="job-application-detail">
    <!-- Informations du candidat -->
    <div class="candidate-section mb-6">
      <h4 class="text-h6 mb-4 d-flex align-center">
        <VIcon icon="ri-user-line" class="me-2" color="primary" />
        Informations du candidat
      </h4>

      <VCard variant="outlined">
        <VCardText>
          <VRow>
            <!-- Informations principales -->
            <VCol cols="12" md="6">
              <div class="info-group">
                <div class="info-item">
                  <span class="info-label">Nom complet :</span>
                  <div class="d-flex align-center">
                    <span class="info-value">{{ application.first_name }} {{ application.last_name }}</span>
                    <VChip v-if="application.civility" size="x-small" variant="outlined" class="ml-2">
                      {{ application.civility }}
                    </VChip>
                  </div>
                </div>

                <div class="info-item">
                  <span class="info-label">Email :</span>
                  <div class="d-flex align-center">
                    <a :href="`mailto:${application.email}`" class="info-value text-decoration-none text-primary">
                      {{ application.email }}
                    </a>
                    <VBtn icon="ri-external-link-line" size="x-small" variant="text" @click="openEmail" class="ml-2" />
                  </div>
                </div>

                <div class="info-item">
                  <span class="info-label">Téléphone :</span>
                  <div class="d-flex align-center">
                    <a :href="`tel:${application.phone_number}`" class="info-value text-decoration-none text-primary">
                      {{ formatPhoneNumber(application.phone_number, application.country_code) }}
                    </a>
                    <VBtn icon="ri-phone-line" size="x-small" variant="text" @click="callPhone" class="ml-2" />
                  </div>
                </div>
              </div>
            </VCol>

            <!-- Informations supplémentaires -->
            <VCol cols="12" md="6">
              <div class="info-group">
                <div v-if="application.date_of_birth" class="info-item">
                  <span class="info-label">Date de naissance :</span>
                  <span class="info-value">{{ formatDate(application.date_of_birth) }}</span>
                </div>

                <div v-if="application.country_code" class="info-item">
                  <span class="info-label">Code pays :</span>
                  <VChip size="small" variant="outlined">
                    {{ application.country_code }}
                  </VChip>
                </div>

                <div class="info-item">
                  <span class="info-label">Candidature créée :</span>
                  <span class="info-value">{{ formatDateTime(application.created_at) }}</span>
                </div>

                <div v-if="application.updated_at !== application.created_at" class="info-item">
                  <span class="info-label">Dernière modification :</span>
                  <span class="info-value">{{ formatDateTime(application.updated_at) }}</span>
                </div>
              </div>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </div>

    <!-- Informations de la candidature -->
    <div class="application-section mb-6">
      <h4 class="text-h6 mb-4 d-flex align-center">
        <VIcon icon="ri-file-text-line" class="me-2" color="primary" />
        Candidature
      </h4>

      <VCard variant="outlined">
        <VCardText>
          <VRow>
            <!-- Référence et statut -->
            <VCol cols="12" md="6">
              <div class="info-group">
                <div class="info-item">
                  <span class="info-label">Numéro de référence :</span>
                  <div class="d-flex align-center">
                    <code class="info-value">{{ application.application_number }}</code>
                    <VBtn icon="ri-file-copy-line" size="x-small" variant="text"
                      @click="copyToClipboard(application.application_number)" class="ml-2" />
                  </div>
                </div>

                <div class="info-item">
                  <span class="info-label">Statut actuel :</span>
                  <div class="d-flex align-center">
                    <VChip :color="getStatusColor(application.status)" variant="flat"
                      :prepend-icon="getStatusIcon(application.status)" size="small">
                      {{ getStatusLabel(application.status) }}
                    </VChip>

                    <VBtn v-if="canUpdateStatus" icon="ri-edit-line" size="x-small" variant="text"
                      @click="showStatusEditor = !showStatusEditor" class="ml-2" />
                  </div>
                </div>

                <div v-if="application.notes" class="info-item">
                  <span class="info-label">Notes :</span>
                  <div class="info-value notes-content">
                    {{ application.notes }}
                  </div>
                </div>
              </div>
            </VCol>

            <!-- Informations sur l'offre -->
            <VCol cols="12" md="6">
              <div class="info-group">
                <div class="info-item">
                  <span class="info-label">Offre d'emploi :</span>
                  <div class="d-flex align-center">
                    <span class="info-value">{{ jobOfferTitle }}</span>
                    <VBtn icon="ri-external-link-line" size="x-small" variant="text" @click="viewJobOffer"
                      class="ml-2" />
                  </div>
                </div>

                <div class="info-item">
                  <span class="info-label">Documents joints :</span>
                  <VChip size="small" variant="outlined">
                    {{ application.attachments?.length || 0 }} fichier(s)
                  </VChip>
                </div>
              </div>
            </VCol>
          </VRow>

          <!-- Éditeur de statut -->
          <div v-if="showStatusEditor" class="mt-4">
            <VDivider class="mb-4" />

            <h5 class="text-subtitle-1 mb-3">Modifier le statut</h5>

            <VRow>
              <VCol cols="12" md="6">
                <VSelect v-model="newStatus" :items="statusOptions" label="Nouveau statut" variant="outlined"
                  prepend-icon="ri-flag-line" density="compact" />
              </VCol>

              <VCol cols="12" md="6" class="d-flex align-center gap-2">
                <VBtn variant="flat" color="primary" size="small" prepend-icon="ri-check-line" :loading="updatingStatus"
                  :disabled="!newStatus || newStatus === application.status" @click="updateStatus">
                  Mettre à jour
                </VBtn>

                <VBtn variant="outlined" size="small" prepend-icon="ri-close-line" @click="cancelStatusEdit">
                  Annuler
                </VBtn>
              </VCol>
            </VRow>

            <VTextarea v-model="statusComment" label="Commentaire (optionnel)" variant="outlined" rows="2"
              density="compact" class="mt-3" />
          </div>
        </VCardText>
      </VCard>
    </div>

    <!-- Documents joints -->
    <div v-if="application.attachments && application.attachments.length > 0" class="attachments-section mb-6">
      <h4 class="text-h6 mb-4 d-flex align-center">
        <VIcon icon="ri-attachment-line" class="me-2" color="primary" />
        Documents joints
        <VChip size="small" variant="outlined" class="ml-2">
          {{ application.attachments.length }}
        </VChip>
      </h4>

      <VCard variant="outlined">
        <VCardText>
          <VRow>
            <VCol v-for="(attachment, index) in application.attachments" :key="attachment.id" cols="12" sm="6" md="4">
              <VCard variant="tonal" class="attachment-card"
                :class="{ 'attachment-downloading': downloadingFiles[attachment.id] }">
                <VCardText class="pa-4">
                  <div class="d-flex align-center mb-3">
                    <VIcon :icon="getFileIcon(attachment.name)" size="32" :color="getFileColor(attachment.name)"
                      class="me-3" />

                    <div class="flex-grow-1 overflow-hidden">
                      <div class="text-subtitle-2 text-truncate">
                        {{ getDocumentLabel(attachment.document_type) }}
                      </div>
                      <div class="text-caption text-medium-emphasis text-truncate">
                        {{ attachment.name }}
                      </div>
                    </div>
                  </div>

                  <div class="d-flex justify-space-between align-center">
                    <VChip size="x-small" variant="outlined">
                      {{ getFileExtension(attachment.name).toUpperCase() }}
                    </VChip>

                    <div class="d-flex gap-1">
                      <VBtn icon="ri-eye-line" size="x-small" variant="text" @click="openPreviewDocument(attachment)" />
                      <VBtn icon="ri-download-line" size="x-small" variant="text"
                        :loading="downloadingFiles[attachment.id]" @click="downloadDocument(attachment)" />
                    </div>
                  </div>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>

          <!-- Actions documents -->
          <div class="d-flex justify-end mt-4">
            <VBtn variant="outlined" color="primary" prepend-icon="ri-download-cloud-line" :loading="downloadingAll"
              @click="downloadAllDocuments">
              Télécharger tous les documents
            </VBtn>
          </div>
        </VCardText>
      </VCard>
    </div>

    <!-- Actions -->
    <div class="actions-section">
      <VCard variant="outlined">
        <VCardText>
          <h5 class="text-subtitle-1 mb-4">Actions rapides</h5>

          <div class="d-flex flex-wrap gap-3">
            <VBtn variant="outlined" prepend-icon="ri-mail-send-line" @click="sendEmail">
              Envoyer un email
            </VBtn>

            <VBtn variant="outlined" prepend-icon="ri-phone-line" @click="callPhone">
              Appeler
            </VBtn>

            <VBtn variant="outlined" prepend-icon="ri-file-copy-line" @click="duplicateApplication">
              Dupliquer candidature
            </VBtn>

            <VBtn variant="outlined" color="error" prepend-icon="ri-delete-bin-line" @click="confirmDelete">
              Supprimer candidature
            </VBtn>
          </div>
        </VCardText>
      </VCard>
    </div>

    <!-- Dialog prévisualisation document -->
    <VDialog v-model="previewDialog" max-width="900" scrollable>
      <VCard v-if="previewedDocument">
        <VCardTitle class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <VIcon :icon="getFileIcon(previewedDocument.name)" class="me-2" />
            {{ previewedDocument.name }}
          </div>
          <VBtn icon="ri-close-line" variant="text" size="small" @click="previewDialog = false" />
        </VCardTitle>

        <VCardText>
          <div class="text-center py-8">
            <VIcon icon="ri-file-text-line" size="80" class="text-medium-emphasis mb-4" />
            <h4 class="text-h6 mb-4">Prévisualisation non disponible</h4>
            <p class="text-body-2 text-medium-emphasis mb-4">
              La prévisualisation n'est pas disponible pour ce type de fichier.
            </p>
            <VBtn variant="flat" color="primary" prepend-icon="ri-download-line"
              :loading="downloadingFiles[previewedDocument.id]" @click="downloadDocument(previewedDocument)">
              Télécharger le fichier
            </VBtn>
          </div>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- Dialog confirmation suppression -->
    <VDialog v-model="deleteDialog" max-width="500">
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon icon="ri-error-warning-line" class="me-2" color="error" />
          Confirmer la suppression
        </VCardTitle>

        <VCardText>
          <p class="text-body-1 mb-4">
            Êtes-vous sûr de vouloir supprimer cette candidature ?
          </p>

          <VAlert type="warning" variant="tonal">
            <div class="text-body-2">
              Cette action est irréversible. Tous les documents associés seront également supprimés.
            </div>
          </VAlert>
        </VCardText>

        <VCardActions class="justify-end">
          <VBtn variant="text" @click="deleteDialog = false">Annuler</VBtn>
          <VBtn variant="flat" color="error" :loading="deleting" @click="deleteApplication">
            Supprimer
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJobOffersStore } from '@/stores/jobOffers'
import type { JobApplicationOut as JobApplication, JobApplicationStatus, JobAttachmentOut as JobAttachment } from '@/types/jobOffers'
import { APPLICATION_STATUSES, DOCUMENT_TYPES } from '@/types/jobOffers'

// Props
const props = defineProps<{
  application: JobApplication
}>()

// Emits
const emit = defineEmits<{
  'update-status': [applicationId: string, status: JobApplicationStatus, comment?: string]
  'download-documents': [application: JobApplication]
  'delete-application': [applicationId: string]
}>()

// Composables
const router = useRouter()
const jobOffersStore = useJobOffersStore()

// State
const showStatusEditor = ref(false)
const newStatus = ref<JobApplicationStatus>(props.application.status)
const statusComment = ref('')
const updatingStatus = ref(false)
const downloadingFiles = ref<Record<string, boolean>>({})
const downloadingAll = ref(false)
const previewDialog = ref(false)
const previewedDocument = ref<JobAttachment | null>(null)
const deleteDialog = ref(false)
const deleting = ref(false)

// Computed
const canUpdateStatus = computed(() => {
  return props.application.status === 'pending' || props.application.status === 'processing'
})

const jobOfferTitle = computed(() => {
  const jobOffer = jobOffersStore.jobOffers.find(offer => offer.id === props.application.job_offer_id)
  return jobOffer?.title || 'Offre supprimée'
})

const statusOptions = computed(() =>
  APPLICATION_STATUSES.map(status => ({
    title: status.text,
    value: status.value
  }))
)

// Methods
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
    month: 'long',
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

const getStatusLabel = (status: JobApplicationStatus) => {
  const statusObj = APPLICATION_STATUSES.find(s => s.value === status)
  return statusObj?.text || status
}

const getStatusColor = (status: JobApplicationStatus) => {
  const colors: Record<JobApplicationStatus, string> = {
    pending: 'warning',
    processing: 'info',
    accepted: 'success',
    rejected: 'error',
    cancelled: 'surface'
  }
  return colors[status] || 'surface'
}

const getStatusIcon = (status: JobApplicationStatus) => {
  const icons: Record<JobApplicationStatus, string> = {
    pending: 'ri-time-line',
    processing: 'ri-loader-line',
    accepted: 'ri-check-circle-line',
    rejected: 'ri-close-circle-line',
    cancelled: 'ri-forbid-line'
  }
  return icons[status] || 'ri-question-line'
}

const getDocumentLabel = (docType: string) => {
  const doc = DOCUMENT_TYPES.find(d => d.value === docType)
  return doc?.text || docType
}

const getFileIcon = (filename: string) => {
  const extension = getFileExtension(filename)
  const iconMap: Record<string, string> = {
    pdf: 'ri-file-pdf-line',
    doc: 'ri-file-word-line',
    docx: 'ri-file-word-line',
    jpg: 'ri-image-line',
    jpeg: 'ri-image-line',
    png: 'ri-image-line'
  }
  return iconMap[extension] || 'ri-file-line'
}

const getFileColor = (filename: string) => {
  const extension = getFileExtension(filename)
  const colorMap: Record<string, string> = {
    pdf: 'error',
    doc: 'info',
    docx: 'info',
    jpg: 'success',
    jpeg: 'success',
    png: 'success'
  }
  return colorMap[extension] || 'primary'
}

const getFileExtension = (filename: string) => {
  return filename.split('.').pop()?.toLowerCase() || ''
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // Vous pouvez ajouter une notification de succès ici
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
  }
}

const openEmail = () => {
  const subject = `Candidature ${props.application.application_number}`
  const mailtoUrl = `mailto:${props.application.email}?subject=${encodeURIComponent(subject)}`
  window.open(mailtoUrl, '_blank')
}

const callPhone = () => {
  window.open(`tel:${props.application.phone_number}`, '_self')
}

const viewJobOffer = () => {
  router.push({
    name: 'job-offers-detail',
    params: { id: props.application.job_offer_id }
  })
}

const updateStatus = async () => {
  if (!newStatus.value || newStatus.value === props.application.status) return

  try {
    updatingStatus.value = true
    emit('update-status', props.application.id.toString(), newStatus.value, statusComment.value || undefined)
    showStatusEditor.value = false
    statusComment.value = ''
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error)
  } finally {
    updatingStatus.value = false
  }
}

const cancelStatusEdit = () => {
  showStatusEditor.value = false
  newStatus.value = props.application.status
  statusComment.value = ''
}

const downloadDocument = async (attachment: JobAttachment) => {
  try {
    downloadingFiles.value[attachment.id] = true
    await jobOffersStore.downloadJobAttachment(attachment.id, attachment.name)
  } catch (error) {
    console.error('Erreur lors du téléchargement du document:', error)
  } finally {
    downloadingFiles.value[attachment.id] = false
  }
}

const downloadAllDocuments = async () => {
  if (!props.application.attachments?.length) return

  try {
    downloadingAll.value = true
    emit('download-documents', props.application)
  } catch (error) {
    console.error('Erreur lors du téléchargement des documents:', error)
  } finally {
    downloadingAll.value = false
  }
}

const openPreviewDocument = (attachment: JobAttachment) => {
  previewDocument.value = attachment
  previewDialog.value = true
}

const sendEmail = () => {
  openEmail()
}

const duplicateApplication = () => {
  router.push({
    name: 'job-offers-apply',
    params: { id: props.application.job_offer_id },
    query: {
      duplicate: 'true',
      data: btoa(JSON.stringify({
        first_name: props.application.first_name,
        last_name: props.application.last_name,
        email: props.application.email,
        phone_number: props.application.phone_number,
        civility: props.application.civility,
        country_code: props.application.country_code,
        date_of_birth: props.application.date_of_birth
      }))
    }
  })
}

const confirmDelete = () => {
  deleteDialog.value = true
}

const deleteApplication = async () => {
  try {
    deleting.value = true
    emit('delete-application', props.application.id)
    deleteDialog.value = false
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  } finally {
    deleting.value = false
  }
}

// Watch pour réinitialiser l'état quand l'application change
watch(
  () => props.application,
  (newApplication) => {
    newStatus.value = newApplication.status
    showStatusEditor.value = false
    statusComment.value = ''
  }
)
</script>

<style scoped>
.job-application-detail {
  max-width: 100%;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface-variant));
}

.info-value {
  font-size: 0.95rem;
  color: rgb(var(--v-theme-on-surface));
}

.notes-content {
  background-color: rgba(var(--v-theme-on-surface), 0.05);
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.875rem;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
}

.attachment-card {
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.attachment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.attachment-downloading {
  opacity: 0.7;
}

code {
  background-color: rgba(var(--v-theme-on-surface), 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-family: 'Courier New', monospace;
  font-weight: 500;
}

@media (max-width: 959px) {
  .info-item {
    gap: 8px;
  }

  .info-label {
    font-size: 0.8rem;
  }

  .info-value {
    font-size: 0.9rem;
  }
}
</style>
