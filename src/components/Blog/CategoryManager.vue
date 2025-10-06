<template>
  <div class="category-manager">
    <!-- Header avec actions -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h2 class="text-h4 font-weight-bold">Gestion des Catégories</h2>
        <p class="text-body-1 text-medium-emphasis">
          Gérez toutes les catégories du blog de manière centralisée
        </p>
      </div>
      <div class="d-flex gap-3">
        <VBtn @click="refreshData" :loading="isLoading" variant="outlined">
          <VIcon icon="ri-refresh-line" class="me-2" />
          Actualiser
        </VBtn>
        <VBtn color="primary" @click="openCreateDialog">
          <VIcon icon="ri-add-line" class="me-2" />
          Nouvelle catégorie
        </VBtn>
      </div>
    </div>

    <!-- Statistiques -->
    <VRow class="mb-6">
      <VCol cols="12" sm="6" md="3">
        <VCard class="stats-card total-categories-card" elevation="2">
          <VCardText class="d-flex align-center">
            <div class="stats-icon">
              <VIcon icon="ri-bookmark-line" size="50" />
            </div>
            <div class="flex-grow-1">
              <div class="stats-value">{{ totalCategories.toLocaleString() }}</div>
              <div>Total Catégories</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard class="stats-card active-categories-card" elevation="2">
          <VCardText class="d-flex align-center">
            <div class="stats-icon">
              <VIcon icon="ri-bookmark-3-line" size="50" />
            </div>
            <div class="flex-grow-1">
              <div class="stats-value">{{ activeCategories.toLocaleString() }}</div>
              <div>Catégories Actives</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard class="stats-card recent-categories-card" elevation="2">
          <VCardText class="d-flex align-center">
            <div class="stats-icon">
              <VIcon icon="ri-add-circle-line" size="50" />
            </div>
            <div class="flex-grow-1">
              <div class="stats-value">{{ newCategoriesThisWeek.toLocaleString() }}</div>
              <div>Nouvelles cette semaine</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard class="stats-card popular-categories-card" elevation="2">
          <VCardText class="d-flex align-center">
            <div class="stats-icon">
              <VIcon icon="ri-fire-line" size="50" />
            </div>
            <div class="flex-grow-1">
              <div class="stats-value">{{ mostUsedCategory?.title || 'N/A' }}</div>
              <div>Plus utilisée</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Filtres et recherche -->
    <VCard class="mb-6">
      <VCardText>
        <VRow>
          <VCol cols="12" md="6">
            <VTextField v-model="searchQuery" clearable label="Rechercher une catégorie"
              prepend-inner-icon="ri-search-line" variant="outlined" @input="handleSearch"
              placeholder="Titre, slug, description..." />
          </VCol>
          <VCol cols="12" md="6">
            <div class="d-flex align-center justify-end">
              <VBtn color="primary" @click="openCreateDialog">
                <VIcon icon="ri-add-line" class="me-1" />
                Ajouter une catégorie
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Tableau des catégories -->
    <VCard>
      <VCardTitle class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <VIcon icon="ri-bookmark-line" class="me-2" />
          <span>Liste des catégories ({{ filteredCategories.length }})</span>
        </div>
        <VProgressCircular v-if="isLoading" size="20" indeterminate />
      </VCardTitle>

      <VDataTable :headers="headers" :items="filteredCategories" :loading="isLoading"
        class="elevation-1 categories-table" show-select v-model="selectedCategories">
        <!-- Titre et description -->
        <template #item.title="{ item }">
          <div class="d-flex align-center">
            <VIcon icon="ri-bookmark-line" class="me-3 text-primary" size="20" />
            <div>
              <div class="font-weight-medium text-body-1">{{ item.title }}</div>
              <div class="text-caption text-medium-emphasis">{{ item.description || 'Aucune description' }}</div>
            </div>
          </div>
        </template>

        <!-- Slug -->
        <template #item.slug="{ item }">
          <VChip color="primary" size="small" variant="outlined">
            {{ item.slug }}
          </VChip>
        </template>

        <!-- Date de création -->
        <template #item.created_at="{ item }">
          <div class="text-body-2">{{ formatDate(item.created_at) }}</div>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <div class="d-flex align-center gap-1">
            <VMenu>
              <template #activator="{ props }">
                <VBtn icon="ri-more-2-line" size="small" variant="text" v-bind="props" title="Plus d'options" />
              </template>
              <VList>
                <VListItem @click="editCategory(item)">
                  <template #prepend>
                    <VIcon icon="ri-edit-line" />
                  </template>
                  <VListItemTitle>Modifier</VListItemTitle>
                </VListItem>
                <VDivider />
                <VListItem @click="deleteCategory(item)" class="text-error">
                  <template #prepend>
                    <VIcon icon="ri-delete-bin-line" />
                  </template>
                  <VListItemTitle>Supprimer</VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </div>
        </template>
      </VDataTable>
    </VCard>

    <!-- Dialog de création/édition -->
    <VDialog v-model="showFormDialog" max-width="600" persistent>
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon icon="ri-bookmark-line" class="me-2" />
          {{ isEditing ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}
        </VCardTitle>

        <VCardText>
          <CategoryForm v-model="formData" :submit-label="isEditing ? 'Modifier' : 'Enregistrer'"
            @submit="handleFormSubmit" @cancel="closeFormDialog" />
        </VCardText>
      </VCard>
    </VDialog>

    <!-- Dialog de détails -->
    <VDialog v-model="showDetailsDialog" max-width="500">
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon icon="ri-information-line" class="me-2" />
          Détails de la catégorie
        </VCardTitle>

        <VCardText v-if="selectedCategory">
          <VRow>
            <VCol cols="12">
              <div class="text-h6 mb-2">{{ selectedCategory.title }}</div>
              <VChip color="primary" size="small" class="mb-3">{{ selectedCategory.slug }}</VChip>
              <p class="text-body-1">{{ selectedCategory.description || 'Aucune description' }}</p>
              <div class="text-caption text-medium-emphasis">
                Créé le {{ formatDate(selectedCategory.created_at) }}
              </div>
            </VCol>
          </VRow>
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn @click="showDetailsDialog = false">Fermer</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBlogCategories } from '@/composables/useBlogCategories'
import CategoryForm from '@/components/Blog/CategoryForm.vue'

