<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Training, TrainingSession } from '@/types/training'
import { getTraining, deleteTraining } from '@/services/training'
import { getSessions } from '@/services/training'
import { useAppStore } from '@/stores/app'
import TrainingCard from '@/components/Training/TrainingCard.vue'
import TrainingSessionCard from '@/components/Training/TrainingSessionCard.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const training = ref<Training>()
const sessions = ref<TrainingSession[]>([])
const loading = ref(false)
const showDeleteDialog = ref(false)

const fetchTraining = async () => {
  try {
    loading.value = true
    const response = await getTraining(route.params.id as string)
    training.value = response.data
    
    // Fetch training sessions
    const sessionsResponse = await getSessions({ training_id: response.data.id })
    sessions.value = sessionsResponse.data
  } catch (error: any) {
    appStore.showError(error.message || 'Error fetching training')
    router.push({ name: 'training-list' })
  } finally {
    loading.value = false
  }
}

const handleEdit = () => {
  router.push({
    name: 'training-edit',
    params: { id: route.params.id },
  })
}

const handleDelete = async () => {
  try {
    loading.value = true
    await deleteTraining(route.params.id as string)
    appStore.showSuccess('Training deleted successfully')
    router.push({ name: 'training-list' })
  } catch (error: any) {
    appStore.showError(error.message || 'Error deleting training')
  } finally {
    loading.value = false
    showDeleteDialog.value = false
  }
}

const handleCreateSession = () => {
  router.push({
    name: 'training-session-create',
    params: { trainingId: route.params.id },
  })
}

onMounted(() => {
  fetchTraining()
})
</script>

<template>
  <div class="pa-6">
    <div v-if="training" class="training-detail">
      <div class="d-flex align-center justify-space-between mb-6">
        <h2 class="text-h4">Training Details</h2>
        <div class="d-flex gap-2">
                    <VBtn
            v-if="training.status === 'ACTIVE'"
            color="success"
            prepend-icon="ri-file-list-3-line"
            :to="{ name: 'training-application-create', params: { trainingId: training.id } }"
          >
            Apply Now
          </VBtn>
          <VBtn
            color="primary"
            prepend-icon="ri-add-line"
            @click="handleCreateSession"
          >
            Add Session
          </VBtn>
          <VBtn
            color="primary"
            variant="tonal"
            prepend-icon="ri-pencil-line"
            @click="handleEdit"
          >
            Edit
          </VBtn>
          <VBtn
            color="error"
            variant="tonal"
            prepend-icon="ri-delete-bin-line"
            @click="showDeleteDialog = true"
          >
            Delete
          </VBtn>
        </div>
      </div>

      <TrainingCard
        :training="training"
        :show-actions="false"
        class="mb-6"
      />

      <VCard class="mb-6">
        <VCardTitle class="d-flex align-center px-6 py-4">
          Training Sessions
          <VSpacer />
          <VBtn
            color="primary"
            size="small"
            prepend-icon="ri-add-line"
            @click="handleCreateSession"
          >
            Add Session
          </VBtn>
        </VCardTitle>

        <VCardText class="px-6">
          <div v-if="sessions.length" class="sessions-grid">
            <TrainingSessionCard
              v-for="session in sessions"
              :key="session.id"
              :session="session"
            />
          </div>
          <VAlert
            v-else
            type="info"
            text="No sessions available for this training yet."
          />
        </VCardText>
      </VCard>
    </div>

    <VProgressCircular
      v-else
      indeterminate
      class="mx-auto d-block mt-4"
    />

    <VDialog
      v-model="showDeleteDialog"
      max-width="500"
    >
      <VCard>
        <VCardTitle class="text-h5">
          Delete Training
        </VCardTitle>

        <VCardText>
          Are you sure you want to delete this training? This action cannot be undone.
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn
            color="default"
            variant="text"
            @click="showDeleteDialog = false"
          >
            Cancel
          </VBtn>
          <VBtn
            color="error"
            @click="handleDelete"
            :loading="loading"
          >
            Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.sessions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}
</style>
