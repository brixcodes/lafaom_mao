<template>
  <VCard class="h-100">
    <VCardTitle>Revenus et ventes</VCardTitle>
    <VCardText>
      <div class="mb-4">
        <div class="text-h4 font-weight-bold text-primary mb-2">
          {{ new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalSales) }}
        </div>
        <div class="text-caption text-success">
          <VIcon icon="tabler-trending-up" size="16" class="me-1" />
          +{{ growthRate }}% cette semaine
        </div>
      </div>
      
      <!-- Graphique en donut -->
      <div class="revenue-chart mb-4">
        <VueApexCharts
          type="donut"
          height="150"
          :options="chartOptions"
          :series="chartSeries"
        />
      </div>
      
      <!-- Légende -->
      <div class="d-flex justify-space-between">
        <div class="d-flex align-center">
          <div class="revenue-legend-dot primary me-2"></div>
          <span class="text-caption">Revenus</span>
        </div>
        <div class="d-flex align-center">
          <div class="revenue-legend-dot success me-2"></div>
          <span class="text-caption">Croissance</span>
        </div>
      </div>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
// @ts-ignore
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps<{
  totalSales?: number
  growthRate?: number
}>()

const totalSales = computed(() => props.totalSales || 25000)
const growthRate = computed(() => props.growthRate || 15.8)


const chartOptions = ref({
  chart: {
    type: 'donut',
    toolbar: {
      show: false
    }
  },
  colors: ['#7367F0', '#28C76F'],
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            formatter: function () {
              return '100%'
            }
          }
        }
      }
    }
  },
  labels: ['Revenus', 'Croissance'],
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  }
})

const chartSeries = ref([75, 25])
</script>

<style scoped>
.revenue-chart {
  margin: 16px 0;
}

.revenue-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.revenue-legend-dot.primary {
  background-color: #7367F0;
}

.revenue-legend-dot.success {
  background-color: #28C76F;
}
</style>
