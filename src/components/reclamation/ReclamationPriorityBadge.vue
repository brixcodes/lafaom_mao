<template>
  <VChip
    :color="priorityConfig.color"
    :variant="variant"
    :size="size"
  >
    <VIcon :class="priorityConfig.icon" class="mr-1" />
    {{ priorityConfig.text }}
  </VChip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ReclamationPriorityEnum } from '@/types/reclamation'

interface Props {
  priority: ReclamationPriorityEnum
  variant?: 'flat' | 'tonal' | 'outlined' | 'text' | 'plain'
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'flat',
  size: 'default'
})

const priorityConfig = computed(() => {
  const configs = {
    LOW: { text: 'Faible', color: 'success', icon: 'ri-arrow-down-line' },
    MEDIUM: { text: 'Moyenne', color: 'info', icon: 'ri-arrow-right-line' },
    HIGH: { text: 'Élevée', color: 'warning', icon: 'ri-arrow-up-line' },
  }
  
  return configs[props.priority] || { text: props.priority, color: 'default', icon: 'ri-question-line' }
})
</script>
