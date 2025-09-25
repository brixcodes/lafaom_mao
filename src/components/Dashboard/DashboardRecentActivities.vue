<template>
  <VCard>
    <VCardTitle>
      <VIcon
        icon="ri-time-line"
        class="me-2"
      />
      Activités récentes
    </VCardTitle>
    
    <VCardText>
      <VList>
        <VListItem
          v-for="activity in recentActivities"
          :key="activity.id"
          class="px-0"
        >
          <template #prepend>
            <VAvatar
              :color="getActivityColor(activity.type)"
              size="40"
              class="me-3"
            >
              <VIcon :icon="getActivityIcon(activity.type)" />
            </VAvatar>
          </template>

          <VListItemTitle class="text-body-1">
            {{ activity.title }}
          </VListItemTitle>
          
          <VListItemSubtitle class="text-body-2">
            {{ activity.description }}
          </VListItemSubtitle>

          <template #append>
            <div class="text-right">
              <VChip
                v-if="activity.status"
                :color="getStatusColor(activity.status)"
                size="small"
                class="mb-1"
              >
                {{ activity.status }}
              </VChip>
              <div class="text-caption text-medium-emphasis">
                {{ formatDate(activity.timestamp) }}
              </div>
            </div>
          </template>
        </VListItem>

        <VListItem v-if="recentActivities.length === 0">
          <VListItemTitle class="text-center text-medium-emphasis">
            Aucune activité récente
          </VListItemTitle>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import type { DashboardRecentActivity } from '@/services/api/dashboard'

const dashboardStore = useDashboardStore()

const recentActivities = computed(() => dashboardStore.recentActivities)

const getActivityIcon = (type: DashboardRecentActivity['type']): string => {
  const icons = {
    user: 'ri-user-line',
    training: 'ri-graduation-cap-line',
    job: 'ri-briefcase-line',
    payment: 'ri-money-dollar-circle-line',
    blog: 'ri-article-line',
    reclamation: 'ri-customer-service-line'
  }
  return icons[type] || 'ri-notification-line'
}

const getActivityColor = (type: DashboardRecentActivity['type']): string => {
  const colors = {
    user: 'primary',
    training: 'info',
    job: 'success',
    payment: 'warning',
    blog: 'secondary',
    reclamation: 'error'
  }
  return colors[type] || 'primary'
}

const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    'APPROVED': 'success',
    'PENDING': 'warning',
    'REJECTED': 'error',
    'COMPLETED': 'success',
    'IN_PROGRESS': 'info',
    'NEW': 'primary'
  }
  return statusColors[status] || 'secondary'
}

const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    return 'Il y a quelques minutes'
  } else if (diffInHours < 24) {
    return `Il y a ${diffInHours}h`
  } else if (diffInHours < 48) {
    return 'Hier'
  } else {
    return date.toLocaleDateString('fr-FR')
  }
}
</script>
