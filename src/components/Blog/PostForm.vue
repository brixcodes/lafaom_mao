<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'
import {
  validateRequired,
  validateMinLength,
  validateMaxLength,
} from '@/utils/validation'
import TagInput from './TagInput.vue'
import QuillEditor from '@/components/common/QuillEditor.vue'

const props = defineProps({
  modelValue: Object,
  categories: Array,
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'success', 'error'])

const form = ref({
  author_name: '',
  title: '',
  cover_image: null,
  cover_image_url: '',
  section_style: 'Normal',
  summary: '',
  tags: [],
  category_id: null,
  backendErrors: {}
})

// Surveiller les changements du modelValue pour mettre à jour le formulaire
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    console.log('[DEBUG] modelValue mis à jour:', newVal)
    console.log('[DEBUG] Valeurs avant assignation:', {
      author_name: newVal.author_name,
      title: newVal.title,
      category_id: newVal.category_id,
      cover_image_url: newVal.cover_image_url
    })
    // Copier les propriétés une par une pour éviter les problèmes de référence
    form.value.author_name = newVal.author_name || ''
    form.value.title = newVal.title || ''
    form.value.cover_image = newVal.cover_image || null
    form.value.section_style = newVal.section_style || 'Normal'
    form.value.summary = newVal.summary || ''
    form.value.tags = newVal.tags || []
    form.value.category_id = newVal.category_id || null
    form.value.cover_image_url = newVal.cover_image_url || ''
    form.value.backendErrors = newVal.backendErrors || {}
    console.log('[DEBUG] Valeurs après assignation:', {
      author_name: form.value.author_name,
      title: form.value.title,
      category_id: form.value.category_id,
      cover_image_url: form.value.cover_image_url
    })
  }
}, { deep: true, immediate: true })

// Émettre les changements du formulaire vers le parent
watch(form, (newVal) => {
  emit('update:modelValue', { ...newVal })
}, { deep: true })

// Watchers pour validation automatique des champs
watch(() => form.value.author_name, () => {
  if (form.value.author_name) {
    validateField('author_name')
  }
})

watch(() => form.value.title, () => {
  if (form.value.title) {
    validateField('title')
  }
})

watch(() => form.value.category_id, () => {
  if (form.value.category_id) {
    validateField('category_id')
  }
})

watch(() => form.value.summary, () => {
  if (form.value.summary) {
    validateField('summary')
  }
})


// Watcher pour nettoyer les erreurs backend quand le formulaire change
watch(() => form.value.backendErrors, (newErrors) => {
  if (newErrors && Object.keys(newErrors).length > 0) {
    console.log('[DEBUG] Erreurs backend détectées:', newErrors)
    // Nettoyer les erreurs backend après un délai pour permettre à l'utilisateur de les voir
    setTimeout(() => {
      form.value.backendErrors = {}
    }, 5000)
  }
}, { deep: true })

const errors = ref<Record<string, string>>({})
const previewUrl = ref<string | null>(null)

// Surveiller les changements d'image
watch(() => form.value.cover_image, file => {
  if (file instanceof File) {
    previewUrl.value = URL.createObjectURL(file)
    // Valider l'image quand elle est ajoutée
    validateField('cover_image')
    return
  }
  previewUrl.value = null
  // Nettoyer l'erreur si l'image est supprimée
  if (errors.value.cover_image) {
    errors.value.cover_image = ''
  }
})

// Surveiller l'URL de l'image existante
watch(() => form.value.cover_image_url, (newUrl) => {
  if (newUrl && typeof newUrl === 'string' && newUrl !== previewUrl.value) {
    previewUrl.value = newUrl
    console.log('[DEBUG] Image URL mise à jour:', newUrl)
  }
}, { immediate: true })

// Initialiser l'URL de prévisualisation si une image existe déjà
onMounted(() => {
  if (form.value.cover_image_url && typeof form.value.cover_image_url === 'string') {
    previewUrl.value = form.value.cover_image_url
    console.log('[DEBUG] Image URL chargée au montage:', form.value.cover_image_url)
  }
})

