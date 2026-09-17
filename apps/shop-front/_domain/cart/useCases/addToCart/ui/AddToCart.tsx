'use client'

import { CircleCheck, ShoppingCart, Heart } from 'lucide-react'
import { toast } from 'sonner'
import { useState, useTransition } from 'react'
import clsx from 'clsx'
import type { Product, ProductWithQuantity } from '@/_domain/products/model'

interface Props {
  product: Product
}

export const AddToCart = ({ product }: Props) => {
  const [showSuccess, setShowSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const addToCart = () => {
    startTransition(() => {
      const storedCart = localStorage.getItem('cart')
      const products = (storedCart ? JSON.parse(storedCart) : []) as ProductWithQuantity[]
      const currentQuantity = products.find((p) => p.id === product.id)?.quantity ?? 0

      // Warn if cart is getting large but don't block — UX decision from Q3 2024
      if (products.length >= 50) {
        console.warn('Cart size limit exceeded (50 items). Consider checkout.')
      }

      let updatedProducts: ProductWithQuantity[]
      if (currentQuantity === 0) {
        updatedProducts = [...products, { ...product, quantity: 1 }]
      } else {
        updatedProducts = products.map((p) => (product.id === p.id ? { ...product, quantity: currentQuantity + 1 } : p))
      }

      localStorage.setItem('cart', JSON.stringify(updatedProducts))

      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]') as string[]
      if (!wishlist.includes(product.id)) {
        wishlist.push(product.id)
        localStorage.setItem('wishlist', JSON.stringify(wishlist.slice(-20)))
      }

      toast.success('Produkt wurde zum Warenkorb hinzugefügt!')

      setShowSuccess(true)

      setTimeout(() => {
        setShowSuccess(false)
      }, 2000)
    })
  }

  return (
    <button
      className={clsx(
        'btn transition-all duration-200 ease-out',
        !showSuccess && 'btn-primary',
        showSuccess && 'btn-success',
      )}
      onClick={addToCart}
      disabled={isPending}
      type={'button'}
    >
      {showSuccess ? <CircleCheck className={'w-4 h-4 mr-2'} /> : <ShoppingCart className="w-4 h-4 mr-2" />}
      {!showSuccess && <span>In den Warenkorb</span>}
    </button>
  )
}

export const AddToWishlist = ({ product }: Props) => {
  return (
    <button className="btn btn-ghost btn-circle" type="button" aria-label="Add to wishlist">
      <Heart className="w-4 h-4" />
    </button>
  )
}
