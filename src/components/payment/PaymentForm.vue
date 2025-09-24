<template>
  <VForm ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
    <VRow>
      <VCol cols="12" md="6">
        <VTextField
          v-model="formData.amount"
          label="Montant *"
          type="number"
          step="0.01"
          :rules="amountRules"
          required
        />
      </VCol>
      <VCol cols="12" md="6">
        <VSelect
          v-model="formData.currency"
          label="Devise *"
          :items="currencyOptions"
          :rules="currencyRules"
          required
        />
      </VCol>
      <VCol cols="12" md="6">
        <VSelect
          v-model="formData.payment_method"
          label="Méthode de paiement *"
          :items="methodOptions"
          :rules="methodRules"
          required
        />
      </VCol>
      <VCol cols="12" md="6">
        <VTextField
          v-model="formData.application_id"
          label="ID de candidature"
          type="number"
        />
      </VCol>
      <VCol cols="12">
        <VTextarea
          v-model="formData.description"
          label="Description"
          rows="3"
        />
      </VCol>
      <VCol cols="12">
        <VTextarea
          v-model="metadataText"
          label="Métadonnées (JSON)"
          rows="4"
          placeholder='{"key": "value"}'
        />
      </VCol>
    </VRow>
    
    <div class="d-flex justify-end gap-3 mt-6">
      <VBtn variant="outlined" @click="$emit('cancel')">
        Annuler
      </VBtn>
      <VBtn 
        type="submit" 
        color="primary" 
        :loading="isSubmitting"
        :disabled="!isFormValid"
      >
        {{ isEdit ? 'Mettre à jour' : 'Créer' }}
      </VBtn>
    </div>
  </VForm>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { PaymentCreateInput, PaymentMethodEnum } from '@/types/payment'

interface Props {
  initialData?: Partial<PaymentCreateInput>
  isEdit?: boolean
  isSubmitting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  isSubmitting: false
})

const emit = defineEmits(['submit', 'cancel'])

// Form state
const formRef = ref()
const isFormValid = ref(false)
const metadataText = ref('')

const formData = ref<PaymentCreateInput>({
  amount: 0,
  currency: 'XOF',
  payment_method: PaymentMethodEnum.CINETPAY,
  application_id: undefined,
  description: '',
  metadata: {}
})

// Options
const currencyOptions = [
  { title: 'Franc CFA (XOF)', value: 'XOF' },
  { title: 'Euro (EUR)', value: 'EUR' },
  { title: 'Dollar US (USD)', value: 'USD' }
]

const methodOptions = [
  { title: 'CinetPay', value: PaymentMethodEnum.CINETPAY },
  { title: 'Mobile Money', value: PaymentMethodEnum.MOBILE_MONEY },
  { title: 'Carte Bancaire', value: PaymentMethodEnum.BANK_CARD }
]

// Validation rules
const amountRules = [
  (v: number) => !!v || 'Le montant est requis',
  (v: number) => v > 0 || 'Le montant doit être positif'
]

const currencyRules = [
  (v: string) => !!v || 'La devise est requise'
]

const methodRules = [
  (v: string) => !!v || 'La méthode de paiement est requise'
]

// Watch for initial data
watch(() => props.initialData, (newData) => {
  if (newData) {
    formData.value = { ...formData.value, ...newData }
    if (newData.metadata) {
      metadataText.value = JSON.stringify(newData.metadata, null, 2)
    }
  }
}, { immediate: true })

// Watch metadata text changes
watch(metadataText, (newValue) => {
  try {
    if (newValue.trim()) {
      formData.value.metadata = JSON.parse(newValue)
    } else {
      formData.value.metadata = {}
    }
  } catch (error) {
    // Invalid JSON, keep current metadata
  }
})

// Methods
const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  emit('submit', formData.value)
}
</script>

<style scoped>
.v-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
