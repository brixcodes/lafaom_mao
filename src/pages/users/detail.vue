<template>
  <div v-if="user">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div class="d-flex align-center">
        <VAvatar size="48" class="me-4">
          <VImg v-if="user.picture" :src="user.picture" />
          <VIcon v-else icon="ri-user-line" size="24" />
        </VAvatar>
        <div>
          <h2 class="text-h4 font-weight-bold">{{ user.first_name }} {{ user.last_name }}</h2>
          <p class="text-body-1 text-medium-emphasis">{{ user.email }}</p>
          <div class="d-flex gap-2 mt-2">
            <VChip
              :color="getUserTypeColor(user.user_type)"
              size="small"
            >
              {{ user.user_type }}
            </VChip>
            <VChip
              :color="getStatusColor(user.status)"
              size="small"
            >
              {{ user.status }}
            </VChip>
          </div>
        </div>
      </div>
      
      <div class="d-flex gap-3">
        <VBtn
          color="info"
          variant="outlined"
          to="/users"
        >
          <VIcon icon="ri-arrow-left-line" class="me-2" />
          Retour
        </VBtn>
        <!-- Bouton modifier - Permission: CAN_UPDATE_USER -->
        <VBtn
          v-if="!canUpdateUsers"
          color="warning"
          variant="outlined"
          :to="`/users/${user.id}/edit`"
        >
          <VIcon icon="ri-edit-line" class="me-2" />
          Modifier
        </VBtn>
        
        <!-- Bouton gérer les rôles - Permission: CAN_GIVE_PERMISSION ou CAN_GIVE_ROLE -->
        <VBtn
          v-if="!canGivePermissions || canGiveRoles"
          color="primary"
          to="/users/role-permissions"
          @click="selectUserForRoleManagement"
        >
          <VIcon icon="ri-shield-user-line" class="me-2" />
          Gérer les rôles
        </VBtn>
      </div>
    </div>

    <!-- Informations utilisateur -->
    <VRow>
      <VCol cols="12" md="8">
        <VCard>
          <VCardTitle>
            <VIcon icon="ri-user-line" class="me-2" />
            Informations personnelles
          </VCardTitle>
          <VCardText>
            <VRow>
              <VCol cols="12" md="6">
                <div class="mb-4">
                  <div class="text-caption text-medium-emphasis">Prénom</div>
                  <div class="text-body-1">{{ user.first_name }}</div>
                </div>
              </VCol>
              <VCol cols="12" md="6">
                <div class="mb-4">
                  <div class="text-caption text-medium-emphasis">Nom</div>
                  <div class="text-body-1">{{ user.last_name }}</div>
                </div>
              </VCol>
              <VCol cols="12" md="6">
                <div class="mb-4">
                  <div class="text-caption text-medium-emphasis">Email</div>
                  <div class="text-body-1">{{ user.email }}</div>
                </div>
              </VCol>
              <VCol cols="12" md="6">
                <div class="mb-4">
                  <div class="text-caption text-medium-emphasis">Type d'utilisateur</div>
                  <VChip
                    :color="getUserTypeColor(user.user_type)"
                    size="small"
                  >
                    {{ user.user_type }}
                  </VChip>
                </div>
              </VCol>
              <VCol cols="12" md="6">
                <div class="mb-4">
                  <div class="text-caption text-medium-emphasis">Statut</div>
                  <VChip
                    :color="getStatusColor(user.status)"
                    size="small"
                  >
                    {{ user.status }}
                  </VChip>
                </div>
              </VCol>
              <VCol cols="12" md="6">
                <div class="mb-4">
                  <div class="text-caption text-medium-emphasis">Langue</div>
                  <div class="text-body-1">{{ user.lang || 'Non défini' }}</div>
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
      
      <VCol cols="12" md="4">
        <VCard>
          <VCardTitle>
            <VIcon icon="ri-time-line" class="me-2" />
            Informations système
          </VCardTitle>
          <VCardText>
            <div class="mb-4">
              <div class="text-caption text-medium-emphasis">Créé le</div>
              <div class="text-body-1">{{ formatDate(user.created_at) }}</div>
            </div>
            <div class="mb-4">
              <div class="text-caption text-medium-emphasis">Dernière modification</div>
              <div class="text-body-1">{{ formatDate(user.updated_at) }}</div>
            </div>
            <div class="mb-4">
              <div class="text-caption text-medium-emphasis">Authentification 2FA</div>
              <VChip
                :color="user.two_factor_enabled ? 'success' : 'default'"
                size="small"
              >
                {{ user.two_factor_enabled ? 'Activée' : 'Désactivée' }}
              </VChip>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Gestion des rôles et permissions -->
    <VCard class="mt-6">
      <VCardTitle>
        <VIcon icon="ri-shield-user-line" class="me-2" />
        Rôles et Permissions
      </VCardTitle>
      <VCardText>
        <UserRoleManager :user-id="user.id" />
      </VCardText>
    </VCard>
  </div>

  <!-- Loading state -->
  <div v-else-if="isLoading" class="text-center py-8">
    <VProgressCircular indeterminate size="64" />
    <p class="mt-4">Chargement des informations utilisateur...</p>
  </div>

  <!-- Error state -->
  <div v-else class="text-center py-8">
    <VIcon icon="ri-error-warning-line" size="64" color="error" />
    <h3 class="mt-4">Utilisateur non trouvé</h3>
    <p class="text-medium-emphasis">L'utilisateur demandé n'existe pas ou a été supprimé.</p>
    <VBtn color="primary" to="/users" class="mt-4">
      <VIcon icon="ri-arrow-left-line" class="me-2" />
      Retour à la liste
    </VBtn>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsers } from '@/composables/useUsers'
import { usePermissions } from '@/composables/usePermissions'
import UserRoleManager from '@/components/Permission/UserRoleManager.vue'

const route = useRoute()
const router = useRouter()
const { loadUser, isLoading } = useUsers()

// Permissions
const { canViewUsers, canUpdateUsers, canDeleteUsers, canGivePermissions, canGiveRoles } = usePermissions()

const user = ref(null)

// Methods
const getUserTypeColor = (userType: string): string => {
  const colors: Record<string, string> = {
    admin: 'error',
    staff: 'warning',
    teacher: 'info',
    student: 'success'
  }
  return colors[userType] || 'default'
}

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: 'success',
    inactive: 'warning',
    blocked: 'error',
    deleted: 'default'
  }
  return colors[status] || 'default'
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const selectUserForRoleManagement = () => {
  // Stocker l'utilisateur sélectionné pour la page de gestion des rôles
  sessionStorage.setItem('selectedUserForRoleManagement', JSON.stringify(user.value))
}

// Lifecycle
onMounted(async () => {
  const userId = route.params.id as string
  if (userId) {
    try {
      user.value = await loadUser(userId)
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error)
    }
  }
})
</script>