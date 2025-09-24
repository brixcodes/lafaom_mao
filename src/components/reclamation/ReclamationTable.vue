<template>
  <VCard class="pa-3">
    <VDataTable 
      :headers="headers" 
      :items="reclamations" 
      :loading="isLoading" 
      class="elevation-0" 
      item-value="id"
    >
      <template #item.reclamation_number="{ item }">
        <div class="font-weight-medium">{{ item.reclamation_number }}</div>
      </template>
      
      <template #item.application_number="{ item }">
        <VChip color="primary" size="small" variant="tonal">{{ item.application_number }}</VChip>
      </template>
      
      
      <template #item.priority="{ item }">
        <VChip 
          :color="getPriorityColor(item.priority)" 
          size="small" 
          variant="tonal"
        >
          {{ getPriorityText(item.priority) }}
        </VChip>
      </template>
      
      <template #item.status="{ item }">
        <VChip 
          :color="getStatusColor(item.status)" 
          size="small" 
          variant="tonal"
        >
          {{ getStatusText(item.status) }}
        </VChip>
      </template>
      
      <template #item.created_at="{ item }">
        <div class="text-body-2">{{ formatDate(item.created_at) }}</div>
      </template>
      
      <template #item.actions="{ item }">
        <div class="d-flex gap-2">
          <VBtn 
            icon="ri-eye-line" 
            size="small" 
            color="primary" 
            variant="text"
            @click.stop="$emit('view', item.id)" 
          />
          <VMenu v-if="canChangeStatus && canChangeStatusFunction(item)">
            <template #activator="{ props }">
              <VBtn 
                icon="ri-settings-3-line" 
                size="small" 
                color="secondary" 
                variant="text"
                v-bind="props"
                @click.stop
              />
            </template>
            <VList>
              <VListItem 
                v-if="item.status === 'NEW'"
                @click="handleStatusChange(item.id, 'IN_PROGRESS')"
              >
                <VListItemTitle>Marquer en cours</VListItemTitle>
              </VListItem>
              <VListItem 
                v-if="item.status === 'NEW' || item.status === 'IN_PROGRESS'"
                @click="handleStatusChange(item.id, 'CLOSED')"
              >
                <VListItemTitle>Fermer</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </div>
      </template>
      

    </VDataTable>
  </VCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Reclamation, ReclamationStatusEnum, ReclamationPriorityEnum } from '@/types/reclamation'

interface Props {
  reclamations: Reclamation[]
  headers: any[]
  isLoading: boolean
  canChangeStatus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canChangeStatus: false
})

const emit = defineEmits(['view', 'changeStatus'])

// Priority configuration
const getPriorityColor = (priority: ReclamationPriorityEnum) => {
  const colors = {
    LOW: 'success',
    MEDIUM: 'warning', 
    HIGH: 'error'
  }
  return colors[priority] || 'default'
}

const getPriorityText = (priority: ReclamationPriorityEnum) => {
  const texts = {
    LOW: 'Faible',
    MEDIUM: 'Moyenne',
    HIGH: 'Élevée'
  }
  return texts[priority] || priority
}

// Status configuration
const getStatusColor = (status: ReclamationStatusEnum) => {
  const colors = {
    NEW: 'info',
    IN_PROGRESS: 'warning',
    CLOSED: 'success'
  }
  return colors[status] || 'default'
}

const getStatusText = (status: ReclamationStatusEnum) => {
  const texts = {
    NEW: 'Nouvelle',
    IN_PROGRESS: 'En cours',
    CLOSED: 'Fermée'
  }
  return texts[status] || status
}

// Date formatting
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Status change permissions
const canChangeStatusFunction = (reclamation: Reclamation) => {
  // Can change status if not CLOSED
  return reclamation.status !== 'CLOSED'
}

// Handle status change with logging
const handleStatusChange = (id: number, status: string) => {
  console.log('🔄 ReclamationTable: Changement de statut demandé:', { id, status })
  emit('changeStatus', id, status)
}

</script>

<style scoped>
/* Soft, modern style */
</style>