<template>
  <ModernCard 
    :icon="icon"
    :icon-color="iconColor"
    :loading="loading"
    class="stats-card"
  >
    <div class="stats-content">
      <div class="stats-header">
        <h3 class="stats-title">{{ title }}</h3>
        <div v-if="trend" class="stats-trend" :class="`trend-${trend.type}`">
          <VIcon 
            :icon="trend.type === 'up' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'" 
            size="16" 
          />
          <span>{{ trend.value }}</span>
        </div>
      </div>
      
      <div class="stats-value">
        <span class="value-number">{{ formattedValue }}</span>
        <span v-if="unit" class="value-unit">{{ unit }}</span>
      </div>
      
      <div v-if="description" class="stats-description">
        {{ description }}
      </div>
      
      <div v-if="progress" class="stats-progress">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${progress}%` }"
            :class="progressClass"
          ></div>
        </div>
        <span class="progress-text">{{ progress }}%</span>
      </div>
    </div>
  </ModernCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ModernCard from './ModernCard.vue'

interface Trend {
  type: 'up' | 'down'
  value: string
}

interface Props {
  title: string
  value: number | string
  unit?: string
  icon?: string
  iconColor?: string
  description?: string
  trend?: Trend
  progress?: number
  loading?: boolean
  format?: 'number' | 'currency' | 'percentage'
}

const props = withDefaults(defineProps<Props>(), {
  iconColor: 'primary',
  format: 'number',
  loading: false
})

const formattedValue = computed(() => {
  if (typeof props.value === 'string') return props.value
  
  switch (props.format) {
    case 'currency':
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF'
      }).format(props.value)
    case 'percentage':
      return `${props.value}%`
    default:
      return new Intl.NumberFormat('fr-FR').format(props.value)
  }
})

const progressClass = computed(() => {
  if (!props.progress) return ''
  
  if (props.progress >= 80) return 'progress-success'
  if (props.progress >= 60) return 'progress-warning'
  return 'progress-info'
})
</script>

<style scoped>
.stats-card {
  height: 100%;
}

.stats-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.stats-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}

.stats-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  margin: 0;
}

.stats-trend {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.trend-up {
  color: var(--success-600);
}

.trend-down {
  color: var(--error-600);
}

.stats-value {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.value-number {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: 1;
}

.value-unit {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.stats-description {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  margin-bottom: var(--space-4);
  line-height: var(--line-height-normal);
}

.stats-progress {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: auto;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--gray-200);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: var(--radius-sm);
  transition: width var(--transition-normal);
}

.progress-success {
  background: linear-gradient(90deg, var(--success-500), var(--success-600));
}

.progress-warning {
  background: linear-gradient(90deg, var(--warning-500), var(--warning-600));
}

.progress-info {
  background: linear-gradient(90deg, var(--info-500), var(--info-600));
}

.progress-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  min-width: 40px;
  text-align: right;
}

/* Responsive */
@media (max-width: 768px) {
  .value-number {
    font-size: var(--font-size-2xl);
  }
  
  .stats-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
  }
  
  .stats-trend {
    align-self: flex-end;
  }
}
</style>
