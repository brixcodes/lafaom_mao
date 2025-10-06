<script setup lang="ts">
import { dashboardService, type DashboardStats } from '@/services/dashboardService'

// Données réactives
const stats = ref<DashboardStats | null>(null)
const loading = ref(true)

// Centres de formation par performance
const salesByCountries = computed(() => {
  if (!stats.value) return []
  
  const centers = stats.value.centers || {}
  const trainings = stats.value.trainings || {}
  const specialties = stats.value.specialties || {}
  const users = stats.value.users || {}
  const jobOffers = stats.value.job_offers || {}
  const blog = stats.value.blog || {}
  
  return [
    {
      abbr: 'CF1',
      amount: `${centers.total || 0}`,
      country: 'Centres de Formation',
      change: '+25.8%',
      sales: `${trainings.total_active || 0}`,
      color: 'success',
    },
    {
      abbr: 'SP',
      amount: `${specialties.total || 0}`,
      country: 'Spécialités',
      change: '+12.4%',
      sales: `${trainings.total_inactive || 0}`,
      color: 'info',
    },
    {
      abbr: 'US',
      amount: `${users.total || 0}`,
      country: 'Utilisateurs',
      change: '+8.2%',
      sales: `${users.new_this_month || 0}`,
      color: 'primary',
    },
    {
      abbr: 'JO',
      amount: `${jobOffers.total || 0}`,
      country: 'Offres d\'emploi',
      change: '+5.1%',
      sales: `${jobOffers.available || 0}`,
      color: 'warning',
    },
    {
      abbr: 'BL',
      amount: `${blog.total_posts || 0}`,
      country: 'Articles de blog',
      change: '+3.2%',
      sales: `${blog.published_posts || 0}`,
      color: 'secondary',
    },
  ]
})

const moreList = [
  { title: 'Hier', value: 'Hier' },
  { title: 'Cette semaine', value: 'Cette semaine' },
  { title: 'Ce mois', value: 'Ce mois' },
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
      <VCardTitle>Statistiques par Module</VCardTitle>

      <template #append>
        <div class="me-n3">
          <MoreBtn :menu-list="moreList" />
        </div>
      </template>
    </VCardItem>

    <VCardText>
      <VList class="card-list">
        <VListItem
          v-for="data in salesByCountries"
          :key="data.country"
        >
          <template #prepend>
            <VAvatar
              :color="data.color"
              variant="tonal"
              size="40"
            >
              {{ data.abbr }}
            </VAvatar>
          </template>

          <VListItemTitle class="mb-1 d-flex align-center">
            <h6 class="text-h6">
              {{ data.amount }}
            </h6>
            <VIcon
              size="24"
              :color="data.change.charAt(0) === '+' ? 'success' : 'error'"
              class="mx-1"
            >
              {{ data.change.charAt(0) === '+' ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line' }}
            </VIcon>
            <div
              :class="`${data.change.charAt(0) === '+' ? 'text-success' : 'text-error'}`"
              class="text-body-1"
            >
              {{ data.change.slice(1) }}
            </div>
          </VListItemTitle>

          <VListItemSubtitle class="text-body-1 me-2">
            {{ data.country }}
          </VListItemSubtitle>

          <template #append>
            <div>
              <h6 class="text-h6 mb-1">
                {{ data.sales }}
              </h6>
              <div class="text-body-2 text-disabled text-end">
                Sales
              </div>
            </div>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

  <style lang="scss" scoped>
  .card-list {
    --v-card-list-gap: 0.875rem;
  }
  </style>
