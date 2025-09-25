<template>
  <VCard>
    <VCardTitle>Timeline des activités</VCardTitle>
    <VCardText>
      <div class="activity-timeline">
        <div
          v-for="(activity, index) in activities"
          :key="activity.id"
          class="activity-item d-flex align-start mb-4"
        >
          <div class="activity-dot me-4 mt-1">
            <VAvatar
              :color="getActivityColor(activity.type)"
              size="24"
            >
              <VIcon :icon="getActivityIcon(activity.type)" size="16" />
            </VAvatar>
          </div>
          <div class="activity-content flex-grow-1">
            <div class="d-flex justify-space-between align-start">
              <div>
                <div class="text-body-2 font-weight-medium">
                  {{ activity.title }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ activity.description }}
                </div>
                <div class="text-caption text-medium-emphasis mt-1">
                  {{ formatTime(activity.timestamp) }}
                </div>
              </div>
              <VChip
                :color="getStatusColor(activity.status)"
                size="small"
                variant="tonal"
              >
                {{ activity.status }}
              </VChip>
            </div>
          </div>
        </div>
      </div>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Activity {
  id: string
  type: 'user' | 'training' | 'job' | 'payment' | 'blog' | 'system'
  title: string
  description: string
  timestamp: string
  status: string
}

const activities = ref<Activity[]>([
  {
    id: '1',
    type: 'user',
    title: 'Nouvel utilisateur inscrit',
    description: 'Marie Dupont s\'est inscrite sur la plateforme',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: 'Actif'
  },
  {
    id: '2',
    type: 'training',
    title: 'Nouvelle candidature formation',
    description: 'Candidature reçue pour "Développement Web"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: 'En attente'
  },
  {
    id: '3',
    type: 'payment',
    title: 'Paiement reçu',
    description: 'Paiement de 150€ pour formation "Marketing Digital"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    status: 'Confirmé'
  },
  {
    id: '4',
    type: 'job',
    title: 'Nouvelle offre d\'emploi',
    description: 'Offre "Développeur Frontend" publiée par TechCorp',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    status: 'Publiée'
  },
  {
    id: '5',
    type: 'blog',
    title: 'Nouvel article publié',
    description: '"Les tendances du développement web en 2024"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    status: 'Publié'
  }
])

const getActivityColor = (type: string) => {
  const colors = {
    user: 'primary',
    training: 'success',
    job: 'warning',
    payment: 'info',
    blog: 'secondary',
    system: 'error'
  }
  return colors[type as keyof typeof colors] || 'primary'
}

const getActivityIcon = (type: string) => {
  const icons = {
    user: 'tabler-user-plus',
    training: 'tabler-school',
    job: 'tabler-briefcase',
    payment: 'tabler-currency-euro',
    blog: 'tabler-article',
    system: 'tabler-settings'
  }
  return icons[type as keyof typeof icons] || 'tabler-circle'
}

const getStatusColor = (status: string) => {
  const colors = {
    'Actif': 'success',
    'En attente': 'warning',
    'Confirmé': 'success',
    'Publiée': 'info',
    'Publié': 'success'
  }
  return colors[status as keyof typeof colors] || 'primary'
}

const formatTime = (timestamp: string) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diff = now.getTime() - time.getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return `Il y a ${minutes} min`
  } else if (hours < 24) {
    return `Il y a ${hours}h`
  } else {
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`
  }
}
</script>

<style scoped>
.activity-timeline {
  position: relative;
}

.activity-item {
  position: relative;
}

.activity-dot {
  position: relative;
  z-index: 2;
}

.activity-content {
  min-height: 60px;
}
</style>
