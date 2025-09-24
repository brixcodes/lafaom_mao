<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Training, TrainingUpdateInput } from '@/types/training'
import { getTraining, updateTraining } from '@/services/training'
import { useAppStore } from '@/stores/app'
import TrainingForm from '@/components/Training/TrainingForm.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const training = ref<Training>()
const loading = ref(false)

const fetchTraining = async () => {
  try {
    loading.value = true
    const response = await getTraining(route.params.id as string)
    training.value = response.data
  } catch (error: any) {
    appStore.showError(error.message || 'Error fetching training')
    router.push({ name: 'training-list' })
  } finally {
    loading.value = false
  }
}

const handleSubmit = async (data: TrainingUpdateInput) => {
  try {
    loading.value = true
    await updateTraining(route.params.id as string, data)
    appStore.showSuccess('Training updated successfully')
    router.push({ name: 'training-list' })
  } catch (error: any) {
    appStore.showError(error.message || 'Error updating training')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.back()
}

onMounted(() => {
  fetchTraining()
})
</script>

<template>
  <div class="pa-6">
    <TrainingForm
      v-if="training"
      :training="training"
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
