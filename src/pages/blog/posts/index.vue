<template>
  <div class="articles-dashboard">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h2 class="text-h4 font-weight-bold">Gestion des Actualités</h2>
        <p class="text-body-1 text-medium-emphasis">
          Gérez et organisez vos contenus éditoriaux
        </p>
      </div>
      <div class="d-flex gap-3">
        <VBtn @click="retryFetch" :loading="isLoading" variant="outlined">
          <VIcon icon="ri-refresh-line" class="me-2" />
          Actualiser
        </VBtn>

        <VBtn color="primary" @click="goToCreate" v-if="hasPermissions([PermissionEnum.CAN_CREATE_BLOG])">
          <VIcon icon="ri-add-line" class="me-2" />
          Nouvel actualitée
        </VBtn>
      </div>
    </div>

    <!-- Statistiques -->
    <VRow class="mb-0">
      <VCol cols="12" sm="6" md="3">
        <VCard class="total-articles-card" elevation="2">
          <VCardText class="d-flex align-center">
            <div>
              <VIcon icon="ri-article-line" size="50" />
            </div>
            <div class="flex-grow-1 ml-2 ">
              <div class="stats-value">{{ totalPosts.toLocaleString() }}</div>
              <div>Total Articles</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard class="published-articles-card" elevation="2">
          <VCardText class="d-flex align-center">
            <div>
              <VIcon icon="ri-checkbox-circle-line" size="50" />
            </div>
            <div class="flex-grow-1 ml-2">
              <div class="stats-value">{{ publishedCount.toLocaleString() }}</div>
              <div>Articles Publiés</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard class="draft-articles-card" elevation="2">
          <VCardText class="d-flex align-center">
            <div>
              <VIcon icon="ri-draft-line" size="50" />
            </div>
            <div class="flex-grow-1 ml-2">
              <div class="stats-value">{{ draftCount.toLocaleString() }}</div>
              <div>Brouillons</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard class="recent-articles-card" elevation="2">
          <VCardText class="d-flex align-center">
            <div>
              <VIcon icon="ri-time-line" size="50" />
            </div>
            <div class="flex-grow-1 ml-2">
              <div class="stats-value">{{ getRecentArticlesCount() }}</div>
              <div>Cette semaine</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Filtres et recherche -->
    <VCard class="mb-3">
      <VCardText>
        <div class="d-flex align-center justify-space-between mb-4">
          <h3 class="text-h6 font-weight-bold">Filtres sur les actualitées</h3>
          <div class="d-flex align-center">
            <!-- Toggle View Mode -->
            <VBtnToggle v-model="viewMode" color="primary" variant="outlined" density="compact" mandatory>
              <VBtn value="grid">
                <VIcon size="16">ri-grid-fill</VIcon>
              </VBtn>
              <VBtn value="list">
                <VIcon size="16">ri-list-check</VIcon>
              </VBtn>
            </VBtnToggle>
          </div>
        </div>

        <VRow>
          <!-- Onglets de statut -->
          <VCol cols="12" class="mb-4">
            <VTabs v-model="activeTab" class="primary-tabs v-tabs-pill" color="primary" align-tabs="start" grow>
              <VTab value="all" prepend-icon="ri-file-list-3-line">
                Tous ({{ totalPosts }})
              </VTab>

              <VTab value="published" prepend-icon="ri-check-line">
                Publiés ({{ publishedCount }})
              </VTab>

              <VTab value="draft" prepend-icon="ri-draft-line">
                Brouillons ({{ draftCount }})
              </VTab>
            </VTabs>

          </VCol>

          <!-- Champs de recherche -->
          <VCol cols="12" md="4">
            <VTextField v-model="filters.title" label="Rechercher par titre" prepend-inner-icon="ri-search-line"
              variant="outlined" clearable hide-details />
          </VCol>

          <VCol cols="12" md="4">
            <VTextField v-model="filters.author" label="Filtrer par auteur" prepend-inner-icon="ri-user-line"
              variant="outlined" clearable hide-details />
          </VCol>

          <VCol cols="12" md="4">
            <VAutocomplete v-model="filters.categories" :items="categories" item-title="title" item-value="id"
              label="Catégories" prepend-inner-icon="ri-folder-line" variant="outlined" multiple chips clearable
              hide-details :loading="categoriesLoading" />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- États de chargement et erreurs -->
    <ApiErrorHandler v-if="apiError" :error="apiErrorMessage" show-retry @retry="retryFetch"
      @close="apiError = false" />

    <!-- État de chargement -->
    <VCard v-if="isLoading && posts.length === 0" class="text-center pa-8" elevation="1">
      <VProgressCircular indeterminate color="primary" size="64" width="6" />
      <div class="text-h6 mt-4 mb-2">Chargement des actualitée...</div>
      <div class="text-body-2 text-medium-emphasis">
        Récupération de vos contenus en cours
      </div>
    </VCard>

    <!-- Liste des actualitée -->
    <span v-else-if="filteredPosts.length > 0" v-if="hasPermissions([PermissionEnum.CAN_VIEW_BLOG])">
      <VFadeTransition group>
        <VRow v-if="viewMode === 'grid'" key="grid-view" class="pa-4">
          <VCol v-for="post in paginatedPosts" :key="post.id" cols="12" sm="6" lg="4" xl="3">
            <PostCard :post="post" :view-mode="viewMode" @update="handlePostUpdate" @delete="handlePostDelete" />
          </VCol>
        </VRow>

        <div v-else key="list-view" class="pa-4">
          <PostCard v-for="post in paginatedPosts" :key="post.id" :post="post" :view-mode="viewMode"
            @update="handlePostUpdate" @delete="handlePostDelete" class="mb-4" />
        </div>
      </VFadeTransition>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pa-4">
        <VDivider class="mb-4" />
        <div class="d-flex align-center justify-space-between">
          <div class="pagination-info">
            <span class="text-body-2 text-medium-emphasis">
              Affichage {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, filteredPosts.length)
              }}
              de {{ filteredPosts.length }} actualitées
            </span>
          </div>
          <VPagination v-model="currentPage" :length="totalPages" :total-visible="7" color="primary" />
        </div>
      </div>
    </span>

    <!-- État vide -->
    <VCard v-else class="text-center pa-8" elevation="1">
      <VIcon :icon="hasActiveFilters ? 'ri-search-line' : 'ri-file-list-3-line'" size="80" color="grey-lighten-3"
        class="mb-4" />

      <h3 class="text-h5 mb-3">
        {{ hasActiveFilters ? 'Aucun résultat trouvé' : 'Aucune actualitée' }}
      </h3>

      <p class="text-body-1 text-medium-emphasis mb-6" style="max-width: 400px; margin: 0 auto;">
        {{ hasActiveFilters ? 'Essayez de modifier vos filtres ou créez une nouvelle actualitée.' : 'Commencez par créer votre premiere actualitée pour partager vos idées avec le monde.' }}
      </p>

      <div class="d-flex gap-3 justify-center">
        <VBtn v-if="hasActiveFilters" variant="outlined" color="primary" prepend-icon="ri-refresh-line"
          @click="clearAllFilters">
          Réinitialiser les filtres
        </VBtn>
        <VBtn color="primary" size="large" prepend-icon="ri-add-line" @click="goToCreate">
          {{ hasActiveFilters ? 'Créer une actualitée' : 'Créer votre premiere actualitée' }}
        </VBtn>
      </div>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import PostCard from '@/components/Blog/PostCard.vue'
