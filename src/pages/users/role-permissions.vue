<template>
  <div class="role-permissions-page">
    <!-- Header avec navigation -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div class="d-flex align-center">
        <div>
          <h1 class="text-h4 font-weight-bold mb-1">Gestion des Rôles et Permissions</h1>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Gérez les rôles et permissions des utilisateurs du système
          </p>
        </div>
      </div>
      <VBtn color="primary" @click="refreshData" :loading="isLoading" prepend-icon="ri-refresh-line">
        Actualiser
      </VBtn>
    </div>

    <!-- Message de permission insuffisante -->
    <VCard v-if="!hasPermissions([PermissionEnum.CAN_GIVE_ROLE, PermissionEnum.CAN_GIVE_PERMISSION])">
      <VCardText class="text-center py-12">
        <VIcon icon="ri-shield-cross-line" size="64" class="text-warning mb-4" />
        <h3 class="text-h5 mb-3">Permission insuffisante</h3>
        <p class="text-body-1 text-medium-emphasis mb-4">
          Vous n'avez pas les permissions nécessaires pour gérer les rôles et permissions.
        </p>
        <VBtn color="primary" @click="goBack">
          <VIcon icon="ri-arrow-left-line" class="me-2" />
          Retour
        </VBtn>
      </VCardText>
    </VCard>

    <!-- Gestion des rôles et permissions -->
    <UserRolePermissionManager v-else-if="selectedUser" :user-info="selectedUser" />

    <!-- Message si aucun utilisateur sélectionné -->
    <VCard v-else>
      <VCardText class="text-center py-12">
        <VIcon icon="ri-user-line" size="64" class="text-medium-emphasis mb-4" />
        <h3 class="text-h5 mb-3">Aucun utilisateur sélectionné</h3>
        <p class="text-body-1 text-medium-emphasis mb-4">
          Veuillez sélectionner un utilisateur pour gérer ses rôles et permissions
        </p>
        <VBtn color="primary" @click="showUserSelection = true">
          <VIcon icon="ri-user-add-line" class="me-2" />
          Sélectionner un utilisateur
        </VBtn>
      </VCardText>
    </VCard>

    <!-- Dialog de sélection d'utilisateur -->
    <VDialog v-model="showUserSelection" max-width="1200">
      <VCard>
        <VCardTitle class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <span>Sélectionner un utilisateur</span>
            <VChip color="primary" size="small" class="ms-3">
              {{ users.length }} utilisateur(s)
            </VChip>
          </div>
          <VBtn icon variant="text" @click="showUserSelection = false">
            <VIcon icon="ri-close-line" />
          </VBtn>
        </VCardTitle>
        <VCardText>
          <!-- Filtres pour le tableau des utilisateurs -->
          <div class="mb-4">
            <VRow>
              <VCol cols="12" md="4">
                <VSelect
                  v-model="userTypeFilter"
                  :items="userTypeOptions"
                  item-title="label"
                  item-value="value"
                  label="Filtrer par type"
                  variant="outlined"
                  density="compact"
                  clearable
                  prepend-inner-icon="ri-user-line"
                />
              </VCol>
              <VCol cols="12" md="4">
                <VSelect
                  v-model="statusFilter"
                  :items="statusOptions"
                  item-title="label"
                  item-value="value"
                  label="Filtrer par statut"
                  variant="outlined"
                  density="compact"
                  clearable
                  prepend-inner-icon="ri-shield-check-line"
                />
              </VCol>
              <VCol cols="12" md="4">
                <VTextField
                  v-model="userSearchQuery"
                  label="Rechercher un utilisateur"
                  variant="outlined"
                  density="compact"
                  clearable
                  prepend-inner-icon="ri-search-line"
                />
              </VCol>
            </VRow>
            
            <!-- Indicateur de filtrage -->
            <div v-if="userTypeFilter || statusFilter || userSearchQuery" class="mt-3">
              <VChip color="info" size="small" class="me-2">
                <VIcon icon="ri-filter-line" class="me-1" />
                {{ filteredUsers.length }} utilisateur(s) trouvé(s)
              </VChip>
              <VBtn
                color="secondary"
                variant="outlined"
                size="small"
                @click="clearUserFilters"
                prepend-icon="ri-refresh-line"
              >
                Réinitialiser
              </VBtn>
            </div>
          </div>
          
          <VDataTable 
            :headers="userHeaders" 
            :items="filteredUsers" 
            :loading="isLoading" 
            item-key="id" 
            class="elevation-1"
            @click:row="selectUserFromTable"
            :items-per-page="10"
          >
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
            <template #item.user_type="{ item }">
              <VChip :color="getUserTypeColor(item.user_type)" size="small">
                {{ getUserTypeLabel(item.user_type) }}
              </VChip>
            </template>
            <template #item.status="{ item }">
              <VChip :color="getStatusColor(item.status)" size="small">
                {{ getStatusLabel(item.status) }}
              </VChip>
            </template>
          </VDataTable>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUsers } from '@/composables/useUsers'
