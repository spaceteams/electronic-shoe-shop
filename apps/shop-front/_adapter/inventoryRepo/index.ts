import type { InventoryRepo } from '@/_domain/inventory/repo'
import { documentClient } from '@/_adapter'
import z from 'zod/v4'

const schema = z.object({
  productId: z.string(),
  stockCount: z.number(),
  reservedCount: z.number(),
  lastUpdated: z.string(),
})

export const getInventory: InventoryRepo['getInventory'] = async (productId) => {
  const response = await documentClient.get({
    TableName: 'inventory',
    Key: {
      productId,
    },
  })

  if (!response.Item) {
    return null
  }

  const s = schema.safeParse(response.Item)

  if (s.error) {
    console.log('inventory parse error', s.error)
    return null
  }

  return s.data
}

export const getAllInventory: InventoryRepo['getAllInventory'] = async () => {
  const response = await documentClient.scan({
    TableName: 'inventory',
  })

  if (!response.Items) {
    return []
  }

  const s = z.array(schema).safeParse(response.Items)

  if (s.error) {
    console.log('inventory list parse error', s.error)
    return []
  }

  return s.data
}

export const reserveStock: InventoryRepo['reserveStock'] = async (productId, quantity) => {
  const item = await getInventory(productId)

  if (!item) {
    return false
  }

  if (item.stockCount - item.reservedCount < quantity) {
    return false
  }

  await documentClient.put({
    TableName: 'inventory',
    Item: {
      ...item,
      reservedCount: item.reservedCount + quantity,
      lastUpdated: new Date().toISOString(),
    },
  })

  return true
}
