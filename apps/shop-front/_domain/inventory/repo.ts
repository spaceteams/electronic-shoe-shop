import type { InventoryItem } from '@/_domain/inventory/model'

export interface InventoryRepo {
  getInventory: (productId: string) => Promise<InventoryItem | null>
  getAllInventory: () => Promise<InventoryItem[]>
  reserveStock: (productId: string, quantity: number) => Promise<boolean>
}
