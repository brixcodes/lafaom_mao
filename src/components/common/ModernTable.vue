<template>
  <div class="modern-table-container">
    <!-- Table Header -->
    <div v-if="title || $slots.header" class="table-header">
      <slot name="header">
        <div class="flex items-center justify-between">
          <h3 v-if="title" class="table-title">{{ title }}</h3>
          <div v-if="$slots.actions" class="table-actions">
            <slot name="actions" />
          </div>
        </div>
      </slot>
    </div>

    <!-- Table Content -->
    <div class="table-wrapper" :class="{ 'table-loading': loading }">
      <VTable class="modern-table" :hover="hoverable">
        <!-- Table Head -->
        <thead>
          <tr>
            <th 
              v-for="(header, index) in headers" 
              :key="index"
              :class="[
                'table-header-cell',
                {
                  'sortable': header.sortable,
                  'sorted': sortBy === header.key,
                  'sorted-asc': sortBy === header.key && sortOrder === 'asc',
                  'sorted-desc': sortBy === header.key && sortOrder === 'desc'
                }
              ]"
              @click="header.sortable ? handleSort(header.key) : null"
            >
              <div class="header-content">
                <span>{{ header.title }}</span>
                <VIcon 
                  v-if="header.sortable" 
                  :icon="getSortIcon(header.key)"
                  size="16"
                  class="sort-icon"
                />
              </div>
            </th>
            <th v-if="$slots.actions" class="table-header-cell actions-header">
              Actions
            </th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody>
          <!-- Loading State -->
          <tr v-if="loading">
            <td :colspan="headers.length + ($slots.actions ? 1 : 0)" class="loading-cell">
              <div class="loading-content">
                <VIcon icon="ri-loader-4-line" size="24" class="animate-spin" />
                <span>{{ loadingText }}</span>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-else-if="!loading && items.length === 0">
            <td :colspan="headers.length + ($slots.actions ? 1 : 0)" class="empty-cell">
              <div class="empty-content">
                <VIcon :icon="emptyIcon" size="48" class="empty-icon" />
                <h4 class="empty-title">{{ emptyTitle }}</h4>
                <p class="empty-description">{{ emptyDescription }}</p>
                <slot name="empty-actions" />
              </div>
            </td>
          </tr>

          <!-- Data Rows -->
          <tr 
            v-else
            v-for="(item, index) in items" 
            :key="getItemKey(item, index)"
            :class="[
              'table-row',
              {
                'row-selected': isSelected(item),
                'row-clickable': clickable
              }
            ]"
            @click="clickable ? handleRowClick(item, index) : null"
          >
            <td 
              v-for="(header, headerIndex) in headers" 
              :key="headerIndex"
              :class="[
                'table-cell',
                header.align ? `text-${header.align}` : '',
                header.class || ''
              ]"
            >
              <slot 
                :name="`cell-${header.key}`" 
                :item="item" 
                :value="getItemValue(item, header.key)"
                :index="index"
              >
                <span v-if="header.formatter">
                  {{ header.formatter(getItemValue(item, header.key), item) }}
                </span>
                <span v-else>
                  {{ getItemValue(item, header.key) }}
                </span>
              </slot>
            </td>
            
            <!-- Actions Column -->
            <td v-if="$slots.actions" class="table-cell actions-cell">
              <div class="actions-content">
                <slot name="actions" :item="item" :index="index" />
              </div>
            </td>
          </tr>
        </tbody>
      </VTable>
    </div>

    <!-- Table Footer -->
    <div v-if="$slots.footer || showPagination" class="table-footer">
      <slot name="footer">
        <div v-if="showPagination" class="pagination-wrapper">
          <div class="pagination-info">
            Affichage de {{ startItem }} à {{ endItem }} sur {{ totalItems }} éléments
          </div>
          <div class="pagination-controls">
            <VBtn
              :disabled="currentPage <= 1"
              variant="outlined"
              size="small"
              @click="handlePageChange(currentPage - 1)"
            >
              <VIcon icon="ri-arrow-left-line" size="16" />
            </VBtn>
            
            <div class="page-numbers">
              <VBtn
                v-for="page in visiblePages"
                :key="page"
                :variant="page === currentPage ? 'flat' : 'outlined'"
                :color="page === currentPage ? 'primary' : undefined"
                size="small"
                @click="handlePageChange(page)"
              >
                {{ page }}
              </VBtn>
            </div>
            
            <VBtn
              :disabled="currentPage >= totalPages"
              variant="outlined"
              size="small"
              @click="handlePageChange(currentPage + 1)"
            >
              <VIcon icon="ri-arrow-right-line" size="16" />
            </VBtn>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface TableHeader {
  key: string
  title: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  class?: string
  formatter?: (value: any, item: any) => string
}

