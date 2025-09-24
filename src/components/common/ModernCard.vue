<template>
  <div 
    :class="[
      'modern-card',
      {
        'card-hover': hoverable,
        'card-clickable': clickable,
        'card-loading': loading
      }
    ]"
    @click="handleClick"
  >
    <!-- Header -->
    <div v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div v-if="icon" class="card-icon">
              <VIcon :icon="icon" :size="iconSize" :color="iconColor" />
            </div>
            <div>
              <h3 v-if="title" class="card-title">{{ title }}</h3>
              <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
            </div>
          </div>
          <div v-if="badge" class="card-badge">
            <span :class="['badge', `badge-${badgeType}`]">
              {{ badge }}
            </span>
          </div>
        </div>
      </slot>
    </div>

    <!-- Content -->
    <div class="card-content">
      <slot />
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>

    <!-- Loading overlay -->
    <div v-if="loading" class="card-loading-overlay">
      <div class="loading-spinner">
        <VIcon icon="ri-loader-4-line" size="24" class="animate-spin" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  icon?: string
  iconSize?: string | number
  iconColor?: string
  badge?: string
  badgeType?: 'success' | 'warning' | 'error' | 'info' | 'gray'
  hoverable?: boolean
  clickable?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  iconSize: 24,
  iconColor: 'primary',
  badgeType: 'gray',
  hoverable: false,
  clickable: false,
  loading: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (props.clickable && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.modern-card {
  @apply card;
  position: relative;
  overflow: hidden;
  transition: all var(--transition-normal);
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.card-clickable {
  cursor: pointer;
}

.card-loading {
  pointer-events: none;
}

.card-header {
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--gray-200);
  margin-bottom: var(--space-4);
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: var(--primary-50);
  color: var(--primary-600);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
  line-height: var(--line-height-tight);
}

.card-subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: var(--space-1) 0 0 0;
  line-height: var(--line-height-normal);
}

.card-badge {
  display: flex;
  align-items: center;
}

.card-content {
  flex: 1;
}

.card-footer {
  padding-top: var(--space-4);
  border-top: 1px solid var(--gray-200);
  margin-top: var(--space-4);
}

.card-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Responsive */
@media (max-width: 768px) {
  .card-header {
    padding-bottom: var(--space-3);
    margin-bottom: var(--space-3);
  }
  
  .card-icon {
    width: 40px;
    height: 40px;
  }
  
  .card-title {
    font-size: var(--font-size-base);
  }
}
</style>
