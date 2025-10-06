<template>
  <div class="role-permission-manager">
    <!-- Gestion des rôles -->
    <VCard class="mb-6" v-if="hasPermission(PermissionEnum.CAN_GIVE_ROLE)">
      <VCardTitle class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <VIcon icon="ri-shield-user-line" class="me-2" />
          {{ translateInterface('role_management') }}
        </div>
        <VBtn color="primary" size="small" @click="showRoleDialog = true" :disabled="userRoles.length > 0">
          <VIcon icon="ri-add-line" class="me-1" />
          {{ userRoles.length > 0 ? translateInterface('role_already_assigned') : translateInterface('assign_role') }}
        </VBtn>
      </VCardTitle>

      <VCardText>
        <!-- Rôles actuels -->
        <div v-if="userRoles.length > 0" class="d-flex flex-wrap gap-2 mb-4">
          <VChip v-for="role in userRoles" :key="role.id" :color="getRoleColor(role.name)" size="small" closable
            @click:close="removeRole(role.id)">
            <VIcon :icon="getRoleIcon(role.name)" class="me-1" />
            {{ translateRole(role.name) }}
          </VChip>
        </div>
        <VAlert v-else type="info" variant="tonal" class="mb-4">
          <VIcon icon="ri-information-line" class="me-2" />
          {{ translateInterface('no_role_assigned') }}
        </VAlert>

        <!-- Message si l'utilisateur a déjà un rôle -->
        <VAlert v-if="userRoles.length > 0" type="error" variant="tonal" class="mb-4">
          <VIcon icon="ri-information-line" class="me-2" />
          {{ translateInterface('user_has_role_warning') }}
        </VAlert>

        <!-- Statistiques des rôles -->
        <div class="d-flex gap-4 text-caption">
          <div class="d-flex align-center">
            <VIcon icon="ri-shield-check-line" class="me-1 text-success" />
            <span>{{ userRoles.length }} {{ translateInterface('roles_assigned') }}</span>
          </div>
        </div>
      </VCardText>
    </VCard>

    <!-- Gestion des permissions -->
    <VCard class="mb-6" v-if="hasPermission(PermissionEnum.CAN_GIVE_PERMISSION)">
      <VCardTitle class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <VIcon icon="ri-key-line" class="me-2" />
          {{ translateInterface('permission_management') }}
        </div>
        <VBtn color="primary" size="small" @click="showPermissionDialog = true">
          <VIcon icon="ri-add-line" class="me-1" />
          {{ translateInterface('assign_permissions') }}
        </VBtn>
      </VCardTitle>

      <VCardText>
        <!-- Permissions actuelles -->
        <div v-if="userPermissionsList.length > 0" class="d-flex flex-wrap gap-2 mb-4">
          <VChip v-for="permission in userPermissionsList" :key="permission" :color="getPermissionColor(permission)"
            size="small" closable @click:close="removePermission(permission)">
            <VIcon :icon="getPermissionIcon(permission)" class="me-1" />
            {{ translatePermission(permission) }}
          </VChip>
        </div>
        <VAlert v-else type="info" variant="tonal" class="mb-4">
          <VIcon icon="ri-information-line" class="me-2" />
          {{ translateInterface('no_permissions_assigned') }}
        </VAlert>

        <!-- Statistiques des permissions -->
        <div class="d-flex gap-4 text-caption">
          <div class="d-flex align-center">
            <VIcon icon="ri-key-line" class="me-1 text-success" />
            <span>{{ userPermissionsList.length }} {{ translateInterface('permissions_assigned') }}</span>
          </div>
        </div>
      </VCardText>
    </VCard>
    
    <!-- Dialog pour assigner un rôle -->
    <VDialog v-model="showRoleDialog" max-width="480" transition="dialog-bottom-transition"  v-if="hasPermission(PermissionEnum.CAN_GIVE_ROLE)">
      <VCard class="shadow-lg">

        <!-- Header -->
        <VCardTitle class="flex items-center gap-2 text-lg font-semibold border-b pb-2">
          <VIcon icon="ri-shield-user-line" size="20" class="text-primary" />
          {{ translateInterface('assign_role') }}
        </VCardTitle>

        <!-- Content -->
        <VCardText class="py-6">
          <VSelect v-model="selectedRoleId" :items="availableRoles" item-title="translatedName" item-value="id"
            :label="translateInterface('select_role')" variant="outlined" density="comfortable" clearable
            prepend-inner-icon="ri-shield-star-line" />
        </VCardText>

        <!-- Actions -->
        <VCardActions class="px-6 pb-4 pt-2">
          <VSpacer />
          <VBtn variant="flat" color="error" class="me-2" @click="showRoleDialog = false">
            {{ translateInterface('cancel') }}
          </VBtn>
          <VBtn color="primary" variant="flat" class="rounded-lg shadow-sm" @click="assignSelectedRole"
            :disabled="!selectedRoleId || isLoading" :loading="isLoading">
            {{ translateInterface('assign') }}
          </VBtn>
        </VCardActions>

      </VCard>
    </VDialog>

    <!-- Dialog pour assigner des permissions -->
    <VDialog v-model="showPermissionDialog" max-width="1200" transition="dialog-bottom-transition" v-if="hasPermission(PermissionEnum.CAN_GIVE_PERMISSION)">
      <VCard class="shadow-lg">

        <!-- Header -->
        <VCardTitle class="flex items-center gap-2 text-lg font-semibold border-b pb-2">
          <VIcon icon="ri-key-line" size="20" class="text-primary" />
          {{ translateInterface('assign_permissions') }}
        </VCardTitle>

        <!-- Content -->
        <VCardText class="py-6">
          <!-- Filtres -->
          <div class="mb-4">
            <VRow>
              <VCol cols="12" md="6">
                <VSelect v-model="permissionFilter" :items="permissionCategories" item-title="label" item-value="value"
                  :label="translateInterface('filter_by_category')" variant="outlined" density="compact" clearable
                  prepend-inner-icon="ri-filter-line" />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField v-model="permissionSearch" :label="translateInterface('search_permission')" variant="outlined"
                  density="compact" clearable prepend-inner-icon="ri-search-line" />
              </VCol>
              <!-- <VCol cols="12" md="2">
                <VBtn v-if="permissionFilter || permissionSearch" color="secondary" variant="outlined" size="small"
                  block @click="clearFilters" prepend-icon="ri-refresh-line">
                  Réinitialiser
                </VBtn>
              </VCol> -->
            </VRow>
          </div>

          <!-- Indicateur de filtrage -->
          <div v-if="permissionFilter || permissionSearch" class="mb-3">
            <VChip color="info" size="small">
              <VIcon icon="ri-filter-line" class="me-1" />
              {{ filteredPermissions.length }} {{ translateInterface('permissions_found') }}
            </VChip>
          </div>

          <!-- Sélection des permissions -->
          <VSelect v-model="selectedPermissions" :items="filteredPermissions" item-title="label" item-value="value"
            :label="translateInterface('select_permissions')" variant="outlined" density="comfortable" multiple chips clearable
            prepend-inner-icon="ri-lock-unlock-line">
          </VSelect>
        </VCardText>

        <!-- Actions -->
        <VCardActions class="px-6 pb-4 pt-2">
          <VSpacer />
          <VBtn variant="text" color="secondary" class="me-2" @click="showPermissionDialog = false">
            {{ translateInterface('cancel') }}
          </VBtn>
          <VBtn color="primary" variant="flat" class="rounded-lg shadow-sm" @click="assignSelectedPermissions"
            :disabled="!selectedPermissions.length || isLoading" :loading="isLoading">
            {{ translateInterface('assign') }}
          </VBtn>
        </VCardActions>

      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRolePermissionManagement } from '@/composables/useRolePermissionManagement'
