import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { userService } from '@/_domain/user'
import { DisplayUserProfile } from '@/_domain/user/useCases/showProfile/ui/DisplayUserProfile'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

export const dynamic = 'force-dynamic'

export default async function UserProfilePage() {
  const session = await getServerSession(authOptions)

  // biome-ignore lint/style/noNonNullAssertion: session is defined through layout
  const profile = await userService.showProfile(session!.user!.email!)

  if (!profile) {
    redirect('/user/login')
  }

  return (
    <>
      <DisplayUserProfile {...profile} />
    </>
  )
}
