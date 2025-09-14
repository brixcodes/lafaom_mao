<template>
  <div class="post-list-page">
    <ApiErrorHandler 
      v-if="apiError" 
      :error="apiErrorMessage" 
      :showRetryButton="true"
      @retry="retryFetch" 
      @clear-error="apiError = false"
    />
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">Mes Articles</h1>
        <p class="text-body-1 text-medium-emphasis">Total {{ filteredPosts.length }} articles que vous avez publiés</p>
      </div>
      <div class="d-flex align-center gap-2">
        <VBtn
          prepend-icon="ri-add-line"
          size="large"
          elevation="2"
          @click="goToCreate"
        >
          Nouvel article
        </VBtn>
      </div>
    </div>

    <VCard
      class="mb-5 filter-card"
      elevation="3"
    >
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            md="4"
          >
            <VTextField
              v-model="filterTitle"
              label="Filtrer par titre"
              clearable
              prepend-inner-icon="ri-book-2-line"
              variant="outlined"
              density="comfortable"
            />
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <VTextField
              v-model="filterAuthor"
              label="Filtrer par auteur"
              clearable
              prepend-inner-icon="ri-user-line"
              variant="outlined"
              density="comfortable"
            />
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <VAutocomplete
              v-model="filterCategories"
              :items="categories"
              item-title="title"
              item-value="id"
              label="Filtrer par catégorie"
              multiple
              clearable
              chips
              prepend-inner-icon="ri-folder-line"
              variant="outlined"
              density="comfortable"
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <VRow  :class="{ 'list-view': filterView === 'list' }">
      <VCol
        v-for="post in filteredPosts"
        :key="post.id"
        cols="12"
        :sm="filterView === 'list' ? 12 : 6"
        :md="filterView === 'list' ? 12 : 4"
        :lg="filterView === 'list' ? 12 : 3"
        class="post-column"
      >
        <PostCard
          :post="post"
          :view-mode="filterView"
          @edit="goToEdit"
          @delete="handleDelete"
        />
      </VCol>
    </VRow>

    <div
      v-if="filteredPosts.length === 0 && !isLoading"
      class="text-center my-10 empty-state"
    >
      <VIcon
        size="64"
        class="mb-4"
        >ri-file-list-3-line</VIcon
      >
      <h3 class="text-h6 mb-2">Aucun article trouvé</h3>
      <p class="text-body-2 text-medium-emphasis">Essayez de modifier vos filtres ou créez un nouvel article</p>
      <VBtn
        class="mt-4"
        prepend-icon="ri-add-line"
        @click="goToCreate"
        >Créer un article</VBtn
      >
    </div>

    <div
      v-if="isLoading"
      class="text-center my-10"
    >
      <VProgressCircular
        indeterminate
        size="48"
      />
      <div class="text-caption mt-2">Chargement...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import PostCard from '@/components/Blog/PostCard.vue'
import { blogService } from '@/services/api/blog'
import { showToast } from '@/components/toast/toastManager'
import { API_CONFIG } from '@/config/api'
import ApiErrorHandler from '@/components/common/ApiErrorHandler.vue'

const router = useRouter()
const posts = ref<any[]>([])
const categories = ref<any[]>([])
const filterAuthor = ref('')
const filterTitle = ref('')
const filterCategories = ref<any[]>([])
const isLoading = ref(false)
const apiError = ref(false)
const apiErrorMessage = ref('')

const filteredPosts = computed(() => {
  let result = posts.value || []
  if (filterAuthor.value) {
    const f = filterAuthor.value.toLowerCase()
    result = result.filter(p => p.author_name?.toLowerCase().includes(f))
  }
  if (filterTitle.value) {
    const f = filterTitle.value.toLowerCase()
    result = result.filter(p => p.title?.toLowerCase().includes(f))
  }
  if (filterCategories.value.length > 0) {
    result = result.filter(p => filterCategories.value.includes(p.category_id))
  }
  return result
})

