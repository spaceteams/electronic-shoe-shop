'use server'

import z from 'zod/v4'
import { v4 as uuidv4 } from 'uuid'
import { documentClient } from '@/_adapter'
import type { CartRepo } from '@/_domain/cart/repo'
import { voucherService } from '@/_domain/voucher'

const schema = z.array(
  z.object({
    id: z.string(),
    quantity: z.number(),
  }),
)

export const createOrder: CartRepo['createOrder'] = async (userId, cart, voucherCode) => {
  const parsedCart = schema.safeParse(cart)

  if (parsedCart.error) {
    console.log('cart error', parsedCart.error)
    return false
  }

  const subtotal = cart.reduce((total, product) => total + product.price * product.quantity, 0)
  let discount = 0

  if (voucherCode) {
    const voucher = await voucherService.validate(voucherCode)

    if (!voucher.valid) {
      return false
    }

    discount = subtotal * (voucher.voucher.percentage / 100)
  }

  await documentClient.put({
    TableName: 'orders',
    Item: {
      products: parsedCart.data,
      email: userId,
      id: uuidv4(),
      subtotal,
      discount,
      total: subtotal - discount,
      voucherCode,
    },
  })

  return true
}
