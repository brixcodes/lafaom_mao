<template>
  <VCard class="mt-4">
    <VCardTitle>
      <h2 class="text-h5 mb-2">Gestion des rôles utilisateur</h2>
    </VCardTitle>

    <VCardText>
      <VRow>
        <!-- Liste des rôles disponibles -->
        <VCol cols="12" md="6">
          <VCard variant="outlined">
            <VCardTitle class="text-h6">
              Rôles disponibles
              <VProgressCircular v-if="isLoading" size="16" indeterminate class="ml-2" />
            </VCardTitle>
            <VCardText>
              <VList v-if="availableRolesForAssignment.length > 0">
                <VListItem v-for="role in availableRolesForAssignment" :key="role.id" :title="role.name"
                  :subtitle="role.description">
                  <template #append>
                    <VBtn size="small" variant="flat" color="primary" @click="assignRole(role)"
                      :loading="assigningRole === role.id">
                      Assigner
                    </VBtn>
                  </template>
                </VListItem>
              </VList>
              <VAlert v-else type="info" variant="tonal">
                Tous les rôles disponibles sont déjà assignés à cet utilisateur
              </VAlert>
            </VCardText>
          </VCard>
        </VCol>

        <!-- Rôles assignés à l'utilisateur -->
        <VCol cols="12" md="6">
          <VCard variant="outlined">
            <VCardTitle class="text-h6">
              Rôles de l'utilisateur
              <VProgressCircular v-if="isLoading" size="16" indeterminate class="ml-2" />
            </VCardTitle>
            <VCardText>
              <VList v-if="userRoles.length > 0">
                <VListItem v-for="role in userRoles" :key="role.id" :title="role.name" :subtitle="role.description">
                  <template #append>
                    <VBtn size="small" color="error" variant="text" @click="revokeRole(role)"
                      :loading="revokingRole === role.id">
                      Révoquer
                    </VBtn>
                  </template>
                </VListItem>
              </VList>
              <VAlert v-else type="info" variant="tonal">
                <VIcon icon="ri-information-line" class="mr-2" />
                Aucun rôle assigné à cet utilisateur. Utilisez la section "Rôles disponibles" pour assigner un rôle.
              </VAlert>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <!-- Permissions héritées des rôles -->
      <VRow class="mt-4">
        <VCol cols="12">
          <VCard variant="outlined">
            <VCardTitle class="text-h6">
              <VIcon icon="ri-key-line" class="mr-2" />
              Permissions héritées des rôles
            </VCardTitle>
            <VCardText>
              <VChipGroup v-if="inheritedPermissions.length > 0" multiple>
                <VChip v-for="permission in inheritedPermissions" :key="permission.permission"
                  :text="permission.permission" color="primary" variant="tonal" size="small" />
              </VChipGroup>
              <VAlert v-else type="info" variant="tonal">
                <VIcon icon="ri-key-line" class="mr-2" />
                Aucune permission héritée. Les permissions apparaîtront ici lorsqu'un rôle sera assigné à l'utilisateur.
              </VAlert>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
      
      <!-- Section de debug (développement uniquement) -->
      <VRow v-if="isDevelopment" class="mt-4">
        <VCol cols="12">
          <VExpansionPanels>
            <VExpansionPanel title="🐛 Debug - État actuel">
              <VExpansionPanelText>
                <div class="debug-section">
                  <h4>Rôles disponibles ({{ availableRoles.length }}) :</h4>
                  <pre>{{ JSON.stringify(availableRoles, null, 2) }}</pre>
                  
                  <h4 class="mt-4">Permissions utilisateur ({{ userPermissions.length }}) :</h4>
                  <pre>{{ JSON.stringify(userPermissions, null, 2) }}</pre>
                  
                  <h4 class="mt-4">Rôles utilisateur calculés ({{ userRoles.length }}) :</h4>
                  <pre>{{ JSON.stringify(userRoles, null, 2) }}</pre>
                  
                  <h4 class="mt-4">Permissions héritées calculées ({{ inheritedPermissions.length }}) :</h4>
                  <pre>{{ JSON.stringify(inheritedPermissions, null, 2) }}</pre>
                  
                  <h4 class="mt-4">État des opérations :</h4>
                  <p><strong>Loading:</strong> {{ isLoading }}</p>
                  <p><strong>Assignation en cours:</strong> {{ assigningRole }}</p>
                  <p><strong>Révocation en cours:</strong> {{ revokingRole }}</p>
                </div>
              </VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>
        </VCol>
      </VRow>
    </VCardText>

  </VCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { permissionService } from '@/services/api/permissions'
