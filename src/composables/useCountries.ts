import { ref, computed } from 'vue'
import { countriesService, type Country } from '@/services/api/countries'

export function useCountries() {
  // State
  const countries = ref<Country[]>([])
  const loading = ref(false)
  const error = ref('')
  const searchQuery = ref('')

  // Computed
  const filteredCountries = computed(() => {
    if (!searchQuery.value) return countries.value
    
    const query = searchQuery.value.toLowerCase()
    return countries.value.filter(country => 
      country.name.toLowerCase().includes(query) ||
      country.code.toLowerCase().includes(query)
    )
  })

  const countryOptions = computed(() => {
    return filteredCountries.value.map(country => ({
      title: `${country.flag} ${country.name}`,
      value: country.code,
      subtitle: `+${country.phone_code}`,
      flag: country.flag
    }))
  })

  // Methods
  const loadCountries = async () => {
    try {
      loading.value = true
      error.value = ''
      
      const data = await countriesService.getAllCountries()
      countries.value = data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des pays'
      console.error('Erreur lors du chargement des pays:', err)
    } finally {
      loading.value = false
    }
  }

  const searchCountries = async (query: string) => {
    try {
      loading.value = true
      error.value = ''
      
      const data = await countriesService.searchCountries(query)
      countries.value = data
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la recherche des pays'
      console.error('Erreur lors de la recherche des pays:', err)
    } finally {
      loading.value = false
    }
  }

  const getCountryByCode = async (code: string): Promise<Country | null> => {
    try {
      return await countriesService.getCountryByCode(code)
    } catch (err) {
      console.error('Erreur lors de la récupération du pays:', err)
      return null
    }
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const clearSearch = () => {
    searchQuery.value = ''
  }

  return {
    // State
    countries,
    loading,
    error,
    searchQuery,
    
    // Computed
    filteredCountries,
    countryOptions,
    
    // Methods
    loadCountries,
    searchCountries,
    getCountryByCode,
    setSearchQuery,
    clearSearch
  }
}
