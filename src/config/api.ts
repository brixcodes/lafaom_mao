export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://194.238.25.170/api/v1',
  ENDPOINTS: {
    DASHBOARD: {
      COMPREHENSIVE_STATS: '/dashboard/comprehensive-stats',
      PAYMENT_STATS: '/dashboard/payment-stats'
    }
  }
}

export const APP_CONFIG = {
  NAME: 'LAFAOM Dashboard',
  VERSION: '1.0.0',
  DEBUG: import.meta.env.VITE_DEBUG === 'true'
}