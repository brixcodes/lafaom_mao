<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut, Bar } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

interface Props {
  title: string
  subtitle?: string
  type: 'doughnut' | 'bar'
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      backgroundColor?: string[]
      borderColor?: string[]
      borderWidth?: number
    }>
  }
  options?: any
  loading?: boolean
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '200px',
  loading: false
})

const chartOptions = computed(() => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true
        }
      }
    }
  }
  
  return { ...defaultOptions, ...props.options }
})
</script>

<template>
  <v-card class="pa-4" elevation="2" rounded="lg">
    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <h3 class="text-h6 font-weight-bold">{{ title }}</h3>
        <p v-if="subtitle" class="text-body-2 text-grey">{{ subtitle }}</p>
      </div>
    </div>

    <div v-if="loading" class="d-flex align-center justify-center" :style="{ height }">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else :style="{ height }">
      <Doughnut 
        v-if="type === 'doughnut'"
        :data="data" 
        :options="chartOptions"
      />
      <Bar 
        v-else-if="type === 'bar'"
        :data="data" 
        :options="chartOptions"
      />
    </div>
  </v-card>
</template>
