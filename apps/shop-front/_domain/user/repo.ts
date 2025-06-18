import type { UserProfile } from '@/_domain/user/model'

export interface UserRepo {
  getUserProfile: (userId: string) => Promise<UserProfile | null>
  updateUserProfile: (userId: string, profile: UserProfile) => Promise<boolean>
}
