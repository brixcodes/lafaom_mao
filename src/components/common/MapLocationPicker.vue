<template>
  <div class="map-location-picker">
    <!-- Gestion d'erreur pour Google Maps -->
    <VAlert v-if="mapError" type="warning" variant="tonal" class="mb-4">
      <template #prepend>
        <VIcon icon="ri-map-pin-line" />
      </template>
      <div>
        <strong>Google Maps non disponible</strong>
        <p class="mb-0">Vous pouvez saisir manuellement les coordonnées GPS ci-dessous.</p>
      </div>
    </VAlert>

    <!-- Mode manuel si Google Maps n'est pas disponible -->
    <VCard v-if="mapError" class="mb-4">
      <VCardTitle class="d-flex align-center">
        <VIcon icon="ri-map-pin-line" class="me-2" color="primary" />
        <span>Saisie manuelle des coordonnées</span>
      </VCardTitle>
      <VDivider />
      <VCardText>
        <VRow>
          <VCol cols="12" md="6">
            <VTextField v-model.number="manualLatitude" label="Latitude" type="number" step="0.000001"
              placeholder="Ex: 48.8566" variant="outlined" density="comfortable" />
          </VCol>
          <VCol cols="12" md="6">
            <VTextField v-model.number="manualLongitude" label="Longitude" type="number" step="0.000001"
              placeholder="Ex: 2.3522" variant="outlined" density="comfortable" />
          </VCol>
          <VCol cols="12">
            <VBtn color="primary" prepend-icon="ri-check-line" @click="confirmManualLocation"
              :disabled="!manualLatitude || !manualLongitude">
              Confirmer les coordonnées
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Carte Google Maps (si disponible) -->
    <div v-else>
      <VCardTitle class="d-flex align-center">
        <VBtn v-if="selectedLocation" color="success" size="small" prepend-icon="ri-check-line"
          @click="confirmLocation">
          Confirmer
        </VBtn>
      </VCardTitle>
      <VDivider />

      <!-- Container pour la carte -->
      <div ref="mapContainer" :style="{ height: mapHeight + 'px' }">
        <div v-if="!mapLoaded" class="map-loading">
          <VProgressCircular indeterminate color="primary" size="64" class="mb-4" />
          <p class="text-body-1">Chargement de la carte...</p>
        </div>
      </div>

      <!-- Informations de localisation -->
      <VCardText v-if="selectedLocation" class="pa-4">
        <VAlert type="info" variant="tonal" class="mb-4">
          <template #prepend>
            <VIcon icon="ri-information-line" />
          </template>
          <div>
            <strong>Emplacement sélectionné :</strong>
            <p class="mb-2">{{ selectedLocation.address }}</p>
            <div class="d-flex gap-4">
              <span><strong>Latitude :</strong> {{ selectedLocation.latitude.toFixed(6) }}</span>
              <span><strong>Longitude :</strong> {{ selectedLocation.longitude.toFixed(6) }}</span>
            </div>
          </div>
        </VAlert>
      </VCardText>

      <!-- Actions -->
      <VCardActions class="pa-4">
        <VSpacer />
        <VBtn variant="outlined" @click="clearLocation">
          Effacer
        </VBtn>
        <VBtn variant="outlined" @click="useCurrentLocation" :loading="isGettingCurrentLocation">
          <VIcon icon="ri-user-location-line" class="me-2" />
          Ma position
        </VBtn>
        <VBtn v-if="selectedLocation" color="primary" @click="confirmLocation">
          Utiliser cette position
        </VBtn>
      </VCardActions>
    </div>
  </div>
</template>

<script setup lang="ts">
/// <reference path="../../types/google-maps.d.ts" />

import { ref, onMounted, onUnmounted, watch } from 'vue'
import { showToast } from '@/components/toast/toastManager'

// Déclaration pour Google Maps
declare const google: any

// Props
interface Props {
  initialLatitude?: number
  initialLongitude?: number
  initialAddress?: string
  mapHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  mapHeight: 400
})

// Emits
const emit = defineEmits<{
  locationSelected: [location: { latitude: number; longitude: number; address: string }]
  locationCleared: []
}>()

