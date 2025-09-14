<template>
  <VTextField
    v-model="input"
    :label="label"
    clearable
    prepend-inner-icon="ri-price-tag-3-line"
    @keydown.enter.prevent="addTag"
    @blur="addTag"
    @input="onInput"
  >
    <template #append>
      <VBtn icon="ri-add-line"  @click="addTag" />
    </template>
    <template #details>
      <div class="d-flex flex-wrap gap-2 mt-2">
        <VChip
          v-for="(tag, idx) in tags"
          :key="tag + idx"
          color="primary"
          size="small"
          closable
          @click:close="removeTag(idx)"
        >{{ tag }}</VChip>
      </div>
    </template>
  </VTextField>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  label: {
    type: String,
    default: 'Tags',
  },
})
const emit = defineEmits(['update:modelValue'])

const tags = ref<string[]>([...props.modelValue])
const input = ref('')

watch(() => props.modelValue, val => {
  tags.value = [...val]
})

function addTag() {
  const value = input.value.trim()
  if (value && !tags.value.includes(value)) {
    tags.value.push(value)
    emit('update:modelValue', tags.value)
  }
  input.value = ''
}
function removeTag(idx: number) {
  tags.value.splice(idx, 1)
  emit('update:modelValue', tags.value)
}
function onInput(e: any) {
  if (e.inputType === 'insertText' && e.data === ',') {
    addTag()
  }
}
</script>

<style scoped>
/* Chips and input styling */
</style>
