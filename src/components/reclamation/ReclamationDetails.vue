<template>
  <VCard v-if="reclamation" class="reclamation-details">
    <VCardTitle class="d-flex align-center justify-space-between">
      <div>
        <h3>{{ reclamation.title }}</h3>
        <VChip 
          :color="getStatusColor(reclamation.status)" 
          :prepend-icon="getStatusIcon(reclamation.status)"
          size="small"
        >
          {{ getStatusText(reclamation.status) }}
        </VChip>
      </div>
      
      <!-- Bouton Modifier - Seul le créateur peut voir -->
      <VBtn
        v-if="canModify"
        color="primary"
        variant="outlined"
        prepend-icon="ri-edit-line"
        @click="editReclamation"
      >
        Modifier
      </VBtn>
    </VCardTitle>
    
    <VCardText>
      <VRow>
        <VCol cols="12" md="8">
          <h4>Description</h4>
          <p class="text-body-1">{{ reclamation.description }}</p>
        </VCol>
        
        <VCol cols="12" md="4">
          <VCard variant="outlined">
            <VCardTitle>Informations</VCardTitle>
            <VCardText>
              <div class="mb-3">
                <strong>Priorité:</strong>
                <VChip 
                  :color="getPriorityColor(reclamation.priority)" 
                  size="small" 
                  class="ml-2"
                >
                  {{ getPriorityText(reclamation.priority) }}
                </VChip>
              </div>
              
              <div class="mb-3">
                <strong>Type:</strong>
                <span class="ml-2">{{ reclamation.reclamation_type?.name || 'Non spécifié' }}</span>
              </div>
              
              <div class="mb-3">
                <strong>Créé le:</strong>
                <span class="ml-2">{{ formatDate(reclamation.created_at) }}</span>
              </div>
              
              <div class="mb-3">
                <strong>Modifié le:</strong>
                <span class="ml-2">{{ formatDate(reclamation.updated_at) }}</span>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
      
      <!-- Section de changement de statut -->
      <VRow v-if="canChangeStatus" class="mt-4">
        <VCol cols="12">
          <VCard variant="outlined" color="primary">
            <VCardTitle class="d-flex align-center">
              <VIcon icon="ri-refresh-line" class="me-2" />
              Gestion du statut
            </VCardTitle>
            <VCardText>
              <StatusChanger
                :reclamation="reclamation"
                :can-change="canChangeStatus"
                :is-changing="isChangingStatus"
                @status-change="handleStatusChange"
              />
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCardText>
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
}

interface Emits {
  (e: 'edit', reclamation: Reclamation): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { 
  canModifyReclamation, 
  canChangeReclamationStatus, 
  changeReclamationStatus 
} = useReclamation()

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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Actions
const editReclamation = () => {
  emit('edit', props.reclamation)
}

const handleStatusChange = async (newStatus: ReclamationStatusEnum) => {
  isChangingStatus.value = true
  try {
    const success = await changeReclamationStatus(props.reclamation, newStatus)
    if (success) {
      // Le composable gère déjà la mise à jour et les notifications
    }
  } finally {
    isChangingStatus.value = false
  }
}
</script>

<style scoped>
.reclamation-details {
  max-width: 100%;
}
</style>
