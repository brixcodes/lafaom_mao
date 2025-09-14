// Utilitaires pour la gestion des erreurs
import type { BaseOutFail } from '@/types'

export class ErrorHandler {
  static handle(error: any): BaseOutFail {
    if (error.response?.data) {
      return error.response.data
    }
    
    return {
      message: 'Une erreur inattendue s\'est produite',
      error_code: 'UNKNOWN_ERROR',
      success: false
    }
  }

  static getErrorMessage(error: any): string {
    const errorData = this.handle(error)
    return errorData.message
  }

  static getErrorCode(error: any): string {
    const errorData = this.handle(error)
    return errorData.error_code
  }
}

// Utilitaires pour la validation
export class Validator {
  static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static isPhoneNumber(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  static isPasswordStrong(password: string): boolean {
    // Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
    return strongPasswordRegex.test(password)
  }

  static isUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  static isDate(date: string): boolean {
    const dateObj = new Date(date)
    return dateObj instanceof Date && !isNaN(dateObj.getTime())
  }

  static isFutureDate(date: string): boolean {
    if (!this.isDate(date)) return false
    return new Date(date) > new Date()
  }

  static isPastDate(date: string): boolean {
    if (!this.isDate(date)) return false
    return new Date(date) < new Date()
  }
}

// Utilitaires pour le formatage
export class Formatter {
  static formatDate(date: string | Date, locale: string = 'fr-FR'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString(locale)
  }

  static formatDateTime(date: string | Date, locale: string = 'fr-FR'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleString(locale)
  }

  static formatCurrency(amount: number, currency: string = 'EUR', locale: string = 'fr-FR'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  static formatNumber(number: number, locale: string = 'fr-FR'): string {
    return new Intl.NumberFormat(locale).format(number)
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  static capitalizeFirst(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  }

  static capitalizeWords(text: string): string {
    return text.split(' ').map(word => this.capitalizeFirst(word)).join(' ')
  }

  static slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

// Utilitaires pour les permissions
export class PermissionHelper {
  static hasPermission(userPermissions: string[], requiredPermission: string): boolean {
    return userPermissions.includes(requiredPermission)
  }

  static hasAnyPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
    return requiredPermissions.some(permission => userPermissions.includes(permission))
  }

  static hasAllPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
    return requiredPermissions.every(permission => userPermissions.includes(permission))
  }

  static canAccess(userRoles: string[], requiredRoles: string[]): boolean {
    return requiredRoles.some(role => userRoles.includes(role))
  }
}

// Utilitaires pour les fichiers
export class FileHelper {
  static getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || ''
  }

  static isImageFile(filename: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
    return imageExtensions.includes(this.getFileExtension(filename))
  }

  static isDocumentFile(filename: string): boolean {
    const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt']
    return documentExtensions.includes(this.getFileExtension(filename))
  }

  static isVideoFile(filename: string): boolean {
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm']
    return videoExtensions.includes(this.getFileExtension(filename))
  }

  static isAudioFile(filename: string): boolean {
    const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac']
    return audioExtensions.includes(this.getFileExtension(filename))
  }

  static validateFileSize(file: File, maxSizeInMB: number): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024
    return file.size <= maxSizeInBytes
  }

  static validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type)
  }
}

// Utilitaires pour les URLs
export class UrlHelper {
  static buildApiUrl(endpoint: string, params?: Record<string, any>): string {
    const baseUrl = '/api/v1'
    let url = `${baseUrl}${endpoint}`
    
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          searchParams.append(key, String(value))
        }
      })
      
      const queryString = searchParams.toString()
      if (queryString) {
        url += `?${queryString}`
      }
    }
    
    return url
  }

  static buildFileUrl(filePath: string): string {
    if (filePath.startsWith('http')) {
      return filePath
    }
    return `${import.meta.env.VITE_API_BASE_URL || ''}${filePath}`
  }

  static downloadFile(url: string, filename?: string): void {
    const link = document.createElement('a')
    link.href = url
    if (filename) {
      link.download = filename
    }
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Utilitaires pour le localStorage
export class StorageHelper {
  static set(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Erreur lors de la sauvegarde dans localStorage:', error)
    }
  }

  static get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch (error) {
      console.error('Erreur lors de la lecture du localStorage:', error)
      return defaultValue || null
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Erreur lors de la suppression du localStorage:', error)
    }
  }

  static clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Erreur lors du nettoyage du localStorage:', error)
    }
  }
}

// Utilitaires pour les notifications
export class NotificationHelper {
  static showSuccess(message: string): void {
    // Implémentation avec votre système de notifications (ex: Vuetify snackbar)
    console.log('Success:', message)
  }

  static showError(message: string): void {
    // Implémentation avec votre système de notifications
    console.error('Error:', message)
  }

  static showWarning(message: string): void {
    // Implémentation avec votre système de notifications
    console.warn('Warning:', message)
  }

  static showInfo(message: string): void {
    // Implémentation avec votre système de notifications
    console.info('Info:', message)
  }
}
