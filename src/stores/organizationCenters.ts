import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { organizationCenterService } from '@/services/api/organizationCenters'
import type { 
  OrganizationCenter, 
  OrganizationCenterCreateInput, 
  OrganizationCenterUpdateInput,
  OrganizationCenterFilter 
} from '@/types/organizationCenters'

export const useOrganizationCentersStore = defineStore('organizationCenters', () => {
  // State
  const centers = ref<OrganizationCenter[]>([])
  const currentCenter = ref<OrganizationCenter | null>(null)
  const isLoading = ref(false)
  const error = ref('')
  const filters = ref<OrganizationCenterFilter>({
    page: 1,
    page_size: 12,
    search: '',
    status: undefined,
    organization_type: undefined,
    country_code: undefined,
    city: undefined,
    order_by: 'created_at',
    asc: 'desc'
  })

  // Computed
  const activeCenters = computed(() => 
    centers.value.filter(center => center.status === 'ACTIVE')
  )

  const inactiveCenters = computed(() => 
    centers.value.filter(center => center.status === 'INACTIVE')
  )

  const centersByType = computed(() => {
    const grouped: Record<string, OrganizationCenter[]> = {}
    centers.value.forEach(center => {
      if (!grouped[center.organization_type]) {
        grouped[center.organization_type] = []
      }
      grouped[center.organization_type].push(center)
    })
    return grouped
  })

  const centersByCountry = computed(() => {
    const grouped: Record<string, OrganizationCenter[]> = {}
    centers.value.forEach(center => {
      if (!grouped[center.country_code]) {
        grouped[center.country_code] = []
      }
      grouped[center.country_code].push(center)
    })
    return grouped
  })

  const totalCenters = computed(() => centers.value.length)
  const hasCenters = computed(() => centers.value.length > 0)

  // Actions
  const fetchCenters = async (newFilters?: Partial<OrganizationCenterFilter>) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const mergedFilters = { ...filters.value, ...newFilters }
      const response = await organizationCenterService.listOrganizationCenters(mergedFilters)
      
      centers.value = response.data
      filters.value = mergedFilters
    } catch (err) {
      console.error('Erreur lors du chargement des centres:', err)
      error.value = 'Erreur lors du chargement des centres'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchCenter = async (id: number) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await organizationCenterService.getOrganizationCenter(id)
      currentCenter.value = response.data
      
      return response.data
    } catch (err) {
      console.error('Erreur lors du chargement du centre:', err)
      error.value = 'Erreur lors du chargement du centre'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createCenter = async (centerData: OrganizationCenterCreateInput) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await organizationCenterService.createOrganizationCenter(centerData)
      centers.value.unshift(response.data)
      
      return response.data
    } catch (err) {
      console.error('Erreur lors de la création du centre:', err)
      error.value = 'Erreur lors de la création du centre'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateCenter = async (id: number, centerData: OrganizationCenterUpdateInput) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await organizationCenterService.updateOrganizationCenter(id, centerData)
      
      // Update in local state
      const index = centers.value.findIndex(center => center.id === id)
      if (index !== -1) {
        centers.value[index] = response.data
      }
      
      if (currentCenter.value?.id === id) {
        currentCenter.value = response.data
      }
      
      return response.data
    } catch (err) {
      console.error('Erreur lors de la mise à jour du centre:', err)
      error.value = 'Erreur lors de la mise à jour du centre'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateCenterStatus = async (id: number, status: 'ACTIVE' | 'INACTIVE') => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await organizationCenterService.updateOrganizationCenterStatus(id, { status })
      
      // Update in local state
      const index = centers.value.findIndex(center => center.id === id)
      if (index !== -1) {
        centers.value[index].status = status
      }
      
      if (currentCenter.value?.id === id) {
        currentCenter.value.status = status
      }
      
      return response.data
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err)
      error.value = 'Erreur lors de la mise à jour du statut'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteCenter = async (id: number) => {
    try {
      isLoading.value = true
      error.value = ''
      
      await organizationCenterService.deleteOrganizationCenter(id)
      
      // Remove from local state
      centers.value = centers.value.filter(center => center.id !== id)
      
      if (currentCenter.value?.id === id) {
        currentCenter.value = null
      }
    } catch (err) {
      console.error('Erreur lors de la suppression du centre:', err)
      error.value = 'Erreur lors de la suppression du centre'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const searchCenters = async (query: string) => {
    return fetchCenters({ search: query, page: 1 })
  }

  const filterCentersByStatus = async (status: 'ACTIVE' | 'INACTIVE') => {
    return fetchCenters({ status, page: 1 })
  }

  const filterCentersByType = async (type: string) => {
    return fetchCenters({ organization_type: type as any, page: 1 })
  }

  const filterCentersByCountry = async (countryCode: string) => {
    return fetchCenters({ country_code: countryCode, page: 1 })
  }

  const getCentersByLocation = async (countryCode: string, city?: string) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const response = await organizationCenterService.getOrganizationCentersByLocation(countryCode, city)
      return response.data
    } catch (err) {
      console.error('Erreur lors du chargement des centres par localisation:', err)
      error.value = 'Erreur lors du chargement des centres par localisation'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = ''
  }

  const resetFilters = () => {
    filters.value = {
      page: 1,
      page_size: 12,
      search: '',
      status: undefined,
      organization_type: undefined,
      country_code: undefined,
      city: undefined,
      order_by: 'created_at',
      asc: 'desc'
    }
  }

  const setCurrentCenter = (center: OrganizationCenter | null) => {
    currentCenter.value = center
  }

  return {
    // State
    centers,
    currentCenter,
    isLoading,
    error,
    filters,
    
    // Computed
    activeCenters,
    inactiveCenters,
    centersByType,
    centersByCountry,
    totalCenters,
    hasCenters,
    
    // Actions
    fetchCenters,
    fetchCenter,
    createCenter,
    updateCenter,
    updateCenterStatus,
    deleteCenter,
    searchCenters,
    filterCentersByStatus,
    filterCentersByType,
    filterCentersByCountry,
    getCentersByLocation,
    clearError,
    resetFilters,
    setCurrentCenter
  }
})
