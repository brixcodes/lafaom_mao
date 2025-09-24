<template>
  <VCard>
    <VCardTitle>
      <div class="d-flex align-center">
        <VIcon class="mr-3" color="primary">ri-bar-chart-line</VIcon>
        {{ title }}
      </div>
    </VCardTitle>
    
    <VCardText>
      <div v-if="isLoading" class="text-center py-8">
        <VProgressCircular indeterminate color="primary" size="64" />
        <p class="text-body-1 mt-4">Chargement du graphique...</p>
      </div>
      
      <div v-else-if="error" class="text-center py-8">
        <VIcon size="64" color="error" class="mb-4">ri-error-warning-line</VIcon>
        <h3 class="text-h6 mb-2">Erreur de chargement</h3>
        <p class="text-body-2 text-medium-emphasis">{{ error }}</p>
      </div>
      
      <div v-else class="chart-container">
        <canvas ref="chartRef" :width="width" :height="height"></canvas>
      </div>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { Reclamation } from '@/types/reclamation'

interface Props {
  reclamations: Reclamation[]
  type: 'status' | 'priority' | 'type' | 'monthly'
  title?: string
  width?: number
  height?: number
  isLoading?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Graphique des réclamations',
  width: 400,
  height: 300,
  isLoading: false,
  error: ''
})

const chartRef = ref<HTMLCanvasElement>()

// Simple chart implementation (you can replace with Chart.js or similar)
const renderChart = () => {
  if (!chartRef.value) return
  
  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return
  
  // Clear canvas
  ctx.clearRect(0, 0, props.width, props.height)
  
  // Simple bar chart implementation
  const data = getChartData()
  const maxValue = Math.max(...data.values)
  const barWidth = props.width / data.labels.length - 10
  const barHeight = props.height - 40
  
  data.labels.forEach((label, index) => {
    const value = data.values[index]
    const height = (value / maxValue) * barHeight
    const x = index * (barWidth + 10) + 5
    const y = props.height - height - 20
    
    // Draw bar
    ctx.fillStyle = getBarColor(index)
    ctx.fillRect(x, y, barWidth, height)
    
    // Draw label
    ctx.fillStyle = '#666'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(label, x + barWidth / 2, props.height - 5)
    
    // Draw value
    ctx.fillText(value.toString(), x + barWidth / 2, y - 5)
  })
}

const getChartData = () => {
  switch (props.type) {
    case 'status':
      return {
        labels: ['Nouvelles', 'En cours', 'Fermées'],
        values: [
          props.reclamations.filter(r => r.status === 'NEW').length,
          props.reclamations.filter(r => r.status === 'IN_PROGRESS').length,
          props.reclamations.filter(r => r.status === 'CLOSED').length
        ]
      }
    case 'priority':
      return {
        labels: ['Faible', 'Moyenne', 'Élevée'],
        values: [
          props.reclamations.filter(r => r.priority === 'LOW').length,
          props.reclamations.filter(r => r.priority === 'MEDIUM').length,
          props.reclamations.filter(r => r.priority === 'HIGH').length,
          0
        ]
      }
    default:
      return { labels: [], values: [] }
  }
}

const getBarColor = (index: number) => {
  const colors = ['#2196F3', '#FF9800', '#4CAF50', '#F44336', '#9C27B0']
  return colors[index % colors.length]
}

// Watchers
watch(() => props.reclamations, () => {
  renderChart()
}, { deep: true })

// Lifecycle
onMounted(() => {
  renderChart()
})
</script>

<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.v-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
