// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://lafaom.vertex-cam.com/api/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
}

// Configuration des endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/token',
    REFRESH: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    CHANGE_PASSWORD: '/auth/update-password',
    PROFILE: '/auth/me'
  },
  
  // Users
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    ROLES: '/users/roles',
    PERMISSIONS: '/users/permissions'
  },
  
  // Blog
  BLOG: {
    POSTS: '/blog/posts',
    POST_DETAIL: (id: number) => `/blog/posts/${id}`,
    POST_SLUG: (slug: string) => `/blog/posts/slug/${slug}`,
    CATEGORIES: '/blog/categories',
    SECTIONS: (postId: number) => `/blog/posts/${postId}/sections`
  },
  
  // Job Offers
  JOB_OFFERS: {
    LIST: '/job-offers',
    DETAIL: (id: string) => `/job-offers/${id}`,
    APPLICATIONS: '/job-offers/applications'
  },
  
  // Training
  TRAINING: {
    TRAININGS: '/training/trainings',
    SESSIONS: '/training/sessions',
    APPLICATIONS: '/training/applications',
    SPECIALTIES: '/training/specialties',
    CENTERS: '/training/centers'
  },
  
  // Payments
  PAYMENTS: {
    LIST: '/payments',
    DETAIL: (id: string) => `/payments/${id}`
  }
}

// Configuration des fichiers
export const FILE_CONFIG = {
  MAX_SIZE: {
    IMAGE: 5 * 1024 * 1024, // 5MB
    DOCUMENT: 10 * 1024 * 1024, // 10MB
    VIDEO: 50 * 1024 * 1024 // 50MB
  },
  ALLOWED_TYPES: {
    IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    VIDEO: ['video/mp4', 'video/avi', 'video/mov']
  }
}

// Configuration de la pagination
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100
}

// Configuration des notifications
export const NOTIFICATION_CONFIG = {
  DURATION: {
    SUCCESS: 3000,
    ERROR: 5000,
    WARNING: 4000,
    INFO: 3000
  },
  POSITION: 'top-right'
}
