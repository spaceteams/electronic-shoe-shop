import type { OrderHistoryRepo } from '@/_domain/orderHistory/repo'
import type { OrderHistoryItem } from '@/_domain/orderHistory/model'

type Repo = Pick<OrderHistoryRepo, 'getOrderHistory'>

export type GetOrderHistoryResponse = {
  orders: OrderHistoryItem[]
}

export async function getOrderHistoryUseCase(repo: Repo, userId: string): Promise<GetOrderHistoryResponse> {
  const orders = await repo.getOrderHistory(userId)

  return {
    orders: orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  }
}
