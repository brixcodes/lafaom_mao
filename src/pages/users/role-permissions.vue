<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h2 class="text-h4 font-weight-bold">Gestion des Rôles et Permissions</h2>
        <p class="text-body-1 text-medium-emphasis">
          Gérez les rôles et permissions des utilisateurs
        </p>
      </div>
      <VBtn
        color="primary"
        @click="refreshData"
        :loading="isLoading"
      >
        <VIcon icon="ri-refresh-line" class="me-2" />
        Actualiser
      </VBtn>
    </div>

    <!-- Sélection utilisateur -->
    <VCard class="mb-6">
      <VCardTitle>
        <VIcon icon="ri-user-search-line" class="me-2" />
        Sélectionner un utilisateur
      </VCardTitle>
      <VCardText>
        <div class="d-flex gap-4 align-center">
          <VSelect
            v-model="selectedUserId"
            :items="users"
            item-title="display_name"
            item-value="id"
            label="Choisir un utilisateur"
            variant="outlined"
            style="min-width: 300px"
            @update:model-value="onUserSelect"
          />
          <VBtn
            v-if="selectedUser"
            color="info"
            variant="outlined"
            @click="viewUserProfile"
          >
            <VIcon icon="ri-eye-line" class="me-1" />
            Voir le profil
          </VBtn>
        </div>
      </VCardText>
    </VCard>

    <!-- Gestion des rôles et permissions - Permission: CAN_GIVE_PERMISSION ou CAN_GIVE_ROLE -->
    <UserRolePermissionManager
      v-if="selectedUser && (canGivePermissions || canGiveRoles)"
      :user-info="selectedUser"
    />

    <!-- Message si aucun utilisateur sélectionné -->
    <VCard v-else-if="!selectedUser">
      <VCardText class="text-center py-8">
        <VIcon icon="ri-user-line" size="48" class="text-medium-emphasis mb-4" />
        <h3 class="text-h6 mb-2">Aucun utilisateur sélectionné</h3>
        <p class="text-body-2 text-medium-emphasis">
          Veuillez sélectionner un utilisateur pour gérer ses rôles et permissions
        </p>
      </VCardText>
    </VCard>

    <!-- Message de permission insuffisante -->
    <VCard v-else-if="!canGivePermissions && !canGiveRoles">
      <VCardText class="text-center py-8">
        <VIcon icon="ri-shield-cross-line" size="48" class="text-warning mb-4" />
        <h3 class="text-h6 mb-2">Permission insuffisante</h3>
        <p class="text-body-2 text-medium-emphasis">
          Vous n'avez pas les permissions nécessaires pour gérer les rôles et permissions.
        </p>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsers } from '@/composables/useUsers'
import { usePermissions } from '@/composables/usePermissions'
import UserRolePermissionManager from '@/components/user/UserRolePermissionManager.vue'

const router = useRouter()
const { users, isLoading, loadUsers } = useUsers()

// Permissions
const { canGivePermissions, canGiveRoles } = usePermissions()

// Local state
const selectedUserId = ref<string | null>(null)

// Computed
const selectedUser = computed(() => {
  if (!selectedUserId.value) return null
  return users.value.find(user => user.id === selectedUserId.value)
})

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

const usersWithDisplayName = computed(() => 
  users.value.map(user => ({
    ...user,
    display_name: `${user.first_name} ${user.last_name} (${user.email})`
  }))
)

// Methods
const onUserSelect = (userId: string) => {
  selectedUserId.value = userId
}

const viewUserProfile = () => {
  if (selectedUser.value) {
    router.push(`/users/${selectedUser.value.id}`)
  }
}

const refreshData = async () => {
  await loadUsers()
}

// Lifecycle
onMounted(async () => {
  await loadUsers()
  checkPreselectedUser()
})
</script>
