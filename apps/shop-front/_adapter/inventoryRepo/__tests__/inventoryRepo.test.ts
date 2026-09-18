import { getInventory, getAllInventory, reserveStock } from '@/_adapter/inventoryRepo'
import { documentClient } from '@/_adapter'

// Deep mock of DynamoDB document client
jest.mock('@/_adapter', () => ({
  documentClient: {
    get: jest.fn(),
    scan: jest.fn(),
    put: jest.fn(),
  },
}))

describe('inventoryRepo', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getInventory', () => {
    it('returns parsed inventory item', async () => {
      const mockItem = {
        productId: 'prod-1',
        stockCount: 50,
        reservedCount: 5,
        lastUpdated: '2024-01-01T00:00:00Z',
      }
      ;(documentClient.get as jest.Mock).mockResolvedValue({ Item: mockItem })

      const result = await getInventory('prod-1')

      expect(result).toEqual(mockItem)
      expect(documentClient.get).toHaveBeenCalledWith({
        TableName: 'inventory',
        Key: { productId: 'prod-1' },
      })
    })

    it('returns null when item not found', async () => {
      ;(documentClient.get as jest.Mock).mockResolvedValue({})

      const result = await getInventory('missing')

      expect(result).toBeNull()
    })

    it('returns null on parse error and logs error', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      ;(documentClient.get as jest.Mock).mockResolvedValue({
        Item: { productId: 'prod-1', stockCount: 'not-a-number' },
      })

      const result = await getInventory('prod-1')

      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('getAllInventory', () => {
    it('returns all items', async () => {
      const mockItems = [
        { productId: 'prod-1', stockCount: 50, reservedCount: 5, lastUpdated: '2024-01-01T00:00:00Z' },
        { productId: 'prod-2', stockCount: 30, reservedCount: 0, lastUpdated: '2024-01-02T00:00:00Z' },
      ]
      ;(documentClient.scan as jest.Mock).mockResolvedValue({ Items: mockItems })

      const result = await getAllInventory()

      expect(result).toHaveLength(2)
      expect(result[0].productId).toBe('prod-1')
    })

    it('returns empty array on empty scan', async () => {
      ;(documentClient.scan as jest.Mock).mockResolvedValue({})

      const result = await getAllInventory()

      expect(result).toEqual([])
    })
  })

  describe('reserveStock', () => {
    it('reserves stock when available', async () => {
      const mockItem = {
        productId: 'prod-1',
        stockCount: 50,
        reservedCount: 5,
        lastUpdated: '2024-01-01T00:00:00Z',
      }
      ;(documentClient.get as jest.Mock).mockResolvedValue({ Item: mockItem })
      ;(documentClient.put as jest.Mock).mockResolvedValue({})

      const result = await reserveStock('prod-1', 10)

      expect(result).toBe(true)
      expect(documentClient.put).toHaveBeenCalledWith({
        TableName: 'inventory',
        Item: expect.objectContaining({
          reservedCount: 15,
        }),
      })
    })

    it('returns false when not enough stock', async () => {
      const mockItem = {
        productId: 'prod-1',
        stockCount: 10,
        reservedCount: 8,
        lastUpdated: '2024-01-01T00:00:00Z',
      }
      ;(documentClient.get as jest.Mock).mockResolvedValue({ Item: mockItem })

      const result = await reserveStock('prod-1', 5)

      expect(result).toBe(false)
      expect(documentClient.put).not.toHaveBeenCalled()
    })

    it('returns false when item not found', async () => {
      ;(documentClient.get as jest.Mock).mockResolvedValue({})

      const result = await reserveStock('missing', 1)

      expect(result).toBe(false)
    })
  })
})
