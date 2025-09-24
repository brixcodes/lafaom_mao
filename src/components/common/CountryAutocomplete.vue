<template>
  <div class="country-autocomplete">
    <VAutocomplete
      v-model="selectedCountry"
      :items="filteredCountries"
      :loading="loading"
      :label="label"
      :placeholder="placeholder"
      :error-messages="errorMessages"
      :disabled="disabled"
      :readonly="readonly"
      item-title="name"
      item-value="code"
      return-object
      clearable
      :custom-filter="customFilter"
      @update:search="handleSearch"
      @update:model-value="handleCountryChange"
      :prepend-inner-icon="prependIcon"
      variant="outlined"
      density="compact"
      :hide-details="hideDetails"
      :class="inputClass"
    >
      <template #item="{ props: itemProps, item }">
        <VListItem
          v-bind="itemProps"
          :prepend-avatar="`https://flagsapi.com/${item.raw.code}/flat/32.png`"
          :subtitle="item.raw.code"
        >
          <VListItemTitle>{{ item.raw.name }}</VListItemTitle>
        </VListItem>
      </template>

      <template #selection="{ item }">
        <div class="d-flex align-center">
          <VAvatar
            size="20"
            class="me-2"
            :image="`https://flagsapi.com/${item.raw.code}/flat/32.png`"
          />
          <span>{{ item.raw.name }}</span>
        </div>
      </template>
    </VAutocomplete>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
// @ts-ignore
import countries from 'world-countries'

export interface Country {
  name: string
  code: string // Code ISO 2 lettres (ex: 'CM' pour Cameroun)
  code3: string // Code ISO 3 lettres (ex: 'CMR' pour Cameroun)
  flag: string
  region: string
  subregion: string
}

interface Props {
  modelValue?: string | Country | null
  label?: string
  placeholder?: string
  errorMessages?: string | string[]
  disabled?: boolean
  readonly?: boolean
  loading?: boolean
  prependIcon?: string
  hideDetails?: boolean
  inputClass?: string
  // Options de filtrage
  regions?: string[] // Filtrer par régions (ex: ['Africa', 'Europe'])
  excludeCountries?: string[] // Exclure certains pays par code ISO
  includeCountries?: string[] // Inclure seulement certains pays par code ISO
}

interface Emits {
  (e: 'update:modelValue', value: Country | null): void
  (e: 'change', value: Country | null): void
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Pays',
  placeholder: 'Sélectionnez un pays...',
  errorMessages: undefined,
  disabled: false,
  readonly: false,
  loading: false,
  prependIcon: 'ri-earth-line',
  hideDetails: false,
  inputClass: '',
  regions: undefined,
  excludeCountries: undefined,
  includeCountries: undefined,
})

const emit = defineEmits<Emits>()

const selectedCountry = ref<Country | null>(null)
const searchQuery = ref('')

// Conversion des données de world-countries vers notre format
const allCountries = computed<Country[]>(() => {
  let countryList = countries.map((country: any) => ({
    name: country.name.common,
    code: country.cca2, // Code ISO 2 lettres
    code3: country.cca3, // Code ISO 3 lettres
    flag: country.flag,
    region: country.region,
    subregion: country.subregion
  }))

  // Filtrer par régions si spécifié
  if (props.regions && props.regions.length > 0) {
    countryList = countryList.filter((country: Country) => 
      props.regions!.includes(country.region)
    )
  }

  // Exclure certains pays
  if (props.excludeCountries && props.excludeCountries.length > 0) {
    countryList = countryList.filter((country: Country) => 
      !props.excludeCountries!.includes(country.code)
    )
  }

  // Inclure seulement certains pays
  if (props.includeCountries && props.includeCountries.length > 0) {
    countryList = countryList.filter((country: Country) => 
      props.includeCountries!.includes(country.code)
    )
  }

  // Trier par nom
  return countryList.sort((a: Country, b: Country) => 
    a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
  )
})

// Filtrage des pays basé sur la recherche
const filteredCountries = computed<Country[]>(() => {
  if (!searchQuery.value) {
    return allCountries.value
  }

  const query = searchQuery.value.toLowerCase().trim()
  return allCountries.value.filter(country => 
    country.name.toLowerCase().includes(query) ||
    country.code.toLowerCase().includes(query) ||
    country.code3.toLowerCase().includes(query)
  )
})

// Filtre personnalisé pour l'autocomplétion
const customFilter = (itemText: string, queryText: string) => {
  if (!queryText) return true
  
  const query = queryText.toLowerCase().trim()
  const text = itemText.toLowerCase()
  
  return text.includes(query)
}

// Gestion de la recherche
const handleSearch = (search: string | null) => {
  searchQuery.value = search || ''
}

// Gestion du changement de pays
const handleCountryChange = (country: Country | null) => {
  selectedCountry.value = country
  emit('update:modelValue', country)
  emit('change', country)
}

// Initialiser la valeur sélectionnée
const initializeValue = () => {
  if (!props.modelValue) {
    selectedCountry.value = null
    return
  }

  if (typeof props.modelValue === 'string') {
    // Si c'est une chaîne, chercher le pays par code
    const country = allCountries.value.find(c => 
      c.code === props.modelValue || 
      c.code3 === props.modelValue ||
      c.name === props.modelValue
    )
    selectedCountry.value = country || null
  } else if (typeof props.modelValue === 'object') {
    // Si c'est déjà un objet Country
    selectedCountry.value = props.modelValue
  }
}

// Watcher pour les changements de modelValue
watch(() => props.modelValue, initializeValue, { immediate: true })

// Méthodes utilitaires exposées
const getCountryByCode = (code: string): Country | undefined => {
  return allCountries.value.find(c => c.code === code || c.code3 === code)
}

const getCountryByName = (name: string): Country | undefined => {
  return allCountries.value.find(c => c.name.toLowerCase() === name.toLowerCase())
}

// Exposition des méthodes pour l'usage externe
defineExpose({
  getCountryByCode,
  getCountryByName,
  selectedCountry: computed(() => selectedCountry.value),
  allCountries: computed(() => allCountries.value)
})

onMounted(() => {
  console.log('🌍 CountryAutocomplete monté avec', allCountries.value.length, 'pays')
})
</script>

<style scoped>
.country-autocomplete {
  width: 100%;
}

.country-autocomplete :deep(.v-field__input) {
  min-height: 40px;
}

.country-autocomplete :deep(.v-avatar img) {
  border-radius: 2px;
}
</style>