import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
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
        
        // 1. implement sign-in logic here
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (user) {
        // 2. parse from sign in response to token
        return null
      }

      if (new Date() < new Date(token.expiredAt)) {
        return token;
      }

      try {
        // 3. implement renew token here
        return null
      } catch (error) {
        return {
          ...token,
          error: "RefreshAccessTokenError" as const,
        };
      }
    },
    async session({ session, token }) {
      // 4. parse from token to session
      return null
    },
  },
});

export { handler as GET, handler as POST };