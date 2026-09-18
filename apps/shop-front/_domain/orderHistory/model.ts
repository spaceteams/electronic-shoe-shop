import type { ProductWithQuantity } from '@/_domain/products/model'

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

export type OrderHistoryItem = {
  orderId: string
  userId: string
  items: ProductWithQuantity[]
  total: number
  status: OrderStatus
  createdAt: string
  updatedAt?: string
}
