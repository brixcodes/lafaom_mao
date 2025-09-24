<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type {
  TrainingSession,
  TrainingSessionCreateInput,
  TrainingSessionUpdateInput,
  TrainingSessionStatusEnum,
} from '@/types/training'
import { getTraining, getTrainingCenters } from '@/services/training'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

interface Props {
  session?: TrainingSession
  trainingId?: string
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
})

const emit = defineEmits<{
  (e: 'submit', data: TrainingSessionCreateInput | TrainingSessionUpdateInput): void
  (e: 'cancel'): void
}>()

// Form data
const formData = ref<TrainingSessionCreateInput | TrainingSessionUpdateInput>({
  training_id: props.session?.training_id ?? props.trainingId ?? '',
  center_id: props.session?.center_id,
  start_date: props.session?.start_date,
  end_date: props.session?.end_date,
  registration_deadline: props.session?.registration_deadline ?? '',
  available_slots: props.session?.available_slots,
  registration_fee: props.session?.registration_fee,
  training_fee: props.session?.training_fee,
  currency: props.session?.currency ?? 'EUR',
})

// Form state
const loading = ref(false)
const centers = ref<Array<any>>([])
const training = ref<any>(null)

// Computed
const title = computed(() => props.isEdit ? 'Edit Training Session' : 'Create New Training Session')

// Methods
const fetchTrainingCenters = async () => {
  try {
    const response = await getTrainingCenters()
    centers.value = response.data
  } catch (error: any) {
    appStore.showError(error.message || 'Error fetching training centers')
  }
}

const fetchTraining = async () => {
  if (!formData.value.training_id) return

  try {
    const response = await getTraining(formData.value.training_id)
    training.value = response.data
  } catch (error: any) {
    appStore.showError(error.message || 'Error fetching training details')
  }
}

const handleSubmit = () => {
  emit('submit', formData.value)
}

// Lifecycle
onMounted(() => {
  fetchTrainingCenters()
  if (formData.value.training_id) {
    fetchTraining()
  }
})
</script>

<template>
  <VForm @submit.prevent="handleSubmit">
    <VCard :title="title">
      <VCardText>
        <VRow>
          <VCol
            v-if="training"
            cols="12"
          >
            <VAlert
              color="info"
              variant="tonal"
            >
              Creating session for training: <strong>{{ training.title }}</strong>
            </VAlert>
          </VCol>

          <VCol cols="12" md="6">
            <VSelect
              v-model="formData.center_id"
              :items="centers"
              item-title="name"
              item-value="id"
              label="Training Center"
            />
          </VCol>

          <VCol cols="12" md="6">
            <VSelect
              v-if="isEdit"
              v-model="formData.status"
              :items="Object.values(TrainingSessionStatusEnum)"
              label="Status"
            />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField
              v-model="formData.start_date"
              type="date"
              label="Start Date"
            />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField
              v-model="formData.end_date"
              type="date"
              label="End Date"
            />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField
              v-model="formData.registration_deadline"
              type="date"
              label="Registration Deadline"
              required
              :rules="[v => !!v || 'Registration deadline is required']"
            />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField
              v-model.number="formData.available_slots"
              type="number"
              label="Available Slots"
              min="1"
            />
          </VCol>

          <VCol cols="12" md="4">
            <VTextField
              v-model.number="formData.registration_fee"
              type="number"
              label="Registration Fee"
              min="0"
              required
              :rules="[v => v >= 0 || 'Registration fee must be positive']"
            />
          </VCol>

          <VCol cols="12" md="4">
            <VTextField
              v-model.number="formData.training_fee"
              type="number"
              label="Training Fee"
              min="0"
              required
              :rules="[v => v >= 0 || 'Training fee must be positive']"
            />
          </VCol>

          <VCol cols="12" md="4">
            <VSelect
              v-model="formData.currency"
              :items="['EUR', 'USD', 'GBP']"
              label="Currency"
              required
            />
          </VCol>
        </VRow>
      </VCardText>

      <VDivider />

      <VCardActions>
        <VSpacer />
        <VBtn
          variant="tonal"
          @click="emit('cancel')"
        >
          Cancel
        </VBtn>
        <VBtn
          color="primary"
          type="submit"
          :loading="loading"
        >
          {{ isEdit ? 'Update' : 'Create' }} Session
        </VBtn>
      </VCardActions>
    </VCard>
  </VForm>
</template>
