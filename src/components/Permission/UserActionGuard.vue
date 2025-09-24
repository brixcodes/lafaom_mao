<template>
  <div>
    <!-- Bouton de création d'utilisateur -->
    <PermissionGuard 
      :permissions="[PermissionEnum.CAN_CREATE_USER]"
      :show-fallback="false"
    >
      <VBtn
        color="primary"
        prepend-icon="ri-add-line"
        @click="$emit('create')"
      >
        Créer un utilisateur
      </VBtn>
    </PermissionGuard>

    <!-- Actions de ligne pour chaque utilisateur -->
    <template v-for="user in users" :key="user.id">
      <div class="d-flex align-center gap-2">
        <!-- Bouton de modification -->
        <PermissionGuard 
          :permissions="[PermissionEnum.CAN_UPDATE_USER]"
          :show-fallback="false"
        >
          <VBtn
            icon
            size="small"
            variant="text"
            color="primary"
            @click="$emit('edit', user)"
          >
            <VIcon icon="ri-edit-line" />
            <VTooltip activator="parent">Modifier</VTooltip>
          </VBtn>
        </PermissionGuard>

        <!-- Bouton de suppression -->
        <PermissionGuard 
          :permissions="[PermissionEnum.CAN_DELETE_USER]"
          :show-fallback="false"
        >
          <VBtn
            icon
            size="small"
            variant="text"
            color="error"
            @click="$emit('delete', user)"
          >
            <VIcon icon="ri-delete-bin-line" />
            <VTooltip activator="parent">Supprimer</VTooltip>
          </VBtn>
        </PermissionGuard>

        <!-- Bouton de gestion des permissions -->
        <PermissionGuard 
          :permissions="[PermissionEnum.CAN_GIVE_PERMISSION]"
          :show-fallback="false"
        >
          <VBtn
            icon
            size="small"
            variant="text"
            color="secondary"
            @click="$emit('permissions', user)"
          >
            <VIcon icon="ri-key-line" />
            <VTooltip activator="parent">Permissions</VTooltip>
          </VBtn>
        </PermissionGuard>

        <!-- Bouton de gestion des rôles -->
        <PermissionGuard 
          :permissions="[PermissionEnum.CAN_GIVE_ROLE]"
          :show-fallback="false"
        >
          <VBtn
            icon
            size="small"
            variant="text"
            color="info"
            @click="$emit('roles', user)"
          >
            <VIcon icon="ri-user-settings-line" />
            <VTooltip activator="parent">Rôles</VTooltip>
          </VBtn>
        </PermissionGuard>

        <!-- Bouton de vue détaillée -->
        <PermissionGuard 
          :permissions="[PermissionEnum.CAN_VIEW_USER]"
          :show-fallback="false"
        >
          <VBtn
            icon
            size="small"
            variant="text"
            color="default"
            @click="$emit('view', user)"
          >
            <VIcon icon="ri-eye-line" />
            <VTooltip activator="parent">Voir</VTooltip>
          </VBtn>
        </PermissionGuard>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { PermissionEnum } from '@/types/permissions'
import PermissionGuard from './PermissionGuard.vue'

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  user_type: string
  status: string
}

interface Props {
  users: User[]
}

defineProps<Props>()

defineEmits<{
  create: []
  edit: [user: User]
  delete: [user: User]
  permissions: [user: User]
  roles: [user: User]
  view: [user: User]
}>()
</script>