const fetchPosts = async () => {
  isLoading.value = true
  apiError.value = false
  try {
    console.log('Tentative de récupération des posts depuis:', API_CONFIG.BASE_URL)
    const res = await blogService.getPosts()
    console.log('Réponse brute de l\'API:', res)
    
    // Vérifier la structure de la réponse
    if (res && typeof res === 'object') {
      if (res.data && Array.isArray(res.data)) {
        // Format attendu: { data: [...] }
        posts.value = res.data
      } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
        // Format alternatif: { data: { data: [...] } }
        posts.value = res.data.data
      } else {
        // Autre structure, essayer de l'adapter
        console.warn('Structure de réponse inattendue:', res)
        posts.value = Array.isArray(res) ? res : []
      }
    } else {
      console.error('Réponse invalide de l\'API')
      posts.value = []
    }
    
    console.log('Posts après traitement:', posts.value)
  } catch (err) {
    console.error('Erreur lors du chargement des posts:', err)
    apiError.value = true
    apiErrorMessage.value = 'Impossible de charger les articles. Veuillez vérifier votre connexion internet ou réessayer plus tard.'
    showToast({ message: 'Erreur lors du chargement des articles.', type: 'error' })
    posts.value = []
  } finally {
    isLoading.value = false
  }
}

const fetchCategories = async () => {
  try {
    console.log('Tentative de récupération des catégories')
    const res = await blogService.getCategories()
    console.log('Réponse des catégories:', res)
    
    // Vérifier la structure de la réponse
    if (res && typeof res === 'object') {
      if (res.data && Array.isArray(res.data)) {
        // Format attendu: { data: [...] }
        categories.value = res.data
      } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
        // Format alternatif: { data: { data: [...] } }
        categories.value = res.data.data
      } else {
        // Autre structure, essayer de l'adapter
        console.warn('Structure de réponse inattendue pour les catégories:', res)
        categories.value = Array.isArray(res) ? res : []
      }
    } else {
      console.error('Réponse invalide de l\'API pour les catégories')
      categories.value = []
    }
  } catch (err) {
    console.error('Erreur lors du chargement des catégories:', err)
    showToast({ message: 'Erreur lors du chargement des catégories.', type: 'error' })
    categories.value = []
  }
}

const retryFetch = () => {
  fetchPosts()
  fetchCategories()
}

const goToCreate = () => router.push('/blog/posts/create')

const goToEdit = (idOrRow: any) => {
  const id = typeof idOrRow === 'object' && idOrRow !== null ? idOrRow.id : idOrRow
  if (id) router.push(`/blog/posts/${id}/edit`)
  else showToast({ message: "Impossible d'éditer : ID invalide.", type: 'error' })
}

const handleDelete = async (post: any) => {
  const result = await Swal.fire({
    title: 'Êtes-vous sûrs ?',
    html: 'Supprimer cet article est irréversible.',
    showCancelButton: true,
    confirmButtonText: '<span style="color:white">Supprimer</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  })
  if (result.isConfirmed) {
    try {
      await blogService.deletePostNoConfirm(post.id)
      showToast({ message: 'Article supprimé.', type: 'success' })
      fetchPosts()
    } catch {
      showToast({ message: 'Erreur lors de la suppression.', type: 'error' })
    }
  }
}

onMounted(() => {
  fetchPosts()
  fetchCategories()
})

// Ajoutez ces nouvelles variables
const filterView = ref('grid')
const viewOptions = [
  { title: 'Grille', value: 'grid' },
  { title: 'Liste', value: 'list' },
]
const activeTab = ref('all')
</script>

<style scoped>
.post-list-page {
  padding-bottom: 40px;
}

.filter-card {
  border-radius: 12px;
  transition: box-shadow 0.3s ease;
}

.filter-card:hover {
  box-shadow: 0 8px 24px rgba(18, 30, 60, 0.1);
}

.tab-container {
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
  border-radius: 8px;
  overflow: hidden;
}

.tab-item {
  font-weight: 500;
  letter-spacing: 0.5px;
}

.posts-grid {
  margin-top: 16px;
}

.list-view .post-column {
  margin-bottom: 16px;
}

.post-column {
  transition: transform 0.2s ease;
}

.empty-state {
  padding: 48px 0;
  background-color: rgba(var(--v-theme-surface-variant), 0.2);
  border-radius: 12px;
}
</style>
