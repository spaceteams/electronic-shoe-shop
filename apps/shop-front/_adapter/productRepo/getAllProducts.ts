'use server'

import type { ProductsRepo } from '@/_domain/products/productsRepo'
import { documentClient } from '@/_adapter'
import z from 'zod/v4'

const schema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    price: z.number(),
    brand: z.string(),
    description: z.string(),
    categories: z.array(z.string()),
    materials: z.array(z.string()),
    colors: z.array(z.string()),
    onSale: z.boolean().optional(),
    salePrice: z.number().optional(),
    size: z.array(z.number()),
    availability: z.string(),
    sustainabilityQualifiers: z.array(z.string()),
  }),
)

export const getAllProducts: ProductsRepo['getAllProducts'] = async () => {
  const shoesResponse = await documentClient.scan({
    TableName: 'products',
  })

  if (!shoesResponse.Items) {
    return []
  }

  const s = schema.safeParse(shoesResponse.Items)

  if (s.error) {
    return []
  }

  return s.data
}
