<template>
  <VAlert
    v-if="error"
    type="error"
    variant="outlined"
    closable
    @click:close="$emit('close')"
    class="mb-4"
  >
    <VAlertTitle class="d-flex align-center">
      <VIcon class="me-2">ri-error-warning-line</VIcon>
      {{ title }}
    </VAlertTitle>
    
    <template v-if="isString">
      <p class="mb-0">{{ error }}</p>
    </template>
    
    <template v-else-if="isObject">
      <div v-if="error.message" class="mb-2">
        <strong>Message:</strong> {{ error.message }}
      </div>
      
      <div v-if="error.error_code" class="mb-2">
        <strong>Code d'erreur:</strong> {{ error.error_code }}
      </div>
      
      <div v-if="error.details" class="mb-2">
        <strong>Détails:</strong> {{ error.details }}
      </div>
      
      <div v-if="error.error && Array.isArray(error.error)" class="mb-2">
        <strong>Erreurs de validation:</strong>
        <ul class="mt-1 mb-0">
          <li v-for="(validationError, index) in error.error" :key="index">
            <code>{{ validationError.loc?.join('.') }}</code>: {{ validationError.msg }}
          </li>
        </ul>
      </div>
      
      <div v-if="showDetails && error.status" class="mb-2 text-caption">
        <strong>Status HTTP:</strong> {{ error.status }}
      </div>
    </template>
    
    <template v-if="showRetry">
      <VBtn
        variant="outlined"
        size="small"
        color="error"
        @click="$emit('retry')"
        class="mt-2"
      >
        <VIcon start>ri-refresh-line</VIcon>
        Réessayer
      </VBtn>
    </template>
  </VAlert>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  error: string | object | null
  title?: string
  showDetails?: boolean
  showRetry?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Une erreur est survenue',
  showDetails: false,
  showRetry: false,
})

const emit = defineEmits<{
  close: []
  retry: []
}>()

const isString = computed(() => typeof props.error === 'string')
const isObject = computed(() => typeof props.error === 'object' && props.error !== null)
</script>

<style scoped>
code {
  background-color: rgba(var(--v-theme-error), 0.1);
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 0.875em;
}

ul {
  list-style-type: disc;
  margin-left: 1.2rem;
}
</style>