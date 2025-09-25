<script setup lang="ts" name="TrainingStudentApplicationForm">
import { ref, computed } from 'vue'
import type {
  StudentApplication,
  StudentApplicationCreateInput,
  StudentApplicationUpdateInput,
  ApplicationStatusEnum,
} from '@/types/training'

interface Props {
  application?: StudentApplication
  trainingId?: string
  isEdit?: boolean
  isAdmin?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  isAdmin: false,
})

const emit = defineEmits<{
  (e: 'submit', data: StudentApplicationCreateInput | StudentApplicationUpdateInput): void
  (e: 'cancel'): void
}>()

// Form data
const formData = ref<StudentApplicationCreateInput | StudentApplicationUpdateInput>({
  training_id: props.application?.training_id ?? props.trainingId ?? '',
  attachments: undefined,
})

const adminFormData = ref({
  status: props.application?.status ?? ApplicationStatusEnum.RECEIVED,
  refusal_reason: props.application?.refusal_reason ?? '',
  registration_fee: props.application?.registration_fee ?? 0,
  training_fee: props.application?.training_fee ?? 0,
  installment_percentage: props.application?.installment_percentage ?? [100],
})

// File handling
const attachments = ref<File[]>([])

// Computed
const title = computed(() => {
  if (props.isEdit) {
    return props.isAdmin ? 'Review Application' : 'Edit Application'
  }
  return 'Submit Application'
})

const showRefusalReason = computed(() => {
  return props.isAdmin && adminFormData.value.status === ApplicationStatusEnum.REFUSED
})

// Methods
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    attachments.value = Array.from(input.files)
  }
}

const handleSubmit = () => {
  if (!props.isEdit) {
    formData.value.attachments = attachments.value
    emit('submit', formData.value)
  } else if (props.isAdmin) {
    emit('submit', {
      ...adminFormData.value,
    })
  }
}

const addInstallment = () => {
  if (adminFormData.value.installment_percentage.length < 4) {
    adminFormData.value.installment_percentage.push(0)
    recalculateInstallments()
  }
}

const removeInstallment = (index: number) => {
  adminFormData.value.installment_percentage.splice(index, 1)
  recalculateInstallments()
}

const recalculateInstallments = () => {
  const count = adminFormData.value.installment_percentage.length
  const percentage = Math.floor(100 / count)
  const remainder = 100 % count

  adminFormData.value.installment_percentage = adminFormData.value.installment_percentage.map((_, index) => {
    return index === 0 ? percentage + remainder : percentage
  })
}
</script>

<template>
  <VForm @submit.prevent="handleSubmit">
    <VCard :title="title">
      <VCardText>
        <VRow>
          <VCol
            v-if="application?.training"
            cols="12"
          >
            <VAlert
              color="info"
              variant="tonal"
            >
              Application for training: <strong>{{ application.training.title }}</strong>
            </VAlert>
          </VCol>

          <template v-if="isAdmin">
            <VCol cols="12" md="6">
              <VSelect
                v-model="adminFormData.status"
                :items="Object.values(ApplicationStatusEnum)"
                label="Application Status"
                required
              />
            </VCol>

            <VCol
              v-if="showRefusalReason"
              cols="12"
            >
              <VTextarea
                v-model="adminFormData.refusal_reason"
                label="Refusal Reason"
                rows="3"
                required
                :rules="[v => !!v || 'Refusal reason is required']"
              />
            </VCol>

            <VCol cols="12" md="6">
              <VTextField
                v-model.number="adminFormData.registration_fee"
                type="number"
                label="Registration Fee"
                min="0"
                required
                :rules="[v => v >= 0 || 'Registration fee must be positive']"
              />
            </VCol>

            <VCol cols="12" md="6">
              <VTextField
                v-model.number="adminFormData.training_fee"
                type="number"
                label="Training Fee"
                min="0"
                required
                :rules="[v => v >= 0 || 'Training fee must be positive']"
              />
            </VCol>

            <VCol cols="12">
              <div class="d-flex align-center justify-space-between mb-4">
                <div class="text-h6">Payment Installments</div>
                <VBtn
                  v-if="adminFormData.installment_percentage.length < 4"
                  color="primary"
                  size="small"
                  variant="tonal"
                  prepend-icon="ri-add-line"
                  @click="addInstallment"
                >
                  Add Installment
                </VBtn>
              </div>

              <div
                v-for="(percentage, index) in adminFormData.installment_percentage"
                :key="index"
                class="d-flex align-center gap-4 mb-2"
              >
                <div class="text-body-1">Installment {{ index + 1 }}</div>
                <VTextField
                  v-model.number="adminFormData.installment_percentage[index]"
                  type="number"
                  label="Percentage"
                  min="0"
                  max="100"
                  required
                  :rules="[
                    v => v >= 0 || 'Percentage must be positive',
                    v => v <= 100 || 'Percentage must be less than 100',
                  ]"
                  class="flex-grow-1"
                  readonly
                />
                <VBtn
                  v-if="index > 0"
                  color="error"
                  icon
                  variant="text"
                  size="small"
                  @click="removeInstallment(index)"
                >
                  <VIcon>ri-delete-bin-line</VIcon>
                </VBtn>
              </div>
            </VCol>
          </template>

          <template v-else>
            <VCol cols="12">
              <VFile
                v-model="attachments"
                label="Required Documents"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                :rules="[v => !!v.length || 'At least one document is required']"
                @change="handleFileChange"
              >
                <template #selection="{ fileNames }">
                  <template v-for="fileName in fileNames" :key="fileName">
                    <VChip
                      label
                      size="small"
                      variant="outlined"
                      color="primary"
                      class="me-2"
                    >
                      {{ fileName }}
                    </VChip>
                  </template>
                </template>
              </VFile>
            </VCol>
          </template>
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
        >
          {{ isEdit ? (isAdmin ? 'Update Review' : 'Update Application') : 'Submit Application' }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VForm>
</template>
