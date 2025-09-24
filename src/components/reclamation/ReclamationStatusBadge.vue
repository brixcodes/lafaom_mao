<template>
  <VChip
    :color="statusConfig.color"
    :variant="variant"
    :size="size"
  >
    <VIcon :class="statusConfig.icon" class="mr-1" />
    {{ statusConfig.text }}
  </VChip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ReclamationStatusEnum } from '@/types/reclamation'

interface Props {
  status: ReclamationStatusEnum
  variant?: 'flat' | 'tonal' | 'outlined' | 'text' | 'plain'
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'flat',
  size: 'default'
})

const statusConfig = computed(() => {
  const configs = {
    NEW: { text: 'Nouvelle', color: 'info', icon: 'ri-add-circle-line' },
    IN_PROGRESS: { text: 'En cours', color: 'warning', icon: 'ri-time-line' },
    CLOSED: { text: 'Fermée', color: 'success', icon: 'ri-check-circle-line' }
  }
  
  return configs[props.status] || { text: props.status, color: 'default', icon: 'ri-question-line' }
})
</script>
