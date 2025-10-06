<script setup lang="ts">
import { useTheme } from 'vuetify'
import { dashboardService, type DashboardStats } from '@/services/dashboardService'

const vuetifyTheme = useTheme()
const currentTheme = computed(() => vuetifyTheme.current.value.colors)

// Données réactives
const stats = ref<DashboardStats | null>(null)
const loading = ref(true)

// Données pour le graphique
const series = computed(() => {
  if (!stats.value || loading.value) return [{ name: 'Sessions', data: [0, 0, 0, 0, 0] }]
  
  const sessionsData = stats.value.trainings?.sessions_by_status || {}
  return [
    {
      name: 'Sessions de Formation',
      data: [
        sessionsData.active || 0,
        sessionsData.inactive || 0,
        sessionsData.scheduled || 0,
        sessionsData.completed || 0,
        sessionsData.cancelled || 0
      ],
    },
  ]
})

// Charger les données
const fetchStats = async () => {
  try {
    loading.value = true
    stats.value = await dashboardService.getComprehensiveStats()
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStats()
})

const chartOptions = computed(() => {
  const backgroundColor = currentTheme.value['track-bg']

  return {
    chart: {
      type: 'bar',
      stacked: false,
      width: 200,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
    },
    grid: {
      show: false,
      padding: {
        top: -20,
        left: -7,
        right: 0,
        bottom: -5,
      },
    },
    colors: [currentTheme.value.error, currentTheme.value.primary, currentTheme.value.error, currentTheme.value.primary, currentTheme.value.primary],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '20%',
        borderRadius: 4,
        distributed: true,
        colors: {
          backgroundBarColors: [backgroundColor, backgroundColor, backgroundColor, backgroundColor, backgroundColor],
          backgroundBarRadius: 5,
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 1628,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '20%',
              borderRadius: 2,
            },
          },
        },
      },
      {
        breakpoint: 960,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '15%',
              borderRadius: 6,
            },
          },
        },
      },
      {
        breakpoint: 725,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '15%',
              borderRadius: 4,
            },
          },
        },
      },
    ],
  }
})
</script>

<template>
  <VCard>
    <VCardText>
      <h4 class="text-h4">
        <VProgressCircular v-if="loading" size="20" indeterminate />
        <span v-else>{{ (stats?.trainings.total_active || 0) + (stats?.trainings.total_inactive || 0) }}</span>
      </h4>

      <VueApexCharts
        v-if="!loading && series.length > 0"
        :options="chartOptions"
        :series="series"
        :height="80"
        class="my-1"
      />
      <div v-else-if="loading" class="d-flex justify-center align-center" style="height: 80px;">
        <VProgressCircular size="30" indeterminate />
      </div>

      <h6 class="text-h6 text-center">
        Sessions de Formation
      </h6>
    </VCardText>
  </VCard>
</template>
