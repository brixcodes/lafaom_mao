<template>
  <div>
    <div v-for="editor in editors" :key="editor.key" class="mb-4">
      <h3>{{ editor.label }}</h3>
      <QuillEditor v-model="editor.content" theme="bubble" :placeholder="editor.placeholder"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'

interface EditorItem {
  key: string
  label: string
  placeholder?: string
  content: string
}

const props = defineProps<{
  modelValue: Record<string, string>
  fields: { key: string; label: string; placeholder?: string }[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, string>): void
}>()

// Initialisation du tableau réactif
const editors = ref<EditorItem[]>(
  props.fields.map(f => ({
    ...f,
    content: props.modelValue[f.key] || ''
  }))
)

// Synchronisation interne -> parent
watch(
  editors,
  (newVal) => {
    const values: Record<string, string> = {}
    newVal.forEach(e => (values[e.key] = e.content))
    emit('update:modelValue', values)
  },
  { deep: true }
)

// Synchronisation parent -> interne
watch(
  () => props.modelValue,
  (newVal) => {
    editors.value.forEach(e => {
      e.content = newVal[e.key] || ''
    })
  },
  { deep: true }
)
</script>

<style scoped>
.ql-editor {
  min-height: 100px;
  max-height: 150px;
  overflow-y: auto;
}
</style>
