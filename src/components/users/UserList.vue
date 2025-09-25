<template>
  <v-container fluid>
    <!-- Header avec actions principales -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold text-primary">
          <v-icon class="me-3">ri-team-line</v-icon>
          Gestion des utilisateurs
        </h1>
        <p class="text-body-1 text-medium-emphasis mt-2">
          Total: {{ total }} utilisateurs
          <span v-if="hasSelection">({{ selectedCount }} sélectionnés)</span>
        </p>
      </div>
      
      <div class="d-flex gap-3">
        <v-btn
          color="primary"
          prepend-icon="ri-refresh-line"
          @click="refresh"
          :loading="loading"
          variant="outlined"
        >
          Actualiser
        </v-btn>
        
        <v-btn
          color="success"
          prepend-icon="ri-add-line"
          @click="showCreateDialog = true"
          variant="flat"
        >
          Nouvel utilisateur
        </v-btn>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <v-card class="mb-6" elevation="1">
      <v-card-text>
        <v-row>
          <!-- Recherche -->
          <v-col cols="12" md="4">
            <v-text-field
              v-model="searchTerm"
              placeholder="Rechercher par nom, email..."
              prepend-inner-icon="ri-search-line"
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
              @keyup.enter="handleSearch"
            />
          </v-col>
          
          <!-- Filtre par type -->
          <v-col cols="12" md="3">
            <v-select
              v-model="selectedUserType"
              :items="userTypeOptions"
              label="Type d'utilisateur"
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
              @update:model-value="handleUserTypeFilter"
            />
          </v-col>
          
          <!-- Tri -->
          <v-col cols="12" md="3">
            <v-select
              v-model="selectedSort"
              :items="userSortOptions"
              label="Trier par"
              variant="outlined"
              density="comfortable"
              hide-details
              @update:model-value="handleSort"
            />
          </v-col>
          
          <!-- Actions -->
          <v-col cols="12" md="2">
            <v-btn
              @click="clearFilters"
              variant="outlined"
              color="secondary"
              block
            >
              <v-icon start>ri-filter-off-line</v-icon>
              Réinitialiser
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Actions de sélection multiple -->
    <v-expand-transition>
      <v-card v-if="hasSelection" class="mb-4" color="info" variant="tonal">
        <v-card-text>
          <div class="d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <v-icon class="me-2">ri-checkbox-multiple-line</v-icon>
              <span class="font-weight-medium">
                {{ selectedCount }} utilisateur(s) sélectionné(s)
              </span>
            </div>
            
            <div class="d-flex gap-2">
              <v-btn
                variant="text"
                size="small"
                @click="clearSelection"
              >
                Désélectionner
              </v-btn>
              
              <v-menu>
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    variant="outlined"
                    size="small"
                    append-icon="ri-arrow-down-s-line"
                  >
                    Actions groupées
                  </v-btn>
                </template>
                
                <v-list>
                  <v-list-item @click="showBulkStatusDialog = true">
                    <template #prepend>
                      <v-icon>ri-edit-line</v-icon>
                    </template>
                    <v-list-item-title>Modifier le statut</v-list-item-title>
                  </v-list-item>
                  
                  <v-list-item @click="showBulkDeleteDialog = true" class="text-error">
                    <template #prepend>
                      <v-icon>ri-delete-bin-line</v-icon>
                    </template>
                    <v-list-item-title>Supprimer</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-expand-transition>

    <!-- Liste des utilisateurs -->
    <v-card elevation="1">
      <!-- Loading -->
      <div v-if="loading && !hasUsers" class="text-center pa-8">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        />
        <p class="text-body-1 mt-4">Chargement des utilisateurs...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="isEmpty" class="text-center pa-12">
        <v-icon size="64" class="text-medium-emphasis mb-4">
          ri-team-line
        </v-icon>
        <h3 class="text-h6 mb-2">Aucun utilisateur trouvé</h3>
        <p class="text-body-2 text-medium-emphasis">
          {{ filters.search ? 'Essayez de modifier vos critères de recherche' : 'Commencez par créer votre premier utilisateur' }}
        </p>
        <v-btn
          v-if="!filters.search"
          color="primary"
          class="mt-4"
          @click="showCreateDialog = true"
        >
          Créer un utilisateur
        </v-btn>
      </div>

      <!-- Error state -->
      <div v-else-if="hasError" class="text-center pa-12">
        <v-icon size="64" color="error" class="mb-4">
          ri-error-warning-line
        </v-icon>
        <h3 class="text-h6 mb-2">Erreur de chargement</h3>
        <p class="text-body-2 text-medium-emphasis mb-4">{{ error }}</p>
        <v-btn color="primary" @click="refresh">
          Réessayer
        </v-btn>
      </div>

      <!-- Table des utilisateurs -->
      <v-data-table
        v-else
        :headers="headers"
        :items="users"
        :loading="loading"
        item-value="id"
        class="elevation-0"
        :show-select="true"
        v-model="selectedUsers"
        @update:options="handleTableOptions"
      >
        <!-- Checkbox header personnalisé -->
        <template #header.data-table-select>
          <v-checkbox-btn
            v-model="selectAll"
            @update:model-value="toggleSelectAll"
            :indeterminate="hasSelection && selectedCount < users.length"
          />
        </template>

        <!-- Avatar et nom -->
        <template #item.name="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              :color="item.picture ? undefined : 'primary'"
              class="me-3"
              size="40"
            >
              <v-img
                v-if="item.picture"
                :src="item.picture"
                :alt="formatFullName(item)"
              />
              <span v-else class="text-white font-weight-medium">
                {{ getUserInitials(item) }}
              </span>
            </v-avatar>
            
            <div>
              <div class="font-weight-medium">
                {{ formatFullName(item) }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ item.email || 'Pas d\'email' }}
              </div>
            </div>
          </div>
        </template>

        <!-- Type utilisateur -->
        <template #item.user_type="{ item }">
          <v-chip
            :color="formatUserType(item.user_type).color"
            :prepend-icon="formatUserType(item.user_type).icon"
            variant="tonal"
            size="small"
          >
            {{ formatUserType(item.user_type).label }}
          </v-chip>
        </template>

        <!-- Statut -->
        <template #item.status="{ item }">
          <v-chip
            :color="formatUserStatus(item.status).color"
            :prepend-icon="formatUserStatus(item.status).icon"
            variant="tonal"
            size="small"
          >
            {{ formatUserStatus(item.status).label }}
          </v-chip>
        </template>

        <!-- Date de création -->
        <template #item.created_at="{ item }">
          <div class="text-body-2">
            {{ formatDate(item.created_at) }}
          </div>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <div class="d-flex gap-1">
            <v-btn
              icon="ri-eye-line"
              variant="text"
              size="small"
              @click="viewUser(item.id)"
            />
            <v-btn
              icon="ri-edit-line"
              variant="text"
              size="small"
              @click="editUser(item.id)"
            />
            <v-btn
              icon="ri-delete-bin-line"
              variant="text"
              size="small"
              color="error"
              @click="deleteUser(item)"
            />
          </div>
        </template>

        <!-- Bottom -->
        <template #bottom>
          <div class="d-flex justify-space-between align-center pa-4">
            <div class="text-body-2 text-medium-emphasis">
              Affichage de {{ users.length }} sur {{ total }} utilisateurs
            </div>
            
            <v-btn
              v-if="!canLoadMore"
              @click="loadMore"
              :loading="loading"
              variant="outlined"
            >
              Charger plus
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog de création -->
    <UserCreateDialog
      v-model="showCreateDialog"
      @created="handleUserCreated"
    />

    <!-- Dialog de modification de statut en masse -->
    <v-dialog v-model="showBulkStatusDialog" max-width="400">
      <v-card>
        <v-card-title>Modifier le statut</v-card-title>
        <v-card-text>
          <p>Modifier le statut de {{ selectedCount }} utilisateur(s) ?</p>
          <v-select
            v-model="bulkStatus"
            :items="statusOptions"
            label="Nouveau statut"
            variant="outlined"
            class="mt-4"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showBulkStatusDialog = false">Annuler</v-btn>
          <v-btn
            color="primary"
            @click="handleBulkStatusUpdate"
            :loading="loading"
          >
            Confirmer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de suppression en masse -->
    <v-dialog v-model="showBulkDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-error">
          <v-icon start>ri-warning-line</v-icon>
          Supprimer les utilisateurs
        </v-card-title>
        <v-card-text>
          <p>Êtes-vous sûr de vouloir supprimer {{ selectedCount }} utilisateur(s) ?</p>
          <p class="text-caption text-error mt-2">
            Cette action est irréversible.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showBulkDeleteDialog = false">Annuler</v-btn>
          <v-btn
            color="error"
            @click="handleBulkDelete"
            :loading="loading"
          >
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar pour les messages -->
    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      :timeout="4000"
      top
    >
      {{ snackbarMessage }}
      <template #actions>
        <v-btn
          variant="text"
          @click="showSnackbar = false"
        >
          Fermer
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUsers } from '@/composables/useUser'
import {
  UserTypeEnum,
  UserStatusEnum,
  formatUserStatus,
  formatUserType,
  formatFullName,
  getUserInitials,
  userSortOptions,
} from '@/types/user'

