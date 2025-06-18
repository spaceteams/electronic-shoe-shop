import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { userService } from '@/_domain/user'
import { UserProfileForm } from '@/_domain/user/useCases/updateProfile/ui/UserProfileForm'
import type { UserProfile } from '@/_domain/user/model'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

export const dynamic = 'force-dynamic'

type ActionState = {
  errors: Record<string, { message: string }>
  values: UserProfile
}

const submitForm = (userId: string) => async (_: ActionState, formData: UserProfile) => {
  'use server'

  await userService.updateProfile(userId, formData)

  return {
    values: formData,
    errors: {},
  }
}

export default async function EditUserProfilePage() {
  const session = await getServerSession(authOptions)

  // biome-ignore lint/style/noNonNullAssertion: session is defined through layout
  const profile = await userService.showProfile(session!.user!.email!)

  if (!profile) {
    redirect('/user/login')
  }

  return (
    <>
      {/* biome-ignore lint/style/noNonNullAssertion: session is defined through layout */}
      <UserProfileForm profile={profile} action={submitForm(session!.user!.email!)} />
    </>
  )
}
