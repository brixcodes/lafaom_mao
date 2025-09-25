<template>
  <VCard>
    <VCardTitle class="d-flex justify-space-between align-center">
      <span>Widget de performance</span>
      <VBtn variant="text" size="small">Actualiser</VBtn>
    </VCardTitle>
    <VCardText>
      <div class="performance-widget">
        <!-- Métriques principales -->
        <div class="metrics-grid mb-4">
          <div class="metric-card text-center pa-3 rounded">
            <div class="text-h4 font-weight-bold text-primary mb-1">72%</div>
            <div class="text-caption">Objectif mensuel</div>
            <div class="text-caption text-success">+12% cette semaine</div>
          </div>
          <div class="metric-card text-center pa-3 rounded">
            <div class="text-h4 font-weight-bold text-success mb-1">95%</div>
            <div class="text-caption">Taux de réussite</div>
            <div class="text-caption text-success">+5% ce mois</div>
          </div>
          <div class="metric-card text-center pa-3 rounded">
            <div class="text-h4 font-weight-bold text-warning mb-1">4.5/5</div>
            <div class="text-caption">Satisfaction</div>
            <div class="text-caption text-success">+0.3 ce mois</div>
          </div>
        </div>

        <!-- Graphique de performance -->
        <div class="performance-chart mb-4">
          <VueApexCharts
            type="line"
            height="200"
            :options="chartOptions"
            :series="chartSeries"
          />
        </div>

        <!-- Actions rapides -->
        <div class="quick-actions">
          <VBtn
            color="primary"
            variant="elevated"
            block
            class="mb-2"
          >
            <VIcon start icon="tabler-chart-line" />
            Voir le rapport complet
          </VBtn>
          <VBtn
            color="success"
            variant="outlined"
            block
            class="mb-2"
          >
            <VIcon start icon="tabler-download" />
            Exporter les données
          </VBtn>
          <VBtn
            color="info"
            variant="outlined"
            block
          >
            <VIcon start icon="tabler-settings" />
            Configurer les alertes
          </VBtn>
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
    type: 'line',
    toolbar: {
      show: false
    }
  },
  colors: ['#7367F0', '#28C76F'],
  stroke: {
    curve: 'smooth',
    width: 3
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin']
  },
  yaxis: {
    title: {
      text: 'Performance (%)'
    }
  },
  legend: {
    show: false
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
    name: 'Performance',
    data: [65, 78, 85, 92, 88, 95]
  },
  {
    name: 'Objectif',
    data: [60, 70, 80, 85, 90, 95]
  }
])
</script>

<style scoped>
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.metric-card {
  background-color: rgba(var(--v-theme-surface), 0.5);
  border: 1px solid rgba(var(--v-theme-border), 0.12);
  transition: all 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.performance-chart {
  margin: 16px 0;
}

.quick-actions {
  border-top: 1px solid rgba(var(--v-theme-border), 0.12);
  padding-top: 16px;
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