// Components
import UserCreateDialog from './UserCreateDialog.vue'

// Router
const router = useRouter()

// Composables
const {
  users,
  loading,
  error,
  total,
  filters,
  selectedUsers,
  selectAll,
  hasSelection,
  selectedCount,
  hasUsers,
  hasError,
  isEmpty,
  canLoadMore,
  fetchUsers,
  searchUsers,
  filterByType,
  sortUsers,
  loadMore,
  refresh,
  clearFilters,
  toggleSelectAll,
  clearSelection,
  bulkUpdateStatus,
  bulkDelete,
} = useUsers()

// Reactive data
const searchTerm = ref('')
const selectedUserType = ref<UserTypeEnum | undefined>()
const selectedSort = ref('created_at_desc')
const showCreateDialog = ref(false)
const showBulkStatusDialog = ref(false)
const showBulkDeleteDialog = ref(false)
const bulkStatus = ref<UserStatusEnum>(UserStatusEnum.ACTIVE)

// Snackbar
const showSnackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Options
const userTypeOptions = [
  { title: 'Administrateur', value: UserTypeEnum.ADMIN },
  { title: 'Staff', value: UserTypeEnum.STAFF },
  { title: 'Enseignant', value: UserTypeEnum.TEACHER },
  { title: 'Étudiant', value: UserTypeEnum.STUDENT },
]

