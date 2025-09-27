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
                  <span class="text-h6">{{ user?.professions_status?.job_position || 'Non spécifié' }}</span>
                </div>
                <div class="d-flex align-center mb-2">
                  <VIcon icon="ri-map-pin-line" class="mr-2" />
                  <span>{{ primaryAddress?.city || 'Localisation non définie' }}</span>
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
        <VTab value="teams">
          <VIcon icon="ri-team-line" class="mr-2" />
          Équipes
        </VTab>
        <VTab value="projects">
          <VIcon icon="ri-folder-line" class="mr-2" />
          Projets
        </VTab>
        <VTab value="connections">
          <VIcon icon="ri-links-line" class="mr-2" />
          Connexions
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
            <VRow>
              <!-- Activity Timeline -->
              <VCol cols="12">
                <VCard class="mb-6">
                  <VCardTitle>
                    <VIcon icon="ri-time-line" class="mr-2" />
                    Chronologie d'activité
                  </VCardTitle>
                  <VCardText>
                    <VTimeline side="end" class="mt-4">
                      <VTimelineItem
                        v-for="activity in activities"
                        :key="activity.id"
                        :dot-color="activity.color"
                        :icon="activity.icon"
                        size="small"
                      >
                        <template #opposite>
                          <span class="text-caption text-medium-emphasis">
                            {{ formatTimeAgo(activity.date) }}
                          </span>
                        </template>
                        
                        <VCard variant="tonal">
                          <VCardText class="py-3">
                            <div class="d-flex align-center">
                              <VIcon :icon="activity.icon" :color="activity.color" class="mr-3" />
                              <div>
                                <div class="font-weight-medium">{{ activity.title }}</div>
                                <div class="text-body-2 text-medium-emphasis">
                                  {{ activity.description }}
                                </div>
                              </div>
                            </div>
                          </VCardText>
                        </VCard>
                      </VTimelineItem>
                    </VTimeline>
                  </VCardText>
                </VCard>
              </VCol>

              <!-- Informations professionnelles -->
              <VCol cols="12">
                <VCard>
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
                          <VBtn type="submit" color="primary" class="mr-2">
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
              </VCol>
            </VRow>
          </VCol>

          <!-- Colonne droite -->
          <VCol cols="12" lg="4">
            <!-- Statistiques -->
            <VCard class="mb-6 stats-card">
              <VCardTitle>Statistiques</VCardTitle>
              <VCardText>
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-number">{{ stats.projects }}</div>
                    <div class="stat-label">Projets</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">{{ stats.connections }}</div>
                    <div class="stat-label">Connexions</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">{{ stats.tasks }}</div>
                    <div class="stat-label">Tâches</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">{{ stats.completed }}</div>
                    <div class="stat-label">Complétées</div>
                  </div>
                </div>
              </VCardText>
            </VCard>

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
                    <VIcon icon="ri-map-pin-line" class="mr-3" color="primary" />
                    <div>
                      <div class="text-body-2 text-medium-emphasis">Adresse</div>
                      <div class="font-weight-medium">{{ formatAddress(primaryAddress) }}</div>
                    </div>
                  </div>
                </div>
              </VCardText>
            </VCard>

            <!-- Formation -->
            <VCard>
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
          </VCol>
        </VRow>
      </VTabsWindowItem>

      <!-- Onglet Équipes -->
      <VTabsWindowItem value="teams">
        <VRow>
          <VCol 
            v-for="team in teams" 
            :key="team.id" 
            cols="12" 
            md="6" 
            lg="4"
          >
            <VCard class="team-card h-100">
              <VCardText>
                <div class="d-flex align-center mb-4">
                  <VAvatar :color="team.color" class="mr-3">
                    <VIcon :icon="team.icon" color="white" />
                  </VAvatar>
                  <div>
                    <h6 class="text-h6">{{ team.name }}</h6>
                    <div class="text-body-2 text-medium-emphasis">{{ team.description }}</div>
                  </div>
                </div>
                
                <div class="team-stats mb-4">
                  <VChip
                    v-for="tag in team.tags"
                    :key="tag.name"
                    :color="tag.color"
                    size="small"
                    variant="tonal"
                    class="mr-1 mb-1"
                  >
                    {{ tag.name }}
                  </VChip>
                </div>
                
                <div class="d-flex justify-space-between align-center">
                  <VBtn color="primary" variant="flat" size="small">
                    {{ team.status }}
                  </VBtn>
                  <div class="d-flex -mr-2">
                    <VAvatar
                      v-for="(member, index) in team.members.slice(0, 3)"
                      :key="index"
                      size="24"
                      :class="index > 0 ? '-ml-2' : ''"
                      class="elevation-2"
                    >
                      <img v-if="member.avatar" :src="member.avatar" :alt="member.name" />
                      <span v-else class="text-caption">{{ member.initials }}</span>
                    </VAvatar>
                    <VAvatar
                      v-if="team.members.length > 3"
                      size="24"
                      color="grey-lighten-1"
                      class="-ml-2 elevation-2"
                    >
                      <span class="text-caption">+{{ team.members.length - 3 }}</span>
                    </VAvatar>
                  </div>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VTabsWindowItem>

      <!-- Onglet Projets -->
      <VTabsWindowItem value="projects">
        <VRow>
          <VCol 
            v-for="project in projects" 
            :key="project.id" 
            cols="12" 
            md="6" 
            lg="4"
          >
            <VCard class="project-card h-100">
              <VCardText>
                <div class="d-flex align-center justify-space-between mb-3">
                  <VIcon :icon="project.icon" :color="project.color" size="32" />
                  <VChip 
                    :color="project.statusColor"
                    :text="project.status"
                    size="small"
                    variant="flat"
                  />
                </div>
                
                <h6 class="text-h6 mb-2">{{ project.name }}</h6>
                <p class="text-body-2 text-medium-emphasis mb-4">{{ project.description }}</p>
                
                <div class="project-details mb-4">
                  <div class="d-flex justify-space-between text-body-2 mb-2">
                    <span>Budget: {{ project.budget }}</span>
                    <span>Total: {{ project.total }}</span>
                  </div>
                  <div class="d-flex justify-space-between text-body-2 mb-2">
                    <span>Date de début: {{ formatDate(project.startDate) }}</span>
                  </div>
                  <div class="d-flex justify-space-between text-body-2 mb-3">
                    <span>Échéance: {{ formatDate(project.deadline) }}</span>
                  </div>
                  
                  <VProgressLinear
                    :model-value="project.progress"
                    :color="project.color"
                    height="8"
                    rounded
                    class="mb-2"
                  />
                  <div class="text-center text-body-2">{{ project.progress }}% Terminé</div>
                </div>
                
                <div class="d-flex justify-space-between align-center">
                  <div class="d-flex -mr-2">
                    <VAvatar
                      v-for="(member, index) in project.team.slice(0, 3)"
                      :key="index"
                      size="28"
                      :class="index > 0 ? '-ml-2' : ''"
                      class="elevation-2"
                    >
                      <span class="text-caption">{{ member.initials }}</span>
                    </VAvatar>
                    <VAvatar
                      v-if="project.team.length > 3"
                      size="28"
                      color="grey-lighten-1"
                      class="-ml-2 elevation-2"
                    >
                      <span class="text-caption">+{{ project.team.length - 3 }}</span>
                    </VAvatar>
                  </div>
                  
                  <VMenu>
                    <template #activator="{ props }">
                      <VBtn icon="ri-more-line" variant="text" size="small" v-bind="props" />
                    </template>
                    <VList>
                      <VListItem @click="viewProject(project.id)">
                        <VListItemTitle>Voir détails</VListItemTitle>
                      </VListItem>
                      <VListItem @click="editProject(project.id)">
                        <VListItemTitle>Modifier</VListItemTitle>
                      </VListItem>
                    </VList>
                  </VMenu>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VTabsWindowItem>

      <!-- Onglet Connexions -->
      <VTabsWindowItem value="connections">
        <VRow>
          <VCol 
            v-for="connection in connections" 
            :key="connection.id" 
            cols="12" 
            sm="6" 
            md="4" 
            lg="3"
          >
            <VCard class="connection-card h-100 text-center">
              <VCardText class="pb-2">
                <VAvatar size="80" class="mb-4">
                  <img v-if="connection.avatar" :src="connection.avatar" :alt="connection.name" />
                  <span v-else class="text-h5">{{ connection.initials }}</span>
                </VAvatar>
                
                <h6 class="text-h6 mb-1">{{ connection.name }}</h6>
                <div class="text-body-2 text-medium-emphasis mb-3">{{ connection.role }}</div>
                
                <div class="connection-stats mb-4">
                  <div class="d-flex justify-center text-body-2">
                    <div class="mx-2">
                      <div class="font-weight-bold">{{ connection.projects }}</div>
                      <div class="text-medium-emphasis">Projets</div>
                    </div>
                    <div class="mx-2">
                      <div class="font-weight-bold">{{ connection.tasks }}</div>
                      <div class="text-medium-emphasis">Tâches</div>
                    </div>
                    <div class="mx-2">
                      <div class="font-weight-bold">{{ connection.connections }}</div>
                      <div class="text-medium-emphasis">Connexions</div>
                    </div>
                  </div>
                </div>
                
                <div class="mb-4">
                  <VChip
                    v-for="tag in connection.tags"
                    :key="tag.name"
                    :color="tag.color"
                    size="small"
                    variant="tonal"
                    class="mr-1 mb-1"
                  >
                    {{ tag.name }}
                  </VChip>
                </div>
              </VCardText>
              
              <VCardActions>
                <VBtn
                  :color="connection.connected ? 'success' : 'primary'"
                  variant="flat"
                  block
                  @click="toggleConnection(connection)"
                >
                  {{ connection.connected ? 'Connecté' : 'Se connecter' }}
                </VBtn>
              </VCardActions>
            </VCard>
          </VCol>
        </VRow>
      </VTabsWindowItem>
    </VTabsWindow>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usersService } from '@/services/api/users'

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

