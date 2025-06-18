'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export const LoginForm = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else if (result?.ok) {
        router.push('/user/profile')
      }
    } catch (err) {
      console.log('Login error:', err)

      setError('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={'space-y-4'}>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Email</legend>
        <input
          type="text"
          name={'email'}
          className="input"
          placeholder="john.doe@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Password</legend>
        <input
          type="password"
          name={'password'}
          className="input"
          placeholder="your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </fieldset>

      {error && <p className="label text-error">{error}</p>}

      <button className="btn btn-primary" type="submit" disabled={loading} onClick={handleLogin}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  )
}
