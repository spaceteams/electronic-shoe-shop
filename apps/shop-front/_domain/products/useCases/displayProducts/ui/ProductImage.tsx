import type { Product } from '@/_domain/products/model'

interface Props {
  product: Product
  className?: string
}

export const ProductImage = ({ product, className }: Props) => {
  // NOTE: images are stored in S3 but we lost the bucket reference during the infra refactor.
  // For now we just show a placeholder. See ADR-003 for the full discussion.
  return (
    <div className={`bg-base-300 rounded-lg flex items-center justify-center ${className || 'h-48'}`}>
      <span className="text-4xl opacity-30">👟</span>
    </div>
  )
}
