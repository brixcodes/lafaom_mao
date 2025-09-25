<template>
  <VCard>
    <VCardTitle class="d-flex align-center">
      <VIcon icon="ri-shield-user-line" class="me-2" />
      Gestion des Rôles et Permissions
    </VCardTitle>
    
    <VCardText>
      <!-- Informations utilisateur -->
      <VAlert
        v-if="userInfo"
        type="info"
        class="mb-4"
      >
        <VAlertTitle>Utilisateur sélectionné</VAlertTitle>
        <div class="d-flex align-center">
          <VAvatar class="me-3">
            <VImg v-if="userInfo.picture" :src="userInfo.picture" />
            <VIcon v-else icon="ri-user-line" />
          </VAvatar>
          <div>
            <div class="font-weight-medium">{{ userInfo.first_name }} {{ userInfo.last_name }}</div>
            <div class="text-caption">{{ userInfo.email }}</div>
            <VChip size="small" :color="getUserTypeColor(userInfo.user_type)">
              {{ userInfo.user_type }}
            </VChip>
          </div>
        </div>
      </VAlert>

      <!-- Rôles actuels -->
      <div class="mb-6">
        <h4 class="mb-3">Rôles actuels</h4>
        <div v-if="userRoles.length > 0" class="d-flex flex-wrap gap-2">
          <VChip
            v-for="role in userRoles"
            :key="role.id"
            :color="getRoleColor(role.name)"
            size="small"
            closable
            @click:close="removeRole(role.id)"
          >
            <VIcon :icon="getRoleIcon(role.name)" class="me-1" />
            {{ role.name }}
          </VChip>
        </div>
        <VAlert v-else type="warning" variant="tonal">
          Aucun rôle assigné
        </VAlert>
      </div>

      <!-- Assigner un nouveau rôle -->
      <div class="mb-6">
        <h4 class="mb-3">Assigner un rôle</h4>
        <div class="d-flex gap-3 align-center">
          <VSelect
            v-model="selectedRoleId"
            :items="availableRoles"
            item-title="name"
            item-value="id"
            label="Sélectionner un rôle"
            variant="outlined"
            density="compact"
            style="min-width: 200px"
          />
          <VBtn
            :disabled="!selectedRoleId || isLoading"
            :loading="isLoading"
            color="primary"
            @click="assignSelectedRole"
          >
            <VIcon icon="ri-add-line" class="me-1" />
            Assigner
          </VBtn>
        </div>
      </div>

      <!-- Permissions actuelles -->
      <div class="mb-6">
        <h4 class="mb-3">Permissions actuelles</h4>
        <div v-if="userPermissionsList.length > 0" class="d-flex flex-wrap gap-2">
          <VChip
            v-for="permission in userPermissionsList"
            :key="permission"
            :color="getPermissionColor(permission)"
            size="small"
            closable
            @click:close="removePermission(permission)"
          >
            <VIcon :icon="getPermissionIcon(permission)" class="me-1" />
            {{ formatPermissionName(permission) }}
          </VChip>
        </div>
        <VAlert v-else type="warning" variant="tonal">
          Aucune permission assignée
        </VAlert>
      </div>

      <!-- Assigner des permissions -->
      <div class="mb-6">
        <h4 class="mb-3">Assigner des permissions</h4>
        <div class="d-flex gap-3 align-center">
          <VSelect
            v-model="selectedPermissions"
            :items="availablePermissions"
            item-title="label"
            item-value="value"
            label="Sélectionner des permissions"
            variant="outlined"
            density="compact"
            multiple
            chips
            style="min-width: 300px"
          />
          <VBtn
            :disabled="!selectedPermissions.length || isLoading"
            :loading="isLoading"
            color="primary"
            @click="assignSelectedPermissions"
          >
            <VIcon icon="ri-add-line" class="me-1" />
            Assigner
          </VBtn>
        </div>
      </div>

      <!-- Actions en lot -->
      <div class="d-flex gap-3">
        <VBtn
          color="success"
          variant="outlined"
          @click="assignAllPermissions"
          :disabled="isLoading"
        >
          <VIcon icon="ri-checkbox-circle-line" class="me-1" />
          Toutes les permissions
        </VBtn>
        <VBtn
          color="warning"
          variant="outlined"
          @click="assignManagerPermissions"
          :disabled="isLoading"
        >
          <VIcon icon="ri-user-settings-line" class="me-1" />
          Permissions Manager
        </VBtn>
        <VBtn
          color="error"
          variant="outlined"
          @click="clearAllPermissions"
          :disabled="isLoading"
        >
          <VIcon icon="ri-delete-bin-line" class="me-1" />
          Tout révoquer
        </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRolePermissionManagement } from '@/composables/useRolePermissionManagement'
