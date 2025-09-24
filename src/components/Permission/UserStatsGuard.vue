<template>
  <VRow>
    <!-- Statistiques générales -->
    <VCol cols="12" md="3">
      <PermissionGuard 
        :permissions="[PermissionEnum.CAN_VIEW_USER]"
        :show-fallback="true"
      >
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VIcon icon="ri-user-line" color="primary" size="24" class="mr-3" />
              <div>
                <div class="text-h6">{{ stats.total }}</div>
                <div class="text-caption text-muted">Total utilisateurs</div>
              </div>
            </div>
          </VCardText>
        </VCard>
        <template #fallback>
          <VCard>
            <VCardText>
              <div class="d-flex align-center">
                <VIcon icon="ri-user-line" color="grey" size="24" class="mr-3" />
                <div>
                  <div class="text-h6">***</div>
                  <div class="text-caption text-muted">Total utilisateurs</div>
                </div>
              </div>
            </VCardText>
          </VCard>
        </template>
      </PermissionGuard>
    </VCol>

    <!-- Statistiques par type -->
    <VCol cols="12" md="3">
      <PermissionGuard 
        :permissions="[PermissionEnum.CAN_VIEW_USER]"
        :show-fallback="true"
      >
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VIcon icon="ri-admin-line" color="success" size="24" class="mr-3" />
              <div>
                <div class="text-h6">{{ stats.admin }}</div>
                <div class="text-caption text-muted">Administrateurs</div>
              </div>
            </div>
          </VCardText>
        </VCard>
        <template #fallback>
          <VCard>
            <VCardText>
              <div class="d-flex align-center">
                <VIcon icon="ri-admin-line" color="grey" size="24" class="mr-3" />
                <div>
                  <div class="text-h6">***</div>
                  <div class="text-caption text-muted">Administrateurs</div>
                </div>
              </div>
            </VCardText>
          </VCard>
        </template>
      </PermissionGuard>
    </VCol>

    <VCol cols="12" md="3">
      <PermissionGuard 
        :permissions="[PermissionEnum.CAN_VIEW_USER]"
        :show-fallback="true"
      >
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VIcon icon="ri-graduation-cap-line" color="info" size="24" class="mr-3" />
              <div>
                <div class="text-h6">{{ stats.teacher }}</div>
                <div class="text-caption text-muted">Enseignants</div>
              </div>
            </div>
          </VCardText>
        </VCard>
        <template #fallback>
          <VCard>
            <VCardText>
              <div class="d-flex align-center">
                <VIcon icon="ri-graduation-cap-line" color="grey" size="24" class="mr-3" />
                <div>
                  <div class="text-h6">***</div>
                  <div class="text-caption text-muted">Enseignants</div>
                </div>
              </div>
            </VCardText>
          </VCard>
        </template>
      </PermissionGuard>
    </VCol>

    <VCol cols="12" md="3">
      <PermissionGuard 
        :permissions="[PermissionEnum.CAN_VIEW_USER]"
        :show-fallback="true"
      >
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VIcon icon="ri-user-3-line" color="warning" size="24" class="mr-3" />
              <div>
                <div class="text-h6">{{ stats.student }}</div>
                <div class="text-caption text-muted">Étudiants</div>
              </div>
            </div>
          </VCardText>
        </VCard>
        <template #fallback>
          <VCard>
            <VCardText>
              <div class="d-flex align-center">
                <VIcon icon="ri-user-3-line" color="grey" size="24" class="mr-3" />
                <div>
                  <div class="text-h6">***</div>
                  <div class="text-caption text-muted">Étudiants</div>
                </div>
              </div>
            </VCardText>
          </VCard>
        </template>
      </PermissionGuard>
    </VCol>

    <!-- Statistiques de statut -->
    <VCol cols="12" md="6">
      <PermissionGuard 
        :permissions="[PermissionEnum.CAN_VIEW_USER]"
        :show-fallback="true"
      >
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VIcon icon="ri-check-line" color="success" size="24" class="mr-3" />
              <div>
                <div class="text-h6">{{ stats.active }}</div>
                <div class="text-caption text-muted">Utilisateurs actifs</div>
              </div>
            </div>
          </VCardText>
        </VCard>
        <template #fallback>
          <VCard>
            <VCardText>
              <div class="d-flex align-center">
                <VIcon icon="ri-check-line" color="grey" size="24" class="mr-3" />
                <div>
                  <div class="text-h6">***</div>
                  <div class="text-caption text-muted">Utilisateurs actifs</div>
                </div>
              </div>
            </VCardText>
          </VCard>
        </template>
      </PermissionGuard>
    </VCol>

    <VCol cols="12" md="6">
      <PermissionGuard 
        :permissions="[PermissionEnum.CAN_VIEW_USER]"
        :show-fallback="true"
      >
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VIcon icon="ri-pause-line" color="error" size="24" class="mr-3" />
              <div>
                <div class="text-h6">{{ stats.inactive }}</div>
                <div class="text-caption text-muted">Utilisateurs inactifs</div>
              </div>
            </div>
          </VCardText>
        </VCard>
        <template #fallback>
          <VCard>
            <VCardText>
              <div class="d-flex align-center">
                <VIcon icon="ri-pause-line" color="grey" size="24" class="mr-3" />
                <div>
                  <div class="text-h6">***</div>
                  <div class="text-caption text-muted">Utilisateurs inactifs</div>
                </div>
              </div>
            </VCardText>
          </VCard>
        </template>
      </PermissionGuard>
    </VCol>

    <!-- Message si aucune permission -->
    <VCol cols="12" v-if="!canViewUsers">
      <VAlert type="warning" variant="tonal">
        <VIcon icon="ri-shield-cross-line" class="mr-2" />
        <strong>Accès restreint</strong>
        <p class="mt-2 mb-0">
          Vous n'avez pas les permissions nécessaires pour consulter les statistiques des utilisateurs.
        </p>
      </VAlert>
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePermissions } from '@/composables/usePermissions'
import { PermissionEnum } from '@/types/permissions'
import PermissionGuard from './PermissionGuard.vue'

interface UserStats {
  total: number
  admin: number
  teacher: number
  student: number
  active: number
  inactive: number
}

interface Props {
  stats: UserStats
}

defineProps<Props>()

const { canViewUsers } = usePermissions()
</script>
