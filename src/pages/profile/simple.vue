<template>
  <VContainer fluid class="profile-page">
    <!-- Hero Section avec gradient -->
    <div class="hero-section">
      <div class="gradient-bg"></div>
      <VRow class="profile-header">
        <VCol cols="12">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <VAvatar size="120" class="profile-avatar elevation-4">
                <img 
                  v-if="user?.picture" 
                  :src="user.picture" 
                  :alt="`${user.first_name} ${user.last_name}`"
                />
                <VIcon v-else icon="ri-user-line" size="60" />
              </VAvatar>
              
              <div class="ml-6 text-white">
                <h1 class="text-h3 font-weight-bold mb-2">
                  {{ user?.first_name }} {{ user?.last_name }}
                </h1>
                <div class="d-flex align-center mb-2">
                  <VIcon icon="ri-briefcase-line" class="mr-2" />
                  <span class="text-h6">{{ user?.professions_status?.job_position || 'Poste non spécifié' }}</span>
                </div>
                <div class="d-flex align-center mb-2">
                  <VIcon icon="ri-mail-line" class="mr-2" />
                  <span>{{ user?.email }}</span>
                </div>
                <div class="d-flex align-center">
                  <VIcon icon="ri-calendar-line" class="mr-2" />
                  <span>{{ formatDate(user?.created_at) }}</span>
                </div>
              </div>
            </div>
            
            <div class="text-right">
              <VBtn
                color="white"
                variant="flat"
                size="large"
                prepend-icon="ri-edit-line"
                class="mb-2"
                @click="editMode = !editMode"
              >
                {{ editMode ? 'Annuler' : 'Modifier' }}
              </VBtn>
              <br>
              <VChip 
                :color="getStatusColor(user?.status)"
                :text="getStatusLabel(user?.status)"
                variant="flat"
                size="large"
              />
            </div>
          </div>
        </VCol>
      </VRow>
    </div>

    <!-- Navigation Tabs -->
    <VCard class="navigation-tabs elevation-2">
      <VTabs v-model="activeTab" class="px-4">
        <VTab value="profile">
          <VIcon icon="ri-user-line" class="mr-2" />
          Profil
        </VTab>
        <VTab value="settings">
          <VIcon icon="ri-settings-line" class="mr-2" />
          Paramètres
        </VTab>
      </VTabs>
    </VCard>

    <!-- Contenu des onglets -->
    <VTabsWindow v-model="activeTab" class="mt-6">
      
      <!-- Onglet Profil -->
      <VTabsWindowItem value="profile">
        <VRow>
          <!-- Colonne gauche -->
          <VCol cols="12" lg="8">
            <!-- Informations professionnelles -->
            <VCard class="mb-6">
              <VCardTitle>
                <VIcon icon="ri-briefcase-line" class="mr-2" />
                Informations professionnelles
              </VCardTitle>
              <VCardText>
                <VRow v-if="!editMode">
                  <VCol cols="12" md="6">
                    <div class="mb-4">
                      <div class="text-body-2 text-medium-emphasis mb-1">Poste actuel</div>
                      <div class="text-body-1 font-weight-medium">
                        {{ user?.professions_status?.job_position || 'Non défini' }}
                      </div>
                    </div>
                  </VCol>
                  <VCol cols="12" md="6">
                    <div class="mb-4">
                      <div class="text-body-2 text-medium-emphasis mb-1">Employeur</div>
                      <div class="text-body-1 font-weight-medium">
                        {{ user?.professions_status?.employer || 'Non défini' }}
                      </div>
                    </div>
                  </VCol>
                  <VCol cols="12" md="6">
                    <div class="mb-4">
                      <div class="text-body-2 text-medium-emphasis mb-1">Expérience</div>
                      <div class="text-body-1 font-weight-medium">
                        {{ formatExperience(user?.professions_status?.professional_experience_in_months) }}
                      </div>
                    </div>
                  </VCol>
                  <VCol cols="12" md="6">
                    <div class="mb-4">
                      <div class="text-body-2 text-medium-emphasis mb-1">Catégorie professionnelle</div>
                      <div class="text-body-1 font-weight-medium">
                        {{ user?.professions_status?.socio_professional_category || 'Non définie' }}
                      </div>
                    </div>
                  </VCol>
                </VRow>

                <!-- Mode édition -->
                <VForm v-else @submit.prevent="updateProfessionalInfo">
                  <VRow>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="editableProfile.job_position"
                        label="Poste actuel"
                        variant="outlined"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="editableProfile.employer"
                        label="Employeur"
                        variant="outlined"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="editableProfile.professional_experience_in_months"
                        label="Expérience (en mois)"
                        type="number"
                        variant="outlined"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="editableProfile.socio_professional_category"
                        label="Catégorie professionnelle"
                        variant="outlined"
                      />
                    </VCol>
                    <VCol cols="12">
                      <VBtn type="submit" color="primary" class="mr-2" :loading="loading">
                        Sauvegarder
                      </VBtn>
                      <VBtn @click="cancelEdit" variant="text">
                        Annuler
                      </VBtn>
                    </VCol>
                  </VRow>
                </VForm>
              </VCardText>
            </VCard>

            <!-- Activité récente -->
            <VCard>
              <VCardTitle>
                <VIcon icon="ri-history-line" class="mr-2" />
                Activité récente
              </VCardTitle>
              <VCardText>
                <VList>
                  <VListItem
                    v-for="activity in recentActivities"
                    :key="activity.id"
                    :prepend-icon="activity.icon"
                  >
                    <VListItemTitle>{{ activity.title }}</VListItemTitle>
                    <VListItemSubtitle>{{ activity.description }}</VListItemSubtitle>
                    <template #append>
                      <VChip :color="activity.color" size="small">
                        {{ formatTimeAgo(activity.date) }}
                      </VChip>
                    </template>
                  </VListItem>
                </VList>
              </VCardText>
            </VCard>
          </VCol>

          <!-- Colonne droite -->
          <VCol cols="12" lg="4">
            <!-- Informations personnelles -->
            <VCard class="mb-6">
              <VCardTitle>
                <VIcon icon="ri-user-settings-line" class="mr-2" />
                Informations personnelles
              </VCardTitle>
              <VCardText>
                <div class="info-list">
                  <div class="info-item">
                    <VIcon icon="ri-mail-line" class="mr-3" color="primary" />
                    <div>
                      <div class="text-body-2 text-medium-emphasis">Email</div>
                      <div class="font-weight-medium">{{ user?.email || 'Non défini' }}</div>
                    </div>
                  </div>
                  
                  <div class="info-item">
                    <VIcon icon="ri-phone-line" class="mr-3" color="primary" />
                    <div>
                      <div class="text-body-2 text-medium-emphasis">Téléphone</div>
                      <div class="font-weight-medium">{{ user?.mobile_number || 'Non défini' }}</div>
                    </div>
                  </div>
                  
                  <div class="info-item">
                    <VIcon icon="ri-calendar-line" class="mr-3" color="primary" />
                    <div>
                      <div class="text-body-2 text-medium-emphasis">Date de naissance</div>
                      <div class="font-weight-medium">{{ formatBirthDate(user?.birth_date) }}</div>
                    </div>
                  </div>
                  
                  <div class="info-item">
                    <VIcon icon="ri-user-star-line" class="mr-3" color="primary" />
                    <div>
                      <div class="text-body-2 text-medium-emphasis">Type d'utilisateur</div>
                      <div class="font-weight-medium">{{ user?.user_type || 'Non défini' }}</div>
                    </div>
                  </div>
                </div>
              </VCardText>
            </VCard>

            <!-- Formation -->
            <VCard class="mb-6">
              <VCardTitle>
                <VIcon icon="ri-graduation-cap-line" class="mr-2" />
                Formation
              </VCardTitle>
              <VCardText>
                <div v-if="user?.school_curriculum">
                  <div class="mb-3">
                    <div class="text-body-2 text-medium-emphasis">Qualification</div>
                    <div class="font-weight-medium">
                      {{ user.school_curriculum.qualification || 'Non définie' }}
                    </div>
                  </div>
                  <div class="mb-3">
                    <div class="text-body-2 text-medium-emphasis">Dernier diplôme</div>
                    <div class="font-weight-medium">
                      {{ user.school_curriculum.last_degree_obtained || 'Non défini' }}
                    </div>
                  </div>
                  <div>
                    <div class="text-body-2 text-medium-emphasis">Date d'obtention</div>
                    <div class="font-weight-medium">
                      {{ formatDate(user.school_curriculum.date_of_last_degree) }}
                    </div>
                  </div>
                </div>
                <VAlert v-else type="info" variant="tonal">
                  Aucune information de formation disponible
                </VAlert>
              </VCardText>
            </VCard>

            <!-- Rôles -->
            <VCard v-if="user?.roles">
              <VCardTitle>
                <VIcon icon="ri-shield-user-line" class="mr-2" />
                Rôles
              </VCardTitle>
              <VCardText>
                <VChipGroup>
                  <VChip
                    v-for="role in user.roles"
                    :key="role.id"
                    color="primary"
                    variant="tonal"
                    class="ma-1"
                  >
                    {{ role.name }}
                  </VChip>
                </VChipGroup>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VTabsWindowItem>

      <!-- Onglet Paramètres -->
      <VTabsWindowItem value="settings">
        <VRow>
          <VCol cols="12" lg="8">
            <VCard>
              <VCardTitle>
                <VIcon icon="ri-settings-line" class="mr-2" />
                Paramètres du compte
              </VCardTitle>
              <VCardText>
                <VAlert type="info" variant="tonal" class="mb-4">
                  Les paramètres avancés du compte seront bientôt disponibles.
                </VAlert>
                <div class="d-flex gap-4">
                  <VBtn color="primary" variant="outlined">
                    Changer le mot de passe
                  </VBtn>
                  <VBtn color="secondary" variant="outlined">
                    Paramètres de confidentialité
                  </VBtn>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VTabsWindowItem>
    </VTabsWindow>

    <!-- Loading overlay -->
    <VOverlay v-if="loading" class="align-center justify-center">
      <VProgressCircular size="64" indeterminate />
    </VOverlay>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { userService } from '@/services/api/user'