import { PermissionEnum, RoleEnum } from '@/types/permissions'
import { confirmAction } from '@/utils/confirm'

interface UserInfo {
  id: string
  first_name: string
  last_name: string
  email: string
  user_type: string
  picture?: string
}

interface Props {
  userInfo: UserInfo | null
}

const props = defineProps<Props>()

const {
  roles,
  permissions,
  userPermissions,
  isLoading,
  loadRoles,
  loadPermissions,
  loadUserPermissions,
  assignPermissions,
  revokePermissions,
  assignRole,
  revokeRole,
  getUserRoles,
  getUserPermissions,
} = useRolePermissionManagement()

// Local state
const selectedRoleId = ref<number | null>(null)
const selectedPermissions = ref<string[]>([])

// Computed
const availableRoles = computed(() => roles.value)
const availablePermissions = computed(() => 
  permissions.value.map(permission => ({
    value: permission,
    label: formatPermissionName(permission)
  }))
)

const userRoles = computed(() => {
  if (!props.userInfo) return []
  const roleIds = getUserRoles(props.userInfo.id)
  return roles.value.filter(role => roleIds.includes(role.id))
})

const userPermissionsList = computed(() => {
  if (!props.userInfo) return []
  return getUserPermissions(props.userInfo.id)
})

// Methods
const formatPermissionName = (permission: string): string => {
  return permission.replace(/can_/g, '').replace(/_/g, ' ').toUpperCase()
}

const getRoleColor = (roleName: string): string => {
  const colors: Record<string, string> = {
    [RoleEnum.SUPER_ADMIN]: 'error',
    [RoleEnum.MANAGER]: 'warning',
    [RoleEnum.VISITOR]: 'info',
  }
  return colors[roleName] || 'default'
}

const getRoleIcon = (roleName: string): string => {
  const icons: Record<string, string> = {
    [RoleEnum.SUPER_ADMIN]: 'ri-admin-line',
    [RoleEnum.MANAGER]: 'ri-user-settings-line',
    [RoleEnum.VISITOR]: 'ri-user-line',
  }
  return icons[roleName] || 'ri-user-line'
}

const getPermissionColor = (permission: string): string => {
  if (permission.includes('view')) return 'info'
  if (permission.includes('create')) return 'success'
  if (permission.includes('update')) return 'warning'
  if (permission.includes('delete')) return 'error'
  return 'default'
}

const getPermissionIcon = (permission: string): string => {
  if (permission.includes('view')) return 'ri-eye-line'
  if (permission.includes('create')) return 'ri-add-line'
  if (permission.includes('update')) return 'ri-edit-line'
  if (permission.includes('delete')) return 'ri-delete-bin-line'
  return 'ri-shield-line'
}

const getUserTypeColor = (userType: string): string => {
  const colors: Record<string, string> = {
    admin: 'error',
    staff: 'warning',
    teacher: 'info',
    student: 'success',
  }
  return colors[userType] || 'default'
}

const assignSelectedRole = async () => {
  if (!props.userInfo || !selectedRoleId.value) return
  
  try {
    await assignRole({
      user_id: props.userInfo.id,
      role_id: selectedRoleId.value
    })
    selectedRoleId.value = null
  } catch (error) {
    console.error('Erreur lors de l\'assignation du rôle:', error)
  }
}

const assignSelectedPermissions = async () => {
  if (!props.userInfo || !selectedPermissions.value.length) return
  
  try {
    await assignPermissions({
      user_id: props.userInfo.id,
      permissions: selectedPermissions.value
    })
    selectedPermissions.value = []
  } catch (error) {
    console.error('Erreur lors de l\'assignation des permissions:', error)
  }
}

const removeRole = async (roleId: number) => {
  if (!props.userInfo) return
  
  const confirmed = await confirmAction({
    title: 'Révoquer le rôle',
    text: 'Êtes-vous sûr de vouloir révoquer ce rôle ?',
    confirmButtonText: 'Révoquer',
    cancelButtonText: 'Annuler'
  })
  
  if (!confirmed) return
  
  try {
    await revokeRole({
      user_id: props.userInfo.id,
      role_id: roleId
    })
  } catch (error) {
    console.error('Erreur lors de la révocation du rôle:', error)
  }
}

