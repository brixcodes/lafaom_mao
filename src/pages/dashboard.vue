<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { useUserStore } from '@/stores/user'
import DashboardStatsCards from '@/components/Dashboard/DashboardStatsCards.vue'
import DashboardCharts from '@/components/Dashboard/DashboardCharts.vue'
import DashboardRecentActivities from '@/components/Dashboard/DashboardRecentActivities.vue'
import DashboardAlerts from '@/components/Dashboard/DashboardAlerts.vue'
import DashboardQuickStats from '@/components/Dashboard/DashboardQuickStats.vue'
import DashboardPerformanceChart from '@/components/Dashboard/DashboardPerformanceChart.vue'
import DashboardRevenueCard from '@/components/Dashboard/DashboardRevenueCard.vue'
import DashboardActivityTimeline from '@/components/Dashboard/DashboardActivityTimeline.vue'
import DashboardMeetingSchedule from '@/components/Dashboard/DashboardMeetingSchedule.vue'
import DashboardGeographicStats from '@/components/Dashboard/DashboardGeographicStats.vue'
import DashboardPerformanceSummary from '@/components/Dashboard/DashboardPerformanceSummary.vue'
import DashboardWelcomeWidget from '@/components/Dashboard/DashboardWelcomeWidget.vue'
import DashboardAdvancedMetrics from '@/components/Dashboard/DashboardAdvancedMetrics.vue'
import DashboardUpcomingEvents from '@/components/Dashboard/DashboardUpcomingEvents.vue'
import DashboardNotifications from '@/components/Dashboard/DashboardNotifications.vue'
import DashboardPerformanceWidget from '@/components/Dashboard/DashboardPerformanceWidget.vue'
import DashboardSummaryCard from '@/components/Dashboard/DashboardSummaryCard.vue'
import DashboardFinalSummary from '@/components/Dashboard/DashboardFinalSummary.vue'

const dashboardStore = useDashboardStore()
const userStore = useUserStore()
const loading = ref(false)
const searchQuery = ref('')
const selectedPeriod = ref('month')

const periodOptions = [
  { title: 'Cette semaine', value: 'week' },
  { title: 'Ce mois', value: 'month' },
  { title: 'Cette année', value: 'year' }
]

