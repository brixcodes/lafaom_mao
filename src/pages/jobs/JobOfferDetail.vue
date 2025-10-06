<template>
  <VContainer class="job-offer-detail-container">
    <!-- Header avec navigation -->
    <div class="d-flex justify-space-between align-center mb-4">
      <!-- Partie gauche : bouton retour + titres -->
      <div class="d-flex align-center">
        <VBtn icon variant="text" class="mr-3" @click="goBack">
          <VIcon icon="ri-arrow-left-line" color="primary" />
        </VBtn>
        <div>
          <h1 class="font-weight-bold mb-1">Détails de l'offre d'emploi</h1>
          <p class="text-body-2 text-secondary mb-0">
            Consultez les détails de l'offre et postulez directement.
          </p>
        </div>
      </div>

      <!-- Partie droite : bouton Postuler -->
      <div>
        <VBtn color="primary" variant="outlined" @click="shareOffer" class="action-btn mx-1" prepend-icon="ri-share-line">
          Partager
        </VBtn>
        <VBtn v-if="jobOffer" color="primary" :to="{ name: 'job-offers-apply', params: { id: jobOffer.id } }" class="action-btn" prepend-icon="ri-send-plane-line">
          Candidater
        </VBtn>
      </div>
    </div>


    <VFadeTransition>
      <VRow v-if="jobOffer">
        <VCol cols="12">
          <!-- En-tête avec design moderne -->
          <VSlideYTransition>
            <VCard class="mb-6 job-offer-header-card overflow-hidden" elevation="3">
              <div class="job-offer-header-overlay">
                <div class="job-offer-header-content">
                  <div class="d-flex align-center mb-4 animate-company">
                    <VAvatar size="48" class="mr-3 border-white">
                      <VIcon color="white" size="24">ri-building-line</VIcon>
                    </VAvatar>
                    <div>
                      <div class="text-white font-weight-medium">{{ jobOffer.company_name || 'Entreprise' }}</div>
                      <div class="text-caption text-white">
                        Réf: {{ jobOffer.reference }}
                      </div>
                    </div>
                  </div>

                  <h1 class="text-h3 font-weight-bold text-white mb-4 animate-title">
                    {{ jobOffer.title }}
                  </h1>

                  <div class="d-flex flex-wrap gap-3 mb-4">
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-map-pin-line</VIcon>
                      <span>{{ jobOffer.location }}</span>
                    </div>
                    <div v-if="jobOffer.salary" class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-money-euro-circle-line</VIcon>
                      <span>{{ formatSalary(jobOffer.salary, jobOffer.currency) }}</span>
                    </div>
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-calendar-line</VIcon>
                      <span>Expire le {{ formatDate(jobOffer.submission_deadline) }}</span>
                    </div>
                  </div>

                  <VSlideXTransition group>
                    <VChip key="contract-type" color="white" variant="elevated" size="small"
                      class="mr-2 mb-2 animate-tag">
                      {{ jobOffer.contract_type }}
                    </VChip>

                    <VChip v-if="jobOffer.weekly_hours" key="hours" color="white" variant="outlined" size="small"
                      class="mr-2 mb-2 animate-tag">
                      {{ jobOffer.weekly_hours }}h/semaine
                    </VChip>

                    <VChip :key="statusChip.key" :color="statusChip.color" variant="elevated" size="small"
                      class="mr-2 mb-2 animate-tag">
                      {{ statusChip.text }}
                    </VChip>
                  </VSlideXTransition>
                </div>
              </div>
            </VCard>
          </VSlideYTransition>

          <!-- Contenu principal -->
          <VRow>
            <VCol cols="12" md="8">
              <!-- Missions et responsabilités -->
              <VSlideYTransition>
                <VCard v-if="jobOffer.responsibilities" class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-file-edit-line</VIcon>
                    <span class="text-h6">Description de l'offre</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="py-4 job-content">
                    <v-timeline align="start" density="compact" class="pa-3">
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Mission principale</strong> :</div>
                        <div style="margin-left: 10px; line-height: 1.8;" v-html="jobOffer.main_mission"></div>
                      </v-timeline-item>
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Responsabilités</strong> :</div>
                        <div style="margin-left: 22px; line-height: 1.8;" v-html="jobOffer.responsibilities"></div>
                      </v-timeline-item>
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Compétences requises</strong> :</div>
                        <div style="margin-left: 22px; line-height: 1.8;" v-html="jobOffer.competencies"></div>
                      </v-timeline-item>
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Profil recherché</strong> :</div>
                        <div style="margin-left: 10px; line-height: 1.8;" v-html="jobOffer.profile"></div>
                      </v-timeline-item>
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Avantages</strong> :</div>
                        <div style="margin-left: 22px; line-height: 1.8;" v-html="jobOffer.benefits"></div>
                      </v-timeline-item>
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Pièces à joindre</strong> :</div>
                        <div>
                          <ul>
                            <li v-for="(file, index) in jobOffer.attachment" :key="index">
                              {{ file }}
                            </li>
                            <li v-if="!jobOffer.attachment || jobOffer.attachment.length === 0">
                              Aucune pièce jointe
                            </li>
                          </ul>
                        </div>
                      </v-timeline-item>
                    </v-timeline>
                  </VCardText>
                </VCard>
              </VSlideYTransition>

              <!-- Profil recherché / Exigences -->
              <VSlideYTransition>
                <VCard v-if="jobOffer.requirements" class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-user-search-line</VIcon>
                    <span class="text-h6">Profil recherché</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="py-4 job-content">
                    <div v-html="jobOffer.requirements"></div>
                  </VCardText>
                </VCard>
              </VSlideYTransition>

              <!-- Compétences techniques -->
              <VSlideYTransition>
                <VCard v-if="jobOffer.technical_skills" class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-code-line</VIcon>
                    <span class="text-h6">Compétences techniques</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="py-4 job-content">
                    <div v-html="jobOffer.technical_skills"></div>
                  </VCardText>
                </VCard>
              </VSlideYTransition>

              <!-- Process de recrutement -->
              <VSlideYTransition>
                <VCard v-if="jobOffer.recruitment_process" class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-roadmap-line</VIcon>
                    <span class="text-h6">Process de recrutement</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="py-4 job-content">
                    <div v-html="jobOffer.recruitment_process"></div>
                  </VCardText>
                </VCard>
              </VSlideYTransition>

              <!-- Informations complémentaires -->
              <VSlideYTransition>
                <VCard v-if="jobOffer.additional_info" class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-information-line</VIcon>
                    <span class="text-h6">Informations complémentaires</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="py-4 job-content">
                    <div v-html="jobOffer.additional_info"></div>
                  </VCardText>
                </VCard>
              </VSlideYTransition>
            </VCol>

            <!-- Sidebar avec informations et actions -->
            <VCol cols="12" md="4">
              <VSlideXReverseTransition>
                <VCard class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-information-line</VIcon>
                    <span class="text-h6">Informations de l'offre</span>
                  </VCardTitle>
                  <VDivider />
                  <VList lines="two" density="comfortable">
                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-map-pin-line</VIcon>
                      </template>
                      <VListItemTitle>Lieu de travail</VListItemTitle>
                      <VListItemSubtitle>{{ jobOffer.location }}{{ jobOffer.postal_code ? ', ' + jobOffer.postal_code :
                        '' }}
                      </VListItemSubtitle>
                    </VListItem>

                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-file-text-line</VIcon>
                      </template>
                      <VListItemTitle>Type de contrat</VListItemTitle>
                      <VListItemSubtitle>{{ jobOffer.contract_type }}</VListItemSubtitle>
                    </VListItem>

                    <VListItem v-if="jobOffer.salary">
                      <template #prepend>
                        <VIcon color="primary">ri-money-euro-circle-line</VIcon>
                      </template>
                      <VListItemTitle>Salaire</VListItemTitle>
                      <VListItemSubtitle class="font-weight-medium ">{{ formatSalary(jobOffer.salary,
                        jobOffer.currency) }}
                      </VListItemSubtitle>
                    </VListItem>

                    <VListItem v-if="jobOffer.weekly_hours">
                      <template #prepend>
                        <VIcon color="primary">ri-time-line</VIcon>
                      </template>
                      <VListItemTitle>Heures hebdomadaires</VListItemTitle>
                      <VListItemSubtitle>{{ jobOffer.weekly_hours }}h/semaine</VListItemSubtitle>
                    </VListItem>

                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-calendar-todo-line</VIcon>
                      </template>
                      <VListItemTitle>Date limite</VListItemTitle>
                      <VListItemSubtitle>{{ formatDate(jobOffer.submission_deadline) }}</VListItemSubtitle>
                    </VListItem>

                    <VListItem v-if="jobOffer.start_date">
                      <template #prepend>
                        <VIcon color="primary">ri-play-circle-line</VIcon>
                      </template>
                      <VListItemTitle>Date de début</VListItemTitle>
                      <VListItemSubtitle>{{ formatDate(jobOffer.start_date) }}</VListItemSubtitle>
                    </VListItem>

                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-calendar-line</VIcon>
                      </template>
                      <VListItemTitle>Publiée le</VListItemTitle>
                      <VListItemSubtitle>{{ formatDate(jobOffer.created_at) }}</VListItemSubtitle>
                    </VListItem>
                  </VList>

                  <!-- Frais de candidature -->
                  <VDivider />
                  <VCardText class="pa-4">
                    <div class="d-flex align-center">
                      <VIcon :color="jobOffer.submission_fee > 0 ? 'error' : 'success'" class="mr-2">
                        {{ jobOffer.submission_fee > 0 ? 'ri-price-tag-3-line' : 'ri-gift-line' }}
                      </VIcon>
                      <div>
                        <div class="text-subtitle-2">Frais d'étude de candidature</div>
                        <div :class="jobOffer.submission_fee > 0 ? 'text-error' : ''" class="font-weight-medium">
                          {{ jobOffer.submission_fee > 0 ? formatSalary(jobOffer.submission_fee, jobOffer.currency) :
                            'Gratuite' }}
                        </div>
                      </div>
                    </div>
                  </VCardText>

                  <!-- Caractéristiques spéciales -->
                  <VDivider v-if="hasSpecialFeatures" />
                  <VCardText v-if="hasSpecialFeatures" class="pa-4">
                    <div class="text-subtitle-2 mb-2">Caractéristiques supplémentaires</div>
                    <div class="d-flex flex-wrap gap-1">
                      <VChip v-if="jobOffer.driving_license_required" prepend-icon="ri-car-line" variant="tonal"
                        size="small" color="primary">
                        Permis requis
                      </VChip>
                      <VChip v-if="jobOffer.uncertain_term" prepend-icon="ri-question-line" variant="tonal" size="small"
                        color="primary">
                        Durée indéterminée
                      </VChip>
                      <VChip v-if="jobOffer.remote_work" prepend-icon="ri-home-office-line" variant="tonal" size="small"
                        color="primary">
                        Télétravail
                      </VChip>
                    </div>
                  </VCardText>
                </VCard>
              </VSlideXReverseTransition>

              
              <!-- Contact recruteur -->
              <VSlideXReverseTransition>
                <VCard v-if="jobOffer.contact_email || jobOffer.contact_phone" class="animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-customer-service-line</VIcon>
                    <span class="text-h6">Contact</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="pa-4">
                    <div v-if="jobOffer.contact_email" class="mb-3">
                      <div class="text-caption text-medium-emphasis mb-1">Email</div>
                      <a :href="`mailto:${jobOffer.contact_email}`" class="text-primary text-decoration-none">
                        {{ jobOffer.contact_email }}
                      </a>
                    </div>
                    <div v-if="jobOffer.contact_phone">
                      <div class="text-caption text-medium-emphasis mb-1">Téléphone</div>
                      <a :href="`tel:${jobOffer.contact_phone}`" class="text-primary text-decoration-none">
                        {{ jobOffer.contact_phone }}
                      </a>
                    </div>
                  </VCardText>
                </VCard>
              </VSlideXReverseTransition>
            </VCol>
          </VRow>
        </VCol>
      </VRow>
    </VFadeTransition>

    <!-- États de chargement et d'erreur -->
    <VFadeTransition>
      <VRow v-if="isLoading && !jobOffer">
        <VCol cols="12" class="text-center py-8">
          <VProgressCircular indeterminate color="primary" size="64" width="6" />
          <div class="mt-4 text-body-1 animate-fade-in">Chargement de l'offre d'emploi...</div>
        </VCol>
      </VRow>
    </VFadeTransition>

    <VFadeTransition>
      <VRow v-if="!isLoading && !jobOffer && error">
        <VCol cols="12" class="text-center py-8">
          <VIcon size="x-large" color="error" class="mb-4 animate-bounce">ri-alert-circle-line</VIcon>
          <div class="text-h5 mb-3 animate-fade-in">Erreur de chargement</div>
          <div class="text-body-1 mb-6 animate-fade-in">{{ error }}</div>
          <VBtn color="primary" size="large" @click="loadJobOffer" prepend-icon="ri-refresh-line"
            class="animate-fade-in">
            Réessayer
          </VBtn>
        </VCol>
      </VRow>
    </VFadeTransition>

    <VFadeTransition>
      <VRow v-if="!isLoading && !jobOffer && !error">
        <VCol cols="12" class="text-center py-8">
          <VIcon size="x-large" color="primary" class="mb-4 animate-bounce">ri-search-line</VIcon>
          <div class="text-h5 mb-3 animate-fade-in">Offre d'emploi introuvable</div>
          <div class="text-body-1 mb-6 animate-fade-in">L'offre que vous recherchez n'existe pas ou a été supprimée.
          </div>
          <VBtn color="primary" size="large" @click="goBack" prepend-icon="ri-arrow-left-line" class="animate-fade-in">
            Retour aux offres
          </VBtn>
        </VCol>
      </VRow>
    </VFadeTransition>
  </VContainer>
