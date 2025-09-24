// src/utils/tagUtils.ts
/**
 * Normalise les tags reçus depuis l'API / le formulaire.
 * Retourne toujours un tableau de chaînes propres (trim, sans valeurs vides).
 *
 * Gère :
 * - Array<string>
 * - Array<object> (cherche name/title/label/value)
 * - string (CSV: "a, b; c|d")
 * - string JSON (ex: '["a","b"]' ou '[{"name":"a"},{"title":"b"}]')
 * - string JSON double encodé (ex: '["[\\"a\\",\\"b\\"]"]')
 * - null/undefined
 */

export function processTags(input: any): string[] {
  if (input == null) return []

  // 🔹 Si c'est déjà un tableau
  if (Array.isArray(input)) {
    return input
      .flatMap((t) => processTags(t)) // récursif pour gérer les strings/objets dedans
      .filter(Boolean)
  }

  // 🔹 Si c'est une chaîne
  if (typeof input === 'string') {
    const s = input.trim()

    // Essayer de parser en JSON
    if ((s.startsWith('[') && s.endsWith(']')) || (s.startsWith('{') && s.endsWith('}'))) {
      try {
        const parsed = JSON.parse(s)

        // 🚨 Cas spécial : tableau contenant une string JSON encodée
        if (Array.isArray(parsed) && parsed.length === 1 && typeof parsed[0] === 'string') {
          return processTags(parsed[0])
        }

        return processTags(parsed)
      } catch {
        // sinon continuer avec split CSV
      }
    }

    // Sinon, split CSV-like
    return s
      .split(/[,;|]/)
      .map((x) => x.trim())
      .filter(Boolean)
  }

  // 🔹 Si c'est un objet
  if (typeof input === 'object') {
    if (Array.isArray((input as any).tags)) return processTags((input as any).tags)
    if ((input as any).name) return [String((input as any).name).trim()].filter(Boolean)

    // fallback : récupérer toutes les valeurs stringifiables
    return Object.values(input)
      .flatMap((v) => processTags(v))
      .filter(Boolean)
  }

  return []
}
