import { ref, computed } from 'vue'
import { paymentsService } from '@/services/api/payments'
import { showToast } from '@/components/toast/toastManager'
import type {
  Payment,
  PaymentCreateInput,
  PaymentUpdateInput,
  PaymentFilter,
  PaymentStatusCheckInput,
  CinetpayWebhookInput,
  PaymentStatusEnum,
  PaymentMethodEnum,
  PaymentStatusConfig,
  PaymentMethodConfig
} from '@/types/payment'

// State
const payments = ref<Payment[]>([])
const currentPayment = ref<Payment | null>(null)
const isLoading = ref(false)
const error = ref('')
const totalCount = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const totalPages = ref(0)
const filters = ref<Partial<PaymentFilter>>({})
const searchQuery = ref('')

// Computed
const hasNextPage = computed(() => currentPage.value < totalPages.value)
const hasPreviousPage = computed(() => currentPage.value > 1)

// Filtrage côté client comme les posts
const filteredPayments = computed(() => {
  if (!searchQuery.value && !Object.keys(filters.value).length) {
    return payments.value
  }

  return payments.value.filter(payment => {
    // Recherche textuelle
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const matchesSearch = 
        payment.transaction_id.toLowerCase().includes(query) ||
        payment.payable_id.toLowerCase().includes(query) ||
        payment.payable_type.toLowerCase().includes(query) ||
        payment.payment_type.toLowerCase().includes(query)
      
      if (!matchesSearch) return false
    }

    // Filtre par statut
    if (filters.value.status && payment.status !== filters.value.status) {
      return false
    }

    // Filtre par méthode de paiement
    if (filters.value.payment_method && payment.payment_type !== filters.value.payment_method) {
      return false
    }

    // Filtre par devise
    if (filters.value.currency && payment.product_currency !== filters.value.currency) {
      return false
    }

    // Filtre par montant minimum
    if (filters.value.amount_min && payment.product_amount < filters.value.amount_min) {
      return false
    }

    // Filtre par montant maximum
    if (filters.value.amount_max && payment.product_amount > filters.value.amount_max) {
      return false
    }

    // Filtre par date de début
    if (filters.value.date_from) {
      const paymentDate = new Date() // Utiliser la date actuelle comme fallback
      const fromDate = new Date(filters.value.date_from)
      if (paymentDate < fromDate) return false
    }

    // Filtre par date de fin
    if (filters.value.date_to) {
      const paymentDate = new Date() // Utiliser la date actuelle comme fallback
      const toDate = new Date(filters.value.date_to)
      if (paymentDate > toDate) return false
    }

    return true
  })
})

const totalFilteredPages = computed(() =>
  Math.ceil(filteredPayments.value.length / pageSize.value)
)

const paginatedPayments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredPayments.value.slice(start, end)
})

const hasActiveFilters = computed(() =>
  searchQuery.value ||
  filters.value.status ||
  filters.value.payment_method ||
  filters.value.currency ||
  filters.value.amount_min ||
  filters.value.amount_max ||
  filters.value.date_from ||
  filters.value.date_to
)

// Payment Status Configuration
const getStatusConfig = (status: PaymentStatusEnum): PaymentStatusConfig => {
  const configs: Record<string, PaymentStatusConfig> = {
    PENDING: { color: 'warning', text: 'En attente', icon: 'ri-time-line' },
    SUCCESS: { color: 'success', text: 'Réussi', icon: 'ri-check-line' },
    FAILED: { color: 'error', text: 'Échoué', icon: 'ri-close-line' },
    CANCELLED: { color: 'info', text: 'Annulé', icon: 'ri-close-circle-line' },
    REFUNDED: { color: 'secondary', text: 'Remboursé', icon: 'ri-refresh-line' }
  }
  return configs[status.toString()] || { color: 'default', text: status.toString(), icon: 'ri-question-line' }
}

// Payment Method Configuration
const getMethodConfig = (method: PaymentMethodEnum): PaymentMethodConfig => {
  const configs = {
    CINETPAY: { color: 'primary', text: 'CinetPay', icon: 'ri-bank-card-line' },
    MOBILE_MONEY: { color: 'success', text: 'Mobile Money', icon: 'ri-smartphone-line' },
    BANK_CARD: { color: 'info', text: 'Carte Bancaire', icon: 'ri-bank-line' }
  }
  return configs[method] || { color: 'default', text: method, icon: 'ri-question-line' }
}

// Methods
const loadPayments = async (reset = false) => {
  try {
    isLoading.value = true
    error.value = ''
    
    if (reset) {
      currentPage.value = 1
    }
    
    // Charger toutes les données d'un coup (comme les posts)
    const params: PaymentFilter = {
      page: 1,
      page_size: 1000, // Charger beaucoup de données
    }
    
    console.log('🔍 Chargement des paiements avec params:', params)
    
    const response = await paymentsService.getPayments(params as any)
    console.log('📋 Réponse API paiements:', response)
    
    payments.value = response.data
    totalCount.value = response.total_number
    
  } catch (err: any) {
    console.error('Erreur lors du chargement des paiements:', err)
    error.value = 'Erreur lors du chargement des paiements'
    showToast({ message: 'Erreur lors du chargement des paiements', type: 'error' })
  } finally {
    isLoading.value = false
  }
}

