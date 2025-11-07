import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "ゲストログイン",
      credentials: {
        name: { label: "名前", type: "text", placeholder: "ゲスト" }
      },
      async authorize(credentials) {
        // 開発用の簡易ログイン（本番環境では適切な認証を実装）
        if (credentials?.name) {
          return {
            id: Math.random().toString(36).substring(7),
            name: credentials.name,
            email: null,
          }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
