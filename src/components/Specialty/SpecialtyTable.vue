<template>
  <VDataTable
    :headers="headers"
    :items="specialties"
    :loading="isLoading"
    class="elevation-0"
    item-value="id"
  >
    <template #item.name="{ item }">
      <div class="font-weight-medium">{{ item.name }}</div>
    </template>
    
    <template #item.description="{ item }">
      <div v-if="item.description" class="text-body-2">
        {{ truncateText(item.description, 100) }}
      </div>
      <div v-else class="text-body-2 text-medium-emphasis">
        Aucune description
      </div>
    </template>
    
    <template #item.actions="{ item }">
      <div class="d-flex gap-2">
        <VBtn 
          icon="ri-eye-line" 
          size="small" 
          variant="text" 
          @click="$emit('detail', item.id)" 
        />
        <VBtn 
          icon="ri-edit-line" 
          size="small" 
          variant="text" 
          @click="$emit('edit', item.id)" 
        />
        <VBtn 
          icon="ri-delete-bin-line" 
          size="small" 
          variant="text" 
          color="error" 
          @click="$emit('delete', item)" 
        />
      </div>
    </template>
  </VDataTable>
</template>

<script setup lang="ts">
import type { Specialty } from '@/types/specialties'

const props = defineProps<{
  specialties: Specialty[]
  headers: any[]
  isLoading: boolean
}>()

const emit = defineEmits(['detail', 'edit', 'delete'])

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}
</script>
