<template>
  <VCard class="pa-3">
    <VDataTable 
      :headers="headers" 
      :items="types" 
      :loading="isLoading" 
      class="elevation-0" 
      item-value="id"
    >
      <template #item.name="{ item }">
        <div class="font-weight-medium">{{ item.name }}</div>
      </template>
      
      <template #item.description="{ item }">
        <div class="text-caption text-medium-emphasis">{{ item.description || 'Aucune description' }}</div>
      </template>
      
      
      <template #item.actions="{ item }">
        <div class="d-flex gap-2">
          <VBtn 
            icon="ri-edit-line" 
            size="small" 
            color="primary"
            variant="text" 
            @click="$emit('edit', item.id)" 
          />
          <VBtn 
            icon="ri-delete-bin-line"
            color="error"
            size="small" 
            variant="text" 
            @click="$emit('delete', item)" 
          />
        </div>
      </template>
    </VDataTable>
  </VCard>
</template>

<script setup lang="ts">
// VDataTable est importé automatiquement par Vuetify

const props = defineProps<{
  types: any[]
  headers: any[]
  isLoading: boolean
}>()

const emit = defineEmits(['edit', 'delete'])
</script>

<style scoped>
/* Soft, modern style */
</style>
