<template>
  <VContainer>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 mb-2">Créer un paiement</h1>
        <p class="text-body-1 text-medium-emphasis">Créer un nouveau paiement dans le système</p>
      </div>
      <VBtn variant="outlined" prepend-icon="ri-arrow-left-line" @click="goBack">Retour</VBtn>
    </div>

    <VCard>
      <VCardText>
        <PaymentForm
          :isSubmitting="isSubmitting"
          @submit="handleSubmit"
          @cancel="goBack"
        />
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePayment } from '@/composables/usePayment'
import PaymentForm from '@/components/payment/PaymentForm.vue'
import type { PaymentCreateInput } from '@/types/payment'

// Router
const router = useRouter()

// Composable
const { createPayment } = usePayment()

// State
const isSubmitting = ref(false)

// Methods
const handleSubmit = async (data: PaymentCreateInput) => {
  try {
    isSubmitting.value = true
    await createPayment(data)
    router.push({ name: 'payments-index' })
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error)
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.push({ name: 'payments-index' })
}
</script>

<style scoped>
.v-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>