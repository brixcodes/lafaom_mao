<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type {
  Training,
  TrainingCreateInput,
  TrainingUpdateInput,
  Specialty,
  TrainingTypeEnum,
  TrainingStatus,
  DurationEnum,
} from '@/types/training'
import { getTrainingSpecialties } from '@/services/training'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

interface Props {
  training?: Training
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
})

const emit = defineEmits<{
  (e: 'submit', data: TrainingCreateInput | TrainingUpdateInput): void
  (e: 'cancel'): void
}>()

// Form data
const formData = ref<TrainingCreateInput | TrainingUpdateInput>({
  title: props.training?.title ?? '',
  status: props.training?.status ?? TrainingStatus.ACTIVE,
  duration: props.training?.duration ?? 1,
  duration_unit: props.training?.duration_unit ?? DurationEnum.MONTHS,
  specialty_id: props.training?.specialty_id ?? 0,
  training_type: props.training?.training_type ?? TrainingTypeEnum.ON_SITE,
  presentation: props.training?.presentation ?? '',
  benefits: props.training?.benefits ?? [],
  strengths: props.training?.strengths ?? [],
  target_skills: props.training?.target_skills ?? '',
  program: props.training?.program ?? '',
  target_audience: props.training?.target_audience ?? '',
  prerequisites: props.training?.prerequisites ?? '',
  enrollment: props.training?.enrollment ?? '',
})

// File handling
const infoSheet = ref<File | null>(null)

// Form state
const loading = ref(false)
const specialties = ref<Specialty[]>([])

// Computed
const title = computed(() => props.isEdit ? 'Edit Training' : 'Create New Training')

// Methods
const fetchSpecialties = async () => {
  try {
    const response = await getTrainingSpecialties()
    specialties.value = response.data
  } catch (error: any) {
    appStore.showError(error.message || 'Error fetching specialties')
  }
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    infoSheet.value = input.files[0]
  }
}

const handleSubmit = () => {
  if (infoSheet.value) {
    formData.value.info_sheet = infoSheet.value
  }
  emit('submit', formData.value)
}

const addBenefit = () => {
  const benefits = (formData.value.benefits || []) as Array<{ title: string; description: string }>
  benefits.push({ title: '', description: '' })
  formData.value.benefits = benefits
}

const removeBenefit = (index: number) => {
  if (formData.value.benefits?.length) {
    formData.value.benefits.splice(index, 1)
  }
}

const addStrength = () => {
  const strengths = (formData.value.strengths || []) as Array<{ title: string; description: string }>
  strengths.push({ title: '', description: '' })
  formData.value.strengths = strengths
}

const removeStrength = (index: number) => {
  if (formData.value.strengths?.length) {
    formData.value.strengths.splice(index, 1)
  }
}

// Lifecycle
onMounted(() => {
  fetchSpecialties()
})
</script>

