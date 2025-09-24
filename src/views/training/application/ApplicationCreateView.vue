<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { StudentApplicationCreateInput } from '@/types/training'
import { createApplication } from '@/services/training'
import { useAppStore } from '@/stores/app'
import StudentApplicationForm from '@/components/Training/StudentApplicationForm.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const loading = ref(false)

const handleSubmit = async (data: StudentApplicationCreateInput) => {
  try {
    loading.value = true
    await createApplication(data)
    appStore.showSuccess('Application submitted successfully')
    router.push({
      name: 'training-view',
      params: { id: route.params.trainingId },
    })
  } catch (error: any) {
    appStore.showError(error.message || 'Error submitting application')
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
    <StudentApplicationForm
      :training-id="route.params.trainingId as string"
      :loading="loading"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>
