'use client'

import { CircleCheck, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import clsx from 'clsx'
import type { Product, ProductWithQuantity } from '@/_domain/products/model'

interface Props {
  product: Product
}

export const AddToCart = ({ product }: Props) => {
  const [showSuccess, setShowSuccess] = useState(false)

  const addToCart = () => {
    const storedCart = localStorage.getItem('cart')
    const products = (storedCart ? JSON.parse(storedCart) : []) as ProductWithQuantity[]
    const currentQuantity = products.find((p) => p.id === product.id)?.quantity ?? 0

    let updatedProducts: ProductWithQuantity[]
    if (currentQuantity === 0) {
      updatedProducts = [...products, { ...product, quantity: 1 }]
    } else {
      updatedProducts = products.map((p) => (product.id === p.id ? { ...product, quantity: currentQuantity + 1 } : p))
    }

    localStorage.setItem('cart', JSON.stringify(updatedProducts))

    toast.success('Produkt wurde zum Warenkorb hinzugefügt!')

    setShowSuccess(true)

    setTimeout(() => {
      setShowSuccess(false)
    }, 2000)
  }

  return (
    <button
      className={clsx(
        'btn transition-all duration-200 ease-out',
        !showSuccess && 'btn-primary',
        showSuccess && 'btn-success',
      )}
      onClick={addToCart}
      type={'button'}
    >
      {showSuccess ? <CircleCheck className={'w-4 h-4 mr-2'} /> : <ShoppingCart className="w-4 h-4 mr-2" />}
      {!showSuccess && <span>In den Warenkorb</span>}
    </button>
  )
}
