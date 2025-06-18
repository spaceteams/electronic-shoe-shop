import type { Cart } from '@/_domain/cart/model'

export interface CartRepo {
  createOrder: (userId: string, cart: Cart) => Promise<boolean>
}
