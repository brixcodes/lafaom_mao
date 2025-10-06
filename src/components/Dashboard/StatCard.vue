<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  value: string | number
  subtitle?: string
  icon?: string
  color?: string
  trend?: {
    value: string
    direction: 'up' | 'down' | 'neutral'
    color?: string
  }
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  loading: false
})

const trendColor = computed(() => {
  if (props.trend?.color) return props.trend.color
  
  switch (props.trend?.direction) {
    case 'up': return 'success'
    case 'down': return 'error'
    default: return 'grey'
  }
})

const trendIcon = computed(() => {
  switch (props.trend?.direction) {
    case 'up': return 'mdi-trending-up'
    case 'down': return 'mdi-trending-down'
    default: return 'mdi-minus'
  }
})
</script>

<template>
  <v-card 
    class="pa-4" 
    elevation="2" 
    rounded="lg"
    :class="{ 'loading-shimmer': loading }"
  >
    <div class="d-flex align-center">
      <v-avatar 
        :color="color" 
        size="48" 
        class="mr-4"
        v-if="icon"
      >
        <v-icon color="white">{{ icon }}</v-icon>
      </v-avatar>
      
      <div class="flex-grow-1">
        <div class="text-caption text-grey">{{ title }}</div>
        <div class="text-h5 font-weight-bold">
          <v-skeleton-loader
            v-if="loading"
            type="text"
            width="80"
            height="32"
          />
          <span v-else>{{ value }}</span>
        </div>
        
        <div v-if="trend" class="d-flex align-center mt-1">
          <v-icon 
            :size="16" 
            :color="trendColor"
          >
            {{ trendIcon }}
          </v-icon>
          <span 
            class="text-caption ml-1"
            :class="`text-${trendColor}`"
          >
            {{ trend.value }}
          </span>
        </div>
        
        <div v-if="subtitle" class="text-caption text-grey mt-1">
          {{ subtitle }}
        </div>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.loading-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
