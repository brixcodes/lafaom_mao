<script setup lang="ts">
import { computed } from 'vue'
import type { Training } from '@/types/training'
import { useStatusBadgeColor } from '@/composables/useStatusBadgeColor'
import { usePermissions } from '@/composables/usePermissions'

interface Props {
  training: Training
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
})

const emit = defineEmits<{
  view: [training: Training]
  edit: [training: Training]
  apply: [training: Training]
}>()

// Permissions
const { canEditTraining } = usePermissions()

// Computed
const statusColor = computed(() => useStatusBadgeColor(props.training.status))

const statusIcon = computed(() => {
  return props.training.status === 'ACTIVE' ? 'ri-checkbox-circle-line' : 'ri-close-circle-line'
})

const typeIcon = computed(() => {
  return props.training.training_type === 'On-Site' ? 'ri-building-line' : 'ri-home-office-line'
})

const durationText = computed(() => {
  return `${props.training.duration} ${props.training.duration_unit.toLowerCase()}`
})

const truncateText = (text: string, maxLength: number) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}
</script>

<template>
  <VCard class="training-card mb-4 elevation-2" hover>
    <!-- En-tête de la carte -->
    <VCardTitle class="d-flex align-center justify-space-between">
      <div class="d-flex align-center flex-grow-1">
        <VIcon :icon="typeIcon" class="me-2" color="primary" />
        <div>
          <h3 class="text-h6 mb-0">{{ training.title }}</h3>
        </div>
      </div>

      <!-- Badge de statut -->
      <VChip :color="statusColor" :prepend-icon="statusIcon" variant="tonal" size="small" class="ml-2">
        {{ training.status }}
      </VChip>
    </VCardTitle>

    <!-- Contenu principal -->
    <VCardText class="pb-2">
      <!-- Durée et type -->
      <div class="d-flex align-center mb-2">
        <VIcon icon="ri-time-line" size="small" class="me-2 text-medium-emphasis" />
        <span class="text-body-2 me-4">{{ durationText }}</span>

        <VIcon icon="ri-building-line" size="small" class="me-2 text-medium-emphasis" />
        <span class="text-body-2">{{ training.training_type }}</span>
      </div>

      <!-- Présentation (tronquée) -->
      <div v-if="training.presentation" class="mb-3">
        <p class="text-body-2 training-card__description">
          {{ truncateText(training.presentation, 150) }}
        </p>
      </div>

      <!-- Informations supplémentaires -->
      <div class="d-flex align-center flex-wrap gap-2 mb-2">
        <!-- Bénéfices (si présents) -->
        <VChip v-for="(benefit, index) in training.benefits?.slice(0, 2)" :key="index" variant="outlined" size="x-small">
          {{ benefit.title }}
        </VChip>

        <!-- Points forts (si présents) -->
        <VChip v-for="(strength, index) in training.strengths?.slice(0, 2)" :key="index" variant="outlined" size="x-small"
          color="success">
          {{ strength.title }}
        </VChip>
      </div>
    </VCardText>

    <!-- Actions -->
    <VCardActions class="pt-0" v-if="showActions">
      <VSpacer />
      
      <div class="d-flex gap-2">
        <VBtn variant="outlined" size="small" prepend-icon="ri-eye-line" @click="$emit('view', training)">
          Voir
        </VBtn>

        <VBtn v-if="!canEditTraining" variant="outlined" size="small" prepend-icon="ri-edit-line" color="primary"
          @click="$emit('edit', training)">
          Modifier
        </VBtn>

        <VBtn v-if="training.status === 'ACTIVE'" variant="flat" size="small" prepend-icon="ri-send-plane-line"
          color="primary" @click="$emit('apply', training)">
          S'inscrire
        </VBtn>
      </div>
    </VCardActions>
  </VCard>
</template>

<style scoped>
.training-card {
  transition: transform 0.2s ease-in-out;
  border-left: 4px solid rgb(var(--v-theme-primary));
}

.training-card:hover {
  transform: translateY(-2px);
}

.training-card__description {
  line-height: 1.4;
  color: rgb(var(--v-theme-on-surface-variant));
}

.gap-2 {
  gap: 8px;
}
</style>