import { PermissionEnum, RoleEnum } from '@/types/permissions'
import { confirmAction } from '@/utils/confirm'
import {
  translateRole,
  translatePermission,
  translateInterface,
  getRoleDescription,
  getPermissionCategory,
  getPermissionIcon,
  getPermissionColor
} from '@/utils/translations'

import { useInstantPermissions } from '@/composables/useInstantPermissions'
const { hasPermission, hasPermissions } = useInstantPermissions()

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
  userRole,
  myRole,
  isLoading,
  canManageRoles,
  canManagePermissions,
  loadRoles,
  loadPermissions,
  loadUserPermissions,
  loadUserRole,
  loadMyRole,
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
const showRoleDialog = ref(false)
const showPermissionDialog = ref(false)
const permissionFilter = ref<string>('')
const permissionSearch = ref<string>('')

// Computed
const availableRoles = computed(() =>
  Array.isArray(roles.value) ? roles.value.map(role => ({
    ...role,
    translatedName: translateRole(role.name),
    description: getRoleDescription(role.name)
  })) : []
)

const availablePermissions = computed(() =>
  Array.isArray(permissions.value) ? permissions.value.map(permission => ({
    value: permission,
    label: translatePermission(permission),
    category: getPermissionCategory(permission),
    icon: getPermissionIcon(permission),
    color: getPermissionColor(permission)
  })) : []
)

