import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { paymentService } from '@/services/api/payments'
import type {
  Payment,
  PaymentInitInput,
  CinetPayInit,
  PaymentFilter,
} from '@/types/payments'
import { PaymentStatusEnum } from '@/types/enums'

export const usePaymentStore = defineStore('payments', () => {
  // ===========================================
  // STATE
  // ===========================================

  const payments = ref<Payment[]>([])
  const currentPayment = ref<Payment | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const totalCount = ref(0)
  const currentPage = ref(1)
  const totalPages = ref(0)
  const paymentStats = ref<any>(null)

  // ===========================================
  // GETTERS
  // ===========================================

  const getPaymentById = computed(() => {
    return (id: string) => payments.value.find(p => p.id === id)
  })

  const getPaymentsByStatus = computed(() => {
    return (status: PaymentStatusEnum) => 
      payments.value.filter(p => p.status === status)
  })

  const getPaymentsByCurrency = computed(() => {
    return (currency: string) => 
      payments.value.filter(p => p.currency === currency)
  })

  const getPaymentsByCustomer = computed(() => {
    return (email: string) => 
      payments.value.filter(p => p.customer_email === email)
  })

  const totalAmount = computed(() => {
    return payments.value.reduce((sum, payment) => sum + payment.amount, 0)
  })

  const successfulPayments = computed(() => {
    return payments.value.filter(p => p.status === PaymentStatusEnum.ACCEPTED)
  })

  const pendingPayments = computed(() => {
    return payments.value.filter(p => p.status === PaymentStatusEnum.PENDING)
  })

  const failedPayments = computed(() => {
    return payments.value.filter(p => 
      p.status === PaymentStatusEnum.REFUSED || 
      p.status === PaymentStatusEnum.ERROR
    )
  })

  // ===========================================
  // ACTIONS
  // ===========================================

  // Fetch payments with filters
  const fetchPayments = async (filters: PaymentFilter = {}) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await paymentService.getPayments(filters)
      payments.value = response.data
      totalCount.value = response.total_number
      currentPage.value = response.page
      totalPages.value = Math.ceil(response.total_number / (filters.limit || 10))
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des paiements'
      console.error('Error fetching payments:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Fetch single payment
  const fetchPayment = async (paymentId: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await paymentService.getPayment(paymentId)
      currentPayment.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement du paiement'
      console.error('Error fetching payment:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Create payment
  const createPayment = async (data: PaymentInitInput) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await paymentService.createPayment(data)
      return response
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la création du paiement'
      console.error('Error creating payment:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Init payment
  const initPayment = async (data: PaymentInitInput) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await paymentService.initPayment(data)
      return response
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de l\'initialisation du paiement'
      console.error('Error initializing payment:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Init CinetPay payment
  const initCinetPayPayment = async (data: CinetPayInit) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await paymentService.initCinetPayPayment(data)
      return response
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de l\'initialisation du paiement CinetPay'
      console.error('Error initializing CinetPay payment:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Verify payment
  const verifyPayment = async (paymentId: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await paymentService.verifyPayment(paymentId)
      const index = payments.value.findIndex(p => p.id === paymentId)
      if (index !== -1) {
        payments.value[index] = response.data
      }
      if (currentPayment.value?.id === paymentId) {
        currentPayment.value = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la vérification du paiement'
      console.error('Error verifying payment:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Cancel payment
  const cancelPayment = async (paymentId: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await paymentService.cancelPayment(paymentId)
      const index = payments.value.findIndex(p => p.id === paymentId)
      if (index !== -1) {
        payments.value[index] = response.data
      }
      if (currentPayment.value?.id === paymentId) {
        currentPayment.value = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de l\'annulation du paiement'
      console.error('Error canceling payment:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Refund payment
  const refundPayment = async (paymentId: string, amount?: number) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await paymentService.refundPayment(paymentId, amount)
      const index = payments.value.findIndex(p => p.id === paymentId)
      if (index !== -1) {
        payments.value[index] = response.data
      }
      if (currentPayment.value?.id === paymentId) {
        currentPayment.value = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du remboursement'
      console.error('Error refunding payment:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // User operations
  const fetchMyPayments = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await paymentService.getMyPayments()
      payments.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement de vos paiements'
      console.error('Error fetching my payments:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchMyPayment = async (paymentId: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await paymentService.getMyPayment(paymentId)
      currentPayment.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement de votre paiement'
      console.error('Error fetching my payment:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Statistics
  const fetchPaymentStats = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await paymentService.getPaymentStats()
      paymentStats.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des statistiques'
      console.error('Error fetching payment stats:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchUserPaymentStats = async (userId: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await paymentService.getUserPaymentStats(userId)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des statistiques utilisateur'
      console.error('Error fetching user payment stats:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Clear error
  const clearError = () => {
    error.value = null
  }

  // Reset state
  const resetState = () => {
    payments.value = []
    currentPayment.value = null
    isLoading.value = false
    error.value = null
    totalCount.value = 0
    currentPage.value = 1
    totalPages.value = 0
    paymentStats.value = null
  }

  return {
    // State
    payments,
    currentPayment,
    isLoading,
    error,
    totalCount,
    currentPage,
    totalPages,
    paymentStats,
    
    // Getters
    getPaymentById,
    getPaymentsByStatus,
    getPaymentsByCurrency,
    getPaymentsByCustomer,
    totalAmount,
    successfulPayments,
    pendingPayments,
    failedPayments,
    
    // Actions
    fetchPayments,
    fetchPayment,
    createPayment,
    initPayment,
    initCinetPayPayment,
    verifyPayment,
    cancelPayment,
    refundPayment,
    fetchMyPayments,
    fetchMyPayment,
    fetchPaymentStats,
    fetchUserPaymentStats,
    clearError,
    resetState,
  }
})
