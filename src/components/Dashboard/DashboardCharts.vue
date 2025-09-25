<template>
  <VRow>
    <!-- Graphique des revenus -->
    <VCol cols="12" lg="12">
      <VCardTitle>
        <VIcon icon="ri-line-chart-line" class="me-2" />
        Évolution des revenus
      </VCardTitle>
      <VCardText>
        <VueApexCharts type="line" height="350" :options="revenueChartOptions" :series="revenueChartSeries" />
      </VCardText>
    </VCol>

    <!-- Graphique des inscriptions -->
    <VCol cols="12" lg="12">
      <VCardTitle>
        <VIcon icon="ri-user-add-line" class="me-2" />
        Inscriptions utilisateurs
      </VCardTitle>
      <VCardText>
        <VueApexCharts type="area" height="350" :options="registrationsChartOptions"
          :series="registrationsChartSeries" />
      </VCardText>
    </VCol>

    <!-- Graphique des candidatures formations -->
    <VCol cols="12" lg="12">
      <VCardTitle>
        <VIcon icon="ri-graduation-cap-line" class="me-2" />
        Candidatures formations
      </VCardTitle>
      <VCardText>
        <VueApexCharts type="bar" height="300" :options="trainingApplicationsChartOptions"
          :series="trainingApplicationsChartSeries" />
      </VCardText>
    </VCol>

    <!-- Graphique des candidatures emplois -->
    <VCol cols="12" lg="12">
      <VCardTitle>
        <VIcon icon="ri-briefcase-line" class="me-2" />
        Candidatures emplois
      </VCardTitle>
      <VCardText>
        <VueApexCharts type="bar" height="300" :options="jobApplicationsChartOptions"
          :series="jobApplicationsChartSeries" />
      </VCardText>
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
// @ts-ignore
import VueApexCharts from 'vue3-apexcharts'

const dashboardStore = useDashboardStore()

// Chart options
const revenueChartOptions = computed(() => ({
  chart: {
    type: 'line',
    toolbar: {
      show: false
    }
  },
  colors: ['#7367F0'],
  stroke: {
    curve: 'smooth',
    width: 3
  },
  xaxis: {
    categories: dashboardStore.chartData?.revenue_trend.map(item => item.date) || []
  },
  yaxis: {
    labels: {
      formatter: (value: number) => `€${value.toLocaleString()}`
    }
  },
  tooltip: {
    y: {
      formatter: (value: number) => `€${value.toLocaleString()}`
    }
  }
}))

const revenueChartSeries = computed(() => [{
  name: 'Revenus',
  data: dashboardStore.chartData?.revenue_trend.map(item => item.amount) || []
}])

const registrationsChartOptions = computed(() => ({
  chart: {
    type: 'area',
    toolbar: {
      show: false
    }
  },
  colors: ['#28C76F'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3
    }
  },
  xaxis: {
    categories: dashboardStore.chartData?.user_registrations.map(item => item.date) || []
  },
  yaxis: {
    labels: {
      formatter: (value: number) => value.toString()
    }
  }
}))

const registrationsChartSeries = computed(() => [{
  name: 'Inscriptions',
  data: dashboardStore.chartData?.user_registrations.map(item => item.count) || []
}])

const trainingApplicationsChartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: {
      show: false
    }
  },
  colors: ['#00CFE8'],
  xaxis: {
    categories: dashboardStore.chartData?.training_applications.map(item => item.date) || []
  },
  yaxis: {
    labels: {
      formatter: (value: number) => value.toString()
    }
  }
}))

const trainingApplicationsChartSeries = computed(() => [{
  name: 'Candidatures Formations',
  data: dashboardStore.chartData?.training_applications.map(item => item.count) || []
}])

const jobApplicationsChartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: {
      show: false
    }
  },
  colors: ['#FF9F43'],
  xaxis: {
    categories: dashboardStore.chartData?.job_applications.map(item => item.date) || []
  },
  yaxis: {
    labels: {
      formatter: (value: number) => value.toString()
    }
  }
}))

const jobApplicationsChartSeries = computed(() => [{
  name: 'Candidatures Emplois',
  data: dashboardStore.chartData?.job_applications.map(item => item.count) || []
}])
</script>
