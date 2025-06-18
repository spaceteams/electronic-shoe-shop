export type Product = {
  id: string
  title: string
  brand: string
  colors: string[]
  categories: string[]
  size: number[]
  price: number
  onSale?: boolean
  salePrice?: number
  availability: string
  description: string
  materials: string[]
  sustainabilityQualifiers: string[]
}

export type ProductWithQuantity = Product & {
  quantity: number
}
