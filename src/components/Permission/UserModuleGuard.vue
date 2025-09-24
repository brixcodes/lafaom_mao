<template>
  <div>
    <!-- Protection de l'accès à la liste des utilisateurs -->
    <PermissionGuard 
      :permissions="[PermissionEnum.CAN_VIEW_USER]"
      :show-fallback="false"
    >
      <slot name="user-list" />
    </PermissionGuard>

    <!-- Protection de l'accès à la création d'utilisateurs -->
    <PermissionGuard 
      :permissions="[PermissionEnum.CAN_CREATE_USER]"
      :show-fallback="false"
    >
      <slot name="user-create" />
    </PermissionGuard>

    <!-- Protection de l'accès à la modification d'utilisateurs -->
    <PermissionGuard 
      :permissions="[PermissionEnum.CAN_UPDATE_USER]"
      :show-fallback="false"
    >
      <slot name="user-edit" />
    </PermissionGuard>

    <!-- Protection de l'accès à la suppression d'utilisateurs -->
    <PermissionGuard 
      :permissions="[PermissionEnum.CAN_DELETE_USER]"
      :show-fallback="false"
    >
      <slot name="user-delete" />
    </PermissionGuard>

    <!-- Protection de l'accès à la gestion des permissions -->
    <PermissionGuard 
      :permissions="[PermissionEnum.CAN_GIVE_PERMISSION]"
      :show-fallback="false"
    >
      <slot name="user-permissions" />
    </PermissionGuard>

    <!-- Protection de l'accès à la gestion des rôles -->
    <PermissionGuard 
      :permissions="[PermissionEnum.CAN_GIVE_ROLE]"
      :show-fallback="false"
    >
      <slot name="user-roles" />
    </PermissionGuard>

    <!-- Message d'accès refusé si aucune permission -->
    <VAlert 
      v-if="!hasAnyUserPermission"
      type="error" 
      variant="tonal"
      class="ma-4"
    >
      <VIcon icon="ri-shield-cross-line" class="mr-2" />
      <strong>Accès refusé</strong>
      <p class="mt-2 mb-0">
        Vous n'avez pas les permissions nécessaires pour accéder au module utilisateur.
        Contactez votre administrateur pour obtenir les droits d'accès.
      </p>
    </VAlert>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePermissions } from '@/composables/usePermissions'
import { PermissionEnum } from '@/types/permissions'
import PermissionGuard from './PermissionGuard.vue'

const {
  canViewUsers,
  canCreateUsers,
  canUpdateUsers,
  canDeleteUsers,
  canGivePermissions,
  canGiveRoles
} = usePermissions()

// Vérifier si l'utilisateur a au moins une permission utilisateur
const hasAnyUserPermission = computed(() => {
  return canViewUsers.value || 
         canCreateUsers.value || 
         canUpdateUsers.value || 
         canDeleteUsers.value || 
         canGivePermissions.value || 
         canGiveRoles.value
})
</script>
