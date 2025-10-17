# TODO (automatisation par Copilot)

1. Optimiser tous les imports, la syntaxe, l'ordre des blocs et conventions dans tout le frontend.
2. Synchroniser tous les services, enums, schémas, modèles et routes du backend dans le frontend (types, stores, services, pages).
3. Intégrer le module d'authentification du backend à l'identique, de façon robuste et cohérente.

Ce plan sera suivi étape par étape pour garantir une correspondance parfaite backend <-> frontend.
# 🚀 Frontend La'akam - Architecture Modulaire

## 📋 Vue d'ensemble

Ce frontend Vue 3 + TypeScript + Vuetify est parfaitement intégré avec le backend La'akam et suit une architecture modulaire optimale pour la scalabilité et la maintenance.

## 🏗️ Architecture

### **Structure des dossiers**
```
src/
├── types/           # Types TypeScript pour tous les modules
├── services/        # Services API pour chaque module
├── stores/          # Stores Pinia pour la gestion d'état
├── components/      # Composants Vue réutilisables
├── pages/           # Pages de l'application
├── utils/           # Utilitaires et helpers
├── config/          # Configuration de l'API
└── layouts/         # Layouts de l'application
```

## 🔧 Modules Intégrés

### **1. 🔐 Authentification (`auth`)**
- **Types :** `UserTokenOut`, `LoginInput`, `UpdateUserProfile`
- **Service :** `authService` - Gestion complète de l'auth
- **Store :** `useAuthStore` - État global d'authentification
- **Fonctionnalités :**
  - Connexion/Déconnexion
  - Authentification à deux facteurs (2FA)
  - Gestion des tokens JWT
  - Mise à jour du profil utilisateur
  - Changement de mot de passe

### **2. 👥 Gestion des Utilisateurs (`user`)**
- **Types :** `UserSimpleOut`, `UserFullOut`, `CreateUserInput`
- **Service :** `userService` - CRUD complet des utilisateurs
- **Store :** `useUserStore` - Gestion des utilisateurs
- **Fonctionnalités :**
  - CRUD utilisateurs
  - Gestion des rôles et permissions
  - Filtrage et recherche
  - Import/Export
  - Statistiques

### **3. 📝 Blog (`blog`)**
- **Types :** `PostOut`, `PostCategoryOut`, `PostSectionOut`
- **Service :** `blogService` - Gestion du contenu
- **Store :** `useBlogStore` - État du blog
- **Fonctionnalités :**
  - Gestion des articles
  - Catégories et sections
  - Publication/Dépublication
  - Recherche et filtres
  - Upload d'images

### **4. 💼 Offres d'Emploi (`jobOffers`)**
- **Types :** `JobOffer`, `JobApplication`
- **Service :** `jobOffersService` - Gestion des emplois
- **Fonctionnalités :**
  - CRUD offres d'emploi
  - Gestion des candidatures
  - Upload de CV et documents
  - Filtrage par localisation/contrat

### **5. 🎓 Formations (`training`)**
- **Types :** `Training`, `TrainingSession`, `StudentApplication`
- **Service :** `trainingService` - Gestion des formations
- **Fonctionnalités :**
  - CRUD formations et sessions
  - Gestion des candidatures étudiants
  - Centres de formation
  - Spécialités

### **6. 💳 Paiements (`payments`)**
- **Types :** `Payment`, `PaymentCreateInput`
- **Service :** `paymentsService` - Gestion des paiements
- **Fonctionnalités :**
  - Suivi des paiements
  - Statuts et transactions
  - Rapports et statistiques

## 🛠️ Services API

### **Service de base (`ApiService`)**
- Intercepteurs pour l'authentification
- Gestion automatique des tokens
- Retry automatique en cas d'erreur
- Upload de fichiers

### **Services spécialisés**
Chaque module a son service dédié avec :
- Méthodes CRUD complètes
- Gestion des erreurs
- Types TypeScript stricts
- Upload de fichiers intégré

## 📊 Stores Pinia

### **Architecture des stores**
- **État réactif** avec Vue 3 Composition API
- **Actions asynchrones** pour les appels API
- **Getters calculés** pour les données dérivées
- **Gestion d'erreurs** centralisée

### **Stores disponibles**
- `useAuthStore` - Authentification
- `useUserStore` - Utilisateurs
- `useBlogStore` - Blog
- *(Stores pour les autres modules à créer)*

## 🎨 Composants Communs

### **Composants réutilisables**
- `LoadingSpinner` - Indicateurs de chargement
- `ErrorHandler` - Gestion des erreurs
- `Pagination` - Pagination complète
- `SearchBar` - Barre de recherche avec filtres

## 🔧 Utilitaires

### **Classes utilitaires**
- `ErrorHandler` - Gestion des erreurs API
- `Validator` - Validation des données
- `Formatter` - Formatage des données
- `PermissionHelper` - Gestion des permissions
- `FileHelper` - Gestion des fichiers
- `UrlHelper` - Construction d'URLs
- `StorageHelper` - localStorage
- `NotificationHelper` - Notifications

## 🚀 Utilisation

### **1. Installation des dépendances**
```bash
yarn install
```

### **2. Configuration**
Créer un fichier `.env` :
```env
VITE_API_BASE_URL=http://194.238.25.170/api/v1
```

### **3. Démarrage**
```bash
yarn dev
```

## 📱 Pages Disponibles

### **Authentification**
- `/login` - Connexion
- `/register` - Inscription

### **Dashboard**
- `/dashboard` - Tableau de bord

### **Utilisateurs**
- `/users` - Liste des utilisateurs
- `/users/create` - Créer un utilisateur
- `/users/:id` - Détail utilisateur
- `/users/:id/edit` - Modifier utilisateur

### **Blog**
- `/blog/posts` - Articles
- `/blog/posts/create` - Créer article
- `/blog/categories` - Catégories

### **Offres d'emploi**
- `/job-offers` - Offres
- `/job-offers/create` - Créer offre
- `/job-offers/applications` - Candidatures

### **Formations**
- `/training/trainings` - Formations
- `/training/sessions` - Sessions
- `/training/applications` - Candidatures

### **Paiements**
- `/payments` - Liste des paiements

## 🔒 Sécurité

### **Authentification**
- Tokens JWT avec refresh automatique
- Authentification à deux facteurs
- Gestion des permissions par rôle

### **Validation**
- Validation côté client avec TypeScript
- Validation des fichiers uploadés
- Sanitisation des données

## 📈 Performance

### **Optimisations**
- Lazy loading des routes
- Composants réutilisables
- Gestion d'état optimisée avec Pinia
- Intercepteurs API pour la gestion des erreurs

## 🧪 Tests

### **Structure de test**
```
src/
├── test/
│   ├── components/
│   ├── stores/
│   ├── services/
│   └── utils/
```

## 📚 Documentation API

Tous les types TypeScript sont documentés et correspondent exactement aux schémas du backend FastAPI.

## 🔄 Intégration Backend

### **Correspondance parfaite**
- Types TypeScript ↔ Schémas Pydantic
- Services API ↔ Endpoints FastAPI
- Stores Pinia ↔ Modèles SQLModel
- Validation ↔ Validation Pydantic

## 🚀 Déploiement

### **Build de production**
```bash
yarn build
```

### **Variables d'environnement**
- `VITE_API_BASE_URL` - URL de l'API backend
- `VITE_APP_TITLE` - Titre de l'application

## 📞 Support

Pour toute question ou problème, consultez la documentation du backend ou contactez l'équipe de développement.
