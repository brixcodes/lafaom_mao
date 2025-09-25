<template>
  <VRow class="match-height">
    <!-- Utilisateurs -->
    <VCol
      cols="12"
      sm="6"
      lg="3"
    >
      <CardStatisticsVertical
        title="Utilisateurs"
        :stats="totalUsers.toLocaleString()"
        :change="userGrowthRate"
        subtitle="Ce mois"
        color="primary"
        icon="ri-user-line"
      />
    </VCol>

    <!-- Formations -->
    <VCol
      cols="12"
      sm="6"
      lg="3"
    >
      <CardStatisticsVertical
        title="Formations"
        :stats="totalTrainings.toLocaleString()"
        :change="trainingCompletionRate"
        subtitle="Sessions actives"
        color="info"
        icon="ri-graduation-cap-line"
      />
    </VCol>

    <!-- Emplois -->
    <VCol
      cols="12"
      sm="6"
      lg="3"
    >
      <CardStatisticsVertical
        title="Emplois"
        :stats="totalJobOffers.toLocaleString()"
        :change="jobPlacementRate"
        subtitle="Offres publiées"
        color="success"
        icon="ri-briefcase-line"
      />
    </VCol>

    <!-- Revenus -->
    <VCol
      cols="12"
      sm="6"
      lg="3"
    >
      <CardStatisticsVertical
        title="Revenus"
        :stats="formatCurrency(totalRevenue)"
        :change="revenueGrowthRate"
        subtitle="Ce mois"
        color="warning"
        icon="ri-money-dollar-circle-line"
      />
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import CardStatisticsVertical from '@core/components/cards/CardStatisticsVertical.vue'

const dashboardStore = useDashboardStore()

// Computed properties
const totalUsers = computed(() => dashboardStore.totalUsers)
const userGrowthRate = computed(() => dashboardStore.userGrowthRate)
const totalTrainings = computed(() => dashboardStore.totalTrainings)
const trainingCompletionRate = computed(() => dashboardStore.trainingCompletionRate)
const totalJobOffers = computed(() => dashboardStore.totalJobOffers)
const jobPlacementRate = computed(() => dashboardStore.jobPlacementRate)
const totalRevenue = computed(() => dashboardStore.totalRevenue)
const revenueGrowthRate = computed(() => dashboardStore.revenueGrowthRate)

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}
</script>
