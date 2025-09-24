<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { TrainingCreateInput } from '@/types/training'
import { createTraining } from '@/services/training'
import { useAppStore } from '@/stores/app'
import TrainingForm from '@/components/Training/TrainingForm.vue'

const router = useRouter()
const appStore = useAppStore()
const loading = ref(false)

const handleSubmit = async (data: TrainingCreateInput) => {
  try {
    loading.value = true
    await createTraining(data)
    appStore.showSuccess('Training created successfully')
    router.push({ name: 'training-list' })
  } catch (error: any) {
    appStore.showError(error.message || 'Error creating training')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.back()
}
</script>

<template>
  <div class="pa-6">
    <TrainingForm
      :loading="loading"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>
