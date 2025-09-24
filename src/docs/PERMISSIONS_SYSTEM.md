# Système de Permissions Unifié

## Vue d'ensemble

Le système de permissions a été entièrement refactorisé pour être parfaitement synchronisé avec le backend. Il offre une gestion granulaire des permissions et des rôles avec une API cohérente.

## Architecture

### 1. Types de Permissions (`@/types/permissions.ts`)

Le fichier central contient :
- **PermissionEnum** : Toutes les permissions disponibles (38+ permissions)
- **RoleEnum** : Les rôles du système (SUPER_ADMIN, MANAGER, VISITOR)
- **Mappings** : Correspondances entre anciens et nouveaux systèmes
- **Permissions par rôle** : Définition des permissions pour chaque rôle

### 2. Rôles et Permissions

#### Rôles disponibles :
- **SUPER_ADMIN** : Toutes les permissions
- **MANAGER** : Permissions étendues pour la gestion
- **VISITOR** : Permissions de consultation uniquement

#### Permissions par catégorie :
- **Utilisateurs** : CAN_VIEW_USER, CAN_CREATE_USER, CAN_UPDATE_USER, CAN_DELETE_USER
- **Rôles** : CAN_VIEW_ROLE, CAN_CREATE_ROLE, CAN_UPDATE_ROLE, CAN_DELETE_ROLE
- **Blog** : CAN_VIEW_BLOG, CAN_CREATE_BLOG, CAN_UPDATE_BLOG, CAN_DELETE_BLOG, CAN_PUBLISH_BLOG
- **Offres d'emploi** : CAN_VIEW_JOB_OFFER, CAN_CREATE_JOB_OFFER, CAN_UPDATE_JOB_OFFER, CAN_DELETE_JOB_OFFER
- **Candidatures emploi** : CAN_VIEW_JOB_APPLICATION, CAN_CHANGE_JOB_APPLICATION_STATUS, CAN_DELETE_JOB_ATTACHMENT
- **Formations** : CAN_VIEW_TRAINING, CAN_CREATE_TRAINING, CAN_UPDATE_TRAINING, CAN_DELETE_TRAINING
- **Sessions de formation** : CAN_VIEW_TRAINING_SESSION, CAN_CREATE_TRAINING_SESSION, CAN_UPDATE_TRAINING_SESSION, CAN_DELETE_TRAINING_SESSION
- **Candidatures formation** : CAN_VIEW_STUDENT_APPLICATION, CAN_CHANGE_STUDENT_APPLICATION_STATUS, CAN_DELETE_STUDENT_ATTACHMENT
- **Réclamations** : CAN_VIEW_RECLAMATION, CAN_CHANGE_RECLAMATION_STATUS
- **Types de réclamation** : CAN_VIEW_RECLAMATION_TYPE, CAN_CREATE_RECLAMATION_TYPE, CAN_UPDATE_RECLAMATION_TYPE, CAN_DELETE_RECLAMATION_TYPE
- **Spécialités** : CAN_VIEW_SPECIALTY, CAN_CREATE_SPECIALTY, CAN_UPDATE_SPECIALTY, CAN_DELETE_SPECIALTY
- **Centres d'organisation** : CAN_VIEW_ORGANIZATION_CENTER, CAN_CREATE_ORGANIZATION_CENTER, CAN_UPDATE_ORGANIZATION_CENTER, CAN_DELETE_ORGANIZATION_CENTER
- **Paiements** : CAN_VIEW_PAYMENT
- **Gestion** : CAN_GIVE_ROLE, CAN_GIVE_PERMISSION

## Utilisation

### 1. Composable `usePermissions`

```typescript
import { usePermissions } from '@/composables/usePermissions'

const {
  // États
  currentRole,
  currentRoleEnum,
  userPermissions,
  
  // Méthodes de vérification
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  
  // Permissions spécifiques
  canViewUsers,
  canCreateUsers,
  canViewBlogs,
  canCreateBlogs,
  // ... et bien d'autres
} = usePermissions()
```

### 2. Store de Permissions

