// src/utils/validation.ts
// Fonctions de validation génériques alignées sur les schémas Pydantic du backend

export interface ValidationResult {
  valid: boolean
  error?: string
}

export function validateRequired(value: any, fieldName = 'Ce champ'): ValidationResult {
  if (value === undefined || value === null || value === '')
    return { valid: false, error: `${fieldName} est obligatoire.` }

  return { valid: true }
}

export function validateEmail(value: string, fieldName = 'Email'): ValidationResult {
  if (!value)
    return { valid: false, error: `${fieldName} est obligatoire.` }

  // Regex simple, conforme à EmailStr de Pydantic
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
  if (!emailRegex.test(value))
    return { valid: false, error: `${fieldName} n'est pas un email valide.` }

  return { valid: true }
}

export function validateMinLength(value: string, min: number, fieldName = 'Ce champ'): ValidationResult {
  if ((value || '').length < min)
    return { valid: false, error: `${fieldName} doit contenir au moins ${min} caractères.` }

  return { valid: true }
}

export function validateMaxLength(value: string, max: number, fieldName = 'Ce champ'): ValidationResult {
  if ((value || '').length > max)
    return { valid: false, error: `${fieldName} doit contenir au maximum ${max} caractères.` }

  return { valid: true }
}

export function validateNumber(value: any, fieldName = 'Ce champ'): ValidationResult {
  if (value === undefined || value === null || value === '' || Number.isNaN(Number(value)))
    return { valid: false, error: `${fieldName} doit être un nombre.` }

  return { valid: true }
}

export function validateMin(value: number, min: number, fieldName = 'Ce champ'): ValidationResult {
  if (value < min)
    return { valid: false, error: `${fieldName} doit être supérieur ou égal à ${min}.` }

  return { valid: true }
}

export function validateMax(value: number, max: number, fieldName = 'Ce champ'): ValidationResult {
  if (value > max)
    return { valid: false, error: `${fieldName} doit être inférieur ou égal à ${max}.` }

  return { valid: true }
}

export function validateEnum<T>(value: T, allowed: T[], fieldName = 'Ce champ'): ValidationResult {
  if (!allowed.includes(value))
    return { valid: false, error: `${fieldName} a une valeur non autorisée.` }

  return { valid: true }
}

// Exemple d'utilisation :
// validateRequired(nom, 'Nom')
// validateEmail(email)
// validateMinLength(password, 8, 'Mot de passe')
// validateEnum(status, ['active', 'inactive'])
