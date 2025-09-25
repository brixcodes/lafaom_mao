<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAuthGuard } from '@/composables/useAuthGuard'
import avatar1 from '@images/avatars/avatar-1.png'

const router = useRouter()
const authStore = useAuthStore()

// Utiliser le guard d'authentification
useAuthGuard()

// Computed properties pour les données utilisateur
const user = computed(() => authStore.user)
const userFullName = computed(() => authStore.userFullName)
const userInitials = computed(() => authStore.userInitials)
const isAuthenticated = computed(() => authStore.isAuthenticated)

// Navigation vers le profil
const goToProfile = () => {
  router.push('/profile/simple')
}

// Navigation vers les paramètres
const goToSettings = () => {
  router.push('/settings')
}

// Déconnexion
const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}
</script>

<template>
  <VBadge v-if="isAuthenticated" dot location="bottom right" offset-x="3" offset-y="3" color="success" bordered>
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <!-- Image de profil utilisateur ou avatar par défaut -->
      <VImg v-if="user?.picture" :src="user.picture" :alt="userFullName" />
      <VImg v-else :src="avatar1" :alt="userFullName" />

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="280" location="bottom end" offset="14px">
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success">
                  <VAvatar color="primary" variant="tonal" size="40">
                    <VImg v-if="user?.picture" :src="user.picture" :alt="userFullName" />
                    <VImg v-else :src="avatar1" :alt="userFullName" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ userFullName || 'Utilisateur' }}
            </VListItemTitle>
            <VListItemSubtitle>{{ user?.user_type || 'Utilisateur' }}</VListItemSubtitle>
          </VListItem>
          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem to="/profile">
            <template #prepend>
              <VIcon class="me-2" icon="ri-user-line" size="22" />
            </template>

            <VListItemTitle>Mon Profil</VListItemTitle>
          </VListItem>

          <!-- 👉 Mes Réclamations -->
          <VListItem to="/my-reclamations">
            <template #prepend>
              <VIcon class="me-2" icon="ri-customer-service-2-line" size="22" />
            </template>

            <VListItemTitle>Mes Réclamations</VListItemTitle>
          </VListItem>

          <!-- 👉 Mes Candidatures -->
          <VListItem to="/my-student-applications">
            <template #prepend>
              <VIcon class="me-2" icon="ri-file-list-3-line" size="22" />
            </template>

            <VListItemTitle>Mes Candidatures</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem @click="handleLogout">
            <template #prepend>
              <VIcon class="me-2" icon="ri-logout-box-r-line" size="22" />
            </template>

            <VListItemTitle>Déconnexion</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>

  <!-- Fallback si non authentifié -->
  <VBtn v-else to="/login" color="primary" variant="outlined" size="small">
    <VIcon icon="ri-login-box-line" class="me-2" />
    Connexion
  </VBtn>
</template>
