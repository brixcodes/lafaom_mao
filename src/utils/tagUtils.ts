// src/utils/tagUtils.ts
/**
 * Normalize les tags reçus depuis l'API / le formulaire.
 * Retourne toujours un tableau de chaînes propre (trim, sans valeurs vides).
 *
 * Gère :
 * - Array<string>
 * - Array<object> (cherche name/title/label/value)
 * - string (CSV: "a, b; c|d")
 * - string JSON (ex: '["a","b"]' ou '[{"name":"a"},{"title":"b"}]')
 * - null/undefined
 */

export function processTags(input: any): string[] {
  if (input == null) return []

  // Si c'est déjà un tableau
  if (Array.isArray(input)) {
    return input
      .map((t) => {
        if (typeof t === 'string') return t.trim()
        if (t && typeof t === 'object') {
          return String(t.name ?? t.title ?? t.label ?? t.value ?? '').trim()
        }
        return String(t ?? '').trim()
      })
      .filter(Boolean)
  }

  // Si c'est une chaîne : tenter JSON.parse d'abord
  if (typeof input === 'string') {
    const s = input.trim()

    // si c'est JSON (tableau ou objet), parse et ré-appelle
    if ((s.startsWith('[') && s.endsWith(']')) || (s.startsWith('{') && s.endsWith('}'))) {
      try {
        const parsed = JSON.parse(s)
        return processTags(parsed)
      } catch (e) {
        // ignore parse error et continuer
      }
    }

    // sinon split sur virgule / point-virgule / pipe
    return s
      .split(/[,;|]/)
      .map((x) => x.trim())
      .filter(Boolean)
  }

  // Si c'est un objet (ex: { tags: [...] } ou { name: 'x' })
  if (typeof input === 'object') {
    if (Array.isArray((input as any).tags)) return processTags((input as any).tags)
    if ((input as any).name) return [String((input as any).name).trim()].filter(Boolean)
    // fallback : récupérer valeurs stringifiables
    return Object.values(input)
      .map((v) => (typeof v === 'string' ? v.trim() : ''))
      .filter(Boolean)
  }

  return []
}
