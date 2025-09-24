// Déclarations TypeScript pour Google Maps API
declare global {
  interface Window {
    google: typeof google
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions)
      setCenter(latlng: LatLng | LatLngLiteral): void
      setZoom(zoom: number): void
      addListener(eventName: string, handler: Function): void
    }

    class Marker {
      constructor(opts?: MarkerOptions)
      setMap(map: Map | null): void
      setPosition(latlng: LatLng | LatLngLiteral): void
      addListener(eventName: string, handler: Function): void
    }

    class Geocoder {
      geocode(request: GeocoderRequest, callback: (results: GeocoderResult[], status: GeocoderStatus) => void): void
    }

    class LatLng {
      constructor(lat: number, lng: number)
      lat(): number
      lng(): number
    }

    class LatLngLiteral {
      lat: number
      lng: number
    }

    enum MapTypeId {
      ROADMAP = 'roadmap',
      SATELLITE = 'satellite',
      HYBRID = 'hybrid',
      TERRAIN = 'terrain'
    }

    enum GeocoderStatus {
      OK = 'OK',
      ZERO_RESULTS = 'ZERO_RESULTS',
      OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
      REQUEST_DENIED = 'REQUEST_DENIED',
      INVALID_REQUEST = 'INVALID_REQUEST',
      UNKNOWN_ERROR = 'UNKNOWN_ERROR'
    }

    enum GeocoderLocationType {
      ROOFTOP = 'ROOFTOP',
      RANGE_INTERPOLATED = 'RANGE_INTERPOLATED',
      GEOMETRIC_CENTER = 'GEOMETRIC_CENTER',
      APPROXIMATE = 'APPROXIMATE'
    }

    enum Animation {
      DROP = 1,
      BOUNCE = 2
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral
      zoom?: number
      mapTypeId?: MapTypeId
      styles?: MapTypeStyle[]
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral
      map?: Map
      title?: string
      draggable?: boolean
      animation?: Animation
    }

    interface GeocoderRequest {
      address?: string
      location?: LatLng | LatLngLiteral
      placeId?: string
    }

    interface GeocoderResult {
      formatted_address: string
      place_id: string
      geometry: GeocoderGeometry
    }

    interface GeocoderGeometry {
      location: LatLng
      location_type: GeocoderLocationType
    }

    interface MapTypeStyle {
      featureType?: string
      elementType?: string
      stylers?: MapTypeStyler[]
    }

    interface MapTypeStyler {
      color?: string
      lightness?: number
      saturation?: number
      visibility?: string
    }
  }
}

export {}
