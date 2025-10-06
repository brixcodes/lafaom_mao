<script setup lang="ts">
import { dashboardService, type DashboardStats } from '@/services/dashboardService'

// Données réactives
const stats = ref<DashboardStats | null>(null)
const loading = ref(true)

// Statistiques générales
const statistics = computed(() => {
  if (!stats.value) return []

  const users = stats.value.users || {}
  const trainings = stats.value.trainings || {}
  const jobOffers = stats.value.job_offers || {}
  const blog = stats.value.blog || {}

  return [
    {
      title: 'Utilisateurs',
      stats: users.total || 0,
      icon: 'ri-group-line',
      color: 'primary',
    },
    {
      title: 'Formations',
      stats: (trainings.total_active || 0) + (trainings.total_inactive || 0),
      icon: 'ri-school-line',
      color: 'success',
    },
    {
      title: 'Offres d\'emploi',
      stats: jobOffers.total || 0,
      icon: 'ri-briefcase-line',
      color: 'warning',
    },
    {
      title: 'Articles de blog',
      stats: blog.total_posts || 0,
      icon: 'ri-file-text-line',
      color: 'info',
    },
  ]
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
  <VCard title="Statistiques Générales">
    <template #subtitle>
      <p class="text-body-1 mb-0">
        <span class="d-inline-block font-weight-medium text-high-emphasis">Croissance totale 48.5%</span> <span
          class="text-high-emphasis">😎</span> ce mois
      </p>
    </template>

    <template #append>
      <MoreBtn :menu-list="moreList" />
    </template>

    <VCardText class="pt-10">
      <VRow>
        <VCol v-for="item in statistics" :key="item.title" cols="12" sm="6" md="3">
          <div class="d-flex align-center gap-x-3">
            <VAvatar :color="item.color" rounded size="40" class="elevation-2">
              <VIcon size="24" :icon="item.icon" />
            </VAvatar>

            <div class="d-flex flex-column">
              <div class="text-body-1">
                {{ item.title }}
              </div>
              <h5 class="text-h5">
                {{ item.stats }}
              </h5>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
