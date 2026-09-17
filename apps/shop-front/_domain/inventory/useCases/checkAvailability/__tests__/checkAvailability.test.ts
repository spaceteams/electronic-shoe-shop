import { checkAvailabilityUseCase } from '@/_domain/inventory/useCases/checkAvailability'

describe('checkAvailabilityUseCase', () => {
  it('returns inventory item when found', async () => {
    const mockRepo = {
      getInventory: jest.fn().mockResolvedValue({
        productId: 'prod-1',
        stockCount: 100,
        reservedCount: 10,
        lastUpdated: '2024-01-01T00:00:00Z',
      }),
    }

    const result = await checkAvailabilityUseCase(mockRepo, 'prod-1')

    expect(mockRepo.getInventory).toHaveBeenCalledWith('prod-1')
    expect(result).not.toBeNull()
    expect(result?.stockCount).toBe(100)
  })

  it('returns null when item not found', async () => {
    const mockRepo = {
      getInventory: jest.fn().mockResolvedValue(null),
    }

    const result = await checkAvailabilityUseCase(mockRepo, 'missing')

    expect(result).toBeNull()
  })
})
