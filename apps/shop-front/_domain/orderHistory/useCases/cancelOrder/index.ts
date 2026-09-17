import type { OrderHistoryRepo } from '@/_domain/orderHistory/repo'

type Repo = Pick<OrderHistoryRepo, 'cancelOrder'>

export async function cancelOrderUseCase(repo: Repo, userId: string, orderId: string): Promise<boolean> {
  return repo.cancelOrder(userId, orderId)
}
