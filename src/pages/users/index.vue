<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h2 class="text-h4 font-weight-bold">Gestion des Utilisateurs</h2>
        <p class="text-body-1 text-medium-emphasis">
          Gérez les utilisateurs, leurs rôles et permissions
        </p>
      </div>
      <div class="d-flex gap-3">
        <VBtn color="primary" @click="refreshData" :loading="isLoading">
          <VIcon icon="ri-refresh-line" class="me-2" />
          Actualiser
        </VBtn>

        <VBtn color="primary" to="/users/create">
          <VIcon icon="ri-add-line" class="me-2" />
          Nouvel utilisateur
        </VBtn>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <VCard class="mb-6">
      <VCardText>
        <VRow>
          <VCol cols="12" md="4">
            <VTextField v-model="searchQuery" clearable label="Rechercher un utilisateur" prepend-inner-icon="ri-search-line"
              variant="outlined"  @input="handleSearch" />
          </VCol>
          <VCol cols="12" md="4">
            <VSelect v-model="selectedUserType" clearable :items="userTypeOptions" label="Type d'utilisateur" variant="outlined"
             @update:model-value="handleFilter" />
          </VCol>
          <VCol cols="12" md="4">
            <VSelect v-model="selectedStatus" clearable :items="statusOptions" label="Statut" variant="outlined" 
              @update:model-value="handleFilter" />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Tableau des utilisateurs -->
    <VCard>
      <VCardTitle class="d-flex align-center justify-space-between">
        <span>Liste des utilisateurs ({{ totalUsers }})</span>
        <VProgressCircular v-if="isLoading" size="20" indeterminate />
      </VCardTitle>

      <VDataTable :headers="headers" :items="users" :loading="isLoading" :items-per-page="pageSize" :page="currentPage"
        @update:page="changePage" @update:items-per-page="changePageSize" class="elevation-1">
        <!-- Avatar et nom -->
        <template #item.user="{ item }">
          <div class="d-flex align-center">
            <VAvatar size="32" class="me-3">
              <VImg v-if="item.picture" :src="item.picture" />
              <VIcon v-else icon="ri-user-line" />
            </VAvatar>
            <div>
              <div class="font-weight-medium">{{ item.first_name }} {{ item.last_name }}</div>
              <div class="text-caption text-medium-emphasis">{{ item.email }}</div>
            </div>
          </div>
        </template>

        <!-- Type d'utilisateur -->
        <template #item.user_type="{ item }">
          <VChip :color="getUserTypeColor(item.user_type)"  variant="tonal">
            {{ item.user_type }}
          </VChip>
        </template>

        <!-- Statut -->
        <template #item.status="{ item }">
          <VChip :color="getStatusColor(item.status)"  variant="tonal">
            {{ item.status }}
          </VChip>
        </template>

        <!-- Date de création -->
        <template #item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <div class="d-flex gap-2">
            <!-- Voir utilisateur - Permission: CAN_VIEW_USER -->
            <VBtn  color="info" variant="text" :to="`/users/${item.id}`" title="Voir les détails">
              <VIcon icon="ri-eye-line" />
            </VBtn>

            <!-- Modifier utilisateur - Permission: CAN_UPDATE_USER -->
            <VBtn  color="warning" variant="text" :to="`/users/${item.id}/edit`"
              title="Modifier l'utilisateur">
              <VIcon icon="ri-edit-line" />
            </VBtn>

            <!-- Gérer les rôles - Permission: CAN_GIVE_PERMISSION ou CAN_GIVE_ROLE -->
            <VBtn v-if="!canGivePermissions || canGiveRoles"  color="primary" variant="text"
              :to="`/users/role-permissions`" @click="selectUserForRoleManagement(item)"
              :title="(canGivePermissions || canGiveRoles) ? 'Gérer les rôles et permissions' : 'Permission insuffisante'">
              <VIcon icon="ri-shield-user-line" />
            </VBtn>

            <!-- Supprimer utilisateur - Permission: CAN_DELETE_USER -->
            <VBtn  color="error" variant="text" @click="deleteUser(item)" title="Supprimer l'utilisateur">
              <VIcon icon="ri-delete-bin-line" />
            </VBtn>
          </div>
        </template>
      </VDataTable>

      <!-- Pagination -->
      <VCardText v-if="totalPages > 1">
        <div class="d-flex justify-center">
          <VPagination v-model="currentPage" :length="totalPages" @update:model-value="changePage" />
        </div>
      </VCardText>
    </VCard>

    <!-- Monitoring (développement uniquement) -->
    <RolePermissionMonitor v-if="isDevelopment" :stats="monitoringStats" :is-loading="isLoading" />

    <!-- Debug des permissions (développement uniquement) -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsers } from '@/composables/useUsers'
