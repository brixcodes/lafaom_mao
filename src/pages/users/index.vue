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
        <VBtn @click="refreshData" :loading="isLoading">
          <VIcon icon="ri-refresh-line" class="me-2" />
          Actualiser
        </VBtn>

        <VBtn to="/users/create">
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
            <VTextField v-model="searchQuery" clearable label="Rechercher un utilisateur"
              prepend-inner-icon="ri-search-line" variant="outlined" @input="handleSearch" />
          </VCol>
          <VCol cols="12" md="4">
            <VSelect v-model="selectedUserType" clearable :items="userTypeOptions" label="Type d'utilisateur"
              variant="outlined" @update:model-value="handleFilter" />
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
        <span>Liste des utilisateurs ({{ filteredUsers.length }})</span>
        <VProgressCircular v-if="isLoading" size="20" indeterminate />
      </VCardTitle>

      <VDataTable :headers="headers" :items="filteredUsers" :loading="isLoading" :items-per-page="pageSize" :page="currentPage"
        @update:page="changePage" @update:items-per-page="changePageSize" class="elevation-1">
        <!-- Avatar et nom -->
        <template #item.user="{ item }">
          <div class="d-flex align-center">
            <VAvatar size="32" class="me-3">
              <VImg v-if="item.picture" :src="item.picture" />
              <VIcon v-else size="22" icon="ri-account-circle-line" />
            </VAvatar>
            <div>
              <div class="font-weight-medium">{{ item.first_name }} {{ item.last_name }}</div>
              <div class="text-caption text-medium-emphasis">{{ item.email }}</div>
            </div>
          </div>
        </template>

        <!-- Type d'utilisateur -->
        <template #item.user_type="{ item }">
          <span class="font-weight-medium">
            {{ getUserTypeLabel(item.user_type) }}
          </span>
        </template>

        <!-- Statut -->
        <template #item.status="{ item }">
          <span :class="`font-weight-medium`">
            {{ getStatusLabel(item.status) }}
          </span>
        </template>

        <!-- Date de création -->
        <template #item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex gap-2">
            <VBtn icon="ri-eye-line" size="small" variant="text" :to="`/users/${item.id}`"
              title="Voir les détails" />

            <VBtn icon="ri-edit-line" size="small" variant="text" :to="`/users/${item.id}/edit`"
              title="Modifier l'utilisateur" />

            <VBtn icon="ri-shield-user-line" size="small" variant="text" color="primary" @click="goToRoleManagement(item)"
              title="Gérer les rôles et permissions" />

            <VBtn icon="ri-delete-bin-line" size="small" variant="text" color="error" @click="deleteUser(item)"
              title="Supprimer l'utilisateur" />
          </div>
        </template>

        <!-- Actions -->
       
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
  changePage,
  changePageSize
} = useUsers()

const { cacheStats } = useRolePermissionOptimization()

// Local state
const searchQuery = ref('')
const selectedUserType = ref('')
const selectedStatus = ref('')

// Filtrage côté client comme les catégories
const filteredUsers = computed(() => {
  if (!searchQuery.value && !selectedUserType.value && !selectedStatus.value) {
    return users.value
  }

  return users.value.filter(user => {
    // Recherche textuelle
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const matchesSearch = 
        user.first_name?.toLowerCase().includes(query) ||
        user.last_name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        (user as any).mobile_number?.toLowerCase().includes(query)
      
      if (!matchesSearch) return false
    }

    // Filtre par type d'utilisateur
    if (selectedUserType.value && user.user_type !== selectedUserType.value) {
      return false
    }

    // Filtre par statut
    if (selectedStatus.value && user.status !== selectedStatus.value) {
      return false
    }

    return true
  })
})

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
  { title: 'administrateur', value: 'admin' },
  { title: 'personnel', value: 'staff' },
  { title: 'formateur', value: 'teacher' },
  { title: 'étudiant', value: 'student' }
]

const statusOptions = [
  { title: 'tous', value: '' },
  { title: 'actif', value: 'active' },
  { title: 'inactif', value: 'inactive' },
  { title: 'bloqué', value: 'blocked' },
  { title: 'supprimé', value: 'deleted' }
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

const getUserTypeLabel = (userType: string): string => {
  const labels: Record<string, string> = {
    admin: 'administrateur',
    staff: 'personnel',
    teacher: 'formateur',
    student: 'étudiant'
  }
  return labels[userType] || userType
}

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    active: 'actif',
    inactive: 'inactif',
    blocked: 'bloqué',
    deleted: 'supprimé'
  }
  return labels[status] || status
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const handleSearch = () => {
  // Le filtrage se fait automatiquement via la computed property
}

const handleFilter = () => {
  // Le filtrage se fait automatiquement via la computed property
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedUserType.value = ''
  selectedStatus.value = ''
}

const selectUserForRoleManagement = (user: any) => {
  // Stocker l'utilisateur sélectionné pour la page de gestion des rôles
  sessionStorage.setItem('selectedUserForRoleManagement', JSON.stringify(user))
}

const deleteUser = async (user: any) => {
  const confirmed = await confirmAction({
    title: 'Êtes-vous sûr ?',
    html: `Souhaitez-vous réellement supprimer l'utilisateur <b>${user.first_name} ${user.last_name}</b> ?`,
    confirmButtonText: '<span style="color:white">Supprimer</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })

  if (!confirmed) return

  try {
    await deleteUserAPI(user.id)
  } catch (error) {
    // L'erreur est déjà gérée dans le composable useUsers
  }
}

const goToRoleManagement = (user: any) => {
  // Stocker l'utilisateur sélectionné pour la page de gestion des rôles
  sessionStorage.setItem('selectedUserForRoleManagement', JSON.stringify(user))
  router.push({ path: '/users/role-permissions' })
}

const refreshData = async () => {
  await loadUsers(currentPage.value, pageSize.value)
}

// Lifecycle
onMounted(async () => {
  await loadUsers()
})

// Plus besoin de onUnmounted car on n'utilise plus de timeout
</script>

<style scoped>
.v-data-table {
  border-radius: 8px;
}

.v-avatar {
  border: 2px solid rgba(var(--v-theme-on-surface), 0.1);
}
</style>