<template>
  <VCard>
    <VCardTitle class="d-flex justify-space-between align-center">
      <span>Notifications récentes</span>
      <VBtn variant="text" size="small">Marquer comme lu</VBtn>
    </VCardTitle>
    <VCardText>
      <div class="notifications">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-item d-flex align-center mb-3 pa-3 rounded"
          :class="getNotificationClass(notification.type)"
        >
          <VAvatar
            :color="getNotificationColor(notification.type)"
            size="32"
            class="me-3"
          >
            <VIcon :icon="getNotificationIcon(notification.type)" size="16" />
          </VAvatar>
          <div class="flex-grow-1">
            <div class="text-body-2 font-weight-medium mb-1">
              {{ notification.title }}
            </div>
            <div class="text-caption text-medium-emphasis mb-1">
              {{ notification.message }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ formatTime(notification.timestamp) }}
            </div>
          </div>
          <div class="text-right">
            <VChip
              :color="getNotificationColor(notification.type)"
              size="small"
              variant="tonal"
            >
              {{ notification.type }}
            </VChip>
            <div
              v-if="!notification.read"
              class="notification-dot mt-1"
            ></div>
          </div>
        </div>
      </div>
      
      <VBtn
        color="primary"
        variant="outlined"
        block
        class="mt-4"
      >
        <VIcon start icon="tabler-bell" />
        Voir toutes les notifications
      </VBtn>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  type: 'Info' | 'Succès' | 'Avertissement' | 'Erreur' | 'Formation' | 'Emploi'
  read: boolean
}

const notifications = ref<Notification[]>([
  {
    id: '1',
    title: 'Nouvelle candidature',
    message: 'Marie Dupont a postulé pour la formation "Développement Web"',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    type: 'Formation',
    read: false
  },
  {
    id: '2',
    title: 'Paiement reçu',
    message: 'Paiement de 150€ confirmé pour la formation "Marketing Digital"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    type: 'Succès',
    read: false
  },
  {
    id: '3',
    title: 'Offre d\'emploi publiée',
    message: 'L\'offre "Développeur Frontend" a été publiée avec succès',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    type: 'Emploi',
    read: true
  },
  {
    id: '4',
    title: 'Article publié',
    message: 'L\'article "Les tendances du développement web" est maintenant en ligne',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    type: 'Info',
    read: true
  },
  {
    id: '5',
    title: 'Système de maintenance',
    message: 'Maintenance programmée ce soir de 22h à 23h',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    type: 'Avertissement',
    read: false
  }
])

const getNotificationColor = (type: string) => {
  const colors = {
    'Info': 'info',
    'Succès': 'success',
    'Avertissement': 'warning',
    'Erreur': 'error',
    'Formation': 'primary',
    'Emploi': 'secondary'
  }
  return colors[type as keyof typeof colors] || 'info'
}

const getNotificationIcon = (type: string) => {
  const icons = {
    'Info': 'tabler-info-circle',
    'Succès': 'tabler-check-circle',
    'Avertissement': 'tabler-alert-triangle',
    'Erreur': 'tabler-x-circle',
    'Formation': 'tabler-school',
    'Emploi': 'tabler-briefcase'
  }
  return icons[type as keyof typeof icons] || 'tabler-bell'
}

const getNotificationClass = (type: string) => {
  const classes = {
    'Info': 'bg-info-lighten-5',
    'Succès': 'bg-success-lighten-5',
    'Avertissement': 'bg-warning-lighten-5',
    'Erreur': 'bg-error-lighten-5',
    'Formation': 'bg-primary-lighten-5',
    'Emploi': 'bg-secondary-lighten-5'
  }
  return classes[type as keyof typeof classes] || 'bg-info-lighten-5'
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
.notification-item {
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

.notification-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: rgba(var(--v-theme-primary), 0.2);
}

.notification-dot {
  width: 8px;
  height: 8px;
  background-color: rgb(var(--v-theme-primary));
  border-radius: 50%;
  margin: 0 auto;
}
</style>
