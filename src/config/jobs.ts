/**
 * Configuration du module emploi
 */

// Endpoints API
export const JOB_API_ENDPOINTS = {
  JOB_OFFERS: '/job-offers',
  JOB_APPLICATIONS: '/job-applications', 
  JOB_ATTACHMENTS: '/job-attachments',
  JOB_STATS: '/job-stats'
} as const

// Configuration de l'upload de fichiers
export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB en bytes
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ],
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
} as const

// Configuration de la pagination
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 48, 96],
  MAX_PAGE_SIZE: 100
} as const

// Configuration des filtres
export const FILTERS_CONFIG = {
  DEBOUNCE_DELAY: 500, // ms
  MAX_SEARCH_LENGTH: 100,
  DEFAULT_SORT: 'created_at',
  DEFAULT_ORDER: 'desc'
} as const

// Messages de l'interface utilisateur
export const UI_MESSAGES = {
  SUCCESS: {
    JOB_CREATED: 'Offre d\'emploi créée avec succès',
    JOB_UPDATED: 'Offre d\'emploi mise à jour avec succès',
    JOB_DELETED: 'Offre d\'emploi supprimée avec succès',
    APPLICATION_SENT: 'Candidature envoyée avec succès',
    APPLICATION_UPDATED: 'Candidature mise à jour avec succès',
    FILE_UPLOADED: 'Fichier téléchargé avec succès',
    STATUS_UPDATED: 'Statut mis à jour avec succès'
  },
  ERRORS: {
    JOB_NOT_FOUND: 'Offre d\'emploi introuvable',
    APPLICATION_NOT_FOUND: 'Candidature introuvable',
    FILE_TOO_LARGE: 'Le fichier est trop volumineux (max 10MB)',
    FILE_TYPE_NOT_ALLOWED: 'Type de fichier non autorisé',
    NETWORK_ERROR: 'Erreur de connexion. Veuillez réessayer.',
    VALIDATION_ERROR: 'Veuillez corriger les erreurs dans le formulaire',
    PERMISSION_DENIED: 'Vous n\'avez pas les permissions nécessaires',
    EXPIRED_OFFER: 'Cette offre d\'emploi a expiré',
    DUPLICATE_APPLICATION: 'Vous avez déjà candidaté à cette offre'
  },
  CONFIRMATION: {
    DELETE_JOB: 'Êtes-vous sûr de vouloir supprimer cette offre d\'emploi ?',
    DELETE_APPLICATION: 'Êtes-vous sûr de vouloir supprimer cette candidature ?',
    CANCEL_CHANGES: 'Êtes-vous sûr de vouloir annuler vos modifications ?',
    LEAVE_PAGE: 'Des modifications non sauvegardées seront perdues. Voulez-vous continuer ?'
  }
} as const

// Configuration des statuts avec couleurs et icônes
export const STATUS_CONFIG = {
  JOB_OFFER: {
    DRAFT: { color: 'surface', icon: 'ri-draft-line', text: 'Brouillon' },
    ACTIVE: { color: 'success', icon: 'ri-check-circle-line', text: 'Active' },
    CLOSED: { color: 'warning', icon: 'ri-pause-circle-line', text: 'Fermée' },
    EXPIRED: { color: 'error', icon: 'ri-time-line', text: 'Expirée' }
  },
  APPLICATION: {
    pending: { color: 'warning', icon: 'ri-time-line', text: 'En attente' },
    processing: { color: 'info', icon: 'ri-loader-line', text: 'En traitement' },
    accepted: { color: 'success', icon: 'ri-check-circle-line', text: 'Acceptée' },
    rejected: { color: 'error', icon: 'ri-close-circle-line', text: 'Rejetée' },
    cancelled: { color: 'surface', icon: 'ri-forbid-line', text: 'Annulée' }
  }
} as const

// Configuration des permissions
export const PERMISSIONS = {
  JOB_OFFERS: {
    VIEW: 'job_offers.view',
    CREATE: 'job_offers.create', 
    UPDATE: 'job_offers.update',
    DELETE: 'job_offers.delete',
    MANAGE: 'job_offers.manage'
  },
  JOB_APPLICATIONS: {
    VIEW: 'job_applications.view',
    UPDATE: 'job_applications.update',
    DELETE: 'job_applications.delete'
  }
} as const

// Configuration des notifications
export const NOTIFICATION_CONFIG = {
  DURATION: {
    SUCCESS: 4000,
    ERROR: 6000,
    WARNING: 5000,
    INFO: 4000
  },
  POSITION: 'top-right',
  MAX_NOTIFICATIONS: 5
} as const

// Configuration du cache
export const CACHE_CONFIG = {
  TTL: {
    JOB_OFFERS: 5 * 60 * 1000, // 5 minutes
    JOB_APPLICATIONS: 2 * 60 * 1000, // 2 minutes
    STATS: 10 * 60 * 1000 // 10 minutes
  }
} as const

// Configuration des validations
export const VALIDATION_CONFIG = {
  JOB_OFFER: {
    TITLE: { min: 5, max: 100 },
    DESCRIPTION: { min: 50, max: 2000 },
    LOCATION: { min: 2, max: 50 },
    SALARY: { min: 0, max: 1000000 }
  },
  APPLICATION: {
    FIRST_NAME: { min: 2, max: 50 },
    LAST_NAME: { min: 2, max: 50 },
    EMAIL: { max: 100 },
    PHONE_NUMBER: { min: 8, max: 20 }
  }
} as const

// Configuration de l'environnement
export const ENV_CONFIG = {
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  enableDebugLogs: import.meta.env.VITE_DEBUG_LOGS === 'true',
  enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true'
} as const

// Fonctions utilitaires de configuration
export const getFileMaxSize = () => FILE_UPLOAD_CONFIG.MAX_FILE_SIZE
export const getPageSize = () => PAGINATION_CONFIG.DEFAULT_PAGE_SIZE
export const isFileTypeAllowed = (type: string) => FILE_UPLOAD_CONFIG.ALLOWED_TYPES.includes(type)
export const isFileSizeValid = (size: number) => size <= FILE_UPLOAD_CONFIG.MAX_FILE_SIZE

// Export des types pour TypeScript
export type JobOfferStatus = keyof typeof STATUS_CONFIG.JOB_OFFER
export type ApplicationStatus = keyof typeof STATUS_CONFIG.APPLICATION
export type PermissionKey = string

// Configuration par défaut pour les nouveaux éléments
export const DEFAULT_VALUES = {
  JOB_OFFER: {
    status: 'DRAFT' as JobOfferStatus,
    currency: 'EUR',
    submission_fee: 0,
    attachment: [] as string[]
  },
  APPLICATION: {
    country_code: '+33',
    civility: '' as string
  },
  FILTERS: {
    page: 1,
    limit: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
    sort: FILTERS_CONFIG.DEFAULT_SORT,
    order: FILTERS_CONFIG.DEFAULT_ORDER as 'asc' | 'desc'
  }
} as const
