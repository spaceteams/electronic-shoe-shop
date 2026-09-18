import { formatCurrency, formatDate, formatDateLegacy } from '../utils'

describe('utils', () => {
  describe('formatCurrency', () => {
    it('formats EUR by default', () => {
      expect(formatCurrency(129.99)).toBe('129.99 €')
    })

    it('formats USD', () => {
      expect(formatCurrency(129.99, 'USD')).toBe('$129.99')
    })

    it('formats generic currency', () => {
      expect(formatCurrency(129.99, 'GBP')).toBe('129.99 GBP')
    })
  })

  describe('formatDate', () => {
    it('formats to German locale', () => {
      expect(formatDate('2024-06-15')).toBe('15.06.2024')
    })
  })

  describe('formatDateLegacy', () => {
    it('returns ISO date part', () => {
      expect(formatDateLegacy('2024-06-15T10:00:00Z')).toBe('2024-06-15')
    })
  })
})