// Computed
const primaryAddress = computed(() => {
  return user.value?.addresses?.find((addr: any) => addr.address_type === 'primary') || null
})

const stats = ref({
  projects: 12,
  connections: 834,
  tasks: 126,
  completed: 890
})

// Mock data pour les autres onglets
const activities = ref([
  {
    id: 1,
    title: 'Profile Updated',
    description: 'You updated your professional information',
    date: new Date().toISOString(),
    icon: 'ri-user-settings-line',
    color: 'primary'
  },
  {
    id: 2,
    title: 'New Connection',
    description: 'Connected with John Doe from Design Team',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    icon: 'ri-user-add-line',
    color: 'success'
  },
  {
    id: 3,
    title: 'Project Completed',
    description: 'Successfully completed the Mobile App project',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    icon: 'ri-check-line',
    color: 'success'
  }
])

const teams = ref([
  {
    id: 1,
    name: 'React Developers',
    description: 'We don\'t make assumptions about the rest of your technology stack',
    color: 'primary',
    icon: 'ri-code-line',
    status: 'Active',
    tags: [{ name: 'React', color: 'blue' }, { name: 'Frontend', color: 'green' }],
    members: [
      { name: 'John Doe', initials: 'JD', avatar: '' },
      { name: 'Jane Smith', initials: 'JS', avatar: '' },
      { name: 'Mike Johnson', initials: 'MJ', avatar: '' }
    ]
  },
  {
    id: 2,
    name: 'Vue.js Dev Team',
    description: 'The development of Vue and its ecosystem is guided by a team',
    color: 'success',
    icon: 'ri-vuejs-line',
    status: 'Active',
    tags: [{ name: 'Vue', color: 'green' }, { name: 'JavaScript', color: 'yellow' }],
    members: [
      { name: 'Alice Brown', initials: 'AB', avatar: '' },
      { name: 'Bob Wilson', initials: 'BW', avatar: '' }
    ]
  },
  {
    id: 3,
    name: 'Support Team',
    description: 'A design or product team is more than just the people on it',
    color: 'warning',
    icon: 'ri-customer-service-line',
    status: 'Active',
    tags: [{ name: 'Support', color: 'orange' }],
    members: [
      { name: 'Charlie Davis', initials: 'CD', avatar: '' },
      { name: 'Diana Evans', initials: 'DE', avatar: '' },
      { name: 'Eve Foster', initials: 'EF', avatar: '' },
      { name: 'Frank Green', initials: 'FG', avatar: '' }
    ]
  }
])

