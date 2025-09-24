<template>
  <VSnackbar
    v-model="showNotification"
    :timeout="3000"
    color="success"
    location="top right"
  >
    <div class="d-flex align-center">
      <VIcon icon="ri-refresh-line" class="mr-2" />
      <span>Permissions mises à jour avec succès</span>
    </div>
  </VSnackbar>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePermissionEvents } from '@/utils/permissionEvents'

const { permissionEvents } = usePermissionEvents()
const showNotification = ref(false)

// Écouter les événements de mise à jour des permissions
watch(permissionEvents, (newEvents) => {
  if (newEvents.permissionsUpdated) {
    showNotification.value = true
  }
}, { deep: true })
</script>