const userRoles = computed(() => {
  if (!props.userInfo) return []
  // Utiliser directement userRole.value au lieu de getUserRoles
  if (userRole.value) {
    return [userRole.value]
  }
  return []
})

const userPermissionsList = computed(() => {
  if (!props.userInfo) return []
  // Utiliser directement userPermissions.value au lieu de getUserPermissions
  return userPermissions.value.map(p => p.permission)
})

// Catégories de permissions pour le filtre
const permissionCategories = computed(() => {
  const categories = new Set(availablePermissions.value.map(p => p.category))
  return Array.from(categories).map(category => ({
    label: category,
    value: category
  }))
})

// Permissions filtrées
const filteredPermissions = computed(() => {
  let filtered = availablePermissions.value

  // Filtre par catégorie
  if (permissionFilter.value) {
    filtered = filtered.filter(p => p.category === permissionFilter.value)
  }

  // Filtre par recherche textuelle
  if (permissionSearch.value) {
    const search = permissionSearch.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.label.toLowerCase().includes(search) ||
      p.value.toLowerCase().includes(search) ||
      p.category.toLowerCase().includes(search)
    )
  }

  return filtered
})

// Methods

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

// Les fonctions getPermissionColor et getPermissionIcon sont maintenant importées depuis translations.ts

const getUserTypeColor = (userType: string): string => {
  const colors: Record<string, string> = {
    admin: 'error',
    staff: 'warning',
    teacher: 'info',
    student: 'success',
  }
  return colors[userType] || 'default'
}

const getUserTypeIcon = (userType: string): string => {
  const icons: Record<string, string> = {
    admin: 'ri-admin-line',
    staff: 'ri-user-settings-line',
    teacher: 'ri-graduation-cap-line',
    student: 'ri-user-line',
  }
  return icons[userType] || 'ri-user-line'
}


const getUserTypeLabel = (userType: string): string => {
  const labels: Record<string, string> = {
    admin: 'Administrateur',
    staff: 'Personnel',
    teacher: 'Formateur',
    student: 'Étudiant',
  }
  return labels[userType] || userType
}

const assignSelectedRole = async () => {
  if (!props.userInfo || !selectedRoleId.value) {
    return
  }

  // Trouver le nom du rôle sélectionné
  const selectedRole = availableRoles.value.find(role => role.id === selectedRoleId.value)
  const roleName = selectedRole ? selectedRole.translatedName : 'ce rôle'

  // Fermer le modal temporairement pour afficher la confirmation
  showRoleDialog.value = false

  // Confirmation avant assignation
  const confirmed = await confirmAction({
    title: translateInterface('confirm_title'),
    html: `${translateInterface('confirm_assign_role')} <b>${roleName}</b> à cet utilisateur ? ${translateInterface('user_will_have_role_permissions')}`,
    cancelButtonText: `<span style="color:white">${translateInterface('cancel')}</span>`,
    confirmButtonText: `<span style="color:white">${translateInterface('assign')}</span>`,
    confirmButtonColor: "#b92858ff",
    cancelButtonColor: "#FF4C51",
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })

  if (!confirmed) {
    // Si l'utilisateur annule, rouvrir le modal
    showRoleDialog.value = true
    return
  }

  try {
    await assignRole({
      user_id: props.userInfo.id,
      role_id: selectedRoleId.value
    })
    selectedRoleId.value = null
    // Le modal reste fermé car l'opération a réussi
  } catch (error) {
    console.error('❌ Erreur lors de l\'assignation du rôle:', error)
    // En cas d'erreur, rouvrir le modal
    showRoleDialog.value = true
  }
}

