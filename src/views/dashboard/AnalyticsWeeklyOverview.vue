<script setup lang="ts">
import { useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils'

const vuetifyTheme = useTheme()

const options = computed(() => {
  const currentTheme = ref(vuetifyTheme.current.value.colors)
  const variableTheme = ref(vuetifyTheme.current.value.variables)

  const disabledColor = `rgba(${hexToRgb(currentTheme.value['on-surface'])},${variableTheme.value['disabled-opacity']})`
  const borderColor = `rgba(${hexToRgb(String(variableTheme.value['border-color']))},${variableTheme.value['border-opacity']})`

  return {
    chart: {
      offsetY: -10,
      offsetX: -15,
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
        columnWidth: '30%',
      },
    },
    stroke: {
      width: 2,
      colors: [currentTheme.value.surface],
    },
    legend: { show: false },
    grid: {
      borderColor,
      strokeDashArray: 7,
      xaxis: { lines: { show: false } },
    },
    dataLabels: { enabled: false },
    colors: [
      currentTheme.value['track-bg'],
      currentTheme.value['track-bg'],
      currentTheme.value['track-bg'],
      'rgba(var(--v-theme-primary),1)',
      currentTheme.value['track-bg'],
      currentTheme.value['track-bg'],
    ],
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } },
    },
    xaxis: {
      categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      tickPlacement: 'on',
      labels: { show: false },
      crosshairs: { opacity: 0 },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      show: true,
      tickAmount: 4,
      labels: {
        style: {
          colors: disabledColor,
          fontSize: '13px',
        },

        formatter: (value: number) => `${value > 999 ? `${(value / 1000).toFixed(0)}` : value}k`,
      },
    },
    responsive: [
      {
        breakpoint: 1560,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '35%',
            },
          },
        },
      },
      {
        breakpoint: 1380,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '45%',
            },
          },
        },
      },
    ],
  }
})

import { dashboardService, type DashboardStats } from '@/services/dashboardService'

// Données réactives
const stats = ref<DashboardStats | null>(null)
const loading = ref(true)

// Données hebdomadaires simulées basées sur les statistiques réelles
const series = computed(() => {
  if (!stats.value || loading.value) return [{ data: [0, 0, 0, 0, 0, 0, 0] }]
  
  const users = stats.value.users || {}
  const trainings = stats.value.trainings || {}
  const jobOffers = stats.value.job_offers || {}
  const blog = stats.value.blog || {}
  
  const usersTotal = users.total || 0
  const trainingsTotal = trainings.total_active || 0
  const jobOffersTotal = jobOffers.total || 0
  const blogPostsTotal = blog.total_posts || 0
  
  // Simulation de données hebdomadaires basées sur les totaux
  return [{ 
    data: [
      Math.floor(usersTotal * 0.1), // Dimanche
      Math.floor(trainingsTotal * 0.15), // Lundi
      Math.floor(jobOffersTotal * 0.12), // Mardi
      Math.floor(blogPostsTotal * 0.18), // Mercredi
      Math.floor(usersTotal * 0.14), // Jeudi
      Math.floor(trainingsTotal * 0.11), // Vendredi
      Math.floor(jobOffersTotal * 0.13) // Samedi
    ] 
  }]
})

// Performance hebdomadaire
const weeklyPerformance = computed(() => {
  if (!stats.value) return 0

  const users = stats.value.users || {}
  const trainings = stats.value.trainings || {}
  const jobOffers = stats.value.job_offers || {}
  const blog = stats.value.blog || {}

  const total = (users.total || 0) +
    (trainings.total_active || 0) +
    (jobOffers.total || 0) +
    (blog.total_posts || 0)

  return Math.floor((total / 100) * 45) // Simulation de 45% de performance
})

const moreList = [
  { title: 'Partager', value: 'Partager' },
  { title: 'Actualiser', value: 'Actualiser' },
  { title: 'Mettre à jour', value: 'Mettre à jour' },
]

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
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Aperçu Hebdomadaire</VCardTitle>

      <template #append>
        <div class="me-n3">
          <MoreBtn :menu-list="moreList" />
        </div>
      </template>
    </VCardItem>

    <VCardText>
      <VueApexCharts v-if="!loading && series.length > 0" type="bar" :options="options" :series="series"
        :height="200" />
      <div v-else-if="loading" class="d-flex justify-center align-center" style="height: 200px;">
        <VProgressCircular size="30" indeterminate />
      </div>

      <div class="d-flex align-center mb-5 gap-x-4">
        <h4 class="text-h4">
          <VProgressCircular v-if="loading" size="20" indeterminate />
          <span v-else>{{ weeklyPerformance }}%</span>
        </h4>
        <p class="mb-0">
          Votre performance est de {{ weeklyPerformance }}% <span class="text-high-emphasis">😎</span> meilleure par
          rapport
          au mois dernier
        </p>
      </div>

      <VBtn block>
        Détails
      </VBtn>
    </VCardText>
  </VCard>
</template>
