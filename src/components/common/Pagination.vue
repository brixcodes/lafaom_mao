<!-- Composant de pagination -->
<template>
  <div class="pagination-container">
    <VPagination
      v-model="currentPage"
      :length="totalPages"
      :total-visible="visiblePages"
      :disabled="disabled"
      @update:model-value="onPageChange"
    />
    
    <div class="pagination-info">
      <span class="text-body-2 text-medium-emphasis">
        {{ paginationText }}
      </span>
      
      <VSelect
        v-model="pageSize"
        :items="pageSizeOptions"
        density="compact"
        variant="outlined"
        hide-details
        class="page-size-select"
        @update:model-value="onPageSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
  page: number
  pageSize: number
  total: number
  disabled?: boolean
  visiblePages?: number
  pageSizeOptions?: number[]
}

interface Emits {
  (e: 'page-change', page: number): void
  (e: 'page-size-change', pageSize: number): void
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  visiblePages: 7,
  pageSizeOptions: () => [10, 20, 50, 100]
})

const emit = defineEmits<Emits>()

const currentPage = ref(props.page)
const pageSize = ref(props.pageSize)

const totalPages = computed(() => Math.ceil(props.total / pageSize.value))

const paginationText = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value + 1
  const end = Math.min(currentPage.value * pageSize.value, props.total)
  return `${start}-${end} sur ${props.total}`
})

const onPageChange = (page: number) => {
  currentPage.value = page
  emit('page-change', page)
}

const onPageSizeChange = (newPageSize: number) => {
  pageSize.value = newPageSize
  currentPage.value = 1 // Reset to first page when changing page size
  emit('page-size-change', newPageSize)
  emit('page-change', 1)
}

// Watch for external page changes
watch(() => props.page, (newPage) => {
  currentPage.value = newPage
})

watch(() => props.pageSize, (newPageSize) => {
  pageSize.value = newPageSize
})
</script>

<style scoped>
.pagination-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-size-select {
  width: 80px;
}

@media (max-width: 768px) {
  .pagination-container {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .pagination-info {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
