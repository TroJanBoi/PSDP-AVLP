import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    token?: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password
          })
        });

        const data = await res.json();

        if (res.ok && data) {
          console.log("data", data);
          return data
        }

        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("jwt", token, user);
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      console.log("session", session, token);
      session.user = token.user as { name?: string | null; email?: string | null; image?: string | null };
      session.accessToken = (token.user as { token?: string }).token;
      return session;
    },
  },
  pages: {
    signIn: "/login"
  },
});

export { handler as GET, handler as POST };
