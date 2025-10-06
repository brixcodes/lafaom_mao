<template>
  <div class="users-dashboard">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h2 class="text-h4 font-weight-bold">Gestion des Utilisateurs</h2>
        <p class="text-body-1 text-medium-emphasis">
          Gérez les utilisateurs, leurs rôles et permissions
        </p>
      </div>
      <div class="d-flex gap-3">
        <VBtn @click="refreshData" :loading="isLoading" variant="outlined">
          <VIcon icon="ri-refresh-line" class="me-2" />
          Actualiser
        </VBtn>

        <VBtn to="/users/create" color="primary" v-if="hasPermissions([PermissionEnum.CAN_CREATE_USER])">
          <VIcon icon="ri-add-line" class="me-2" />
          Nouvel utilisateur
        </VBtn>
      </div>
    </div>

    <!-- Statistiques -->
    <VRow class="mb-0">
      <VCol cols="12" sm="6" md="3">
        <VCard class="session-card" elevation="2">
          <VCardText class="d-flex align-center">
            <div class="stats-icon">
              <VIcon icon="ri-group-line" size="50" />
            </div>
            <div class="flex-grow-1">
              <div class="stats-value">{{ totalUsers.toLocaleString() }}</div>
              <div>Total Utilisateurs</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard class="active-users-card" elevation="2">
          <VCardText class="d-flex align-center">
            <div class="stats-icon">
              <VIcon icon="ri-user-heart-line" size="50" />
            </div>
            <div class="flex-grow-1">
              <div class="stats-value">{{ newUsersThisWeek.toLocaleString() }}</div>
              <div>Nouveaux utilisateurs</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard class="paid-users-card" elevation="2">
          <VCardText class="d-flex align-center">
            <div class="stats-icon">
              <VIcon icon="ri-user-follow-line" size="50" />
            </div>
            <div class="flex-grow-1">
              <div class="stats-value">{{ activeUsers.toLocaleString() }}</div>
              <div>Utilisateurs Actifs</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard class="pending-users-card" elevation="2">
          <VCardText class="d-flex align-center">
            <div class="stats-icon">
              <VIcon icon="ri-user-unfollow-line" size="50" />
            </div>
            <div class="flex-grow-1">
              <div class="stats-value">{{ pendingUsers.toLocaleString() }}</div>
              <div>Utilisateurs Inactifs</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Filtres et recherche -->
    <VCard class="mb-3">
      <VCardText>
        <div class="d-flex align-center justify-space-between mb-4">
          <h3 class="text-h6 font-weight-bold">Filtres</h3>
          <VBtn v-if="hasActiveFilters" color="secondary" variant="outlined" size="small" @click="clearAllFilters">
            <VIcon icon="ri-refresh-line" class="me-1" />
            Réinitialiser
          </VBtn>
        </div>

        <VRow>
          <VCol cols="12" md="6">
            <VSelect v-model="selectedUserType" clearable :items="userTypeOptions" label="Sélectionner le rôle"
              variant="outlined" prepend-inner-icon="ri-shield-user-line" @update:model-value="handleFilter" />
          </VCol>
          <VCol cols="12" md="6">
            <VSelect v-model="selectedStatus" clearable :items="statusOptions" label="Sélectionner le statut"
              variant="outlined" prepend-inner-icon="ri-checkbox-circle-line" @update:model-value="handleFilter" />
          </VCol>
        </VRow>

        <VRow class="mt-2">
          <VCol cols="12">
            <div class="d-flex align-center">
              <VTextField v-model="searchQuery" clearable label="Rechercher un utilisateur"
                prepend-inner-icon="ri-search-line" variant="outlined" @input="handleSearch"
                placeholder="Nom, email, téléphone..." class="flex-grow-1 mr-2" />
              <VBtn v-if="hasPermissions([PermissionEnum.CAN_CREATE_USER])" color="primary" @click="openAddUserDialog">
                <VIcon icon="ri-add-line" class="me-1" />
                Ajouter
              </VBtn>
            </div>
          </VCol>

        </VRow>
      </VCardText>
    </VCard>

    <!-- Tableau des utilisateurs -->
    <VCard v-if="hasPermissions([PermissionEnum.CAN_VIEW_USER])">
      <VDataTable :headers="headers" :items="filteredUsers" :loading="isLoading" :items-per-page="pageSize"
        :page="currentPage" @update:page="changePage" @update:items-per-page="changePageSize" class="elevation-1">
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

        <!-- Rôle d'utilisateur -->
        <template #item.user_type="{ item }">
          <VChip size="small" class="role-chip">
            <VIcon :icon="getRoleIcon(item.user_type)" class="me-1" size="14" />
            {{ getUserTypeLabel(item.user_type) }}
          </VChip>
        </template>

        <!-- Statut -->
        <template #item.status="{ item }">
          <VChip size="small">
            {{ getStatusLabel(item.status) }}
          </VChip>
        </template>

        <!-- Date de création -->
        <template #item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex gap-2">
            <!-- Bouton Voir - seulement si l'utilisateur peut gérer les permissions -->
            <VBtn v-if="hasPermissions([PermissionEnum.CAN_VIEW_USER])" icon="ri-eye-line" size="small" variant="text"
              :to="`/users/${item.id}`" title="Voir les détails" />

            <!-- Bouton Modifier - seulement si l'utilisateur peut gérer les permissions -->
            <VBtn v-if="hasPermissions([PermissionEnum.CAN_UPDATE_USER])" icon="ri-edit-line" size="small"
              variant="text" :to="`/users/${item.id}/edit`" title="Modifier l'utilisateur" />

            <!-- Bouton Supprimer - seulement si l'utilisateur peut gérer les permissions -->
            <VBtn v-if="hasPermissions([PermissionEnum.CAN_DELETE_USER])" icon="ri-delete-bin-line" size="small"
              variant="text" @click="deleteUser(item)" title="Supprimer l'utilisateur" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsers } from '@/composables/useUsers'
