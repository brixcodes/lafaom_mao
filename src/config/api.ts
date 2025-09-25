// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://lafaom.vertex-cam.com/api/v1',
  TIMEOUT: 30000, // Augmenté à 30 secondes
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
    PROFILE: '/auth/me',
    MY_PERMISSIONS: '/auth/my-permissions'
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
  
  
  // Job Offers
  JOB_OFFERS: {
    LIST: '/job-offers',
    CREATE: '/job-offers',
    DETAIL: (id: string) => `/job-offers/${id}`,
    UPDATE: (id: string) => `/job-offers/${id}`,
    DELETE: (id: string) => `/job-offers/${id}`,
    STATS: {
      DASHBOARD: '/job-offers/stats/dashboard',
      OFFERS: '/job-offers/stats/offers',
      APPLICATIONS: '/job-offers/stats/applications',
      CONTRACT_TYPES: '/job-offers/stats/contract-types',
      LOCATIONS: '/job-offers/stats/locations',
      SALARY: '/job-offers/stats/salary',
      MONTHLY: '/job-offers/stats/monthly',
      TOP_OFFERS: '/job-offers/stats/top-offers',
      INSIGHTS: '/job-offers/stats/insights',
      EVOLUTION: '/job-offers/stats/evolution'
    },
    APPLICATIONS: {
      LIST: '/job-applications',
      CREATE: '/job-applications',
      DETAIL: (id: number) => `/job-applications/${id}`,
      UPDATE: (id: number) => `/job-applications/${id}`,
      DELETE: (id: number) => `/job-applications/${id}`,
      CHANGE_STATUS: '/job-applications/change-status',
      REQUEST_OTP: '/job-applications/request-otp',
      UPDATE_BY_CANDIDATE: '/job-applications/update-by-candidate',
      ATTACHMENTS: (applicationId: number) => `/job-applications/${applicationId}/attachments`
    },
    ATTACHMENTS: {
      UPLOAD: '/job-attachments',
      DELETE: (id: number) => `/job-attachments/${id}`
    }
  },
  
  // Job Applications (endpoints directs)
  JOB_APPLICATIONS: {
    LIST: '/job-applications',
    CREATE: '/job-applications',
    DETAIL: (id: number) => `/job-applications/${id}`,
    UPDATE: (id: number) => `/job-applications/${id}`,
    DELETE: (id: number) => `/job-applications/${id}`,
    CHANGE_STATUS: '/job-applications/change-status',
    REQUEST_OTP: '/job-applications/request-otp',
    UPDATE_BY_CANDIDATE: '/job-applications/update-by-candidate',
    ATTACHMENTS: (applicationId: number) => `/job-applications/${applicationId}/attachments`,
    STATS: {
      APPLICATIONS: '/job-applications/stats'
    }
  },
  
  // Training
  TRAINING: {
    TRAININGS: '/training/trainings',
    SESSIONS: '/training/sessions',
    APPLICATIONS: '/training/applications',
    SPECIALTIES: '/training/specialties',
    CENTERS: '/training/centers'
  },
  
  // Student Applications
  STUDENT_APPLICATIONS: {
    LIST: '/student-applications',
    MY_APPLICATIONS: '/my-student-applications',
    CREATE: '/student-applications',
    DETAIL: (id: number) => `/student-applications/${id}`,
    UPDATE: (id: number) => `/student-applications/${id}`,
    MY_UPDATE: (id: number) => `/my-student-applications/${id}`,
    DELETE: (id: number) => `/student-applications/${id}`,
    MY_DELETE: (id: number) => `/my-student-applications/${id}`,
    SUBMIT: '/student-applications/submit',
    CHANGE_STATUS: '/student-applications/change-status',
    PAY_TRAINING_FEE: '/my-student-applications/pay-training-fee',
    SUBMIT_WITH_PAYMENT: (id: number) => `/my-student-applications/${id}/submit`,
    ATTACHMENTS: (applicationId: number) => `/student-applications/${applicationId}/attachments`,
    STATS: '/student-applications/stats',
    EXPORT: '/student-applications/export',
    BULK_UPDATE: '/student-applications/bulk-update',
    BULK_DELETE: '/student-applications/bulk-delete',
    CAN_EDIT: (applicationId: number) => `/student-applications/${applicationId}/can-edit`,
    HISTORY: (applicationId: number) => `/student-applications/${applicationId}/history`,
    DUPLICATE: (applicationId: number) => `/student-applications/${applicationId}/duplicate`,
    NOTIFICATIONS: '/student-applications/notifications',
    MARK_NOTIFICATION_READ: (notificationId: string) => `/student-applications/notifications/${notificationId}/read`
  },
  
  // Payments
  PAYMENTS: {
    LIST: '/payments',
    CREATE: '/payments',
    DETAIL: (id: number) => `/payments/${id}`,
    UPDATE: (id: number) => `/payments/${id}`,
    DELETE: (id: number) => `/payments/${id}`,
    BY_TRANSACTION: (transactionId: string) => `/payments-by-transaction/${transactionId}`,
    CHECK_STATUS: (transactionId: string) => `/check-status/${transactionId}`,
    CINETPAY_WEBHOOK: '/cinetpay/notify'
  },
  
  // Reclamations
  RECLAMATIONS: {
    LIST: '/reclamations',
    MY_RECLAMATIONS: '/my-reclamations',
    CREATE: '/my-reclamations',
    DETAIL: (id: number) => `/reclamations/${id}`,
    UPDATE: (id: number) => `/my-reclamations/${id}`,
    DELETE: (id: number) => `/my-reclamations/${id}`,
    UPDATE_STATUS: (id: number) => `/reclamations/${id}/status`
  },
  
  // Reclamation Types
  RECLAMATION_TYPES: {
    LIST: '/reclamation-types',
    ACTIVE: '/reclamation-types/active/all',
    CREATE: '/reclamation-types',
    DETAIL: (id: number) => `/reclamation-types/${id}`,
    UPDATE: (id: number) => `/reclamation-types/${id}`,
    DELETE: (id: number) => `/reclamation-types/${id}`
  },
  
  // System
  SYSTEM: {
    ORGANIZATION_CENTERS: {
      LIST: '/system/organization-centers',
      CREATE: '/system/organization-centers',
      DETAIL: (id: number) => `/system/organization-centers/${id}`,
      UPDATE: (id: number) => `/system/organization-centers/${id}`,
      DELETE: (id: number) => `/system/organization-centers/${id}`,
      CHANGE_STATUS: (id: number) => `/system/organization-centers/change-status/${id}`,
      BY_LOCATION: (countryCode: string) => `/system/organization-centers/location/${countryCode}`,
      INTERNAL: '/system/organization-centers/internal'
    }
  },
  
  // Blog
  BLOG: {
    POSTS: {
      LIST: '/blog/posts',
      CREATE: '/blog/posts',
      DETAIL: (id: number) => `/blog/posts/${id}`,
      BY_SLUG: (slug: string) => `/blog/posts/slug/${slug}`,
      UPDATE: (id: number) => `/blog/posts/${id}`,
      DELETE: (id: number) => `/blog/posts/${id}`,
      PUBLISH: (id: number) => `/blog/posts/${id}/publish`,
      UNPUBLISH: (id: number) => `/blog/posts/${id}/unpublish`,
      INCREMENT_VIEWS: (id: number) => `/blog/posts/${id}/views`,
      SECTIONS: (id: number) => `/blog/posts/${id}/sections`
    },
    CATEGORIES: {
      LIST: '/blog/categories',
      CREATE: '/blog/categories',
      DETAIL: (id: number) => `/blog/categories/${id}`,
      BY_SLUG: (slug: string) => `/blog/categories/slug/${slug}`,
      UPDATE: (id: number) => `/blog/categories/${id}`,
      DELETE: (id: number) => `/blog/categories/${id}`,
      ACTIVE: '/blog/categories/active/all'
    },
    SECTIONS: {
      CREATE: (postId: number) => `/blog/posts/${postId}/sections`,
      UPDATE: (id: number) => `/blog/sections/${id}`,
      DELETE: (id: number) => `/blog/sections/${id}`
    },
    STATS: {
      DASHBOARD: '/blog/stats',
      POPULAR: '/blog/popular',
      RECENT: '/blog/recent'
    }
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
