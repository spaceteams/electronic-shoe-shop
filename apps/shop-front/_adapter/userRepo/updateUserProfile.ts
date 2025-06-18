'use server'

import type { UserRepo } from '@/_domain/user/repo'
import z from 'zod/v4'
import { documentClient } from '@/_adapter'

const schema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
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

export const updateUserProfile: UserRepo['updateUserProfile'] = async (userId, profile) => {
  const parsedProfile = schema.safeParse(profile)

  if (parsedProfile.error) {
    console.log('updateUserProfile error', parsedProfile.error)
    return false
  }

  await documentClient.put({
    TableName: 'users',
    Item: {
      ...parsedProfile.data,
      email: userId,
    },
  })

  return true
}
