<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { TrainingSessionCreateInput } from '@/types/training'
import { createSession } from '@/services/training'
import { useAppStore } from '@/stores/app'
import TrainingSessionForm from '@/components/Training/TrainingSessionForm.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const loading = ref(false)

const handleSubmit = async (data: TrainingSessionCreateInput) => {
  try {
    loading.value = true
    await createSession(data)
    appStore.showSuccess('Training session created successfully')
    router.push({
      name: 'training-view',
      params: { id: route.params.trainingId },
    })
  } catch (error: any) {
    appStore.showError(error.message || 'Error creating training session')
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
    <TrainingSessionForm
      :training-id="route.params.trainingId as string"
      :loading="loading"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>
