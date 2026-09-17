import { withRepo } from '@/_di'
import { checkAvailabilityUseCase } from '@/_domain/inventory/useCases/checkAvailability'
import { getInventory, getAllInventory, reserveStock } from '@/_adapter/inventoryRepo'

export const inventoryService = {
  checkAvailability: withRepo(checkAvailabilityUseCase, {
    getInventory,
  }),
  getAllInventory: withRepo(async (repo) => repo.getAllInventory(), { getAllInventory }),
  reserveStock: withRepo(async (repo, productId: string, quantity: number) => repo.reserveStock(productId, quantity), {
    reserveStock,
  }),
}
