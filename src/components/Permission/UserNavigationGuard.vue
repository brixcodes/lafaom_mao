<template>
  <div>
    <!-- Navigation principale avec protection -->
    <VList density="compact">
      <!-- Accès à la liste des utilisateurs -->
      <PermissionGuard 
        :permissions="[PermissionEnum.CAN_VIEW_USER]"
        :show-fallback="false"
      >
        <VListItem
          prepend-icon="ri-user-line"
          title="Utilisateurs"
          value="users"
          :to="{ name: 'users' }"
          :active="$route.name === 'users'"
        />
      </PermissionGuard>

      <!-- Accès à la création d'utilisateur -->
      <PermissionGuard 
        :permissions="[PermissionEnum.CAN_CREATE_USER]"
        :show-fallback="false"
      >
        <VListItem
          prepend-icon="ri-user-add-line"
          title="Créer un utilisateur"
          value="users-create"
          :to="{ name: 'users-create' }"
        />
      </PermissionGuard>

      <!-- Accès à la gestion des permissions -->
      <PermissionGuard 
        :permissions="[PermissionEnum.CAN_GIVE_PERMISSION]"
        :show-fallback="false"
      >
        <VListItem
          prepend-icon="ri-key-line"
          title="Gestion des permissions"
          value="permissions"
          :to="{ name: 'permissions' }"
        />
      </PermissionGuard>

      <!-- Accès à la gestion des rôles -->
      <PermissionGuard 
        :permissions="[PermissionEnum.CAN_GIVE_ROLE]"
        :show-fallback="false"
      >
        <VListItem
          prepend-icon="ri-user-settings-line"
          title="Gestion des rôles"
          value="roles"
          :to="{ name: 'roles' }"
        />
      </PermissionGuard>
    </VList>

    <!-- Message si aucune permission -->
    <VAlert 
      v-if="!hasAnyUserPermission"
      type="info" 
      variant="tonal"
      class="ma-4"
    >
      <VIcon icon="ri-information-line" class="mr-2" />
      <strong>Module utilisateur</strong>
      <p class="mt-2 mb-0">
        Vous n'avez pas accès au module de gestion des utilisateurs.
      </p>
    </VAlert>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePermissions } from '@/composables/usePermissions'
import { PermissionEnum } from '@/types/permissions'
import PermissionGuard from './PermissionGuard.vue'

const route = useRoute()

const {
  canViewUsers,
  canCreateUsers,
  canGivePermissions,
  canGiveRoles
} = usePermissions()

// Vérifier si l'utilisateur a au moins une permission utilisateur
const hasAnyUserPermission = computed(() => {
  return canViewUsers.value || 
         canCreateUsers.value || 
         canGivePermissions.value || 
         canGiveRoles.value
})
</script>
