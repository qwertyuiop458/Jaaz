const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || ''

const normalizedApiBaseUrl = rawApiBaseUrl.replace(/\/$/, '')

const isAbsoluteUrl = (value: string): boolean => /^https?:\/\//i.test(value)

const toPathWithLeadingSlash = (path: string): string =>
  path.startsWith('/') ? path : `/${path}`

export const resolveApiUrl = (path: string): string => {
  if (!path) {
    return path
  }

  if (isAbsoluteUrl(path)) {
    return path
  }

  const normalizedPath = toPathWithLeadingSlash(path)

  if (!normalizedApiBaseUrl) {
    return normalizedPath
  }

  return `${normalizedApiBaseUrl}${normalizedPath}`
}

export async function apiFetch(
  input: string,
  init?: RequestInit
): Promise<Response> {
  const primaryUrl = resolveApiUrl(input)

  try {
    return await fetch(primaryUrl, init)
  } catch (error) {
    const fallbackUrl = toPathWithLeadingSlash(input)
    const canFallback =
      normalizedApiBaseUrl.length > 0 && fallbackUrl !== primaryUrl

    if (!canFallback) {
      throw error
    }

    return fetch(fallbackUrl, init)
  }
}
