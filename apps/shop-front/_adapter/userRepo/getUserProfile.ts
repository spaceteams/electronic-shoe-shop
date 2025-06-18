'use server'

import type { UserRepo } from '@/_domain/user/repo'
import z from 'zod/v4'
import { documentClient } from '@/_adapter'

const schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
    })
    .optional(),
  phoneNumber: z.string().optional(),
})

export const getUserProfile: UserRepo['getUserProfile'] = async (userId) => {
  const profileResponse = await documentClient.get({
    TableName: 'users',
    Key: {
      email: userId,
    },
  })

  if (!profileResponse.Item) {
    return null
  }

  const s = schema.safeParse(profileResponse.Item)

  if (s.error) {
    return null
  }

  return s.data
}
