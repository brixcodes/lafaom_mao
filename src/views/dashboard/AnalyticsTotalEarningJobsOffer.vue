<script setup lang="ts">
import { dashboardService, type PaymentStats } from '@/services/dashboardService'

const paymentStats = ref<PaymentStats | null>(null)
const loading = ref(true)

// Formatage montant
const formatAmount = (amount: number): string => {
  if (amount === 0) return '0€'

  const absAmount = Math.abs(amount)

  if (absAmount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)}Mdr€`
  if (absAmount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M€`
  if (absAmount >= 1_000) return `${(amount / 1_000).toFixed(1)}k€`
  return `${amount.toFixed(2)}€`
}

// Statistiques frais de soumission offres d'emploi (payés, en attente, refusés)
const earnings = computed(() => {
  if (!paymentStats.value) return []

  const jobPayments = paymentStats.value.job_payments || {}

  const received = jobPayments.RECEIVED?.submission_fees || { total_amount: 0, total_count: 0, paid_count: 0, unpaid_count: 0 }
  const refused = jobPayments.REFUSED?.submission_fees || { total_amount: 0, total_count: 0, paid_count: 0, unpaid_count: 0 }
  const approved = jobPayments.APPROVED?.submission_fees || { total_amount: 0, total_count: 0, paid_count: 0, unpaid_count: 0 }
  const total = jobPayments.TOTAL?.submission_fees || { total_amount: 0, total_count: 0, paid_count: 0, unpaid_count: 0 }

  return [
    {
      avatar: 'ri-time-line',
      title: 'Reçu',
      subtitle: `En attente: ${received.unpaid_count} | Payés: ${received.paid_count}`,
      amount: formatAmount(received.total_amount),
      progress: 'warning',
    },
    {
      avatar: 'ri-close-circle-line',
      title: 'Refusé',
      subtitle: `Refusés: ${refused.total_count}`,
      amount: formatAmount(refused.total_amount),
      progress: 'error',
    },
    {
      avatar: 'ri-checkbox-circle-line',
      title: 'Approuvé',
      subtitle: `Approuvés: ${approved.total_count}`,
      amount: formatAmount(approved.total_amount),
      progress: 'success',
    },
    {
      avatar: 'ri-money-euro-box-line',
      title: 'Total',
      subtitle: `Total: ${total.total_count} | Payés: ${total.paid_count} | Non payés: ${total.unpaid_count}`,
      amount: formatAmount(total.total_amount),
      progress: 'primary',
    },
  ]

})

// Total des frais de soumission (tous statuts confondus)
const totalEarnings = computed(() => {
  if (!paymentStats.value) return 0
  const total = paymentStats.value.job_payments?.TOTAL?.submission_fees || {}
  return total.total_amount || 0
})

const formattedTotalEarnings = computed(() => {
  return formatAmount(totalEarnings.value)
})

// Chargement des données
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
    <VCardItem>
      <VCardTitle>Offres d'emplois</VCardTitle>
    </VCardItem>

    <VCardText>
      <div class="d-flex align-center">
        <h3 class="text-h3">
          <VProgressCircular v-if="loading" size="20" indeterminate />
          <span v-else>En caisse : {{ formattedTotalEarnings }}</span>
        </h3>
      </div>
      <div class="text-body-1 mb-12">
        Statistiques des paiements pour les offres d'emplois.
      </div>


      <VList class="card-list">
        <VListItem v-for="earning in earnings" :key="earning.title">
          <template #prepend>
            <VAvatar rounded variant="tonal" :color="earning.progress">
              <VIcon :icon="earning.avatar" />
            </VAvatar>
          </template>

          <VListItemTitle class="font-weight-medium">
            {{ earning.title }}
          </VListItemTitle>
          <VListItemSubtitle class="text-body-1">
            {{ earning.subtitle }}
          </VListItemSubtitle>

          <template #append>
            <div>
              <h6 class="text-h6 mb-2">
                {{ earning.amount }}
              </h6>
              <VProgressLinear :color="earning.progress" model-value="80" rounded-bar rounded />
            </div>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1.5rem;
}
</style>
