<template>
  <VCard>
    <VCardTitle>
      <div class="d-flex align-center">
        <VIcon class="mr-3" color="primary">ri-notification-line</VIcon>
        Notifications
      </div>
    </VCardTitle>
    
    <VCardText>
      <div v-if="notifications.length === 0" class="text-center py-8">
        <VIcon size="64" color="medium-emphasis" class="mb-4">ri-notification-off-line</VIcon>
        <h3 class="text-h6 mb-2">Aucune notification</h3>
        <p class="text-body-2 text-medium-emphasis">
          Vous n'avez aucune notification pour le moment.
        </p>
      </div>
      
      <div v-else>
        <VList>
          <VListItem
            v-for="notification in notifications"
            :key="notification.id"
            class="mb-2"
          >
            <template #prepend>
              <VIcon
                :color="notification.type === 'success' ? 'success' : notification.type === 'warning' ? 'warning' : 'info'"
                :class="notification.type === 'success' ? 'ri-check-circle-line' : notification.type === 'warning' ? 'ri-alert-line' : 'ri-information-line'"
              />
            </template>
            
            <VListItemTitle>{{ notification.title }}</VListItemTitle>
            <VListItemSubtitle>{{ notification.message }}</VListItemSubtitle>
            
            <template #append>
              <div class="d-flex align-center gap-2">
                <span class="text-caption text-medium-emphasis">
                  {{ formatDate(notification.created_at) }}
                </span>
                <VBtn
                  v-if="!notification.read"
                  size="small"
                  color="primary"
                  variant="outlined"
                  @click="markAsRead(notification.id)"
                >
                  Marquer comme lu
                </VBtn>
              </div>
            </template>
          </VListItem>
        </VList>
      </div>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Notification {
  id: number
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  created_at: string
}

interface Props {
  notifications: Notification[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'mark-read': [id: number]
  'mark-all-read': []
}>()

// Computed
const unreadCount = computed(() => {
  return props.notifications.filter(n => !n.read).length
})

// Methods
const markAsRead = (id: number) => {
  emit('mark-read', id)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.v-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
