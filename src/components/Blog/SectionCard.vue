<template>
  <VCard class="section-card mb-4" elevation="2" :class="{ 'editing-mode': isEditing }">
    <!-- Header avec actions -->
    <VCardTitle class="d-flex align-center justify-space-between pa-3">
      <div class="d-flex align-center">
        <VIcon color="primary" class="me-2">ri-file-text-line</VIcon>
        <span class="text-h6">{{ section.title }}</span>
        <VChip size="small" color="primary" variant="tonal" class="ml-3">
          Position {{ section.position }}
        </VChip>
      </div>

      <div class="d-flex align-center gap-2">
        <!-- Boutons de réorganisation -->
        <VTooltip text="Monter">
          <template v-slot:activator="{ props }" v-if="hasPermissions([PermissionEnum.CAN_UPDATE_BLOG])">
            <VBtn v-bind="props" icon="ri-arrow-up-line" size="small" variant="text" :disabled="isFirst"
              @click="$emit('move-up')" />
          </template>
        </VTooltip>

        <VTooltip text="Descendre">
          <template v-slot:activator="{ props }" v-if="hasPermissions([PermissionEnum.CAN_UPDATE_BLOG])">
            <VBtn v-bind="props" icon="ri-arrow-down-line" size="small" variant="text" :disabled="isLast"
              @click="$emit('move-down')" />
          </template>
        </VTooltip>

        <VDivider vertical class="mx-1" />

        <!-- Actions principales -->
        <VTooltip text="Modifier">
          <template v-slot:activator="{ props }" v-if="hasPermissions([PermissionEnum.CAN_UPDATE_BLOG])">
            <VBtn v-bind="props" icon="ri-edit-line" size="small" variant="text" color="primary" @click="startEdit" />
          </template>
        </VTooltip>

        <VTooltip text="Supprimer">
          <template v-slot:activator="{ props }" v-if="hasPermissions([PermissionEnum.CAN_DELETE_BLOG])">
            <VBtn v-bind="props" icon="ri-delete-bin-line" size="small" variant="text" color="error"
              @click="$emit('delete')" />
          </template>
        </VTooltip>
      </div>
    </VCardTitle>

    <VDivider />

    <!-- Contenu ou Formulaire d'édition -->
    <VCardText class="pa-3" v-if="hasPermissions([PermissionEnum.CAN_UPDATE_BLOG])">
      <template v-if="!isEditing">
        <!-- Mode affichage -->
        <div v-if="section.cover_image" class="mb-3">
          <VImg :src="section.cover_image" height="200" cover class="section-image" />
        </div>

        <div class="section-content" v-html="formatContent(section.content)" />
      </template>

      <template v-else>
        <!-- Mode édition -->
        <VForm @submit.prevent="handleUpdate">
          <VTextField v-model="editForm.title" label="Titre de la section" variant="outlined"
            :error-messages="editErrors.title" class="mb-3" />

          <VFileInput v-model="editForm.cover_image" label="Image de couverture (optionnelle)" accept="image/*"
            variant="outlined" prepend-icon="" prepend-inner-icon="ri-image-line"
            :error-messages="editErrors.cover_image" class="mb-3" />

          <div class="mb-3">
            <label class="text-body-2 text-medium-emphasis mb-2 d-block">Contenu</label>
            <QuillEditor v-model="editForm.content" editor-id="section-edit-content-editor" theme="snow"
              placeholder="Rédigez le contenu de votre section..." class="quill-editor-custom" />
            <div v-if="editErrors.content" class="text-error mt-1">{{ editErrors.content }}</div>
          </div>

          <VTextField v-model.number="editForm.position" label="Position" type="number" variant="outlined" min="1"
            :error-messages="editErrors.position" class="mb-4" />

          <div class="d-flex gap-2 justify-end">
            <VBtn variant="outlined" @click="cancelEdit" :disabled="isUpdating">
              Annuler
            </VBtn>
            <VBtn type="submit" color="primary" :loading="isUpdating">
              Sauvegarder
            </VBtn>
          </div>
        </VForm>
      </template>
    </VCardText>

    <!-- Footer avec métadonnées -->
    <VCardActions v-if="!isEditing && hasPermissions([PermissionEnum.CAN_VIEW_BLOG])" class="pa-3 pt-0" >
      <VChip size="small" variant="tonal" prepend-icon="ri-calendar-line">
        {{ formatDate(section.created_at) }}
      </VChip>

      <VSpacer />

      <VChip v-if="section.updated_at !== section.created_at" size="small" variant="tonal" color="warning"
        prepend-icon="ri-pencil-line">
        Modifié {{ formatDate(section.updated_at) }}
      </VChip>
    </VCardActions>
  </VCard>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import QuillEditor from '@/components/common/QuillEditor.vue'
