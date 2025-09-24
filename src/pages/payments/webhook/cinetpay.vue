<template>
  <VContainer>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 mb-2">Webhook CinetPay</h1>
        <p class="text-body-1 text-medium-emphasis">Gestionnaire de webhook pour les notifications CinetPay</p>
      </div>
      <VBtn variant="outlined" prepend-icon="ri-arrow-left-line" @click="goBack">Retour</VBtn>
    </div>

    <VCard>
      <VCardText>
        <VRow>
          <VCol cols="12" md="8">
            <VCard variant="outlined">
              <VCardTitle>Test du webhook CinetPay</VCardTitle>
              <VCardText>
                <VForm ref="formRef" @submit.prevent="handleWebhookTest">
                  <VRow>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="webhookData.cpm_trans_id"
                        label="ID Transaction"
                        required
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="webhookData.cpm_amount"
                        label="Montant"
                        type="number"
                        required
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="webhookData.cpm_currency"
                        label="Devise"
                        value="XOF"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VSelect
                        v-model="webhookData.cpm_result"
                        label="Résultat"
                        :items="resultOptions"
                        required
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="webhookData.cpm_phone_number"
                        label="Numéro de téléphone"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="webhookData.cpm_designation"
                        label="Désignation"
                      />
                    </VCol>
                    <VCol cols="12">
                      <VTextarea
                        v-model="webhookData.cpm_error_message"
                        label="Message d'erreur"
                        rows="2"
                      />
                    </VCol>
                  </VRow>
                  
                  <div class="d-flex justify-end gap-3 mt-4">
                    <VBtn variant="outlined" @click="resetForm">
                      Réinitialiser
                    </VBtn>
                    <VBtn 
                      type="submit" 
                      color="primary" 
                      :loading="isSubmitting"
                    >
                      Tester le webhook
                    </VBtn>
                  </div>
                </VForm>
              </VCardText>
            </VCard>
          </VCol>
          
          <VCol cols="12" md="4">
            <VCard variant="outlined">
              <VCardTitle>Résultat du test</VCardTitle>
              <VCardText>
                <div v-if="webhookResult" class="space-y-3">
                  <div class="d-flex align-center gap-2">
                    <VIcon 
                      :icon="webhookResult.processed ? 'ri-check-line' : 'ri-close-line'" 
                      :color="webhookResult.processed ? 'success' : 'error'" 
                    />
                    <span>{{ webhookResult.processed ? 'Traité avec succès' : 'Erreur de traitement' }}</span>
                  </div>
                  <div>
                    <div class="text-caption text-medium-emphasis">Transaction ID</div>
                    <div class="text-body-2">{{ webhookResult.transaction_id }}</div>
                  </div>
                  <div>
                    <div class="text-caption text-medium-emphasis">Statut</div>
                    <VChip :color="getStatusColor(webhookResult.status)" size="small">
                      {{ getStatusText(webhookResult.status) }}
                    </VChip>
                  </div>
                </div>
                
                <div v-else class="text-center py-4">
                  <VIcon icon="ri-information-line" size="32" color="info" />
                  <div class="mt-2 text-body-2">Aucun test effectué</div>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePayment } from '@/composables/usePayment'
import { PaymentStatusEnum } from '@/types/payment'
import type { CinetpayWebhookInput } from '@/types/payment'

// Router
const router = useRouter()

// Composable
const { handleCinetpayWebhook, isLoading } = usePayment()

// State
const formRef = ref()
const isSubmitting = ref(false)
const webhookResult = ref<any>(null)

const webhookData = ref<CinetpayWebhookInput>({
  cpm_trans_id: '',
  cpm_trans_date: new Date().toISOString(),
  cpm_amount: 0,
  cpm_currency: 'XOF',
  cpm_payid: '',
  cpm_payment_date: new Date().toISOString(),
  cpm_payment_time: new Date().toTimeString(),
  cpm_error_message: '',
  cpm_phone_prefixe: '+225',
  cpm_phone_number: '',
  cpm_ipn_ack: 'YES',
  cpm_result: '00',
  cpm_trans_status: 'ACCEPTED',
  cpm_designation: '',
  cpm_custom: '',
  cpm_signature: ''
})

const resultOptions = [
  { title: 'Succès (00)', value: '00' },
  { title: 'Échec (01)', value: '01' },
  { title: 'Annulé (02)', value: '02' }
]

// Methods
const handleWebhookTest = async () => {
  try {
    isSubmitting.value = true
    webhookResult.value = null
    
    const result = await handleCinetpayWebhook(webhookData.value)
    webhookResult.value = result
  } catch (error) {
    console.error('Erreur lors du test du webhook:', error)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  webhookData.value = {
    cpm_trans_id: '',
    cpm_trans_date: new Date().toISOString(),
    cpm_amount: 0,
    cpm_currency: 'XOF',
    cpm_payid: '',
    cpm_payment_date: new Date().toISOString(),
    cpm_payment_time: new Date().toTimeString(),
    cpm_error_message: '',
    cpm_phone_prefixe: '+225',
    cpm_phone_number: '',
    cpm_ipn_ack: 'YES',
    cpm_result: '00',
    cpm_trans_status: 'ACCEPTED',
    cpm_designation: '',
    cpm_custom: '',
    cpm_signature: ''
  }
  webhookResult.value = null
}

const goBack = () => {
  router.push({ name: 'payments-index' })
}

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
</script>

<style scoped>
.v-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}
</style>