const removePermission = async (permission: string) => {
  if (!props.userInfo) return
  
  const confirmed = await confirmAction({
    title: 'Révoquer la permission',
    text: 'Êtes-vous sûr de vouloir révoquer cette permission ?',
    confirmButtonText: 'Révoquer',
    cancelButtonText: 'Annuler'
  })
  
  if (!confirmed) return
  
  try {
    await revokePermissions({
      user_id: props.userInfo.id,
      permissions: [permission]
    })
  } catch (error) {
    console.error('Erreur lors de la révocation de la permission:', error)
  }
}

const assignAllPermissions = async () => {
  if (!props.userInfo) return
  
  const confirmed = await confirmAction({
    title: 'Assigner toutes les permissions',
    text: 'Êtes-vous sûr de vouloir assigner toutes les permissions disponibles ?',
    confirmButtonText: 'Assigner',
    cancelButtonText: 'Annuler'
  })
  
  if (!confirmed) return
  
  try {
    await assignPermissions({
      user_id: props.userInfo.id,
      permissions: permissions.value
    })
  } catch (error) {
    console.error('Erreur lors de l\'assignation de toutes les permissions:', error)
  }
}

const assignManagerPermissions = async () => {
  if (!props.userInfo) return
  
  const managerPermissions = [
    PermissionEnum.CAN_VIEW_USER,
    PermissionEnum.CAN_CREATE_USER,
    PermissionEnum.CAN_UPDATE_USER,
    PermissionEnum.CAN_VIEW_ROLE,
    PermissionEnum.CAN_VIEW_BLOG,
    PermissionEnum.CAN_CREATE_BLOG,
    PermissionEnum.CAN_UPDATE_BLOG,
    PermissionEnum.CAN_DELETE_BLOG,
    PermissionEnum.CAN_PUBLISH_BLOG,
    PermissionEnum.CAN_VIEW_JOB_OFFER,
    PermissionEnum.CAN_CREATE_JOB_OFFER,
    PermissionEnum.CAN_UPDATE_JOB_OFFER,
    PermissionEnum.CAN_DELETE_JOB_OFFER,
    PermissionEnum.CAN_VIEW_JOB_APPLICATION,
    PermissionEnum.CAN_CHANGE_JOB_APPLICATION_STATUS,
    PermissionEnum.CAN_VIEW_TRAINING,
    PermissionEnum.CAN_CREATE_TRAINING,
    PermissionEnum.CAN_UPDATE_TRAINING,
    PermissionEnum.CAN_DELETE_TRAINING,
    PermissionEnum.CAN_VIEW_STUDENT_APPLICATION,
    PermissionEnum.CAN_CHANGE_STUDENT_APPLICATION_STATUS,
    PermissionEnum.CAN_VIEW_RECLAMATION,
    PermissionEnum.CAN_CHANGE_RECLAMATION_STATUS,
    PermissionEnum.CAN_VIEW_PAYMENT,
  ]
  
  const confirmed = await confirmAction({
    title: 'Assigner les permissions Manager',
    text: 'Êtes-vous sûr de vouloir assigner les permissions de Manager ?',
    confirmButtonText: 'Assigner',
    cancelButtonText: 'Annuler'
  })
  
  if (!confirmed) return
  
  try {
    await assignPermissions({
      user_id: props.userInfo.id,
      permissions: managerPermissions
    })
  } catch (error) {
    console.error('Erreur lors de l\'assignation des permissions Manager:', error)
  }
}

const clearAllPermissions = async () => {
  if (!props.userInfo) return
  
  const confirmed = await confirmAction({
    title: 'Révoquer toutes les permissions',
    text: 'Êtes-vous sûr de vouloir révoquer toutes les permissions et rôles ? Cette action est irréversible.',
    confirmButtonText: 'Révoquer tout',
    cancelButtonText: 'Annuler',
    type: 'warning'
  })
  
  if (!confirmed) return
  
  try {
    // Révoquer toutes les permissions
    await revokePermissions({
      user_id: props.userInfo.id,
      permissions: userPermissionsList.value
    })
    
    // Révoquer tous les rôles
    for (const role of userRoles.value) {
      await revokeRole({
        user_id: props.userInfo.id,
        role_id: role.id
      })
    }
  } catch (error) {
    console.error('Erreur lors de la révocation de toutes les permissions:', error)
  }
}

// Watchers
watch(() => props.userInfo, (newUserInfo) => {
  if (newUserInfo) {
    loadUserPermissions(newUserInfo.id)
  }
}, { immediate: true })

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadRoles(),
    loadPermissions()
  ])
})
</script>
