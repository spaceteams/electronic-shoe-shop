import { productsService } from '@/_domain/products'
import { ProductList } from '@/_domain/products/useCases/displayProducts/ui/ProductList'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const { products } = await productsService.getAllProducts()

  return <ProductList products={products} />
}