interface Props {
  headers: TableHeader[]
  items: any[]
  loading?: boolean
  loadingText?: string
  title?: string
  hoverable?: boolean
  clickable?: boolean
  selectable?: boolean
  selectedItems?: any[]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  emptyIcon?: string
  emptyTitle?: string
  emptyDescription?: string
  showPagination?: boolean
  currentPage?: number
  totalPages?: number
  totalItems?: number
  itemsPerPage?: number
  getItemKey?: (item: any, index: number) => string | number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  loadingText: 'Chargement...',
  hoverable: true,
  clickable: false,
  selectable: false,
  selectedItems: () => [],
  sortBy: '',
  sortOrder: 'asc',
  emptyIcon: 'ri-inbox-line',
  emptyTitle: 'Aucun élément trouvé',
  emptyDescription: 'Il n\'y a aucun élément à afficher pour le moment.',
  showPagination: false,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,
  getItemKey: (item: any, index: number) => item.id || index
})

const emit = defineEmits<{
  'row-click': [item: any, index: number]
  'sort-change': [sortBy: string, sortOrder: 'asc' | 'desc']
  'page-change': [page: number]
  'selection-change': [selectedItems: any[]]
}>()

const getItemValue = (item: any, key: string) => {
  return key.split('.').reduce((obj, k) => obj?.[k], item)
}

const isSelected = (item: any) => {
  return props.selectedItems?.some(selected => 
    props.getItemKey(selected, 0) === props.getItemKey(item, 0)
  )
}

const handleRowClick = (item: any, index: number) => {
  emit('row-click', item, index)
}

const handleSort = (key: string) => {
  const newOrder = props.sortBy === key && props.sortOrder === 'asc' ? 'desc' : 'asc'
  emit('sort-change', key, newOrder)
}

const getSortIcon = (key: string) => {
  if (props.sortBy !== key) return 'ri-arrow-up-down-line'
  return props.sortOrder === 'asc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'
}

const startItem = computed(() => {
  return (props.currentPage - 1) * props.itemsPerPage + 1
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, props.currentPage - 2)
  const end = Math.min(props.totalPages, props.currentPage + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const handlePageChange = (page: number) => {
  emit('page-change', page)
}
</script>

<style scoped>
.modern-table-container {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
  overflow: hidden;
}

.table-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--gray-200);
  background: var(--bg-secondary);
}

.table-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

.table-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.table-wrapper {
  position: relative;
  overflow-x: auto;
}

.table-loading {
  opacity: 0.6;
  pointer-events: none;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header-cell {
  padding: var(--space-4) var(--space-6);
  text-align: left;
  font-weight: var(--font-weight-semibold);
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--gray-200);
  white-space: nowrap;
}

.table-header-cell.sortable {
  cursor: pointer;
  user-select: none;
  transition: all var(--transition-normal);
}

.table-header-cell.sortable:hover {
  background: var(--gray-100);
  color: var(--text-primary);
}

.header-content {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.sort-icon {
  opacity: 0.5;
  transition: opacity var(--transition-normal);
}

.table-header-cell.sorted .sort-icon {
  opacity: 1;
}

.table-row {
  border-bottom: 1px solid var(--gray-100);
  transition: all var(--transition-normal);
}

.table-row:hover {
  background: var(--bg-hover);
}

.table-row.row-selected {
  background: var(--primary-50);
  border-color: var(--primary-200);
}

.table-row.row-clickable {
  cursor: pointer;
}

.table-cell {
  padding: var(--space-4) var(--space-6);
  color: var(--text-primary);
  border-bottom: 1px solid var(--gray-100);
}

.actions-cell {
  text-align: right;
  white-space: nowrap;
}

.actions-content {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-2);
}

.loading-cell,
.empty-cell {
  text-align: center;
  padding: var(--space-12) var(--space-6);
}

.loading-content,
.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.loading-content {
  color: var(--text-secondary);
}

.empty-icon {
  color: var(--text-disabled);
}

.empty-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

.empty-description {
  color: var(--text-secondary);
  margin: 0;
  text-align: center;
}

.table-footer {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--gray-200);
  background: var(--bg-secondary);
}

.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.pagination-info {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

/* Responsive */
@media (max-width: 768px) {
  .table-header {
    padding: var(--space-4);
  }
  
  .table-cell {
    padding: var(--space-3) var(--space-4);
  }
  
  .pagination-wrapper {
    flex-direction: column;
    gap: var(--space-3);
  }
  
  .pagination-controls {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .table-wrapper {
    font-size: var(--font-size-sm);
  }
  
  .table-cell {
    padding: var(--space-2) var(--space-3);
  }
}
</style>