const assignSelectedPermissions = async () => {
  if (!props.userInfo || !selectedPermissions.value.length) {
    return
  }

  // Fermer le modal temporairement pour afficher la confirmation
  showPermissionDialog.value = false

  // Confirmation avant assignation
  const confirmed = await confirmAction({
    title: translateInterface('confirm_title'),
    html: `${translateInterface('confirm_assign_permissions')} <b>${selectedPermissions.value.length}</b> permission(s) à cet utilisateur ? ${translateInterface('user_will_have_functionalities')}`,
    cancelButtonText: `<span style="color:white">${translateInterface('cancel')}</span>`,
    confirmButtonText: `<span style="color:white">${translateInterface('assign')}</span>`,
    confirmButtonColor: "#b92858ff",
    cancelButtonColor: "#FF4C51",
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })

  if (!confirmed) {
    // Si l'utilisateur annule, rouvrir le modal
    showPermissionDialog.value = true
    return
  }

  try {
    await assignPermissions({
      user_id: props.userInfo.id,
      permissions: selectedPermissions.value
    })
    selectedPermissions.value = []
    // Le modal reste fermé car l'opération a réussi
    // Réinitialiser les filtres
    permissionFilter.value = ''
    permissionSearch.value = ''
  } catch (error) {
    console.error('❌ Erreur lors de l\'assignation des permissions:', error)
    // En cas d'erreur, rouvrir le modal
    showPermissionDialog.value = true
  }
}

