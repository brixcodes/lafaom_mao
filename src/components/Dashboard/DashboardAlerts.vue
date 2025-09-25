<template>
  <VCard>
    <VCardTitle>
      <VIcon
        icon="ri-alert-line"
        class="me-2"
      />
      Alertes
      <VSpacer />
      <VChip
        v-if="criticalAlerts.length > 0"
        color="error"
        size="small"
      >
        {{ criticalAlerts.length }}
      </VChip>
    </VCardTitle>
    
    <VCardText>
      <VList v-if="alerts.length > 0">
        <VListItem
          v-for="alert in alerts"
          :key="alert.id"
          class="px-0"
        >
          <template #prepend>
            <VAvatar
              :color="getAlertColor(alert.type)"
              size="40"
              class="me-3"
            >
              <VIcon :icon="getAlertIcon(alert.type)" />
            </VAvatar>
          </template>

          <VListItemTitle class="text-body-1">
            {{ alert.title }}
          </VListItemTitle>
          
          <VListItemSubtitle class="text-body-2">
            {{ alert.message }}
          </VListItemSubtitle>

          <template #append>
            <div class="text-right">
              <VChip
                v-if="alert.action_required"
                color="warning"
                size="small"
                class="mb-1"
              >
                Action requise
              </VChip>
              <div class="text-caption text-medium-emphasis">
                {{ formatDate(alert.created_at) }}
              </div>
            </div>
          </template>
        </VListItem>
      </VList>

      <VEmptyState
        v-else
        title="Aucune alerte"
        text="Tout fonctionne correctement !"
      />
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import type { DashboardAlerts } from '@/services/api/dashboard'

const dashboardStore = useDashboardStore()

const alerts = computed(() => dashboardStore.alerts)
const criticalAlerts = computed(() => dashboardStore.criticalAlerts)

const getAlertIcon = (type: DashboardAlerts['type']): string => {
  const icons = {
    warning: 'ri-warning-line',
    error: 'ri-error-warning-line',
    info: 'ri-information-line',
    success: 'ri-check-line'
  }
  return icons[type] || 'ri-notification-line'
}

const getAlertColor = (type: DashboardAlerts['type']): string => {
  const colors = {
    warning: 'warning',
    error: 'error',
    info: 'info',
    success: 'success'
  }
  return colors[type] || 'primary'
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
