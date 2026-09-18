/**
 * Constants shared across the application.
 * Some values are duplicated in CDK infra — keep in sync manually.
 */

export const APP_NAME = 'Electric Shoe Shop'

export const DEFAULT_PAGE_SIZE = 20

export const MAX_CART_ITEMS = 50

export const SUPPORTED_LOCALES = ['de', 'en'] as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

// Fallback locale is hardcoded here and in next.config.ts
export const DEFAULT_LOCALE: SupportedLocale = 'de'
