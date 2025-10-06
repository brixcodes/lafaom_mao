<script setup lang="ts">
import { useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils'
import { dashboardService, type PaymentStats } from '@/services/dashboardService'

const vuetifyTheme = useTheme()

// Données réactives
const paymentStats = ref<PaymentStats | null>(null)
const loading = ref(true)

// Données pour le graphique de profit (UNIQUEMENT les montants acceptés EUR)
const series = computed(() => {
  if (!paymentStats.value || loading.value) return [{ data: [0, 0, 0, 0, 0, 0] }]

  const generalPayments = paymentStats.value.general_payments || {}

  return [
    {
      data: [
        generalPayments.amounts_by_status?.accepted || 0, // Paiements acceptés EUR (30.44€)
        generalPayments.by_status?.accepted || 0, // Nombre de paiements acceptés EUR (3)
        generalPayments.this_month?.amount || 0, // Paiements ce mois (61.32€)
        generalPayments.this_week?.amount || 0, // Paiements cette semaine (61.32€)
        generalPayments.amounts_by_status?.pending || 0, // Paiements en attente (917.08€)
        generalPayments.amounts_by_status?.refused || 0 // Paiements refusés (0.30€)
      ],
    },
  ]
})

// Fonction de formatage des montants
const formatAmount = (amount: number): string => {
  if (amount === 0) return '0 €'

  const absAmount = Math.abs(amount)

  if (absAmount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)}Mdr €`
  } else if (absAmount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M €`
  } else if (absAmount >= 1_000) {
    return `${(amount / 1_000).toFixed(1)}k €`
  } else {
    return `${amount.toFixed(2)}€`
  }
}

// Total des profits (UNIQUEMENT les montants acceptés EUR)
const totalProfit = computed(() => {
  if (!paymentStats.value) return 0

  const generalPayments = paymentStats.value.general_payments || {}

  // SEULEMENT le montant accepté EUR (30.44€)
  const totalEUR = generalPayments.amounts_by_status?.accepted || 0

  return totalEUR
})

// Total des profits formaté
const formattedTotalProfit = computed(() => {
  return formatAmount(totalProfit.value)
})

// Charger les données
const fetchPaymentStats = async () => {
  try {
    loading.value = true
    paymentStats.value = await dashboardService.getPaymentStats()
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques de paiement:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPaymentStats()
})

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables

  return {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    tooltip: { enabled: false },
    grid: {
      borderColor: `rgba(${hexToRgb(String(variableTheme['border-color']))},${variableTheme['border-opacity']})`,
      strokeDashArray: 6,
      xaxis: {
        lines: { show: true },
      },
      yaxis: {
        lines: { show: false },
      },
      padding: {
        top: -10,
        left: -7,
        right: 5,
        bottom: 5,
      },
    },
    stroke: {
      width: 3,
      lineCap: 'butt',
      curve: 'straight',
    },
    colors: [currentTheme.primary],
    markers: {
      size: 6,
      offsetY: 4,
      offsetX: -2,
      strokeWidth: 3,
      colors: ['transparent'],
      strokeColors: 'transparent',
      discrete: [
        {
          size: 5.5,
          seriesIndex: 0,
          strokeColor: currentTheme.primary,
          fillColor: currentTheme.surface,
          dataPointIndex: series[0]?.data?.length ? series[0].data.length - 1 : 0,
        },
      ],
      hover: { size: 7 },
    },
    xaxis: {
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      labels: { show: false },
    },
  }
})
</script>

<template>
  <VCard>
    <VCardText>
      <h4 class="text-h4">
        <VProgressCircular v-if="loading" size="20" indeterminate />
        <span v-else>{{ formattedTotalProfit }}</span>
      </h4>
      <VueApexCharts v-if="!loading && series.length > 0" type="line" :options="chartOptions" :series="series"
        :height="80" class="my-1" />
      <div v-else-if="loading" class="d-flex justify-center align-center" style="height: 80px;">
        <VProgressCircular size="30" indeterminate />
      </div>

      <h6 class="text-center" style="font-size: 10px;">
        Revenus Acceptés <br>(EUR uniquement)
      </h6>
    </VCardText>
  </VCard>
</template>
