<template>
  <div class="categories-dashboard">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h2 class="text-h4 font-weight-bold">Catégories du Blog</h2>
        <p class="text-body-1 text-medium-emphasis">
          Gérez toutes les catégories du blog
        </p>
      </div>
      <div class="d-flex gap-3">
        <VBtn @click="refreshData" :loading="isLoading" variant="outlined">
          <VIcon icon="ri-refresh-line" class="me-2" />
          Actualiser
        </VBtn>

        <VBtn color="primary" @click="goToCreate" v-if="hasPermissions([PermissionEnum.CAN_CREATE_BLOG])">
          <VIcon icon="ri-add-line" class="me-2" />
          Nouvelle catégorie
        </VBtn>
      </div>
    </div>

    <!-- Statistiques -->
    <VRow class="mb-0">
      <VCol cols="12" sm="6" md="3">
        <VCard class="total-categories-card" elevation="2">
          <VCardText class="d-flex align-center">
            <div>
              <VIcon icon="ri-bookmark-line" size="50" />
            </div>
            <div class="flex-grow-1 ml-2">
              <div class="stats-value">{{ totalCategories.toLocaleString() }}</div>
              <div>Total Catégories</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard class="active-categories-card" elevation="2">
          <VCardText class="d-flex align-center">
            <div>
              <VIcon icon="ri-checkbox-circle-line" size="50" />
            </div>
            <div class="flex-grow-1 ml-2">
              <div class="stats-value">{{ activeCategories.toLocaleString() }}</div>
              <div>Catégories Actives</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard class="active-categories-card" elevation="2">
          <VCardText class="d-flex align-center">
            <div>
              <VIcon icon="ri-close-circle-line" size="50" />
            </div>
            <div class="flex-grow-1 ml-2">
              <div class="stats-value">0</div>
              <div>Catégories Inactives</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard class="recent-categories-card" elevation="2">
          <VCardText class="d-flex align-center">
            <div>
              <VIcon icon="ri-add-circle-line" size="50" />
            </div>
            <div class="flex-grow-1 ml-2">
              <div class="stats-value">{{ newCategoriesThisWeek.toLocaleString() }}</div>
              <div>Nouvelles cette semaine</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Filtres et recherche -->
    <VCard class="mb-3">
      <VCardText>
        <VRow>
          <VCol cols="12">
            <div class="d-flex align-center">
              <VTextField v-model="searchQuery" clearable label="Rechercher une catégorie"
                prepend-inner-icon="ri-search-line" variant="outlined" @input="handleSearch"
                placeholder="Titre, slug, description..." class="flex-grow-1 mr-2" />
              <VBtn color="primary" @click="goToCreate">
                <VIcon icon="ri-add-line" class="me-1" />
                Ajouter
              </VBtn>
            </div>
          </VCol>
        </VRow>

      </VCardText>
    </VCard>

    <!-- Tableau des catégories -->
    <VCard>
      <VDataTable :headers="headers" :items="filteredCategories" :loading="isLoading"
        class="elevation-1 categories-table" show-select v-model="selectedCategories"
        v-if="hasPermissions([PermissionEnum.CAN_VIEW_BLOG])">
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

            <!-- Bouton Modifier avec Tooltip -->
            <VTooltip text="Modifier la catégorie" location="top"
              v-if="hasPermissions([PermissionEnum.CAN_UPDATE_BLOG])">
              <template #activator="{ props }">
                <VBtn icon="ri-edit-line" size="small" variant="text" v-bind="props" @click="goToEdit(item)" />
              </template>
            </VTooltip>

            <!-- Bouton Supprimer avec Tooltip -->
            <VTooltip text="Supprimer la catégorie" location="top"
              v-if="hasPermissions([PermissionEnum.CAN_DELETE_BLOG])">
              <template #activator="{ props }">
                <VBtn icon="ri-delete-bin-line" size="small" variant="text" color="primary" v-bind="props"
                  @click="handleDelete(item)" />
              </template>
            </VTooltip>

          </div>
        </template>

      </VDataTable>
    </VCard>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogCategories } from '@/composables/useBlogCategories'

import { PermissionEnum } from '@/types/permissions'
import { useInstantPermissions } from '@/composables/useInstantPermissions'
const { hasPermission, hasPermissions } = useInstantPermissions()

const router = useRouter()

// Utiliser le composable
const {
  categories,
  isLoading,
  totalCategories,
  activeCategories,
  newCategoriesThisWeek,
  mostUsedCategory,
  loadCategories,
  deleteCategory,
  formatDate
} = useBlogCategories()

// Local state
const searchQuery = ref('')
const selectedCategories = ref([])

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
  { title: 'Actions', key: 'actions', sortable: false, width: '100px' },
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

const viewCategory = (category: any) => {
  // TODO: Implémenter la vue des détails d'une catégorie
  console.log('Voir catégorie:', category)
}

const goToCreate = () => {
  router.push('/blog/categories/create')
}

const goToEdit = (category: any) => {
  const id = typeof category === 'object' && category !== null ? category.id : category
  if (id) {
    router.push(`/blog/categories/${id}/edit`)
  } else {
    console.error('ID de catégorie non défini pour l\'édition', category)
  }
}

const handleDelete = async (category: any) => {
  await deleteCategory(category)
}


onMounted(async () => {
  await loadCategories()
})
</script>

<style scoped>
.categories-dashboard {
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
