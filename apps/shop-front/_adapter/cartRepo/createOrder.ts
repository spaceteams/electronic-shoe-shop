'use server'

import z from 'zod/v4'
import { v4 as uuidv4 } from 'uuid'
import { documentClient } from '@/_adapter'
import type { CartRepo } from '@/_domain/cart/repo'

const schema = z.array(
  z.object({
    id: z.string(),
    quantity: z.number(),
  }),
)

export const createOrder: CartRepo['createOrder'] = async (userId, cart) => {
  const parsedCart = schema.safeParse(cart)

  if (parsedCart.error) {
    console.log('cart error', parsedCart.error)
    return false
  }

  await documentClient.put({
    TableName: 'orders',
    Item: {
      products: parsedCart.data,
      email: userId,
      id: uuidv4(),
    },
  })

  return true
}
