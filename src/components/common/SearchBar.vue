<!-- Composant de recherche -->
<template>
  <div class="search-container">
    <VTextField
      v-model="searchQuery"
      :label="label"
      :placeholder="placeholder"
      :disabled="disabled"
      :loading="loading"
      prepend-inner-icon="ri-search-line"
      clearable
      variant="outlined"
      density="comfortable"
      hide-details
      @input="onSearch"
      @click:clear="onClear"
    />
    
    <VBtn
      v-if="showAdvancedButton"
      variant="outlined"
      prepend-icon="ri-filter-line"
      @click="toggleAdvanced"
    >
      {{ advancedButtonText }}
    </VBtn>
  </div>
  
  <!-- Panneau de recherche avancée -->
  <VExpansionPanels
    v-if="showAdvanced"
    v-model="advancedPanel"
    class="mt-4"
  >
    <VExpansionPanel>
      <VExpansionPanelTitle>
        <VIcon icon="ri-filter-line" class="me-2" />
        Recherche avancée
      </VExpansionPanelTitle>
      <VExpansionPanelText>
        <slot name="advanced-filters" />
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  debounceMs?: number
  showAdvancedButton?: boolean
  advancedButtonText?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'search', query: string): void
  (e: 'clear'): void
  (e: 'toggle-advanced'): void
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Rechercher',
  placeholder: 'Tapez pour rechercher...',
  disabled: false,
  loading: false,
  debounceMs: 300,
  showAdvancedButton: false,
  advancedButtonText: 'Filtres avancés'
})

const emit = defineEmits<Emits>()

const searchQuery = ref(props.modelValue || '')
const showAdvanced = ref(false)
const advancedPanel = ref<number[]>([])

let searchTimeout: NodeJS.Timeout | null = null

const onSearch = () => {
  emit('update:modelValue', searchQuery.value)
  
  // Debounce search
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    emit('search', searchQuery.value)
  }, props.debounceMs)
}

const onClear = () => {
  searchQuery.value = ''
  emit('update:modelValue', '')
  emit('clear')
}

const toggleAdvanced = () => {
  showAdvanced.value = !showAdvanced.value
  emit('toggle-advanced')
}

// Watch for external model value changes
watch(() => props.modelValue, (newValue) => {
  searchQuery.value = newValue || ''
})
</script>

<style scoped>
.search-container {
  display: flex;
  gap: 1rem;
  align-items: center;
}

@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
