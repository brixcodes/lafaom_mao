<template>
  <VContainer class="application-detail-container">
    <!-- En-tête avec bouton retour -->
    <div class="d-flex align-center mb-4">
      <VBtn icon variant="text" class="mr-3" @click="goBack">
        <VIcon icon="ri-arrow-left-line" color="primary" />
      </VBtn>
      <div>
        <h1 class="font-weight-bold mb-1">Détails de la candidature</h1>
        <p class="text-body-2 text-secondary mb-0">
          Consultez les informations de la candidature et gérez son statut.
        </p>
      </div>
    </div>

    <VFadeTransition>
      <VRow v-if="application">
        <VCol cols="12">
          <!-- En-tête avec informations principales -->
          <VSlideYTransition>
            <VCard class="mb-6 application-header-card overflow-hidden" elevation="3">
              <div class="application-header-overlay">
                <div class="application-header-content">
                  <div class="d-flex align-center mb-4">
                    <VAvatar :color="getAvatarColor(application.first_name)" size="64" class="me-4 border-white">
                      <span class="text-white font-weight-bold text-h5">
                        {{ getInitials(application.first_name, application.last_name) }}
                      </span>
                    </VAvatar>
                    <div>
                      <h1 class="text-h4 font-weight-bold text-white mb-2 animate-title">
                        {{ application.first_name }} {{ application.last_name }}
                      </h1>
                      <div class="text-caption text-white mb-2">
                        Candidature {{ application.application_number }}
                      </div>
                      <div class="text-caption text-white">
                        Soumise le {{ formatDate(application.created_at) }}
                      </div>
                    </div>
                  </div>

                  <VSlideXTransition group>
                    <VChip key="status-chip" :color="getStatusColor(application.status)"
                      :prepend-icon="getStatusIcon(application.status)" variant="elevated" size="large"
                      class="mr-2 mb-2 animate-tag">
                      {{ getStatusLabel(application.status) }}
                    </VChip>

                    <VChip v-if="application.job_offer?.title" key="job-offer-chip" color="white" variant="outlined"
                      size="small" class="mr-2 mb-2 animate-tag" prepend-icon="ri-briefcase-line">
                      {{ application.job_offer.title }}
                    </VChip>
                  </VSlideXTransition>
                </div>
              </div>
            </VCard>
          </VSlideYTransition>

          <!-- Contenu principal -->
          <VRow>
            <VCol cols="12" md="5">
              <!-- Informations personnelles -->
              <VSlideYTransition>
                <VCard class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-user-line</VIcon>
                    <span class="text-h6">Informations personnelles</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="py-4">
                    <VRow>
                      <VCol cols="12" md="7">
                        <div class="info-item mb-3">
                          <div>Nom complet</div>
                          <div class="info-value">{{ application.first_name }} {{ application.last_name }}</div>
                        </div>

                        <div class="info-item mb-3">
                          <div>Adresse Email</div>
                          <div class="info-value">
                            <a :href="`mailto:${application.email}`" class="text-decoration-none info-value">
                              {{ application.email }}
                            </a>
                          </div>
                        </div>

                        <div class="info-item mb-3">
                          <div>Téléphone</div>
                          <div class="info-value">
                            <a :href="`tel:${application.phone_number}`" class="text-decoration-none info-value">
                              {{ formatPhoneNumber(application.phone_number, application.country_code) }}
                            </a>
                          </div>
                        </div>
                      </VCol>

                      <VCol cols="12" md="5">
                        <div v-if="application.date_of_birth" class="info-item mb-3">
                          <div>Date de naissance</div>
                          <div class="info-value">{{ formatDate(application.date_of_birth) }}</div>
                        </div>

                        <div v-if="application.city" class="info-item mb-3">
                          <div class="info-label">Ville</div>
                          <div class="info-value">{{ application.city }}</div>
                        </div>

                        <div v-if="application.address" class="info-item mb-3">
                          <div class="info-label">Adresse</div>
                          <div class="info-value">{{ application.address }}</div>
                        </div>
                      </VCol>
                    </VRow>
                  </VCardText>
                </VCard>
              </VSlideYTransition>
            </VCol>

            <!-- Sidebar avec informations et actions -->
            <VCol cols="12" md="7">
              <VSlideXReverseTransition>
                <VCard class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-information-line</VIcon>
                    <span class="text-h6">Informations candidature</span>
                  </VCardTitle>
                  <VDivider />
                  <VRow>
                    <!-- Colonne gauche -->
                    <VCol cols="12" md="6">
                      <VList lines="two" density="comfortable">
                        <VListItem>
                          <template #prepend>
                            <VIcon color="primary">ri-hashtag</VIcon>
                          </template>
                          <VListItemTitle>Numéro candidature</VListItemTitle>
                          <VListItemSubtitle>{{ application.application_number }}</VListItemSubtitle>
                        </VListItem>

                        <VListItem>
                          <template #prepend>
                            <VIcon color="primary">ri-shield-user-line</VIcon>
                          </template>
                          <VListItemTitle>Statut</VListItemTitle>
                          <VListItemSubtitle>{{ getStatusLabel(application.status) }}</VListItemSubtitle>
                        </VListItem>
                      </VList>
                    </VCol>

                    <!-- Colonne droite -->
                    <VCol cols="12" md="6">
                      <VList lines="two" density="comfortable">
                        <VListItem v-if="application.updated_at !== application.created_at">
                          <template #prepend>
                            <VIcon color="primary">ri-calendar-event-line</VIcon>
                          </template>
                          <VListItemTitle>Dernière modification</VListItemTitle>
                          <VListItemSubtitle>{{ formatDateTime(application.updated_at) }}</VListItemSubtitle>
                        </VListItem>


                        <VListItem>
                          <template #prepend>
                            <VIcon color="primary">ri-calendar-line</VIcon>
                          </template>
                          <VListItemTitle>Date de soumission</VListItemTitle>
                          <VListItemSubtitle>{{ formatDate(application.created_at) }}</VListItemSubtitle>
                        </VListItem>
                      </VList>
                    </VCol>
                  </VRow>



                  <VDivider />

                  <!-- Actions principales -->
                  <VCardActions class="pa-4 d-flex flex-wrap gap-2">
                    <!-- Contact -->
                    <VBtn variant="outlined" prepend-icon="ri-mail-send-line" @click="sendEmail">
                      Contacter
                    </VBtn>

                    <!-- Offre d'emploi -->
                    <VBtn v-if="application && application.job_offer_id" variant="outlined" prepend-icon="ri-eye-line"
                      @click="viewJobOffer">
                      voir l'offre
                    </VBtn>

                    <!-- Approuver (seulement si pas déjà approuvée ou refusée) -->
                    <!-- <VBtn 
                      v-if="application && application.status !== 'APPROVED' && application.status !== 'REFUSED'" 
                      color="success" 
                      prepend-icon="ri-check-line"
                      @click="handleApprove"
                      :loading="isChangingStatus">
                      Approuver
                    </VBtn> -->

                    <!-- Rejeter (seulement si pas déjà approuvée ou refusée) -->
                    <!-- <VBtn 
                      v-if="application && application.status !== 'APPROVED' && application.status !== 'REFUSED'" 
                      color="error" 
                      prepend-icon="ri-close-line"
                      @click="handleReject"
                      :loading="isChangingStatus">
                      Rejeter
                    </VBtn> -->

                    <!-- Supprimer -->
                    <VBtn 
                      color="error" 
                      variant="outlined"
                      prepend-icon="ri-delete-bin-line"
                      @click="handleDelete"
                      :loading="isDeleting">
                      Supprimer
                    </VBtn>

                    <!-- Télécharger tous les documents -->
                    <!-- <VBtn v-if="application && application.attachments && application.attachments.length > 0"
                      variant="outlined" prepend-icon="ri-download-line" @click="downloadAllDocuments"
                      :loading="downloadingAll">
                      Télécharger
                    </VBtn> -->
                  </VCardActions>



                  <!-- Message pour les candidatures finalisées -->
                  <VCardText v-if="application && (application.status === 'APPROVED' || application.status === 'REFUSED' || application.status === 'FINALIZED')" class="pa-4">
                    <VAlert :type="application.status === 'APPROVED' ? 'success' : 'info'" variant="tonal"
                      :icon="application.status === 'APPROVED' ? 'ri-check-circle-line' : 'ri-information-line'">
                      Cette candidature a été {{ application.status === 'APPROVED' ? 'approuvée' : (application.status
                        === 'REFUSED' ?
                        'refusée' : 'finalisée') }} et ne peut plus être modifiée.
                    </VAlert>
                  </VCardText>

                </VCard>
              </VSlideXReverseTransition>
            </VCol>

            

            <VCol cols="12" md="12">
              <!-- Documents joints -->
              <VSlideYTransition>
                <VCard v-if="application.attachments && application.attachments.length > 0" class="mb-6 animate-card"
                  elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-attachment-line</VIcon>
                    <span class="text-h6">Documents joints ({{ application.attachments.length }})</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="py-4">
                    <VRow>
                      <VCol v-for="attachment in application.attachments" :key="attachment.id" cols="12" sm="6">
                        <VCard variant="outlined" class="document-card hover-lift">
                          <VCardText class="pa-4">
                            <div class="d-flex align-center mb-4">
                              <VAvatar :color="getFileColor(attachment.name)" size="48" class="me-3" variant="tonal">
                                <VIcon :icon="getFileIcon(attachment.name)" size="24" />
                              </VAvatar>
                              <div class="flex-grow-1">
                                <div class="text-subtitle-1 font-weight-medium mb-1">{{
                                  getDocumentLabel(attachment.document_type) }}</div>
                                <div class="text-caption text-medium-emphasis">{{ attachment.name }}</div>
                                <div class="text-caption text-medium-emphasis mt-1">
                                  <VIcon icon="ri-calendar-line" size="12" class="me-1" />
                                  {{ formatDate(attachment.upload_date || application.created_at) }}
                                </div>
                              </div>
                            </div>

                            <div class="d-flex gap-2">
                              <VBtn color="primary" variant="outlined" size="small" prepend-icon="ri-eye-line"
                                @click="previewDocument(attachment)" block>
                                Prévisualiser
                              </VBtn>
                              <!-- <VBtn color="success" variant="elevated" size="small" prepend-icon="ri-download-line"
                                @click="downloadDocument(attachment)" :loading="downloadingFiles[attachment.id]" block>
                                Télécharger
                              </VBtn> -->
                            </div>

                            <!-- Informations supplémentaires du fichier -->
                            <div v-if="attachment.file_size" class="mt-3 pt-3 border-t">
                              <div class="d-flex justify-space-between text-caption">
                                <span class="text-medium-emphasis">Taille :</span>
                                <span>{{ formatFileSize(attachment.file_size) }}</span>
                              </div>
                            </div>
                          </VCardText>
                        </VCard>
                      </VCol>
                    </VRow>
                  </VCardText>
                </VCard>
              </VSlideYTransition>

              <!-- Notes -->
              <VSlideYTransition>
                <VCard v-if="application.notes" class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-sticky-note-line</VIcon>
                    <span class="text-h6">Notes</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="py-4">
                    <div class="notes-content">{{ application.notes }}</div>
                  </VCardText>
                </VCard>
              </VSlideYTransition>

              <!-- Raison de rejet -->
              <VSlideYTransition>
                <VCard v-if="application.refusal_reason" class="animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="error" class="mr-2">ri-close-circle-line</VIcon>
                    <span class="text-h6">Raison du rejet</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="py-4">
                    <VAlert type="error" variant="tonal" class="mb-0">
                      {{ application.refusal_reason }}
                    </VAlert>
                  </VCardText>
                </VCard>
              </VSlideYTransition>
            </VCol>
          </VRow>
        </VCol>
      </VRow>
    </VFadeTransition>

    <!-- État de chargement -->
    <VFadeTransition>
      <VRow v-if="isLoading && !application">
        <VCol cols="12" class="text-center py-8">
          <VProgressCircular indeterminate color="primary" size="64" width="6" />
          <div class="mt-4 text-body-1 animate-fade-in">Chargement de la candidature...</div>
        </VCol>
      </VRow>
    </VFadeTransition>

    <!-- État d'erreur -->
    <VFadeTransition>
      <VRow v-if="!isLoading && !application && error">
        <VCol cols="12" class="text-center py-8">
          <VIcon size="x-large" color="error" class="mb-4 animate-bounce">ri-alert-circle-line</VIcon>
          <div class="text-h5 mb-3 animate-fade-in">Erreur de chargement</div>
          <div class="text-body-1 mb-6 animate-fade-in">{{ error }}</div>
          <VBtn color="primary" size="large" @click="loadApplication" prepend-icon="ri-refresh-line"
            class="animate-fade-in">
            Réessayer
          </VBtn>
        </VCol>
      </VRow>
    </VFadeTransition>

    <!-- Dialog pour la raison de rejet -->
    <VDialog v-model="rejectDialog" max-width="500" persistent>
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon color="error" class="mr-2">ri-close-circle-line</VIcon>
          <span>Rejeter la candidature</span>
        </VCardTitle>
        <VDivider />
        <VCardText class="pt-4">
          <VAlert type="warning" variant="tonal" class="mb-4">
            Vous êtes sur le point de rejeter la candidature <strong>{{ application?.application_number }}</strong>.
            Veuillez indiquer la raison du rejet.
          </VAlert>
          <VTextarea
            v-model="rejectReason"
            label="Raison du rejet"
            placeholder="Expliquez pourquoi cette candidature est rejetée..."
            variant="outlined"
            rows="4"
            :rules="[(v) => !!v || 'La raison du rejet est obligatoire']"
            required
          />
        </VCardText>
        <VCardActions class="px-6 pb-4">
          <VSpacer />
          <VBtn variant="outlined" @click="rejectDialog = false; rejectReason = ''">
            Annuler
          </VBtn>
          <VBtn color="error" @click="confirmReject" :disabled="!rejectReason || rejectReason.trim() === ''">
            Confirmer le rejet
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Dialog de confirmation de suppression -->
    <VDialog v-model="deleteDialog" max-width="500" persistent>
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon color="error" class="mr-2">ri-delete-bin-line</VIcon>
          <span>Supprimer la candidature</span>
        </VCardTitle>
        <VDivider />
        <VCardText class="pt-4">
          <VAlert type="error" variant="tonal" class="mb-4">
            <strong>Attention !</strong> Cette action est irréversible.
          </VAlert>
          <p class="text-body-1">
            Êtes-vous sûr de vouloir supprimer la candidature <strong>{{ application?.application_number }}</strong> ?
          </p>
          <p class="text-body-2 text-medium-emphasis mt-2">
            Toutes les données associées à cette candidature seront définitivement supprimées.
          </p>
        </VCardText>
        <VCardActions class="px-6 pb-4">
          <VSpacer />
          <VBtn variant="outlined" @click="deleteDialog = false">
            Annuler
          </VBtn>
          <VBtn color="error" @click="confirmDelete" :loading="isDeleting">
            Supprimer
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VContainer>
</template>

