<template>
  <VCard>
    <VCardTitle class="d-flex justify-space-between align-center">
      <span>Métriques avancées</span>
      <VBtn variant="text" size="small">Voir tout</VBtn>
    </VCardTitle>
    <VCardText>
      <div class="advanced-metrics">
        <!-- Métriques principales -->
        <div class="metrics-grid mb-6">
          <div class="metric-item text-center">
            <div class="text-h4 font-weight-bold text-primary mb-1">13k</div>
            <div class="text-caption">Évaluations</div>
            <div class="text-caption text-success">+15.6% cette année</div>
          </div>
          <div class="metric-item text-center">
            <div class="text-h4 font-weight-bold text-info mb-1">24.5k</div>
            <div class="text-caption">Sessions</div>
            <div class="text-caption text-error">-20% cette semaine</div>
          </div>
          <div class="metric-item text-center">
            <div class="text-h4 font-weight-bold text-success mb-1">40.5%</div>
            <div class="text-caption">Croissance totale</div>
            <div class="text-caption text-success">ce mois</div>
          </div>
        </div>

        <!-- Graphique de performance -->
        <div class="performance-chart mb-4">
          <VueApexCharts
            type="area"
            height="200"
            :options="chartOptions"
            :series="chartSeries"
          />
        </div>

        <!-- Métriques détaillées -->
        <div class="detailed-metrics">
          <div class="d-flex justify-space-between align-center mb-3">
            <span class="text-body-2 font-weight-medium">Ventes</span>
            <span class="text-h6 font-weight-bold">245k</span>
          </div>
          <div class="d-flex justify-space-between align-center mb-3">
            <span class="text-body-2 font-weight-medium">Clients</span>
            <span class="text-h6 font-weight-bold">12.5k</span>
          </div>
          <div class="d-flex justify-space-between align-center mb-3">
            <span class="text-body-2 font-weight-medium">Produits</span>
            <span class="text-h6 font-weight-bold">1.54k</span>
          </div>
          <div class="d-flex justify-space-between align-center">
            <span class="text-body-2 font-weight-medium">Revenus</span>
            <span class="text-h6 font-weight-bold text-primary">88k€</span>
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
    type: 'area',
    toolbar: {
      show: false
    }
  },
  colors: ['#7367F0', '#28C76F'],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3,
      stops: [0, 90, 100]
    }
  },
  xaxis: {
    categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin']
  },
  yaxis: {
    title: {
      text: 'Performance'
    }
  },
  legend: {
    show: false
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return val + "k"
      }
    }
  }
})

const chartSeries = ref([
  {
    name: 'Revenus',
    data: [30, 40, 35, 50, 49, 60]
  },
  {
    name: 'Dépenses',
    data: [20, 25, 30, 35, 40, 45]
  }
])
</script>

<style scoped>
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.metric-item {
  padding: 16px;
  border-radius: 8px;
  background-color: rgba(var(--v-theme-surface), 0.5);
}

.performance-chart {
  margin: 16px 0;
}

.detailed-metrics {
  border-top: 1px solid rgba(var(--v-theme-border), 0.12);
  padding-top: 16px;
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
