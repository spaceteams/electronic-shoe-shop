/**
 * Generic API client for internal service calls.
 * Introduced in Q2 2024 for the order-history feature.
 * Old adapters still use raw documentClient directly — migration is ongoing.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ''

export async function apiClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}
