export type UserProfile = {
  email: string
  firstName?: string
  lastName?: string
  image?: string
  address?: {
    street?: string
    city?: string
    zipCode?: string
  }
  phoneNumber?: string
}