import ApiErrorHandler from '@/components/common/ApiErrorHandler.vue'
import { useBlogArticles } from '@/composables/useBlogArticles'
import { usePermissions } from '@/composables/usePermissions'
import { processTags } from '@/utils/tagUtils'

import { PermissionEnum } from '@/types/permissions'
import { useInstantPermissions } from '@/composables/useInstantPermissions'
const { hasPermission, hasPermissions } = useInstantPermissions()

// === ROUTER ===
const router = useRouter()

// === PERMISSIONS ===
const { canViewBlogs, canCreateBlogs, canUpdateBlogs, canDeleteBlogs } = usePermissions()

// === COMPOSABLE ===
const {
  posts,
  categories,
  availableTags,
  isLoading,
  categoriesLoading,
  tagsLoading,
  totalPosts,
  publishedCount,
  draftCount,
  recentArticlesCount,
  loadPosts,
  loadCategories,
  loadTags,
  formatDate,
  getRecentArticlesCount
} = useBlogArticles()

// === REACTIVE STATE ===
const apiError = ref(false)
const apiErrorMessage = ref('')

// === FILTERS ===
const activeTab = ref<'all' | 'published' | 'draft'>('all')
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

const filteredPosts = computed(() => {
  let result = [...posts.value]

  // Filtrer par statut
  if (activeTab.value === 'published') {
    result = result.filter(post => post.published_at)
  } else if (activeTab.value === 'draft') {
    result = result.filter(post => !post.published_at)
  }

  // Filtrer par titre
  if (filters.value.title) {
    const searchTerm = filters.value.title.toLowerCase()
    result = result.filter(post => post.title?.toLowerCase().includes(searchTerm))
  }

  // Filtrer par auteur
  if (filters.value.author) {
    const searchTerm = filters.value.author.toLowerCase()
    result = result.filter(post => post.author_name?.toLowerCase().includes(searchTerm))
  }

  // Filtrer par catégories
  if (filters.value.categories.length > 0) {
    result = result.filter(post =>
      filters.value.categories.includes(post.category_id)
    )
  }

  // Filtrer par tags
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

const hasAccess = computed(() =>
  canViewBlogs.value || canCreateBlogs.value || canUpdateBlogs.value || canDeleteBlogs.value
)

// === WATCHERS ===
watch([() => filters.value, activeTab, sortBy], () => {
  currentPage.value = 1
}, { deep: true })

watch(viewMode, (newMode) => {
  pageSize.value = newMode === 'list' ? 8 : 12
  currentPage.value = 1
})

// === METHODS ===

const retryFetch = async () => {
  await Promise.all([
    loadPosts(),
    loadCategories(),
    loadTags()
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
  await retryFetch()
})
</script>


<style scoped>
.articles-dashboard {
  max-width: 100%;
}

/* Cartes de statistiques */
. {
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stats-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.total-articles-card .stats-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.published-articles-card .stats-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.draft-articles-card .stats-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.recent-articles-card .stats-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stats-value {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.2;
  color: rgb(var(--v-theme-on-surface));
}

/* Tableau des articles */
.articles-table-card {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* Responsive */
@media (max-width: 768px) {
  . {
    margin-bottom: 16px;
  }

  .stats-value {
    font-size: 1.5rem;
  }

  .stats-icon {
    width: 40px;
    height: 40px;
    margin-right: 12px;
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

. {
  animation: fadeInUp 0.6s ease-out;
}

.stats-card:nth-child(1) {
  animation-delay: 0.1s;
}

.stats-card:nth-child(2) {
  animation-delay: 0.2s;
}

.stats-card:nth-child(3) {
  animation-delay: 0.3s;
}

.stats-card:nth-child(4) {
  animation-delay: 0.4s;
}
</style>
