<!-- Composant de chargement -->
<template>
  <div class="loading-container">
    <VProgressCircular
      v-if="type === 'circular'"
      :size="size"
      :width="width"
      :color="color"
      indeterminate
    />
    <VProgressLinear
      v-else-if="type === 'linear'"
      :color="color"
      indeterminate
    />
    <div v-else class="skeleton-loader">
      <VSkeletonLoader
        :type="skeletonType"
        :width="width"
        :height="height"
      />
    </div>
    
    <p v-if="message" class="loading-message mt-2">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'circular' | 'linear' | 'skeleton'
  size?: number | string
  width?: number | string
  height?: number | string
  color?: string
  message?: string
  skeletonType?: string
}

withDefaults(defineProps<Props>(), {
  type: 'circular',
  size: 40,
  width: 3,
  color: 'primary',
  skeletonType: 'card'
})
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-message {
  color: rgb(var(--v-theme-on-surface-variant));
  font-size: 0.875rem;
  text-align: center;
}

.skeleton-loader {
  width: 100%;
}
</style>
