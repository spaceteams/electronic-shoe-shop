import type { Product } from '@/_domain/products/model'

export interface ProductsRepo {
  getAllProducts: () => Promise<Product[]>
  getProductById: (id: string) => Promise<Product | null>
}