// Store
const authStore = useAuthStore()

// State
const user = ref<any>(null)
const activeTab = ref('profile')
const editMode = ref(false)
const loading = ref(false)

// Form data for editing
const editableProfile = ref({
  job_position: '',
  employer: '',
  professional_experience_in_months: 0,
  socio_professional_category: ''
})

// Recent activities mock data
const recentActivities = ref([
  {
    id: 1,
    title: 'Profil mis à jour',
    description: 'Informations professionnelles modifiées',
    date: new Date().toISOString(),
    icon: 'ri-user-settings-line',
    color: 'primary'
  },
  {
    id: 2,
    title: 'Connexion',
    description: 'Dernière connexion à l\'application',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    icon: 'ri-login-box-line',
    color: 'success'
  },
  {
    id: 3,
    title: 'Compte créé',
    description: 'Création du compte utilisateur',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    icon: 'ri-user-add-line',
    color: 'info'
  }
])

// Methods
const fetchUserProfile = async () => {
  try {
    loading.value = true
    
    // Essayer d'abord d'obtenir le profil complet
    try {
      const profileData = await userService.getCurrentUserProfile()
      user.value = profileData.data || profileData
    } catch (fullProfileError) {
      console.log('Profil complet non disponible, utilisation du profil de base')
      
      // Fallback sur l'utilisateur actuel du store ou API de base
      const currentUser = authStore.user
      if (currentUser?.id) {
        const basicUser = await userService.getUserById(currentUser.id)
        user.value = basicUser.data || basicUser
      } else {
        // Si pas d'utilisateur dans le store, utiliser les données de base
        user.value = currentUser
      }
    }
    
    // Populate editable fields
    if (user.value?.professions_status) {
      editableProfile.value = {
        job_position: user.value.professions_status.job_position || '',
        employer: user.value.professions_status.employer || '',
        professional_experience_in_months: user.value.professions_status.professional_experience_in_months || 0,
        socio_professional_category: user.value.professions_status.socio_professional_category || ''
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement du profil:', error)
  } finally {
    loading.value = false
  }
}

const updateProfessionalInfo = async () => {
  try {
    loading.value = true
    // API call to update professional information
    // await userService.updateProfessionalInfo(user.value.id, editableProfile.value)
    console.log('Mise à jour des informations professionnelles:', editableProfile.value)
    editMode.value = false
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
  } finally {
    loading.value = false
  }
}

const cancelEdit = () => {
  editMode.value = false
  // Reset form
  if (user.value?.professions_status) {
    editableProfile.value = {
      job_position: user.value.professions_status.job_position || '',
      employer: user.value.professions_status.employer || '',
      professional_experience_in_months: user.value.professions_status.professional_experience_in_months || 0,
      socio_professional_category: user.value.professions_status.socio_professional_category || ''
    }
  }
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'active': 'success',
    'inactive': 'warning',
    'blocked': 'error',
    'deleted': 'error'
  }
  return colors[status] || 'default'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'active': 'Actif',
    'inactive': 'Inactif',
    'blocked': 'Bloqué',
    'deleted': 'Supprimé'
  }
  return labels[status] || status
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'Non défini'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatBirthDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'Non définie'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTimeAgo = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  
  if (diffHours < 1) return 'À l\'instant'
  if (diffHours < 24) return `Il y a ${diffHours}h`
  const diffDays = Math.floor(diffHours / 24)
  return `Il y a ${diffDays}j`
}

const formatExperience = (months: number | null | undefined) => {
  if (!months) return 'Non définie'
  if (months < 12) return `${months} mois`
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  return remainingMonths > 0 ? `${years} an${years > 1 ? 's' : ''} et ${remainingMonths} mois` : `${years} an${years > 1 ? 's' : ''}`
}

// Lifecycle
onMounted(() => {
  fetchUserProfile()
})
</script>

<style scoped>
.profile-page {
  background: #f8f9ff;
  min-height: 100vh;
}

.hero-section {
  position: relative;
  margin: -24px -24px 0;
  padding: 40px 24px;
  border-radius: 0 0 20px 20px;
  overflow: hidden;
}

.gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.9;
}

.profile-header {
  position: relative;
  z-index: 1;
}

.profile-avatar {
  border: 4px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.navigation-tabs {
  margin-top: -10px;
  border-radius: 15px;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: flex-start;
}

@media (max-width: 960px) {
  .hero-section {
    padding: 24px 16px;
  }
  
  .profile-header .d-flex {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-header .text-right {
    text-align: center;
    margin-top: 16px;
  }
}
</style>