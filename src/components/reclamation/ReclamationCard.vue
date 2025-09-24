<template>
  <VCard class="reclamation-card">
    <VCardTitle class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <VIcon class="mr-2" color="primary">ri-file-text-line</VIcon>
        <div>
          <div class="text-h6">{{ reclamation.reclamation_number }}</div>
          <div class="text-body-2 text-medium-emphasis">{{ reclamation.subject }}</div>
        </div>
      </div>
      <VChip
        :color="statusConfig.color"
        size="small"
        variant="flat"
      >
        <VIcon :class="statusConfig.icon" class="mr-1" />
        {{ statusConfig.text }}
      </VChip>
    </VCardTitle>
    
    <VCardText>
      <div class="mb-3">
        <div class="text-body-2 text-medium-emphasis mb-1">Description</div>
        <div class="text-body-1">{{ reclamation.description }}</div>
      </div>
      
      <div class="mb-3">
        <div class="text-body-2 text-medium-emphasis mb-1">Priorité</div>
        <VChip
          :color="priorityConfig.color"
          size="small"
          variant="flat"
        >
          <VIcon :class="priorityConfig.icon" class="mr-1" />
          {{ priorityConfig.text }}
        </VChip>
      </div>
      
      <div class="mb-3">
        <div class="text-body-2 text-medium-emphasis mb-1">Type</div>
        <div class="text-body-1">{{ reclamationTypeName || 'Non spécifié' }}</div>
      </div>
      
      <div class="mb-3">
        <div class="text-body-2 text-medium-emphasis mb-1">Date de création</div>
        <div class="text-body-1">{{ formatDate(reclamation.created_at) }}</div>
      </div>
    </VCardText>
    
    <VCardActions v-if="showActions">
      <VBtn
        variant="outlined"
        @click="$emit('view', reclamation.id)"
        prepend-icon="ri-eye-line"
      >
        Voir
      </VBtn>
      <VBtn
        v-if="canUpdateStatus"
        color="primary"
        @click="$emit('update-status', reclamation.id)"
        prepend-icon="ri-edit-line"
      >
        Modifier
      </VBtn>
    </VCardActions>
  </VCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Reclamation, ReclamationStatusEnum, ReclamationPriorityEnum } from '@/types/reclamation'

interface Props {
  reclamation: Reclamation
  reclamationTypes?: Array<{ id: number; name: string }>
  showActions?: boolean
  canUpdateStatus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
  canUpdateStatus: false
})

const reclamationTypeName = computed(() => {
  if (!props.reclamationTypes || !props.reclamation.reclamation_type) return null
  const type = props.reclamationTypes.find(t => t.id === props.reclamation.reclamation_type)
  return type?.name || null
})

const emit = defineEmits<{
  view: [id: number]
  'update-status': [id: number]
}>()

const statusConfig = computed(() => {
  const status = props.reclamation.status as ReclamationStatusEnum
  const configs = {
    NEW: { text: 'Nouvelle', color: 'info', icon: 'ri-add-circle-line' },
    IN_PROGRESS: { text: 'En cours', color: 'warning', icon: 'ri-time-line' },
    CLOSED: { text: 'Fermée', color: 'success', icon: 'ri-check-circle-line' }
  }
  
  return configs[status] || { text: status, color: 'default', icon: 'ri-question-line' }
})

const priorityConfig = computed(() => {
  const priority = props.reclamation.priority as ReclamationPriorityEnum
  const configs = {
    LOW: { text: 'Faible', color: 'success', icon: 'ri-arrow-down-line' },
    MEDIUM: { text: 'Moyenne', color: 'info', icon: 'ri-arrow-right-line' },
    HIGH: { text: 'Élevée', color: 'warning', icon: 'ri-arrow-up-line' },
  }
  
  return configs[priority] || { text: priority, color: 'default', icon: 'ri-question-line' }
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.reclamation-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
}

.reclamation-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
</style>