function validateField(field: string) {
  // Nettoyer d'abord l'erreur backend si elle existe
  if (form.value.backendErrors && form.value.backendErrors[field]) {
    delete form.value.backendErrors[field]
  }

  if (field === 'cover_image') {
    const file = form.value.cover_image
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/bmp']
      if (!allowedTypes.includes(file.type)) {
        errors.value.cover_image = 'Format accepté : JPG, JPEG, BMP uniquement.'
        return
      }
      const maxSize = 10 * 1024 * 1024 // 10Mo
      if (file.size > maxSize) {
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(1)
        errors.value.cover_image = `Taille maximale : 10Mo (actuel : ${sizeInMB}Mo).`
        return
      }
      // Si tout est OK, nettoyer l'erreur
      errors.value.cover_image = ''
    } else {
      // Pas de fichier, nettoyer l'erreur
      errors.value.cover_image = ''
    }
  }

  switch (field) {
    case 'author_name': {
      const res = validateRequired(form.value.author_name, 'Auteur')
      errors.value.author_name = res.valid ? '' : res.error!
      break
    }
    case 'title': {
      const res = validateRequired(form.value.title, 'Titre')
      if (!res.valid) {
        errors.value.title = res.error!
      } else {
        const minRes = validateMinLength(form.value.title, 3, 'Titre')
        if (!minRes.valid) {
          errors.value.title = `${minRes.error!} (minimum 3 caractères)`
        } else {
          const maxRes = validateMaxLength(form.value.title, 100, 'Titre')
          errors.value.title = maxRes.valid ? '' : `${maxRes.error!} (maximum 100 caractères)`
        }
      }
      break
    }
    case 'category_id': {
      const res = validateRequired(form.value.category_id, 'Catégorie')
      errors.value.category_id = res.valid ? '' : res.error!
      break
    }
    case 'summary': {
      if (form.value.summary) {
        const minRes = validateMinLength(form.value.summary, 10, 'Résumé')
        errors.value.summary = minRes.valid ? '' : `${minRes.error!} (minimum 10 caractères)`
      } else {
        errors.value.summary = ''
      }
      break
    }
    default:
      break
  }
}

function validateForm() {
  validateField('author_name')
  validateField('title')
  validateField('category_id')
  validateField('summary')
  validateField('cover_image')
  
  const isValid = Object.values(errors.value).every(e => !e)
  
  // Si le formulaire est valide, nettoyer les erreurs backend
  if (isValid) {
    form.value.backendErrors = {}
  }
  
  return isValid
}

// Validation réactive (déjà définie plus haut)

