<template>
  <VCard>
    <VDataTable :headers="tableHeaders" :items="rows" :loading="isLoading" class="elevation-0" item-value="id">
      <template #item.cover_image="{ item }">
        <VImg v-if="item.cover_image" :src="item.cover_image" width="56" height="56" class="rounded-circle" />
      </template>

      <template #item.author_name="{ item }">
        <div class="text-caption text-medium-emphasis">{{ item.author_name }}</div>
      </template>

      <template #item.title="{ item }">
        <div class="font-weight-medium">{{ item.title }}</div>
      </template>

      <template #item.slug="{ item }">
        <VChip color="primary" size="small" variant="tonal">{{ item.slug }}</VChip>
      </template>

      <template #item.tags="{ item }">
        <div class="d-flex flex-wrap gap-1">
          <VChip v-for="tag in cleaned(item.tags)" :key="tag" color="secondary" size="x-small" variant="tonal">{{ tag }}
          </VChip>
        </div>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex gap-2">
          <VBtn icon="ri-edit-line" size="small" variant="text" @click="$emit('edit', item)" />
          <VBtn icon="ri-delete-bin-line" size="small" variant="text" color="error" @click="$emit('delete', item)" />
        </div>
      </template>
    </VDataTable>
  </VCard>
</template>

<script setup lang="ts">
const props = defineProps<{ posts: any[] | any, headers: any[], isLoading: boolean }>()
const rows = computed(() => (Array.isArray(props.posts) ? props.posts : (props.posts?.value || [])))
const tableHeaders = props.headers || []
const cleaned = (tags: any) =>
  (tags || []).map((t: string) => String(t).replace(/[\[\]\"]/g, '').trim())
</script>

<style scoped></style>