const getPayment = async (paymentId: number) => {
  try {
    isLoading.value = true
    error.value = ''
    
    const response = await paymentsService.getPaymentById(paymentId)
    currentPayment.value = response as any
    
    return response
  } catch (err: any) {
    console.error('Erreur lors du chargement du paiement:', err)
    error.value = 'Erreur lors du chargement du paiement'
    showToast({ message: 'Erreur lors du chargement du paiement', type: 'error' })
    throw err
  } finally {
    isLoading.value = false
  }
}

const getPaymentByTransaction = async (transactionId: string) => {
  try {
    isLoading.value = true
    error.value = ''
    
    const response = await paymentsService.getPaymentByTransactionId(transactionId)
    
    return response
  } catch (err: any) {
    console.error('Erreur lors du chargement du paiement par transaction:', err)
    error.value = 'Erreur lors du chargement du paiement'
    showToast({ message: 'Erreur lors du chargement du paiement', type: 'error' })
    throw err
  } finally {
    isLoading.value = false
  }
}

const checkPaymentStatus = async (transactionId: string) => {
  try {
    isLoading.value = true
    error.value = ''
    
    const response = await paymentsService.checkPaymentStatus(transactionId)
    
    return response
  } catch (err: any) {
    console.error('Erreur lors de la vérification du statut:', err)
    error.value = 'Erreur lors de la vérification du statut'
    showToast({ message: 'Erreur lors de la vérification du statut', type: 'error' })
    throw err
  } finally {
    isLoading.value = false
  }
}

const createPayment = async (data: PaymentCreateInput) => {
  try {
    isLoading.value = true
    error.value = ''
    
    const response = await paymentsService.createPayment(data as any)
    
    showToast({
      message: 'Paiement créé avec succès',
      type: 'success'
    })
    
    // Recharger la liste
    await loadPayments(true)
    
    return response
  } catch (err: any) {
    console.error('Erreur lors de la création du paiement:', err)
    error.value = 'Erreur lors de la création du paiement'
    showToast({ message: 'Erreur lors de la création du paiement', type: 'error' })
    throw err
  } finally {
    isLoading.value = false
  }
}

const updatePayment = async (paymentId: number, data: PaymentUpdateInput) => {
  try {
    isLoading.value = true
    error.value = ''
    
    const response = await paymentsService.updatePayment(paymentId, data)
    
    showToast({
      message: 'Paiement mis à jour avec succès',
      type: 'success'
    })
    
    // Recharger la liste
    await loadPayments(true)
    
    return response
  } catch (err: any) {
    console.error('Erreur lors de la mise à jour du paiement:', err)
    error.value = 'Erreur lors de la mise à jour du paiement'
    showToast({ message: 'Erreur lors de la mise à jour du paiement', type: 'error' })
    throw err
  } finally {
    isLoading.value = false
  }
}

const deletePayment = async (paymentId: number) => {
  try {
    isLoading.value = true
    error.value = ''
    
    await paymentsService.deletePayment(paymentId)
    
    showToast({
      message: 'Paiement supprimé avec succès',
      type: 'success'
    })
    
    // Recharger la liste
    await loadPayments(true)
    
  } catch (err: any) {
    console.error('Erreur lors de la suppression du paiement:', err)
    error.value = 'Erreur lors de la suppression du paiement'
    showToast({ message: 'Erreur lors de la suppression du paiement', type: 'error' })
    throw err
  } finally {
    isLoading.value = false
  }
}

const handleCinetpayWebhook = async (data: CinetpayWebhookInput) => {
  try {
    isLoading.value = true
    error.value = ''
    
    const response = await paymentsService.handleCinetPayWebhook(data)
    
    return response
  } catch (err: any) {
    console.error('Erreur lors du traitement du webhook CinetPay:', err)
    error.value = 'Erreur lors du traitement du webhook'
    showToast({ message: 'Erreur lors du traitement du webhook', type: 'error' })
    throw err
  } finally {
    isLoading.value = false
  }
}

const searchPayments = async (query: string) => {
  searchQuery.value = query
  currentPage.value = 1
}

const applyFilters = async (newFilters: Partial<PaymentFilter>) => {
  filters.value = { ...filters.value, ...newFilters }
  currentPage.value = 1
}

const clearFilters = async () => {
  filters.value = {}
  searchQuery.value = ''
  currentPage.value = 1
}

const loadNextPage = async () => {
  if (hasNextPage.value) {
    currentPage.value++
    await loadPayments()
  }
}

const loadPreviousPage = async () => {
  if (hasPreviousPage.value) {
    currentPage.value--
    await loadPayments()
  }
}

// Export
export const usePayment = () => ({
  // State
  payments,
  currentPayment,
  isLoading,
  error,
  totalCount,
  currentPage,
  pageSize,
  totalPages,
  filters,
  searchQuery,
  
  // Computed
  hasNextPage,
  hasPreviousPage,
  filteredPayments,
  totalFilteredPages,
  paginatedPayments,
  hasActiveFilters,
  
  // Methods
  loadPayments,
  getPayment,
  getPaymentByTransaction,
  checkPaymentStatus,
  createPayment,
  updatePayment,
  deletePayment,
  handleCinetpayWebhook,
  searchPayments,
  applyFilters,
  clearFilters,
  loadNextPage,
  loadPreviousPage,
  getStatusConfig,
  getMethodConfig
})