// Refs
const mapContainer = ref<HTMLElement>()
const searchQuery = ref('')
const isSearching = ref(false)
const isGettingCurrentLocation = ref(false)
const mapLoaded = ref(false)
const mapError = ref(false)
const manualLatitude = ref<number>()
const manualLongitude = ref<number>()

// Map variables
let map: any = null
let marker: any = null
let geocoder: any = null
let searchBox: any = null

// Selected location
const selectedLocation = ref<{
  latitude: number
  longitude: number
  address: string
} | null>(null)

// Initialize map
const initializeMap = async () => {
  if (!mapContainer.value) return

  try {
    // Load Google Maps API if not already loaded
    if (!window.google) {
      await loadGoogleMapsAPI()
    }

    // Default center (Paris)
    const defaultCenter = {
      lat: props.initialLatitude || 48.8566,
      lng: props.initialLongitude || 2.3522
    }

    // Create map
    map = new google.maps.Map(mapContainer.value, {
      center: defaultCenter,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    })

    // Create geocoder
    geocoder = new google.maps.Geocoder()

    // Add click listener
    map.addListener('click', (event: any) => {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()

      // Reverse geocode to get address
      geocoder.geocode({ location: { lat, lng } }, (results: any[], status: string) => {
        if (status === 'OK' && results[0]) {
          updateMarker(lat, lng, results[0].formatted_address)
        } else {
          updateMarker(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`)
        }
      })
    })

    // Initialize marker if we have initial coordinates
    if (props.initialLatitude && props.initialLongitude) {
      updateMarker(props.initialLatitude, props.initialLongitude, props.initialAddress || '')
    }

    mapLoaded.value = true
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    console.warn('Google Maps non disponible, passage en mode manuel:', errorMessage)
    mapError.value = true
    mapLoaded.value = true // Pour éviter le loading infini
    // Pas de toast pour éviter de spammer l'utilisateur
  }
}

// Déclarer les types pour window
declare global {
  interface Window {
    initMap: () => void
  }
}

// Fonction de callback globale pour Google Maps
window.initMap = () => {
  console.log('Google Maps API chargée avec succès')
  // Déclencher l'événement de chargement
  window.dispatchEvent(new CustomEvent('googleMapsLoaded'))
}

// Load Google Maps API
const loadGoogleMapsAPI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao&libraries=places&callback=initMap&loading=async`
    script.async = true
    script.defer = true

    // Timeout pour éviter l'attente infinie
    const timeout = setTimeout(() => {
      reject(new Error('Timeout loading Google Maps API'))
    }, 10000)

    // Écouter l'événement de chargement de Google Maps
    const handleGoogleMapsLoaded = () => {
      clearTimeout(timeout)
      window.removeEventListener('googleMapsLoaded', handleGoogleMapsLoaded)
      resolve()
    }
    
    window.addEventListener('googleMapsLoaded', handleGoogleMapsLoaded)
    
    script.onload = () => {
      // Le script est chargé, mais on attend le callback initMap
      console.log('Script Google Maps chargé, en attente du callback...')
    }
    script.onerror = () => {
      clearTimeout(timeout)
      reject(new Error('Failed to load Google Maps API'))
    }

    document.head.appendChild(script)
  })
}

// Update marker and selected location
const updateMarker = (lat: number, lng: number, address: string) => {
  // Remove existing marker
  if (marker) {
    marker.setMap(null)
  }

  // Create new marker
  marker = new google.maps.Marker({
    position: { lat, lng },
    map: map,
    title: address,
    draggable: true,
    animation: google.maps.Animation.DROP
  })

  // Add drag listener
  marker.addListener('dragend', (event: any) => {
    const newLat = event.latLng.lat()
    const newLng = event.latLng.lng()

    // Reverse geocode new position
    geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results: any[], status: string) => {
      if (status === 'OK' && results[0]) {
        updateSelectedLocation(newLat, newLng, results[0].formatted_address)
      } else {
        updateSelectedLocation(newLat, newLng, `${newLat.toFixed(6)}, ${newLng.toFixed(6)}`)
      }
    })
  })

  // Update selected location
  updateSelectedLocation(lat, lng, address)
}

// Update selected location
const updateSelectedLocation = (lat: number, lng: number, address: string) => {
  selectedLocation.value = {
    latitude: lat,
    longitude: lng,
    address: address
  }
}

// Search location
const searchLocation = async () => {
  if (!searchQuery.value.trim() || !geocoder) return

  isSearching.value = true
  try {
    geocoder.geocode({ address: searchQuery.value }, (results: any[], status: string) => {
      isSearching.value = false

      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location
        const lat = location.lat()
        const lng = location.lng()

        // Center map on result
        map.setCenter(location)
        map.setZoom(15)

        // Update marker
        updateMarker(lat, lng, results[0].formatted_address)

        showToast({ message: 'Localisation trouvée', type: 'success' })
      } else {
        showToast({ message: 'Adresse non trouvée', type: 'error' })
      }
    })
  } catch (error) {
    isSearching.value = false
    console.error('Erreur lors de la recherche:', error)
    showToast({ message: 'Erreur lors de la recherche', type: 'error' })
  }
}

// Get current location
const useCurrentLocation = () => {
  if (!navigator.geolocation) {
    showToast({ message: 'Géolocalisation non supportée', type: 'error' })
    return
  }

  isGettingCurrentLocation.value = true

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude

      // Center map on current location
      const location = new google.maps.LatLng(lat, lng)
      map.setCenter(location)
      map.setZoom(15)

      // Reverse geocode to get address
      geocoder.geocode({ location }, (results: any[], status: string) => {
        isGettingCurrentLocation.value = false

        if (status === 'OK' && results[0]) {
          updateMarker(lat, lng, results[0].formatted_address)
          showToast({ message: 'Position actuelle trouvée', type: 'success' })
        } else {
          updateMarker(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`)
          showToast({ message: 'Position actuelle trouvée', type: 'success' })
        }
      })
    },
    (error) => {
      isGettingCurrentLocation.value = false
      console.error('Erreur de géolocalisation:', error)

      let message = 'Erreur de géolocalisation'
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = 'Permission de géolocalisation refusée'
          break
        case error.POSITION_UNAVAILABLE:
          message = 'Position non disponible'
          break
        case error.TIMEOUT:
          message = 'Délai d\'attente dépassé'
          break
      }

      showToast({ message, type: 'error' })
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    }
  )
}

// Clear location
const clearLocation = () => {
  if (marker) {
    marker.setMap(null)
    marker = null
  }

  selectedLocation.value = null
  searchQuery.value = ''

  emit('locationCleared')
  showToast({ message: 'Localisation effacée', type: 'info' })
}

// Confirm location
const confirmLocation = () => {
  if (selectedLocation.value) {
    emit('locationSelected', selectedLocation.value)
    showToast({ message: 'Localisation confirmée', type: 'success' })
  }
}

// Méthodes pour le mode manuel
const confirmManualLocation = () => {
  if (manualLatitude.value && manualLongitude.value) {
    selectedLocation.value = {
      latitude: manualLatitude.value,
      longitude: manualLongitude.value,
      address: `Coordonnées: ${manualLatitude.value.toFixed(6)}, ${manualLongitude.value.toFixed(6)}`
    }
    emit('locationSelected', selectedLocation.value)
    showToast({ message: 'Coordonnées confirmées', type: 'success' })
  }
}

// Watch for prop changes
watch(() => [props.initialLatitude, props.initialLongitude], () => {
  if (map && props.initialLatitude && props.initialLongitude) {
    updateMarker(
      props.initialLatitude,
      props.initialLongitude,
      props.initialAddress || ''
    )
  }
})

// Initialiser les coordonnées manuelles si fournies
watch(() => [props.initialLatitude, props.initialLongitude], () => {
  if (props.initialLatitude && props.initialLongitude) {
    manualLatitude.value = props.initialLatitude
    manualLongitude.value = props.initialLongitude
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  initializeMap()
})

onUnmounted(() => {
  if (marker) {
    marker.setMap(null)
  }
})
</script>

<style scoped>
.map-location-picker {
  width: 100%;
}

.map-container {
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.map-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #f5f5f5;
  color: #666;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .map-container {
    height: 300px !important;
  }
}

/* Google Maps styling */
:deep(.gm-style) {
  border-radius: 8px;
}

:deep(.gm-style-iw) {
  border-radius: 8px;
}

:deep(.gm-style-iw-c) {
  border-radius: 8px;
}
</style>
