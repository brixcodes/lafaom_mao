# Requirements Document

## Introduction

Cette fonctionnalité vise à réorganiser la page de liste des candidatures aux formations en la déplaçant vers le sous-menu "Formations" et en créant une page complète pour voir toutes les candidatures (pas seulement celles de l'utilisateur connecté). L'objectif est d'améliorer la navigation et de fournir une vue d'ensemble des candidatures pour les administrateurs.

## Requirements

### Requirement 1

**User Story:** En tant qu'administrateur, je veux accéder à la liste complète des candidatures aux formations depuis le menu Formations, afin de pouvoir gérer toutes les candidatures de manière centralisée.

#### Acceptance Criteria

1. WHEN l'utilisateur navigue dans le menu Formations THEN il SHALL voir un sous-menu "Candidatures" 
2. WHEN l'utilisateur clique sur "Candidatures" dans le sous-menu THEN le système SHALL afficher une page avec toutes les candidatures aux formations
3. WHEN la page se charge THEN elle SHALL afficher les candidatures de tous les utilisateurs (pas seulement l'utilisateur connecté)
4. WHEN l'utilisateur a les permissions appropriées THEN il SHALL pouvoir voir et gérer toutes les candidatures

### Requirement 2

**User Story:** En tant qu'utilisateur, je veux toujours pouvoir accéder à mes propres candidatures depuis le sous-menu "Mes candidatures", afin de maintenir un accès rapide à mes candidatures personnelles.

#### Acceptance Criteria

1. WHEN l'utilisateur navigue dans le menu Formations THEN il SHALL voir un sous-menu "Mes candidatures"
2. WHEN l'utilisateur clique sur "Mes candidatures" THEN le système SHALL afficher uniquement ses propres candidatures
3. WHEN la page se charge THEN elle SHALL utiliser la fonctionnalité existante de filtrage par utilisateur
4. WHEN l'utilisateur n'est pas connecté THEN il SHALL être redirigé vers la page de connexion

### Requirement 3

**User Story:** En tant qu'administrateur, je veux pouvoir filtrer et rechercher dans toutes les candidatures, afin de trouver rapidement des candidatures spécifiques selon différents critères.

#### Acceptance Criteria

1. WHEN l'utilisateur est sur la page de toutes les candidatures THEN il SHALL voir des filtres pour statut, paiement, et utilisateur
2. WHEN l'utilisateur utilise la barre de recherche THEN le système SHALL rechercher dans les numéros de candidature, noms de formation, et noms d'utilisateurs
3. WHEN l'utilisateur applique des filtres THEN les résultats SHALL être mis à jour en temps réel
4. WHEN l'utilisateur réinitialise les filtres THEN tous les filtres SHALL être effacés et toutes les candidatures affichées

### Requirement 4

**User Story:** En tant qu'utilisateur du système, je veux que la navigation soit cohérente et intuitive, afin de pouvoir facilement trouver les fonctionnalités liées aux candidatures de formation.

#### Acceptance Criteria

1. WHEN l'utilisateur navigue dans l'application THEN la structure de menu SHALL être logique et cohérente
2. WHEN l'utilisateur accède aux pages de candidatures THEN les URLs SHALL refléter la nouvelle organisation
3. WHEN l'utilisateur utilise des liens existants THEN ils SHALL être redirigés vers les nouvelles pages appropriées
4. WHEN l'utilisateur navigue entre les pages THEN les breadcrumbs SHALL refléter la hiérarchie correcte

### Requirement 5

**User Story:** En tant qu'administrateur, je veux voir des statistiques globales sur toutes les candidatures, afin d'avoir une vue d'ensemble de l'activité des candidatures.

#### Acceptance Criteria

1. WHEN l'utilisateur accède à la page de toutes les candidatures THEN il SHALL voir des cartes de statistiques globales
2. WHEN les statistiques se chargent THEN elles SHALL afficher le nombre total de candidatures, soumises, approuvées, et refusées
3. WHEN les données changent THEN les statistiques SHALL être mises à jour automatiquement
4. WHEN l'utilisateur applique des filtres THEN les statistiques SHALL refléter les candidatures filtrées
