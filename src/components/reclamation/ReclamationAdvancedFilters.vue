<template>
  <VCard>
    <VCardTitle>
      <div class="d-flex align-center">
        <VIcon class="mr-3" color="primary">ri-filter-3-line</VIcon>
        Filtres avancés
      </div>
    </VCardTitle>
    
    <VCardText>
      <VRow>
        <VCol cols="12" md="4">
          <VTextField
            :model-value="filters.search"
            @update:model-value="updateFilter('search', $event)"
            label="Recherche"
            placeholder="Rechercher..."
            prepend-inner-icon="ri-search-line"
            variant="outlined"
            clearable
          />
        </VCol>
        
        <VCol cols="12" md="4">
          <VSelect
            :model-value="filters.status"
            @update:model-value="updateFilter('status', $event)"
            label="Statut"
            :items="statusOptions"
            variant="outlined"
            clearable
          />
        </VCol>
        
        <VCol cols="12" md="4">
          <VSelect
            :model-value="filters.priority"
            @update:model-value="updateFilter('priority', $event)"
            label="Priorité"
            :items="priorityOptions"
            variant="outlined"
            clearable
          />
        </VCol>
        
        <VCol cols="12" md="4">
          <VSelect
            :model-value="filters.reclamation_type"
            @update:model-value="updateFilter('reclamation_type', $event)"
            label="Type de réclamation"
            :items="reclamationTypeOptions"
            variant="outlined"
            clearable
          />
        </VCol>
        
        <VCol cols="12" md="4">
          <VTextField
            :model-value="filters.application_number"
            @update:model-value="updateFilter('application_number', $event)"
            label="Numéro de candidature"
            placeholder="Ex: APP-2024-001"
            variant="outlined"
            clearable
          />
        </VCol>
        
        <VCol cols="12" md="4">
          <VSelect
            :model-value="filters.order_by"
            @update:model-value="updateFilter('order_by', $event)"
            label="Trier par"
            :items="orderByOptions"
            variant="outlined"
          />
        </VCol>
        
        <VCol cols="12" md="6">
          <VSelect
            :model-value="filters.asc"
            @update:model-value="updateFilter('asc', $event)"
            label="Ordre"
            :items="orderOptions"
            variant="outlined"
          />
        </VCol>
        
        <VCol cols="12" md="6">
          <div class="d-flex align-center gap-2">
            <VBtn
              variant="outlined"
              @click="clearFilters"
              prepend-icon="ri-refresh-line"
            >
              Effacer
            </VBtn>
            <VBtn
              color="primary"
              @click="applyFilters"
              prepend-icon="ri-search-line"
            >
              Appliquer
            </VBtn>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import type { ReclamationType, ReclamationFilter } from '@/types/reclamation'

interface Props {
  filters: ReclamationFilter
  reclamationTypes: ReclamationType[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:filters': [filters: Partial<ReclamationFilter>]
  clear: []
  apply: []
}>()

// Options
const statusOptions = [
  { title: 'Nouvelle', value: 'NEW' },
  { title: 'En cours', value: 'IN_PROGRESS' },
  { title: 'Fermée', value: 'CLOSED' }
]

const priorityOptions = [
  { title: 'Faible', value: 'LOW' },
  { title: 'Moyenne', value: 'MEDIUM' },
  { title: 'Élevée', value: 'HIGH' },
]

const reclamationTypeOptions = computed(() => {
  return props.reclamationTypes.map(type => ({
    title: type.name,
    value: type.id
  }))
})

const orderByOptions = [
  { title: 'Date de création', value: 'created_at' },
  { title: 'Date de mise à jour', value: 'updated_at' },
  { title: 'Priorité', value: 'priority' }
]

const orderOptions = [
  { title: 'Croissant', value: 'asc' },
  { title: 'Décroissant', value: 'desc' }
]

// Methods
const updateFilter = (key: keyof ReclamationFilter, value: any) => {
  emit('update:filters', { [key]: value })
}

const clearFilters = () => {
  emit('clear')
}

const applyFilters = () => {
  emit('apply')
}
</script>

<style scoped>
.v-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