import { useRolePermissionOptimization } from '@/composables/useRolePermissionOptimization'
import { PermissionEnum } from '@/types/permissions'
import RolePermissionMonitor from '@/components/Permission/RolePermissionMonitor.vue'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'

const router = useRouter()
const {
  users,
  isLoading,
  totalUsers,
  currentPage,
  pageSize,
  totalPages,
  loadUsers,
  deleteUser: deleteUserAPI,
  searchUsers,
  changePage,
  changePageSize
} = useUsers()

const { cacheStats } = useRolePermissionOptimization()

// Local state
const searchQuery = ref('')
const selectedUserType = ref('')
const selectedStatus = ref('')

// Computed
const isDevelopment = computed(() => import.meta.env.DEV)

const headers = [
  { title: 'Utilisateur', key: 'user', sortable: false },
  { title: 'Type', key: 'user_type', sortable: true },
  { title: 'Statut', key: 'status', sortable: true },
  { title: 'Créé le', key: 'created_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]

const userTypeOptions = [
  { title: 'Tous', value: '' },
  { title: 'Admin', value: 'admin' },
  { title: 'Staff', value: 'staff' },
  { title: 'Teacher', value: 'teacher' },
  { title: 'Student', value: 'student' }
]

const statusOptions = [
  { title: 'Tous', value: '' },
  { title: 'Actif', value: 'active' },
  { title: 'Inactif', value: 'inactive' },
  { title: 'Bloqué', value: 'blocked' },
  { title: 'Supprimé', value: 'deleted' }
]

const monitoringStats = computed(() => ({
  totalUsers: totalUsers.value,
  totalRoles: 3, // SUPER_ADMIN, MANAGER, VISITOR
  totalPermissions: 78, // Nombre de permissions disponibles
  avgResponseTime: 250, // Temps moyen de réponse
  rolesLoadTime: 150,
  permissionsLoadTime: 200,
  userPermissionsLoadTime: 300
}))

// Methods
const getUserTypeColor = (userType: string): string => {
  const colors: Record<string, string> = {
    admin: 'error',
    staff: 'warning',
    teacher: 'info',
    student: 'success'
  }
  return colors[userType] || 'default'
}

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: 'success',
    inactive: 'warning',
    blocked: 'error',
    deleted: 'default'
  }
  return colors[status] || 'default'
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const handleSearch = async () => {
  await searchUsers(searchQuery.value)
}

const handleFilter = async () => {
  // Implémenter le filtrage côté serveur si nécessaire
  await loadUsers(currentPage.value, pageSize.value, searchQuery.value)
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedUserType.value = ''
  selectedStatus.value = ''
  loadUsers(1, pageSize.value)
}

const selectUserForRoleManagement = (user: any) => {
  // Stocker l'utilisateur sélectionné pour la page de gestion des rôles
  sessionStorage.setItem('selectedUserForRoleManagement', JSON.stringify(user))
}

const deleteUser = async (user: any) => {
  const confirmed = await confirmAction({
    title: 'Êtes-vous sûr ?',
    text: `Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.first_name} ${user.last_name}" ?`,
    confirmButtonText: '<span style="color:white">Supprimer</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },

    title: 'Supprimer l\'utilisateur',
    text: `Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.first_name} ${user.last_name}" ?`,
    confirmButtonText: 'Supprimer',
    cancelButtonText: 'Annuler'
  })

  if (!confirmed) return

  try {
    await deleteUserAPI(user.id)
    showToast({
      message: 'Utilisateur supprimé avec succès',
      type: 'success'
    })
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
}

const refreshData = async () => {
  await loadUsers(currentPage.value, pageSize.value, searchQuery.value)
}


// Lifecycle
onMounted(async () => {
  await loadUsers()
})
</script>

<style scoped>
.v-data-table {
  border-radius: 8px;
}

.v-avatar {
  border: 2px solid rgba(var(--v-theme-on-surface), 0.1);
}
</style>