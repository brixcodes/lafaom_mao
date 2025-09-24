# Module Offres d'Emploi

Ce module fournit une solution complète pour la gestion des offres d'emploi et des candidatures dans l'application Vue.js.

## 📋 Fonctionnalités

### 🔍 Consultation des offres
- Liste des offres d'emploi avec filtres avancés
- Recherche textuelle et filtres par critères
- Visualisation détaillée des offres
- Interface responsive et intuitive

### 📝 Candidature
- Formulaire de candidature avec validation
- Upload de documents (CV, lettre de motivation, etc.)
- Gestion des formats de fichiers autorisés
- Système de notification et confirmation

### 👥 Gestion administrative
- Création et modification des offres
- Suivi des candidatures reçues
- Mise à jour des statuts de candidature
- Téléchargement des documents candidats

### 📊 Statistiques et rapports
- Dashboard avec métriques clés
- Statistiques de candidatures par offre
- Visualisation des données avec graphiques
- Export de rapports

## 🏗️ Structure

```
src/modules/jobs/
├── components/          # Composants réutilisables
│   ├── JobCard.vue           # Carte d'affichage d'offre
│   ├── JobFilters.vue        # Filtres de recherche
│   ├── JobForm.vue           # Formulaire de création/modification
│   ├── JobApplicationStats.vue # Statistiques visuelles
│   └── JobApplicationDetailView.vue # Vue détaillée candidature
├── pages/              # Pages de l'application
│   ├── JobOffersList.vue     # Liste des offres
│   ├── JobOfferDetail.vue    # Détails d'une offre
│   ├── JobOfferCreate.vue    # Création d'offre
│   ├── JobOfferEdit.vue      # Modification d'offre
│   ├── JobOfferApply.vue     # Candidature à une offre
│   └── JobApplications.vue   # Gestion des candidatures
├── services/           # Services API
│   └── jobOffersApi.ts       # Service API complet
├── stores/             # Stores Pinia
│   └── jobOffers.ts          # Store de gestion d'état
├── types/              # Types TypeScript
│   └── jobOffers.ts          # Interfaces et types
└── router/             # Configuration des routes
    └── modules/
        └── jobs.ts           # Routes du module
```

## 🔧 Installation et configuration

### 1. Intégration des routes

```typescript
// Dans src/router/index.ts
import jobsRoutes from './modules/jobs'

const routes = [
  ...jobsRoutes,
  // autres routes...
]
```

### 2. Configuration de l'API

```typescript
// Dans src/config/api.ts
export const API_ENDPOINTS = {
  // ...autres endpoints
  JOB_OFFERS: '/job-offers',
  JOB_APPLICATIONS: '/job-applications',
  JOB_ATTACHMENTS: '/job-attachments'
}
```

### 3. Utilisation du store

```typescript
// Dans un composant
import { useJobOffersStore } from '@/stores/jobOffers'

const jobOffersStore = useJobOffersStore()

// Charger les offres
await jobOffersStore.getJobOffers()

// Créer une candidature
await jobOffersStore.createJobApplication(applicationData)
```

## 🎨 Composants

### JobCard
Composant pour afficher les informations d'une offre d'emploi sous forme de carte.

```vue
<JobCard
  :job-offer="offer"
  :show-actions="true"
  @view="handleView"
  @apply="handleApply"
  @edit="handleEdit"
/>
```

### JobFilters
Composant de filtres avancés pour la recherche d'offres.

```vue
<JobFilters
  v-model="filters"
  :loading="isLoading"
  @search="handleSearch"
  @reset="handleReset"
/>
```

### JobForm
Formulaire de création/modification d'offres avec validation.

```vue
<JobForm
  :job-offer="existingOffer"
  :mode="'create'"
  @submit="handleSubmit"
  @cancel="handleCancel"
/>
```

## 📡 Services API

### JobOffersService
Service complet pour l'interaction avec l'API backend.

```typescript
// Récupérer les offres
const offers = await jobOffersApi.getJobOffers(filters)

// Créer une offre
const newOffer = await jobOffersApi.createJobOffer(offerData)

// Soumettre une candidature
const application = await jobOffersApi.createJobApplication(applicationData)

// Gérer les pièces jointes
await jobOffersApi.uploadAttachment(file, applicationId)
```

## 🗃️ Store Pinia

### State
- `jobOffers`: Liste des offres d'emploi
- `jobApplications`: Liste des candidatures
- `currentJobOffer`: Offre actuellement sélectionnée
- `isLoading`: État de chargement
- `pagination`: Configuration de pagination
- `filters`: Filtres actifs

### Actions
- `getJobOffers()`: Récupérer les offres
- `createJobOffer()`: Créer une offre
- `updateJobOffer()`: Modifier une offre
- `deleteJobOffer()`: Supprimer une offre
- `createJobApplication()`: Créer une candidature
- `getJobApplications()`: Récupérer les candidatures

### Getters
- `activeJobOffers`: Offres actives
- `expiredJobOffers`: Offres expirées
- `jobOffersByLocation`: Offres groupées par localisation
- `applicationsByStatus`: Candidatures groupées par statut

## 🔐 Permissions

### Offres d'emploi
- `job_offers.view`: Voir les offres (public)
- `job_offers.create`: Créer des offres
- `job_offers.update`: Modifier des offres
- `job_offers.delete`: Supprimer des offres
- `job_offers.manage`: Administration complète

### Candidatures
- `job_applications.view`: Voir les candidatures
- `job_applications.update`: Modifier les candidatures
- `job_applications.delete`: Supprimer les candidatures

## 🎯 Types TypeScript

```typescript
interface JobOffer {
  id: string
  title: string
  description: string
  location: string
  salary?: number
  contract_type: ContractType
  status: JobOfferStatus
  submission_deadline: string
  // ...autres propriétés
}

interface JobApplication {
  id: string
  job_offer_id: string
  email: string
  first_name: string
  last_name: string
  status: JobApplicationStatus
  attachments?: JobAttachment[]
  // ...autres propriétés
}
```

## 📱 Responsive Design

Le module est entièrement responsive et s'adapte aux différentes tailles d'écran :
- **Desktop** : Interface complète avec sidebar
- **Tablette** : Interface adaptée avec navigation optimisée
- **Mobile** : Interface simplifiée avec navigation mobile

## 🎨 Thème et design

- Utilise le système de design Vuetify
- Cohérence avec le thème global de l'application
- Icônes Remix Icon pour une interface moderne
- Transitions et animations fluides

## 🔄 États et gestion d'erreur

- États de chargement avec indicateurs visuels
- Gestion des erreurs avec messages explicites
- Validation en temps réel des formulaires
- Feedback utilisateur pour toutes les actions

## 🚀 Performance

- Lazy loading des composants
- Pagination des listes longues
- Optimisation des requêtes API
- Cache intelligent des données

## 📈 Extensibilité

Le module est conçu pour être facilement extensible :
- Architecture modulaire
- Composants réutilisables
- Services découplés
- Types strictement typés

## 🔧 Maintenance

- Code bien documenté
- Tests unitaires (à implémenter)
- Logging des erreurs
- Monitoring des performances

---

**Version :** 1.0.0  
**Dernière mise à jour :** Décembre 2024  
**Compatibilité :** Vue 3, TypeScript, Vuetify 3