import type { PostSectionOut } from '@/types/blog'

import { PermissionEnum } from '@/types/permissions'
import { useInstantPermissions } from '@/composables/useInstantPermissions'
const { hasPermission, hasPermissions } = useInstantPermissions()

interface Props {
  section: PostSectionOut
  isFirst?: boolean
  isLast?: boolean
}

interface Emits {
  (e: 'update', data: any): void
  (e: 'delete'): void
  (e: 'move-up'): void
  (e: 'move-down'): void
}

const props = withDefaults(defineProps<Props>(), {
  isFirst: false,
  isLast: false,
})

const emit = defineEmits<Emits>()

const isEditing = ref(false)
const isUpdating = ref(false)

const editForm = reactive({
  title: '',
  content: '',
  position: 1,
  cover_image: null as File | null,
})

const editErrors = reactive({
  title: '',
  content: '',
  position: '',
  cover_image: '',
})

const startEdit = () => {
  editForm.title = props.section.title
  editForm.content = props.section.content
  editForm.position = props.section.position
  editForm.cover_image = null
  clearErrors()
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  clearErrors()
}

const clearErrors = () => {
  Object.keys(editErrors).forEach(key => {
    editErrors[key as keyof typeof editErrors] = ''
  })
}

const validateForm = () => {
  clearErrors()
  let isValid = true

  if (!editForm.title.trim()) {
    editErrors.title = 'Le titre est requis'
    isValid = false
  }

  if (!editForm.content.trim()) {
    editErrors.content = 'Le contenu est requis'
    isValid = false
  }

  if (editForm.position < 1) {
    editErrors.position = 'La position doit être un nombre positif'
    isValid = false
  }

  return isValid
}

const handleUpdate = async () => {
  if (!validateForm()) return

  isUpdating.value = true

  try {
    const updateData = {
      title: editForm.title,
      content: editForm.content,
      position: editForm.position,
      post_id: props.section.post_id,
      cover_image: editForm.cover_image,
    }

    await emit('update', updateData)
    isEditing.value = false
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
  } finally {
    isUpdating.value = false
  }
}

const formatContent = (content: string) => {
  // Simple formatage du contenu (remplacer les retours à la ligne par des <br>)
  return content.replace(/\n/g, '<br>')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<style scoped>
.section-card {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.section-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
}

.editing-mode {
  border: 2px solid rgb(var(--v-theme-primary));
}

.section-image {
  border-radius: 8px;
  overflow: hidden;
}

.section-content {
  line-height: 1.6;
  color: rgb(var(--v-theme-on-surface));
}

.section-content :deep(p) {
  margin-bottom: 1rem;
}

.section-content :deep(h1),
.section-content :deep(h2),
.section-content :deep(h3),
.section-content :deep(h4),
.section-content :deep(h5),
.section-content :deep(h6) {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.section-content :deep(ul),
.section-content :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.section-content :deep(li) {
  margin-bottom: 0.25rem;
}

.section-content :deep(blockquote) {
  border-left: 4px solid rgb(var(--v-theme-primary));
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  background-color: rgba(var(--v-theme-primary), 0.05);
  padding: 1rem;
  border-radius: 4px;
}

.section-content :deep(code) {
  background-color: rgba(var(--v-theme-primary), 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9em;
}

.section-content :deep(pre) {
  background-color: rgba(var(--v-theme-primary), 0.05);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1rem 0;
}

/* Styles pour QuillEditor */
.quill-editor-custom {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 4px;
  background-color: rgb(var(--v-theme-surface));
}

.quill-editor-custom :deep(.ql-toolbar) {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 4px 4px 0 0;
}

.quill-editor-custom :deep(.ql-container) {
  border: none;
  border-radius: 0 0 4px 4px;
  font-family: inherit;
}

.quill-editor-custom :deep(.ql-editor) {
  min-height: 120px;
  font-family: inherit;
  line-height: 1.5;
}

.quill-editor-custom :deep(.ql-editor.ql-blank::before) {
  font-style: normal;
  color: rgba(var(--v-theme-on-surface), 0.6);
}
</style>