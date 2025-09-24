<template>
  <VCard class="mt-2">
    <VCardText>
      <h2 class="text-h5 mb-2">Permissions de l'utilisateurs</h2>
      <div class="mb-4">
        <!-- Permissions à assigner -->
        <VRow class="align-center">
          <VCol cols="11">
            <VSelect v-model="selectedAssignPermissions" :items="assignablePermissions" item-title="label"
              item-value="value" multiple chips label="Sélectionner les permissions à assigner" />
          </VCol>
          <VCol cols="1">
            <VBtn color="primary" class="mt-2" @click="assignPermissions" block>
              Assigner
            </VBtn>
          </VCol>
        </VRow>

        <!-- Permissions à retirer -->
        <VRow class="align-center">
          <VCol cols="11">
            <VSelect v-model="selectedRevokePermissions" :items="revocablePermissions" item-title="label"
              item-value="value" multiple chips label="Sélectionner les permissions à retirer" />
          </VCol>
          <VCol cols="1">
            <VBtn color="error" class="mt-2" @click="revokePermissions" block>
              Retirer
            </VBtn>
          </VCol>
        </VRow>

        <!-- Affichage des permissions actuelles -->
        <VDivider class="my-6" />

        <VRow>
          <!-- Permissions directes -->
          <VCol cols="12" md="6">
            <h3 class="text-h6 mb-3">
              <VIcon icon="ri-key-2-line" class="mr-2" color="primary" />
              Permissions directes ({{ directPermissions.length }})
            </h3>
            <VChipGroup v-if="directPermissions.length > 0" class="mb-4">
              <VChip v-for="permission in directPermissions" :key="permission.permission" color="primary"
                variant="tonal" size="small">
                {{ getPermissionLabel(permission.permission) }}
              </VChip>
            </VChipGroup>
            <VAlert v-else type="info" variant="tonal">
              Aucune permission directe assignée
            </VAlert>
          </VCol>

          <!-- Permissions héritées des rôles -->
          <VCol cols="12" md="6">
            <h3 class="text-h6 mb-3">
              <VIcon icon="ri-shield-user-line" class="mr-2" color="secondary" />
              Permissions héritées des rôles ({{ inheritedPermissions.length }})
            </h3>
            <VChipGroup v-if="inheritedPermissions.length > 0" class="mb-4">
              <VChip v-for="permission in inheritedPermissions" :key="permission.permission" color="secondary"
                variant="tonal" size="small">
                {{ getPermissionLabel(permission.permission) }}
              </VChip>
            </VChipGroup>
            <VAlert v-else type="info" variant="tonal">
              Aucune permission héritée des rôles
            </VAlert>
          </VCol>
        </VRow>

      </div>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { permissionService } from '@/services/api'
import { showToast } from '@/components/toast/toastManager'
import { PermissionEnum } from '@/types/permissions'
import { confirmAction } from '@/utils/confirm'
import { usePermissionStore } from '@/stores/permission'
import { useAuthStore } from '@/stores/auth'
import { triggerPermissionUpdate } from '@/utils/permissionEvents'

interface Permission {
  user_id: string | null
  role_id: number | null
  permission: string
}

const props = defineProps<{ userId: string }>()
const userPermissions = ref<Permission[]>([])
const allPermissions = ref<{ label: string; value: string }[]>([])
const selectedAssignPermissions = ref<string[]>([])
const selectedRevokePermissions = ref<string[]>([])

// Store de permissions pour rafraîchir les permissions globales
const permissionStore = usePermissionStore()

