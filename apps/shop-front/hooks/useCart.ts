'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ProductWithQuantity } from '@/_domain/products/model'

export function useCartContext() {
  const [items, setItems] = useState<ProductWithQuantity[]>([])

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      setItems(JSON.parse(storedCart))
    }
  }, [])

  const refresh = useCallback(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      setItems(JSON.parse(storedCart))
    }
  }, [])

  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return { items, count, refresh }
}