const projects = ref([
  {
    id: 1,
    name: 'Social Banners',
    description: 'We are Consulting, Software Development and Web Development Services',
    icon: 'ri-share-line',
    color: 'primary',
    status: 'Completed',
    statusColor: 'success',
    budget: '$24,500',
    total: '$18,200',
    startDate: '2023-01-15',
    deadline: '2023-06-15',
    progress: 78,
    team: [
      { initials: 'AB' },
      { initials: 'CD' },
      { initials: 'EF' }
    ]
  },
  {
    id: 2,
    name: 'Admin Template',
    description: 'Time is our most valuable asset, that\'s why we want to help you save it',
    icon: 'ri-admin-line',
    color: 'info',
    status: 'Ongoing',
    statusColor: 'primary',
    budget: '$18,200',
    total: '$15,800',
    startDate: '2023-02-01',
    deadline: '2023-08-01',
    progress: 65,
    team: [
      { initials: 'GH' },
      { initials: 'IJ' }
    ]
  },
  {
    id: 3,
    name: 'App Design',
    description: 'App design combines the user interface (UI) and user experience (UX)',
    icon: 'ri-smartphone-line',
    color: 'success',
    status: 'Completed',
    statusColor: 'success',
    budget: '$32,500',
    total: '$28,000',
    startDate: '2023-03-01',
    deadline: '2023-09-01',
    progress: 88,
    team: [
      { initials: 'KL' },
      { initials: 'MN' },
      { initials: 'OP' }
    ]
  }
])

