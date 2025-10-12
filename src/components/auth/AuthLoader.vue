<template>
  <div v-if="showLoader" class="auth-loader">
    <div class="auth-loader__content">
      <VProgressCircular
        indeterminate
        color="primary"
        size="32"
        width="3"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const showLoader = computed(() => {
  // Afficher le loader seulement pendant l'initialisation de l'authentification
  // et seulement si on n'est pas déjà sur la page de login
  const isOnLoginPage = window.location.pathname === '/login'
  return (authStore.isLoading || !authStore.isInitialized) && !isOnLoginPage
})
</script>

<style lang="scss" scoped>
.auth-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(1px);
  transition: opacity 0.2s ease-in-out;
  
  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }
}

// Mode sombre
.v-theme--dark {
  .auth-loader {
    background-color: rgba(0, 0, 0, 0.7);
    
    &__content {
      background: #1e1e1e;
    }
  }
}
</style>
