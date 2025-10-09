export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://lafaom.vertex-cam.com/api/v1',
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