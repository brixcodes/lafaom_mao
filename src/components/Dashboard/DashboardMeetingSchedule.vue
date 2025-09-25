<template>
  <VCard>
    <VCardTitle>Planning des réunions</VCardTitle>
    <VCardText>
      <div class="meeting-list">
        <div
          v-for="meeting in meetings"
          :key="meeting.id"
          class="meeting-item d-flex align-center mb-3 pa-3 rounded"
          :class="getMeetingClass(meeting.category)"
        >
          <VAvatar
            :color="getCategoryColor(meeting.category)"
            size="40"
            class="me-3"
          >
            <VIcon :icon="getCategoryIcon(meeting.category)" />
          </VAvatar>
          <div class="flex-grow-1">
            <div class="text-body-2 font-weight-medium">
              {{ meeting.title }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ formatDate(meeting.date) }} | {{ meeting.time }}
            </div>
          </div>
          <VChip
            :color="getCategoryColor(meeting.category)"
            size="small"
            variant="tonal"
          >
            {{ meeting.category }}
          </VChip>
        </div>
      </div>
      
      <VBtn
        color="primary"
        variant="outlined"
        block
        class="mt-4"
      >
        <VIcon start icon="tabler-calendar-plus" />
        Ajouter une réunion
      </VBtn>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Meeting {
  id: string
  title: string
  date: string
  time: string
  category: 'Business' | 'Formation' | 'Réunion' | 'Déjeuner' | 'Rencontre'
}

const meetings = ref<Meeting[]>([
  {
    id: '1',
    title: 'Réunion avec l\'équipe',
    date: '21 Jan',
    time: '08:20-10:30',
    category: 'Business'
  },
  {
    id: '2',
    title: 'Formation développement',
    date: '24 Jan',
    time: '11:30-12:00',
    category: 'Formation'
  },
  {
    id: '3',
    title: 'Appel conférence',
    date: '28 Jan',
    time: '05:00-06:45',
    category: 'Réunion'
  },
  {
    id: '4',
    title: 'Rencontre avec Mark',
    date: '03 Fév',
    time: '07:00-08:30',
    category: 'Rencontre'
  },
  {
    id: '5',
    title: 'Déjeuner d\'équipe',
    date: '14 Fév',
    time: '04:15-05:30',
    category: 'Déjeuner'
  }
])

const getCategoryColor = (category: string) => {
  const colors = {
    'Business': 'primary',
    'Formation': 'success',
    'Réunion': 'info',
    'Déjeuner': 'warning',
    'Rencontre': 'secondary'
  }
  return colors[category as keyof typeof colors] || 'primary'
}

const getCategoryIcon = (category: string) => {
  const icons = {
    'Business': 'tabler-briefcase',
    'Formation': 'tabler-school',
    'Réunion': 'tabler-users',
    'Déjeuner': 'tabler-utensils',
    'Rencontre': 'tabler-handshake'
  }
  return icons[category as keyof typeof icons] || 'tabler-circle'
}

const getMeetingClass = (category: string) => {
  const classes = {
    'Business': 'bg-primary-lighten-5',
    'Formation': 'bg-success-lighten-5',
    'Réunion': 'bg-info-lighten-5',
    'Déjeuner': 'bg-warning-lighten-5',
    'Rencontre': 'bg-secondary-lighten-5'
  }
  return classes[category as keyof typeof classes] || 'bg-primary-lighten-5'
}

const formatDate = (date: string) => {
  return date
}
</script>

<style scoped>
.meeting-item {
  transition: all 0.2s ease;
  cursor: pointer;
}

.meeting-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
