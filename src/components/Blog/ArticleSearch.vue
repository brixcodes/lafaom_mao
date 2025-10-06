<template>
  <div class="article-search">
    <VCard class="search-card" elevation="2">
      <VCardTitle class="d-flex align-center">
        <VIcon icon="ri-search-line" class="me-2" />
        Recherche avancée d'articles
      </VCardTitle>
      
      <VCardText>
        <VRow>
          <!-- Recherche par titre -->
          <VCol cols="12" md="6">
            <VTextField
              v-model="searchQuery.title"
              label="Titre de l'article"
              prepend-inner-icon="ri-article-line"
              variant="outlined"
              clearable
              hide-details
            />
          </VCol>

          <!-- Recherche par auteur -->
          <VCol cols="12" md="6">
            <VTextField
              v-model="searchQuery.author"
              label="Auteur"
              prepend-inner-icon="ri-user-line"
              variant="outlined"
              clearable
              hide-details
            />
          </VCol>

          <!-- Recherche par contenu -->
          <VCol cols="12" md="6">
            <VTextField
              v-model="searchQuery.content"
              label="Contenu"
              prepend-inner-icon="ri-file-text-line"
              variant="outlined"
              clearable
              hide-details
            />
          </VCol>

          <!-- Recherche par tags -->
          <VCol cols="12" md="6">
            <VTextField
              v-model="searchQuery.tags"
              label="Tags"
              prepend-inner-icon="ri-price-tag-3-line"
              variant="outlined"
              clearable
              hide-details
            />
          </VCol>

          <!-- Filtre par catégorie -->
          <VCol cols="12" md="6">
            <VAutocomplete
              v-model="searchQuery.category"
              :items="categories"
              item-title="title"
              item-value="id"
              label="Catégorie"
              prepend-inner-icon="ri-folder-line"
              variant="outlined"
              clearable
              hide-details
              :loading="categoriesLoading"
            />
          </VCol>

          <!-- Filtre par statut -->
          <VCol cols="12" md="6">
            <VSelect
              v-model="searchQuery.status"
              :items="statusOptions"
              label="Statut"
              prepend-inner-icon="ri-checkbox-circle-line"
              variant="outlined"
              clearable
              hide-details
            />
          </VCol>

          <!-- Filtre par date de création -->
          <VCol cols="12" md="6">
            <VTextField
              v-model="searchQuery.dateFrom"
              label="Date de création (depuis)"
              type="date"
              variant="outlined"
              hide-details
            />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField
              v-model="searchQuery.dateTo"
              label="Date de création (jusqu'à)"
              type="date"
              variant="outlined"
              hide-details
            />
          </VCol>
        </VRow>

        <!-- Actions de recherche -->
        <div class="d-flex align-center justify-space-between mt-4">
          <div class="search-info">
            <VChip v-if="hasActiveSearch" color="info" variant="tonal" prepend-icon="ri-search-line">
              {{ searchResults.length }} résultat{{ searchResults.length > 1 ? 's' : '' }} trouvé{{ searchResults.length > 1 ? 's' : '' }}
            </VChip>
            <span v-else class="text-body-2 text-medium-emphasis">
              Utilisez les filtres ci-dessus pour rechercher des articles
            </span>
          </div>
          
          <div class="search-actions">
            <VBtn 
              color="secondary" 
              variant="outlined" 
              @click="clearSearch"
              :disabled="!hasActiveSearch"
            >
              <VIcon icon="ri-refresh-line" class="me-1" />
              Réinitialiser
            </VBtn>
            <VBtn 
              color="primary" 
              @click="performSearch"
              :loading="isSearching"
            >
              <VIcon icon="ri-search-line" class="me-1" />
              Rechercher
            </VBtn>
          </div>
        </div>
      </VCardText>
    </VCard>

    <!-- Résultats de recherche -->
    <VCard v-if="searchResults.length > 0" class="mt-6" elevation="2">
      <VCardTitle class="d-flex align-center">
        <VIcon icon="ri-list-check" class="me-2" />
        Résultats de la recherche ({{ searchResults.length }})
      </VCardTitle>
      
      <VCardText>
        <VList>
          <VListItem
            v-for="article in searchResults"
            :key="article.id"
            class="search-result-item"
            @click="selectArticle(article)"
          >
            <template #prepend>
              <VIcon 
                :icon="getStatusIcon(article.published_at)" 
                :color="getStatusColor(article.published_at)" 
                size="20" 
              />
            </template>
            
            <VListItemTitle>{{ article.title }}</VListItemTitle>
            <VListItemSubtitle>
              <div class="d-flex align-center gap-2 mt-1">
                <span>{{ article.author_name || 'Auteur inconnu' }}</span>
                <VDivider vertical />
                <span>{{ formatDate(article.created_at) }}</span>
                <VDivider vertical />
                <VChip 
                  v-if="article.category_title" 
                  color="primary" 
                  size="x-small" 
                  variant="tonal"
                >
                  {{ article.category_title }}
                </VChip>
              </div>
            </VListItemSubtitle>
            
            <template #append>
              <VBtn 
                icon="ri-eye-line" 
                size="small" 
                variant="text" 
                @click.stop="viewArticle(article)"
                title="Voir l'article"
              />
            </template>
          </VListItem>
        </VList>
      </VCardText>
    </VCard>

    <!-- Aucun résultat -->
    <VCard v-else-if="hasActiveSearch && !isSearching" class="mt-6 text-center pa-8" elevation="1">
      <VIcon icon="ri-search-line" size="64" color="grey-lighten-3" class="mb-4" />
      <h3 class="text-h6 mb-2">Aucun résultat trouvé</h3>
      <p class="text-body-2 text-medium-emphasis mb-4">
        Essayez de modifier vos critères de recherche
      </p>
      <VBtn color="primary" variant="outlined" @click="clearSearch">
        <VIcon icon="ri-refresh-line" class="me-1" />
        Réinitialiser la recherche
      </VBtn>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBlogArticles } from '@/composables/useBlogArticles'