</template>

<script>
import { useJobOffersStore } from '@/stores/jobOffers'

import { PermissionEnum } from '@/types/permissions'
import { useInstantPermissions } from '@/composables/useInstantPermissions'
const { hasPermission, hasPermissions } = useInstantPermissions()

export default {
  name: 'JobOfferDetail',
  setup() {
    return {
      jobOffersStore: useJobOffersStore()
    }
  },
  data() {
    return {
      isLoading: true,
      error: null
    }
  },
  computed: {
    offerId() {
      return this.$route?.params?.id
    },
    jobOffer() {
      return this.jobOffersStore.currentJobOffer
    },
    isExpired() {
      if (!this.jobOffer?.submission_deadline) return false
      return new Date(this.jobOffer.submission_deadline) < new Date()
    },
    statusChip() {
      if (this.isExpired) {
        return { key: 'expired', text: 'Expirée', color: 'error' }
      }
      return { key: 'active', text: 'Active', color: 'success' }
    },
    hasSpecialFeatures() {
      return this.jobOffer?.driving_license_required ||
        this.jobOffer?.uncertain_term ||
        this.jobOffer?.remote_work
    }
  },
  async mounted() {
    await this.loadJobOffer()
  },
  methods: {
    async loadJobOffer() {
      if (!this.offerId) {
        this.error = 'ID d\'offre manquant'
        this.isLoading = false
        return
      }

      this.isLoading = true
      this.error = null

      try {
        await this.jobOffersStore.getJobOfferById(this.offerId)

        if (!this.jobOffer) {
          this.error = 'Offre d\'emploi introuvable'
        }
      } catch (error) {
        this.error = error.message || 'Erreur de chargement'
      } finally {
        this.isLoading = false
      }
    },

    goBack() {
      this.$router.back()
    },

    navigateToApply() {
      if (this.jobOffer?.id) {
        this.$router.push(`/jobs/apply/${this.jobOffer.id}`)
      }
    },

    shareOffer() {
      if (navigator.share) {
        navigator.share({
          title: this.jobOffer.title,
          text: `Découvrez cette offre d'emploi : ${this.jobOffer.title}`,
          url: window.location.href
        })
      } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(window.location.href)
        if (this.$toast) {
          this.$toast.success('Lien copié dans le presse-papiers')
        }
      }
    },

    bookmarkOffer() {
      // TODO: Implémenter la logique de sauvegarde
      if (this.$toast) {
        this.$toast.success('Offre sauvegardée')
      }
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('fr-FR')
    },

    formatSalary(amount, currency = 'EUR') {
      if (!amount) return 'N/A'
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency
      }).format(amount)
    }
  }
}
</script>

