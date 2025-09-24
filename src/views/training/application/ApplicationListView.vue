<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { StudentApplication, ApplicationFilter } from '@/types/training'
import { getApplications } from '@/services/training'
import { useAppStore } from '@/stores/app'
import { useApplicationStatusBadgeColor } from '@/composables/useStatusBadgeColor'
import { formatDateForApi } from '@/utils/helpers'

const appStore = useAppStore()

// Data
const applications = ref<StudentApplication[]>([])
const isLoading = ref(true)
const totalItems = ref(0)
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Filters
const filters = ref<ApplicationFilter>({
  page: 1,
  page_size: 10,
  order_by: 'created_at',
  asc: 'desc',
})

// Methods
const fetchApplications = async () => {
  try {
    isLoading.value = true
    const response = await getApplications(filters.value)
    applications.value = response.data
    totalItems.value = response.total
  } catch (error: any) {
    appStore.showError(error.message || 'Error fetching applications')
  } finally {
    isLoading.value = false
  }
}

const handlePageChange = (page: number) => {
  filters.value.page = page
  fetchApplications()
}

const handleSearch = (search: string) => {
  filters.value.page = 1
  fetchApplications()
}

const formatDate = (date: string) => {
  return formatDateForApi(new Date(date))
}

// Lifecycle
onMounted(() => {
  fetchApplications()
})
</script>

<template>
  <div class="pa-6">
    <VCard title="Training Applications">
      <template #actions>
        <div class="d-flex align-center gap-4">
          <VSelect
            v-model="filters.status"
            :items="['RECEIVED', 'APPROVED', 'REFUSED']"
            label="Status"
            clearable
            density="compact"
            hide-details
            @update:model-value="fetchApplications"
          />
        </div>
      </template>

      <VDataTable
        :items="applications"
        :loading="isLoading"
        :headers="[
          { title: 'Application #', key: 'application_number', sortable: true },
          { title: 'Training', key: 'training.title', sortable: true },
          { title: 'Status', key: 'status', sortable: true },
          { title: 'Submitted', key: 'created_at', sortable: true },
          { title: 'Actions', key: 'actions', sortable: false },
        ]"
        :items-per-page="itemsPerPage"
        :total-items="totalItems"
        :page="currentPage"
        @update:page="handlePageChange"
      >
        <template #item.status="{ item }">
          <VChip
            :color="useApplicationStatusBadgeColor(item.status)"
            size="small"
          >
            {{ item.status }}
          </VChip>
        </template>

        <template #item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex gap-2">
            <VBtn
              icon
              variant="text"
              color="default"
              size="small"
              :to="{ name: 'application-view', params: { id: item.id } }"
            >
              <VIcon>ri-eye-line</VIcon>
            </VBtn>
            <VBtn
              v-if="item.status === 'RECEIVED'"
              icon
              variant="text"
              color="primary"
              size="small"
              :to="{ name: 'application-edit', params: { id: item.id } }"
            >
              <VIcon>ri-pencil-line</VIcon>
            </VBtn>
          </div>
        </template>
      </VDataTable>
    </VCard>
  </div>
</template>
