import type { Product } from '@/_domain/products/model'
import { ProductCard } from '@/_domain/products/useCases/displayProducts/ui/ProductCard'

export interface ProductListProps {
  products: Product[]
}

export const ProductList = ({ products }: ProductListProps) => {
  return (
    <div className={'container mx-auto'}>
      <h2 className={'text-3xl font-semibold'}>Products</h2>
      <h3 className={'text-lg opacity-60'}>Discover our curated collection of shoes</h3>

      <div className={'grid grid-cols-4 gap-4 mt-8'}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
