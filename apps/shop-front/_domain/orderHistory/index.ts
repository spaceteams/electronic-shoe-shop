import { withRepo } from '@/_di'
import { getOrderHistoryUseCase } from '@/_domain/orderHistory/useCases/getOrderHistory'
import { getOrderDetailUseCase } from '@/_domain/orderHistory/useCases/getOrderDetail'
import { cancelOrderUseCase } from '@/_domain/orderHistory/useCases/cancelOrder'
import { getOrderHistory, getOrderById, cancelOrder } from '@/_adapter/orderHistoryRepo'

export const orderHistoryService = {
  getOrderHistory: withRepo(getOrderHistoryUseCase, {
    getOrderHistory,
  }),
  getOrderDetail: withRepo(getOrderDetailUseCase, {
    getOrderById,
  }),
  cancelOrder: withRepo(cancelOrderUseCase, {
    cancelOrder,
  }),
}
