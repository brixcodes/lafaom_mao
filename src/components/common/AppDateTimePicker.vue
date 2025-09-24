<template>
  <VTextField
    v-model="dateValue"
    :label="label"
    :placeholder="placeholder"
    :prepend-inner-icon="prependInnerIcon"
    :rules="rules"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    variant="outlined"
    density="comfortable"
    type="date"
    :min="computedMin"
    :max="computedMax"
    @update:model-value="handleDateChange"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue?: string | null
  label?: string
  placeholder?: string
  prependInnerIcon?: string
  rules?: Array<(value: any) => boolean | string>
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  min?: string
  max?: string
  format?: 'date' | 'datetime'
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Date',
  placeholder: 'Sélectionnez une date',
  format: 'date'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

// Computed values
const dateValue = ref<string>('')
const computedMin = computed(() => props.min || '')
const computedMax = computed(() => props.max || '')

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    // Format the date for the input (YYYY-MM-DD)
    const date = new Date(newValue)
    if (!isNaN(date.getTime())) {
      dateValue.value = date.toISOString().split('T')[0]
    }
  } else {
    dateValue.value = ''
  }
}, { immediate: true })

// Handle date change
const handleDateChange = (value: string) => {
  if (value) {
    // Convert to ISO string for consistency
    const date = new Date(value)
    if (!isNaN(date.getTime())) {
      const isoString = props.format === 'datetime' 
        ? date.toISOString() 
        : date.toISOString().split('T')[0]
      emit('update:modelValue', isoString)
    }
  } else {
    emit('update:modelValue', null)
  }
}
</script>

<style scoped>
/* Custom styles if needed */
</style>
