<template>
  <VCard class="reclamation-card" :class="{ 'elevation-2': !isSelected, 'elevation-4': isSelected }">
    <VCardTitle class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <VIcon 
          :icon="getStatusIcon(reclamation.status)" 
          :color="getStatusColor(reclamation.status)" 
          class="me-3"
        />
        <div>
          <h4 class="text-h6">{{ reclamation.title }}</h4>
          <VChip 
            :color="getStatusColor(reclamation.status)" 
            size="small"
            :prepend-icon="getStatusIcon(reclamation.status)"
          >
            {{ getStatusText(reclamation.status) }}
          </VChip>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="d-flex align-center gap-2">
        <!-- Bouton Modifier - Seul le créateur peut voir -->
        <VBtn
          v-if="canModify"
          color="primary"
          variant="outlined"
          size="small"
          prepend-icon="ri-edit-line"
          @click="editReclamation"
        >
          Modifier
        </VBtn>
        
        <!-- Menu d'actions -->
        <VMenu>
          <template #activator="{ props: menuProps }">
            <VBtn
              icon="ri-more-2-line"
              variant="text"
              size="small"
              v-bind="menuProps"
            />
          </template>
          
          <VList>
            <VListItem @click="viewDetails">
              <template #prepend>
                <VIcon icon="ri-eye-line" />
              </template>
              <VListItemTitle>Voir les détails</VListItemTitle>
            </VListItem>
            
            <VListItem 
              v-if="canModify"
              @click="editReclamation"
            >
              <template #prepend>
                <VIcon icon="ri-edit-line" />
              </template>
              <VListItemTitle>Modifier</VListItemTitle>
            </VListItem>
            
            <VListItem 
              v-if="canChangeStatus"
              @click="showStatusChanger = true"
            >
              <template #prepend>
                <VIcon icon="ri-refresh-line" />
              </template>
              <VListItemTitle>Changer le statut</VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>
      </div>
    </VCardTitle>
    
    <VCardText>
      <p class="text-body-2 text-medium-emphasis mb-3">
        {{ truncateText(reclamation.description, 150) }}
      </p>
      
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center gap-3">
          <VChip 
            :color="getPriorityColor(reclamation.priority)" 
            size="small"
            :prepend-icon="getPriorityIcon(reclamation.priority)"
          >
            {{ getPriorityText(reclamation.priority) }}
          </VChip>
          
          <span class="text-caption text-medium-emphasis">
            {{ formatDate(reclamation.created_at) }}
          </span>
        </div>
        
        <VBtn
          color="primary"
          variant="text"
          size="small"
          @click="viewDetails"
        >
          Voir les détails
          <VIcon icon="ri-arrow-right-line" class="ml-1" />
        </VBtn>
      </div>
    </VCardText>
    
    <!-- Dialog pour changer le statut -->
    <VDialog v-model="showStatusChanger" max-width="400">
      <VCard>
        <VCardTitle>Changer le statut</VCardTitle>
        <VCardText>
          <StatusChanger
            :reclamation="reclamation"
            :can-change="canChangeStatus"
            :is-changing="isChangingStatus"
            @status-change="handleStatusChange"
          />
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn 
            color="grey" 
            variant="text" 
            @click="showStatusChanger = false"
          >
            Fermer
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useReclamation } from '@/composables/useReclamation'
import { ReclamationStatusEnum, ReclamationPriorityEnum } from '@/types/reclamation'
import type { Reclamation } from '@/types/reclamation'
import StatusChanger from './StatusChanger.vue'

interface Props {
  reclamation: Reclamation
  isSelected?: boolean
}

interface Emits {
  (e: 'view-details', reclamation: Reclamation): void
  (e: 'edit', reclamation: Reclamation): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { 
  canModifyReclamation, 
  canChangeReclamationStatus, 
  changeReclamationStatus 
} = useReclamation()

const showStatusChanger = ref(false)
const isChangingStatus = ref(false)

// Permissions
const canModify = computed(() => canModifyReclamation(props.reclamation))
const canChangeStatus = computed(() => canChangeReclamationStatus(props.reclamation))

// Fonctions d'affichage
const getStatusText = (status: ReclamationStatusEnum) => {
  const texts = {
    [ReclamationStatusEnum.NEW]: 'Nouvelle',
    [ReclamationStatusEnum.IN_PROGRESS]: 'En cours',
    [ReclamationStatusEnum.CLOSED]: 'Fermée'
  }
  return texts[status] || 'Inconnu'
}

const getStatusColor = (status: ReclamationStatusEnum) => {
  const colors = {
    [ReclamationStatusEnum.NEW]: 'info',
    [ReclamationStatusEnum.IN_PROGRESS]: 'warning',
    [ReclamationStatusEnum.CLOSED]: 'success'
  }
  return colors[status] || 'grey'
}

const getStatusIcon = (status: ReclamationStatusEnum) => {
  const icons = {
    [ReclamationStatusEnum.NEW]: 'ri-add-circle-line',
    [ReclamationStatusEnum.IN_PROGRESS]: 'ri-refresh-line',
    [ReclamationStatusEnum.CLOSED]: 'ri-check-circle-line'
  }
  return icons[status] || 'ri-question-line'
}

const getPriorityText = (priority: ReclamationPriorityEnum) => {
  const texts = {
    [ReclamationPriorityEnum.LOW]: 'Faible',
    [ReclamationPriorityEnum.MEDIUM]: 'Moyenne',
    [ReclamationPriorityEnum.HIGH]: 'Élevée'
  }
  return texts[priority] || 'Inconnue'
}

const getPriorityColor = (priority: ReclamationPriorityEnum) => {
  const colors = {
    [ReclamationPriorityEnum.LOW]: 'success',
    [ReclamationPriorityEnum.MEDIUM]: 'warning',
    [ReclamationPriorityEnum.HIGH]: 'error'
  }
  return colors[priority] || 'grey'
}

const getPriorityIcon = (priority: ReclamationPriorityEnum) => {
  const icons = {
    [ReclamationPriorityEnum.LOW]: 'ri-arrow-down-line',
    [ReclamationPriorityEnum.MEDIUM]: 'ri-arrow-right-line',
    [ReclamationPriorityEnum.HIGH]: 'ri-arrow-up-line'
  }
  return icons[priority] || 'ri-question-line'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Actions
const viewDetails = () => {
  emit('view-details', props.reclamation)
}

const editReclamation = () => {
  emit('edit', props.reclamation)
}

const handleStatusChange = async (newStatus: ReclamationStatusEnum) => {
  isChangingStatus.value = true
  try {
    const success = await changeReclamationStatus(props.reclamation, newStatus)
    if (success) {
      showStatusChanger.value = false
    }
  } finally {
    isChangingStatus.value = false
  }
}
</script>

<style scoped>
.reclamation-card {
  transition: all 0.2s ease;
  cursor: pointer;
}

.reclamation-card:hover {
  transform: translateY(-2px);
}
</style>