const assignablePermissions = computed(() => {
  // Récupérer toutes les permissions de l'utilisateur (directes + héritées des rôles)
  const allUserPermissions = userPermissions.value.map(p => p.permission)

  // Filtrer pour ne montrer que les permissions que l'utilisateur n'a pas
  return allPermissions.value.filter(p => !allUserPermissions.includes(p.value))
})
const permissionLabels: Record<string, string> = {
  // User permissions
  CAN_VIEW_USER: 'Consulter les utilisateurs',
  CAN_CREATE_USER: 'Créer un utilisateur',
  CAN_UPDATE_USER: 'Modifier un utilisateur',
  CAN_DELETE_USER: 'Supprimer un utilisateur',
  
  // Role permissions
  CAN_VIEW_ROLE: 'Consulter les rôles',
  CAN_CREATE_ROLE: 'Créer un rôle',
  CAN_UPDATE_ROLE: 'Modifier un rôle',
  CAN_DELETE_ROLE: 'Supprimer un rôle',
  CAN_GIVE_ROLE: 'Donner un rôle',
  CAN_GIVE_PERMISSION: 'Donner une permission',
  
  // Blog permissions
  CAN_VIEW_BLOG: 'Consulter les blogs',
  CAN_CREATE_BLOG: 'Créer un blog',
  CAN_UPDATE_BLOG: 'Modifier un blog',
  CAN_DELETE_BLOG: 'Supprimer un blog',
  CAN_PUBLISH_BLOG: 'Publier un blog',
  
  // Job offer permissions
  CAN_VIEW_JOB_OFFER: 'Consulter les offres d\'emploi',
  CAN_CREATE_JOB_OFFER: 'Créer une offre d\'emploi',
  CAN_UPDATE_JOB_OFFER: 'Modifier une offre d\'emploi',
  CAN_DELETE_JOB_OFFER: 'Supprimer une offre d\'emploi',
  
  // Job application permissions
  CAN_VIEW_JOB_APPLICATION: 'Consulter les candidatures emploi',
  CAN_CHANGE_JOB_APPLICATION_STATUS: 'Modifier le statut des candidatures emploi',
  CAN_DELETE_JOB_ATTACHMENT: 'Supprimer les pièces jointes des candidatures',
  
  // Training session permissions
  CAN_VIEW_TRAINING_SESSION: 'Consulter les sessions de formation',
  CAN_CREATE_TRAINING_SESSION: 'Créer une session de formation',
  CAN_UPDATE_TRAINING_SESSION: 'Modifier une session de formation',
  CAN_DELETE_TRAINING_SESSION: 'Supprimer une session de formation',
  
  // Training permissions
  CAN_VIEW_TRAINING: 'Consulter les formations',
  CAN_CREATE_TRAINING: 'Créer une formation',
  CAN_UPDATE_TRAINING: 'Modifier une formation',
  CAN_DELETE_TRAINING: 'Supprimer une formation',
  
  // Student application permissions
  CAN_VIEW_STUDENT_APPLICATION: 'Consulter les candidatures formation',
  CAN_CHANGE_STUDENT_APPLICATION_STATUS: 'Modifier le statut des candidatures formation',
  CAN_DELETE_STUDENT_ATTACHMENT: 'Supprimer les pièces jointes des candidatures formation',
  
  // Reclamation type permissions
  CAN_VIEW_RECLAMATION_TYPE: 'Consulter les types de réclamation',
  CAN_CREATE_RECLAMATION_TYPE: 'Créer un type de réclamation',
  CAN_UPDATE_RECLAMATION_TYPE: 'Modifier un type de réclamation',
  CAN_DELETE_RECLAMATION_TYPE: 'Supprimer un type de réclamation',
  
  // Reclamation permissions
  CAN_VIEW_RECLAMATION: 'Consulter les réclamations',
  CAN_CHANGE_RECLAMATION_STATUS: 'Modifier le statut des réclamations',
  
  // Specialty permissions
  CAN_VIEW_SPECIALTY: 'Consulter les spécialités',
  CAN_CREATE_SPECIALTY: 'Créer une spécialité',
  CAN_UPDATE_SPECIALTY: 'Modifier une spécialité',
  CAN_DELETE_SPECIALTY: 'Supprimer une spécialité',
  
  // Organization center permissions
  CAN_VIEW_ORGANIZATION_CENTER: 'Consulter les centres d\'organisation',
  CAN_CREATE_ORGANIZATION_CENTER: 'Créer un centre d\'organisation',
  CAN_UPDATE_ORGANIZATION_CENTER: 'Modifier un centre d\'organisation',
  CAN_DELETE_ORGANIZATION_CENTER: 'Supprimer un centre d\'organisation',
  
  // Payment permissions
  CAN_VIEW_PAYMENT: 'Consulter les paiements',
}

