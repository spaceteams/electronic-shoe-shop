import { withRepo } from '@/_di'
import { createOrderUseCase } from '@/_domain/cart/useCases/createOrder'
import { createOrder } from '@/_adapter/cartRepo/createOrder'

export const orderService = {
  createOrder: withRepo(createOrderUseCase, {
    createOrder,
  }),
}