<template>
  <VForm @submit.prevent="handleSubmit">
    <VCard :title="title">
      <VCardText>
        <VRow>
          <VCol cols="12" md="6">
            <VTextField
              v-model="formData.title"
              label="Title"
              required
              :rules="[v => !!v || 'Title is required']"
            />
          </VCol>

          <VCol cols="12" md="6">
            <VSelect
              v-model="formData.specialty_id"
              :items="specialties"
              item-title="name"
              item-value="id"
              label="Specialty"
              required
              :rules="[v => !!v || 'Specialty is required']"
            />
          </VCol>

          <VCol cols="12" md="4">
            <VSelect
              v-model="formData.training_type"
              :items="Object.values(TrainingTypeEnum)"
              label="Training Type"
              required
            />
          </VCol>

          <VCol cols="12" md="4">
            <VSelect
              v-model="formData.status"
              :items="Object.values(TrainingStatus)"
              label="Status"
            />
          </VCol>

          <VCol cols="12" md="2">
            <VTextField
              v-model.number="formData.duration"
              type="number"
              label="Duration"
              min="1"
              required
            />
          </VCol>

          <VCol cols="12" md="2">
            <VSelect
              v-model="formData.duration_unit"
              :items="Object.values(DurationEnum)"
              label="Duration Unit"
              required
            />
          </VCol>

          <VCol cols="12">
            <VTextarea
              v-model="formData.presentation"
              label="Presentation"
              rows="3"
              required
              :rules="[v => !!v || 'Presentation is required']"
            />
          </VCol>

          <VCol cols="12">
            <VTextarea
              v-model="formData.target_skills"
              label="Target Skills"
              rows="3"
              required
              :rules="[v => !!v || 'Target skills are required']"
            />
          </VCol>

          <VCol cols="12">
            <VTextarea
              v-model="formData.program"
              label="Program"
              rows="3"
              required
              :rules="[v => !!v || 'Program is required']"
            />
          </VCol>

          <VCol cols="12">
            <VTextarea
              v-model="formData.target_audience"
              label="Target Audience"
              rows="3"
              required
              :rules="[v => !!v || 'Target audience is required']"
            />
          </VCol>

          <VCol cols="12">
            <VTextarea
              v-model="formData.prerequisites"
              label="Prerequisites"
              rows="3"
            />
          </VCol>

          <VCol cols="12">
            <VTextarea
              v-model="formData.enrollment"
              label="Enrollment Information"
              rows="3"
              required
              :rules="[v => !!v || 'Enrollment information is required']"
            />
          </VCol>

          <VCol cols="12">
            <VFile
              v-model="infoSheet"
              label="Info Sheet"
              accept="image/*,.pdf"
              @change="handleFileChange"
            />
          </VCol>

          <VCol cols="12">
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="text-h6">Benefits</div>
              <VBtn
                color="primary"
                size="small"
                variant="tonal"
                prepend-icon="ri-add-line"
                @click="addBenefit"
              >
                Add Benefit
              </VBtn>
            </div>
            
            <div
              v-for="(benefit, index) in formData.benefits"
              :key="index"
              class="mb-4 pa-4 bg-surface rounded-lg"
            >
              <div class="d-flex justify-space-between align-center mb-2">
                <div class="text-subtitle-1">Benefit {{ index + 1 }}</div>
                <VBtn
                  color="error"
                  icon
                  variant="text"
                  size="small"
                  @click="removeBenefit(index)"
                >
                  <VIcon>ri-delete-bin-line</VIcon>
                </VBtn>
              </div>
              
              <VRow>
                <VCol cols="12" md="6">
                  <VTextField
                    v-model="benefit.title"
                    label="Title"
                    required
                  />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField
                    v-model="benefit.description"
                    label="Description"
                  />
                </VCol>
              </VRow>
            </div>
          </VCol>

          <VCol cols="12">
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="text-h6">Strengths</div>
              <VBtn
                color="primary"
                size="small"
                variant="tonal"
                prepend-icon="ri-add-line"
                @click="addStrength"
              >
                Add Strength
              </VBtn>
            </div>
            
            <div
              v-for="(strength, index) in formData.strengths"
              :key="index"
              class="mb-4 pa-4 bg-surface rounded-lg"
            >
              <div class="d-flex justify-space-between align-center mb-2">
                <div class="text-subtitle-1">Strength {{ index + 1 }}</div>
                <VBtn
                  color="error"
                  icon
                  variant="text"
                  size="small"
                  @click="removeStrength(index)"
                >
                  <VIcon>ri-delete-bin-line</VIcon>
                </VBtn>
              </div>
              
              <VRow>
                <VCol cols="12" md="6">
                  <VTextField
                    v-model="strength.title"
                    label="Title"
                    required
                  />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField
                    v-model="strength.description"
                    label="Description"
                  />
                </VCol>
              </VRow>
            </div>
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
          {{ isEdit ? 'Update' : 'Create' }} Training
        </VBtn>
      </VCardActions>
    </VCard>
  </VForm>
</template>
