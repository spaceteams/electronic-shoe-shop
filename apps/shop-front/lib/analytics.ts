/**
 * Analytics service stub.
 * Introduced in Q2 2024 to track user behavior.
 * Currently only logs to console; real integration with Segment is WIP (JIRA-478).
 */

export interface AnalyticsEvent {
  event: string
  properties?: Record<string, unknown>
  userId?: string
  timestamp?: string
}

const events: AnalyticsEvent[] = []

export function trackEvent(event: AnalyticsEvent): void {
  const enriched = {
    ...event,
    timestamp: event.timestamp || new Date().toISOString(),
  }

  events.push(enriched)

  // Batch upload every 10 events or on page unload
  if (events.length >= 10) {
    flushEvents()
  }

  console.log('[Analytics]', enriched.event, enriched.properties)
}

export function flushEvents(): void {
  if (events.length === 0) return

  // TODO: send to Segment API
  console.log(`[Analytics] Flushing ${events.length} events`)
  events.length = 0
}

export function trackProductView(productId: string, userId?: string): void {
  trackEvent({
    event: 'Product Viewed',
    properties: { productId },
    userId,
  })
}

export function trackAddToCart(productId: string, quantity: number, userId?: string): void {
  trackEvent({
    event: 'Product Added to Cart',
    properties: { productId, quantity },
    userId,
  })
}

export function trackPurchase(orderId: string, total: number, userId?: string): void {
  trackEvent({
    event: 'Purchase Completed',
    properties: { orderId, total },
    userId,
  })
}

export function getQueuedEvents(): readonly AnalyticsEvent[] {
  return events
}
