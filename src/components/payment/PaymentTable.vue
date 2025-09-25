<template>
    <VCard class="pa-3">
        <VDataTable :headers="headers" :items="payments" :loading="isLoading" class="elevation-0" item-value="id">

            <template #item.transaction_id="{ item }">
                {{ item.transaction_id }}
            </template>

            <template #item.amount="{ item }">
                <div class="font-weight-medium">{{ formatAmount(item.product_amount, item.product_currency) }}</div>
            </template>

            <template #item.status="{ item }">
                <VChip :color="getStatusColor(item.status || 'pending')" size="small" variant="elevated">
                    <VIcon :icon="getStatusIcon(item.status || 'pending')" class="me-1" />
                    {{ getStatusText(item.status || 'pending') }}
                </VChip>
            </template>

            <template #item.payment_method="{ item }">
                {{ getMethodText(item.payment_type || 'CINETPAY') }}
            </template>

            <template #item.created_at="{ item }">
                <div class="text-body-2">{{ formatDate(new Date().toISOString()) }}</div>
            </template>

            <template #item.actions="{ item }">
                <div class="d-flex gap-2">
                    <VBtn icon="ri-eye-line" size="small" color="primary" variant="text"
                        @click.stop="$emit('view-transaction', item.transaction_id)" />
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
const emit = defineEmits(['view', 'view-transaction', 'edit', 'delete', 'check-status'])

// Status configuration
const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        pending: 'warning',
        success: 'success',
        failed: 'error',
        refused: 'error',
        cancelled: 'info',
        refunded: 'secondary'
    }
    return colors[status] || 'default'
}

const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
        pending: 'ri-time-line',
        success: 'ri-check-line',
        failed: 'ri-close-line',
        refused: 'ri-close-line',
        cancelled: 'ri-close-circle-line',
        refunded: 'ri-refresh-line'
    }
    return icons[status] || 'ri-question-line'
}

const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
        pending: 'En attente',
        success: 'Réussi',
        failed: 'Échoué',
        refused: 'Refusé',
        cancelled: 'Annulé',
        refunded: 'Remboursé'
    }
    return texts[status] || status
}

// Method configuration
const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
        CINETPAY: 'primary',
        CinetPayPayment: 'primary',
        MOBILE_MONEY: 'success',
        BANK_CARD: 'info'
    }
    return colors[method] || 'default'
}

const getMethodIcon = (method: string) => {
    const icons: Record<string, string> = {
        CINETPAY: 'ri-bank-card-line',
        CinetPayPayment: 'ri-bank-card-line',
        MOBILE_MONEY: 'ri-smartphone-line',
        BANK_CARD: 'ri-bank-line'
    }
    return icons[method] || 'ri-question-line'
}

const getMethodText = (method: string) => {
    const texts: Record<string, string> = {
        CINETPAY: 'CinetPay',
        CinetPayPayment: 'CinetPay',
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