<style scoped>
.job-offer-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 3rem;
}

.job-offer-header-card {
  position: relative;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.job-offer-header-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
}

.job-offer-header-overlay {
  position: relative;
  min-height: 350px;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  transition: background-color 0.3s ease;
}

.job-offer-header-overlay:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.job-offer-header-overlay::before {
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

.job-offer-header-content {
  position: relative;
  width: 100%;
  padding: 2rem;
  z-index: 1;
}

.border-white {
  border: 2px solid rgba(255, 255, 255, 0.7);
}

.job-content {
  line-height: 1.7;
}

.job-content h1,
.job-content h2,
.job-content h3 {
  color: rgb(var(--v-theme-primary));
  margin: 1.5rem 0 1rem 0;
}

.job-content ul,
.job-content ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.job-content li {
  margin: 0.5rem 0;
}

.job-content p {
  margin: 1rem 0;
}

.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Animations */
.animate-title {
  animation: fadeInUp 0.8s ease-out;
}

.animate-company {
  animation: fadeInUp 0.8s ease-out 0.2s;
  animation-fill-mode: both;
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

/* Responsive design */
@media (max-width: 960px) {
  .job-offer-header-card {
    min-height: 300px;
  }

  .job-offer-header-overlay {
    min-height: 300px;
    padding: 1.5rem;
  }

  .job-offer-header-content {
    padding: 1.5rem;
  }

  .animate-title {
    font-size: 1.75rem !important;
  }
}

@media (max-width: 600px) {
  .job-offer-header-overlay {
    min-height: 250px;
  }

  .job-offer-header-content {
    padding: 1rem;
  }

  .animate-title {
    font-size: 1.5rem !important;
    margin-bottom: 1rem !important;
  }

  .animate-tag {
    margin-bottom: 0.5rem;
  }

  .action-btn {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .job-offer-header-overlay {
    min-height: 220px;
  }

  .animate-title {
    font-size: 1.25rem !important;
    margin-bottom: 0.5rem !important;
  }

  .animate-company {
    flex-direction: column;
    align-items: flex-start;
  }

  .animate-company .v-avatar {
    margin-bottom: 0.5rem;
  }
}
</style>
