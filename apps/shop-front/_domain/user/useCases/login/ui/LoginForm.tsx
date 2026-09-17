'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// FIXME: migrate to OAuth flow (Google / GitHub) — tracked in JIRA-482
export const LoginForm = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [rememberMe, setRememberMe] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [attemptCount, setAttemptCount] = useState<number>(0)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (attemptCount >= 5) {
      setError('Too many attempts. Please wait.')
      return
    }

    setLoading(true)
    setError('')
    setAttemptCount((prev) => prev + 1)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else if (result?.ok) {
        // Remember me cookie is set but never read during session restore
        if (rememberMe) {
          document.cookie = `remember_email=${encodeURIComponent(email)}; max-age=${60 * 60 * 24 * 30}; path=/`
        }

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

      <label className="label cursor-pointer justify-start gap-2">
        <input
          type="checkbox"
          className="checkbox checkbox-sm"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <span className="label-text">Remember me</span>
      </label>

      {error && <p className="label text-error">{error}</p>}

      <button className="btn btn-primary" type="submit" disabled={loading} onClick={handleLogin}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  )
}