<script>
import { useJobApplicationsStore } from '@/stores/jobApplications'
import { useJobOffersStore } from '@/stores/jobOffers'
import { useAuthStore } from '@/stores/auth'
import { APPLICATION_STATUSES } from '@/types/jobApplications'

export default {
  name: 'JobApplicationDetail',
  setup() {
    const jobApplicationsStore = useJobApplicationsStore()
    const jobOffersStore = useJobOffersStore()
    const authStore = useAuthStore()

    return {
      jobApplicationsStore,
      jobOffersStore,
      authStore
    }
  },
  data() {
    return {
      isLoading: true,
      error: null,
      downloadingFiles: {},
      downloadingAll: false,
      isChangingStatus: false,
      isDeleting: false,
      rejectDialog: false,
      rejectReason: '',
      deleteDialog: false
    }
  },
  computed: {
    applicationId() {
      return this.$route?.params?.id
    },
    application() {
      return this.jobApplicationsStore.currentJobApplication
    },
    currentUser() {
      return this.authStore.user
    },
    jobOfferTitle() {
      if (!this.application?.job_offer_id) {
        return 'Offre d\'emploi'
      }

      const jobOffer = this.jobOffersStore.jobOffers.find(
        offer => offer.id === this.application.job_offer_id
      )

      return jobOffer?.title || 'Offre d\'emploi'
    },

    // Vérifier si le statut est final (approuvé ou refusé)
    isStatusFinal() {
      return this.application && ['APPROVED', 'REFUSED', 'CANCELLED'].includes(this.application.status)
    },

    // Informations du statut en attente de changement
    pendingStatusInfo() {
      if (!this.pendingStatus) return null
      return APPLICATION_STATUSES.find(s => s.value === this.pendingStatus)
    }
  },
  async mounted() {
    await this.loadApplication()
  },
  methods: {
    async loadApplication() {
      if (!this.applicationId) {
        this.error = 'ID de candidature manquant'
        this.isLoading = false
        return
      }

      this.isLoading = true
      this.error = null

      try {
        const numericId = parseInt(this.applicationId, 10)

        // Charger la candidature
        await this.jobApplicationsStore.getJobApplicationById(numericId)

        // Charger les pièces jointes
        if (this.application) {
          await this.jobApplicationsStore.fetchApplicationAttachments(numericId)

          // Ajouter les pièces jointes à la candidature
          if (this.jobApplicationsStore.applicationAttachments.length > 0) {
            this.application.attachments = this.jobApplicationsStore.applicationAttachments
          }
        }

        if (!this.application) {
          this.error = 'Candidature introuvable'
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error)
        this.error = error.message || 'Erreur lors du chargement de la candidature'
      } finally {
        this.isLoading = false
      }
    },



    // Navigation
    goBack() {
      this.$router.back()
    },

    async viewJobOffer() {
      if (this.application?.job_offer_id && this.$router) {
        this.$router.push(`/jobs/offers/${this.application.job_offer_id}`)
      } else {
        console.error('Application ou job_offer_id manquant:', this.application)
      }
    },

    // Actions de communication
    sendEmail() {
      if (this.application?.email) {
        const subject = `Candidature ${this.application.application_number}`
        window.open(`mailto:${this.application.email}?subject=${encodeURIComponent(subject)}`, '_blank')
      }
    },

    // Méthode de test pour déboguer l'API
    async testApiDirectly() {
      if (!this.application) return

      console.log('=== TEST API DIRECT ===')
      console.log('Application ID:', this.application.id)
      console.log('Current Status:', this.application.status)

      // Test avec appel direct
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/job-applications/change-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({
            application_id: this.application.id,
            status: 'ACCEPTED'
          })
        })

        console.log('Response status:', response.status)
        const data = await response.text()
        console.log('Response body:', data)

        if (!response.ok) {
          console.error('Response not OK:', response.statusText)
        }
      } catch (error) {
        console.error('Fetch error:', error)
      }
    },

    // Gestion des documents
    async downloadDocument(attachment) {
      this.$set(this.downloadingFiles, attachment.id, true)

      try {
        await this.jobApplicationsStore.downloadAttachment(attachment.id, attachment.name, attachment.file_path)

        if (this.$toast) {
          this.$toast.success(`Document ${attachment.name} téléchargé`)
        }
      } catch (error) {
        console.error('Erreur téléchargement:', error)
        if (this.$toast) {
          this.$toast.error('Erreur lors du téléchargement')
        }
      } finally {
        this.$set(this.downloadingFiles, attachment.id, false)
      }
    },

    async previewDocument(attachment) {
      try {
        // Si l'attachement a un file_path, l'ouvrir directement
        if (attachment.file_path) {
          window.open(attachment.file_path, '_blank')
        } else {
          // Sinon, utiliser l'API de téléchargement et ouvrir le blob
          const response = await this.jobApplicationsStore.downloadAttachment(attachment.id, attachment.name)

          if (response && response.data) {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            window.open(url, '_blank')
            // Nettoyer l'URL après un délai
            setTimeout(() => window.URL.revokeObjectURL(url), 1000)
          }
        }
      } catch (error) {
        console.error('Erreur prévisualisation:', error)
        if (this.$toast) {
          this.$toast.error('Impossible de prévisualiser ce document')
        }
      }
    },

    async downloadAllDocuments() {
      if (!this.application?.attachments?.length) {
        console.warn('Aucun document à télécharger')
        return
      }

      this.downloadingAll = true
      let successCount = 0
      let errorCount = 0

      try {
        // Télécharger tous les documents un par un avec un petit délai entre chaque
        for (let i = 0; i < this.application.attachments.length; i++) {
          const attachment = this.application.attachments[i]
          try {
            console.log(`Téléchargement du document ${i + 1}/${this.application.attachments.length}: ${attachment.name}`)
            await this.jobApplicationsStore.downloadAttachment(attachment.id, attachment.name, attachment.file_path)
            successCount++
            
            // Petit délai entre les téléchargements pour éviter de surcharger le navigateur
            if (i < this.application.attachments.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 300))
            }
          } catch (error) {
            console.error(`Erreur lors du téléchargement de ${attachment.name}:`, error)
            errorCount++
          }
        }

        // Afficher un message de résultat
        if (this.$toast) {
          if (errorCount === 0) {
            this.$toast.success(`Tous les documents (${successCount}) ont été téléchargés avec succès`)
          } else if (successCount > 0) {
            this.$toast.warning(`${successCount} document(s) téléchargé(s), ${errorCount} erreur(s)`)
          } else {
            this.$toast.error('Erreur lors du téléchargement des documents')
          }
        }
      } catch (error) {
        console.error('Erreur téléchargement groupé:', error)
        if (this.$toast) {
          this.$toast.error('Erreur lors du téléchargement des documents')
        }
      } finally {
        this.downloadingAll = false
      }
    },

    // Utilitaires
    getInitials(firstName, lastName) {
      return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
    },

    getAvatarColor(name) {
      const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'error']
      const hash = name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0
      return colors[hash % colors.length]
    },

    // Formatage
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },

    formatDateTime(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    // Actions de gestion du statut
    async handleApprove() {
      if (!this.application) return

      // Utiliser un modal au lieu de confirm
      // Pour l'instant, cette fonctionnalité est commentée
      // this.approveDialog = true
      return
    },

    async handleReject() {
      if (!this.application) return

      // Ouvrir un dialog pour demander la raison du rejet
      this.rejectDialog = true
    },

    async confirmReject() {
      if (!this.application) return

      if (!this.rejectReason || this.rejectReason.trim() === '') {
        if (this.$toast) {
          this.$toast.warning('Veuillez indiquer une raison de rejet')
        }
        return
      }

      this.isChangingStatus = true
      this.rejectDialog = false
      
      try {
        await this.jobOffersStore.updateApplicationStatus({
          application_id: this.application.id,
          status: 'REFUSED',
          reason: this.rejectReason.trim()
        })
        
        if (this.$toast) {
          this.$toast.success('Candidature rejetée avec succès')
        }
        
        // Recharger la candidature pour mettre à jour le statut
        await this.loadApplication()
        this.rejectReason = ''
      } catch (error) {
        console.error('Erreur lors du rejet:', error)
        if (this.$toast) {
          this.$toast.error('Erreur lors du rejet de la candidature')
        }
      } finally {
        this.isChangingStatus = false
      }
    },

    async handleDelete() {
      if (!this.application) return

      // Ouvrir le modal de confirmation
      this.deleteDialog = true
    },

    async confirmDelete() {
      if (!this.application) return

      this.isDeleting = true
      this.deleteDialog = false
      
      try {
        await this.jobApplicationsStore.deleteJobApplication(this.application.id.toString())
        
        if (this.$toast) {
          this.$toast.success('Candidature supprimée avec succès')
        }
        
        // Rediriger vers la liste des candidatures
        this.$router.push({ name: 'job-applications' })
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        if (this.$toast) {
          this.$toast.error('Erreur lors de la suppression de la candidature')
        }
      } finally {
        this.isDeleting = false
      }
    },

    formatPhoneNumber(phone, countryCode) {
      if (!phone) return 'N/A'
      return countryCode ? `${countryCode} ${phone}` : phone
    },

    // Icônes et couleurs de fichiers
    getFileIcon(filename) {
      const extension = filename.split('.').pop()?.toLowerCase()
      const iconMap = {
        'pdf': 'ri-file-pdf-line',
        'doc': 'ri-file-word-line',
        'docx': 'ri-file-word-line',
        'jpg': 'ri-image-line',
        'jpeg': 'ri-image-line',
        'png': 'ri-image-line',
        'gif': 'ri-image-line',
        'txt': 'ri-file-text-line',
        'zip': 'ri-file-zip-line',
        'rar': 'ri-file-zip-line'
      }
      return iconMap[extension] || 'ri-file-line'
    },

    getFileColor(filename) {
      const extension = filename.split('.').pop()?.toLowerCase()
      const colorMap = {
        'pdf': 'error',
        'doc': 'info',
        'docx': 'info',
        'jpg': 'success',
        'jpeg': 'success',
        'png': 'success',
        'gif': 'success',
        'txt': 'warning',
        'zip': 'purple',
        'rar': 'purple'
      }
      return colorMap[extension] || 'primary'
    },

    // Statuts - correspondants à l'API backend
    getStatusColor(status) {
      const colors = {
        'RECEIVED': 'warning',
        'UNDER_REVIEW': 'info',
        'APPROVED': 'success',
        'REFUSED': 'error',
        'CANCELLED': 'secondary',
        // Fallbacks pour anciens statuts
        'pending': 'warning',
        'processing': 'info',
        'accepted': 'success',
        'rejected': 'error',
        'cancelled': 'secondary'
      }
      return colors[status] || 'primary'
    },

    getStatusIcon(status) {
      const icons = {
        'RECEIVED': 'ri-mail-line',
        'UNDER_REVIEW': 'ri-loader-line',
        'APPROVED': 'ri-check-line',
        'REFUSED': 'ri-close-line',
        'CANCELLED': 'ri-forbid-line',
        // Fallbacks pour anciens statuts
        'pending': 'ri-time-line',
        'processing': 'ri-loader-line',
        'accepted': 'ri-check-line',
        'rejected': 'ri-close-line',
        'cancelled': 'ri-forbid-line'
      }
      return icons[status] || 'ri-circle-line'
    },

    getStatusLabel(status) {
      const labels = {
        'RECEIVED': 'En étude de dossier',
        'UNDER_REVIEW': 'En cours d\'examen',
        'APPROVED': 'Approuvée',
        'REFUSED': 'Refusée',
        'CANCELLED': 'Annulée',
        // Fallbacks pour anciens statuts
        'pending': 'En attente',
        'processing': 'En traitement',
        'accepted': 'Acceptée',
        'rejected': 'Rejetée',
        'cancelled': 'Annulée'
      }
      return labels[status] || status
    },

    getDocumentLabel(documentType) {
      const labels = {
        'cv': 'Curriculum Vitae',
        'cover_letter': 'Lettre de motivation',
        'diploma': 'Diplôme',
        'certificate': 'Certificat',
        'id_card': 'Pièce d\'identité',
        'other': 'Autre document'
      }
      return labels[documentType] || 'Document'
    },

    // Formater la taille du fichier
    formatFileSize(bytes) {
      if (!bytes) return 'Taille inconnue'

      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(1024))

      if (i === 0) return `${bytes} ${sizes[i]}`

      return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
    }
  }
}
</script>

