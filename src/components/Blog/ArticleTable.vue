<template>
  <div class="article-table">
    <VDataTable
      :headers="headers"
      :items="articles"
      :loading="isLoading"
      :search="search"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      :items-per-page="itemsPerPage"
      :page="page"
      class="elevation-1"
      show-select
      v-model="selectedArticles"
      @update:model-value="handleSelectionChange"
    >
      <!-- Titre et statut -->
      <template #item.title="{ item }">
        <div class="d-flex align-center">
          <VIcon 
            :icon="getStatusIcon(item.published_at)" 
            :color="getStatusColor(item.published_at)" 
            class="me-3" 
            size="20" 
          />
          <div>
            <div class="font-weight-medium text-body-1">{{ item.title }}</div>
            <div class="text-caption text-medium-emphasis">
              {{ item.author_name || 'Auteur inconnu' }}
            </div>
          </div>
        </div>
      </template>

      <!-- Statut de publication -->
      <template #item.status="{ item }">
        <VChip 
          :color="getStatusColor(item.published_at)" 
          size="small" 
          variant="tonal"
        >
          <VIcon :icon="getStatusIcon(item.published_at)" class="me-1" size="12" />
          {{ getStatusLabel(item.published_at) }}
        </VChip>
      </template>

      <!-- Catégorie -->
      <template #item.category="{ item }">
        <VChip 
          v-if="item.category_title" 
          color="primary" 
          size="small" 
          variant="outlined"
        >
          {{ item.category_title }}
        </VChip>
        <span v-else class="text-caption text-medium-emphasis">Aucune catégorie</span>
      </template>

      <!-- Date de création -->
      <template #item.created_at="{ item }">
        <div class="text-body-2">{{ formatDate(item.created_at) }}</div>
      </template>

      <!-- Date de publication -->
      <template #item.published_at="{ item }">
        <div v-if="item.published_at" class="text-body-2">
          {{ formatDate(item.published_at) }}
        </div>
        <span v-else class="text-caption text-medium-emphasis">Non publié</span>
      </template>

      <!-- Actions -->
      <template #item.actions="{ item }">
        <div class="d-flex align-center gap-1">
          <VBtn 
            icon="ri-eye-line" 
            size="small" 
            variant="text" 
            @click="viewArticle(item)"
            title="Voir l'article"
            color="primary"
          />
          <VBtn 
            icon="ri-edit-line" 
            size="small" 
            variant="text" 
            @click="editArticle(item)"
            title="Modifier l'article"
            color="warning"
          />
          <VMenu>
            <template #activator="{ props }">
              <VBtn 
                icon="ri-more-2-line" 
                size="small" 
                variant="text" 
                v-bind="props"
                title="Plus d'options"
              />
            </template>
            <VList>
              <VListItem @click="viewArticle(item)">
                <template #prepend>
                  <VIcon icon="ri-eye-line" />
                </template>
                <VListItemTitle>Voir l'article</VListItemTitle>
              </VListItem>
              <VListItem @click="editArticle(item)">
                <template #prepend>
                  <VIcon icon="ri-edit-line" />
                </template>
                <VListItemTitle>Modifier</VListItemTitle>
              </VListItem>
              <VListItem 
                v-if="!item.published_at" 
                @click="publishArticle(item)"
              >
                <template #prepend>
                  <VIcon icon="ri-upload-line" />
                </template>
                <VListItemTitle>Publier</VListItemTitle>
              </VListItem>
              <VListItem 
                v-else 
                @click="unpublishArticle(item)"
              >
                <template #prepend>
                  <VIcon icon="ri-download-line" />
                </template>
                <VListItemTitle>Dépublier</VListItemTitle>
              </VListItem>
              <VDivider />
              <VListItem @click="deleteArticle(item)" class="text-error">
                <template #prepend>
                  <VIcon icon="ri-delete-bin-line" />
                </template>
                <VListItemTitle>Supprimer</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </div>
      </template>

      <!-- Actions en lot -->
      <template #top>
        <div class="d-flex align-center justify-space-between pa-4">
          <div class="d-flex align-center gap-3">
            <VTextField
              v-model="search"
              prepend-inner-icon="ri-search-line"
              label="Rechercher des articles"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              style="min-width: 300px"
            />
            <VSelect
              v-model="statusFilter"
              :items="statusOptions"
              label="Statut"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              style="min-width: 150px"
            />
          </div>
          <div class="d-flex align-center gap-2">
            <VBtn 
              v-if="selectedArticles.length > 0" 
              color="error" 
              variant="outlined" 
              size="small"
              @click="deleteSelected"
            >
              <VIcon icon="ri-delete-bin-line" class="me-1" />
              Supprimer ({{ selectedArticles.length }})
            </VBtn>
            <VBtn 
              v-if="selectedArticles.length > 0" 
              color="success" 
              variant="outlined" 
              size="small"
              @click="publishSelected"
            >
              <VIcon icon="ri-upload-line" class="me-1" />
              Publier ({{ selectedArticles.length }})
            </VBtn>
          </div>
        </div>
      </template>
    </VDataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBlogArticles } from '@/composables/useBlogArticles'
