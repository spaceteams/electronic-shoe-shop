import { trackEvent, flushEvents, getQueuedEvents, trackProductView } from '../analytics'

describe('analytics', () => {
  beforeEach(() => {
    // Clear the internal queue between tests
    flushEvents()
  })

  it('queues events', () => {
    trackEvent({ event: 'Test Event' })
    expect(getQueuedEvents()).toHaveLength(1)
  })

  it('flushes events and clears queue', () => {
    trackEvent({ event: 'Event 1' })
    trackEvent({ event: 'Event 2' })

    flushEvents()

    expect(getQueuedEvents()).toHaveLength(0)
  })

  it('auto-flushes after 10 events', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    for (let i = 0; i < 10; i++) {
      trackEvent({ event: `Event ${i}` })
    }

    expect(consoleSpy).toHaveBeenCalledWith('[Analytics] Flushing 10 events')

    consoleSpy.mockRestore()
  })

  it('enriches product view events with productId', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    trackProductView('prod-123', 'user-456')

    expect(consoleSpy).toHaveBeenCalledWith(
      '[Analytics]',
      'Product Viewed',
      expect.objectContaining({ productId: 'prod-123' }),
    )

    consoleSpy.mockRestore()
  })
})