// Utiliser le composable
const {
  categories,
  isLoading,
  totalCategories,
  activeCategories,
  newCategoriesThisWeek,
  mostUsedCategory,
  loadCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  formatDate
} = useBlogCategories()

// Local state
const searchQuery = ref('')
const selectedCategories = ref([])
const showFormDialog = ref(false)
const showDetailsDialog = ref(false)
const isEditing = ref(false)
const selectedCategory = ref(null)
const formData = ref({
  title: '',
  description: '',
  slug: ''
})

// Filtrage
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value

  const query = searchQuery.value.toLowerCase()
  return categories.value.filter(cat =>
    (cat.title && cat.title.toLowerCase().includes(query)) ||
    (cat.slug && cat.slug.toLowerCase().includes(query)) ||
    (cat.description && cat.description.toLowerCase().includes(query))
  )
})

// Computed pour les filtres actifs
const hasActiveFilters = computed(() => {
  return !!searchQuery.value
})

const headers = [
  { title: 'Catégorie', key: 'title', sortable: true },
  { title: 'Slug', key: 'slug', sortable: true },
  { title: 'Créé le', key: 'created_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Fonctions d'action
const refreshData = async () => {
  await loadCategories()
}

const clearAllFilters = () => {
  searchQuery.value = ''
}

const handleSearch = () => {
  // Le filtrage se fait automatiquement via la computed property
}

const openCreateDialog = () => {
  isEditing.value = false
  formData.value = { title: '', description: '', slug: '' }
  showFormDialog.value = true
}

const editCategory = (category: any) => {
  isEditing.value = true
  formData.value = {
    title: category.title,
    description: category.description,
    slug: category.slug
  }
  showFormDialog.value = true
}

const viewCategory = (category: any) => {
  selectedCategory.value = category
  showDetailsDialog.value = true
}

const closeFormDialog = () => {
  showFormDialog.value = false
  formData.value = { title: '', description: '', slug: '' }
}

const handleFormSubmit = async (data: any) => {
  try {
    if (isEditing.value) {
      // Trouver l'ID de la catégorie à modifier
      const categoryToEdit = categories.value.find(cat => cat.title === formData.value.title)
      if (categoryToEdit) {
        await updateCategory(categoryToEdit.id, data)
      }
    } else {
      await createCategory(data)
    }
    closeFormDialog()
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire:', error)
  }
}

onMounted(async () => {
  await loadCategories()
})
</script>

<style scoped>
.category-manager {
  max-width: 100%;
}

/* Cartes de statistiques */
.stats-card {
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

.total-categories-card .stats-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.active-categories-card .stats-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.recent-categories-card .stats-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.popular-categories-card .stats-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stats-value {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.2;
  color: rgb(var(--v-theme-on-surface));
}

/* Section des filtres */
.filters-card {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* Tableau des catégories */
.categories-table-card {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.categories-table {
  border-radius: 0;
}

.categories-table :deep(.v-data-table__wrapper) {
  border-radius: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-card {
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

.stats-card {
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
