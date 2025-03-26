import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    maxPlayer?: number;
    user?: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    accessToken: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "UsernamemaxPlayer?: number;", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        });

        const data = await res.json();

        if (res.ok && data?.token) {
          return {
            id: data.user.id,
            name: data.user.username,
            email: data.user.email,
            maxPlayer: data.user.maxPlayer,
            image: data.user.image,
            accessToken: data.token,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.accessToken = user.accessToken;
        token.maxPlayer = (user as any).maxPlayer;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        image: token.image as string,
      };
      session.accessToken = token.accessToken as string;
      session.maxPlayer = token.maxPlayer as number;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
