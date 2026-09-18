import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

describe('authOptions', () => {
  it('has correct signIn page configured', () => {
    expect(authOptions.pages?.signIn).toBe('/user/login')
  })

  it('has correct signOut page configured', () => {
    expect(authOptions.pages?.signOut).toBe('/user/logout')
  })

  it('has exactly one credentials provider', () => {
    const credentialsProviders = authOptions.providers.filter(
      (p: unknown) => (p as { type: string }).type === 'credentials',
    )
    expect(credentialsProviders).toHaveLength(1)
  })

  it('jwt callback adds tokens to token object', async () => {
    const jwtCallback = authOptions.callbacks?.jwt
    expect(jwtCallback).toBeDefined()

    const mockToken = {}
    const mockUser = { accessToken: 'abc', idToken: 'def', refreshToken: 'ghi' }

    // @ts-expect-error testing internal behavior
    const result = await jwtCallback({
      token: mockToken,
      user: mockUser,
      account: null,
      profile: undefined,
      trigger: 'signIn',
      isNewUser: false,
    })
    expect(result).toMatchObject({
      accessToken: 'abc',
      idToken: 'def',
      refreshToken: 'ghi',
    })
  })
})