import type { AssignRoleInput } from '@/types/permissions'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'

interface Role {
  id: number
  name: string
  description: string
}

interface Permission {
  user_id: string | null
  role_id: number | null
  permission: string
}

interface Props {
  userId: string
}

const props = defineProps<Props>()

const availableRoles = ref<Role[]>([])
const userPermissions = ref<Permission[]>([])
const assigningRole = ref<number | null>(null)
const revokingRole = ref<number | null>(null)
const isLoading = ref(false)

// Développement uniquement
const isDevelopment = ref(import.meta.env.DEV)

// Computed
const userRoles = computed(() => {
  const roleIds = [...new Set(userPermissions.value.filter(p => p.role_id).map(p => p.role_id))]
  return availableRoles.value.filter(role => roleIds.includes(role.id))
})

const inheritedPermissions = computed(() => {
  return userPermissions.value.filter(p => p.role_id !== null)
})

// Computed pour les rôles disponibles (excluant ceux déjà assignés)
const availableRolesForAssignment = computed(() => {
  const userRoleIds = userRoles.value.map(role => role.id)
  return availableRoles.value.filter(role => !userRoleIds.includes(role.id))
})

// Methods
const fetchRoles = async () => {
  try {
    const response = await permissionService.getRoles()
    console.log('🗓️ Réponse rôles brute:', response)
    
    // Extraire les données selon la structure de la réponse API
    let rolesData: any[] = []
    if (response && (response as any).data) {
      rolesData = Array.isArray((response as any).data) ? (response as any).data : []
    } else if (Array.isArray(response)) {
      rolesData = response
    }
    
    availableRoles.value = rolesData
    console.log('🔍 Rôles traités:', availableRoles.value)
  } catch (error) {
    console.error('Erreur lors du chargement des rôles:', error)
    
    // En production, afficher l'erreur et utiliser des rôles par défaut
    const message = 'Erreur lors du chargement des rôles. Utilisation des rôles par défaut.'
    showToast({ message, type: 'warning' })
    
    // Rôles par défaut en cas d'échec
    availableRoles.value = [
      { id: 1, name: 'SUPER_ADMIN', description: 'Super administrateur avec tous les droits' },
      { id: 2, name: 'ADMIN', description: 'Administrateur avec droits limités' },
      { id: 3, name: 'HR_MANAGER', description: 'Responsable RH pour la gestion des offres d\'emploi' },
      { id: 4, name: 'USER', description: 'Utilisateur standard avec droits de base' }
    ]
  }
}

const fetchUserPermissions = async () => {
  if (isLoading.value) return // Éviter les appels simultanés
  
  try {
    isLoading.value = true
    
    // Sauvegarder les permissions précédentes pour comparaison
    const previousPermissions = JSON.stringify(userPermissions.value)
    
    const response = await permissionService.getUserPermissions(props.userId)
    
    console.log('🗓️ Réponse permissions brute:', response)
    
    // Extraire les données selon la structure de la réponse API
    let permissionsData: any[] = []
    if (response && (response as any).data) {
      permissionsData = Array.isArray((response as any).data) ? (response as any).data : []
    } else if (Array.isArray(response)) {
      permissionsData = response
    }
    
    userPermissions.value = permissionsData
    
    // Comparer avec les permissions précédentes
    const currentPermissions = JSON.stringify(userPermissions.value)
    const hasChanged = previousPermissions !== currentPermissions
    
    console.log('📊 Permissions traitées:', userPermissions.value)
    console.log(`🔄 Changement détecté: ${hasChanged ? '✅ OUI' : '❌ NON'}`)
    
    if (hasChanged) {
      console.log('🔴 Avant:', JSON.parse(previousPermissions))
      console.log('🟢 Après:', userPermissions.value)
    }
  } catch (error) {
    console.error('Erreur lors du chargement des permissions:', error)
    
    // En production, on affiche l'erreur à l'utilisateur
    const message = (error as any)?.message || 'Erreur lors du chargement des permissions utilisateur'
    showToast({ message, type: 'error' })
    
    // Réinitialiser les permissions en cas d'erreur
    userPermissions.value = []
  } finally {
    isLoading.value = false
  }
}

