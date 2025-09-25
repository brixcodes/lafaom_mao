<template>
  <VCard class="job-card mb-4" :class="{ 'job-card--expired': isExpired }" elevation="2" hover>
    <!-- En-tête de la carte -->
    <VCardTitle class="job-card__header d-flex align-center justify-space-between">
      <div class="d-flex align-center flex-grow-1">
        <VIcon :icon="contractTypeIcon" class="me-2" color="primary" />
        <div>
          <h3 class="text-h6 mb-0">{{ jobOffer.title }}</h3>
          <p class="text-caption text-medium-emphasis mb-0">
            Réf: {{ jobOffer.reference }}
          </p>
        </div>
      </div>

      <!-- Badge de statut -->
      <VChip :color="statusColor" :prepend-icon="statusIcon" variant="tonal" size="small" class="ml-2">
        {{ statusText }}
      </VChip>
    </VCardTitle>

    <!-- Contenu principal -->
    <VCardText class="pb-2">
      <!-- Localisation et type de contrat -->
      <div class="d-flex align-center mb-2">
        <VIcon icon="ri-map-pin-line" size="small" class="me-2 text-medium-emphasis" />
        <span class="text-body-2 me-4">{{ jobOffer.location }}</span>

        <VIcon icon="ri-file-text-line" size="small" class="me-2 text-medium-emphasis" />
        <span class="text-body-2">{{ contractTypeLabel }}</span>
      </div>

      <!-- Salaire si disponible -->
      <div v-if="jobOffer.salary" class="d-flex align-center mb-2">
        <VIcon icon="ri-money-euro-circle-line" size="small" class="me-2 text-medium-emphasis" />
        <span class="text-body-2 font-weight-medium">
          {{ formatSalary(jobOffer.salary, jobOffer.currency) }}
          <span v-if="jobOffer.weekly_hours" class="text-caption">
            ({{ jobOffer.weekly_hours }}h/semaine)
          </span>
        </span>
      </div>

      <!-- Mission principale (tronquée) -->
      <div v-if="jobOffer.main_mission" class="mb-3">
        <p class="text-body-2 job-card__description">
          {{ truncateText(jobOffer.main_mission, 150) }}
        </p>
      </div>

      <!-- Informations supplémentaires -->
      <div class="d-flex align-center flex-wrap gap-2 mb-2">
        <!-- Permis requis -->
        <VChip v-if="jobOffer.driving_license_required" prepend-icon="ri-car-line" variant="outlined" size="x-small"
          color="warning">
          Permis requis
        </VChip>

        <!-- Temps de travail -->
        <VChip v-if="jobOffer.weekly_hours" prepend-icon="ri-time-line" variant="outlined" size="x-small">
          {{ jobOffer.weekly_hours }}h/sem
        </VChip>

        <!-- Contrat incertain -->
        <VChip v-if="jobOffer.uncertain_term" prepend-icon="ri-question-line" variant="outlined" size="x-small"
          color="info">
          Durée indéterminée
        </VChip>
      </div>

      <!-- Dates importantes -->
      <div class="job-card__dates">
        <div class="d-flex align-center justify-space-between text-caption text-medium-emphasis">
          <div class="d-flex align-center">
            <VIcon icon="ri-calendar-line" size="small" class="me-1" />
            <span>Date limite: {{ formatDate(jobOffer.submission_deadline) }}</span>
          </div>

          <div v-if="jobOffer.start_date" class="d-flex align-center">
            <VIcon icon="ri-play-circle-line" size="small" class="me-1" />
            <span>Début: {{ formatDate(jobOffer.start_date) }}</span>
          </div>
        </div>
      </div>
    </VCardText>

    <!-- Actions -->
    <VCardActions class="pt-0">
      <div class="d-flex align-center justify-space-between w-100">
        <!-- Frais de candidature -->
        <div v-if="jobOffer.submission_fee > 0" class="d-flex align-center">
          <VIcon icon="ri-price-tag-3-line" size="small" class="me-1 text-medium-emphasis" />
          <span class="text-caption text-medium-emphasis">
            Frais: {{ formatSalary(jobOffer.submission_fee, jobOffer.currency) }}
          </span>
        </div>

        <VSpacer v-else />

        <!-- Boutons d'action -->
        <div class="d-flex gap-2">
          <VBtn variant="outlined" size="small" prepend-icon="ri-eye-line" @click="$emit('view', jobOffer)">
            Voir
          </VBtn>

          <VBtn v-if="!canEdit" variant="outlined" size="small" prepend-icon="ri-edit-line" color="primary"
            @click="$emit('edit', jobOffer)">
            Modifier
          </VBtn>

          <VBtn v-if="!isExpired" variant="flat" size="small" prepend-icon="ri-send-plane-line" color="primary"
            @click="$emit('apply', jobOffer)">
            Candidater
          </VBtn>
        </div>
      </div>
    </VCardActions>
  </VCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { JobOfferOut } from '@/types/jobOffers'
import { CONTRACT_TYPES } from '@/types/jobOffers'



// Props
interface Props {
  jobOffer: JobOfferOut
  canEdit?: boolean
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canEdit: false,
  showActions: true,
})

// Emits
defineEmits<{
  view: [jobOffer: JobOfferOut]
  edit: [jobOffer: JobOfferOut]
  apply: [jobOffer: JobOfferOut]
}>()

// Computed
const isExpired = computed(() => {
  const today = new Date()
  const deadline = new Date(props.jobOffer.submission_deadline)
  return deadline < today
})

const statusColor = computed(() => {
  return isExpired.value ? 'error' : 'success'
})

const statusIcon = computed(() => {
  return isExpired.value ? 'ri-time-line' : 'ri-check-circle-line'
})

const statusText = computed(() => {
  return isExpired.value ? 'Expiré' : 'Actif'
})

const contractTypeLabel = computed(() => {
  const contractType = CONTRACT_TYPES.find(type => type.value === props.jobOffer.contract_type)
  return contractType?.text || props.jobOffer.contract_type
})

const contractTypeIcon = computed(() => {
  const iconMap: Record<string, string> = {
    'CDI': 'ri-user-star-line',
    'CDD': 'ri-calendar-schedule-line',
    'STAGE': 'ri-graduation-cap-line',
    'FREELANCE': 'ri-briefcase-line',
    'INTERIM': 'ri-timer-line',
    'APPRENTISSAGE': 'ri-book-open-line',
    'ALTERNANCE': 'ri-repeat-line',
  }
  return iconMap[props.jobOffer.contract_type] || 'ri-briefcase-line'
})

// Methods
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

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}
</script>

<style scoped>
.job-card {
  transition: transform 0.2s ease-in-out;
  border-left: 4px solid rgb(var(--v-theme-primary));
}

.job-card:hover {
  transform: translateY(-2px);
}

.job-card--expired {
  border-left-color: rgb(var(--v-theme-error));
  opacity: 0.7;
}

.job-card__header {
  padding-bottom: 8px;
}

.job-card__description {
  line-height: 1.4;
  color: rgb(var(--v-theme-on-surface-variant));
}

.job-card__dates {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding-top: 12px;
  margin-top: 12px;
}

.gap-2 {
  gap: 8px;
}
</style>
