import NextAuth, { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./../../../lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Act",
      credentials: {
        email: { label: "E-mail", type: "text", placeholder: "E-mail" },
        password: { label: "Senha", type: "password", placeholder: "Senha" },
      },

      // @ts-ignore https://stackoverflow.com/questions/74089665/next-auth-credentials-provider-authorize-type-error
      async authorize(
        credentials: Record<"email" | "password", string>
      ): Promise<Session["user"] | null> {
        const email = credentials?.email;
        const password = credentials?.password;
        const bcrypt = require("bcryptjs");

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
          include: {
            roles: true,
            admin: true,
            mayor: true,
            department: true,
          },
        });

        if (!user) return null;

        const matchPassword = await bcrypt.compare(password, user.passwordHash);

        if (!matchPassword) return null;

        const sessionUser: Session["user"] = {
          id: user.id,
          name: user.name,
          email: user.email,
          department: user.department,
          roles: user.roles,
          balance: user.balance || undefined,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          admin: user.admin || undefined,
          mayor: user.mayor || undefined,
        };

        return sessionUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as Session["user"];
      return session;
    },
  },
  /*session: {
    maxAge: 60 * 60,
  },*/
  pages: {
    signIn: '/login',
    //signOut: '/auth/signout',
    //error: '/auth/error', // Error code passed in query string as ?error=
    //verifyRequest: '/auth/verify-request', // (used for check email message)
  }
};
export default NextAuth(authOptions);
