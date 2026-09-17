import type { OrderHistoryItem } from '@/_domain/orderHistory/model'

export interface OrderHistoryRepo {
  getOrderHistory: (userId: string) => Promise<OrderHistoryItem[]>
  getOrderById: (userId: string, orderId: string) => Promise<OrderHistoryItem | null>
  cancelOrder: (userId: string, orderId: string) => Promise<boolean>
}
