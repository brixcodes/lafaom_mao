/**
 * Builds a query string from an object of parameters
 * @param params Object containing query parameters
 * @returns Query string with '?' prefix if parameters exist, empty string otherwise
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value))
        value.forEach(item => searchParams.append(key, String(item)))
      else
        searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()

  return queryString ? `?${queryString}` : ''
}

export const formatDateForApi = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

export const formatDateTimeForApi = (date: Date): string => {
  return date.toISOString()
}
