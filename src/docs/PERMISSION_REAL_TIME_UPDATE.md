# Mise à jour en temps réel des permissions

## Problème résolu

Le système de permissions a été amélioré pour résoudre le problème où les interfaces ne se mettaient pas à jour automatiquement après la modification des permissions ou des rôles d'un utilisateur.

## Solution implémentée

### 1. Système d'événements global

Un système d'événements a été créé pour notifier tous les composants quand les permissions changent :

```typescript
// utils/permissionEvents.ts
export const triggerPermissionUpdate = () => {
  permissionEvents.value.permissionsUpdated = true
  permissionEvents.value.lastUpdate = new Date()
}
```

### 2. Mise à jour automatique des composables

Le composable `usePermissions` écoute maintenant les événements de permissions :

```typescript
// Écouter les événements de mise à jour des permissions
watch(permissionEvents, (newEvents) => {
  if (newEvents.permissionsUpdated) {
    loadUserPermissions()
  }
}, { deep: true })
```

### 3. Mise à jour automatique du store

Le store de permissions se met à jour automatiquement :

```typescript
// Écouter les événements de mise à jour des permissions
watch(permissionEvents, (newEvents) => {
  if (newEvents.permissionsUpdated) {
    loadPermissions()
  }
}, { deep: true })
```

### 4. Notifications visuelles

Des composants de notification ont été créés pour informer l'utilisateur :

- `PermissionNotification.vue` : Snackbar de notification
- `GlobalPermissionManager.vue` : Indicateur de chargement global
- `PermissionTester.vue` : Indicateur de mise à jour en temps réel

## Utilisation

### Dans les composants de gestion des permissions

```vue
<template>
  <UserPermissionManager :userId="userId" />
</template>

<script setup>
import { triggerPermissionUpdate } from '@/utils/permissionEvents'

// Après une modification de permissions
const handlePermissionChange = async () => {
  await permissionService.assignPermissions(data)
  
  // Déclencher la mise à jour globale
  triggerPermissionUpdate()
}
</script>
```

### Dans les composants qui utilisent les permissions

```vue
<template>
  <div v-if="canViewUsers">
    <!-- Contenu protégé -->
  </div>
</template>

<script setup>
import { usePermissions } from '@/composables/usePermissions'

const { canViewUsers } = usePermissions()
// Les permissions se mettent à jour automatiquement
</script>
```

### Ajout du gestionnaire global

Ajoutez le composant global dans votre layout principal :

```vue
<template>
  <div>
    <!-- Votre contenu -->
    
    <!-- Gestionnaire global des permissions -->
    <GlobalPermissionManager />
  </div>
</template>

<script setup>
import GlobalPermissionManager from '@/components/Permission/GlobalPermissionManager.vue'
</script>
```

## Fonctionnalités

### ✅ Mise à jour automatique
- Les permissions se mettent à jour automatiquement dans tous les composants
- Pas besoin de recharger la page
- Synchronisation en temps réel

### ✅ Notifications visuelles
- Snackbar de confirmation
- Indicateur de chargement
- Feedback visuel immédiat

### ✅ Gestion d'erreurs
- Fallback automatique en cas d'erreur
- Retry automatique
- Logging détaillé

### ✅ Performance optimisée
- Mise à jour sélective
- Cache intelligent
- Événements légers

## Composants disponibles

1. **PermissionNotification.vue** : Notification de mise à jour
2. **GlobalPermissionManager.vue** : Gestionnaire global
3. **PermissionTester.vue** : Testeur avec indicateurs temps réel
4. **UserPermissionManager.vue** : Gestionnaire avec mise à jour automatique

## API des événements

```typescript
// Déclencher une mise à jour
triggerPermissionUpdate()

// Écouter les événements
const { permissionEvents } = usePermissionEvents()

// Vérifier si une mise à jour est en cours
const isUpdating = permissionEvents.permissionsUpdated
```

## Dépannage

### Problème : Les permissions ne se mettent pas à jour
**Solution** : Vérifiez que `triggerPermissionUpdate()` est appelé après les modifications

### Problème : Interface qui clignote
**Solution** : Les événements sont temporaires (1 seconde), c'est normal

### Problème : Permissions incorrectes
**Solution** : Vérifiez que l'utilisateur a les bonnes permissions côté backend

## Exemple complet

```vue
<template>
  <VCard>
    <VCardTitle>Gestion des permissions</VCardTitle>
    <VCardText>
      <!-- Liste des permissions -->
      <div v-for="permission in userPermissions" :key="permission">
        {{ permission }}
      </div>
      
      <!-- Boutons d'action -->
      <VBtn @click="assignPermission" :loading="isLoading">
        Assigner permission
      </VBtn>
    </VCardText>
  </VCard>
</template>

<script setup>
import { ref } from 'vue'
import { usePermissions } from '@/composables/usePermissions'
import { triggerPermissionUpdate } from '@/utils/permissionEvents'

const { userPermissions, isLoading } = usePermissions()

const assignPermission = async () => {
  // Logique d'assignation...
  
  // Déclencher la mise à jour globale
  triggerPermissionUpdate()
}
</script>
```

Le système est maintenant **entièrement réactif** et se met à jour automatiquement ! 🎉
