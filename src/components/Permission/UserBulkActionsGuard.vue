<template>
  <div v-if="hasSelection">
    <VCard variant="tonal" color="primary" class="mb-4">
      <VCardText>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <VIcon icon="ri-checkbox-multiple-line" class="mr-2" />
            <span class="font-weight-medium">
              {{ selectedCount }} utilisateur(s) sélectionné(s)
            </span>
          </div>
          
          <div class="d-flex gap-2">
            <!-- Actions en lot avec protection -->
            <PermissionGuard 
              :permissions="[PermissionEnum.CAN_UPDATE_USER]"
              :show-fallback="false"
            >
              <VBtn
                variant="outlined"
                color="success"
                prepend-icon="ri-check-line"
                @click="$emit('bulk-activate')"
              >
                Activer
              </VBtn>
            </PermissionGuard>

            <PermissionGuard 
              :permissions="[PermissionEnum.CAN_UPDATE_USER]"
              :show-fallback="false"
            >
              <VBtn
                variant="outlined"
                color="warning"
                prepend-icon="ri-pause-line"
                @click="$emit('bulk-deactivate')"
              >
                Désactiver
              </VBtn>
            </PermissionGuard>

            <PermissionGuard 
              :permissions="[PermissionEnum.CAN_DELETE_USER]"
              :show-fallback="false"
            >
              <VBtn
                variant="outlined"
                color="error"
                prepend-icon="ri-delete-bin-line"
                @click="$emit('bulk-delete')"
              >
                Supprimer
              </VBtn>
            </PermissionGuard>

            <PermissionGuard 
              :permissions="[PermissionEnum.CAN_GIVE_PERMISSION]"
              :show-fallback="false"
            >
              <VBtn
                variant="outlined"
                color="secondary"
                prepend-icon="ri-key-line"
                @click="$emit('bulk-permissions')"
              >
                Permissions
              </VBtn>
            </PermissionGuard>

            <PermissionGuard 
              :permissions="[PermissionEnum.CAN_GIVE_ROLE]"
              :show-fallback="false"
            >
              <VBtn
                variant="outlined"
                color="info"
                prepend-icon="ri-user-settings-line"
                @click="$emit('bulk-roles')"
              >
                Rôles
              </VBtn>
            </PermissionGuard>

            <!-- Bouton de désélection -->
            <VBtn
              variant="text"
              color="default"
              prepend-icon="ri-close-line"
              @click="$emit('clear-selection')"
            >
              Désélectionner
            </VBtn>
          </div>
        </div>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePermissions } from '@/composables/usePermissions'
import { PermissionEnum } from '@/types/permissions'
import PermissionGuard from './PermissionGuard.vue'

interface Props {
  selectedCount: number
  hasSelection: boolean
}

defineProps<Props>()

defineEmits<{
  'bulk-activate': []
  'bulk-deactivate': []
  'bulk-delete': []
  'bulk-permissions': []
  'bulk-roles': []
  'clear-selection': []
}>()

const { canUpdateUsers, canDeleteUsers, canGivePermissions, canGiveRoles } = usePermissions()
</script>
