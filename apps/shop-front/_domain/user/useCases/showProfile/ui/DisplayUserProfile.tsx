import type { UserProfile } from '@/_domain/user/model'
import { PenIcon } from 'lucide-react'
import Link from 'next/link'

export type ProfileProps = UserProfile

export const DisplayUserProfile = (profile: ProfileProps) => {
  return (
    <div>
      <h1 className={'text-xl'}>
        {profile.firstName} {profile.lastName}
      </h1>
      <p>Email: {profile.email}</p>
      <p>
        Address: {profile.address?.street}, {profile.address?.zipCode} {profile.address?.city}
      </p>
      <p>Phone: {profile.phoneNumber}</p>

      <Link className={'btn btn-primary btn-circle'} href={'/user/profile/edit'}>
        <PenIcon />
      </Link>
    </div>
  )
}
