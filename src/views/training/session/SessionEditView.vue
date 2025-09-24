<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { TrainingSession, TrainingSessionUpdateInput } from '@/types/training'
import { getSession, updateSession } from '@/services/training'
import { useAppStore } from '@/stores/app'
import TrainingSessionForm from '@/components/Training/TrainingSessionForm.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const session = ref<TrainingSession>()
const loading = ref(false)

const fetchSession = async () => {
  try {
    loading.value = true
    const response = await getSession(route.params.id as string)
    session.value = response.data
  } catch (error: any) {
    appStore.showError(error.message || 'Error fetching session')
    router.push({ name: 'training-list' })
  } finally {
    loading.value = false
  }
}

const handleSubmit = async (data: TrainingSessionUpdateInput) => {
  try {
    loading.value = true
    await updateSession(route.params.id as string, data)
    appStore.showSuccess('Training session updated successfully')
    router.push({
      name: 'training-view',
      params: { id: session.value?.training_id },
    })
  } catch (error: any) {
    appStore.showError(error.message || 'Error updating training session')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.back()
}

onMounted(() => {
  fetchSession()
})
</script>

<template>
  <div class="pa-6">
    <TrainingSessionForm
      v-if="session"
      :session="session"
      :loading="loading"
      is-edit
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
    <VProgressCircular
      v-else
      indeterminate
      class="mx-auto d-block mt-4"
    />
  </div>
</template>
