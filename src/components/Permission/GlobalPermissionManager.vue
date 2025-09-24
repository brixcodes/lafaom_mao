<template>
  <div>
    <!-- Notification de mise à jour des permissions -->
    <PermissionNotification />
    
    <!-- Indicateur de chargement global des permissions -->
    <VOverlay v-model="isGlobalLoading" class="align-center justify-center">
      <VCard class="pa-4">
        <div class="d-flex align-center">
          <VProgressCircular indeterminate color="primary" class="mr-3" />
          <span>Mise à jour des permissions...</span>
        </div>
      </VCard>
    </VOverlay>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePermissionEvents } from '@/utils/permissionEvents'
import PermissionNotification from './PermissionNotification.vue'

const { permissionEvents } = usePermissionEvents()
const isGlobalLoading = ref(false)

// Écouter les événements de permissions pour afficher l'indicateur de chargement
watch(permissionEvents, (newEvents) => {
  if (newEvents.permissionsUpdated) {
    isGlobalLoading.value = true
    
    // Masquer l'indicateur après un délai
    setTimeout(() => {
      isGlobalLoading.value = false
    }, 2000)
  }
}, { deep: true })
</script>
