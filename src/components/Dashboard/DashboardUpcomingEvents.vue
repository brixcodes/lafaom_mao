<template>
  <VCard>
    <VCardTitle class="d-flex justify-space-between align-center">
      <span>Événements à venir</span>
      <VBtn variant="text" size="small">Voir tout</VBtn>
    </VCardTitle>
    <VCardText>
      <div class="upcoming-events">
        <div
          v-for="event in events"
          :key="event.id"
          class="event-item d-flex align-center mb-4 pa-3 rounded"
          :class="getEventClass(event.type)"
        >
          <VAvatar
            :color="getEventColor(event.type)"
            size="48"
            class="me-3"
          >
            <VIcon :icon="getEventIcon(event.type)" />
          </VAvatar>
          <div class="flex-grow-1">
            <div class="text-body-2 font-weight-medium mb-1">
              {{ event.title }}
            </div>
            <div class="text-caption text-medium-emphasis mb-1">
              {{ event.description }}
            </div>
            <div class="d-flex align-center gap-2">
              <VChip
                :color="getEventColor(event.type)"
                size="small"
                variant="tonal"
              >
                {{ event.type }}
              </VChip>
              <span class="text-caption text-medium-emphasis">
                {{ formatDate(event.date) }}
              </span>
            </div>
          </div>
          <div class="text-right">
            <div class="text-h6 font-weight-bold">
              {{ event.time }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ event.duration }}
            </div>
          </div>
        </div>
      </div>
      
      <VBtn
        color="primary"
        variant="outlined"
        block
        class="mt-4"
      >
        <VIcon start icon="tabler-calendar-plus" />
        Ajouter un événement
      </VBtn>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  duration: string
  type: 'Formation' | 'Réunion' | 'Webinaire' | 'Conférence' | 'Atelier'
}

const events = ref<Event[]>([
  {
    id: '1',
    title: 'Formation Développement Web',
    description: 'Session intensive sur les technologies modernes',
    date: '24 Jan',
    time: '10:00',
    duration: '2h',
    type: 'Formation'
  },
  {
    id: '2',
    title: 'Webinaire Marketing Digital',
    description: 'Les nouvelles tendances du marketing en ligne',
    date: '28 Jan',
    time: '14:30',
    duration: '1h30',
    type: 'Webinaire'
  },
  {
    id: '3',
    title: 'Réunion d\'équipe',
    description: 'Point hebdomadaire sur les projets en cours',
    date: '31 Jan',
    time: '09:00',
    duration: '1h',
    type: 'Réunion'
  },
  {
    id: '4',
    title: 'Conférence Tech',
    description: 'L\'avenir de l\'intelligence artificielle',
    date: '05 Fév',
    time: '16:00',
    duration: '3h',
    type: 'Conférence'
  },
  {
    id: '5',
    title: 'Atelier Design',
    description: 'Création d\'interfaces utilisateur modernes',
    date: '08 Fév',
    time: '11:00',
    duration: '2h30',
    type: 'Atelier'
  }
])

const getEventColor = (type: string) => {
  const colors = {
    'Formation': 'primary',
    'Réunion': 'success',
    'Webinaire': 'info',
    'Conférence': 'warning',
    'Atelier': 'secondary'
  }
  return colors[type as keyof typeof colors] || 'primary'
}

const getEventIcon = (type: string) => {
  const icons = {
    'Formation': 'tabler-school',
    'Réunion': 'tabler-users',
    'Webinaire': 'tabler-video',
    'Conférence': 'tabler-microphone',
    'Atelier': 'tabler-tools'
  }
  return icons[type as keyof typeof icons] || 'tabler-circle'
}

const getEventClass = (type: string) => {
  const classes = {
    'Formation': 'bg-primary-lighten-5',
    'Réunion': 'bg-success-lighten-5',
    'Webinaire': 'bg-info-lighten-5',
    'Conférence': 'bg-warning-lighten-5',
    'Atelier': 'bg-secondary-lighten-5'
  }
  return classes[type as keyof typeof classes] || 'bg-primary-lighten-5'
}

const formatDate = (date: string) => {
  return date
}
</script>

<style scoped>
.event-item {
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

.event-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: rgba(var(--v-theme-primary), 0.2);
}
</style>
