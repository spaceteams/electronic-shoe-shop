import type { OrderHistoryRepo } from '@/_domain/orderHistory/repo'
import type { OrderHistoryItem } from '@/_domain/orderHistory/model'

type Repo = Pick<OrderHistoryRepo, 'getOrderById'>

export async function getOrderDetailUseCase(
  repo: Repo,
  userId: string,
  orderId: string,
): Promise<OrderHistoryItem | null> {
  return repo.getOrderById(userId, orderId)
}
