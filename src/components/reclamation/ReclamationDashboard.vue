<template>
  <div class="reclamation-dashboard">
    <!-- Statistiques principales -->
    <ReclamationStats :reclamations="reclamations" class="mb-6" />
    
    <!-- Graphiques -->
    <VRow class="mb-6">
      <VCol cols="12" md="6">
        <ReclamationChart
          :reclamations="reclamations"
          type="status"
          title="Réclamations par statut"
        />
      </VCol>
      
      <VCol cols="12" md="6">
        <ReclamationChart
          :reclamations="reclamations"
          type="priority"
          title="Réclamations par priorité"
        />
      </VCol>
    </VRow>
    
    <!-- Tableau récent -->
    <VCard>
      <VCardTitle>
        <div class="d-flex align-center">
          <VIcon class="mr-3" color="primary">ri-file-text-line</VIcon>
          Réclamations récentes
        </div>
      </VCardTitle>
      
      <VCardText>
        <ReclamationTable
          :reclamations="recentReclamations"
          :is-loading="isLoading"
          :can-update-status="canUpdateStatus"
          @view="$emit('view', $event)"
          @update-status="$emit('update-status', $event)"
        />
      </VCardText>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Reclamation } from '@/types/reclamation'
import ReclamationStats from './ReclamationStats.vue'
import ReclamationChart from './ReclamationChart.vue'
import ReclamationTable from './ReclamationTable.vue'

interface Props {
  reclamations: Reclamation[]
  isLoading?: boolean
  canUpdateStatus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  canUpdateStatus: false
})

const emit = defineEmits<{
  view: [id: number]
  'update-status': [id: number]
}>()

// Computed
const recentReclamations = computed(() => {
  return props.reclamations
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10)
})
</script>

<style scoped>
.reclamation-dashboard {
  padding: 24px;
}
</style>
