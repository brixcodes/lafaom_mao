<template>
  <div class="article-form">
    <VCard class="article-form-card" elevation="3">
      <VCardTitle class="article-form-title">
        <VIcon icon="ri-article-line" class="me-2" />
        {{ isEditing ? 'Modifier l\'article' : 'Nouvel article' }}
      </VCardTitle>
      
      <VCardText>
        <VForm ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
          <VRow>
            <!-- Titre -->
            <VCol cols="12">
              <VTextField
                v-model="formData.title"
                :label="translateArticle('article_title')"
                :placeholder="translateArticle('article_form_title_placeholder')"
                :hint="translateArticle('article_form_title_hint')"
                :rules="titleRules"
                variant="outlined"
                density="comfortable"
                counter
                maxlength="200"
                required
              />
            </VCol>

            <!-- Auteur et Catégorie -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="formData.author_name"
                :label="translateArticle('article_author')"
                variant="outlined"
                density="comfortable"
                readonly
              />
            </VCol>

            <VCol cols="12" md="6">
              <VAutocomplete
                v-model="formData.category_id"
                :items="categories"
                item-title="title"
                item-value="id"
                :label="translateArticle('article_category')"
                prepend-inner-icon="ri-folder-line"
                variant="outlined"
                density="comfortable"
                clearable
                :loading="categoriesLoading"
              />
            </VCol>

            <!-- Tags -->
            <VCol cols="12">
              <VTextField
                v-model="formData.tags"
                :label="translateArticle('article_tags')"
                placeholder="Ex: technologie, web, développement..."
                prepend-inner-icon="ri-price-tag-3-line"
                variant="outlined"
                density="comfortable"
                hint="Séparez les tags par des virgules"
                persistent-hint
              />
            </VCol>

            <!-- Contenu -->
            <VCol cols="12">
              <VTextarea
                v-model="formData.content"
                :label="translateArticle('article_content')"
                :placeholder="translateArticle('article_form_content_placeholder')"
                :hint="translateArticle('article_form_content_hint')"
                :rules="contentRules"
                variant="outlined"
                density="comfortable"
                rows="10"
                counter
                maxlength="10000"
                required
              />
            </VCol>

            <!-- Statut de publication -->
            <VCol cols="12" md="6">
              <VSwitch
                v-model="formData.is_published"
                :label="formData.is_published ? 'Article publié' : 'Brouillon'"
                color="success"
                inset
              />
            </VCol>

            <!-- Date de publication -->
            <VCol v-if="formData.is_published" cols="12" md="6">
              <VTextField
                v-model="formData.published_at"
                label="Date de publication"
                type="datetime-local"
                variant="outlined"
                density="comfortable"
              />
            </VCol>

            <!-- Aperçu du contenu -->
            <VCol v-if="formData.content" cols="12">
              <VCard variant="outlined" class="content-preview">
                <VCardTitle class="text-h6">
                  <VIcon icon="ri-eye-line" class="me-2" />
                  Aperçu du contenu
                </VCardTitle>
                <VCardText>
                  <div class="content-preview-text" v-html="formatContentPreview(formData.content)"></div>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>

      <VCardActions class="article-form-actions">
        <VSpacer />
        <VBtn 
          color="secondary" 
          variant="outlined" 
          @click="handleCancel"
          :disabled="isSubmitting"
        >
          <VIcon icon="ri-close-line" class="me-1" />
          {{ translateArticle('article_form_cancel') }}
        </VBtn>
        <VBtn 
          color="primary" 
          @click="handleSubmit"
          :loading="isSubmitting"
          :disabled="!isFormValid"
        >
          <VIcon icon="ri-save-line" class="me-1" />
          {{ isSubmitting ? 'Enregistrement...' : (isEditing ? 'Modifier' : 'Enregistrer') }}
        </VBtn>
      </VCardActions>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useBlogArticles } from '@/composables/useBlogArticles'
import { translateArticle } from '@/utils/translations'

interface Props {
  modelValue?: any
  isEditing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  'submit': [data: any]
  'cancel': []
}>()

// Utiliser le composable
const { categories, categoriesLoading, loadCategories } = useBlogArticles()

// Local state
const formRef = ref()
const isFormValid = ref(false)
const isSubmitting = ref(false)

const formData = ref({
  title: '',
  content: '',
  author_name: '',
  category_id: null as number | null,
  tags: '',
  is_published: false,
  published_at: ''
})

// Rules de validation
const titleRules = [
  (v: string) => !!v || translateArticle('article_form_required_title'),
  (v: string) => (v && v.length >= 2) || translateArticle('article_form_min_title'),
  (v: string) => (v && v.length <= 200) || translateArticle('article_form_max_title')
]

const contentRules = [
  (v: string) => !!v || translateArticle('article_form_required_content'),
  (v: string) => (v && v.length >= 10) || translateArticle('article_form_min_content')
]

// Computed
const isEditing = computed(() => props.isEditing)

// Methods
const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  isSubmitting.value = true
  
  try {
    // Préparer les données
    const submitData = {
      ...formData.value,
      published_at: formData.value.is_published ? (formData.value.published_at || new Date().toISOString()) : null
    }
    
    emit('submit', submitData)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}

const formatContentPreview = (content: string) => {
  if (!content) return ''
  
  // Convertir les sauts de ligne en <br>
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
}

const resetForm = () => {
  formData.value = {
    title: '',
    content: '',
    author_name: '',
    category_id: null,
    tags: '',
    is_published: false,
    published_at: ''
  }
  isFormValid.value = false
}

const loadFormData = (data: any) => {
  formData.value = {
    title: data.title || '',
    content: data.content || '',
    author_name: data.author_name || '',
    category_id: data.category_id || null,
    tags: data.tags || '',
    is_published: !!data.published_at,
    published_at: data.published_at ? new Date(data.published_at).toISOString().slice(0, 16) : ''
  }
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    loadFormData(newValue)
  }
}, { immediate: true, deep: true })

watch(() => formData.value.is_published, (isPublished) => {
  if (isPublished && !formData.value.published_at) {
    formData.value.published_at = new Date().toISOString().slice(0, 16)
  }
})

// Lifecycle
onMounted(async () => {
  await loadCategories()
  
  // Définir l'auteur par défaut (utilisateur connecté)
  formData.value.author_name = 'Utilisateur actuel' // À remplacer par le nom de l'utilisateur connecté
})
</script>

<style scoped>
.article-form {
  width: 100%;
}

.article-form-card {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.article-form-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
}

.content-preview {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: rgba(var(--v-theme-surface), 0.5);
}

.content-preview-text {
  line-height: 1.6;
  color: rgb(var(--v-theme-on-surface));
}

.content-preview-text :deep(code) {
  background-color: rgba(var(--v-theme-primary), 0.1);
  padding: 2px 4px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

.content-preview-text :deep(strong) {
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}

.content-preview-text :deep(em) {
  font-style: italic;
  color: rgb(var(--v-theme-secondary));
}

.article-form-actions {
  padding: 16px 24px;
  background-color: rgba(var(--v-theme-surface), 0.5);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

/* Responsive */
@media (max-width: 768px) {
  .article-form-card {
    margin: 8px;
  }
  
  .article-form-title {
    padding: 16px;
  }
  
  .article-form-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .article-form-actions .v-btn {
    width: 100%;
  }
}

/* Animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.article-form-card {
  animation: slideInUp 0.4s ease-out;
}
</style>