const revocablePermissions = computed(() => {
  // Ne montrer que les permissions directement assignées (user_id non null, role_id null)
  return userPermissions.value
    .filter(permission => permission.user_id === props.userId && permission.role_id === null)
    .map(permission => {
      const permKey = permission.permission
      const label = Object.entries(PermissionEnum).find(([key, value]) => value === permKey)
        ? permissionLabels[
        Object.entries(PermissionEnum).find(([key, value]) => value === permKey)![0]
        ]
        : permKey
      return { label, value: permKey }
    })
})

// Computed pour séparer les permissions directes et héritées
const directPermissions = computed(() => {
  return userPermissions.value.filter(p => p.user_id === props.userId && p.role_id === null)
})

const inheritedPermissions = computed(() => {
  return userPermissions.value.filter(p => p.role_id !== null)
})

// Helper pour obtenir le label d'une permission
const getPermissionLabel = (permissionKey: string): string => {
  const enumEntry = Object.entries(PermissionEnum).find(([key, value]) => value === permissionKey)
  if (enumEntry) {
    return permissionLabels[enumEntry[0]] || permissionKey
  }
  return permissionKey
}

const fetchUserPermissions = async () => {
  try {
    const res = await permissionService.getUserPermissions(props.userId) as { data: Permission[] }
    userPermissions.value = res.data || []
    selectedAssignPermissions.value = []
    selectedRevokePermissions.value = []
  } catch (error) {
    console.error('Erreur lors du chargement des permissions:', error)
    userPermissions.value = []
  }
}

const fetchAllPermissions = () => {
  // Génère dynamiquement la liste à partir de PermissionEnum
  allPermissions.value = Object.entries(PermissionEnum)
    .filter(([key]) => key in permissionLabels)
    .map(([key, value]) => ({ label: permissionLabels[key], value }))
}

const assignPermissions = async () => {
  if (!selectedAssignPermissions.value.length) {
    showToast({ message: 'Veuillez sélectionner au moins une permission à assigner.', type: 'warning' })
    return
  }
  const confirmed = await confirmAction({
    method: 'post',
    title: 'Êtes-vous sûr ?',
    text: `Souhaitez-vous vraiment assigner ${selectedAssignPermissions.value.length} permission(s) à cet utilisateur ?`,
    confirmButtonText: '<span style="color:white">Assigner</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })
  if (!confirmed) return
  await permissionService.assignPermissions({ user_id: props.userId, permissions: selectedAssignPermissions.value })
  showToast({ message: 'Permissions assignées', type: 'success' })
  fetchUserPermissions()
  
  // Rafraîchir les permissions globales si c'est l'utilisateur connecté
  const authStore = useAuthStore()
  if (props.userId === authStore.user?.id) {
    await permissionStore.loadPermissions()
  }
  
  // Déclencher un événement de mise à jour des permissions
  triggerPermissionUpdate()
}
const revokePermissions = async () => {
  if (!selectedRevokePermissions.value.length) {
    showToast({ message: 'Veuillez sélectionner au moins une permission à retirer.', type: 'warning' })
    return
  }
  const confirmed = await confirmAction({
    method: 'delete',
    title: 'Êtes-vous sûr ?',
    text: `Souhaitez-vous vraiment retirer ${selectedRevokePermissions.value.length} permission(s) à cet utilisateur ?`,
    confirmButtonText: '<span style="color:white">Retirer</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })
  if (!confirmed) return
  await permissionService.revokePermissions({ user_id: props.userId, permissions: selectedRevokePermissions.value })
  showToast({ message: 'Permissions retirées', type: 'success' })
  fetchUserPermissions()
  
  // Rafraîchir les permissions globales si c'est l'utilisateur connecté
  const authStore = useAuthStore()
  if (props.userId === authStore.user?.id) {
    await permissionStore.loadPermissions()
  }
  
  // Déclencher un événement de mise à jour des permissions
  triggerPermissionUpdate()
}
onMounted(() => {
  fetchUserPermissions()
  fetchAllPermissions()
})
watch(() => props.userId, fetchUserPermissions)
</script>

<style scoped>
/* Soft, modern style */
</style>
