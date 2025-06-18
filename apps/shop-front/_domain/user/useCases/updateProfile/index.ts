import type { UserRepo } from '@/_domain/user/repo'
import type { UserProfile } from '@/_domain/user/model'

type Repo = Pick<UserRepo, 'updateUserProfile'>

export const updateProfileUseCase = async (repo: Repo, userId: string, profile: UserProfile) => {
  return repo.updateUserProfile(userId, profile)
}
