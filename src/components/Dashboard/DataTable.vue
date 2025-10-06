<script setup lang="ts">
import { computed } from 'vue'

interface Column {
  key: string
  title: string
  sortable?: boolean
  width?: string
}

interface Row {
  [key: string]: any
}

interface Props {
  title: string
  columns: Column[]
  data: Row[]
  loading?: boolean
  maxHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  maxHeight: '400px'
})

const tableHeaders = computed(() => 
  props.columns.map(col => ({
    title: col.title,
    key: col.key,
    sortable: col.sortable ?? false,
    width: col.width
  }))
)
</script>

<template>
  <v-card class="pa-4" elevation="2" rounded="lg">
    <h4 class="text-h6 font-weight-bold mb-4">{{ title }}</h4>
    
    <v-data-table
      :headers="tableHeaders"
      :items="data"
      :loading="loading"
      :max-height="maxHeight"
      class="elevation-0"
      hide-default-footer
    >
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@5" />
      </template>
      
      <template v-slot:item="{ item }">
        <tr>
          <td v-for="column in columns" :key="column.key" :style="{ width: column.width }">
            <slot :name="`item.${column.key}`" :item="item" :value="item[column.key]">
              {{ item[column.key] }}
            </slot>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>
