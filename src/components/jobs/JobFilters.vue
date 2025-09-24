<template>
  <VCard class="job-filters mb-4" elevation="1">
    <VCardTitle class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <VIcon icon="ri-filter-line" class="me-2" color="primary" />
        <span>Filtres de recherche</span>
      </div>

      <!-- Toggle pour afficher/masquer les filtres -->
      <VBtn :icon="showAdvancedFilters ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'" variant="text" size="small"
        @click="toggleAdvancedFilters" />
    </VCardTitle>

    <VCardText>
      <!-- Barre de recherche principale -->
      <VRow class="mb-4">
        <VCol cols="12">
          <VTextField v-model="filters.search" prepend-inner-icon="ri-search-line"
            placeholder="Rechercher par titre, référence ou description..." variant="outlined" clearable
            @input="debouncedEmitFilters" @clear="emitFilters" />
        </VCol>
      </VRow>

      <!-- Filtres rapides -->
      <VRow class="mb-4">
        <VCol cols="12">
          <div class="d-flex flex-wrap gap-2 align-center">
            <span class="text-body-2 text-medium-emphasis me-2">Filtres rapides :</span>

            <VChip :color="filters.status === 'active' ? 'primary' : 'default'"
              :variant="filters.status === 'active' ? 'flat' : 'outlined'" prepend-icon="ri-check-circle-line"
              size="small" @click="toggleQuickFilter('status', 'active')">
              Offres actives
            </VChip>

            <VChip :color="filters.has_salary ? 'primary' : 'default'"
              :variant="filters.has_salary ? 'flat' : 'outlined'" prepend-icon="ri-money-euro-circle-line" size="small"
              @click="toggleQuickFilter('has_salary', true)">
              Avec salaire
            </VChip>

            <VChip :color="filters.no_fees ? 'primary' : 'default'" :variant="filters.no_fees ? 'flat' : 'outlined'"
              prepend-icon="ri-price-tag-3-line" size="small" @click="toggleQuickFilter('no_fees', true)">
              Sans frais
            </VChip>

            <VChip :color="filters.driving_license_required === false ? 'primary' : 'default'"
              :variant="filters.driving_license_required === false ? 'flat' : 'outlined'" prepend-icon="ri-car-line"
              size="small" @click="toggleQuickFilter('driving_license_required', false)">
              Sans permis
            </VChip>
          </div>
        </VCol>
      </VRow>

      <!-- Filtres avancés -->
      <VExpandTransition>
        <div v-show="showAdvancedFilters">
          <VDivider class="mb-4" />

          <VRow>
            <!-- Localisation -->
            <VCol cols="12" md="6">
              <VTextField v-model="filters.location" prepend-inner-icon="ri-map-pin-line" label="Localisation"
                variant="outlined" clearable @input="debouncedEmitFilters" />
            </VCol>

            <!-- Type de contrat -->
            <VCol cols="12" md="6">
              <VSelect v-model="filters.contract_type" :items="contractTypes" prepend-inner-icon="ri-file-text-line"
                label="Type de contrat" variant="outlined" clearable @update:model-value="emitFilters" />
            </VCol>

            <!-- Plage de salaire -->
            <VCol cols="12" md="6">
              <VTextField v-model.number="filters.salary_min" prepend-inner-icon="ri-money-euro-circle-line"
                label="Salaire minimum" variant="outlined" type="number" min="0" clearable
                @input="debouncedEmitFilters" />
            </VCol>

            <VCol cols="12" md="6">
              <VTextField v-model.number="filters.salary_max" prepend-inner-icon="ri-money-euro-circle-line"
                label="Salaire maximum" variant="outlined" type="number" min="0" clearable
                @input="debouncedEmitFilters" />
            </VCol>

            <!-- Tri -->
            <VCol cols="12" md="6">
              <VSelect v-model="filters.order_by" :items="sortOptions" prepend-inner-icon="ri-sort-desc"
                label="Trier par" variant="outlined" @update:model-value="emitFilters" />
            </VCol>

            <VCol cols="12" md="6">
              <VSelect v-model="filters.asc" :items="sortDirections" prepend-inner-icon="ri-sort-asc" label="Ordre"
                variant="outlined" @update:model-value="emitFilters" />
            </VCol>
          </VRow>

          <!-- Actions des filtres avancés -->
          <VRow class="mt-2">
            <VCol cols="12" class="d-flex justify-end gap-2">
              <VBtn variant="outlined" prepend-icon="ri-refresh-line" @click="resetFilters">
                Réinitialiser
              </VBtn>

              <VBtn variant="flat" color="primary" prepend-icon="ri-search-line" @click="emitFilters">
                Appliquer
              </VBtn>
            </VCol>
          </VRow>
        </div>
      </VExpandTransition>
    </VCardText>

    <!-- Résumé des filtres actifs -->
    <VCardText v-if="activeFiltersCount > 0" class="pt-0">
      <VDivider class="mb-3" />
      <div class="d-flex align-center flex-wrap gap-2">
        <span class="text-body-2 text-medium-emphasis me-2">Filtres actifs :</span>

        <VChip v-for="filter in activeFiltersList" :key="filter.key" closable size="small" color="primary"
          variant="tonal" @click:close="removeFilter(filter.key)">
          {{ filter.label }}
        </VChip>

        <VBtn v-if="activeFiltersCount > 1" variant="text" size="small" prepend-icon="ri-close-line"
          @click="resetFilters">
          Tout effacer
        </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { JobOfferFilter } from '@/types/jobOffers'
