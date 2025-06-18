import type { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider'

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || 'eu-central-1',
})

export const authOptions: AuthOptions = {
  pages: {
    signIn: '/user/login',
    signOut: '/user/logout',
  },
  providers: [
    CredentialsProvider({
      name: 'cognito',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          const clientId = process.env.COGNITO_CLIENT_ID!

          const authCommand = new InitiateAuthCommand({
            ClientId: clientId,
            AuthFlow: 'USER_PASSWORD_AUTH',
            AuthParameters: {
              USERNAME: credentials.email,
              PASSWORD: credentials.password,
            },
          })

          const authResponse = await cognitoClient.send(authCommand)

          if (!authResponse.AuthenticationResult?.AccessToken) {
            return null
          }

          const getUserCommand = new GetUserCommand({
            AccessToken: authResponse.AuthenticationResult.AccessToken,
          })

          const userResponse = await cognitoClient.send(getUserCommand)

          const attributes =
            userResponse.UserAttributes?.reduce(
              (acc, attr) => {
                if (attr.Name && attr.Value) {
                  acc[attr.Name] = attr.Value
                }
                return acc
              },
              {} as Record<string, string>,
            ) || {}

          return {
            id: userResponse.Username || credentials.email,
            email: attributes.email || credentials.email,
            name: attributes.name || attributes.given_name || attributes.email,
            accessToken: authResponse.AuthenticationResult.AccessToken,
            idToken: authResponse.AuthenticationResult.IdToken,
            refreshToken: authResponse.AuthenticationResult.RefreshToken,
          }
        } catch (error) {
          console.error('Cognito authentication error:', error)

          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.accessToken = user.accessToken
        // @ts-ignore
        token.idToken = user.idToken
        // @ts-ignore
        token.refreshToken = user.refreshToken
      }
      return token
    },
    async session({ session, token }) {
      // @ts-ignore
      session.accessToken = token.accessToken
      // @ts-ignore
      session.idToken = token.idToken
      return session
    },
  },
}