import { formatDate } from '@/utils/dateUtils'

interface Props {
  articles: any[]
  isLoading?: boolean
  selectable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  selectable: true
})

const emit = defineEmits<{
  'view': [article: any]
  'edit': [article: any]
  'delete': [article: any]
  'publish': [article: any]
  'unpublish': [article: any]
  'selection-change': [articles: any[]]
}>()

// Local state
const search = ref('')
const statusFilter = ref('')
const selectedArticles = ref([])
const sortBy = ref('created_at')
const sortDesc = ref(true)
const itemsPerPage = ref(10)
const page = ref(1)

// Options de statut
const statusOptions = [
  { title: 'Tous', value: '' },
  { title: 'Publiés', value: 'published' },
  { title: 'Brouillons', value: 'draft' }
]

// Headers du tableau
const headers = [
  { title: 'Article', key: 'title', sortable: true },
  { title: 'Statut', key: 'status', sortable: true },
  { title: 'Catégorie', key: 'category', sortable: true },
  { title: 'Créé le', key: 'created_at', sortable: true },
  { title: 'Publié le', key: 'published_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
]

// Computed
const filteredArticles = computed(() => {
  let filtered = props.articles

  // Filtrer par statut
  if (statusFilter.value === 'published') {
    filtered = filtered.filter(article => article.published_at && article.published_at !== null)
  } else if (statusFilter.value === 'draft') {
    filtered = filtered.filter(article => !article.published_at || article.published_at === null)
  }

  return filtered
})

// Methods
const getStatusColor = (publishedAt: string | null) => {
  return publishedAt ? 'success' : 'warning'
}

const getStatusLabel = (publishedAt: string | null) => {
  return publishedAt ? 'Publié' : 'Brouillon'
}

const getStatusIcon = (publishedAt: string | null) => {
  return publishedAt ? 'ri-check-circle-line' : 'ri-draft-line'
}

const handleSelectionChange = (articles: any[]) => {
  selectedArticles.value = articles
  emit('selection-change', articles)
}

const viewArticle = (article: any) => {
  emit('view', article)
}

const editArticle = (article: any) => {
  emit('edit', article)
}

const deleteArticle = (article: any) => {
  emit('delete', article)
}

const publishArticle = (article: any) => {
  emit('publish', article)
}

const unpublishArticle = (article: any) => {
  emit('unpublish', article)
}

const deleteSelected = () => {
  selectedArticles.value.forEach(article => {
    emit('delete', article)
  })
  selectedArticles.value = []
}

const publishSelected = () => {
  selectedArticles.value.forEach(article => {
    if (!article.published_at) {
      emit('publish', article)
    }
  })
  selectedArticles.value = []
}
</script>

<style scoped>
.article-table {
  width: 100%;
}

.v-data-table {
  border-radius: 12px;
  overflow: hidden;
}

.v-data-table :deep(.v-data-table__wrapper) {
  border-radius: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .d-flex {
    flex-direction: column;
    gap: 12px;
  }
  
  .d-flex > * {
    width: 100%;
  }
}
</style>
