<script setup lang="ts">
import { usersService } from '@/services/api/users'
import { trainingService } from '@/services/api/training'
import { jobOffersService } from '@/services/api/job-offers'
import { blogService } from '@/services/api/blog'

// Données réactives
const usersCount = ref(0)
const trainingsCount = ref(0)
const jobOffersCount = ref(0)
const blogPostsCount = ref(0)
const loading = ref(true)

// Statistiques générales
const statistics = computed(() => {
  return [
    {
      title: 'Utilisateurs',
      stats: usersCount.value,
      icon: 'ri-group-line',
      color: 'primary',
    },
    {
      title: 'Formations',
      stats: trainingsCount.value,
      icon: 'ri-school-line',
      color: 'success',
    },
    {
      title: 'Offres d\'emploi',
      stats: jobOffersCount.value,
      icon: 'ri-briefcase-line',
      color: 'warning',
    },
    {
      title: 'Articles de blog',
      stats: blogPostsCount.value,
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

// Charger les données depuis chaque service
const fetchStats = async () => {
  try {
    loading.value = true
    
    // Charger les données en parallèle depuis chaque service
    const [usersData, trainingsData, jobOffersData, blogData] = await Promise.all([
      usersService.getUsers({ page: 1, page_size: 1 }), // Récupérer juste le total
      trainingService.getTrainings({ page: 1, page_size: 1 }), // Récupérer juste le total
      jobOffersService.getJobOffers({ page: 1, page_size: 1 }), // Récupérer juste le total
      blogService.getPosts({ page: 1, page_size: 1 }) // Récupérer juste le total
    ])
    
    // Extraire les totaux
    usersCount.value = usersData.total_number || 0
    trainingsCount.value = trainingsData.total_number || 0
    jobOffersCount.value = jobOffersData.total_number || 0
    blogPostsCount.value = blogData.total_number || 0
    
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
    // En cas d'erreur, afficher 0 pour chaque statistique
    usersCount.value = 0
    trainingsCount.value = 0
    jobOffersCount.value = 0
    blogPostsCount.value = 0
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
