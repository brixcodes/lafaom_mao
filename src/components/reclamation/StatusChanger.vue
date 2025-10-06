<template>
  <div class="status-changer">
    <VSelect
      :model-value="currentStatus"
      :items="statusOptions"
      :disabled="!canChange"
      :loading="isChanging"
      label="Changer le statut"
      prepend-inner-icon="ri-refresh-line"
      variant="outlined"
      density="compact"
      @update:model-value="handleStatusChange"
    >
      <template #item="{ props, item }">
        <VListItem v-bind="props">
          <template #prepend>
            <VIcon :icon="getStatusIcon(item.value)" :color="getStatusColor(item.value)" />
          </template>
          <VListItemTitle>{{ item.title }}</VListItemTitle>
        </VListItem>
      </template>
      
      <template #selection="{ item }">
        <div class="d-flex align-center">
          <VIcon 
            :icon="getStatusIcon(item.value)" 
            :color="getStatusColor(item.value)" 
            class="me-2"
            size="small"
          />
          <span>{{ item.title }}</span>
        </div>
      </template>
    </VSelect>
    
    <VBtn
      v-if="canChange && currentStatus !== reclamation.status"
      color="primary"
      variant="tonal"
      size="small"
      :loading="isChanging"
      @click="confirmStatusChange"
      class="mt-2"
    >
      <VIcon icon="ri-check-line" class="me-1" />
      Confirmer
    </VBtn>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ReclamationStatusEnum } from '@/types/reclamation'
import type { Reclamation } from '@/types/reclamation'

interface Props {
  reclamation: Reclamation
  canChange: boolean
  isChanging?: boolean
}

interface Emits {
  (e: 'status-change', status: ReclamationStatusEnum): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const currentStatus = ref<ReclamationStatusEnum>(props.reclamation.status)
const isChanging = ref(false)

const statusOptions = computed(() => [
  {
    title: 'Nouvelle',
    value: ReclamationStatusEnum.NEW,
    color: 'info'
  },
  {
    title: 'En cours',
    value: ReclamationStatusEnum.IN_PROGRESS,
    color: 'warning'
  },
  {
    title: 'Fermée',
    value: ReclamationStatusEnum.CLOSED,
    color: 'success'
  }
])

const getStatusIcon = (status: ReclamationStatusEnum) => {
  const icons = {
    [ReclamationStatusEnum.NEW]: 'ri-add-circle-line',
    [ReclamationStatusEnum.IN_PROGRESS]: 'ri-refresh-line',
    [ReclamationStatusEnum.CLOSED]: 'ri-check-circle-line'
  }
  return icons[status] || 'ri-question-line'
}

const getStatusColor = (status: ReclamationStatusEnum) => {
  const colors = {
    [ReclamationStatusEnum.NEW]: 'info',
    [ReclamationStatusEnum.IN_PROGRESS]: 'warning',
    [ReclamationStatusEnum.CLOSED]: 'success'
  }
  return colors[status] || 'grey'
}

const handleStatusChange = (newStatus: ReclamationStatusEnum) => {
  currentStatus.value = newStatus
}

const confirmStatusChange = async () => {
  if (currentStatus.value === props.reclamation.status) return
  
  isChanging.value = true
  try {
    emit('status-change', currentStatus.value)
  } finally {
    isChanging.value = false
  }
}
</script>

<style scoped>
.status-changer {
  min-width: 200px;
}
</style>
