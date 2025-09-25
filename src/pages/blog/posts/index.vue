<template>
  <div class="posts-page">
    <!-- Vérification des permissions d'accès -->
    <!-- <div  class="text-center py-8">
      <VIcon icon="ri-shield-cross-line" size="64" color="error" />
      <h3 class="mt-4">Permission insuffisante</h3>
      <p class="text-medium-emphasis">
        Vous n'avez pas les permissions nécessaires pour accéder aux articles du blog.
      </p>
      <VBtn color="primary" to="/dashboard" class="mt-4">
        <VIcon icon="ri-arrow-left-line" class="me-2" />
        Retour au tableau de bord
      </VBtn>
    </div> -->

    <!-- Contenu principal -->
    <div>
      <!-- Header principal -->
      <div class="mb-6">
        <div class="header-content">
          <div class="header-text">
            <h1 class="display-1 font-weight-bold mb-2">
              Mes Articles
            </h1>
            <p class="text-h6 text-medium-emphasis mb-4">
              Gérez et organisez vos contenus éditoriaux
            </p>
          </div>

          <div>
            <!-- Bouton créer - Permission: CAN_CREATE_BLOG -->
            <VBtn 
              color="primary" 
              size="large" 
              elevation="2" 
              prepend-icon="ri-add-line" 
              @click="goToCreate"
              class="create-btn"
            >
              Nouvel article
            </VBtn>
          </div>
        </div>
      </div>

    <!-- Barre de filtres avancée -->
    <VCard class="filters-card mb-6" elevation="3">
      <VCardTitle class="d-flex align-center pa-4">
        <VIcon color="primary" class="me-2" size="24">ri-filter-3-line</VIcon>
        <span class="text-h6">Filtres & Options d'affichage</span>
        <VSpacer />

        <!-- Toggle View Mode -->
        <VBtnToggle v-model="viewMode" color="primary" variant="outlined" density="compact" mandatory>
          <!-- Vue grille -->
          <VBtn value="grid">
            <VIcon size="16">ri-grid-fill</VIcon>
            <VTooltip activator="parent">Vue grille</VTooltip>
          </VBtn>

          <!-- Vue liste -->
          <VBtn value="list">
            <VIcon size="16">ri-list-check</VIcon>
            <VTooltip activator="parent">Vue liste</VTooltip>
          </VBtn>
        </VBtnToggle>

      </VCardTitle>

      <VDivider />

      <VCardText class="pa-4">
        <VRow>
          <!-- Onglets de filtrage par statut -->
          <VCol cols="12" class="pb-2">
            <VTabs v-model="activeTab" color="primary" align-tabs="start" class="status-tabs">
              <VTab value="all" prepend-icon="ri-file-list-3-line">
                Tous les articles
                <VChip size="small" variant="text" class="ml-2">
                  {{ totalPosts }}
                </VChip>
              </VTab>
              <VTab value="published" prepend-icon="ri-check-line">
                Publiés
                <VChip size="small" variant="text" class="ml-2">
                  {{ publishedCount }}
                </VChip>
              </VTab>
              <VTab value="draft" prepend-icon="ri-draft-line">
                Brouillons
                <VChip size="small" variant="text" class="ml-2">
                  {{ draftCount }}
                </VChip>
              </VTab>
            </VTabs>
          </VCol>

          <!-- Champs de filtrage -->
          <VCol cols="12" md="3">
            <VTextField v-model="filters.title" label="Rechercher par titre" prepend-inner-icon="ri-search-line"
              variant="outlined" density="comfortable" clearable hide-details />
          </VCol>

          <VCol cols="12" md="3">
            <VTextField v-model="filters.author" label="Filtrer par auteur" prepend-inner-icon="ri-user-line"
              variant="outlined" density="comfortable" clearable hide-details />
          </VCol>

          <VCol cols="12" md="3">
            <VAutocomplete v-model="filters.categories" :items="categories" item-title="title" item-value="id"
              label="Catégories" prepend-inner-icon="ri-folder-line" variant="outlined" density="comfortable" multiple
              chips clearable hide-details :loading="categoriesLoading" />
          </VCol>

          <VCol cols="12" md="3">
            <VAutocomplete v-model="filters.tags" :items="availableTags" label="Filtrer par tags"
              prepend-inner-icon="ri-price-tag-3-line" variant="outlined" density="comfortable" multiple chips clearable
              hide-details :loading="tagsLoading" />
          </VCol>
        </VRow>

        <!-- Actions de filtrage -->
        <div class="filter-actions mt-4 d-flex align-center justify-space-between">
          <div class="filter-info">
            <VChip v-if="hasActiveFilters" color="info" variant="tonal" prepend-icon="ri-filter-line" closable
              @click:close="clearAllFilters">
              {{ filteredPosts.length }} résultat{{ filteredPosts.length > 1 ? 's' : '' }} trouvé{{ filteredPosts.length
                > 1 ? 's' : '' }}
            </VChip>
            <span v-else class="text-body-2 text-medium-emphasis">
              {{ filteredPosts.length }} article{{ filteredPosts.length > 1 ? 's' : '' }} au total
            </span>
          </div>

          <div class="sort-options">
            <VSelect v-model="sortBy" :items="sortOptions" label="Trier par" variant="outlined" density="compact"
              hide-details style="min-width: 200px" />
          </div>
        </div>
      </VCardText>
    </VCard>

    <!-- États de chargement et erreurs -->
    <ApiErrorHandler v-if="apiError" :error="apiErrorMessage" show-retry @retry="retryFetch"
      @close="apiError = false" />

    <!-- État de chargement -->
    <div v-if="isLoading && posts.length === 0" class="loading-state">
      <VCard class="text-center pa-8" elevation="1">
        <VProgressCircular indeterminate color="primary" size="64" width="6" />
        <div class="text-h6 mt-4 mb-2">Chargement des articles...</div>
        <div class="text-body-2 text-medium-emphasis">
          Récupération de vos contenus en cours
        </div>
      </VCard>
    </div>

    <!-- Liste des posts -->
    <div v-else-if="filteredPosts.length > 0" class="posts-container">
      <VFadeTransition group>
        <VRow v-if="viewMode === 'grid'" key="grid-view">
          <VCol v-for="post in paginatedPosts" :key="post.id" cols="12" sm="6" lg="4" xl="3">
            <PostCard :post="post" :view-mode="viewMode" @update="handlePostUpdate" @delete="handlePostDelete" />
          </VCol>
        </VRow>

        <div v-else key="list-view" class="list-view">
          <PostCard v-for="post in paginatedPosts" :key="post.id" :post="post" :view-mode="viewMode"
            @update="handlePostUpdate" @delete="handlePostDelete" class="mb-4" />
        </div>
      </VFadeTransition>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination-container mt-6">
        <VCard class="pa-4" elevation="1">
          <div class="d-flex align-center justify-space-between">
            <div class="pagination-info">
              <span class="text-body-2 text-medium-emphasis">
                Affichage {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize,
                  filteredPosts.length) }}
                de {{ filteredPosts.length }} articles
              </span>
            </div>

            <VPagination v-model="currentPage" :length="totalPages" :total-visible="7" color="primary"
              variant="elevated" />
          </div>
        </VCard>
      </div>
    </div>

    <!-- État vide -->
    <VCard v-else class="empty-state pa-8" elevation="1">
      <div class="text-center">
        <VIcon :icon="hasActiveFilters ? 'ri-search-line' : 'ri-file-list-3-line'" size="80" color="grey-lighten-3"
          class="mb-4" />

        <h3 class="text-h5 mb-3">
          {{ hasActiveFilters ? 'Aucun résultat trouvé' : 'Aucun article' }}
        </h3>

        <p class="text-body-1 text-medium-emphasis mb-6" style="max-width: 400px; margin: 0 auto;">
          {{
            hasActiveFilters
              ? 'Essayez de modifier vos filtres ou créez un nouvel article.'
              : 'Commencez par créer votre premier article pour partager vos idées avec le monde.'
          }}
        </p>

        <div class="empty-actions">
          <VBtn v-if="hasActiveFilters" variant="outlined" color="primary" prepend-icon="ri-refresh-line"
            @click="clearAllFilters" class="me-3">
            Réinitialiser les filtres
          </VBtn>

          <VBtn color="primary" size="large" prepend-icon="ri-add-line" @click="goToCreate">
            {{ hasActiveFilters ? 'Créer un article' : 'Créer votre premier article' }}
          </VBtn>
        </div>
      </div>
    </VCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import PostCard from '@/components/Blog/PostCard.vue'