import { useRolePermissionManagement } from '@/composables/useRolePermissionManagement'
import UserRolePermissionManager from '@/components/User/UserRolePermissionManager.vue'
const router = useRouter()
const { users, isLoading, loadUsers } = useUsers()


import { PermissionEnum } from '@/types/permissions'
import { useInstantPermissions } from '@/composables/useInstantPermissions'
const { hasPermission, hasPermissions } = useInstantPermissions()

// Local state
const selectedUserId = ref<string | null>(null)
const showUserSelection = ref(false)
const userTypeFilter = ref<string>('')
const statusFilter = ref<string>('')
const userSearchQuery = ref<string>('')

// Headers pour le tableau des utilisateurs
const userHeaders = [
  { title: 'Utilisateur', key: 'user', sortable: false },
  { title: 'Type', key: 'user_type', sortable: true },
  { title: 'Statut', key: 'status', sortable: true },
]

// Options pour les filtres
const userTypeOptions = [
  { label: 'Administrateur', value: 'admin' },
  { label: 'Personnel', value: 'staff' },
  { label: 'Formateur', value: 'teacher' },
  { label: 'Étudiant', value: 'student' }
]

const statusOptions = [
  { label: 'Actif', value: 'active' },
  { label: 'Inactif', value: 'inactive' },
  { label: 'Bloqué', value: 'blocked' },
  { label: 'Supprimé', value: 'deleted' }
]

// Computed
const selectedUser = computed(() => {
  if (!selectedUserId.value) return null
  return users.value.find(user => user.id === selectedUserId.value)
})

const usersWithDisplayName = computed(() =>
  users.value.map(user => ({
    ...user,
    display_name: `${user.first_name} ${user.last_name} (${user.email})`
  }))
)

// Utilisateurs filtrés
const filteredUsers = computed(() => {
  let filtered = users.value

  // Filtre par type d'utilisateur
  if (userTypeFilter.value) {
    filtered = filtered.filter(user => user.user_type === userTypeFilter.value)
  }

  // Filtre par statut
  if (statusFilter.value) {
    filtered = filtered.filter(user => user.status === statusFilter.value)
  }

  // Filtre par recherche textuelle
  if (userSearchQuery.value) {
    const search = userSearchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.first_name.toLowerCase().includes(search) ||
      user.last_name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    )
  }

  return filtered
})

// Methods
const onUserSelect = (userId: string) => {
  selectedUserId.value = userId
}

const selectUserFromTable = (event: any, { item }: any) => {
  selectedUserId.value = item.id
  showUserSelection.value = false
}

const viewUserProfile = () => {
  if (selectedUser.value) {
    router.push(`/users/${selectedUser.value.id}`)
  }
}

const refreshData = async () => {
  await loadUsers()
}

const goBack = () => {
  router.back()
}

const clearUserFilters = () => {
  userTypeFilter.value = ''
  statusFilter.value = ''
  userSearchQuery.value = ''
}

// Vérifier s'il y a un utilisateur pré-sélectionné
const checkPreselectedUser = () => {
  const preselectedUser = sessionStorage.getItem('selectedUserForRoleManagement')
  if (preselectedUser) {
    try {
      const userData = JSON.parse(preselectedUser)
      selectedUserId.value = userData.id
      sessionStorage.removeItem('selectedUserForRoleManagement')
    } catch (error) {
      console.error('Erreur lors du parsing de l\'utilisateur pré-sélectionné:', error)
    }
  }
}

// Helper functions
const getUserTypeColor = (userType: string): string => {
  const colors: Record<string, string> = {
    admin: 'error',
    staff: 'warning',
    teacher: 'info',
    student: 'success'
  }
  return colors[userType] || 'default'
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

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: 'success',
    inactive: 'warning',
    blocked: 'error',
    deleted: 'default'
  }
  return colors[status] || 'default'
}

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    active: 'Actif',
    inactive: 'Inactif',
    blocked: 'Bloqué',
    deleted: 'Supprimé'
  }
  return labels[status] || status
}

// Watchers
watch(showUserSelection, (isOpen) => {
  if (!isOpen) {
    clearUserFilters()
  }
})

// Lifecycle
onMounted(async () => {
  await loadUsers()
  checkPreselectedUser()
})
</script>

<style scoped>
.role-permissions-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.v-card {
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.v-card-title {
  padding: 20px 24px 16px;
}

.v-card-text {
  padding: 16px 24px 20px;
}

.v-data-table {
  border-radius: 8px;
}

.v-avatar {
  border: 2px solid rgba(var(--v-theme-on-surface), 0.1);
}
</style>