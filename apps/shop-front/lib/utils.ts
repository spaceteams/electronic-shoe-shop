/**
 * Shared formatting utilities.
 * Originally extracted from the product card component in March 2024.
 */

export function formatCurrency(value: number, currency = 'EUR'): string {
  if (currency === 'EUR') {
    return `${value.toFixed(2)} €`
  }
  if (currency === 'USD') {
    return `$${value.toFixed(2)}`
  }
  return `${value.toFixed(2)} ${currency}`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Kept for backward compat with old reporting Lambda
export function formatDateLegacy(dateString: string): string {
  return new Date(dateString).toISOString().split('T')[0]
}
