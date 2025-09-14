<template>
  <VCard>
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

      </div>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { permissionService } from '@/services/api/permission'
import { showToast } from '@/components/toast/toastManager'
import { PermissionEnum } from '@/types/permissionEnum'
import { confirmAction } from '@/utils/confirm'

const props = defineProps<{ userId: string }>()
const userPermissions = ref<string[]>([])
const allPermissions = ref<{ label: string; value: string }[]>([])
const selectedAssignPermissions = ref<string[]>([])
const selectedRevokePermissions = ref<string[]>([])

const assignablePermissions = computed(() =>
  allPermissions.value.filter(p => !userPermissions.value.includes(p.value))
)
const permissionLabels: Record<string, string> = {
  CAN_VIEW_USER: 'Consulter les  utilisateurs',
  CAN_CREATE_USER: 'Créer un utilisateur',
  CAN_UPDATE_USER: 'Modifier un utilisateur',
  CAN_DELETE_USER: 'Supprimer un utilisateur',
  CAN_GIVE_PERMISSION: 'Donner une permission',
  CAN_VIEW_ROLE: 'Consulter les  rôles',
  CAN_CREATE_ROLE: 'Créer un  rôle',
  CAN_UPDATE_ROLE: 'Modifier un rôle',
  CAN_DELETE_ROLE: 'Supprimer un rôle',
  CAN_GIVE_ROLE: 'Donner un rôle',
  CAN_VIEW_BLOG: 'Consulter les blogs',
  CAN_CREATE_BLOG: 'Créer un blog',
  CAN_UPDATE_BLOG: 'Modifier un blog',
  CAN_DELETE_BLOG: 'Supprimer un  blog',
  CAN_PUBLISH_BLOG: 'Publier un blog',
  CAN_VIEW_JOB_OFFER: 'Consulter les offres',
  CAN_CREATE_JOB_OFFER: 'Créer une offre',
  CAN_UPDATE_JOB_OFFER: 'Modifier un offre',
  CAN_DELETE_JOB_OFFER: 'Supprimer un  offre',
  CAN_VIEW_JOB_APPLICATION: 'Consulter les candidatures',
  CAN_CREATE_JOB_APPLICATION: 'Créer une candidature',
  CAN_UPDATE_JOB_APPLICATION: 'Modifier une candidature',
  CAN_DELETE_JOB_APPLICATION: 'Supprimer une candidature',
}

const revocablePermissions = computed(() => {
  return userPermissions.value
    .filter(up => {
      // Si c'est un objet, on vérifie le user_id
      if (typeof up === 'object' && up !== null && 'user_id' in up && props.userId) {
        return up.user_id === props.userId
      }
      // Si c'est une string, on garde tout (cas legacy)
      return true
    })
    .map(up => {
      const permKey = typeof up === 'object' && up !== null && 'permission' in up ? up.permission : up
      const label = Object.entries(PermissionEnum).find(([key, value]) => value === permKey)
        ? permissionLabels[
            Object.entries(PermissionEnum).find(([key, value]) => value === permKey)![0]
          ]
        : permKey
      return { label, value: permKey }
    })
})

const fetchUserPermissions = async () => {
  const res = await permissionService.getUserPermissions(props.userId) as { data: string[] }
  userPermissions.value = res.data || []
  selectedAssignPermissions.value = []
  selectedRevokePermissions.value = []
}

const fetchAllPermissions = () => {
  // Génère dynamiquement la liste à partir de PermissionEnum et filtre les permissions utiles
  const permissionLabels: Record<string, string> = {
    CAN_VIEW_USER: 'Consulter les  utilisateurs',
    CAN_CREATE_USER: 'Créer un utilisateur',
    CAN_UPDATE_USER: 'Modifier un utilisateur',
    CAN_DELETE_USER: 'Supprimer un utilisateur',
    CAN_GIVE_PERMISSION: 'Donner une permission',
    CAN_VIEW_ROLE: 'Consulter les  rôles',
    CAN_CREATE_ROLE: 'Créer un  rôle',
    CAN_UPDATE_ROLE: 'Modifier un rôle',
    CAN_DELETE_ROLE: 'Supprimer un rôle',
    CAN_GIVE_ROLE: 'Donner un rôle',
    CAN_VIEW_BLOG: 'Consulter les blogs',
    CAN_CREATE_BLOG: 'Créer un blog',
    CAN_UPDATE_BLOG: 'Modifier un blog',
    CAN_DELETE_BLOG: 'Supprimer un  blog',
    CAN_PUBLISH_BLOG: 'Publier un blog',
    CAN_VIEW_JOB_OFFER: 'Consulter les offres',
    CAN_CREATE_JOB_OFFER: 'Créer une offre',
    CAN_UPDATE_JOB_OFFER: 'Modifier un offre',
    CAN_DELETE_JOB_OFFER: 'Supprimer un  offre',
    CAN_VIEW_JOB_APPLICATION: 'Consulter les candidatures',
    CAN_CREATE_JOB_APPLICATION: 'Créer une candidature',
    CAN_UPDATE_JOB_APPLICATION: 'Modifier une candidature',
    CAN_DELETE_JOB_APPLICATION: 'Supprimer une candidature',
  }
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
  await permissionService.assignPermissions(props.userId, selectedAssignPermissions.value)
  showToast({ message: 'Permissions assignées', type: 'success' })
  fetchUserPermissions()
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
  await permissionService.revokePermissions(props.userId, selectedRevokePermissions.value)
  showToast({ message: 'Permissions retirées', type: 'success' })
  fetchUserPermissions()
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
