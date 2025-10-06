<script setup lang="ts">
import { computed } from 'vue'

interface Activity {
  id: string
  icon: string
  iconColor: string
  title: string
  subtitle: string
  amount?: string
  trend?: {
    direction: 'up' | 'down' | 'neutral'
    value: string
  }
  status?: string
  statusColor?: string
}

interface Props {
  title: string
  activities: Activity[]
  loading?: boolean
  maxItems?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  maxItems: 5
})

const displayActivities = computed(() => 
  props.activities.slice(0, props.maxItems)
)

const getTrendIcon = (direction: string) => {
  switch (direction) {
    case 'up': return 'mdi-arrow-up'
    case 'down': return 'mdi-arrow-down'
    default: return 'mdi-minus'
  }
}

const getTrendColor = (direction: string) => {
  switch (direction) {
    case 'up': return 'success'
    case 'down': return 'error'
    default: return 'grey'
  }
}
</script>

<template>
  <v-card class="pa-4" elevation="2" rounded="lg">
    <h4 class="text-h6 font-weight-bold mb-4">{{ title }}</h4>
    
    <div v-if="loading" class="space-y-3">
      <v-skeleton-loader
        v-for="n in maxItems"
        :key="n"
        type="list-item-avatar-two-line"
      />
    </div>
    
    <div v-else class="space-y-3">
      <div 
        v-for="activity in displayActivities" 
        :key="activity.id"
        class="d-flex align-center py-2"
      >
        <v-avatar 
          :color="activity.iconColor" 
          size="32" 
          class="mr-3"
        >
          <v-icon color="white" size="16">{{ activity.icon }}</v-icon>
        </v-avatar>
        
        <div class="flex-grow-1">
          <div class="text-body-2 font-weight-medium">{{ activity.title }}</div>
          <div class="text-caption text-grey">{{ activity.subtitle }}</div>
        </div>
        
        <div class="text-right">
          <div v-if="activity.amount" class="text-body-2 font-weight-bold">
            {{ activity.amount }}
          </div>
          <div v-if="activity.trend" class="d-flex align-center justify-end">
            <v-icon 
              :size="16" 
              :color="getTrendColor(activity.trend.direction)"
            >
              {{ getTrendIcon(activity.trend.direction) }}
            </v-icon>
          </div>
          <v-chip 
            v-if="activity.status"
            size="small" 
            :color="activity.statusColor || 'grey'"
            variant="flat"
            class="mt-1"
          >
            {{ activity.status }}
          </v-chip>
        </div>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.space-y-3 > * + * {
  margin-top: 12px;
}
</style>
