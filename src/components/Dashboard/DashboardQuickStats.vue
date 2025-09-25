<template>
  <VRow>
    <!-- Statistiques des formations -->
    <VCol
      cols="12"
      md="6"
      lg="3"
    >
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon
            icon="ri-graduation-cap-line"
            class="me-2"
            color="info"
          />
          Formations
        </VCardTitle>
        <VCardText>
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-body-2">Sessions actives</span>
            <span class="text-h6">{{ activeTrainingSessions }}</span>
          </div>
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-body-2">Candidatures</span>
            <span class="text-h6">{{ trainingApplications }}</span>
          </div>
          <div class="d-flex justify-space-between align-center">
            <span class="text-body-2">Taux de réussite</span>
            <VChip
              :color="getCompletionRateColor(trainingCompletionRate)"
              size="small"
            >
              {{ trainingCompletionRate }}%
            </VChip>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <!-- Statistiques des emplois -->
    <VCol
      cols="12"
      md="6"
      lg="3"
    >
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon
            icon="ri-briefcase-line"
            class="me-2"
            color="success"
          />
          Emplois
        </VCardTitle>
        <VCardText>
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-body-2">Offres publiées</span>
            <span class="text-h6">{{ totalJobOffers }}</span>
          </div>
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-body-2">Candidatures</span>
            <span class="text-h6">{{ jobApplications }}</span>
          </div>
          <div class="d-flex justify-space-between align-center">
            <span class="text-body-2">Taux de placement</span>
            <VChip
              :color="getPlacementRateColor(jobPlacementRate)"
              size="small"
            >
              {{ jobPlacementRate }}%
            </VChip>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <!-- Statistiques des paiements -->
    <VCol
      cols="12"
      md="6"
      lg="3"
    >
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon
            icon="ri-money-dollar-circle-line"
            class="me-2"
            color="warning"
          />
          Paiements
        </VCardTitle>
        <VCardText>
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-body-2">Revenus totaux</span>
            <span class="text-h6">{{ formatCurrency(totalRevenue) }}</span>
          </div>
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-body-2">Ce mois</span>
            <span class="text-h6">{{ formatCurrency(thisMonthRevenue) }}</span>
          </div>
          <div class="d-flex justify-space-between align-center">
            <span class="text-body-2">En attente</span>
            <VChip
              color="warning"
              size="small"
            >
              {{ pendingTransactions }}
            </VChip>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <!-- Statistiques des réclamations -->
    <VCol
      cols="12"
      md="6"
      lg="3"
    >
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon
            icon="ri-customer-service-line"
            class="me-2"
            color="error"
          />
          Réclamations
        </VCardTitle>
        <VCardText>
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-body-2">Nouvelles</span>
            <VChip
              color="error"
              size="small"
            >
              {{ newReclamations }}
            </VChip>
          </div>
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-body-2">En cours</span>
            <VChip
              color="warning"
              size="small"
            >
              {{ inProgressReclamations }}
            </VChip>
          </div>
          <div class="d-flex justify-space-between align-center">
            <span class="text-body-2">Résolues</span>
            <VChip
              color="success"
              size="small"
            >
              {{ closedReclamations }}
            </VChip>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'

const dashboardStore = useDashboardStore()

// Computed properties
const activeTrainingSessions = computed(() => dashboardStore.activeTrainingSessions)
const trainingApplications = computed(() => dashboardStore.trainingApplications)
const trainingCompletionRate = computed(() => dashboardStore.trainingCompletionRate)

const totalJobOffers = computed(() => dashboardStore.totalJobOffers)
const jobApplications = computed(() => dashboardStore.jobApplications)
const jobPlacementRate = computed(() => dashboardStore.jobPlacementRate)

const totalRevenue = computed(() => dashboardStore.totalRevenue)
const thisMonthRevenue = computed(() => dashboardStore.thisMonthRevenue)
const pendingTransactions = computed(() => dashboardStore.pendingTransactions)

const newReclamations = computed(() => dashboardStore.newReclamations)
const inProgressReclamations = computed(() => dashboardStore.inProgressReclamations)
const closedReclamations = computed(() => dashboardStore.closedReclamations)

// Helper functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const getCompletionRateColor = (rate: number): string => {
  if (rate >= 80) return 'success'
  if (rate >= 60) return 'warning'
  return 'error'
}

const getPlacementRateColor = (rate: number): string => {
  if (rate >= 70) return 'success'
  if (rate >= 50) return 'warning'
  return 'error'
}
</script>