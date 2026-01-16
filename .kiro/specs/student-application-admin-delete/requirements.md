# Requirements Document

## Introduction

Cette fonctionnalité vise à permettre aux administrateurs de supprimer des candidatures étudiantes (student applications) en utilisant l'endpoint API admin `/api/v1/student-applications/{application_id}` au lieu de l'endpoint utilisateur `/api/v1/my-student-applications/{application_id}`. 

Actuellement, la page de gestion des candidatures (`src/pages/student-applications/index.vue`) charge les candidatures via l'endpoint admin mais utilise l'endpoint utilisateur pour la suppression, ce qui crée une incohérence. Cette fonctionnalité corrigera cette incohérence en permettant aux administrateurs d'utiliser l'endpoint admin pour toutes les opérations CRUD, y compris la suppression.

## Requirements

### Requirement 1: Endpoint API Admin pour la Suppression

**User Story:** En tant qu'administrateur, je veux pouvoir supprimer n'importe quelle candidature étudiante via l'endpoint admin, afin de gérer efficacement toutes les candidatures du système.

#### Acceptance Criteria

1. WHEN l'administrateur clique sur le bouton de suppression d'une candidature THEN le système SHALL utiliser l'endpoint DELETE `/api/v1/student-applications/{application_id}` au lieu de `/api/v1/my-student-applications/{application_id}`

2. WHEN la suppression est réussie THEN le système SHALL afficher un message de succès "Candidature supprimée avec succès"

3. WHEN la suppression échoue THEN le système SHALL afficher un message d'erreur approprié avec les détails de l'échec

4. WHEN une candidature est supprimée THEN le système SHALL retirer immédiatement la candidature de la liste affichée sans recharger toute la page

### Requirement 2: Service API pour la Suppression Admin

**User Story:** En tant que développeur, je veux avoir une méthode de service dédiée pour la suppression admin, afin de séparer clairement les opérations admin des opérations utilisateur.

#### Acceptance Criteria

1. WHEN le service `studentApplicationsService` est appelé THEN il SHALL fournir une méthode `deleteStudentApplication(applicationId: number)` distincte de `deleteMyStudentApplication(applicationId: number)`

2. WHEN `deleteStudentApplication` est appelée THEN elle SHALL envoyer une requête DELETE à `/api/v1/student-applications/{application_id}`

3. WHEN la méthode retourne une réponse THEN elle SHALL retourner un objet de type `StudentApplicationOutSuccess`

4. IF l'API retourne une erreur THEN la méthode SHALL propager l'erreur avec les détails appropriés

### Requirement 3: Composable avec Support Admin

**User Story:** En tant que développeur, je veux que le composable `useStudentApplication` supporte les opérations admin, afin de pouvoir gérer les candidatures avec les permissions appropriées.

#### Acceptance Criteria

1. WHEN la méthode `deleteApplication` du composable est appelée avec le paramètre `useAdminEndpoint = true` THEN elle SHALL utiliser `studentApplicationsService.deleteStudentApplication()` au lieu de `studentApplicationsService.deleteMyStudentApplication()`

2. WHEN la suppression admin est réussie THEN le composable SHALL mettre à jour les états `applications` et `allApplications` en retirant la candidature supprimée

3. WHEN la suppression admin échoue THEN le composable SHALL afficher un toast d'erreur et propager l'exception

4. WHEN une candidature est supprimée THEN le composable SHALL vérifier si c'est la candidature courante (`currentApplication`) et la réinitialiser à `null` si nécessaire

### Requirement 4: Intégration dans la Page Admin

**User Story:** En tant qu'administrateur utilisant la page de gestion des candidatures, je veux que la suppression utilise automatiquement l'endpoint admin, afin d'avoir une expérience cohérente avec les autres opérations.

#### Acceptance Criteria

1. WHEN la page `src/pages/student-applications/index.vue` appelle `handleDelete` THEN elle SHALL passer le paramètre `useAdminEndpoint = true` à la méthode `deleteApplication` du composable

2. WHEN la confirmation de suppression est affichée THEN elle SHALL montrer le numéro de candidature (`application_number`) dans le message de confirmation

3. WHEN l'utilisateur confirme la suppression THEN le système SHALL appeler l'endpoint admin et mettre à jour l'interface utilisateur

4. WHEN la suppression est terminée THEN les statistiques affichées (Total, Soumises, Approuvées, Refusées) SHALL être automatiquement mises à jour

### Requirement 5: Gestion des Erreurs et Feedback Utilisateur

**User Story:** En tant qu'administrateur, je veux recevoir un feedback clair sur le résultat de mes actions de suppression, afin de savoir si l'opération a réussi ou échoué.

#### Acceptance Criteria

1. WHEN une suppression est initiée THEN le système SHALL afficher un indicateur de chargement pendant le traitement

2. WHEN la suppression réussit THEN le système SHALL afficher un toast de succès avec le message "Candidature supprimée avec succès"

3. IF la suppression échoue à cause d'une erreur réseau THEN le système SHALL afficher un message d'erreur "Erreur lors de la suppression de la candidature"

4. IF la suppression échoue à cause de permissions insuffisantes THEN le système SHALL afficher un message d'erreur approprié indiquant le problème de permissions

5. WHEN une erreur se produit THEN le système SHALL logger l'erreur dans la console pour faciliter le débogage

### Requirement 6: Cohérence avec les Autres Opérations Admin

**User Story:** En tant que développeur, je veux que toutes les opérations CRUD sur les candidatures utilisent de manière cohérente les endpoints admin ou utilisateur, afin de maintenir une architecture claire et maintenable.

#### Acceptance Criteria

1. WHEN la page admin charge les candidatures THEN elle SHALL utiliser `loadApplications(true)` avec l'endpoint admin

2. WHEN la page admin recherche des candidatures THEN elle SHALL utiliser `searchApplications(query, true)` avec l'endpoint admin

3. WHEN la page admin applique des filtres THEN elle SHALL utiliser `applyFilters(filters, true)` avec l'endpoint admin

4. WHEN la page admin supprime une candidature THEN elle SHALL utiliser `deleteApplication(id, true)` avec l'endpoint admin

5. WHEN la page utilisateur (my-applications) effectue des opérations THEN elle SHALL utiliser les endpoints utilisateur (`useAdminEndpoint = false`)

