<template>
  <VCard class="job-application-stats" elevation="2">
    <VCardTitle class="d-flex align-center">
      <VIcon icon="ri-bar-chart-line" class="me-2" color="primary" />
      <span>Statistiques des candidatures</span>

      <!-- Indicateur de chargement -->
      <VSpacer />
      <VProgressCircular v-if="loading" indeterminate size="20" width="2" color="primary" />
    </VCardTitle>

    <VCardText>
      <!-- Vue d'ensemble -->
      <div v-if="!loading" class="mb-4">
        <VRow>
          <!-- Total des candidatures -->
          <VCol cols="6" sm="3">
            <div class="stats-card stats-card--total">
              <div class="stats-card__icon">
                <VIcon icon="ri-file-list-line" size="24" />
              </div>
              <div class="stats-card__content">
                <div class="stats-card__number">{{ stats.total }}</div>
                <div class="stats-card__label">Total</div>
              </div>
            </div>
          </VCol>

          <!-- Candidatures reçues -->
          <VCol cols="6" sm="3">
            <div class="stats-card stats-card--received">
              <div class="stats-card__icon">
                <VIcon icon="ri-mail-line" size="24" />
              </div>
              <div class="stats-card__content">
                <div class="stats-card__number">{{ stats.received }}</div>
                <div class="stats-card__label">Reçues</div>
              </div>
            </div>
          </VCol>

          <!-- Candidatures approuvées -->
          <VCol cols="6" sm="3">
            <div class="stats-card stats-card--approved">
              <div class="stats-card__icon">
                <VIcon icon="ri-check-line" size="24" />
              </div>
              <div class="stats-card__content">
                <div class="stats-card__number">{{ stats.approved }}</div>
                <div class="stats-card__label">Approuvées</div>
              </div>
            </div>
          </VCol>

          <!-- Candidatures refusées -->
          <VCol cols="6" sm="3">
            <div class="stats-card stats-card--refused">
              <div class="stats-card__icon">
                <VIcon icon="ri-close-line" size="24" />
              </div>
              <div class="stats-card__content">
                <div class="stats-card__number">{{ stats.refused }}</div>
                <div class="stats-card__label">Refusées</div>
              </div>
            </div>
          </VCol>
        </VRow>
      </div>

      <!-- Barres de progression -->
      <div v-if="!loading && stats.total > 0" class="mb-4">
        <div class="progress-section mb-3">
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-body-2">Candidatures reçues</span>
            <span class="text-caption text-medium-emphasis">
              {{ receivedPercentage }}%
            </span>
          </div>
          <VProgressLinear :model-value="receivedPercentage" color="info" height="6" rounded />
        </div>

        <div class="progress-section mb-3">
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-body-2">Candidatures approuvées</span>
            <span class="text-caption text-medium-emphasis">
              {{ approvedPercentage }}%
            </span>
          </div>
          <VProgressLinear :model-value="approvedPercentage" color="success" height="6" rounded />
        </div>

        <div class="progress-section mb-3">
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-body-2">Candidatures refusées</span>
            <span class="text-caption text-medium-emphasis">
              {{ refusedPercentage }}%
            </span>
          </div>
          <VProgressLinear :model-value="refusedPercentage" color="error" height="6" rounded />
        </div>
      </div>

      <!-- Taux de conversion -->
      <div v-if="!loading && stats.total > 0" class="mb-4">
        <VDivider class="mb-3" />
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <VIcon icon="ri-percent-line" class="me-2" color="primary" size="18" />
            <span class="text-body-2 font-weight-medium">Taux d'approbation</span>
          </div>
          <VChip :color="approvalRateColor" variant="tonal" size="small">
            {{ approvedPercentage.toFixed(1) }}%
          </VChip>
        </div>
      </div>

      <!-- Message si aucune candidature -->
      <div v-if="!loading && stats.total === 0" class="text-center py-8">
        <VIcon icon="ri-file-list-line" size="48" class="text-medium-emphasis mb-4" />
        <p class="text-body-1 text-medium-emphasis mb-2">Aucune candidature pour le moment</p>
        <p class="text-caption text-medium-emphasis">
          Les candidatures apparaîtront ici une fois qu'elles seront reçues.
        </p>
      </div>

      <!-- État de chargement -->
      <div v-if="loading" class="text-center py-8">
        <VProgressCircular indeterminate size="40" width="4" color="primary" class="mb-4" />
        <p class="text-body-2 text-medium-emphasis">Chargement des statistiques...</p>
      </div>
    </VCardText>

    <!-- Actions -->
    <VCardActions v-if="!loading && stats.total > 0">
      <VBtn variant="outlined" prepend-icon="ri-eye-line" @click="$emit('view-applications')">
        Voir les candidatures
      </VBtn>

      <VSpacer />

      <VBtn variant="text" prepend-icon="ri-refresh-line" size="small" @click="$emit('refresh')">
        Actualiser
      </VBtn>
    </VCardActions>
  </VCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface ApplicationStats {
  total: number
  received: number
  approved: number
  refused: number
}

interface Props {
  stats: ApplicationStats
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

// Emits
defineEmits<{
  'view-applications': []
  'refresh': []
}>()

// Computed
const receivedPercentage = computed(() => {
  if (props.stats.total === 0) return 0
  return (props.stats.received / props.stats.total) * 100
})

const approvedPercentage = computed(() => {
  if (props.stats.total === 0) return 0
  return (props.stats.approved / props.stats.total) * 100
})

const refusedPercentage = computed(() => {
  if (props.stats.total === 0) return 0
  return (props.stats.refused / props.stats.total) * 100
})

const approvalRateColor = computed(() => {
  const rate = approvedPercentage.value
  if (rate >= 50) return 'success'
  if (rate >= 25) return 'warning'
  return 'error'
})
</script>

<style scoped>
.job-application-stats {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.stats-card {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: rgba(var(--v-theme-surface), 1);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  transition: transform 0.2s ease-in-out;
}

.stats-card:hover {
  transform: translateY(-1px);
}

.stats-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
}

.stats-card__content {
  flex: 1;
}

.stats-card__number {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
}

.stats-card__label {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-on-surface-variant));
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

/* Couleurs spécifiques pour chaque type de stat */
.stats-card--total .stats-card__icon {
  background: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
}

.stats-card--total .stats-card__number {
  color: rgb(var(--v-theme-primary));
}

.stats-card--received .stats-card__icon {
  background: rgba(var(--v-theme-info), 0.1);
  color: rgb(var(--v-theme-info));
}

.stats-card--received .stats-card__number {
  color: rgb(var(--v-theme-info));
}

.stats-card--approved .stats-card__icon {
  background: rgba(var(--v-theme-success), 0.1);
  color: rgb(var(--v-theme-success));
}

.stats-card--approved .stats-card__number {
  color: rgb(var(--v-theme-success));
}

.stats-card--refused .stats-card__icon {
  background: rgba(var(--v-theme-error), 0.1);
  color: rgb(var(--v-theme-error));
}

.stats-card--refused .stats-card__number {
  color: rgb(var(--v-theme-error));
}

.progress-section {
  padding: 8px 0;
}
</style>
