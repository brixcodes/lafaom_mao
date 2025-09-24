<template>
  <VCard>
    <VCardTitle>
      <div class="d-flex align-center">
        <VIcon class="mr-3" color="primary">ri-bar-chart-box-line</VIcon>
        Métriques des réclamations
      </div>
    </VCardTitle>
    
    <VCardText>
      <VRow>
        <VCol cols="12" sm="6" md="3">
          <div class="text-center">
            <div class="text-h4 font-weight-bold text-primary">{{ metrics.totalReclamations }}</div>
            <div class="text-body-2 text-medium-emphasis">Total réclamations</div>
          </div>
        </VCol>
        
        <VCol cols="12" sm="6" md="3">
          <div class="text-center">
            <div class="text-h4 font-weight-bold text-success">{{ metrics.resolvedReclamations }}</div>
            <div class="text-body-2 text-medium-emphasis">Résolues</div>
          </div>
        </VCol>
        
        <VCol cols="12" sm="6" md="3">
          <div class="text-center">
            <div class="text-h4 font-weight-bold text-warning">{{ metrics.pendingReclamations }}</div>
            <div class="text-body-2 text-medium-emphasis">En attente</div>
          </div>
        </VCol>
        
        <VCol cols="12" sm="6" md="3">
          <div class="text-center">
            <div class="text-h4 font-weight-bold text-info">{{ metrics.averageResolutionTime }}</div>
            <div class="text-body-2 text-medium-emphasis">Temps moyen (jours)</div>
          </div>
        </VCol>
      </VRow>
      
      <VDivider class="my-6" />
      
      <VRow>
        <VCol cols="12" md="6">
          <div class="mb-4">
            <div class="text-body-2 text-medium-emphasis mb-2">Taux de résolution</div>
            <VProgressLinear
              :model-value="metrics.resolutionRate"
              color="success"
              height="8"
              rounded
            />
            <div class="text-caption text-medium-emphasis mt-1">
              {{ metrics.resolutionRate }}% des réclamations sont résolues
            </div>
          </div>
        </VCol>
        
        <VCol cols="12" md="6">
          <div class="mb-4">
            <div class="text-body-2 text-medium-emphasis mb-2">Satisfaction</div>
            <VProgressLinear
              :model-value="metrics.satisfactionRate"
              color="primary"
              height="8"
              rounded
            />
            <div class="text-caption text-medium-emphasis mt-1">
              {{ metrics.satisfactionRate }}% de satisfaction
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import type { Reclamation } from '@/types/reclamation'

interface Props {
  reclamations: Reclamation[]
}

const props = defineProps<Props>()

// Computed metrics
const metrics = computed(() => {
  const total = props.reclamations.length
  const resolved = props.reclamations.filter(r => r.status === 'CLOSED').length
  const pending = props.reclamations.filter(r => r.status === 'IN_PROGRESS').length
  
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0
  const satisfactionRate = 85 // Placeholder - would come from actual data
  
  // Calculate average resolution time (placeholder)
  const averageResolutionTime = 3 // Placeholder - would be calculated from actual data
  
  return {
    totalReclamations: total,
    resolvedReclamations: resolved,
    pendingReclamations: pending,
    resolutionRate,
    satisfactionRate,
    averageResolutionTime
  }
})
</script>

<style scoped>
.v-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