import ApiErrorHandler from '@/components/common/ApiErrorHandler.vue'
import { blogService } from '@/services/api/blog'
import { usePermissions } from '@/composables/usePermissions'
import { showToast } from '@/components/toast/toastManager'
import { processTags } from '@/utils/tagUtils'

// === ROUTER ===
const router = useRouter()

// === PERMISSIONS ===
const { canViewBlogs, canCreateBlogs, canUpdateBlogs, canDeleteBlogs } = usePermissions()

// === REACTIVE STATE ===
const posts = ref<any[]>([])
const categories = ref<any[]>([])
const availableTags = ref<string[]>([])
const isLoading = ref(false)
const categoriesLoading = ref(false)
const tagsLoading = ref(false)
const apiError = ref(false)
const apiErrorMessage = ref('')

// === FILTERS ===
const activeTab = ref('all')
const viewMode = ref<'grid' | 'list'>('grid')
const filters = ref({
  title: '',
  author: '',
  categories: [] as number[],
  tags: [] as string[],
})

// === SORTING & PAGINATION ===
const sortBy = ref('created_at_desc')
const currentPage = ref(1)
const pageSize = ref(12)

const sortOptions = [
  { title: 'Plus récents', value: 'created_at_desc' },
  { title: 'Plus anciens', value: 'created_at_asc' },
  { title: 'Titre A-Z', value: 'title_asc' },
  { title: 'Titre Z-A', value: 'title_desc' },
  { title: 'Auteur A-Z', value: 'author_asc' },
  { title: 'Auteur Z-A', value: 'author_desc' },
]