import { useRolePermissionOptimization } from '@/composables/useRolePermissionOptimization'
import { useRolePermissionManagement } from '@/composables/useRolePermissionManagement'
import RolePermissionMonitor from '@/components/Permission/RolePermissionMonitor.vue'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'
const router = useRouter()

import { PermissionEnum } from '@/types/permissions'
import { useInstantPermissions } from '@/composables/useInstantPermissions'
const { hasPermission, hasPermissions } = useInstantPermissions()

// Permissions
const { canManagePermissions, canManageRoles } = useRolePermissionManagement()

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
const selectedUsers = ref([])

// Calculs de statistiques
const newUsersThisWeek = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  return users.value.filter(user => {
    const userDate = new Date(user.created_at)
    return userDate >= oneWeekAgo
  }).length
})

const pendingUsers = computed(() => {
  return users.value.filter(user => user.status === 'pending' || user.status === 'inactive').length
})

const activeUsers = computed(() => {
  return users.value.filter(user => user.status === 'active').length
})

const userGrowthPercentage = computed(() => {
  const lastWeekUsers = users.value.filter(user => {
    const userDate = new Date(user.created_at)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
    return userDate >= twoWeeksAgo && userDate < oneWeekAgo
  }).length

  if (lastWeekUsers === 0) return 0
  return Math.round(((newUsersThisWeek.value - lastWeekUsers) / lastWeekUsers) * 100)
})

const activeUsersGrowth = computed(() => {
  const activeUsersLastWeek = users.value.filter(user => {
    const userDate = new Date(user.created_at)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    return userDate >= oneWeekAgo && user.status === 'active'
  }).length

  if (activeUsers.value === 0) return 0
  return Math.round((activeUsersLastWeek / activeUsers.value) * 100)
})

