<template>
  <VCard class="pa-3">
    <VDataTable 
      :headers="headers" 
      :items="payments" 
      :loading="isLoading" 
      class="elevation-0" 
      item-value="id"
    >
      <template #item.payment_id="{ item }">
        <div class="font-weight-medium">{{ item.payment_id || item.id || 'N/A' }}</div>
      </template>
      
      <template #item.transaction_id="{ item }">
        <VChip color="primary" size="small" variant="tonal">{{ item.transaction_id }}</VChip>
      </template>
      
      <template #item.amount="{ item }">
        <div class="font-weight-medium">{{ formatAmount((item as any).product_amount || item.amount, (item as any).product_currency || item.currency) }}</div>
      </template>
      
      <template #item.status="{ item }">
        <VChip 
          :color="getStatusColor(item.status || 'PENDING')" 
          size="small" 
          variant="tonal"
        >
          <VIcon :icon="getStatusIcon(item.status || 'PENDING')" class="me-1" />
          {{ getStatusText(item.status || 'PENDING') }}
        </VChip>
      </template>
      
      <template #item.payment_method="{ item }">
        <VChip 
          :color="getMethodColor(item.payment_method || 'CINETPAY')" 
          size="small" 
          variant="tonal"
        >
          <VIcon :icon="getMethodIcon(item.payment_method || 'CINETPAY')" class="me-1" />
          {{ getMethodText(item.payment_method || 'CINETPAY') }}
        </VChip>
      </template>
      
      <template #item.created_at="{ item }">
        <div class="text-body-2">{{ formatDate(item.created_at || new Date().toISOString()) }}</div>
      </template>
      
      <template #item.actions="{ item }">
        <div class="d-flex gap-2">
          <VBtn 
            icon="ri-eye-line" 
            size="small" 
            color="primary" 
            variant="text"
            @click.stop="$emit('view', item.id)" 
          />
          <VBtn 
            icon="ri-edit-line" 
            size="small" 
            color="secondary" 
            variant="text"
            @click.stop="$emit('edit', item.id)" 
          />
          <VBtn 
            icon="ri-refresh-line" 
            size="small" 
            color="info" 
            variant="text"
            @click.stop="$emit('check-status', item.transaction_id)" 
          />
          <VBtn 
            icon="ri-delete-bin-line" 
            size="small" 
            color="error" 
            variant="text"
            @click.stop="$emit('delete', item)" 
          />
        </div>
      </template>
    </VDataTable>
  </VCard>
</template>

<script setup lang="ts">
import type { Payment, PaymentStatusEnum, PaymentMethodEnum } from '@/types/payment'

interface Props {
  payments: Payment[]
  headers: any[]
  isLoading: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['view', 'edit', 'delete', 'check-status'])

// Status configuration
const getStatusColor = (status: PaymentStatusEnum) => {
  const colors = {
    PENDING: 'warning',
    SUCCESS: 'success',
    FAILED: 'error',
    CANCELLED: 'info',
    REFUNDED: 'secondary'
  }
  return colors[status] || 'default'
}

const getStatusIcon = (status: PaymentStatusEnum) => {
  const icons = {
    PENDING: 'ri-time-line',
    SUCCESS: 'ri-check-line',
    FAILED: 'ri-close-line',
    CANCELLED: 'ri-close-circle-line',
    REFUNDED: 'ri-refresh-line'
  }
  return icons[status] || 'ri-question-line'
}

const getStatusText = (status: PaymentStatusEnum) => {
  const texts = {
    PENDING: 'En attente',
    SUCCESS: 'Réussi',
    FAILED: 'Échoué',
    CANCELLED: 'Annulé',
    REFUNDED: 'Remboursé'
  }
  return texts[status] || status
}

// Method configuration
const getMethodColor = (method: PaymentMethodEnum) => {
  const colors = {
    CINETPAY: 'primary',
    MOBILE_MONEY: 'success',
    BANK_CARD: 'info'
  }
  return colors[method] || 'default'
}

const getMethodIcon = (method: PaymentMethodEnum) => {
  const icons = {
    CINETPAY: 'ri-bank-card-line',
    MOBILE_MONEY: 'ri-smartphone-line',
    BANK_CARD: 'ri-bank-line'
  }
  return icons[method] || 'ri-question-line'
}

const getMethodText = (method: PaymentMethodEnum) => {
  const texts = {
    CINETPAY: 'CinetPay',
    MOBILE_MONEY: 'Mobile Money',
    BANK_CARD: 'Carte Bancaire'
  }
  return texts[method] || method
}

// Utility functions
const formatAmount = (amount: number, currency: string) => {
  // Fallback currency if not provided or invalid
  const validCurrency = currency && currency.length >= 3 ? currency : 'XOF'
  
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: validCurrency
    }).format(amount)
  } catch (error) {
    // Fallback if currency is not supported
    return `${amount} ${validCurrency}`
  }
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'Date invalide'
    }
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'Date invalide'
  }
}
</script>

<style scoped>
/* Soft, modern style */
</style>
