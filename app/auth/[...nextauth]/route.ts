import {
  refreshToken,
  signIn,
  toSession,
  toToken,
} from "@/app/models/accounts";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials?.username || !credentials?.password) {
          return null;
        }

        return signIn({
          email: credentials?.username,
          password: credentials?.password,
        });
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (user) {
        return toToken(user);
      }

      if (new Date() < new Date(token.expiredAt)) {
        return token;
      }

      try {
        const response = await refreshToken({
          token: token.refreshToken,
        });

        return toToken(response);
      } catch (error) {
        return {
          ...token,
          error: "RefreshAccessTokenError" as const,
        };
      }
    },
    async session({ session, token }) {
      return toSession(token, session);
    },
  },
});

export { handler as GET, handler as POST };