// Headers pour le tableau des utilisateurs
const userHeaders = [
  { title: 'Avatar', key: 'avatar', sortable: false },
  { title: 'Nom', key: 'name', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Rôle', key: 'role', sortable: true },
  { title: 'Statut', key: 'status', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Utilisateurs récents (données de démonstration)
const recentUsers = ref([
  {
    id: 1,
    name: 'Marie Dupont',
    email: 'marie.dupont@example.com',
    role: 'Administrateur',
    status: 'active',
    avatar: '/images/avatars/avatar-1.png'
  },
  {
    id: 2,
    name: 'Jean Martin',
    email: 'jean.martin@example.com',
    role: 'Formateur',
    status: 'active',
    avatar: '/images/avatars/avatar-2.png'
  },
  {
    id: 3,
    name: 'Sophie Bernard',
    email: 'sophie.bernard@example.com',
    role: 'Étudiant',
    status: 'pending',
    avatar: '/images/avatars/avatar-3.png'
  },
  {
    id: 4,
    name: 'Pierre Durand',
    email: 'pierre.durand@example.com',
    role: 'Recruteur',
    status: 'active',
    avatar: '/images/avatars/avatar-4.png'
  },
  {
    id: 5,
    name: 'Anna Leroy',
    email: 'anna.leroy@example.com',
    role: 'Étudiant',
    status: 'active',
    avatar: '/images/avatars/avatar-5.png'
  }
])

// Top formations (données de démonstration)
const topCourses = ref([
  {
    id: 1,
    title: 'Développement Web Frontend',
    instructor: 'Jean Martin',
    views: '1.2k',
    color: 'primary',
    icon: 'tabler-code'
  },
  {
    id: 2,
    title: 'Marketing Digital',
    instructor: 'Sophie Bernard',
    views: '834',
    color: 'success',
    icon: 'tabler-chart-line'
  },
  {
    id: 3,
    title: 'Gestion de Projet',
    instructor: 'Pierre Durand',
    views: '3.7k',
    color: 'warning',
    icon: 'tabler-briefcase'
  },
  {
    id: 4,
    title: 'Design UI/UX',
    instructor: 'Anna Leroy',
    views: '2.5k',
    color: 'info',
    icon: 'tabler-palette'
  },
  {
    id: 5,
    title: 'Data Science',
    instructor: 'Marie Dupont',
    views: '948',
    color: 'secondary',
    icon: 'tabler-chart-bar'
  }
])

// Transactions (données de démonstration)
const deposits = ref([
  {
    id: 1,
    title: 'Compte Gumroad',
    description: 'Vente UI Kit',
    amount: 4650,
    color: 'success',
    icon: 'tabler-shopping-cart'
  },
  {
    id: 2,
    title: 'Mastercard',
    description: 'Dépôt portefeuille',
    amount: 92705,
  color: 'primary',
    icon: 'tabler-credit-card'
  },
  {
    id: 3,
    title: 'Compte Stripe',
    description: 'Application iOS',
    amount: 957,
    color: 'info',
    icon: 'tabler-device-mobile'
  }
])

const withdrawals = ref([
  {
    id: 1,
    title: 'Google Adsense',
    description: 'Dépôt PayPal',
    amount: 145,
    color: 'warning',
    icon: 'tabler-brand-google'
  },
  {
    id: 2,
    title: 'GitHub Enterprise',
    description: 'Sécurité & conformité',
    amount: 1870,
    color: 'secondary',
    icon: 'tabler-brand-github'
  },
  {
    id: 3,
    title: 'DigitalOcean',
    description: 'Hébergement Cloud',
    amount: 540,
    color: 'info',
    icon: 'tabler-cloud'
  }
])

// Progression des formations (données de démonstration)
const courseProgress = ref([
  {
    id: 1,
    title: 'Développement Web Frontend',
    instructor: 'Jean Martin',
    progress: 76,
    completed: 19,
    total: 25,
    color: 'primary',
    icon: 'tabler-code'
  },
  {
    id: 2,
    title: 'Marketing Digital',
    instructor: 'Sophie Bernard',
    progress: 92,
    completed: 40,
    total: 52,
  color: 'success',
    icon: 'tabler-chart-line'
  },
  {
    id: 3,
    title: 'Gestion de Projet',
    instructor: 'Pierre Durand',
    progress: 87,
    completed: 87,
    total: 100,
    color: 'warning',
    icon: 'tabler-briefcase'
  },
  {
    id: 4,
    title: 'Design UI/UX',
    instructor: 'Anna Leroy',
    progress: 66,
    completed: 33,
    total: 50,
    color: 'info',
    icon: 'tabler-palette'
  },
  {
    id: 5,
    title: 'Data Science',
    instructor: 'Marie Dupont',
    progress: 100,
    completed: 100,
    total: 100,
    color: 'secondary',
    icon: 'tabler-chart-bar'
  }
])

// Computed properties pour les statistiques
const dashboardStats = computed(() => dashboardStore.stats)

// Charger les données du dashboard au montage
onMounted(async () => {
  loading.value = true
  try {
    await dashboardStore.loadDashboardData()
  } catch (error) {
    console.error('Erreur lors du chargement du dashboard:', error)
  } finally {
    loading.value = false
  }
})

// Rafraîchir les données
const refreshData = async () => {
  loading.value = true
  try {
    await dashboardStore.refreshData()
  } catch (error) {
    console.error('Erreur lors du rafraîchissement:', error)
  } finally {
    loading.value = false
  }
}

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

// Voir un utilisateur
const viewUser = (user: any) => {
  console.log('Voir utilisateur:', user)
}
</script>

<template>
  <div class="dashboard-container">
    <!-- Widget de bienvenue -->
    <DashboardWelcomeWidget class="mb-6" />

    <!-- Carte de résumé -->
    <DashboardSummaryCard class="mb-6" />

    <!-- Header avec actions -->
    <div class="d-flex justify-space-between align-center mb-6">
  <div>
        <h1 class="text-h4 font-weight-bold mb-2">
          Tableau de bord LAFOAM
    </h1>
        <p class="text-body-1 text-medium-emphasis">
          Vue d'ensemble complète de votre plateforme
        </p>
      </div>
      <div class="d-flex gap-3">
        <VBtn color="primary" variant="outlined" @click="refreshData" :loading="loading">
          <VIcon start icon="tabler-refresh" />
          Actualiser
        </VBtn>
        <VBtn color="primary">
          <VIcon start icon="tabler-download" />
          Exporter
        </VBtn>
      </div>
    </div>

    <!-- KPIs Principaux -->
    <VRow class="mb-6">
      <VCol cols="12" sm="6" lg="3">
        <VCard class="h-100">
          <VCardText class="d-flex align-center">
            <VAvatar color="primary" variant="tonal" class="me-4">
              <VIcon icon="tabler-users" />
            </VAvatar>
            <div>
              <div class="text-h4 font-weight-bold">{{ dashboardStats?.users?.total || 0 }}</div>
              <div class="text-caption">Utilisateurs actifs</div>
              <div class="text-success text-caption">
                <VIcon icon="tabler-trending-up" size="16" class="me-1" />
                +{{ dashboardStats?.users?.growth_rate || 0 }}% ce mois
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" lg="3">
        <VCard class="h-100">
          <VCardText class="d-flex align-center">
            <VAvatar color="success" variant="tonal" class="me-4">
              <VIcon icon="tabler-school" />
            </VAvatar>
            <div>
              <div class="text-h4 font-weight-bold">{{ dashboardStats?.trainings?.total || 0 }}</div>
              <div class="text-caption">Formations actives</div>
              <div class="text-success text-caption">
                <VIcon icon="tabler-trending-up" size="16" class="me-1" />
                {{ dashboardStats?.trainings?.completion_rate || 0 }}% réussite
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" lg="3">
        <VCard class="h-100">
          <VCardText class="d-flex align-center">
            <VAvatar color="warning" variant="tonal" class="me-4">
              <VIcon icon="tabler-briefcase" />
            </VAvatar>
            <div>
              <div class="text-h4 font-weight-bold">{{ dashboardStats?.jobs?.total_offers || 0 }}</div>
              <div class="text-caption">Offres d'emploi</div>
              <div class="text-success text-caption">
                <VIcon icon="tabler-trending-up" size="16" class="me-1" />
                {{ dashboardStats?.jobs?.placement_rate || 0 }}% placement
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" sm="6" lg="3">
        <VCard class="h-100">
          <VCardText class="d-flex align-center">
            <VAvatar color="info" variant="tonal" class="me-4">
              <VIcon icon="tabler-currency-euro" />
            </VAvatar>
            <div>
              <div class="text-h4 font-weight-bold">{{ formatCurrency(dashboardStats?.payments?.total_revenue || 0) }}
              </div>
              <div class="text-caption">Revenus totaux</div>
              <div class="text-success text-caption">
                <VIcon icon="tabler-trending-up" size="16" class="me-1" />
                +{{ dashboardStats?.payments?.growth_rate || 0 }}% ce mois
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Graphiques et métriques détaillées -->
    <VRow class="mb-6">
      <VCol cols="12" lg="12">
        <VCard>
          <VCardText>
            <DashboardCharts />
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" lg="12">
        <DashboardAdvancedMetrics />
      </VCol>
    </VRow>

    <!-- Performance et revenus -->
    <VRow class="mb-6">
      <VCol cols="12" lg="6">
        <DashboardPerformanceChart />
      </VCol>
      <VCol cols="12" lg="6">
        <DashboardRevenueCard />
      </VCol>
    </VRow>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 24px;
}

.text-no-wrap {
  white-space: nowrap;
}

.course-item {
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

.course-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: rgba(var(--v-theme-primary), 0.2);
}

.progress-item {
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

.progress-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: rgba(var(--v-theme-primary), 0.2);
}
</style>