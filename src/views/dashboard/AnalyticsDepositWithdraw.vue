<script setup lang="ts">
import { dashboardService, type PaymentStats } from '@/services/dashboardService'

// Données réactives
const paymentStats = ref<PaymentStats | null>(null)
const loading = ref(true)

// Fonction de formatage des montants
const formatAmount = (amount: number): string => {
  if (amount === 0) return '0€'

  const absAmount = Math.abs(amount)

  if (absAmount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)}Mdr€`
  } else if (absAmount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M€`
  } else if (absAmount >= 1_000) {
    return `${(amount / 1_000).toFixed(1)}k€`
  } else {
    return `${amount.toFixed(2)}€`
  }
}

// Paiements de formations (dépôts)
const deposits = computed(() => {
  if (!paymentStats.value) return []

  const trainingPayments = paymentStats.value.training_payments || {}
  return [
    {
      title: 'Frais d\'inscription',
      subtitle: 'Formations',
      amount: `+${formatAmount(trainingPayments.total_registration_fees || 0)}`,
      logo: 'ri-school-line',
    },
    {
      title: 'Frais de formation',
      subtitle: 'Formations',
      amount: `+${formatAmount(trainingPayments.total_training_fees || 0)}`,
      logo: 'ri-graduation-cap-line',
    },
    {
      title: 'Échéances',
      subtitle: 'Paiements échelonnés',
      amount: `+${formatAmount(trainingPayments.installments?.total_amount || 0)}`,
      logo: 'ri-calendar-line',
    },
    {
      title: 'Candidatures payées',
      subtitle: 'Formations',
      amount: `+${trainingPayments.applications_with_payment || 0}`,
      logo: 'ri-user-check-line',
    },
  ]
})

// Paiements d'offres d'emploi (retraits)
const withdraws = computed(() => {
  if (!paymentStats.value) return []

  const jobPayments = paymentStats.value.job_payments || {}
  return [
    {
      title: 'Frais de soumission',
      subtitle: 'Offres d\'emploi',
      amount: `-${formatAmount(jobPayments.total_submission_fees || 0)}`,
      logo: 'ri-briefcase-line',
    },
    {
      title: 'Candidatures payées',
      subtitle: 'Offres d\'emploi',
      amount: `-${jobPayments.applications_with_payment || 0}`,
      logo: 'ri-file-list-line',
    },
    {
      title: 'Candidatures non payées',
      subtitle: 'En attente',
      amount: `-${jobPayments.applications_without_payment || 0}`,
      logo: 'ri-time-line',
    },
  ]
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
</script>

<template>
  <VCard>
    <VRow no-gutters>
      <VCol cols="12" md="6">
        <VCardItem>
          <VCardTitle>Paiements Formations</VCardTitle>

          <template #append>
            <h6 class="text-h6">
              <a href="javascript:void(0)" class="text-primary">Voir tout</a>
            </h6>
          </template>
        </VCardItem>

        <VCardText>
          <VList class="card-list">
            <VListItem v-for="deposit in deposits" :key="deposit.logo">
              <template #prepend>
                <div class="me-4">
                  <VIcon :icon="deposit.logo" size="30" color="primary" />
                </div>
              </template>

              <VListItemTitle class="font-weight-medium mb-1">
                {{ deposit.title }}
              </VListItemTitle>
              <VListItemSubtitle class="text-body-1">
                {{ deposit.subtitle }}
              </VListItemSubtitle>

              <template #append>
                <VListItemAction class="text-success font-weight-medium">
                  {{ deposit.amount }}
                </VListItemAction>
              </template>
            </VListItem>
          </VList>
        </VCardText>
      </VCol>

      <VDivider :vertical="$vuetify.display.mdAndUp" />

      <VCol cols="12" md="6">
        <VCardItem>
          <VCardTitle>Paiements Offres d'Emploi</VCardTitle>

          <template #append>
            <h6 class="text-h6">
              <a href="javascript:void(0)" class="text-primary">Voir tout</a>
            </h6>
          </template>
        </VCardItem>

        <VCardText>
          <VList class="card-list">
            <VListItem v-for="withdraw in withdraws" :key="withdraw.logo">
              <template #prepend>
                <div class="me-4">
                  <VIcon :icon="withdraw.logo" size="30" color="error" />
                </div>
              </template>

              <VListItemTitle class="font-weight-medium mb-1">
                {{ withdraw.title }}
              </VListItemTitle>
              <VListItemSubtitle class="text-body-1">
                {{ withdraw.subtitle }}
              </VListItemSubtitle>

              <template #append>
                <VListItemAction>
                  <span class="text-error font-weight-medium">
                    {{ withdraw.amount }}
                  </span>
                </VListItemAction>
              </template>
            </VListItem>
          </VList>
        </VCardText>
      </VCol>
    </VRow>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1.25rem;
}
</style>
