/// <reference path="../types/google-maps.d.ts" />

// Service de géocodage pour convertir les adresses en coordonnées
export interface GeocodingResult {
  latitude: number
  longitude: number
  address: string
  formattedAddress: string
  placeId?: string
  accuracy?: 'ROOFTOP' | 'RANGE_INTERPOLATED' | 'GEOMETRIC_CENTER' | 'APPROXIMATE'
}

export interface GeocodingError {
  code: string
  message: string
}

export class GeocodingService {
  private geocoder: google.maps.Geocoder | null = null
  private isInitialized = false

  // Initialize the geocoder
  private async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Load Google Maps API if not already loaded
      if (!window.google) {
        await this.loadGoogleMapsAPI()
      }

      this.geocoder = new google.maps.Geocoder()
      this.isInitialized = true
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du géocodeur:', error)
      throw new Error('Impossible d\'initialiser le service de géocodage')
    }
  }

  // Load Google Maps API
  private loadGoogleMapsAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Google Maps API'))
      
      document.head.appendChild(script)
    })
  }

  // Geocode an address to coordinates
  async geocodeAddress(address: string): Promise<GeocodingResult> {
    await this.initialize()

    if (!this.geocoder) {
      throw new Error('Géocodeur non initialisé')
    }

    return new Promise((resolve, reject) => {
      this.geocoder!.geocode({ address }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
        if (status === 'OK' && results && results.length > 0) {
          const result = results[0]
          const location = result.geometry.location
          
          resolve({
            latitude: location.lat(),
            longitude: location.lng(),
            address: address,
            formattedAddress: result.formatted_address,
            placeId: result.place_id,
            accuracy: this.getAccuracyLevel(result.geometry.location_type)
          })
        } else {
          const error: GeocodingError = {
            code: status,
            message: this.getGeocodingErrorMessage(status)
          }
          reject(error)
        }
      })
    })
  }

  // Reverse geocode coordinates to address
  async reverseGeocode(latitude: number, longitude: number): Promise<GeocodingResult> {
    await this.initialize()

    if (!this.geocoder) {
      throw new Error('Géocodeur non initialisé')
    }

    return new Promise((resolve, reject) => {
      this.geocoder!.geocode({ location: { lat: latitude, lng: longitude } }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
        if (status === 'OK' && results && results.length > 0) {
          const result = results[0]
          const location = result.geometry.location
          
          resolve({
            latitude: location.lat(),
            longitude: location.lng(),
            address: result.formatted_address,
            formattedAddress: result.formatted_address,
            placeId: result.place_id,
            accuracy: this.getAccuracyLevel(result.geometry.location_type)
          })
        } else {
          const error: GeocodingError = {
            code: status,
            message: this.getGeocodingErrorMessage(status)
          }
          reject(error)
        }
      })
    })
  }

  // Batch geocode multiple addresses
  async batchGeocode(addresses: string[]): Promise<GeocodingResult[]> {
    const results: GeocodingResult[] = []
    
    for (const address of addresses) {
      try {
        const result = await this.geocodeAddress(address)
        results.push(result)
      } catch (error) {
        console.error(`Erreur lors du géocodage de "${address}":`, error)
        // Continue with other addresses
      }
    }
    
    return results
  }

  // Get accuracy level from Google Maps location type
  private getAccuracyLevel(locationType: google.maps.GeocoderLocationType): GeocodingResult['accuracy'] {
    switch (locationType) {
      case google.maps.GeocoderLocationType.ROOFTOP:
        return 'ROOFTOP'
      case google.maps.GeocoderLocationType.RANGE_INTERPOLATED:
        return 'RANGE_INTERPOLATED'
      case google.maps.GeocoderLocationType.GEOMETRIC_CENTER:
        return 'GEOMETRIC_CENTER'
      case google.maps.GeocoderLocationType.APPROXIMATE:
        return 'APPROXIMATE'
      default:
        return 'APPROXIMATE'
    }
  }

  // Get error message for geocoding status
  private getGeocodingErrorMessage(status: string): string {
    switch (status) {
      case 'ZERO_RESULTS':
        return 'Aucun résultat trouvé pour cette adresse'
      case 'OVER_QUERY_LIMIT':
        return 'Limite de requêtes dépassée'
      case 'REQUEST_DENIED':
        return 'Requête refusée'
      case 'INVALID_REQUEST':
        return 'Requête invalide'
      case 'UNKNOWN_ERROR':
        return 'Erreur inconnue'
      default:
        return `Erreur de géocodage: ${status}`
    }
  }

  // Validate coordinates
  isValidCoordinate(latitude: number, longitude: number): boolean {
    return (
      latitude >= -90 && latitude <= 90 &&
      longitude >= -180 && longitude <= 180 &&
      !isNaN(latitude) && !isNaN(longitude)
    )
  }

  // Calculate distance between two points (in kilometers)
  calculateDistance(
    lat1: number, lng1: number,
    lat2: number, lng2: number
  ): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1)
    const dLng = this.toRadians(lng2 - lng1)
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    
    return R * c
  }

  // Convert degrees to radians
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  // Format coordinates for display
  formatCoordinates(latitude: number, longitude: number, precision: number = 6): string {
    return `${latitude.toFixed(precision)}, ${longitude.toFixed(precision)}`
  }

  // Get coordinates from a Google Maps place
  async getCoordinatesFromPlace(placeId: string): Promise<GeocodingResult> {
    await this.initialize()

    if (!this.geocoder) {
      throw new Error('Géocodeur non initialisé')
    }

    return new Promise((resolve, reject) => {
      this.geocoder!.geocode({ placeId }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
        if (status === 'OK' && results && results.length > 0) {
          const result = results[0]
          const location = result.geometry.location
          
          resolve({
            latitude: location.lat(),
            longitude: location.lng(),
            address: result.formatted_address,
            formattedAddress: result.formatted_address,
            placeId: result.place_id,
            accuracy: this.getAccuracyLevel(result.geometry.location_type)
          })
        } else {
          const error: GeocodingError = {
            code: status,
            message: this.getGeocodingErrorMessage(status)
          }
          reject(error)
        }
      })
    })
  }
}

// Export singleton instance
export const geocodingService = new GeocodingService()