```typescript
import { usePermissionStore } from '@/stores/permission'

const permissionStore = usePermissionStore()

// Vérifier une permission
const canEdit = permissionStore.hasPermission('CAN_UPDATE_USER')

// Vérifier plusieurs permissions
const canManage = permissionStore.hasAnyPermission(['CAN_CREATE_USER', 'CAN_UPDATE_USER'])

// Gérer les permissions
permissionStore.setPermissions(['CAN_VIEW_USER', 'CAN_CREATE_USER'])
permissionStore.addPermission('CAN_UPDATE_USER')
permissionStore.removePermission('CAN_DELETE_USER')
```

### 3. Composant PermissionGuard

```vue
<template>
  <!-- Afficher seulement si l'utilisateur a la permission -->
  <PermissionGuard :permissions="[PermissionEnum.CAN_VIEW_USER]">
    <UserList />
  </PermissionGuard>
  
  <!-- Afficher si l'utilisateur a un des rôles -->
  <PermissionGuard :roles="['ADMIN', 'MANAGER']">
    <AdminPanel />
  </PermissionGuard>
  
  <!-- Exiger toutes les permissions -->
  <PermissionGuard 
    :permissions="[PermissionEnum.CAN_VIEW_USER, PermissionEnum.CAN_UPDATE_USER]"
    :require-all="true"
  >
    <UserManagement />
  </PermissionGuard>
</template>
```

### 4. Service API

```typescript
import { permissionService } from '@/services/api/permissions'

// Récupérer les permissions d'un utilisateur
const permissions = await permissionService.getUserPermissions(userId)

// Assigner des permissions
await permissionService.assignPermissions({
  user_id: userId,
  permissions: ['CAN_VIEW_USER', 'CAN_CREATE_USER']
})

// Révoquer des permissions
await permissionService.revokePermissions({
  user_id: userId,
  permissions: ['CAN_DELETE_USER']
})

// Assigner un rôle
await permissionService.assignRole({
  user_id: userId,
  role_id: 2
})
```

## Migration depuis l'ancien système

### Ancien système
```typescript
// ❌ Ancien système
import { TrainingPermission, UserRole } from '@/types/permissions'

const { hasPermission } = usePermissions()
const canEdit = hasPermission(TrainingPermission.EDIT_TRAINING)
```

### Nouveau système
```typescript
// ✅ Nouveau système
import { PermissionEnum } from '@/types/permissions'

const { hasPermission } = usePermissions()
const canEdit = hasPermission(PermissionEnum.CAN_UPDATE_TRAINING)
```

## Compatibilité

Le système maintient la compatibilité avec l'ancien système grâce à :
- **TrainingPermission** : Mappings vers les nouvelles permissions
- **UserRole** : Mappings vers les nouveaux rôles
- **legacyRolePermissions** : Permissions pour les anciens rôles

## Synchronisation Backend

Le système est parfaitement synchronisé avec le backend :
- **Permissions** : Correspondance exacte avec `PermissionEnum` du backend
- **Rôles** : Correspondance exacte avec `RoleEnum` du backend
- **API** : Endpoints identiques au backend
- **Logique** : Même logique de vérification des permissions

## Bonnes pratiques

1. **Utilisez les composables** : Préférez `usePermissions()` aux stores directs
2. **Vérifiez les permissions** : Toujours vérifier avant d'afficher du contenu sensible
3. **Utilisez PermissionGuard** : Pour la protection des composants
4. **Gérez les erreurs** : Le système gère automatiquement les erreurs d'API
5. **Performance** : Les permissions sont mises en cache automatiquement

## Dépannage

### Problèmes courants :
1. **Permission non trouvée** : Vérifiez que la permission existe dans `PermissionEnum`
2. **Rôle non reconnu** : Vérifiez le mapping dans `userRoleToRoleEnum`
3. **API errors** : Le système gère automatiquement les erreurs avec des fallbacks

### Debug :
```typescript
const { currentRole, userPermissions } = usePermissions()
console.log('Rôle actuel:', currentRole.value)
console.log('Permissions:', userPermissions.value)
```
