import { ref, computed } from 'vue'
import { paymentService } from '@/services/api/payment'
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

// Computed
const hasNextPage = computed(() => currentPage.value < totalPages.value)
const hasPreviousPage = computed(() => currentPage.value > 1)

// Payment Status Configuration
const getStatusConfig = (status: PaymentStatusEnum): PaymentStatusConfig => {
  const configs = {
    PENDING: { color: 'warning', text: 'En attente', icon: 'ri-time-line' },
    SUCCESS: { color: 'success', text: 'Réussi', icon: 'ri-check-line' },
    FAILED: { color: 'error', text: 'Échoué', icon: 'ri-close-line' },
    CANCELLED: { color: 'info', text: 'Annulé', icon: 'ri-close-circle-line' },
    REFUNDED: { color: 'secondary', text: 'Remboursé', icon: 'ri-refresh-line' }
  }
  return configs[status] || { color: 'default', text: status, icon: 'ri-question-line' }
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
    
    const params: PaymentFilter = {
      page: currentPage.value,
      page_size: pageSize.value,
      ...filters.value
    }
    
    console.log('🔍 Chargement des paiements avec params:', params)
    
    const response = await paymentService.getPayments(params)
    console.log('📋 Réponse API paiements:', response)
    
    payments.value = response.data
    totalCount.value = response.total_number
    totalPages.value = Math.ceil(response.total_number / pageSize.value)
    
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
    
    const response = await paymentService.getPayment(paymentId)
    currentPayment.value = response.data
    
    return response.data
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
    
    const response = await paymentService.getPaymentByTransaction(transactionId)
    
    return response.data
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
    
    const response = await paymentService.checkPaymentStatus(transactionId)
    
    return response.data
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
    
    const response = await paymentService.createPayment(data)
    
    showToast({
      message: 'Paiement créé avec succès',
      type: 'success'
    })
    
    // Recharger la liste
    await loadPayments(true)
    
    return response.data
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
    
    const response = await paymentService.updatePayment(paymentId, data)
    
    showToast({
      message: 'Paiement mis à jour avec succès',
      type: 'success'
    })
    
    // Recharger la liste
    await loadPayments(true)
    
    return response.data
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
    
    await paymentService.deletePayment(paymentId)
    
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
    
    const response = await paymentService.handleCinetpayWebhook(data)
    
    return response.data
  } catch (err: any) {
    console.error('Erreur lors du traitement du webhook CinetPay:', err)
    error.value = 'Erreur lors du traitement du webhook'
    showToast({ message: 'Erreur lors du traitement du webhook', type: 'error' })
    throw err
  } finally {
    isLoading.value = false
  }
}

const applyFilters = async (newFilters: Partial<PaymentFilter>) => {
  filters.value = { ...filters.value, ...newFilters }
  await loadPayments(true)
}

const clearFilters = async () => {
  filters.value = {}
  await loadPayments(true)
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
  
  // Computed
  hasNextPage,
  hasPreviousPage,
  
  // Methods
  loadPayments,
  getPayment,
  getPaymentByTransaction,
  checkPaymentStatus,
  createPayment,
  updatePayment,
  deletePayment,
  handleCinetpayWebhook,
  applyFilters,
  clearFilters,
  loadNextPage,
  loadPreviousPage,
  getStatusConfig,
  getMethodConfig
})
