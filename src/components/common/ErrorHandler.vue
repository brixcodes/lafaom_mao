<!-- Composant de gestion d'erreur -->
<template>
  <div class="error-container">
    <VAlert
      v-if="error"
      :type="alertType"
      :title="title"
      :text="error"
      closable
      @click:close="clearError"
    />
    
    <VCard v-else-if="showEmpty" class="empty-state">
      <VCardText class="text-center">
        <VIcon
          :icon="emptyIcon"
          size="64"
          color="disabled"
          class="mb-4"
        />
        <h3 class="text-h6 mb-2">
          {{ emptyTitle }}
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          {{ emptyMessage }}
        </p>
        <VBtn
          v-if="showRetryButton"
          color="primary"
          @click="retry"
        >
          {{ retryButtonText }}
        </VBtn>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup lang="ts">
interface Props {
  error?: string | null
  title?: string
  alertType?: 'error' | 'warning' | 'info'
  showEmpty?: boolean
  emptyTitle?: string
  emptyMessage?: string
  emptyIcon?: string
  showRetryButton?: boolean
  retryButtonText?: string
}

interface Emits {
  (e: 'clear-error'): void
  (e: 'retry'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Erreur',
  alertType: 'error',
  showEmpty: false,
  emptyTitle: 'Aucune donnée',
  emptyMessage: 'Il n\'y a aucune donnée à afficher pour le moment.',
  emptyIcon: 'ri-inbox-line',
  showRetryButton: false,
  retryButtonText: 'Réessayer'
})

const emit = defineEmits<Emits>()

const clearError = () => {
  emit('clear-error')
}

const retry = () => {
  emit('retry')
}
</script>

<style scoped>
.error-container {
  width: 100%;
}

.empty-state {
  margin: 1rem 0;
}
</style>