const removeRole = async (roleId: number) => {
  if (!props.userInfo) return

  const confirmed = await confirmAction({
    title: translateInterface('confirm_title'),
    text: translateInterface('confirm_revoke_role'),
    cancelButtonText: `<span style="color:white">${translateInterface('cancel')}</span>`,
    confirmButtonText: `<span style="color:white">${translateInterface('revoke')}</span>`,
    confirmButtonColor: "#b92858ff",
    cancelButtonColor: "#FF4C51",
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
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
    title: translateInterface('confirm_title'),
    html: `${translateInterface('confirm_revoke_permission')} <b>${translatePermission(permission)}</b> ? ${translateInterface('user_will_lose_capacity')}`,
    cancelButtonText: `<span style="color:white">${translateInterface('cancel')}</span>`,
    confirmButtonText: `<span style="color:white">${translateInterface('revoke')}</span>`,
    confirmButtonColor: "#b92858ff",
    cancelButtonColor: "#FF4C51",
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
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
    title: translateInterface('confirm_title'),
    text: translateInterface('confirm_assign_all_permissions'),
    cancelButtonText: `<span style="color:white">${translateInterface('cancel')}</span>`,
    confirmButtonText: `<span style="color:white">${translateInterface('assign')}</span>`,
    confirmButtonColor: "#b92858ff",
    cancelButtonColor: "#FF4C51",
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })

  if (!confirmed) return

  try {
    await assignPermissions({
      user_id: props.userInfo.id,
      permissions: Array.isArray(permissions.value) ? permissions.value : []
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
    title: translateInterface('confirm_title'),
    text: translateInterface('confirm_assign_manager_permissions'),
    cancelButtonText: `<span style="color:white">${translateInterface('cancel')}</span>`,
    confirmButtonText: `<span style="color:white">${translateInterface('assign')}</span>`,
    confirmButtonColor: "#b92858ff",
    cancelButtonColor: "#FF4C51",
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })

  if (!confirmed) return

  try {
    await assignPermissions({
      user_id: props.userInfo.id,
      permissions: managerPermissions
    })
  } catch (error) {
    console.error('Erreur lors de l\'assignation des permissions Gestionnaire:', error)
  }
}

const assignViewerPermissions = async () => {
  if (!props.userInfo) return

  const viewerPermissions = [
    PermissionEnum.CAN_VIEW_USER,
    PermissionEnum.CAN_VIEW_ROLE,
    PermissionEnum.CAN_VIEW_BLOG,
    PermissionEnum.CAN_VIEW_JOB_OFFER,
    PermissionEnum.CAN_VIEW_JOB_APPLICATION,
    PermissionEnum.CAN_VIEW_TRAINING,
    PermissionEnum.CAN_VIEW_STUDENT_APPLICATION,
    PermissionEnum.CAN_VIEW_RECLAMATION,
    PermissionEnum.CAN_VIEW_PAYMENT,
  ]

  const confirmed = await confirmAction({
    title: translateInterface('confirm_title'),
    text: translateInterface('confirm_assign_viewer_permissions'),
    cancelButtonText: `<span style="color:white">${translateInterface('cancel')}</span>`,
    confirmButtonText: `<span style="color:white">${translateInterface('assign')}</span>`,
    confirmButtonColor: "#b92858ff",
    cancelButtonColor: "#FF4C51",
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })

  if (!confirmed) return

  try {
    await assignPermissions({
      user_id: props.userInfo.id,
      permissions: viewerPermissions
    })
  } catch (error) {
    console.error('Erreur lors de l\'assignation des permissions Consultation:', error)
  }
}

const clearAllPermissions = async () => {
  if (!props.userInfo) return

  const confirmed = await confirmAction({
    title: translateInterface('confirm_title'),
    text: translateInterface('confirm_revoke_all'),
    cancelButtonText: `<span style="color:white">${translateInterface('cancel')}</span>`,
    confirmButtonText: `<span style="color:white">${translateInterface('revoke_all_permissions')}</span>`,
    confirmButtonColor: "#b92858ff",
    cancelButtonColor: "#FF4C51",
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
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

// Fonction de test pour diagnostiquer le problème
const testAssignRole = async () => {
  if (!props.userInfo) {
    return
  }

  // Test avec le premier rôle disponible
  if (Array.isArray(roles.value) && roles.value.length > 0) {
    const firstRole = roles.value[0]

    try {
      await assignRole({
        user_id: props.userInfo.id,
        role_id: firstRole.id
      })
    } catch (error) {
      console.error('❌ Test échoué:', error)
    }
  }
}

// Fonction de test pour les traductions
const testTranslations = () => {
  // Test des traductions de rôles
  if (Array.isArray(roles.value)) {
    roles.value.forEach(role => {
      translateRole(role.name)
    })
  }

  // Test des traductions de permissions
  if (Array.isArray(permissions.value)) {
    permissions.value.forEach(permission => {
      translatePermission(permission)
    })
  }

  // Test des permissions utilisateur
  userPermissionsList.value.forEach(permission => {
    translatePermission(permission)
  })

  // Test des rôles utilisateur
  userRoles.value.forEach(role => {
    translateRole(role.name)
  })
}

// Fonction pour réinitialiser les filtres
const clearFilters = () => {
  permissionFilter.value = ''
  permissionSearch.value = ''
}

// Watchers
watch(() => props.userInfo, (newUserInfo) => {
  if (newUserInfo) {
    loadUserPermissions(newUserInfo.id)
    loadUserRole(newUserInfo.id)
  }
}, { immediate: true })

// Réinitialiser les filtres quand le dialog se ferme
watch(showPermissionDialog, (isOpen) => {
  if (!isOpen) {
    permissionFilter.value = ''
    permissionSearch.value = ''
  }
})

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadRoles(),
    loadPermissions(),
    loadMyRole()
  ])
})
</script>

<style scoped>
.role-permission-manager {
  max-width: 100%;
}

.v-chip {
  margin: 2px;
}

.v-card {
  border-radius: 12px;
}

.v-card-title {
  padding: 16px 20px;
}

.v-card-text {
  padding: 16px 20px;
}
</style>