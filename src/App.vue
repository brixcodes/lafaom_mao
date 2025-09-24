<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

// Main App component
const authStore = useAuthStore()

onMounted(async () => {
  // Initialiser l'authentification au démarrage
  await authStore.initialize()
})
</script>

<template>
  <VApp>
    <RouterView />
  </VApp>
</template>
