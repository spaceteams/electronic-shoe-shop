import type React from 'react'
import { AddToCart } from '@/_domain/cart/useCases/addToCart/ui/AddToCart'
import { ProductImage } from '@/_domain/products/useCases/displayProducts/ui/ProductImage'
import { PriceBadge } from '@/_domain/products/useCases/displayProducts/ui/PriceBadge'
import type { Product } from '@/_domain/products/model'

type Props = {
  product: Product
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  return (
    <div className="card w-full bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl">
      <ProductImage product={product} />
      <div className="card-body">
        <h2 className="card-title">
          {product.title || 'Schuh Produkt'}
          {product.onSale && <div className="badge badge-secondary">Sale</div>}
        </h2>

        <p className="text-sm opacity-70">{product.brand}</p>

        {product.description && <p className="text-sm">{product.description}</p>}

        <div className="flex flex-wrap gap-2 mt-2">
          {product.categories?.map((category) => (
            <span key={category} className="badge badge-outline">
              {category}
            </span>
          ))}
        </div>

        <PriceBadge product={product} />

        <div className="card-actions justify-end mt-4">
          <AddToCart product={product} />
        </div>
      </div>
    </div>
  )
}
