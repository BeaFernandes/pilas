import { User } from '@prisma/client'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './../../../lib/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name:  'Act',
      credentials: {
        email: { label: 'E-mail', type: 'text', placeholder: 'E-mail' },
        password: { label: 'Senha', type: 'password', placeholder: 'Senha'  }
      },

      async authorize(credentials: Record<'email' | 'password', string>): Promise<User | null> {
          const email = credentials?.email
          const password = credentials?.password
          const bcrypt = require('bcryptjs')

          const user = await prisma.user.findUnique({
            where: {
              email
            },
            include: {
              roles: true,
              admin: true,
              mayor: true,
            }
          })

          if(!user) return null

          const matchPassword = await bcrypt.compare(password, user.passwordHash)

          if (!matchPassword) return null

          return user
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
    if (user) {
      token.user = user
    }
    return token
    },
    async session({ session, token }) {
      session.user = token.user as User
      return session
    }
  },
  /*theme: {
    brandColor: '#36A7D0',
    logo: 'https://acttecnologia.com.br/wp-content/uploads/2022/07/logo.svg',
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  }*/
}
export default NextAuth(authOptions)