const assignRole = async (role: Role) => {
  // Vérifier s'il faut révoquer un rôle existant
  let confirmText = `Souhaitez-vous vraiment assigner le rôle "${role.name}" à cet utilisateur ?`
  
  if (userRoles.value.length > 0) {
    const currentRoleName = userRoles.value[0].name
    confirmText = `Cet utilisateur a déjà le rôle "${currentRoleName}". Voulez-vous le remplacer par "${role.name}" ?`
  }

  const confirmed = await confirmAction({
    method: 'post',
    title: 'Assignation de rôle',
    text: confirmText,
    confirmButtonText: '<span style="color:white">Confirmer</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  })

  if (!confirmed) return

  try {
    assigningRole.value = role.id
    console.log('🎯 Début assignation rôle:', { userId: props.userId, roleId: role.id, roleName: role.name })
    
    // Si l'utilisateur a déjà un rôle, le révoquer d'abord
    if (userRoles.value.length > 0) {
      const currentRole = userRoles.value[0]
      console.log('♾️ Révocation de l\'ancien rôle:', currentRole.name)
      
      const revokeResponse = await permissionService.revokeRole({ user_id: props.userId, role_id: currentRole.id })
      console.log('✅ Révocation terminée:', revokeResponse)
      
      showToast({ message: `Rôle "${currentRole.name}" révoqué`, type: 'info' })
      
      // Attendre un peu pour que l'API se synchronise
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    // Assigner le nouveau rôle
    console.log('🎆 Assignation du nouveau rôle:', role.name)
    const assignResponse = await permissionService.assignRole({ user_id: props.userId, role_id: role.id })
    console.log('✅ Assignation terminée:', assignResponse)
    
    // Attendre un peu avant de rafraîchir
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mettre à jour les permissions
    console.log('🔄 Rafraîchissement des permissions...')
    await fetchUserPermissions()
    
    showToast({ message: `Rôle "${role.name}" assigné avec succès`, type: 'success' })
  } catch (error) {
    console.error('Erreur lors de l\'assignation du rôle:', error)
    const message = (error as any)?.message || 'Erreur lors de l\'assignation du rôle'
    showToast({ message, type: 'error' })
  } finally {
    assigningRole.value = null
  }
}

const revokeRole = async (role: Role) => {
  const confirmed = await confirmAction({
    method: 'delete',
    title: 'Révocation de rôle',
    text: `Êtes-vous sûr de vouloir révoquer le rôle "${role.name}" de cet utilisateur ?\n\nCela supprimera toutes les permissions associées à ce rôle.`,
    confirmButtonText: '<span style="color:white">Révoquer</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
  })

  if (!confirmed) return

  try {
    revokingRole.value = role.id
    console.log('🎯 Début révocation rôle:', { userId: props.userId, roleId: role.id, roleName: role.name })
    
    // Révoquer le rôle
    const revokeResponse = await permissionService.revokeRole({ user_id: props.userId, role_id: role.id })
    console.log('✅ Révocation API terminée:', revokeResponse)
    
    // Mettre à jour immédiatement les permissions localement pour un feedback rapide
    userPermissions.value = userPermissions.value.filter(p => p.role_id !== role.id)
    console.log('📊 Permissions locales mises à jour:', userPermissions.value)
    
    // Attendre un peu pour que l'API se synchronise
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Puis rafraîchir depuis l'API pour être sûr
    console.log('🔄 Rafraîchissement des permissions...')
    await fetchUserPermissions()
    
    showToast({ message: `Rôle "${role.name}" révoqué avec succès`, type: 'success' })
  } catch (error) {
    console.error('Erreur lors de la révocation du rôle:', error)
    const message = (error as any)?.message || 'Erreur lors de la révocation du rôle'
    showToast({ message, type: 'error' })
    
    // En cas d'erreur, rafraîchir les données depuis l'API
    await fetchUserPermissions()
  } finally {
    revokingRole.value = null
  }
}

// Watchers
watch(() => props.userId, async (newUserId) => {
  if (newUserId) {
    await fetchUserPermissions()
  }
})

// Lifecycle
onMounted(async () => {
  await fetchRoles()
  if (props.userId) {
    await fetchUserPermissions()
  }
})
</script>

<style scoped>
.v-list-item {
  padding: 8px 16px;
}

.v-chip {
  margin: 2px;
}

.debug-section pre {
  background-color: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  overflow-x: auto;
  max-height: 200px;
}

.debug-section h4 {
  color: #1976d2;
  margin: 16px 0 8px 0;
}
</style>