const statusOptions = [
  { title: 'Actif', value: UserStatusEnum.ACTIVE },
  { title: 'Inactif', value: UserStatusEnum.INACTIVE },
  { title: 'Bloqué', value: UserStatusEnum.BLOCKED },
]

// Headers pour le tableau
const headers = [
  { title: 'Utilisateur', key: 'name', sortable: false },
  { title: 'Type', key: 'user_type', sortable: false },
  { title: 'Statut', key: 'status', sortable: false },
  { title: 'Créé le', key: 'created_at', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]

// Methods
const handleSearch = async () => {
  await searchUsers(searchTerm.value)
}

const handleUserTypeFilter = async (userType?: UserTypeEnum) => {
  await filterByType(userType)
}

const handleSort = async (sortValue: string) => {
  const [orderBy, direction] = sortValue.split('_')
  const dir = direction === 'desc' ? 'desc' : 'asc'
  await sortUsers(orderBy, dir)
}

const handleTableOptions = (options: any) => {
  // Gérer les options du tableau si nécessaire
}

const viewUser = (userId: string) => {
  router.push(`/users/${userId}`)
}

const editUser = (userId: string) => {
  router.push(`/users/${userId}/edit`)
}

const deleteUser = async (user: any) => {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer ${formatFullName(user)} ?`)) {
    return
  }

  try {
    // Ici on appellerait la méthode de suppression individuelle
    // await userService.deleteUser(user.id)
    showMessage('Utilisateur supprimé avec succès', 'success')
    await refresh()
  } catch (err) {
    showMessage('Erreur lors de la suppression', 'error')
  }
}

const handleUserCreated = () => {
  showCreateDialog.value = false
  showMessage('Utilisateur créé avec succès', 'success')
  refresh()
}

const handleBulkStatusUpdate = async () => {
  try {
    await bulkUpdateStatus(bulkStatus.value)
    showBulkStatusDialog.value = false
    showMessage(`Statut mis à jour pour ${selectedCount.value} utilisateur(s)`, 'success')
  } catch (err) {
    showMessage('Erreur lors de la mise à jour', 'error')
  }
}

const handleBulkDelete = async () => {
  try {
    await bulkDelete()
    showBulkDeleteDialog.value = false
    showMessage(`${selectedCount.value} utilisateur(s) supprimé(s)`, 'success')
  } catch (err) {
    showMessage('Erreur lors de la suppression', 'error')
  }
}

const showMessage = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  snackbarMessage.value = message
  snackbarColor.value = type
  showSnackbar.value = true
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Watchers
watch(searchTerm, () => {
  // Débounce la recherche
  const timeoutId = setTimeout(() => {
    handleSearch()
  }, 500)
  
  return () => clearTimeout(timeoutId)
}, { immediate: false })

// Lifecycle
onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
:deep(.v-data-table__wrapper) {
  overflow-x: auto;
}

:deep(.v-data-table-footer) {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  margin-top: 16px;
  padding-top: 16px;
}
</style>
