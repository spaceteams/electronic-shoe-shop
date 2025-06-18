import { LoginForm } from '@/_domain/user/useCases/login/ui/LoginForm'

export const dynamic = 'force-dynamic'

export default async function UserLoginPage() {
  return (
    <>
      <LoginForm />
    </>
  )
}
