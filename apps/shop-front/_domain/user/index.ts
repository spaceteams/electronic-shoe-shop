import { withRepo } from '@/_di'
import { getUserProfile } from '@/_adapter/userRepo/getUserProfile'
import { showProfileUseCase } from '@/_domain/user/useCases/showProfile'
import { updateProfileUseCase } from '@/_domain/user/useCases/updateProfile'
import { updateUserProfile } from '@/_adapter/userRepo/updateUserProfile'

export const userService = {
  showProfile: withRepo(showProfileUseCase, {
    getUserProfile,
  }),
  updateProfile: withRepo(updateProfileUseCase, {
    updateUserProfile,
  }),
}
