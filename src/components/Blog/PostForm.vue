<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { showToast } from '@/components/toast/toastManager.js'
import {
  validateRequired,
  validateMinLength,
  validateMaxLength,
} from '@/utils/validation'
import TagInput from './TagInput.vue'

const props = defineProps({
  modelValue: Object,
  categories: Array,
})

const emit = defineEmits(['update:modelValue', 'submit'])

const form = ref({ ...props.modelValue })

// Surveiller les changements du modelValue pour mettre à jour le formulaire
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    console.log('[DEBUG] modelValue mis à jour:', newVal)
    // Utiliser Object.assign pour s'assurer que toutes les propriétés sont correctement copiées
    Object.assign(form.value, newVal)
  }
}, { deep: true, immediate: true })

const errors = ref<Record<string, string>>({})
const previewUrl = ref<string | null>(null)

// Surveiller les changements d'image
watch(() => form.value.cover_image, file => {
  if (file instanceof File) {
    previewUrl.value = URL.createObjectURL(file)
    return
  }
  previewUrl.value = null
})

// Surveiller l'URL de l'image existante
watch(() => form.value.cover_image_url, url => {
  if (url && typeof url === 'string') {
    previewUrl.value = url
  }
})

// Initialiser l'URL de prévisualisation si une image existe déjà
onMounted(() => {
  if (form.value.cover_image_url && typeof form.value.cover_image_url === 'string') {
    previewUrl.value = form.value.cover_image_url
    console.log('[DEBUG] Image URL chargée:', form.value.cover_image_url)
  }
})

function validateField(field: string) {
  if (field === 'cover_image') {
    const file = form.value.cover_image
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/bmp']
      if (!allowedTypes.includes(file.type)) {
        errors.value.cover_image = 'Format accepté : jpg, jpeg, bmp.'
        return
      }
      const maxSize = 10 * 1024 * 1024 // 10Mo
      if (file.size > maxSize) {
        errors.value.cover_image = 'Taille maximale : 10Mo.'
        return
      }
      errors.value.cover_image = ''
    }
    errors.value.cover_image = ''
  }

  if (form.value.backendErrors && form.value.backendErrors[field]) {
    errors.value[field] = form.value.backendErrors[field]
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
          errors.value.title = minRes.error!
        } else {
          const maxRes = validateMaxLength(form.value.title, 100, 'Titre')
          errors.value.title = maxRes.valid ? '' : maxRes.error!
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
        errors.value.summary = minRes.valid ? '' : minRes.error!
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
  return Object.values(errors.value).every(e => !e)
}

// Validation réactive
watch(() => form.value.author_name, () => validateField('author_name'))
watch(() => form.value.title, () => validateField('title'))
watch(() => form.value.category_id, () => validateField('category_id'))
watch(() => form.value.summary, () => validateField('summary'))
watch(() => form.value.cover_image, () => validateField('cover_image'))

const isSubmitting = ref(false)
const handleSubmit = async () => {
  if (!validateForm()) {
    showToast({ message: 'Veuillez corriger les erreurs du formulaire.', type: 'error' });
    return;
  }

  if (!form.value.author_name || !form.value.title || !form.value.category_id) {
    showToast({ message: 'Tous les champs obligatoires doivent être remplis.', type: 'error' });
    return;
  }

  if (form.value.cover_image && !(form.value.cover_image instanceof File)) {
    showToast({ message: "L'image de couverture doit être un fichier valide.", type: 'error' });
    return;
  }

  if (typeof form.value.category_id !== 'number' || isNaN(form.value.category_id)) {
    showToast({ message: 'La catégorie doit être sélectionnée.', type: 'error' });
    return;
  }

  isSubmitting.value = true;
  const formData = new FormData();
  formData.append('author_name', form.value.author_name);
  formData.append('title', form.value.title);
  if (form.value.cover_image instanceof File) {
    formData.append('cover_image', form.value.cover_image);
  } else if (form.value.cover_image_url) {
    formData.append('cover_image_url', form.value.cover_image_url);
  }
  formData.append('section_style', form.value.section_style || '');
  if (form.value.summary) formData.append('summary', form.value.summary);
  if (form.value.tags && Array.isArray(form.value.tags)) {
    formData.append('tags', JSON.stringify(form.value.tags)); // Assurez-vous que tags est un tableau
  }
  formData.append('category_id', form.value.category_id.toString());

  // Débogage : Afficher le contenu du FormData
  for (const [key, value] of formData.entries()) {
    console.log(`[DEBUG] FormData from PostForm: ${key}=${value}`);
  }

  console.log('[DEBUG] Soumission du formulaire avec les données:', {
    author_name: form.value.author_name,
    title: form.value.title,
    cover_image: form.value.cover_image instanceof File ? 'Fichier présent' : 'Pas de fichier',
    cover_image_url: form.value.cover_image_url || 'Aucune URL',
    category_id: form.value.category_id,
    tags: form.value.tags,
  });

  emit('submit', formData);
  setTimeout(() => { isSubmitting.value = false }, 1200);
};
const coverImageInput = ref<any>(null)

function triggerFileInput() {
  if (coverImageInput.value && typeof coverImageInput.value.click === 'function') {
    coverImageInput.value.click()
  }
}
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
                  {{categories.find(c => c.id === form.category_id)?.title || 'Catégorie sélectionnée'}}
                </VChip>
              </div>
            </VCol>

            <VCol cols="12">
              <VTextarea v-model="form.summary" label="Résumé" clearable prepend-inner-icon="ri-align-left"
                :error-messages="errors.summary" rows="4" />
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

            <!-- Actions -->
            <VCol cols="12">
              <slot name="actions">
                <VBtn color="primary" type="submit" :loading="isSubmitting" class="modern-submit-btn">
                  <span v-if="!isSubmitting">Enregistrer</span>
                  <span v-else>Enregistrement...</span>
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
  background: #fff;
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
</style>
