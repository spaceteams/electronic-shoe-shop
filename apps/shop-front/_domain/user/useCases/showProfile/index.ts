import type { UserRepo } from '@/_domain/user/repo'

type Repo = Pick<UserRepo, 'getUserProfile'>

export const showProfileUseCase = (repo: Repo, userId: string) => {
  return repo.getUserProfile(userId)
}