import { CONTRACT_TYPES } from '@/types/jobOffers'

// Props
interface Props {
  modelValue?: JobOfferFilter
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({})
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [filters: JobOfferFilter]
}>()

// State
const showAdvancedFilters = ref(false)

const filters = ref<JobOfferFilter & {
  status?: 'active' | 'expired'
  has_salary?: boolean
  no_fees?: boolean
  driving_license_required?: boolean
}>({
  search: '',
  location: '',
  contract_type: '',
  salary_min: undefined,
  salary_max: undefined,
  order_by: 'created_at',
  asc: 'desc',
  page: 1,
  page_size: 20,
  ...props.modelValue
})

// Options
const contractTypes = CONTRACT_TYPES.map(type => ({
  title: type.text,
  value: type.value
}))

const sortOptions = [
  { title: 'Date de création', value: 'created_at' },
  { title: 'Date limite', value: 'submission_deadline' },
  { title: 'Titre', value: 'title' },
  { title: 'Salaire', value: 'salary' }
]

const sortDirections = [
  { title: 'Croissant', value: 'asc' },
  { title: 'Décroissant', value: 'desc' }
]

// Computed
const activeFiltersCount = computed(() => {
  return activeFiltersList.value.length
})

const activeFiltersList = computed(() => {
  const activeFilters = []

  if (filters.value.search) {
    activeFilters.push({
      key: 'search',
      label: `Recherche: "${filters.value.search}"`
    })
  }

  if (filters.value.location) {
    activeFilters.push({
      key: 'location',
      label: `Lieu: ${filters.value.location}`
    })
  }

  if (filters.value.contract_type) {
    const contractType = CONTRACT_TYPES.find(type => type.value === filters.value.contract_type)
    activeFilters.push({
      key: 'contract_type',
      label: `Contrat: ${contractType?.text || filters.value.contract_type}`
    })
  }

  if (filters.value.salary_min) {
    activeFilters.push({
      key: 'salary_min',
      label: `Salaire min: ${filters.value.salary_min}€`
    })
  }

  if (filters.value.salary_max) {
    activeFilters.push({
      key: 'salary_max',
      label: `Salaire max: ${filters.value.salary_max}€`
    })
  }

  if (filters.value.status === 'active') {
    activeFilters.push({
      key: 'status',
      label: 'Offres actives'
    })
  }

  if (filters.value.has_salary) {
    activeFilters.push({
      key: 'has_salary',
      label: 'Avec salaire'
    })
  }

  if (filters.value.no_fees) {
    activeFilters.push({
      key: 'no_fees',
      label: 'Sans frais'
    })
  }

  if (filters.value.driving_license_required === false) {
    activeFilters.push({
      key: 'driving_license_required',
      label: 'Sans permis requis'
    })
  }

  return activeFilters
})

// Methods
const toggleAdvancedFilters = () => {
  showAdvancedFilters.value = !showAdvancedFilters.value
}

const toggleQuickFilter = (key: string, value: any) => {
  if (filters.value[key as keyof typeof filters.value] === value) {
    // Désactiver le filtre
    delete filters.value[key as keyof typeof filters.value]
  } else {
    // Activer le filtre
    ; (filters.value as any)[key] = value
  }
  emitFilters()
}

const emitFilters = () => {
  // Nettoyer les filtres vides et les filtres spéciaux
  const cleanFilters: JobOfferFilter = {}

  Object.keys(filters.value).forEach(key => {
    const value = filters.value[key as keyof typeof filters.value]

    // Ignorer les filtres spéciaux qui ne sont pas des filtres API
    if (['status', 'has_salary', 'no_fees'].includes(key)) {
      return
    }

    if (value !== undefined && value !== null && value !== '') {
      ; (cleanFilters as any)[key] = value
    }
  })

  // Réinitialiser la page lors d'un changement de filtre
  cleanFilters.page = 1

  emit('update:modelValue', cleanFilters)
}

const debouncedEmitFilters = useDebounceFn(emitFilters, 500)

const resetFilters = () => {
  filters.value = {
    search: '',
    location: '',
    contract_type: '',
    salary_min: undefined,
    salary_max: undefined,
    order_by: 'created_at',
    asc: 'desc',
    page: 1,
    page_size: 20
  }
  emitFilters()
}

const removeFilter = (key: string) => {
  if (key in filters.value) {
    delete filters.value[key as keyof typeof filters.value]
    emitFilters()
  }
}

// Watch pour synchroniser avec les props
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    filters.value = { ...filters.value, ...newValue }
  }
}, { deep: true })
</script>

<style scoped>
.job-filters {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.gap-2 {
  gap: 8px;
}
</style>
