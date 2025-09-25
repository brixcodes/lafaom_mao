<template>
  <VCard>
    <VCardTitle class="d-flex justify-space-between align-center">
      <span>Résumé des performances</span>
      <VBtn variant="text" size="small">Voir rapport</VBtn>
    </VCardTitle>
    <VCardText>
      <div class="performance-summary">
        <!-- Métriques principales -->
        <div class="d-flex justify-space-between align-center mb-4">
          <div class="text-center">
            <div class="text-h4 font-weight-bold text-primary">95%</div>
            <div class="text-caption">Taux de réussite</div>
          </div>
          <div class="text-center">
            <div class="text-h4 font-weight-bold text-success">2.5j</div>
            <div class="text-caption">Temps moyen</div>
          </div>
          <div class="text-center">
            <div class="text-h4 font-weight-bold text-warning">4.5/5</div>
            <div class="text-caption">Satisfaction</div>
          </div>
        </div>

        <!-- Graphique radar -->
        <div class="radar-chart mb-4">
          <VueApexCharts
            type="radar"
            height="250"
            :options="chartOptions"
            :series="chartSeries"
          />
        </div>

        <!-- Légende -->
        <div class="d-flex justify-center gap-4">
          <div class="d-flex align-center">
            <div class="performance-legend-dot primary me-2"></div>
            <span class="text-caption">Revenus</span>
          </div>
          <div class="d-flex align-center">
            <div class="performance-legend-dot success me-2"></div>
            <span class="text-caption">Valeur nette</span>
          </div>
        </div>
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
    type: 'radar',
    toolbar: {
      show: false
    }
  },
  colors: ['#7367F0', '#E8E8E8'],
  plotOptions: {
    radar: {
      size: 140,
      polygons: {
        strokeColors: '#E8E8E8',
        fill: {
          colors: ['#F8F9FA', '#FFFFFF']
        }
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin']
  },
  yaxis: {
    show: false
  },
  fill: {
    opacity: 0.8
  },
  stroke: {
    width: 2
  },
  legend: {
    show: false
  }
})

const chartSeries = ref([
  {
    name: 'Revenus',
    data: [65, 78, 85, 92, 88, 95]
  },
  {
    name: 'Valeur nette',
    data: [45, 52, 58, 62, 68, 72]
  }
])
</script>

<style scoped>
.performance-summary {
  text-align: center;
}

.radar-chart {
  margin: 16px 0;
}

.performance-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.performance-legend-dot.primary {
  background-color: #7367F0;
}

.performance-legend-dot.success {
  background-color: #28C76F;
}
</style>
