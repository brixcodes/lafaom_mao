<template>
  <VCard class="mb-6">
    <VCardText>
      <VRow>
        <VCol cols="12" md="6">
          <SearchBar
            v-model="searchQuery"
            placeholder="Rechercher un utilisateur..."
            @search="$emit('search', searchQuery)"
            @clear="$emit('clear')"
          />
        </VCol>
        <VCol cols="12" md="3">
          <VSelect
            v-model="filters.user_type"
            :items="userTypeOptions"
            label="Type d'utilisateur"
            prepend-inner-icon="ri-user-settings-line"
            clearable
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </VCol>
        <VCol cols="12" md="3">
          <VSelect
            v-model="filters.status"
            :items="statusOptions"
            label="Statut"
            prepend-inner-icon="ri-checkbox-circle-line"
            clearable
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import SearchBar from '@/components/common/SearchBar.vue'

const props = defineProps<{
  filters: any
  userTypeOptions: any[]
  statusOptions: any[]
}>()
const emit = defineEmits(['search', 'clear'])
const searchQuery = ref('')
// ...existing code...
</script>
