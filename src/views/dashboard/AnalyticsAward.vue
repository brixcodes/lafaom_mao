<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { dashboardService, type PaymentStats } from '@/services/dashboardService'
import avatar1 from '@images/avatars/avatar-1.png'
import trophy from '@images/misc/trophy.png'

const authStore = useAuthStore()
const paymentStats = ref<PaymentStats | null>(null)
const loading = ref(true)

const welcomeMessage = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return "Bonjour"
  if (hour < 18) return "Bon après-midi"
  return "Bonsoir"
})

const userName = computed(() => {
  return authStore.user?.first_name && authStore.user?.last_name 
    ? `${authStore.user.first_name} ${authStore.user.last_name}`
    : authStore.user?.email || 'Utilisateur'
})

const picture = computed(() => {
  // Vérifier si l'utilisateur a une photo
  if (authStore.user?.picture) {
    return authStore.user.picture
  }
  // Utiliser l'avatar par défaut si aucune photo n'est disponible
  return avatar1
})


const userAvatar = computed(() => {
  // Vérifier si l'utilisateur a une photo de profil
  if (authStore.user?.avatar) {
    return authStore.user.avatar
  }
  // Vérifier si l'utilisateur a une photo
  if (authStore.user?.photo) {
    return authStore.user.photo
  }
  // Vérifier si l'utilisateur a une image
  if (authStore.user?.image) {
    return authStore.user.image
  }
  // Utiliser l'avatar par défaut si aucune photo n'est disponible
  return avatar1
})

const onImageError = () => {
  // Si l'image ne se charge pas, on peut gérer l'erreur ici
  console.log('Erreur de chargement de l\'image utilisateur')
}

const achievementMessage = computed(() => {
  const hour = new Date().getHours()
  const userRole = authStore.user?.roles?.[0]?.name || 'user'
  
  if (userRole === 'admin') {
    if (hour < 12) return "Excellente gestion de l'académie !"
    if (hour < 18) return "Continuez votre excellent leadership !"
    return "Bonne fin de journée d'administration !"
  } else if (userRole === 'teacher') {
    if (hour < 12) return "Excellente journée d'enseignement !"
    if (hour < 18) return "Continuez à inspirer vos étudiants !"
    return "Bonne fin de journée pédagogique !"
  } else if (userRole === 'student') {
    if (hour < 12) return "Excellente journée d'apprentissage !"
    if (hour < 18) return "Continuez votre parcours de formation !"
    return "Bonne fin de journée d'études !"
  } else {
    if (hour < 12) return "Excellente journée à LAFAOM !"
    if (hour < 18) return "Continuez votre excellent travail !"
    return "Bonne fin de journée !"
  }
})

const getPerformanceMetric = () => {
  if (!paymentStats.value) return "Chargement..."
  
  const userRole = authStore.user?.roles?.[0]?.name || 'user'
  
  if (userRole === 'admin') {
    // Calculer le total en caisse (Offres d'emploi + Inscriptions + Formations)
    const jobPayments = paymentStats.value.job_payments?.APPROVED?.submission_fees?.total_amount || 0
    const registrationFees = paymentStats.value.training_payments?.APPROVED?.registration_fees?.total_amount || 0
    const trainingFees = paymentStats.value.training_payments?.APPROVED?.training_fees?.total_amount || 0
    const totalInCash = jobPayments + registrationFees + trainingFees
    return `${totalInCash}€ En caisse`
  } else if (userRole === 'teacher') {
    // Utiliser les frais de formation payés
    const trainingFees = paymentStats.value.training_payments?.APPROVED?.training_fees?.total_amount || 0
    return `${trainingFees}€ Formations`
  } else if (userRole === 'student') {
    // Utiliser les candidatures avec paiement
    const applications = paymentStats.value.training_payments?.APPROVED?.training_fees?.paid_count || 0
    return `${applications} Candidatures`
  } else {
    // Calculer le total en caisse pour les autres utilisateurs
    const jobPayments = paymentStats.value.job_payments?.APPROVED?.submission_fees?.total_amount || 0
    const registrationFees = paymentStats.value.training_payments?.APPROVED?.registration_fees?.total_amount || 0
    const trainingFees = paymentStats.value.training_payments?.APPROVED?.training_fees?.total_amount || 0
    const totalInCash = jobPayments + registrationFees + trainingFees
    return `${totalInCash}€ En caisse`
  }
}

const getProgressMessage = () => {
  if (!paymentStats.value) return "Chargement..."
  
  const userRole = authStore.user?.roles?.[0]?.name || 'user'
  
  if (userRole === 'admin') {
    // Utiliser les montants acceptés des statistiques globales
    const totalAmount = paymentStats.value.global_stats?.accepted?.amount || 0
    return `${totalAmount.toFixed(0)}€ collectés`
  } else if (userRole === 'teacher') {
    // Utiliser les frais de formation payés
    const trainingFees = paymentStats.value.training_payments?.APPROVED?.training_fees?.total_amount || 0
    return `${trainingFees}€ de formations`
  } else if (userRole === 'student') {
    // Utiliser les frais d'inscription payés
    const registrationFees = paymentStats.value.training_payments?.APPROVED?.registration_fees?.total_amount || 0
    return `${registrationFees}€ d'inscription`
  } else {
    // Utiliser les statistiques temporelles
    const thisMonth = paymentStats.value.temporal_stats?.general_payments?.this_month?.amount || 0
    return `${thisMonth.toFixed(0)}€ ce mois`
  }
}

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
  console.log("photo  : ", picture.value)
  fetchPaymentStats()
})
</script>

<template>
  <VCard class="position-relative">
    <VCardText>
      <div class="mb-2">
        <h5 class="text-h5">
          {{ welcomeMessage }} {{ userName }}! <span class="text-high-emphasis">🎉</span>
        </h5>
        <div class="text-body-1">
          {{ achievementMessage }}
        </div>
      </div>
      <br>
      <h4 class="text-h4 text-primary mt-2">
        <VProgressCircular v-if="loading" size="20" indeterminate />
        <span v-else>{{ getPerformanceMetric() }}</span>
      </h4>
      <div class="text-body-1 mb-2">
        <VProgressCircular v-if="loading" size="16" indeterminate />
        <span v-else>{{ getProgressMessage() }} <span class="text-high-emphasis">🚀</span></span>
      </div>
    </VCardText>

    <!-- User Avatar -->
    <VAvatar :image="picture" size="80" class="trophy">
      <VIcon size="40">ri-user-line</VIcon>
    </VAvatar>
    <!-- <VAvatar 
      :src="userAvatar" 
      :alt="userName"
      class="trophy"
      size="80"
      @error="onImageError"
    >
      <VIcon size="40">ri-user-line</VIcon>
    </VAvatar> -->
  </VCard>
</template>

<style lang="scss">
.v-card .trophy {
  position: absolute;
  width: 5rem;
  height: 5rem;
  bottom: 1.25rem;
  right: 1.25rem;
  border: 3px solid rgb(var(--v-theme-primary));
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
