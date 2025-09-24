<template>
  <VCard class="mt-4">
    <VCardTitle>
      <VIcon icon="ri-bug-line" class="mr-2" />
      Testeur de Permissions
    </VCardTitle>
    <VCardText>
      <VRow>
        <VCol cols="12" md="6">
          <h3 class="text-h6 mb-3">État du système</h3>
          <VAlert v-if="isLoading" type="info" variant="tonal">
            <VIcon icon="ri-loader-4-line" class="mr-2" />
            Chargement des permissions...
          </VAlert>
          <VAlert v-else-if="error" type="error" variant="tonal">
            <VIcon icon="ri-error-warning-line" class="mr-2" />
            {{ error }}
          </VAlert>
          <VAlert v-else type="success" variant="tonal">
            <VIcon icon="ri-check-line" class="mr-2" />
            Permissions chargées avec succès
            <template v-if="permissionEvents.permissionsUpdated">
              <VIcon icon="ri-refresh-line" class="ml-2" color="primary" />
              <span class="ml-1 text-primary">Mise à jour en cours...</span>
            </template>
          </VAlert>

          <div class="mt-4">
            <h4 class="text-subtitle-1 mb-2">Informations utilisateur</h4>
            <VList density="compact">
              <VListItem>
                <VListItemTitle>Rôle actuel</VListItemTitle>
                <VListItemSubtitle>{{ currentRole }}</VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle>Rôle enum</VListItemTitle>
                <VListItemSubtitle>{{ currentRoleEnum }}</VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle>Nombre de permissions</VListItemTitle>
                <VListItemSubtitle>{{ userPermissions.length }}</VListItemSubtitle>
              </VListItem>
            </VList>
          </div>
        </VCol>

        <VCol cols="12" md="6">
          <h3 class="text-h6 mb-3">Test de permissions</h3>
          <VForm @submit.prevent="testPermissions">
            <VSelect
              v-model="selectedPermission"
              :items="availablePermissions"
              item-title="label"
              item-value="value"
              label="Sélectionner une permission à tester"
              class="mb-3"
            />
            <VBtn type="submit" color="primary" :loading="isTesting">
              Tester la permission
            </VBtn>
          </VForm>

          <div v-if="testResult !== null" class="mt-4">
            <VAlert 
              :type="testResult ? 'success' : 'error'" 
              variant="tonal"
            >
              <VIcon :icon="testResult ? 'ri-check-line' : 'ri-close-line'" class="mr-2" />
              {{ testResult ? 'Permission accordée' : 'Permission refusée' }}
            </VAlert>
          </div>
        </VCol>
      </VRow>

      <VDivider class="my-6" />

      <VRow>
        <VCol cols="12">
          <h3 class="text-h6 mb-3">Permissions actuelles</h3>
          <VChipGroup v-if="userPermissions.length > 0">
            <VChip 
              v-for="permission in userPermissions" 
              :key="permission"
              color="primary"
              variant="tonal"
              size="small"
            >
              {{ permission }}
            </VChip>
          </VChipGroup>
          <VAlert v-else type="info" variant="tonal">
            Aucune permission trouvée
          </VAlert>
        </VCol>
      </VRow>

      <VRow>
        <VCol cols="12">
          <h3 class="text-h6 mb-3">Test de permissions spécifiques</h3>
          <VRow>
            <VCol cols="12" sm="6" md="4">
              <VCard variant="outlined">
                <VCardText>
                  <div class="d-flex align-center mb-2">
                    <VIcon :icon="canViewUsers ? 'ri-check-line' : 'ri-close-line'" 
                           :color="canViewUsers ? 'success' : 'error'" 
                           class="mr-2" />
                    <span class="font-weight-medium">Voir les utilisateurs</span>
                  </div>
                  <VChip size="x-small" :color="canViewUsers ? 'success' : 'error'">
                    {{ canViewUsers ? 'Autorisé' : 'Refusé' }}
                  </VChip>
                </VCardText>
              </VCard>
            </VCol>

            <VCol cols="12" sm="6" md="4">
              <VCard variant="outlined">
                <VCardText>
                  <div class="d-flex align-center mb-2">
                    <VIcon :icon="canCreateUsers ? 'ri-check-line' : 'ri-close-line'" 
                           :color="canCreateUsers ? 'success' : 'error'" 
                           class="mr-2" />
                    <span class="font-weight-medium">Créer des utilisateurs</span>
                  </div>
                  <VChip size="x-small" :color="canCreateUsers ? 'success' : 'error'">
                    {{ canCreateUsers ? 'Autorisé' : 'Refusé' }}
                  </VChip>
                </VCardText>
              </VCard>
            </VCol>

            <VCol cols="12" sm="6" md="4">
              <VCard variant="outlined">
                <VCardText>
                  <div class="d-flex align-center mb-2">
                    <VIcon :icon="canViewBlogs ? 'ri-check-line' : 'ri-close-line'" 
                           :color="canViewBlogs ? 'success' : 'error'" 
                           class="mr-2" />
                    <span class="font-weight-medium">Voir les blogs</span>
                  </div>
                  <VChip size="x-small" :color="canViewBlogs ? 'success' : 'error'">
                    {{ canViewBlogs ? 'Autorisé' : 'Refusé' }}
                  </VChip>
                </VCardText>
              </VCard>
            </VCol>

            <VCol cols="12" sm="6" md="4">
              <VCard variant="outlined">
                <VCardText>
                  <div class="d-flex align-center mb-2">
                    <VIcon :icon="canCreateBlogs ? 'ri-check-line' : 'ri-close-line'" 
                           :color="canCreateBlogs ? 'success' : 'error'" 
                           class="mr-2" />
                    <span class="font-weight-medium">Créer des blogs</span>
                  </div>
                  <VChip size="x-small" :color="canCreateBlogs ? 'success' : 'error'">
                    {{ canCreateBlogs ? 'Autorisé' : 'Refusé' }}
                  </VChip>
                </VCardText>
              </VCard>
            </VCol>

            <VCol cols="12" sm="6" md="4">
              <VCard variant="outlined">
                <VCardText>
                  <div class="d-flex align-center mb-2">
                    <VIcon :icon="canGivePermissions ? 'ri-check-line' : 'ri-close-line'" 
                           :color="canGivePermissions ? 'success' : 'error'" 
                           class="mr-2" />
                    <span class="font-weight-medium">Gérer les permissions</span>
                  </div>
                  <VChip size="x-small" :color="canGivePermissions ? 'success' : 'error'">
                    {{ canGivePermissions ? 'Autorisé' : 'Refusé' }}
                  </VChip>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VCol>
      </VRow>

      <VRow>
        <VCol cols="12">
          <VBtn @click="refreshPermissions" :loading="isLoading" color="primary">
            <VIcon icon="ri-refresh-line" class="mr-2" />
            Actualiser les permissions
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePermissions } from '@/composables/usePermissions'
import { usePermissionEvents } from '@/utils/permissionEvents'
import { PermissionEnum } from '@/types/permissions'

const {
  currentRole,
  currentRoleEnum,
  userPermissions,
  isLoading,
  error,
  loadUserPermissions,
  hasPermission,
  canViewUsers,
  canCreateUsers,
  canViewBlogs,
  canCreateBlogs,
  canGivePermissions
} = usePermissions()

// Écouter les événements de permissions
const { permissionEvents } = usePermissionEvents()

const selectedPermission = ref('')
const testResult = ref<boolean | null>(null)
const isTesting = ref(false)

const availablePermissions = computed(() => {
  return Object.entries(PermissionEnum).map(([key, value]) => ({
    label: `${key} (${value})`,
    value: value
  }))
})

const testPermissions = async () => {
  if (!selectedPermission.value) return
  
  isTesting.value = true
  testResult.value = null
  
  // Simuler un délai pour le test
  await new Promise(resolve => setTimeout(resolve, 500))
  
  testResult.value = hasPermission(selectedPermission.value as PermissionEnum)
  isTesting.value = false
}

const refreshPermissions = async () => {
  await loadUserPermissions()
}

onMounted(() => {
  loadUserPermissions()
})
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}
</style>
