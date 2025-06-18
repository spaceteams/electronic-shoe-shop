import type { Product } from '@/_domain/products/model'
import type { ProductsRepo } from '@/_domain/products/productsRepo'

export type DisplayProductsResponse = {
  products: Product[]
}

type Repo = Pick<ProductsRepo, 'getAllProducts'>

export async function displayProductsUseCase(repo: Repo): Promise<DisplayProductsResponse> {
  const products = await repo.getAllProducts()

  return {
    products,
  }
}
