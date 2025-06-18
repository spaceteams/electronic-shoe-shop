import { Euro } from 'lucide-react'
import type React from 'react'
import { AddToCart } from '@/_domain/cart/useCases/addToCart/ui/AddToCart'
import type { Product } from '@/_domain/products/model'

type Props = {
  product: Product
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  return (
    <div className="card w-full bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl">
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

        <div className="flex items-center gap-2 mt-2">
          <Euro className="w-4 h-4" />
          {product.price && (
            <span className={`font-medium ${product.salePrice ? 'line-through text-gray-500' : ''}`}>
              {product.price.toFixed(2)}€
            </span>
          )}
          {product.salePrice && <span className="font-bold text-lg text-primary">{product.salePrice.toFixed(2)}€</span>}
        </div>

        <div className="card-actions justify-end mt-4">
          <AddToCart product={product} />
        </div>
      </div>
    </div>
  )
}