<style scoped>
.application-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 3rem;
}

.application-header-card {
  position: relative;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.application-header-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
}

.application-header-overlay {
  position: relative;
  min-height: 300px;
  background: linear-gradient(135deg, #1a237e 0%, #3f51b5 100%);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  transition: background-color 0.3s ease;
}

.application-header-overlay:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.application-header-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.8));
  border-radius: 12px;
  transition: opacity 0.3s ease;
}

.application-header-content {
  position: relative;
  width: 100%;
  padding: 2rem;
  z-index: 1;
}

.border-white {
  border: 2px solid rgba(255, 255, 255, 0.7);
}

.info-item {
  margin-bottom: 1rem;
}

.info-label {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgb(var(--v-theme-on-surface-variant));
  margin-bottom: 0.25rem;
}

.info-value {
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
}

.document-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

.document-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(var(--v-theme-on-surface), 0.15);
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.border-t {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

.notes-content {
  padding: 1rem;
  background: rgba(var(--v-theme-surface-variant), 0.5);
  border-radius: 8px;
  white-space: pre-wrap;
  line-height: 1.6;
}

/* Animations */
.animate-title {
  animation: fadeInUp 0.8s ease-out;
}

.animate-tag {
  transition: all 0.3s ease;
}

.animate-tag:hover {
  transform: translateY(-3px);
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
}

.animate-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.animate-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-bounce {
  animation: bounce 1s ease infinite;
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 960px) {
  .application-header-card {
    height: 250px;
  }

  .application-header-overlay {
    padding: 1.5rem;
  }

  .application-header-content {
    padding: 1rem;
  }

  .animate-title {
    font-size: 1.5rem !important;
  }
}

@media (max-width: 600px) {
  .application-header-overlay {
    min-height: 200px;
  }

  .animate-title {
    font-size: 1.25rem !important;
    margin-bottom: 0.5rem !important;
  }

  .animate-tag {
    margin-bottom: 0.5rem;
  }
}
</style>
