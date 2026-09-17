import type { InventoryRepo } from '@/_domain/inventory/repo'
import type { InventoryItem } from '@/_domain/inventory/model'

type Repo = Pick<InventoryRepo, 'getInventory'>

export async function checkAvailabilityUseCase(repo: Repo, productId: string): Promise<InventoryItem | null> {
  return repo.getInventory(productId)
}
