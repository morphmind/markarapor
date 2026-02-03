import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@markarapor/database";

const nextAuth = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: [
            "openid",
            "email",
            "profile",
            // Google Ads
            "https://www.googleapis.com/auth/adwords",
            // Google Analytics
            "https://www.googleapis.com/auth/analytics.readonly",
            // Search Console
            "https://www.googleapis.com/auth/webmasters.readonly",
            // Google Drive & Slides & Sheets
            "https://www.googleapis.com/auth/drive.file",
            "https://www.googleapis.com/auth/presentations",
            "https://www.googleapis.com/auth/spreadsheets",
          ].join(" "),
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Create a default workspace for new users
      if (user.id && user.name) {
        const slug = user.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")
          .substring(0, 30) + "-workspace";

        await prisma.workspace.create({
          data: {
            name: `${user.name}'s Workspace`,
            slug: `${slug}-${user.id.substring(0, 8)}`,
            members: {
              create: {
                userId: user.id,
                role: "OWNER",
                joinedAt: new Date(),
              },
            },
          },
        });
      }
    },
  },
});

// Export with explicit any casts to avoid type inference issues with NextAuth v5
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlers = nextAuth.handlers as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const auth = nextAuth.auth as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const signIn = nextAuth.signIn as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const signOut = nextAuth.signOut as any;