import { formatDate } from '@/utils/dateUtils'

const emit = defineEmits<{
  'select': [article: any]
  'view': [article: any]
}>()

// Utiliser le composable
const { 
  posts, 
  categories, 
  loadPosts, 
  loadCategories, 
  formatDate: formatDateUtil 
} = useBlogArticles()

// Local state
const isSearching = ref(false)
const searchQuery = ref({
  title: '',
  author: '',
  content: '',
  tags: '',
  category: null as number | null,
  status: '',
  dateFrom: '',
  dateTo: ''
})

const searchResults = ref<any[]>([])

// Options de statut
const statusOptions = [
  { title: 'Tous', value: '' },
  { title: 'Publiés', value: 'published' },
  { title: 'Brouillons', value: 'draft' }
]

// Computed
const hasActiveSearch = computed(() => {
  return Object.values(searchQuery.value).some(value => 
    value !== '' && value !== null
  )
})

// Methods
const performSearch = async () => {
  isSearching.value = true
  
  try {
    // Simuler un délai de recherche
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let results = [...posts.value]
    
    // Filtrer par titre
    if (searchQuery.value.title) {
      const query = searchQuery.value.title.toLowerCase()
      results = results.filter(article =>
        article.title?.toLowerCase().includes(query)
      )
    }
    
    // Filtrer par auteur
    if (searchQuery.value.author) {
      const query = searchQuery.value.author.toLowerCase()
      results = results.filter(article =>
        article.author_name?.toLowerCase().includes(query)
      )
    }
    
    // Filtrer par contenu
    if (searchQuery.value.content) {
      const query = searchQuery.value.content.toLowerCase()
      results = results.filter(article =>
        article.content?.toLowerCase().includes(query)
      )
    }
    
    // Filtrer par tags
    if (searchQuery.value.tags) {
      const query = searchQuery.value.tags.toLowerCase()
      results = results.filter(article =>
        article.tags?.toLowerCase().includes(query)
      )
    }
    
    // Filtrer par catégorie
    if (searchQuery.value.category) {
      results = results.filter(article =>
        article.category_id === searchQuery.value.category
      )
    }
    
    // Filtrer par statut
    if (searchQuery.value.status === 'published') {
      results = results.filter(article => article.published_at && article.published_at !== null)
    } else if (searchQuery.value.status === 'draft') {
      results = results.filter(article => !article.published_at || article.published_at === null)
    }
    
    // Filtrer par date
    if (searchQuery.value.dateFrom) {
      const fromDate = new Date(searchQuery.value.dateFrom)
      results = results.filter(article => {
        const articleDate = new Date(article.created_at)
        return articleDate >= fromDate
      })
    }
    
    if (searchQuery.value.dateTo) {
      const toDate = new Date(searchQuery.value.dateTo)
      results = results.filter(article => {
        const articleDate = new Date(article.created_at)
        return articleDate <= toDate
      })
    }
    
    searchResults.value = results
  } finally {
    isSearching.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = {
    title: '',
    author: '',
    content: '',
    tags: '',
    category: null,
    status: '',
    dateFrom: '',
    dateTo: ''
  }
  searchResults.value = []
}

const selectArticle = (article: any) => {
  emit('select', article)
}

const viewArticle = (article: any) => {
  emit('view', article)
}

const getStatusColor = (publishedAt: string | null) => {
  return publishedAt ? 'success' : 'warning'
}

const getStatusIcon = (publishedAt: string | null) => {
  return publishedAt ? 'ri-check-circle-line' : 'ri-draft-line'
}

const formatDate = (dateString: string) => {
  return formatDateUtil(dateString)
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadPosts(),
    loadCategories()
  ])
})
</script>

<style scoped>
.article-search {
  width: 100%;
}

.search-card {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.search-result-item {
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.search-result-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.05);
  transform: translateX(4px);
}

.search-actions {
  display: flex;
  gap: 8px;
}

.search-info {
  display: flex;
  align-items: center;
}

/* Responsive */
@media (max-width: 768px) {
  .search-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .search-actions .v-btn {
    width: 100%;
  }
}
</style>
