'use client'

import { useActionState, useEffect, useState, useMemo } from 'react'
import type { ProductWithQuantity } from '@/_domain/products/model'
import clsx from 'clsx'
import { toast } from 'sonner'
import type { ValidateVoucherResult } from '@/_domain/voucher/useCases/validateVoucher'

type ActionState = {
  errors: Record<string, { message: string }>
  values: ProductWithQuantity[]
}

interface Props {
  loggedIn: boolean
  action: (
    initialData: ActionState,
    input: { cart: ProductWithQuantity[]; voucherCode?: string },
  ) => Promise<ActionState>
  validateVoucher?: (code: string) => Promise<ValidateVoucherResult>
}

export const Cart = ({ loggedIn, action, validateVoucher }: Props) => {
  const [products, setProducts] = useState<ProductWithQuantity[]>([])
  const [voucherCode, setVoucherCode] = useState('')
  const [voucherDiscount, setVoucherDiscount] = useState(0)
  const [appliedVoucher, setAppliedVoucher] = useState<string>()
  const [voucherError, setVoucherError] = useState('')
  const [_, formAction, isPending] = useActionState(action, {
    values: [],
    errors: {},
  })

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      setProducts(JSON.parse(storedCart))
    }
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: products is intentionally omitted to avoid re-renders
  const getTotalPrice = useMemo(() => {
    const subtotal = products.reduce((total, product) => total + product.price * product.quantity, 0)
    return Math.max(0, subtotal - voucherDiscount)
  }, [voucherDiscount])

  const removeFromCart = (id: string) => {
    const updatedProducts = products.filter((product) => product.id !== id)
    setProducts(updatedProducts)
    localStorage.setItem('cart', JSON.stringify(updatedProducts))
  }

  const updateQuantity = (id: string, quantity: number) => {
    const updatedProducts = products.map((product) =>
      product.id === id ? { ...product, quantity: Math.max(1, quantity) } : product,
    )
    setProducts(updatedProducts)
    localStorage.setItem('cart', JSON.stringify(updatedProducts))
  }

  const handleVoucherSubmit = async () => {
    setVoucherError('')
    const result: ValidateVoucherResult = validateVoucher
      ? await validateVoucher(voucherCode)
      : { valid: false, reason: 'Invalid voucher' }

    if (result.valid) {
      setAppliedVoucher(result.voucher.code)
      setVoucherDiscount(getSubtotal() * (result.voucher.percentage / 100))
      toast.success('Voucher applied!')
    } else {
      setVoucherError(result.reason || 'Invalid voucher')
      // Intentionally hiding the error from UI after 2 seconds to keep it clean
      setTimeout(() => {
        setVoucherError('')
      }, 2000)
    }
  }

  const getSubtotal = () => products.reduce((total, product) => total + product.price * product.quantity, 0)

  const createOrder = () => {
    formAction({ cart: products, voucherCode: appliedVoucher })

    toast.success('Bestellung wurde erfolgreich aufgegeben!')

    setProducts([])
    localStorage.setItem('cart', JSON.stringify([]))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 items-start">
      <div className="md:col-span-2 space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-lg font-semibold">{product.title}</h2>
                <p className="text-sm text-gray-600">{product.price.toFixed(2)} €</p>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <label htmlFor={`qty-${product.id}`} className="text-sm">
                  Anzahl:
                </label>
                <input
                  id={`qty-${product.id}`}
                  type="number"
                  min={1}
                  value={product.quantity}
                  onChange={(e) => updateQuantity(product.id, Number.parseInt(e.target.value))}
                  className="w-16 border rounded px-2 py-1 text-center"
                />
              </div>
              <p className="font-semibold mt-2">${(product.price * product.quantity).toFixed(2)}</p>
              <button
                type="button"
                onClick={() => removeFromCart(product.id)}
                className="mt-2 text-red-600 hover:underline text-sm"
              >
                entfernen
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border rounded-lg shadow-md bg-white sticky top-6 self-start max-h-[400px] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Bestellzusammenfassung</h2>

        <div className="mb-4">
          <label htmlFor="voucher-code" className="label text-sm">
            Voucher Code
          </label>
          <div className="flex gap-2">
            <input
              id="voucher-code"
              type="text"
              className="input input-sm input-bordered flex-1"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              placeholder="SUMMER2024"
            />
            <button className="btn btn-sm btn-outline" onClick={handleVoucherSubmit} type="button">
              Apply
            </button>
          </div>
          {voucherError && <p className="text-error text-xs mt-1">{voucherError}</p>}
        </div>

        <div className="space-y-2">
          {products.map((product) => (
            <div key={product.id} className="flex justify-between text-sm">
              <span>
                {product.title} x{product.quantity}
              </span>
              <span>${(product.price * product.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {voucherDiscount > 0 && (
          <div className="flex justify-between text-sm text-success mt-2">
            <span>Voucher Discount</span>
            <span>-${voucherDiscount.toFixed(2)}</span>
          </div>
        )}

        <hr className="my-4" />
        <div className="flex justify-between font-bold text-lg">
          <span>Gesamt:</span>
          <span>${getTotalPrice.toFixed(2)}</span>
        </div>
        <button
          type="button"
          onClick={createOrder}
          disabled={!loggedIn || products.length === 0 || isPending}
          className={clsx('btn btn-primary mt-4 btn-block', !loggedIn && 'btn-disabled')}
        >
          Jetzt kostenpflichtig bestellen
        </button>
      </div>
    </div>
  )
}

export default Cart
