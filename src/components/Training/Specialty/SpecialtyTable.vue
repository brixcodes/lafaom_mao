
<template>
  <VCard class="pa-3">
    <VDataTable
      :headers="headers"
      :items="specialties"
      :loading="isLoading"
      class="elevation-0"
      item-value="id"
      no-data-text="Aucune spécialité trouvée."
    >
      <template #item.name="{ item }">
        <div class="font-weight-medium">{{ item.name }}</div>
      </template>
      <template #item.description="{ item }">
        <div class="text-caption text-medium-emphasis">{{ item.description }}</div>
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex gap-2 justify-center">
          <VTooltip text="Modifier cette spécialité">
            <template #activator="{ props }">
              <VBtn v-bind="props" icon="ri-edit-line" size="small" variant="text" color="primary" aria-label="Modifier la spécialité" @click="$emit('edit', item.id)" />
            </template>
          </VTooltip>
          <VTooltip text="Supprimer cette spécialité">
            <template #activator="{ props }">
              <VBtn v-bind="props" icon="ri-delete-bin-line" size="small" variant="text" color="error" aria-label="Supprimer la spécialité" @click="$emit('delete', item)" />
            </template>
          </VTooltip>
        </div>
      </template>
    </VDataTable>
  </VCard>
</template>

<script setup lang="ts" name="TrainingSpecialtyTable">
import type { Specialty } from '@/types/specialty'
const props = defineProps<{
  specialties: Specialty[]
  headers: any[]
  isLoading: boolean
  canEdit?: boolean
  canDelete?: boolean
}>()
const emit = defineEmits(['edit', 'delete'])
</script>

<style scoped>
.v-data-table {
  font-size: 1rem;
}
.v-data-table th {
  text-transform: uppercase;
  font-weight: 600;
  color: #6b7280;
}
.v-data-table tbody tr:hover {
  background-color: #f3f4f6;
}
</style>
