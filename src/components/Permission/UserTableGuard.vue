<template>
  <VDataTable
    :headers="filteredHeaders"
    :items="users"
    :loading="loading"
    :items-per-page="itemsPerPage"
    :page="page"
    @update:page="updatePage"
    class="user-table"
  >
    <!-- En-tête personnalisé avec permissions -->
    <template #headers="{ columns }">
      <tr>
        <th v-for="column in columns" :key="column.key" class="text-left">
          <span v-if="column.key === 'actions'">
            <PermissionGuard 
              :permissions="[PermissionEnum.CAN_UPDATE_USER, PermissionEnum.CAN_DELETE_USER, PermissionEnum.CAN_GIVE_PERMISSION, PermissionEnum.CAN_GIVE_ROLE]"
              :require-all="false"
              :show-fallback="false"
            >
              Actions
            </PermissionGuard>
          </span>
          <span v-else>
            {{ column.title }}
          </span>
        </th>
      </tr>
    </template>

    <!-- Cellules avec restrictions -->
    <template #item.actions="{ item }">
      <div class="d-flex align-center gap-1">
        <!-- Actions conditionnelles basées sur les permissions -->
        <PermissionGuard 
          :permissions="[PermissionEnum.CAN_VIEW_USER]"
          :show-fallback="false"
        >
          <VBtn
            icon
            size="small"
            variant="text"
            color="default"
            @click="$emit('view', item)"
          >
            <VIcon icon="ri-eye-line" size="small" />
            <VTooltip activator="parent">Voir</VTooltip>
          </VBtn>
        </PermissionGuard>

        <PermissionGuard 
          :permissions="[PermissionEnum.CAN_UPDATE_USER]"
          :show-fallback="false"
        >
          <VBtn
            icon
            size="small"
            variant="text"
            color="primary"
            @click="$emit('edit', item)"
          >
            <VIcon icon="ri-edit-line" size="small" />
            <VTooltip activator="parent">Modifier</VTooltip>
          </VBtn>
        </PermissionGuard>

        <PermissionGuard 
          :permissions="[PermissionEnum.CAN_DELETE_USER]"
          :show-fallback="false"
        >
          <VBtn
            icon
            size="small"
            variant="text"
            color="error"
            @click="$emit('delete', item)"
          >
            <VIcon icon="ri-delete-bin-line" size="small" />
            <VTooltip activator="parent">Supprimer</VTooltip>
          </VBtn>
        </PermissionGuard>

        <PermissionGuard 
          :permissions="[PermissionEnum.CAN_GIVE_PERMISSION]"
          :show-fallback="false"
        >
          <VBtn
            icon
            size="small"
            variant="text"
            color="secondary"
            @click="$emit('permissions', item)"
          >
            <VIcon icon="ri-key-line" size="small" />
            <VTooltip activator="parent">Permissions</VTooltip>
          </VBtn>
        </PermissionGuard>

        <PermissionGuard 
          :permissions="[PermissionEnum.CAN_GIVE_ROLE]"
          :show-fallback="false"
        >
          <VBtn
            icon
            size="small"
            variant="text"
            color="info"
            @click="$emit('roles', item)"
          >
            <VIcon icon="ri-user-settings-line" size="small" />
            <VTooltip activator="parent">Rôles</VTooltip>
          </VBtn>
        </PermissionGuard>
      </div>
    </template>

    <!-- Cellules sensibles avec masquage conditionnel -->
    <template #item.email="{ item }">
      <PermissionGuard 
        :permissions="[PermissionEnum.CAN_VIEW_USER]"
        :show-fallback="true"
      >
        <span>{{ item.email }}</span>
        <template #fallback>
          <span class="text-muted">***@***.***</span>
        </template>
      </PermissionGuard>
    </template>

    <template #item.phone="{ item }">
      <PermissionGuard 
        :permissions="[PermissionEnum.CAN_VIEW_USER]"
        :show-fallback="true"
      >
        <span>{{ item.mobile_number }}</span>
        <template #fallback>
          <span class="text-muted">*** *** ***</span>
        </template>
      </PermissionGuard>
    </template>

    <!-- Message si aucune permission -->
    <template #no-data>
      <div class="text-center pa-4">
        <VIcon icon="ri-user-line" size="48" class="text-muted mb-2" />
        <p class="text-muted">Aucun utilisateur trouvé</p>
        <PermissionGuard 
          :permissions="[PermissionEnum.CAN_CREATE_USER]"
          :show-fallback="false"
        >
          <VBtn color="primary" @click="$emit('create')">
            Créer le premier utilisateur
          </VBtn>
        </PermissionGuard>
      </div>
    </template>
  </VDataTable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePermissions } from '@/composables/usePermissions'
import { PermissionEnum } from '@/types/permissions'
import PermissionGuard from './PermissionGuard.vue'

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  mobile_number?: string
  user_type: string
  status: string
  created_at: string
}

interface Props {
  users: User[]
  loading?: boolean
  itemsPerPage?: number
  page?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  itemsPerPage: 10,
  page: 1
})

const emit = defineEmits<{
  'update:page': [page: number]
  create: []
  view: [user: User]
  edit: [user: User]
  delete: [user: User]
  permissions: [user: User]
  roles: [user: User]
}>()

const { canViewUsers, canUpdateUsers, canDeleteUsers, canGivePermissions, canGiveRoles } = usePermissions()

// En-têtes de tableau avec restrictions
const allHeaders = [
  { key: 'first_name', title: 'Prénom', sortable: true },
  { key: 'last_name', title: 'Nom', sortable: true },
  { key: 'email', title: 'Email', sortable: true },
  { key: 'phone', title: 'Téléphone', sortable: false },
  { key: 'user_type', title: 'Type', sortable: true },
  { key: 'status', title: 'Statut', sortable: true },
  { key: 'created_at', title: 'Créé le', sortable: true },
  { key: 'actions', title: 'Actions', sortable: false }
]

// Filtrer les en-têtes selon les permissions
const filteredHeaders = computed(() => {
  const headers = []
  
  // Toujours afficher les colonnes de base
  headers.push(
    { key: 'first_name', title: 'Prénom', sortable: true },
    { key: 'last_name', title: 'Nom', sortable: true }
  )
  
  // Email et téléphone seulement si peut voir les utilisateurs
  if (canViewUsers.value) {
    headers.push(
      { key: 'email', title: 'Email', sortable: true },
      { key: 'phone', title: 'Téléphone', sortable: false }
    )
  }
  
  // Colonnes administratives
  headers.push(
    { key: 'user_type', title: 'Type', sortable: true },
    { key: 'status', title: 'Statut', sortable: true },
    { key: 'created_at', title: 'Créé le', sortable: true }
  )
  
  // Colonne actions seulement si au moins une permission d'action
  if (canViewUsers.value || canUpdateUsers.value || canDeleteUsers.value || canGivePermissions.value || canGiveRoles.value) {
    headers.push({ key: 'actions', title: 'Actions', sortable: false })
  }
  
  return headers
})

const updatePage = (newPage: number) => {
  emit('update:page', newPage)
}
</script>

<style scoped>
.user-table {
  border-radius: 8px;
  overflow: hidden;
}

.text-muted {
  color: rgba(0, 0, 0, 0.38);
}
</style>
