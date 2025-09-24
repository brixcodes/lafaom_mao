<template>
  <div class="quill-editor-wrapper">
    <QuillEditor 
      :ref="editorRef"
      v-model:content="content"
      :options="editorOptions"
      :placeholder="placeholder"
      content-type="html"
      class="quill-editor"
      :class="{ 'has-toolbar': showToolbar }"
      @ready="onEditorReady"
      @change="onContentChange"
      @blur="onBlur"
      @focus="onFocus"
      @textChange="onTextChange"
    />
    
    <!-- Messages d'erreur -->
    <div v-if="errorMessages && errorMessages.length > 0" class="v-messages v-messages--active v-messages--error mt-1">
      <div v-for="error in errorMessages" :key="error" class="v-messages__message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'

interface Props {
  modelValue?: string
  placeholder?: string
  theme?: 'snow' | 'bubble'
  errorMessages?: string | string[]
  minHeight?: string
  maxHeight?: string
  editorId?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  theme: 'bubble',
  errorMessages: undefined,
  minHeight: '80px',
  maxHeight: '200px',
  editorId: () => `quill-${Math.random().toString(36).substr(2, 9)}`
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const content = ref(props.modelValue)
const editorRef = ref()
const quillInstance = ref<any>(null)
const showToolbar = computed(() => props.theme === 'snow')

// Configuration de l'éditeur selon le thème
const editorOptions = computed(() => ({
  theme: props.theme,
  modules: {
    toolbar: props.theme === 'snow' ? [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['clean']
    ] : [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }]
    ]
  },
  formats: [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'clean'
  ],
  placeholder: props.placeholder
}))

// Gestion des changements de contenu
const onContentChange = (data: any) => {
  const htmlContent = data.html || ''
  console.log(`📝 QuillEditor ${props.editorId} content changed:`, htmlContent)
  content.value = htmlContent
  console.log(`📝 Emitting update:modelValue for ${props.editorId} with:`, htmlContent)
  emit('update:modelValue', htmlContent)
}

const onTextChange = (quill: any) => {
  console.log(`🎨 QuillEditor ${props.editorId} text change - quill instance:`, quill)
  if (quill && quill.root) {
    const htmlContent = quill.root.innerHTML || ''
    console.log(`🎨 Text change HTML content:`, htmlContent)
    content.value = htmlContent
    emit('update:modelValue', htmlContent)
  }
}

const onBlur = (quill: any) => {
  console.log(`🔵 QuillEditor ${props.editorId} blur - quill:`, quill)
  if (quill && quill.root) {
    const htmlContent = quill.root.innerHTML || ''
    console.log(`🔵 Blur HTML content:`, htmlContent)
    content.value = htmlContent
    emit('update:modelValue', htmlContent)
  }
}

const onFocus = (quill: any) => {
  console.log(`🔴 QuillEditor ${props.editorId} focus - quill:`, quill)
  if (quill && quill.root) {
    console.log(`🔴 Focus HTML content:`, quill.root.innerHTML)
  }
}

// Callback quand l'éditeur est prêt
const onEditorReady = (quill: any) => {
  // L'éditeur est maintenant prêt
  console.log(`Éditeur Quill ${props.editorId} prêt (thème: ${props.theme})`, quill)
  
  // Stocker l'instance Quill pour les autres méthodes
  quillInstance.value = quill
  
  // S'assurer que le contenu initial est défini
  if (props.modelValue && props.modelValue !== quill.root.innerHTML) {
    quill.root.innerHTML = props.modelValue
  }
  
  // Force la mise à jour du contenu pour éviter la perte lors des remontages
  if (content.value) {
    quill.clipboard.dangerouslyPasteHTML(content.value)
  }
  
  // Ajouter un gestionnaire direct sur l'instance Quill pour capturer tous les changements
  quill.on('text-change', () => {
    const htmlContent = quill.root.innerHTML || ''
    console.log(`🔥 Direct Quill text-change for ${props.editorId}:`, htmlContent)
    content.value = htmlContent
    emit('update:modelValue', htmlContent)
  })
}

// Synchronisation avec modelValue - amélioration
watch(() => props.modelValue, (newValue) => {
  console.log(`🔄 QuillEditor ${props.editorId} modelValue changed:`, newValue)
  if (newValue !== content.value) {
    content.value = newValue || ''
    console.log(`🔄 Content updated to:`, content.value)
  }
}, { immediate: true })

// Watcher sur content pour debug
watch(() => content.value, (newValue) => {
  console.log(`📊 QuillEditor ${props.editorId} internal content changed:`, newValue)
})
</script>

<style scoped>
.quill-editor-wrapper {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 4px;
  background: rgb(var(--v-theme-surface));
  overflow: hidden;
}

.quill-editor {
  min-height: v-bind(minHeight);
  max-height: v-bind(maxHeight);
}

:deep(.ql-editor) {
  min-height: v-bind(minHeight);
  max-height: v-bind(maxHeight);
  overflow-y: auto;
  padding: 12px 16px;
  font-size: 16px;
  line-height: 1.5;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}

:deep(.ql-editor.ql-blank::before) {
  color: rgba(var(--v-theme-on-surface), var(--v-disabled-opacity));
  font-style: normal;
}

:deep(.ql-toolbar) {
  border: none;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgba(var(--v-theme-surface), 0.5);
  padding: 8px;
}

:deep(.ql-toolbar .ql-stroke) {
  stroke: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

:deep(.ql-toolbar .ql-fill) {
  fill: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

:deep(.ql-toolbar .ql-picker-label) {
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

:deep(.ql-container) {
  border: none;
  font-family: inherit;
}

/* Messages d'erreur */
.v-messages--error .v-messages__message {
  color: rgb(var(--v-theme-error));
  font-size: 12px;
  padding-left: 16px;
}

/* Thème bubble - toolbar contextuelle */
.quill-editor:not(.has-toolbar) :deep(.ql-toolbar) {
  /* La toolbar bubble apparaît automatiquement lors de la sélection */
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Force l'affichage du contenu pour les éditeurs bubble */
.quill-editor:not(.has-toolbar) :deep(.ql-container) {
  min-height: v-bind(minHeight);
  border: none;
}

/* S'assurer que l'éditeur bubble est cliquable */
.quill-editor:not(.has-toolbar) :deep(.ql-editor) {
  cursor: text;
}

/* Styles pour les listes */
:deep(.ql-editor ul) {
  padding-left: 24px;
}

:deep(.ql-editor ol) {
  padding-left: 24px;
}

:deep(.ql-editor li) {
  margin: 4px 0;
}

:deep(.ql-editor strong) {
  font-weight: 600;
}

:deep(.ql-editor em) {
  font-style: italic;
}

:deep(.ql-editor u) {
  text-decoration: underline;
}
</style>