const connections = ref([
  {
    id: 1,
    name: 'Mark Gilbert',
    role: 'UI Designer',
    avatar: '',
    initials: 'MG',
    projects: 18,
    tasks: 834,
    connections: 126,
    connected: true,
    tags: [{ name: 'UI/UX', color: 'primary' }]
  },
  {
    id: 2,
    name: 'Eugenia Parsons',
    role: 'Developer',
    avatar: '',
    initials: 'EP',
    projects: 112,
    tasks: 2340,
    connections: 1280,
    connected: false,
    tags: [{ name: 'React', color: 'info' }, { name: 'Node.js', color: 'success' }]
  },
  {
    id: 3,
    name: 'Francis Byrd',
    role: 'Developer',
    avatar: '',
    initials: 'FB',
    projects: 32,
    tasks: 1200,
    connections: 890,
    connected: true,
    tags: [{ name: 'Vue', color: 'success' }, { name: 'Python', color: 'warning' }]
  },
  {
    id: 4,
    name: 'Leon Lucas',
    role: 'UI/UX Designer',
    avatar: '',
    initials: 'LL',
    projects: 86,
    tasks: 1240,
    connections: 890,
    connected: false,
    tags: [{ name: 'Design', color: 'secondary' }]
  },
  {
    id: 5,
    name: 'Jayden Rogers',
    role: 'Full Stack Developer',
    avatar: '',
    initials: 'JR',
    projects: 244,
    tasks: 2380,
    connections: 2140,
    connected: true,
    tags: [{ name: 'Full Stack', color: 'info' }, { name: 'DevOps', color: 'warning' }]
  },
  {
    id: 6,
    name: 'Jeanette Powell',
    role: 'SEO',
    avatar: '',
    initials: 'JP',
    projects: 32,
    tasks: 1280,
    connections: 1270,
    connected: false,
    tags: [{ name: 'SEO', color: 'success' }, { name: 'Marketing', color: 'error' }]
  }
])

// Methods
const fetchUserProfile = async () => {
  try {
    loading.value = true
    // Utiliser la méthode pour obtenir le profil complet de l'utilisateur actuel
    const profileData = await usersService.getCurrentUserProfile()
    user.value = profileData.data || profileData
    
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
    // Fallback pour obtenir l'utilisateur de base si le profil complet échoue
    try {
      const currentUser = authStore.user
      if (currentUser?.id) {
        const basicUser = await usersService.getUserById(currentUser.id)
        user.value = basicUser.data || basicUser
      }
    } catch (fallbackError) {
      console.error('Erreur lors du fallback:', fallbackError)
    }
  } finally {
    loading.value = false
  }
}

const updateProfessionalInfo = async () => {
  try {
    loading.value = true
    // API call to update professional information
    // await usersService.updateProfessionalInfo(user.value.id, editableProfile.value)
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

const formatAddress = (address: any) => {
  if (!address) return 'Non définie'
  const parts = [
    address.street,
    address.postal_code,
    address.city,
    address.country_code
  ].filter(Boolean)
  return parts.join(', ') || 'Adresse incomplète'
}

const toggleConnection = (connection: any) => {
  connection.connected = !connection.connected
}

const viewProject = (projectId: number) => {
  console.log('Voir projet:', projectId)
}

const editProject = (projectId: number) => {
  console.log('Modifier projet:', projectId)
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

.stats-card .stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  text-align: center;
}

.stat-item {
  padding: 16px;
  border-radius: 12px;
  background: rgba(var(--v-theme-primary), 0.05);
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: rgb(var(--v-theme-primary));
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  margin-top: 4px;
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

.team-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.team-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.project-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.connection-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.connection-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.connection-stats {
  border-top: 1px solid rgba(var(--v-border-color), 0.12);
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
  padding: 16px 0;
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