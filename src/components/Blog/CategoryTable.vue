<template>
  <VCard class="pa-3">
    <VDataTable :headers="headers" :items="categories" :loading="isLoading" class="elevation-0" item-value="id">
      <template #item.title="{ item }">
        <div class="font-weight-medium">{{ item.title }}</div>
      </template>
      <template #item.description="{ item }">
        <div class="text-caption text-medium-emphasis">{{ item.description }}</div>
      </template>
      <template #item.slug="{ item }">
        <VChip color="primary" size="small" variant="tonal">{{ item.slug }}</VChip>
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex gap-2">
          <!-- Modifier - Permission: CAN_UPDATE_BLOG -->
          <VBtn 
            icon="ri-edit-line" 
            size="small" 
            variant="text" 
            @click="$emit('edit', item.id)"
            title="Modifier la catégorie"
          />
          <!-- Supprimer - Permission: CAN_DELETE_BLOG -->
          <VBtn 
            icon="ri-delete-bin-line" 
            size="small" 
            variant="text" 
            color="error" 
            @click="$emit('delete', item)"
            title="Supprimer la catégorie"
          />
        </div>
      </template>
    </VDataTable>
  </VCard>

</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  categories: any[]
  headers: any[]
  isLoading: boolean
}>()

const emit = defineEmits(['edit', 'delete'])
</script>

<style scoped>
/* Soft, modern style */
</style>