const newUsersDecline = computed(() => {
  const lastWeekNewUsers = users.value.filter(user => {
    const userDate = new Date(user.created_at)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
    return userDate >= twoWeeksAgo && userDate < oneWeekAgo
  }).length

  if (lastWeekNewUsers === 0) return 0
  return Math.round(((lastWeekNewUsers - newUsersThisWeek.value) / lastWeekNewUsers) * 100)
})

const pendingUsersGrowth = computed(() => {
  const pendingUsersLastWeek = users.value.filter(user => {
    const userDate = new Date(user.created_at)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    return userDate >= oneWeekAgo && (user.status === 'pending' || user.status === 'inactive')
  }).length

  if (pendingUsers.value === 0) return 0
  return Math.round((pendingUsersLastWeek / pendingUsers.value) * 100)
})

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
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Rôle', key: 'user_type', sortable: true },
  { title: 'Statut', key: 'status', sortable: true },
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
  { title: 'Tous', value: '' },
  { title: 'Actif', value: 'active' },
  { title: 'Inactif', value: 'inactive' },
  { title: 'En attente', value: 'pending' },
  { title: 'Bloqué', value: 'blocked' },
  { title: 'Supprimé', value: 'deleted' }
]

// Computed pour les filtres actifs
const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || selectedUserType.value || selectedStatus.value)
})

// Fonctions utilitaires
const getRoleColor = (userType: string): string => {
  const colors: Record<string, string> = {
    admin: 'error',
    staff: 'warning',
    teacher: 'info',
    student: 'success'
  }
  return colors[userType] || 'default'
}

const getRoleIcon = (userType: string): string => {
  const icons: Record<string, string> = {
    admin: 'ri-admin-line',
    staff: 'ri-user-settings-line',
    teacher: 'ri-graduation-cap-line',
    student: 'ri-user-line'
  }
  return icons[userType] || 'ri-user-line'
}


const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: 'success',
    inactive: 'default',
    pending: 'warning',
    blocked: 'error',
    deleted: 'error'
  }
  return colors[status] || 'default'
}

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    active: 'Actif',
    inactive: 'Inactif',
    pending: 'En attente',
    blocked: 'Bloqué',
    deleted: 'Supprimé'
  }
  return labels[status] || status
}

const getUserTypeLabel = (userType: string): string => {
  const labels: Record<string, string> = {
    admin: 'Administrateur',
    staff: 'Personnel',
    teacher: 'Formateur',
    student: 'Étudiant'
  }
  return labels[userType] || userType
}

// Fonctions d'action
const clearAllFilters = () => {
  searchQuery.value = ''
  selectedUserType.value = ''
  selectedStatus.value = ''
}

const exportUsers = () => {
  showToast({
    message: 'Export en cours...',
    type: 'info'
  })
  // TODO: Implémenter l'export
}

const openAddUserDialog = () => {
  router.push('/users/create')
}

const viewUserDetails = (user: any) => {
  router.push(`/users/${user.id}`)
}

const editUser = (user: any) => {
  router.push(`/users/${user.id}/edit`)
}

const manageUserRoles = (user: any) => {
  router.push(`/users/${user.id}/role-permissions`)
}

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
.users-dashboard {
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
}

.session-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.paid-users-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.active-users-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.pending-users-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.stats-value {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.2;
  color: rgb(var(--v-theme-on-surface));
}

.stats-label {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface-variant));
  margin-bottom: 4px;
}

.stats-change {
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 2px;
}

.stats-change.positive {
  color: #10b981;
}

.stats-change.negative {
  color: #ef4444;
}

/* Section des filtres */
.filters-card {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* Tableau des utilisateurs */
.users-table-card {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.users-table {
  border-radius: 0;
}

.users-table :deep(.v-data-table__wrapper) {
  border-radius: 0;
}

.role-chip {
  font-weight: 500;
}

.v-data-table {
  border-radius: 8px;
}

.v-avatar {
  border: 2px solid rgba(var(--v-theme-on-surface), 0.1);
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