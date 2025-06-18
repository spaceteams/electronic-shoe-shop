import type { CartRepo } from '@/_domain/cart/repo'
import type { Cart } from '@/_domain/cart/model'

type Repo = Pick<CartRepo, 'createOrder'>

export const createOrderUseCase = async (repo: Repo, userId: string, cart: Cart) => {
  return repo.createOrder(userId, cart)
}