// === COMPUTED ===
const totalPosts = computed(() => posts.value.length)

const publishedCount = computed(() =>
  posts.value.filter(post => post.published_at && post.published_at !== null).length
)

const draftCount = computed(() =>
  posts.value.filter(post => !post.published_at || post.published_at === null).length
)

const filteredPosts = computed(() => {
  let result = [...posts.value]

  // Filtre par statut de publication
  if (activeTab.value === 'published') {
    result = result.filter(post => post.published_at && post.published_at !== null)
  } else if (activeTab.value === 'draft') {
    result = result.filter(post => !post.published_at || post.published_at === null)
  }

  // Filtre par titre
  if (filters.value.title) {
    const searchTerm = filters.value.title.toLowerCase()
    result = result.filter(post =>
      post.title?.toLowerCase().includes(searchTerm)
    )
  }

  // Filtre par auteur
  if (filters.value.author) {
    const searchTerm = filters.value.author.toLowerCase()
    result = result.filter(post =>
      post.author_name?.toLowerCase().includes(searchTerm)
    )
  }

  // Filtre par catégories
  if (filters.value.categories.length > 0) {
    result = result.filter(post =>
      filters.value.categories.includes(post.category_id)
    )
  }

  // Filtre par tags
  if (filters.value.tags.length > 0) {
    result = result.filter(post => {
      const postTags = processTags(post.tags)
      return filters.value.tags.some(filterTag =>
        postTags.some(postTag =>
          postTag.toLowerCase().includes(filterTag.toLowerCase())
        )
      )
    })
  }

  // Tri
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'created_at_desc':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'created_at_asc':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'title_asc':
        return (a.title || '').localeCompare(b.title || '')
      case 'title_desc':
        return (b.title || '').localeCompare(a.title || '')
      case 'author_asc':
        return (a.author_name || '').localeCompare(b.author_name || '')
      case 'author_desc':
        return (b.author_name || '').localeCompare(a.author_name || '')
      default:
        return 0
    }
  })

  return result
})

const totalPages = computed(() =>
  Math.ceil(filteredPosts.value.length / pageSize.value)
)

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredPosts.value.slice(start, end)
})

const hasActiveFilters = computed(() =>
  filters.value.title ||
  filters.value.author ||
  filters.value.categories.length > 0 ||
  filters.value.tags.length > 0 ||
  activeTab.value !== 'all'
)

// Vérification des permissions d'accès
const hasAccess = computed(() => canViewBlogs.value || canCreateBlogs.value || canUpdateBlogs.value || canDeleteBlogs.value)

