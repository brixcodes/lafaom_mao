<template>
  <VCard>
    <VCardTitle class="d-flex justify-space-between align-center">
      <span>Performance mensuelle</span>
      <VBtn variant="text" size="small">Voir rapport</VBtn>
    </VCardTitle>
    <VCardText>
      <div class="d-flex justify-space-between align-center mb-4">
        <div>
          <div class="text-h4 font-weight-bold text-primary">45%</div>
          <div class="text-caption">Amélioration des performances</div>
        </div>
        <div class="text-right">
          <div class="text-h6">Vos performances sont 45% meilleures</div>
          <div class="text-caption">par rapport au mois dernier 👍</div>
        </div>
      </div>
      
      <!-- Graphique de performance -->
      <div class="performance-chart">
        <VueApexCharts
          type="bar"
          height="200"
          :options="chartOptions"
          :series="chartSeries"
        />
      </div>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// @ts-ignore
import VueApexCharts from 'vue3-apexcharts'

const chartOptions = ref({
  chart: {
    type: 'bar',
    toolbar: {
      show: false
    }
  },
  colors: ['#7367F0', '#E8E8E8'],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded'
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4']
  },
  yaxis: {
    title: {
      text: 'Performance (%)'
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return val + "%"
      }
    }
  }
})

const chartSeries = ref([
  {
    name: 'Performance actuelle',
    data: [65, 78, 85, 92]
  },
  {
    name: 'Performance précédente',
    data: [45, 52, 58, 62]
  }
])
</script>

<style scoped>
.performance-chart {
  margin-top: 16px;
}
</style>
