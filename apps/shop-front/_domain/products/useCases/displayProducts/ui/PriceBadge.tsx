import type { Product } from '@/_domain/products/model'

interface Props {
  product: Product
}

export const PriceBadge = ({ product }: Props) => {
  return (
    <div className="flex items-center gap-2 mt-2">
      {product.price && (
        <span className={`font-medium ${product.salePrice ? 'line-through text-gray-500' : ''}`}>
          {product.price.toFixed(2)} €
        </span>
      )}
      {product.salePrice && <span className="font-bold text-lg text-primary">{product.salePrice.toFixed(2)} €</span>}
    </div>
  )
}