const isSubmitting = ref(false)
const handleSubmit = async () => {
  if (!validateForm()) {
    showToast({ 
      message: 'Veuillez corriger les erreurs.', 
      type: 'error'
    })
    return
  }

  // Vérifier les champs obligatoires (sauf l'image qui peut être déjà existante)
  if (!form.value.author_name || !form.value.title || !form.value.category_id) {
    showToast({ 
      message: 'Tous les champs obligatoires doivent être remplis.', 
      type: 'error'
    })
    return
  }

  // Vérifier l'image uniquement si elle est fournie
  if (form.value.cover_image && !(form.value.cover_image instanceof File)) {
    showToast({ 
      message: 'L\'image de couverture doit être un fichier valide.', 
      type: 'error'
    })
    return
  }

  if (typeof form.value.category_id !== 'number' || isNaN(form.value.category_id)) {
    showToast({ 
      message: 'Veuillez sélectionner une catégorie.', 
      type: 'error'
    })
    return
  }

  // Confirmation avant soumission
  const confirmed = await confirmAction({
    title: 'Êtes vous sûres?',
    html: `Souhaitez vous réelement enregistrer l'actualitée <b>${form.value.title}</b> ?`,
    confirmButtonText: '<span style="color:white">Enregistrer</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })

  if (!confirmed) {
    showToast({ 
      message: 'Enregistrement annulé.', 
      type: 'warning'
    })
    return
  }

  isSubmitting.value = true

  const formData = new FormData()
  formData.append('author_name', form.value.author_name)
  formData.append('title', form.value.title)

  // Ajouter l'image uniquement si elle est fournie
  if (form.value.cover_image instanceof File) {
    formData.append('cover_image', form.value.cover_image)
  }

  formData.append('section_style', form.value.section_style || '')
  if (form.value.summary) formData.append('summary', form.value.summary)
  if (form.value.tags) formData.append('tags', JSON.stringify(form.value.tags))
  formData.append('category_id', form.value.category_id.toString())

  console.log('[DEBUG] Soumission du formulaire avec les données:', {
    author_name: form.value.author_name,
    title: form.value.title,
    cover_image: form.value.cover_image instanceof File ? 'Fichier présent' : 'Pas de fichier',
    category_id: form.value.category_id
  })
  
  console.log('[DEBUG] Valeurs complètes du formulaire:', form.value)

  emit('submit', formData)
  setTimeout(() => { isSubmitting.value = false }, 1200)
}

const coverImageInput = ref<any>(null)

function triggerFileInput() {
  if (coverImageInput.value && typeof coverImageInput.value.click === 'function') {
    coverImageInput.value.click()
  }
}

// Fonction pour gérer les réponses de succès
function handleSuccess(message?: string) {
  const successMessage = message || (props.isEditing ? 'Article modifié avec succès' : 'Article créé avec succès')
  showToast({ 
    message: successMessage, 
    type: 'success'
  })
  emit('success', { message: successMessage })
}

// Fonction pour gérer les erreurs
function handleError(message?: string) {
  const errorMessage = message || (props.isEditing ? 'Erreur lors de la modification' : 'Erreur lors de la création')
  showToast({ 
    message: errorMessage, 
    type: 'error'
  })
  emit('error', { message: errorMessage })
}

// Exposer les fonctions pour utilisation par le composant parent
defineExpose({
  handleSuccess,
  handleError,
  validateForm,
  form
})
</script>

<template>
  <VContainer>
    <VCard elevation="2" class="pa-6 modern-form-card">
      <VCardText>
        <VForm @submit.prevent="handleSubmit">
          <VRow>
            <!-- Image upload section -->
            <VCol cols="12" md="6" class="image-upload-section">
              <div class="image-upload-container">
                <div v-if="previewUrl" class="image-preview-container">
                  <VImg :src="previewUrl" height="300" class="image-preview" cover />
                  <div class="image-overlay">
                    <VBtn icon="ri-edit-line" variant="tonal" color="primary" @click="triggerFileInput">
                      <VIcon>ri-edit-line</VIcon>
                    </VBtn>
                  </div>
                </div>
                <div v-else class="image-placeholder">
                  <VIcon size="64" color="primary" class="mb-2">ri-image-add-line</VIcon>
                  <div class="text-h6 mb-2">Image de couverture</div>
                  <div class="text-body-2 text-medium-emphasis mb-4">Formats acceptés: JPG, JPEG, BMP (max 10Mo)</div>
                  <VBtn color="primary" prepend-icon="ri-upload-2-line" @click="triggerFileInput">
                    Sélectionner une image
                  </VBtn>
                </div>

                <VFileInput v-model="form.cover_image" ref="coverImageInput" label="Image de couverture"
                  accept="image/jpeg,image/jpg,image/bmp" prepend-inner-icon="ri-camera-2-line"
                  :error-messages="errors.cover_image" show-size counter chips class="d-none" />

                <div v-if="form.backendErrors && form.backendErrors.cover_image" class="text-error mt-1">{{
                  form.backendErrors.cover_image }}</div>
              </div>
            </VCol>

            <!-- Informations du post -->
            <VCol cols="12" md="6">
              <VTextField v-model="form.author_name" label="Auteur" required clearable prepend-inner-icon="ri-user-line"
                :error-messages="errors.author_name" />
              <div v-if="form.backendErrors && form.backendErrors.author_name" class="text-error mt-1">{{
                form.backendErrors.author_name }}</div>

              <VTextField v-model="form.title" label="Titre" required clearable prepend-inner-icon="ri-book-2-line"
                :error-messages="errors.title" class="mt-4" />
              <div v-if="form.backendErrors && form.backendErrors.title" class="text-error mt-1">{{
                form.backendErrors.title }}</div>

              <VTextField v-model="form.section_style" label="Style de section" readonly
                prepend-inner-icon="ri-paint-brush-line" class="mt-4" />

              <VSelect v-model="form.category_id" :items="categories" item-title="title" item-value="id"
                label="Catégorie" required :error-messages="errors.category_id" prepend-inner-icon="ri-folder-line"
                variant="outlined" density="comfortable" :loading="!categories || categories.length === 0"
                :disabled="!categories || categories.length === 0"
                :hint="!categories || categories.length === 0 ? 'Chargement des catégories...' : ''" persistent-hint
                class="mt-4" />
              <div v-if="form.backendErrors && form.backendErrors.category_id" class="text-error mt-1">{{
                form.backendErrors.category_id }}</div>
              <div v-if="form.category_id" class="mt-2">
                <VChip color="primary" size="small" variant="tonal">
                  {{(categories as any[])?.find((c: any) => c.id === form.category_id)?.title || 'Catégorie sélectionnée'}}
                </VChip>
              </div>
            </VCol>

            <VCol cols="12">
              <div class="mb-2">
                <label class="text-body-2 text-medium-emphasis">Résumé</label>
              </div>
              <QuillEditor 
                v-model="form.summary" 
                editor-id="summary-editor"
                theme="snow"
                placeholder="Rédigez le résumé de votre article..."
                class="quill-editor-custom"
              />
              <div v-if="errors.summary" class="text-error mt-1">{{ errors.summary }}</div>
              <div v-if="form.backendErrors && form.backendErrors.summary" class="text-error mt-1">{{
                form.backendErrors.summary }}</div>
            </VCol>


            <VCol cols="12">
              <TagInput v-model="form.tags" label="Tags" />
              <div v-if="form.tags && form.tags.length" class="mt-2 d-flex flex-wrap gap-1">
                <VChip v-for="tag in form.tags" :key="tag" color="secondary" size="small" variant="tonal">{{ tag }}
                </VChip>
              </div>
            </VCol>

            <!-- Indicateur de progression -->
            <VCol v-if="isSubmitting" cols="12">
              <VAlert type="info" variant="tonal" class="mb-4">
                <template #prepend>
                  <VIcon icon="ri-loader-4-line" class="ri-loader-4-line" />
                </template>
                <div>
                  <strong>Traitement en cours...</strong>
                  <div class="text-caption mt-1">
                    {{ isEditing ? 'Modification de votre article en cours' : 'Création de votre article en cours' }}
                  </div>
                </div>
              </VAlert>
            </VCol>

            <!-- Actions -->
            <VCol cols="12">
              <slot name="actions">
                <VBtn color="primary" type="submit" :loading="isSubmitting" class="modern-submit-btn" :disabled="!form.author_name || !form.title || !form.category_id">
                  <VIcon v-if="!isSubmitting" class="me-2">{{ isEditing ? 'ri-edit-line' : 'ri-save-line' }}</VIcon>
                  <VIcon v-else class="me-2 ri-loader-4-line"></VIcon>
                  <span v-if="!isSubmitting">{{ isEditing ? 'Modifier l\'article' : 'Créer l\'article' }}</span>
                  <span v-else>{{ isEditing ? 'Modification en cours...' : 'Création en cours...' }}</span>
                </VBtn>
              </slot>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VContainer>
</template>


<style scoped>
.v-card {
  transition: all 0.2s ease;
}

.v-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
}

.v-text-field,
.v-textarea,
.v-file-input {
  margin-bottom: 8px;
}

.v-btn {
  text-transform: none;
  font-weight: 500;
}

/* Modern, clean form styles */
.modern-form-card {
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(60, 60, 60, 0.08);
}

.modern-submit-btn {
  min-width: 160px;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 8px;
  transition: background 0.2s;
}

.modern-submit-btn:active {
  background: #1976d2 !important;
  color: #fff !important;
}

.rounded-circle {
  border-radius: 50%;
}

.text-error {
  color: #d32f2f;
}

/* Styles pour la section d'image */
.image-upload-section {
  display: flex;
  flex-direction: column;
}

.image-upload-container {
  height: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px dashed rgba(25, 118, 210, 0.2);
  border-radius: 12px;
  padding: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.image-upload-container:hover {
  border-color: rgba(25, 118, 210, 0.5);
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  width: 100%;
}

.image-preview-container {
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview-container:hover .image-overlay {
  opacity: 1;
}

/* Animation pour l'icône de chargement */
.ri-loader-4-line {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Styles pour les messages d'aide */
.text-caption {
  font-size: 0.75rem;
  line-height: 1.25;
}

/* Amélioration des alertes */
.v-alert {
  border-radius: 8px;
  border-left: 4px solid;
}

.v-alert--info {
  border-left-color: #2196f3;
}

/* Styles pour QuillEditor personnalisé */
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