// === WATCHERS ===
watch([() => filters.value, activeTab, sortBy], () => {
  currentPage.value = 1
}, { deep: true })

watch(viewMode, (newMode) => {
  pageSize.value = newMode === 'list' ? 8 : 12
  currentPage.value = 1
})

// === METHODS ===
const fetchPosts = async () => {
  isLoading.value = true
  apiError.value = false

  try {
    const res = await blogService.getPosts()

    if (res && res.data && Array.isArray(res.data)) {
      posts.value = res.data
    } else {
      posts.value = []
    }
  } catch (err: any) {
    console.error('Erreur lors du chargement des posts:', err)
    apiError.value = true
    apiErrorMessage.value = 'Impossible de charger les articles. Veuillez réessayer.'
    posts.value = []
  } finally {
    isLoading.value = false
  }
}

const fetchCategories = async () => {
  categoriesLoading.value = true

  try {
    const res = await blogService.getCategories()

    if (res && res.data && Array.isArray(res.data)) {
      categories.value = res.data
    } else {
      categories.value = []
    }
  } catch (err: any) {
    console.error('Erreur lors du chargement des catégories:', err)
    categories.value = []
  } finally {
    categoriesLoading.value = false
  }
}

const fetchTags = async () => {
  tagsLoading.value = true

  try {
    const tags = await blogService.getAllTags()
    availableTags.value = tags
  } catch (err: any) {
    console.error('Erreur lors du chargement des tags:', err)
    availableTags.value = []
  } finally {
    tagsLoading.value = false
  }
}

const retryFetch = async () => {
  await Promise.all([
    fetchPosts(),
    fetchCategories(),
    fetchTags()
  ])
}

const clearAllFilters = () => {
  filters.value = {
    title: '',
    author: '',
    categories: [],
    tags: [],
  }
  activeTab.value = 'all'
  currentPage.value = 1
}

const goToCreate = () => {
  router.push('/blog/posts/create')
}

const handlePostUpdate = (updatedPost: any) => {
  const index = posts.value.findIndex(post => post.id === updatedPost.id)
  if (index !== -1) {
    posts.value[index] = { ...posts.value[index], ...updatedPost }
  }
}

const handlePostDelete = (deletedPost: any) => {
  const index = posts.value.findIndex(post => post.id === deletedPost.id)
  if (index !== -1) {
    posts.value.splice(index, 1)
  }
}

// === LIFECYCLE ===
onMounted(async () => {
  // Vérifier les permissions avant de charger les données
  // if (!hasAccess.value) {
  //   showToast({
  //     message: 'Vous n\'avez pas les permissions nécessaires pour accéder à cette page',
  //     type: 'error'
  //   })
  //   router.push('/dashboard')
  //   return
  // }
  
  await retryFetch()
})
</script>

<style scoped>
.posts-page {
  min-height: 100vh;
  padding: 2rem 0;
}

.page-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-secondary), 0.08) 100%);
  border-radius: 24px;
  padding: 2rem;
  backdrop-filter: blur(20px);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
}

.header-text {
  flex: 1;
}

.header-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.create-btn {
  box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.3);
  transition: all 0.3s ease;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(var(--v-theme-primary), 0.4);
}

.filters-card {
  border-radius: 20px;
  backdrop-filter: blur(20px);
  background: rgba(var(--v-theme-surface), 0.95);
}

.status-tabs {
  margin-bottom: 1rem;
}

.filter-actions {
  padding-top: 1rem;
}

.posts-container {
  animation: fadeIn 0.5s ease-out;
}

.list-view {
  max-width: 100%;
}

.pagination-container {
  border-radius: 16px;
  overflow: hidden;
}

.loading-state,
.empty-state {
  border-radius: 20px;
  backdrop-filter: blur(20px);
}

.empty-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 960px) {
  .posts-page {
    padding: 1rem 0;
  }

  .page-header {
    padding: 1.5rem;
    margin-bottom: 1rem;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .header-stats {
    justify-content: center;
  }

  .filter-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}

@media (max-width: 600px) {
  .posts-page {
    padding: 0.5rem 0;
  }

  .page-header {
    margin: 1rem;
    padding: 1rem;
  }
}
</style>
