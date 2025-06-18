import { getAllProducts } from '@/_adapter/productRepo/getAllProducts'
import { withRepo } from '@/_di'
import { displayProductsUseCase } from '@/_domain/products/useCases/displayProducts'

export const productsService = {
  getAllProducts: withRepo(displayProductsUseCase, {
    getAllProducts,
  }),
}
