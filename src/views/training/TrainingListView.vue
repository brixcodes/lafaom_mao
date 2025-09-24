<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Training, TrainingFilter } from '@/types/training'
import { TrainingTypeEnum, TrainingStatus, DurationEnum } from '@/types/training'
import { getTrainings } from '@/services/training'
import VCard from '@/@core/components/VCard.vue'
import { useStatusBadgeColor } from '@/composables/useStatusBadgeColor'
import { useAppStore } from '@/stores/app'
import { deleteTraining } from '@/services/training'
import { usePermissions } from '@/composables/usePermissions'

const appStore = useAppStore()
const { canCreateTraining, canEditTraining, canDeleteTraining } = usePermissions()

// Refs for delete confirmation dialog
const showDeleteDialog = ref(false)
const trainingToDelete = ref<Training | null>(null)

// Data
const trainings = ref<Training[]>([])
const isLoading = ref(true)
const totalItems = ref(0)
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Filters
const filters = ref<TrainingFilter>({
  page: 1,
  page_size: 10,
  order_by: 'created_at',
  asc: 'desc',
})

// Methods
const fetchTrainings = async () => {
  try {
    isLoading.value = true
    const response = await getTrainings(filters.value)
    trainings.value = response.data
    totalItems.value = response.total
  } catch (error: any) {
    appStore.showError(error.message || 'Error fetching trainings')
  } finally {
    isLoading.value = false
  }
}

const handlePageChange = (page: number) => {
  filters.value.page = page
  fetchTrainings()
}

const handleFiltersChange = () => {
  filters.value.page = 1
  fetchTrainings()
}

const handleSortChange = (sortBy: string) => {
  filters.value.order_by = sortBy as TrainingFilter['order_by']
  filters.value.asc = filters.value.asc === 'asc' ? 'desc' : 'asc'
  fetchTrainings()
}

const confirmDelete = (training: Training) => {
  trainingToDelete.value = training
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!trainingToDelete.value) return

  try {
    await deleteTraining(trainingToDelete.value.id)
    appStore.showSuccess('Training deleted successfully')
    fetchTrainings()
  } catch (error: any) {
    appStore.showError(error.message || 'Error deleting training')
  } finally {
    showDeleteDialog.value = false
    trainingToDelete.value = null
  }
}

// Lifecycle
onMounted(() => {
  fetchTrainings()
})
</script>

<template>
  <div>
    <VCard title="Trainings" class="mb-4">
      <template #actions>
        <div class="d-flex flex-wrap align-center gap-4">
          <VTextField
            v-model="filters.search"
            placeholder="Search trainings..."
            density="compact"
            hide-details
            class="min-w-200"
            @update:model-value="handleSearch"
          />

          <VSelect
            v-model="filters.training_type"
            :items="Object.values(TrainingTypeEnum)"
            label="Type"
            density="compact"
            hide-details
            clearable
            class="min-w-150"
            @update:model-value="handleFiltersChange"
          />

          <VSelect
            v-model="filters.status"
            :items="Object.values(TrainingStatus)"
            label="Status"
            density="compact"
            hide-details
            clearable
            class="min-w-150"
            @update:model-value="handleFiltersChange"
          />

          <VSelect
            v-model="filters.duration_unit"
            :items="Object.values(DurationEnum)"
            label="Duration Unit"
            density="compact"
            hide-details
            clearable
            class="min-w-150"
            @update:model-value="handleFiltersChange"
          />

          <VBtn
            v-if="canCreateTraining"
            prepend-icon="ri-add-line"
            color="primary"
            :to="{ name: 'training-create' }"
          >
            Add Training
          </VBtn>
        </div>
      </template>      <VDataTable
        :items="trainings"
        :loading="isLoading"
        :headers="[
          { title: 'Title', key: 'title', sortable: true },
          { title: 'Type', key: 'training_type' },
          { title: 'Duration', key: 'duration' },
          { title: 'Status', key: 'status' },
          { title: 'Actions', key: 'actions', sortable: false },
        ]"
        :items-per-page="itemsPerPage"
        :total-items="totalItems"
        :page="currentPage"
        @update:page="handlePageChange"
        @update:sort-by="handleSortChange"
      >
        <template #item.duration="{ item }">
          {{ item.duration }} {{ item.duration_unit.toLowerCase() }}
        </template>

        <template #item.status="{ item }">
          <VChip
            :color="useStatusBadgeColor(item.status)"
            size="small"
          >
            {{ item.status }}
          </VChip>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex gap-2">
            <VBtn
              icon
              variant="text"
              color="default"
              size="small"
              :to="{ name: 'training-view', params: { id: item.id } }"
            >
              <VIcon>ri-eye-line</VIcon>
            </VBtn>
            <VBtn
              v-if="canEditTraining"
              icon
              variant="text"
              color="primary"
              size="small"
              :to="{ name: 'training-edit', params: { id: item.id } }"
            >
              <VIcon>ri-pencil-line</VIcon>
            </VBtn>
            <VBtn
              v-if="canDeleteTraining"
              icon
              variant="text"
              color="error"
              size="small"
              @click="confirmDelete(item)"
            >
              <VIcon>ri-delete-bin-line</VIcon>
            </VBtn>
          </div>
        </template>
      </VDataTable>
    </VCard>
  </div>
</template>
