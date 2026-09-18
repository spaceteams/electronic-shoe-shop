import type { OrderHistoryRepo } from '@/_domain/orderHistory/repo'
import { documentClient } from '@/_adapter'
import z from 'zod/v4'
import type { ProductWithQuantity } from '@/_domain/products/model'

const orderStatusSchema = z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])

const schema = z.object({
  orderId: z.string(),
  userId: z.string(),
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      brand: z.string(),
      colors: z.array(z.string()),
      categories: z.array(z.string()),
      size: z.array(z.number()),
      price: z.number(),
      onSale: z.boolean().optional(),
      salePrice: z.number().optional(),
      availability: z.string(),
      description: z.string(),
      materials: z.array(z.string()),
      sustainabilityQualifiers: z.array(z.string()),
      quantity: z.number(),
    }),
  ),
  total: z.number(),
  status: orderStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string().optional(),
})

export const getOrderHistory: OrderHistoryRepo['getOrderHistory'] = async (userId) => {
  const response = await documentClient.query({
    TableName: 'orderHistory',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  })

  if (!response.Items) {
    return []
  }

  const s = z.array(schema).safeParse(response.Items)

  if (s.error) {
    console.log('order history parse error', s.error)
    return []
  }

  return s.data
}

export const getOrderById: OrderHistoryRepo['getOrderById'] = async (userId, orderId) => {
  const response = await documentClient.get({
    TableName: 'orderHistory',
    Key: {
      userId,
      orderId,
    },
  })

  if (!response.Item) {
    return null
  }

  const s = schema.safeParse(response.Item)

  if (s.error) {
    console.log('order detail parse error', s.error)
    return null
  }

  return s.data
}

export const cancelOrder: OrderHistoryRepo['cancelOrder'] = async (userId, orderId) => {
  const order = await getOrderById(userId, orderId)

  if (!order || order.status === 'cancelled' || order.status === 'shipped' || order.status === 'delivered') {
    return false
  }

  await documentClient.put({
    TableName: 'orderHistory',
    Item: {
      ...order,
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
    },
  })

  return true
}
