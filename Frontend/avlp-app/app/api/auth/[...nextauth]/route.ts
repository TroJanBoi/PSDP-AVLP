import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    maxPlayer?: number;
    bio?: string;
    github?: string;  // เพิ่ม github
    youtube?: string; // เพิ่ม youtube
    user?: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
      bio?: string;
      github?: string; // เพิ่ม github
      youtube?: string; // เพิ่ม youtube
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    bio: string;
    github?: string; // เพิ่ม github
    youtube?: string; // เพิ่ม youtube
    accessToken: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
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
            bio: data.user.bio,
            github: data.user.github, // เพิ่ม github ที่นี่
            youtube: data.user.youtube, // เพิ่ม youtube ที่นี่
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
        token.bio = user.bio;
        token.github = user.github; // เพิ่ม github ที่นี่
        token.youtube = user.youtube; // เพิ่ม youtube ที่นี่
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
        bio: token.bio as string,
        github: token.github as string, // เพิ่ม github ที่นี่
        youtube: token.youtube as string, // เพิ่ม youtube ที่นี่
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
