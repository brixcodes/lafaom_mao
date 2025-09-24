<template>
  <VCard>
    <VCardTitle>
      <div class="d-flex align-center">
        <VIcon class="mr-3" color="primary">ri-file-text-line</VIcon>
        Résumé de la réclamation
      </div>
    </VCardTitle>
    
    <VCardText>
      <VRow>
        <VCol cols="12" md="6">
          <div class="mb-3">
            <div class="text-body-2 text-medium-emphasis mb-1">Numéro</div>
            <div class="text-h6 font-weight-bold">{{ reclamation.reclamation_number }}</div>
          </div>
        </VCol>
        
        <VCol cols="12" md="6">
          <div class="mb-3">
            <div class="text-body-2 text-medium-emphasis mb-1">Statut</div>
            <ReclamationStatusBadge :status="reclamation.status" />
          </div>
        </VCol>
        
        <VCol cols="12" md="6">
          <div class="mb-3">
            <div class="text-body-2 text-medium-emphasis mb-1">Priorité</div>
            <ReclamationPriorityBadge :priority="reclamation.priority" />
          </div>
        </VCol>
        
        <VCol cols="12" md="6">
          <div class="mb-3">
            <div class="text-body-2 text-medium-emphasis mb-1">Type</div>
            <div class="text-body-1">{{ reclamation.reclamation_type?.name || 'Non spécifié' }}</div>
          </div>
        </VCol>
        
        <VCol cols="12">
          <div class="mb-3">
            <div class="text-body-2 text-medium-emphasis mb-1">Sujet</div>
            <div class="text-body-1">{{ reclamation.subject }}</div>
          </div>
        </VCol>
        
        <VCol cols="12">
          <div class="mb-3">
            <div class="text-body-2 text-medium-emphasis mb-1">Description</div>
            <div class="text-body-1">{{ reclamation.description }}</div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import type { Reclamation } from '@/types/reclamation'
import ReclamationStatusBadge from './ReclamationStatusBadge.vue'
import ReclamationPriorityBadge from './ReclamationPriorityBadge.vue'

interface Props {
  reclamation: Reclamation
}

defineProps<Props>()
</script>

<style scoped>
.v-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
