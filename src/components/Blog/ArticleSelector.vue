<template>
  <div class="article-selector">
    <VAutocomplete
      v-model="selectedArticles"
      :items="articles"
      :loading="isLoading"
      :search="searchQuery"
      item-title="title"
      item-value="id"
      :label="label"
      :placeholder="placeholder"
      :multiple="multiple"
      :chips="chips"
      :clearable="clearable"
      :disabled="disabled"
      :rules="rules"
      :error-messages="errorMessages"
      prepend-inner-icon="ri-article-line"
      variant="outlined"
      density="comfortable"
      hide-details="auto"
      @update:search="handleSearch"
      @update:model-value="handleSelectionChange"
    >
      <template #item="{ props, item }">
        <VListItem v-bind="props">
          <template #prepend>
            <VIcon icon="ri-article-line" class="me-2" />
          </template>
          <VListItemTitle>{{ item.raw.title }}</VListItemTitle>
          <VListItemSubtitle>
            <div class="d-flex align-center gap-2 mt-1">
              <VChip 
                :color="getStatusColor(item.raw.published_at)" 
                size="x-small" 
                variant="tonal"
              >
                {{ getStatusLabel(item.raw.published_at) }}
              </VChip>
              <span class="text-caption">{{ formatDate(item.raw.created_at) }}</span>
            </div>
          </VListItemSubtitle>
        </VListItem>
      </template>

      <template #selection="{ item }">
        <VChip
          v-if="chips && multiple"
          :color="getStatusColor(item.raw.published_at)"
          size="small"
          variant="tonal"
          closable
          @click:close="removeArticle(item.raw.id)"
        >
          <VIcon :icon="getStatusIcon(item.raw.published_at)" class="me-1" size="12" />
          {{ item.raw.title }}
        </VChip>
        <span v-else>{{ item.raw.title }}</span>
      </template>

      <template #no-data>
        <VListItem>
          <VListItemTitle class="text-center">
            {{ isLoading ? 'Chargement...' : 'Aucun article trouvé' }}
          </VListItemTitle>
        </VListItem>
      </template>
    </VAutocomplete>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useBlogArticles } from '@/composables/useBlogArticles'

interface Props {
  modelValue?: number | number[] | null
  label?: string
  placeholder?: string
  multiple?: boolean
  chips?: boolean
  clearable?: boolean
  disabled?: boolean
  rules?: any[]
  errorMessages?: string[]
  status?: 'all' | 'published' | 'draft'
  categoryId?: number
  authorId?: number
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Sélectionner un article',
  placeholder: 'Rechercher un article...',
  multiple: false,
  chips: true,
  clearable: true,
  disabled: false,
  status: 'all',
  categoryId: undefined,
  authorId: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: number | number[] | null]
  'change': [value: number | number[] | null]
}>()

// Utiliser le composable
const { posts, loadPosts, formatDate } = useBlogArticles()

// Local state
const searchQuery = ref('')
const isLoading = ref(false)

// Computed
const selectedArticles = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  }
})

const articles = computed(() => {
  let filtered = posts.value

  // Filtrer par statut
  if (props.status === 'published') {
    filtered = filtered.filter(post => post.published_at && post.published_at !== null)
  } else if (props.status === 'draft') {
    filtered = filtered.filter(post => !post.published_at || post.published_at === null)
  }

  // Filtrer par catégorie
  if (props.categoryId) {
    filtered = filtered.filter(post => post.category_id === props.categoryId)
  }

  // Filtrer par auteur
  if (props.authorId) {
    filtered = filtered.filter(post => post.author_id === props.authorId)
  }

  // Filtrer par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(post =>
      post.title?.toLowerCase().includes(query) ||
      post.content?.toLowerCase().includes(query) ||
      post.author_name?.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Methods
const handleSearch = (query: string) => {
  searchQuery.value = query
}

const handleSelectionChange = (value: number | number[] | null) => {
  selectedArticles.value = value
}

const removeArticle = (articleId: number) => {
  if (Array.isArray(selectedArticles.value)) {
    const newSelection = selectedArticles.value.filter(id => id !== articleId)
    selectedArticles.value = newSelection.length > 0 ? newSelection : null
  }
}

const getStatusColor = (publishedAt: string | null) => {
  return publishedAt ? 'success' : 'warning'
}

const getStatusLabel = (publishedAt: string | null) => {
  return publishedAt ? 'Publié' : 'Brouillon'
}

const getStatusIcon = (publishedAt: string | null) => {
  return publishedAt ? 'ri-check-circle-line' : 'ri-draft-line'
}

// Watchers
watch(() => props.status, () => {
  // Recharger les articles si le statut change
  loadPosts()
})

watch(() => props.categoryId, () => {
  // Recharger les articles si la catégorie change
  loadPosts()
})

watch(() => props.authorId, () => {
  // Recharger les articles si l'auteur change
  loadPosts()
})

// Lifecycle
onMounted(async () => {
  isLoading.value = true
  try {
    await loadPosts()
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.article-selector {
  width: 100%;
}

.v-list-item {
  padding: 8px 16px;
}

.v-list-item-title {
  font-weight: 500;
}

.v-list-item-subtitle {
  opacity: 0.7;
}
</style>
