import { ref, computed } from 'vue'
import { showToast } from '@/components/toast/toastManager'

export interface GeolocationPosition {
    latitude: number
    longitude: number
    accuracy?: number
    altitude?: number | null
    altitudeAccuracy?: number | null
    heading?: number | null
    speed?: number | null
}

export interface GeolocationError {
    code: number
    message: string
}

export function useGeolocation() {
    const position = ref<GeolocationPosition | null>(null)
    const error = ref<GeolocationError | null>(null)
    const isSupported = ref(false)
    const isGettingPosition = ref(false)

    // Check if geolocation is supported
    isSupported.value = 'geolocation' in navigator

    // Get current position
    const getCurrentPosition = (options?: PositionOptions): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
            if (!isSupported.value) {
                const error = new Error('Géolocalisation non supportée par ce navigateur')
                reject(error)
                return
            }

            isGettingPosition.value = true
            error.value = null

            const defaultOptions: PositionOptions = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
                ...options
            }

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const newPosition: GeolocationPosition = {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                        accuracy: pos.coords.accuracy,
                        altitude: pos.coords.altitude,
                        altitudeAccuracy: pos.coords.altitudeAccuracy,
                        heading: pos.coords.heading,
                        speed: pos.coords.speed
                    }

                    position.value = newPosition
                    isGettingPosition.value = false
                    resolve(newPosition)
                },
                (err) => {
                    const geolocationError: GeolocationError = {
                        code: err.code,
                        message: getErrorMessage(err.code)
                    }

                    error.value = geolocationError
                    isGettingPosition.value = false
                    reject(geolocationError)
                },
                defaultOptions
            )
        })
    }

    // Watch position
    const watchPosition = (options?: PositionOptions): number | null => {
        if (!isSupported.value) {
            error.value = {
                code: 0,
                message: 'Géolocalisation non supportée par ce navigateur'
            }
            return null
        }

        const defaultOptions: PositionOptions = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
            ...options
        }

        return navigator.geolocation.watchPosition(
            (pos) => {
                const newPosition: GeolocationPosition = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    accuracy: pos.coords.accuracy,
                    altitude: pos.coords.altitude,
                    altitudeAccuracy: pos.coords.altitudeAccuracy,
                    heading: pos.coords.heading,
                    speed: pos.coords.speed
                }

                position.value = newPosition
                error.value = null
            },
            (err) => {
                const geolocationError: GeolocationError = {
                    code: err.code,
                    message: getErrorMessage(err.code)
                }

                error.value = geolocationError
            },
            defaultOptions
        )
    }

    // Clear watch
    const clearWatch = (watchId: number) => {
        navigator.geolocation.clearWatch(watchId)
    }

    // Get error message
    const getErrorMessage = (code: number): string => {
        switch (code) {
            case 1:
                return 'Permission de géolocalisation refusée'
            case 2:
                return 'Position non disponible'
            case 3:
                return 'Délai d\'attente dépassé'
            default:
                return 'Erreur de géolocalisation inconnue'
        }
    }

    // Get position with user feedback
    const getCurrentPositionWithFeedback = async (options?: PositionOptions): Promise<GeolocationPosition> => {
        try {
            showToast({ message: 'Récupération de votre position...', type: 'info' })
            const pos = await getCurrentPosition(options)
            showToast({ message: 'Position récupérée avec succès', type: 'success' })
            return pos
        } catch (err) {
            const error = err as GeolocationError
            showToast({ message: error.message, type: 'error' })
            throw err
        }
    }

    // Computed properties
    const hasPosition = computed(() => position.value !== null)
    const hasError = computed(() => error.value !== null)
    const isReady = computed(() => !isGettingPosition.value && (hasPosition.value || hasError.value))

    // Reset state
    const reset = () => {
        position.value = null
        error.value = null
        isGettingPosition.value = false
    }

    return {
        // State
        position: computed(() => position.value),
        error: computed(() => error.value),
        isSupported: computed(() => isSupported.value),
        isGettingPosition: computed(() => isGettingPosition.value),

        // Computed
        hasPosition,
        hasError,
        isReady,

        // Methods
        getCurrentPosition,
        getCurrentPositionWithFeedback,
        watchPosition,
        clearWatch,
        reset
    }
}
