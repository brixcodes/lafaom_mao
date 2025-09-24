// Système d'événements pour les permissions
import { ref } from 'vue'

// État global pour les événements de permissions
const permissionEvents = ref({
  permissionsUpdated: false,
  lastUpdate: null as Date | null
})

// Fonction pour déclencher un événement de mise à jour des permissions
export const triggerPermissionUpdate = () => {
  permissionEvents.value.permissionsUpdated = true
  permissionEvents.value.lastUpdate = new Date()
  
  // Réinitialiser après un court délai
  setTimeout(() => {
    permissionEvents.value.permissionsUpdated = false
  }, 1000)
}

// Fonction pour écouter les événements de permissions
export const usePermissionEvents = () => {
  return {
    permissionEvents: permissionEvents.value,
    triggerPermissionUpdate
  }
}

// Fonction pour vérifier si les permissions ont été mises à jour récemment
export const hasPermissionsUpdated = () => {
  return permissionEvents.value.permissionsUpdated
}

// Fonction pour obtenir la dernière mise à jour
export const getLastPermissionUpdate = () => {
  return permissionEvents.value.lastUpdate
}
