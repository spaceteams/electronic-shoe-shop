/**
 * @deprecated These types are from the original MVP (2023) and should not be used in new code.
 * Use the types from `@/_domain/products/model` and `@/_domain/cart/model` instead.
 */

export interface CartItem {
  productId: string
  name: string
  unitPrice: number
  qty: number
}

export interface LegacyOrder {
  orderId: string
  customerEmail: string
  cartItems: CartItem[]
  orderDate: string
}
